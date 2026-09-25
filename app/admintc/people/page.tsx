import { deliveriesFor, findPerson } from "@/lib/admin-db";
import { PersonActions } from "@/components/admin/PersonActions";
import { CarefulActions } from "@/components/admin/CarefulActions";

const when = (d: Date) => d.toLocaleDateString("en-GB", { dateStyle: "medium" });

/**
 * Somebody has written in. Find their account.
 *
 * Exact address only, on purpose: an admin helping a person has that person's
 * email in front of them. A substring search over every account in the app is
 * a browsing tool, which is a different and much less defensible thing.
 *
 * What comes back is the account and its memberships — the journeys they are
 * in, in what role, how many people and how many entries each holds. Never
 * what any of those entries say.
 */
/**
 * What just happened, said after the fact.
 *
 * A code rather than the message itself: the panel that ran the action
 * unmounts when the account it belongs to moves or is deleted, so the news
 * has to survive a navigation — and a sentence carried in a URL is a sentence
 * somebody can put words into. These are fixed here.
 */
const DONE: Record<string, string> = {
  changed: "Address changed. Both the old and the new one have been told.",
  deleted: "Deleted. There is nothing left to restore.",
};

export default async function AdminPeoplePage({
  searchParams,
}: {
  searchParams: { q?: string; done?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const done = DONE[searchParams.done ?? ""] ?? null;
  const person = q ? await findPerson(q) : null;
  // "She says she never got it" is the commonest support question there is,
  // and the answer belongs on the screen where somebody is already standing.
  const sent = person?.email ? await deliveriesFor(person.email) : [];

  return (
    <div className="space-y-6">
      {done && (
        <p className="rounded border border-emerald-400/30 bg-emerald-400/[0.06] px-4 py-3 font-mono text-xs text-emerald-300">
          {done}
        </p>
      )}

      <form className="flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          type="email"
          placeholder="their email address"
          aria-label="Their email address"
          className="min-w-[16rem] flex-1 rounded border border-white/15 bg-[#141416] px-3 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded border border-white/20 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-white/80 hover:border-white/50 hover:text-white"
        >
          Find
        </button>
      </form>

      {q && !person && (
        <p className="font-mono text-xs text-white/50">
          No account with that address.
        </p>
      )}

      {person && (
        <div className="space-y-6">
          <section className="rounded border border-white/10 bg-[#141416] p-4">
            <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
              The account
            </h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                ["Name", person.name ?? "—"],
                ["Email", person.email ?? "—"],
                ["Joined", when(person.createdAt)],
                ["Email verified", person.emailVerified ? when(person.emailVerified) : "no"],
                ["Password set", person.hasPassword ? "yes" : "no"],
                [
                  "Suspended",
                  person.suspendedAt ? when(person.suspendedAt) : "no",
                ],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[0.58rem] uppercase tracking-widest text-white/35">
                    {k}
                  </dt>
                  <dd className="mt-0.5 font-mono text-xs text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
              Journeys they are in
            </h2>
            {person.memberships.length === 0 ? (
              <p className="mt-2 font-mono text-xs text-white/40">None.</p>
            ) : (
              <ul className="mt-3 divide-y divide-white/10 rounded border border-white/10">
                {person.memberships.map((m) => (
                  <li key={m.journeyId} className="px-4 py-3">
                    <p className="font-mono text-xs text-white">
                      {m.role}
                      <span className="text-white/40">
                        {" "}· started {when(m.journeyCreatedAt)}
                      </span>
                    </p>
                    <p className="mt-0.5 font-mono text-[0.62rem] text-white/40">
                      {m.people} {m.people === 1 ? "person" : "people"} · {m.posts}{" "}
                      {m.posts === 1 ? "entry" : "entries"} · {m.journeyId}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {person.email && (
            <section className="rounded border border-white/10 bg-[#141416] p-4">
              <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
                What we have sent them
              </h2>
              {sent.length === 0 ? (
                <p className="mt-2 font-mono text-xs text-white/40">
                  Nothing on record.
                </p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {sent.map((d) => (
                    <li key={d.id} className="font-mono text-[0.62rem]">
                      <span className={d.ok ? "text-emerald-300" : "text-red-300"}>
                        {d.ok ? "went" : "refused"}
                      </span>
                      <span className="text-white/70"> · {d.kind} · </span>
                      <span className="text-white/40">{when(d.createdAt)}</span>
                      {d.error && (
                        <span className="mt-0.5 block break-words text-white/30">
                          {d.error}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 font-mono text-[0.58rem] leading-relaxed text-white/30">
                Which email and whether the provider took it. Never the subject
                or the words.
              </p>
            </section>
          )}

          <PersonActions
            email={person.email ?? ""}
            pending={person.pending.map((p) => ({
              id: p.id,
              role: p.role,
              when: when(p.createdAt),
            }))}
          />

          {person.email && (
            <CarefulActions
              email={person.email}
              suspendedAt={person.suspendedAt ? when(person.suspendedAt) : null}
              suspendedReason={person.suspendedReason}
            />
          )}
        </div>
      )}
    </div>
  );
}
