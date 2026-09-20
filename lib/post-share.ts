/**
 * Sharing one post with somebody outside the app.
 *
 * ── The third ring ───────────────────────────────────────────────────────
 * A post already has two audiences, decided in lib/post-visibility.ts: the
 * family only, or the whole circle. This is the third and last one — ANYONE
 * WITH THE LINK — and it is different in kind from the other two, because it
 * is the only one that reaches people the family has not chosen one by one.
 *
 * Everything in this file exists to keep that difference honest:
 *
 *   — It is never a default. A post has no link until somebody makes one.
 *   — A family-only post can never have one. That promise is absolute, and
 *     `canSharePost` is where it is kept.
 *   — It shows ONE post. Not the diary, not the journey, not the family's
 *     other photographs. See getSharedPost in lib/post-share-db.ts, which is
 *     the boundary and selects field by field.
 *   — It can be taken back, and by default it runs out on its own.
 *
 * ── Why the link expires by default ──────────────────────────────────────
 * Because an unguessable address is not a private one. The moment a link is
 * in a WhatsApp message it can be forwarded, screenshotted and kept, and the
 * family have no way to know. Nothing can undo that. What CAN be done is make
 * the window small unless somebody deliberately chooses otherwise — so the
 * default is thirty days and "keep it open" is a decision, not an oversight.
 *
 * ── Why the words live here and not in the components ────────────────────
 * Three surfaces say something about this: the sheet the family shares from,
 * the page the guest opens, and the card that appears in WhatsApp. If they
 * describe the same thing in three slightly different ways, the family cannot
 * tell what they have actually agreed to. One set of words, used by all three.
 */

/** How long a link lives unless somebody says otherwise. */
export const SHARE_DAYS_DEFAULT = 30;

/** The choices offered when making a link. */
export const SHARE_WINDOWS = [
  { days: 7, label: "A week" },
  { days: SHARE_DAYS_DEFAULT, label: "30 days" },
  { days: 0, label: "Until I close it" },
] as const;

export const SHARE_WORDS = {
  /**
   * Said to the family, at the moment of sharing, before they send anything.
   *
   * It does not promise that the link is private, because it is not, and an
   * app that implies otherwise has told somebody their baby's photograph is
   * safer than it is. It says the true thing instead, in one sentence, and
   * lets them decide.
   */
  warning:
    "Anyone who opens this link can see this post. They will be asked to keep it to themselves — but a link can be forwarded, so send it only to people you would trust with the photograph itself.",

  /** The heading on the note the guest reads. */
  trustTitle: "This was shared with you, not published.",

  /**
   * Said to the guest, above the post, every time.
   *
   * ── Why it is at the top and not the bottom ────────────────────────────
   * Because it is asking for something, and a request that arrives after
   * somebody has already seen, saved and forwarded the picture is not a
   * request, it is a complaint. It reads as a welcome rather than a warning
   * on purpose: people extend more care to something they have been trusted
   * with than to something they have been cautioned about.
   */
  trustBody: (who: string) =>
    `${who} chose to send this one moment to you. Please keep it that way — don${"’"}t forward the link or save the pictures anywhere else. If there is someone else who should see it, ask ${who} to send it to them.`,

  /** Under the post, closing the same thought. */
  trustFoot:
    "One post, shared on purpose. There is nothing else here to look at, and the link may be closed at any time.",

  /** When the link has been revoked or has run out. */
  goneTitle: "This link has been closed.",
  goneBody:
    "The family who shared this have closed the link, or it has run its time. Nothing is wrong — this is what is meant to happen. If you should still see it, ask them for a new one.",
} as const;

/** What `canSharePost` needs to know about a post. */
export interface ShareablePost {
  authorId: string;
  familyOnly: boolean;
}

/**
 * May this person put this post on a public link?
 *
 * Two answers, and the first is the important one.
 *
 * A FAMILY-ONLY POST: never, by anybody, including the person who wrote it.
 * The audience switch is a promise that the post stays inside the house, and a
 * share button that could quietly overrule it would make that promise a lie.
 * Somebody who wants to share it must first change its audience, deliberately,
 * on the post — which is a separate act they can see themselves taking.
 *
 * OTHERWISE: whoever keeps the house, and whoever wrote the post. Deliberately
 * NOT everyone in the circle: a cousin with a FAMILY role is welcome to see
 * the announcement and has no business deciding it goes on an address a
 * stranger can open. If that turns out to be too tight for real families, it
 * is this function that changes, and only this one.
 *
 * ── Why a boolean and not a role ─────────────────────────────────────────
 * The two apps do not agree about what the keepers of a house are called —
 * Oyun has MOTHER and PARTNER, Ìdílé has PARENT, GUARDIAN and HEAD — and this
 * file is shared between them. A list of six role names here would be a copy
 * of two role systems that would drift the first time either one gained a
 * role. So each app answers that question with its own `isHousehold` or
 * `isManager`, which are already the single source of truth for it, and hands
 * the answer in.
 */
export function canSharePost(
  /** From the app's own isHousehold / isManager. */
  isKeeper: boolean,
  post: ShareablePost,
  viewerId: string,
): boolean {
  if (post.familyOnly) return false;
  if (post.authorId === viewerId) return true;
  return isKeeper;
}

export interface ShareLike {
  expiresAt: Date | string | null;
  revokedAt: Date | string | null;
}

/** Is this link still worth anything? */
export function shareIsLive(s: ShareLike, now: Date = new Date()): boolean {
  if (s.revokedAt) return false;
  if (!s.expiresAt) return true;
  return new Date(s.expiresAt).getTime() > now.getTime();
}

/** Where a link points. Relative, so it works on any deployment. */
export function sharePath(token: string): string {
  return `/p/${token}`;
}

/**
 * "Closes in 12 days", "Closes today", "Open until you close it".
 *
 * Whole days, because an exact hour on a link that lives for a month is
 * precision nobody asked for and nobody can act on.
 */
export function shareWindowLabel(
  s: ShareLike,
  now: Date = new Date(),
): string {
  if (s.revokedAt) return "Closed";
  if (!s.expiresAt) return "Open until you close it";
  const ms = new Date(s.expiresAt).getTime() - now.getTime();
  if (ms <= 0) return "Closed";
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000));
  if (days <= 1) return "Closes today";
  return `Closes in ${days} days`;
}

/** The date a window of `days` ends, or null for "until I close it". */
export function expiryFor(days: number, from: Date = new Date()): Date | null {
  if (!days || days <= 0) return null;
  return new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
}

/** "seen 14 times" — said plainly, and only to the family. */
export function seenLabel(views: number): string {
  if (views === 0) return "Not opened yet";
  if (views === 1) return "Opened once";
  return `Opened ${views} times`;
}
