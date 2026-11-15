import { healthSnapshot } from "@/lib/health";

export const dynamic = "force-dynamic";

const when = (d: Date | null | undefined) =>
  d ? d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC" : "never";

function ago(d: Date | null | undefined, now: number): string {
  if (!d) return "never";
  const m = Math.round((now - d.getTime()) / 60_000);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.round(h / 24)} days ago`;
}

const H2 = "font-mono text-[0.62rem] uppercase tracking-widest text-white/40";
const BOX = "rounded border border-white/10 bg-[#141416]";

/**
 * Is everything working? One page that answers it before a family has to.
 *
 * Jobs: when each last ran and how it ended, and whether it is overdue.
 * Email: how much went and how much the provider refused, by kind, this
 * week. The assistant: how much it is used. Errors: what broke, grouped,
 * newest first. Counts and messages only — nothing anybody wrote.
 */
export default async function HealthPage() {
  const h = await healthSnapshot();
  const now = Date.now();
  const sent = h.email.reduce((a, e) => a + e.sent, 0);
  const failed = h.email.reduce((a, e) => a + e.failed, 0);

  return (
    <div className="space-y-10">
      <section>
        <h2 className={H2}>Scheduled jobs</h2>
        <ul className="mt-3 divide-y divide-white/10 rounded border border-white/10">
          {h.jobs.map((j) => {
            const bad = j.stale || j.last?.ok === false;
            return (
              <li key={j.job} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-mono text-sm text-white">{j.label}</p>
                  <p className="mt-1 font-mono text-[0.62rem] text-white/45">
                    Last run {ago(j.last?.startedAt, now)} ({when(j.last?.startedAt)})
                    {j.last?.more ? " · stopped for time; the sweep finishes it" : ""}
                  </p>
                  {j.last?.ok === false && j.last.error && (
                    <p className="mt-1 break-words font-mono text-[0.62rem] text-red-300">{j.last.error}</p>
                  )}
                  {j.last?.ok && j.last.summary && (
                    <p className="mt-1 break-words font-mono text-[0.58rem] text-white/30">{j.last.summary}</p>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest ${
                      bad ? "bg-red-500/15 text-red-300" : "bg-emerald-500/10 text-emerald-300"
                    }`}
                  >
                    {j.last?.ok === false ? "failed" : j.stale ? "overdue" : "ok"}
                  </span>
                  <p className="mt-1 font-mono text-[0.58rem] text-white/35">
                    {j.failures} failed · {j.killed} cut off · this week
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className={H2}>Email this week</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <div className={`${BOX} px-4 py-3`}>
            <p className="font-mono text-lg text-white">{sent.toLocaleString("en-GB")}</p>
            <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/35">went</p>
          </div>
          <div className={`rounded border px-4 py-3 ${failed ? "border-red-400/40 bg-red-500/[0.06]" : "border-white/10 bg-[#141416]"}`}>
            <p className={`font-mono text-lg ${failed ? "text-red-300" : "text-white"}`}>{failed.toLocaleString("en-GB")}</p>
            <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/35">
              refused{sent + failed ? ` · ${Math.round((failed / (sent + failed)) * 100)}%` : ""}
            </p>
          </div>
        </div>
        {h.email.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full font-mono text-xs tabular-nums">
              <thead>
                <tr className="text-left text-[0.58rem] uppercase tracking-widest text-white/35">
                  <th className="py-2 pr-4 font-normal">Kind</th>
                  <th className="py-2 pr-4 text-right font-normal">Went</th>
                  <th className="py-2 text-right font-normal">Refused</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {h.email.map((e) => (
                  <tr key={e.kind}>
                    <td className="py-1.5 pr-4 text-white/70">{e.kind}</td>
                    <td className="py-1.5 pr-4 text-right text-white/70">{e.sent}</td>
                    <td className={`py-1.5 text-right ${e.failed ? "text-red-300" : "text-white/40"}`}>{e.failed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className={H2}>The assistant</h2>
        <p className="mt-3 font-mono text-xs text-white/70">
          {h.assistant.day} questions in the last day · {h.assistant.week} this week, from {h.assistant.people}{" "}
          {h.assistant.people === 1 ? "person" : "people"}
        </p>
      </section>

      <section>
        <h2 className={H2}>What broke — {h.errors.day} in the last day</h2>
        {h.errors.groups.length === 0 ? (
          <p className="mt-3 font-mono text-xs text-white/40">Nothing this week.</p>
        ) : (
          <ul className="mt-3 divide-y divide-white/10 rounded border border-white/10">
            {h.errors.groups.map((g, i) => (
              <li key={i} className="px-4 py-3">
                <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/35">
                  {g.where} · ×{g.count} · last {ago(g.lastAt, now)}
                  {g.path ? ` · ${g.path}` : ""}
                </p>
                <p className="mt-1 break-words font-mono text-xs text-white/75">{g.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
