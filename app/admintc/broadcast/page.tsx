import { listBroadcasts } from "@/lib/admin-db";
import { audienceCount } from "@/lib/broadcast";
import { BroadcastDesk } from "@/components/admin/BroadcastDesk";

const when = (d: Date) =>
  d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

/**
 * One email, to everybody.
 *
 * The counts are worked out here and shown before anything is written, so
 * the operator is choosing an audience with a number attached rather than a
 * word.
 */
export default async function AdminBroadcastPage() {
  const [rows, optedIn, all] = await Promise.all([
    listBroadcasts(),
    audienceCount("OPTED_IN"),
    audienceCount("ALL"),
  ]);

  return (
    <BroadcastDesk
      optedIn={optedIn}
      all={all}
      rows={rows.map((r) => ({
        id: r.id,
        subject: r.subject,
        body: r.body,
        audience: r.audience,
        createdBy: r.createdBy,
        created: when(r.createdAt),
        started: r.startedAt ? when(r.startedAt) : null,
        finished: r.finishedAt ? when(r.finishedAt) : null,
        sentCount: r.sentCount,
        failedCount: r.failedCount,
      }))}
    />
  );
}
