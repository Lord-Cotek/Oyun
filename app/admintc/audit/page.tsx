import { recentAudit } from "@/lib/admin-db";

const when = (d: Date) =>
  d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

/**
 * What was done, by whom, and to which account.
 *
 * There is no way to remove a line from here, on purpose. The point is not to
 * catch a stranger — it is so an operator can say, months later and to
 * somebody entitled to ask, exactly what was done and by whom.
 */
export default async function AdminAuditPage() {
  const lines = await recentAudit(200);
  return (
    <div>
      <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
        The last {lines.length} things done here
      </h2>
      {lines.length === 0 ? (
        <p className="mt-4 font-mono text-xs text-white/40">Nothing yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-white/10 rounded border border-white/10">
          {lines.map((l) => (
            <li key={l.id} className="px-4 py-3">
              <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/35">
                {when(l.createdAt)} · {l.actorEmail}
              </p>
              <p className="mt-1 font-mono text-xs text-white">
                {l.action}
                {l.subject && <span className="text-white/60"> · {l.subject}</span>}
              </p>
              {l.detail && (
                <p className="mt-0.5 font-mono text-[0.62rem] text-white/40">
                  {l.detail}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
