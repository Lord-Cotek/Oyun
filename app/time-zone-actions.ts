"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Remembering where somebody actually is.
 *
 * ── Why this is learned and never asked ──────────────────────────────────
 * Because the alternative is a dropdown of four hundred city names on a
 * settings page, which almost nobody will ever open — and the people who
 * never open it are exactly the ones whose morning note would arrive at
 * three in the morning.
 *
 * The browser already knows. It is one string, it is not a secret, and it
 * buys the one thing the morning note cannot work without.
 *
 * ── Why it is checked rather than trusted ────────────────────────────────
 * It arrives from the client, so it is a request, not a fact. Anything that
 * is not a zone this runtime recognises is dropped on the floor: the column
 * feeds Intl later, and a bad value there would throw inside the sender.
 */
export async function rememberTimeZone(zone: string): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;
  // Signed out — on the sign-in page, say. Report false so the browser knows
  // to ask again once somebody is actually signed in. Saying nothing here was
  // a real bug: the caller marked the job done on the sign-in page and never
  // told us again, so every new account ended up with no zone at all, which
  // means UTC, which is the one thing this exists to avoid.
  if (!userId) return false;

  const clean = String(zone ?? "").trim();
  if (!clean || clean.length > 64) return false;
  try {
    // The only test that matters: can the thing that will use it, use it?
    new Intl.DateTimeFormat("en-GB", { timeZone: clean }).format(new Date());
  } catch {
    return false;
  }

  try {
    // A plain write by primary key, every time.
    //
    // This used to be updateMany with `timeZone: { not: clean }`, to save a
    // write when nothing had changed. That filter matches NOTHING when the
    // column is NULL, because in SQL `NULL <> 'x'` is NULL rather than true —
    // so the one person it had to work for, somebody we had never seen and
    // whose zone was still null, was precisely the person it silently skipped.
    //
    // The saving was one row by id, once a session. Not worth a bug that only
    // shows up as a devotional arriving at three in the morning.
    await prisma.user.update({
      where: { id: userId },
      data: { timeZone: clean },
    });
    return true;
  } catch {
    // Knowing where somebody is is a convenience. It must never be the reason
    // a page fails to load. Reporting false means it is simply tried again.
    return false;
  }
}
