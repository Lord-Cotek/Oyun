"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { notify } from "@/lib/notify";
import { MilestoneKind } from "@prisma/client";

/**
 * The "birth moment" — one step that ties everything together:
 * records the actual birth date (correcting the timeline), creates a profile
 * for each baby, logs the BIRTH milestone, and — if chosen — tells the circle.
 *
 * Either of the two of them may record it: on the day, he is often the one
 * holding the phone. It happens once — a second tap, by either of them,
 * finds it already done rather than making a second set of children — and
 * the due date it replaces is kept as `originalDueDate`.
 */
export async function recordBirth(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/journey");
  const active = await getActiveMembership(session.user.id);
  if (!active || (active.role !== "MOTHER" && active.role !== "PARTNER")) redirect("/journey");

  const journeyId = active.journey.id;
  const dateStr = String(formData.get("birthDate") ?? "").trim();
  if (!dateStr) throw new Error("Please enter the birth date.");
  const birthDate = new Date(dateStr);
  if (Number.isNaN(birthDate.getTime())) throw new Error("That date isn't valid.");

  const babyCount = Math.max(1, active.journey.babyCount);
  const names: string[] = [];
  for (let i = 0; i < babyCount; i++) {
    const n = String(formData.get(`name${i}`) ?? "").trim();
    if (n) names.push(n);
  }
  const share = String(formData.get("share") ?? "") === "on";

  const already = await prisma.milestone.count({ where: { journeyId, kind: MilestoneKind.BIRTH } });
  if (already > 0) redirect("/journey?born=1");

  await prisma.$transaction([
    // The due date doubles as the pivot — set it to the true arrival so the
    // journey's month count is accurate from here on.
    prisma.journey.update({
      where: { id: journeyId },
      data: {
        dueDate: birthDate,
        // Only the first time: the original date is the one she was given.
        ...(active.journey.originalDueDate ? {} : { originalDueDate: active.journey.dueDate }),
        babyName: names[0] ?? active.journey.babyName,
      },
    }),
    prisma.milestone.create({
      data: { journeyId, kind: MilestoneKind.BIRTH, occurredAt: birthDate },
    }),
    ...names.map((name) =>
      prisma.child.create({
        data: { journeyId, name, birthDate },
      }),
    ),
  ]);

  if (share) {
    const who = names.length
      ? names.join(" & ")
      : babyCount > 1
        ? "The babies"
        : "The baby";
    const others = await prisma.membership.findMany({
      where: { journeyId, userId: { not: session.user.id } },
      select: { userId: true },
    });
    await Promise.all(
      others.map((m) =>
        notify({
          userId: m.userId,
          type: "invite_accepted",
          title: `${who} ${names.length > 1 ? "have" : "has"} arrived! 🎉`,
          body: "Rejoice and give thanks — a new life is here.",
          href: "/journey",
          email: true,
        }),
      ),
    );
  }

  revalidatePath("/journey");
  revalidatePath("/child");
  revalidatePath("/care");
  redirect("/journey?born=1");
}

/** Verses a family might choose to welcome a child with. */
export async function birthVerses(): Promise<{ ref: string; text: string }[]> {
  return BIRTH_VERSES;
}
const BIRTH_VERSES = [
  { ref: "Psalm 139:14", text: "I will give thanks to you, for I am fearfully and wonderfully made." },
  { ref: "Psalm 127:3", text: "Behold, children are a heritage of the Lord. The fruit of the womb is his reward." },
  { ref: "1 Samuel 1:27", text: "I prayed for this child, and the LORD has given me my petition which I asked of him." },
  { ref: "Jeremiah 1:5", text: "Before I formed you in the womb, I knew you." },
  { ref: "Numbers 6:24", text: "The Lord bless you, and keep you." },
];

/**
 * The news, in their own words: a welcome with the name, the day, a verse
 * and (if they like) a photograph — posted to Life for the circle, where it
 * can be shared further by a private link with "Share outside". Once only:
 * it is the birth's own post, and a second tap finds the first.
 */
export async function announceBirth(
  formData: FormData,
): Promise<{ ok: true; postId: string } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Please sign in again." };
  const active = await getActiveMembership(session.user.id);
  if (!active || (active.role !== "MOTHER" && active.role !== "PARTNER")) {
    return { ok: false, error: "Only the two of you can announce the birth." };
  }
  const journeyId = active.journey.id;
  const birth = await prisma.milestone.findFirst({
    where: { journeyId, kind: MilestoneKind.BIRTH },
    orderBy: { occurredAt: "desc" },
    select: { id: true, occurredAt: true, postId: true },
  });
  if (!birth) return { ok: false, error: "Record the birth first." };
  if (birth.postId) {
    const still = await prisma.post.findFirst({ where: { id: birth.postId, journeyId }, select: { id: true } });
    if (still) return { ok: true, postId: still.id };
  }

  const names = String(formData.get("names") ?? "").trim().slice(0, 120);
  const verse = BIRTH_VERSES.find((v) => v.ref === String(formData.get("verse") ?? ""));
  const message = String(formData.get("message") ?? "").trim().slice(0, 1000);
  const photoUrl = String(formData.get("photoUrl") ?? "").trim();
  const day = birth.occurredAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  const body = [
    names ? `Welcome, ${names}! 💛` : "Our baby is here! 💛",
    `Born on ${day}.`,
    verse ? `“${verse.text}” — ${verse.ref}` : null,
    message || null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const { postWithId } = await import("@/app/life/actions");
  const made = await postWithId({ kind: "MILESTONE", body, mediaUrls: photoUrl.startsWith("https://") ? [photoUrl] : [] });
  if (!made) return { ok: false, error: "That did not post. Try again in a moment." };
  await prisma.milestone.update({ where: { id: birth.id }, data: { postId: made.id } });
  revalidatePath("/journey");
  revalidatePath("/life");
  return { ok: true, postId: made.id };
}
