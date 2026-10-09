import { recentDeliveries, deliveryHealth } from "@/lib/admin-db";

const when = (d: Date) =>
  d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

/**
 * What we have tried to send, and what became of it.
 *
 * ── The question this page exists to answer ──────────────────────────────
 * "She says she never got the invitation." Before this, the honest answer
 * was that we had no idea: the send either worked or quietly did not, and
 * nothing was written down either way. Now there is a line for every attempt,
 * and the three answers it can give are all useful — it went, it was refused
 * and here is the provider's reason, or it was never attempted at all.
 *
 * ── Why there is no subject and no body ──────────────────────────────────
 * Because a subject carries a child's name or the first line of an entry, and
 * a log an operator reads all day is the last place those belong. The kind of
 * email is enough to know which one it was. See the note on EmailDelivery.
 */
export default async function AdminEmailsPage() {
  const [rows, health] = await Promise.all([recentDeliveries(150), deliveryHealth()]);
  const bad = health.failed > 0;

  return (
    <div>
      <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
        The last day
      </h2>
      <div className="mt-3 flex flex-wrap gap-3">
        <div className="rounded border border-white/10 bg-[#141416] px-4 py-3">
          <p className="font-mono text-lg text-white">
            {health.sent.toLocaleString("en-GB")}
          </p>
          <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/35">
            went
          </p>
        </div>
        <div
          className={`rounded border px-4 py-3 ${
            bad ? "border-red-400/40 bg-red-500/[0.06]" : "border-white/10 bg-[#141416]"
          }`}
        >
          <p className={`font-mono text-lg ${bad ? "text-red-300" : "text-white"}`}>
            {health.failed.toLocaleString("en-GB")}
          </p>
          <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/35">
            refused
          </p>
        </div>
      </div>

      <h2 className="mt-8 font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
        Every attempt, newest first
      </h2>
      {rows.length === 0 ? (
        <p className="mt-4 font-mono text-xs text-white/40">
          Nothing has been sent yet.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-white/10 rounded border border-white/10">
          {rows.map((r) => (
            <li key={r.id} className="px-4 py-3">
              <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/35">
                {when(r.createdAt)} · {r.kind}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className={r.ok ? "text-emerald-300" : "text-red-300"}>
                  {r.ok ? "went" : "refused"}
                </span>
                <span className="text-white/70">{r.to}</span>
              </p>
              {r.error && (
                <p className="mt-1 break-words font-mono text-[0.58rem] leading-relaxed text-white/40">
                  {r.error}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 font-mono text-[0.58rem] leading-relaxed text-white/30">
        This says an email of a kind went to an address, and whether the
        provider took it. It does not hold the subject or the words, because a
        subject carries a family&rsquo;s.
      </p>
    </div>
  );
}
