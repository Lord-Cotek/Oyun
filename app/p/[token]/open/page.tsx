import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { liveShare } from "@/lib/post-share-db";
import { inAppPath, signInToOpen, visitorPath } from "@/lib/share-open";

/**
 * The door marked "already in Oyun?", and the only thing behind it.
 *
 * This page renders nothing. It asks who is here and sends them on, and it
 * exists so that the question is asked AFTER sign-in rather than before it.
 * See openPath in lib/share-open.ts for why the trip comes back here instead
 * of carrying `#post-…` through NextAuth and hoping.
 *
 * Four people arrive and all four leave somewhere sensible:
 *
 *   in this family            the post, in the app
 *   signed out                sign in, then back here, then one of the others
 *   signed in, not family     the page for visitors, which is theirs
 *   link closed or ran out    the page for visitors, which says so
 *
 * ── A closed link stays closed, including for the family ─────────────────
 * It would be easy to argue the other way — a member never needed the link to
 * see their own family's post. But the token is the only thing that says WHICH
 * post, and the share row is how we read it. Honouring a revoked token here
 * would make this route the one way back into a link the family deliberately
 * closed, which is precisely the promise the Close button makes.
 */
export const dynamic = "force-dynamic";

/** Noindex, like the page it belongs to. The token is in the address. */
export async function generateMetadata(): Promise<Metadata> {
  return { title: "Opening…", robots: { index: false, follow: false } };
}

export default async function OpenInApp({
  params,
}: {
  params: { token: string };
}) {
  const share = await liveShare(params.token);
  if (!share) redirect(visitorPath(params.token));

  const session = await auth();
  if (!session?.user?.id) redirect(signInToOpen(params.token));

  const path = await inAppPath(share, session.user.id);
  redirect(path ?? visitorPath(params.token));
}
