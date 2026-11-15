"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { prayingScope } from "@/lib/praying-scope";
import { LIST_CAP, NAME_MAX, REQUEST_MAX, clean } from "@/lib/praying-for";

/**
 * Keeping the list of people a family prays for by name. Only those who keep
 * the house or journey change it; only the person who added a name changes
 * its words (the same rule as everywhere else). Shared with the sibling app
 * and drift-checked.
 */

type Result = { ok: true } | { ok: false; error: string };

async function keeper() {
  const scope = await prayingScope();
  if (!scope) return { ok: false as const, error: "Please sign in again." };
  if (!scope.canKeep) return { ok: false as const, error: "Only those who keep the family's prayers can change this list." };
  return { ok: true as const, scope };
}

async function mineOrOurs(id: string) {
  const k = await keeper();
  if (!k.ok) return k;
  const row = await prisma.prayingFor.findFirst({ where: { id: String(id).slice(0, 40), ...k.scope.owner } });
  if (!row) return { ok: false as const, error: "That name is no longer on the list." };
  return { ok: true as const, scope: k.scope, row };
}

export async function addPrayingFor(fd: FormData): Promise<Result> {
  const k = await keeper();
  if (!k.ok) return { ok: false, error: k.error };
  const name = clean(fd.get("name"), NAME_MAX);
  if (!name) return { ok: false, error: "Who are we praying for? Add their name." };
  const praying = await prisma.prayingFor.count({ where: { ...k.scope.owner, answeredAt: null, stoppedAt: null } });
  if (praying >= LIST_CAP) {
    return { ok: false, error: `There are ${LIST_CAP} names already. Mark some answered or finished first.` };
  }
  await prisma.prayingFor.create({
    data: {
      ...k.scope.owner,
      addedById: k.scope.userId,
      name,
      request: clean(fd.get("request"), REQUEST_MAX),
      withCircle: fd.get("withCircle") === "on",
    },
  });
  revalidatePath("/worship");
  return { ok: true };
}

export async function editPrayingFor(fd: FormData): Promise<Result> {
  const m = await mineOrOurs(String(fd.get("id") ?? ""));
  if (!m.ok) return { ok: false, error: m.error };
  if (m.row.addedById !== m.scope.userId) {
    return { ok: false, error: "Only the person who added this name can change its words." };
  }
  const name = clean(fd.get("name"), NAME_MAX);
  if (!name) return { ok: false, error: "A name is needed." };
  await prisma.prayingFor.update({
    where: { id: m.row.id },
    data: { name, request: clean(fd.get("request"), REQUEST_MAX), withCircle: fd.get("withCircle") === "yes" },
  });
  revalidatePath("/worship");
  return { ok: true };
}

export async function answerPrayingFor(fd: FormData): Promise<Result> {
  const m = await mineOrOurs(String(fd.get("id") ?? ""));
  if (!m.ok) return { ok: false, error: m.error };
  await prisma.prayingFor.update({
    where: { id: m.row.id },
    data: { answeredAt: new Date(), answerNote: clean(fd.get("note"), REQUEST_MAX), stoppedAt: null },
  });
  revalidatePath("/worship");
  return { ok: true };
}

export async function stopPrayingFor(id: string): Promise<Result> {
  const m = await mineOrOurs(id);
  if (!m.ok) return { ok: false, error: m.error };
  await prisma.prayingFor.update({ where: { id: m.row.id }, data: { stoppedAt: new Date() } });
  revalidatePath("/worship");
  return { ok: true };
}

export async function resumePrayingFor(id: string): Promise<Result> {
  const m = await mineOrOurs(id);
  if (!m.ok) return { ok: false, error: m.error };
  await prisma.prayingFor.update({
    where: { id: m.row.id },
    data: { stoppedAt: null, answeredAt: null, answerNote: null },
  });
  revalidatePath("/worship");
  return { ok: true };
}

export async function removePrayingFor(id: string): Promise<Result> {
  const m = await mineOrOurs(id);
  if (!m.ok) return { ok: false, error: m.error };
  if (m.row.addedById !== m.scope.userId) {
    return { ok: false, error: "Only the person who added this name can remove it for good." };
  }
  await prisma.prayingFor.delete({ where: { id: m.row.id } });
  revalidatePath("/worship");
  return { ok: true };
}
