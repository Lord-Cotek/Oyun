import { getPublicInvitation, inviteUrl } from "@/lib/invitations-db";
import { icsFilename, toIcs } from "@/lib/invitations";

export const dynamic = "force-dynamic";

/**
 * The invitation as a file a phone will put into its own calendar.
 *
 * This is the difference between a reply and an attendance. Somebody says yes
 * on a Tuesday from a bus; what gets them to the door on the Saturday is the
 * thing that went into the calendar they actually look at.
 *
 * Served as `text/calendar` with a filename, so iOS and Android both offer to
 * add it rather than showing it as text. See `toIcs` for the one genuinely
 * subtle part — the times go out floating, not as UTC.
 */
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const i = await getPublicInvitation(params.slug);
  if (!i || i.event.cancelled) {
    return new Response("Not found", { status: 404 });
  }
  /**
   * A day that is still being decided has no day to hand out.
   *
   * The event carries a placeholder — the earliest day being offered — because
   * the diary has to hang on something. The page knows that and hides the
   * button, but this route is a public URL and the page is not a wall. Serving
   * the placeholder here would put a date in somebody's calendar that nobody
   * has chosen, and they would turn up on it.
   */
  if (i.poll) {
    return new Response(
      "The day has not been settled yet. Open the invitation and choose which days suit you.",
      { status: 409, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  const body = toIcs({
    // Stable, so adding it twice updates the same entry instead of making a
    // second one in somebody's calendar.
    uid: `oyun-invite-${i.slug}@cotek.app`,
    prodId: "-//COTEK//Oyun//EN",
    title: i.event.title,
    at: i.event.at,
    hasTime: i.event.hasTime,
    endsAt: i.event.endsAt,
    where: i.event.where,
    description: [i.message, `From ${i.hostName}`].filter(Boolean).join("\n\n"),
    url: inviteUrl(i.slug),
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${icsFilename(i.event.title)}"`,
      // An invitation can be edited after it is sent, so nothing caches this.
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
