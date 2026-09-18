"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { newSlug } from "@/lib/registry-db";
import { readLink, type LinkPreview } from "@/lib/link-preview";
import {
  canKeepRegistry,
  canTakeMoney,
  isItemKind,
  PAY_DETAILS_MAX,
  PAY_LABEL_MAX,
  PAY_NOTE_MAX,
  HOST_MAX,
  ITEMS_MAX,
  MESSAGE_MAX,
  NOTE_MAX,
  PRICE_MAX,
  QUANTITY_MAX,
  TITLE_MAX,
} from "@/lib/registry";

type Result = { ok: true } | { ok: false; error: string };

/**
 * Every action here belongs to the two who keep the journey.
 *
 * The circle is who the registry is FOR — a list a grandmother could quietly
 * edit is a list nobody trusts. They get the public page like everybody else.
 * Checked here and not only in the page, because a server action is reachable
 * without a page in front of it.
 */
async function keeper() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/registry");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!canKeepRegistry(active.role)) redirect("/journey");
  return { userId: session.user.id, journeyId: active.journey.id };
}

/** The registry for this journey, or nothing — never somebody else's. */
async function mine(journeyId: string) {
  return prisma.registry.findUnique({
    where: { journeyId },
    select: { id: true, slug: true, closedAt: true, payDetails: true },
  });
}

const clean = (v: FormDataEntryValue | null, max: number): string =>
  String(v ?? "").trim().slice(0, max);

function refresh(): void {
  revalidatePath("/registry");
  revalidatePath("/journey");
}

// ── The registry itself ───────────────────────────────────────────────────

export async function createRegistry(formData: FormData): Promise<Result> {
  const { journeyId } = await keeper();
  const title = clean(formData.get("title"), TITLE_MAX);
  const hostName = clean(formData.get("hostName"), HOST_MAX);
  if (!title) return { ok: false, error: "Give it a name first." };
  if (!hostName) return { ok: false, error: "Say who it is from." };

  const existing = await mine(journeyId);
  if (existing) return { ok: true };

  await prisma.registry.create({
    data: {
      journeyId,
      slug: newSlug(),
      title,
      hostName,
      message: clean(formData.get("message"), MESSAGE_MAX) || null,
    },
  });
  refresh();
  return { ok: true };
}

export async function updateRegistry(formData: FormData): Promise<Result> {
  const { journeyId } = await keeper();
  const r = await mine(journeyId);
  if (!r) return { ok: false, error: "There is no registry yet." };

  const title = clean(formData.get("title"), TITLE_MAX);
  const hostName = clean(formData.get("hostName"), HOST_MAX);
  if (!title || !hostName) {
    return { ok: false, error: "A name and who it is from, please." };
  }
  await prisma.registry.update({
    where: { id: r.id },
    data: {
      title,
      hostName,
      message: clean(formData.get("message"), MESSAGE_MAX) || null,
    },
  });
  refresh();
  return { ok: true };
}

/**
 * Her own transfer details — the whole of the money feature.
 *
 * What this is: three strings she typed, shown to a guest who asks for them.
 * A guest sends money to her the way they always would.
 *
 * What this is NOT, and must never quietly become: a payment. Nothing here
 * talks to a bank, takes a card, holds a balance or moves a penny. The day it
 * did, this would stop being a family app and become a regulated payments
 * product in every country it runs in — licensing, know-your-customer,
 * chargebacks, somebody's money sitting in an account that is not theirs.
 * That is a decision to take deliberately, with lawyers, and not one to
 * arrive at by adding a field.
 *
 * Clearing the details is allowed at any moment and takes the offer down with
 * them: cash cards stop offering anything the instant there is nothing to
 * offer.
 */
export async function setPayDetails(formData: FormData): Promise<Result> {
  const { journeyId } = await keeper();
  const r = await mine(journeyId);
  if (!r) return { ok: false, error: "There is no registry yet." };

  const details = clean(formData.get("payDetails"), PAY_DETAILS_MAX);
  const label = clean(formData.get("payLabel"), PAY_LABEL_MAX);
  if (details && !label) {
    return { ok: false, error: "Say what sort of transfer it is." };
  }
  await prisma.registry.update({
    where: { id: r.id },
    data: {
      payLabel: details ? label : null,
      payDetails: details || null,
      payNote: details ? clean(formData.get("payNote"), PAY_NOTE_MAX) || null : null,
    },
  });
  refresh();
  return { ok: true };
}

/**
 * The surprise.
 *
 * Off, she is not shown who has taken what. It gives way when the registry is
 * closed — by then she is writing thank-you notes and needs the list. See
 * claimsVisibleToHost in lib/registry.ts.
 */
export async function setShowClaims(show: boolean): Promise<Result> {
  const { journeyId } = await keeper();
  const r = await mine(journeyId);
  if (!r) return { ok: false, error: "There is no registry yet." };
  await prisma.registry.update({
    where: { id: r.id },
    data: { showClaims: show },
  });
  refresh();
  return { ok: true };
}

/**
 * Closing it, and opening it again.
 *
 * Closing stops the page taking claims; it does not take the page down.
 * Somebody will follow that link a year later wondering what they gave, and a
 * dead link is a worse answer than a finished list.
 */
export async function setClosed(closed: boolean): Promise<Result> {
  const { journeyId } = await keeper();
  const r = await mine(journeyId);
  if (!r) return { ok: false, error: "There is no registry yet." };
  await prisma.registry.update({
    where: { id: r.id },
    data: { closedAt: closed ? new Date() : null },
  });
  refresh();
  return { ok: true };
}

// ── The items ─────────────────────────────────────────────────────────────

/**
 * Read a pasted link, so the form can fill itself in.
 *
 * Deliberately its own action rather than part of adding: she pastes, sees
 * what came back, corrects the name the shop got wrong, and only then adds.
 * The fetch and all its guards live in lib/link-preview.ts.
 */
export async function previewLink(url: string): Promise<LinkPreview> {
  await keeper();
  return readLink(url);
}

export async function addItem(input: {
  kind: string;
  title: string;
  note?: string;
  url?: string;
  imageUrl?: string;
  price?: string;
  quantity?: number;
  mostNeeded?: boolean;
}): Promise<Result> {
  const { journeyId } = await keeper();
  const r = await mine(journeyId);
  if (!r) return { ok: false, error: "There is no registry yet." };

  const title = (input.title ?? "").trim().slice(0, TITLE_MAX);
  if (!title) return { ok: false, error: "What is it called?" };
  const kind = isItemKind(input.kind) ? input.kind : "THING";
  // A "give money" card with nowhere to send it is a dead end dressed up as
  // a gift. Checked here as well as hidden in the form, because a form is not
  // a wall.
  if (kind === "CASH" && !canTakeMoney(r)) {
    return {
      ok: false,
      error: "Add how somebody can send money to you first.",
    };
  }

  const count = await prisma.registryItem.count({ where: { registryId: r.id } });
  if (count >= ITEMS_MAX) {
    return {
      ok: false,
      error: `A registry holds ${ITEMS_MAX} things. Take something off first?`,
    };
  }

  await prisma.registryItem.create({
    data: {
      registryId: r.id,
      kind,
      title,
      note: (input.note ?? "").trim().slice(0, NOTE_MAX) || null,
      url: safeUrl(input.url),
      // Only ever what our own reader returned, and only http(s) — this ends
      // up in an <img> on a public page.
      imageUrl: safeUrl(input.imageUrl),
      price: (input.price ?? "").trim().slice(0, PRICE_MAX) || null,
      quantity: clampQuantity(input.quantity),
      mostNeeded: input.mostNeeded === true,
      position: count,
    },
  });
  refresh();
  return { ok: true };
}

export async function updateItem(input: {
  id: string;
  title: string;
  note?: string;
  price?: string;
  quantity?: number;
}): Promise<Result> {
  const { journeyId } = await keeper();
  const r = await mine(journeyId);
  if (!r) return { ok: false, error: "There is no registry yet." };
  const title = (input.title ?? "").trim().slice(0, TITLE_MAX);
  if (!title) return { ok: false, error: "It needs a name." };

  await prisma.registryItem.updateMany({
    where: { id: input.id, registryId: r.id },
    data: {
      title,
      note: (input.note ?? "").trim().slice(0, NOTE_MAX) || null,
      price: (input.price ?? "").trim().slice(0, PRICE_MAX) || null,
      quantity: clampQuantity(input.quantity),
    },
  });
  refresh();
  return { ok: true };
}

export async function setMostNeeded(
  id: string,
  most: boolean,
): Promise<Result> {
  const { journeyId } = await keeper();
  const r = await mine(journeyId);
  if (!r) return { ok: false, error: "There is no registry yet." };
  await prisma.registryItem.updateMany({
    where: { id, registryId: r.id },
    data: { mostNeeded: most },
  });
  refresh();
  return { ok: true };
}

/**
 * Taking something off.
 *
 * If somebody has already said they are getting it, this says so and refuses
 * — deleting it would leave a person holding a cot nobody asked for, and the
 * cascade would take the record of who was getting it with it. She can close
 * the registry, or ask them.
 */
export async function removeItem(id: string): Promise<Result> {
  const { journeyId } = await keeper();
  const r = await mine(journeyId);
  if (!r) return { ok: false, error: "There is no registry yet." };

  const item = await prisma.registryItem.findFirst({
    where: { id, registryId: r.id },
    select: { id: true, _count: { select: { claims: true } } },
  });
  if (!item) return { ok: false, error: "That is not on this list." };
  if (item._count.claims > 0) {
    return {
      ok: false,
      error:
        "Somebody is already getting this. Have a word with them before it comes off.",
    };
  }
  await prisma.registryItem.delete({ where: { id: item.id } });
  refresh();
  return { ok: true };
}

/** Move one item up or down the list. */
export async function moveItem(id: string, dir: "up" | "down"): Promise<Result> {
  const { journeyId } = await keeper();
  const r = await mine(journeyId);
  if (!r) return { ok: false, error: "There is no registry yet." };

  const items = await prisma.registryItem.findMany({
    where: { registryId: r.id },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });
  const at = items.findIndex((i) => i.id === id);
  if (at < 0) return { ok: false, error: "That is not on this list." };
  const to = dir === "up" ? at - 1 : at + 1;
  if (to < 0 || to >= items.length) return { ok: true };

  const reordered = [...items];
  [reordered[at], reordered[to]] = [reordered[to], reordered[at]];
  // Rewritten in full rather than swapping two rows: positions drift as
  // things are added and removed, and one pass leaves them honest.
  await prisma.$transaction(
    reordered.map((it, i) =>
      prisma.registryItem.update({ where: { id: it.id }, data: { position: i } }),
    ),
  );
  refresh();
  return { ok: true };
}

/** Ticking off a thank-you. Hers alone, and only on her own registry. */
export async function setThanked(
  claimId: string,
  thanked: boolean,
): Promise<Result> {
  const { journeyId } = await keeper();
  const r = await mine(journeyId);
  if (!r) return { ok: false, error: "There is no registry yet." };
  await prisma.registryClaim.updateMany({
    where: { id: claimId, item: { registryId: r.id } },
    data: { thankedAt: thanked ? new Date() : null },
  });
  refresh();
  return { ok: true };
}

// ── Small guards ──────────────────────────────────────────────────────────

function clampQuantity(n: number | undefined): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(QUANTITY_MAX, Math.max(1, Math.trunc(n as number)));
}

/**
 * A URL fit to put on a public page.
 *
 * Both of these end up in an href or an <img src> that a stranger's browser
 * will follow, so `javascript:` and `data:` are turned away here as well as
 * in the reader — this one takes whatever the form posts, and a form is not
 * a wall.
 */
function safeUrl(raw: string | undefined): string | null {
  const v = (raw ?? "").trim();
  if (!v) return null;
  try {
    const u = new URL(v);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.toString().slice(0, 2000);
  } catch {
    return null;
  }
}
