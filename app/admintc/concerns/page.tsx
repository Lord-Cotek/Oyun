import { listConcerns } from "@/lib/admin-db";
import { concernLabel, isUrgent } from "@/lib/concerns";
import { ConcernQueue } from "@/components/admin/ConcernQueue";

const when = (d: Date) =>
  d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

/**
 * Who has written to us, and what is still waiting.
 *
 * Defaults to what is waiting rather than to everything, because a queue that
 * opens on its own history is a queue nobody works through.
 */
export default async function AdminConcernsPage({
  searchParams,
}: {
  searchParams: { state?: string };
}) {
  const asked = searchParams.state ?? "OPEN";
  const state = asked === "all" ? "" : asked;
  const rows = await listConcerns(state || null, 100);

  // Urgent first within the list the operator is looking at; otherwise the
  // frightened message sits under a week of "the button is the wrong colour".
  const items = [...rows].sort((a, b) => {
    const ua = isUrgent(a.kind) && a.state === "OPEN" ? 0 : 1;
    const ub = isUrgent(b.kind) && b.state === "OPEN" ? 0 : 1;
    if (ua !== ub) return ua - ub;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div>
      <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
        People who have written to us
      </h2>
      <div className="mt-3">
        <ConcernQueue
          state={state}
          items={items.map((c) => ({
            id: c.id,
            email: c.email,
            kindLabel: concernLabel(c.kind),
            urgent: isUrgent(c.kind),
            said: c.said,
            state: c.state,
            created: when(c.createdAt),
            handledBy: c.handledBy,
            handled: c.handledAt ? when(c.handledAt) : null,
            outcome: c.outcome,
          }))}
        />
      </div>
    </div>
  );
}
