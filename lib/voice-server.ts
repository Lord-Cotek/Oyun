import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { voiceOf, type Voice } from "@/lib/voice";

/**
 * The server's ways of asking someone's voice — see lib/voice.ts. Kept apart
 * from it because lib/voice.ts is also read by client components (the
 * choice at sign-up and in Settings), and those must never pull the database
 * or the session into a browser bundle.
 */

/** The voice of whoever is signed in, from the session (see lib/auth.ts). */
export async function myVoice(): Promise<Voice> {
  const session = await auth();
  return voiceOf(session?.user?.voice);
}

/** The voice of someone else — for emails, pushes and morning notes. */
export async function voiceOfUser(userId: string): Promise<Voice> {
  const u = await prisma.user
    .findUnique({ where: { id: userId }, select: { voice: true } })
    .catch(() => null);
  return voiceOf(u?.voice);
}
