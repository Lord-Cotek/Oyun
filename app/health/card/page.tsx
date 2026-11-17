import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { hasAnyHealth } from "@/lib/health-card";
import { loadHealthCards, type HealthPerson } from "@/lib/health-card-db";
import { PrintButton } from "@/components/book/PrintButton";

export const metadata: Metadata = { title: "Health cards", robots: { index: false } };

const long = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The card to print — or save as a PDF from the same dialog and send.
 *
 * For her, while she is expecting, it is the hospital-bag card: the week she
 * is at, the due date, her blood group, what she is allergic to and who looks
 * after her, so the first nurse she meets does not have to ask a woman in
 * labour. For a child it is the card for whoever is minding them.
 *
 * Nothing on the page but the cards: no menus, allergies first and loudest,
 * and never "none" unless somebody wrote it.
 */
export default async function HealthCardPrint({ searchParams }: { searchParams: { who?: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/card");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const data = await loadHealthCards(active.journey.id, session.user.id);
  if (!data) redirect("/journey");
  const who = searchParams.who?.slice(0, 64);
  const matches = (p: HealthPerson) => p.target === who || (p.kind !== "child" && p.kind === who);
  const people = who ? data.people.filter(matches) : data.people.filter((p) => hasAnyHealth(p.fields));
  const partnerName = data.people.find((p) => p.kind === "partner")?.name ?? null;
  const motherName = data.people.find((p) => p.kind === "mother")?.name ?? null;
  const today = new Date();

  return (
    <main className="mx-auto max-w-3xl px-6 pb-12 pt-8 print:max-w-none print:px-0 print:pt-0">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 print:hidden">
        <div>
          <Link href="/health" className="font-mono text-xs text-muted underline underline-offset-4 hover:text-ink">
            ← Health
          </Link>
          <h1 className="mt-2 font-serif text-3xl text-ink">
            {people.length === 1 ? `${people[0].name}’s card` : "Health cards"}
          </h1>
          <p className="mt-1 max-w-prose prose-serif-xs text-muted">
            Print it, or choose “Save as PDF” in the same window and send it. Only what you have filled in is shown;
            blank lines are left for anything still to add.
          </p>
        </div>
        <PrintButton />
      </div>

      {people.length === 0 ? (
        <p className="prose-serif-sm text-muted">
          Nothing to print yet. Fill in a card on the <Link href="/health" className="text-accent underline">Health</Link> page first.
        </p>
      ) : (
        <div className="grid gap-5 print:block">
          {people.map((p) => {
            const f = p.fields;
            const isMother = p.kind === "mother";
            const bag = isMother && data.pregnancy;
            const facts = [
              ["Blood group", f.bloodGroup],
              ["Genotype", f.genotype],
              ["Conditions", f.conditions],
            ].filter(([, v]) => v && String(v).trim()) as [string, string][];
            return (
              <section
                key={p.target}
                className="break-inside-avoid rounded-2xl border-2 border-ink/80 bg-surface p-5 print:mb-5 print:rounded-lg print:border-black print:bg-white print:text-black"
              >
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted print:text-black/70">
                  {bag ? "Hospital bag card" : p.kind === "child" ? "Emergency card" : "Health card"}
                </p>
                <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2 print:border-black/30">
                  <p className="font-serif text-2xl text-ink print:text-black">{p.name}</p>
                  <p className="font-mono text-xs text-muted print:text-black/70">{p.sub}</p>
                </div>

                {bag && data.pregnancy && (
                  <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-bg/60 px-3 py-2 print:bg-white print:px-0">
                    <div>
                      <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted print:text-black/70">Pregnant</p>
                      <p className="font-serif text-lg text-ink print:text-black">
                        {data.pregnancy.week}+{data.pregnancy.dayInWeek}
                        <span className="text-sm text-muted print:text-black/70"> on {long(today)}</span>
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted print:text-black/70">Due</p>
                      <p className="font-serif text-lg text-ink print:text-black">{long(data.pregnancy.dueDate)}</p>
                    </div>
                  </div>
                )}

                <div className="mt-3 rounded-lg border-2 border-negative/60 bg-negative/[0.06] px-3 py-2 print:border-black print:bg-white">
                  <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-widest text-negative print:text-black">Allergies</p>
                  <p className="mt-0.5 font-serif text-lg text-ink print:text-black">
                    {f.allergies?.trim() ||
                      (p.kind === "child"
                        ? "Not recorded — ask before giving any food or medicine"
                        : "Not recorded — ask before giving any medicine")}
                  </p>
                </div>

                {facts.length > 0 && (
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                    {facts.map(([k, v]) => (
                      <div key={k} className={k === "Conditions" ? "col-span-2 sm:col-span-1" : ""}>
                        <dt className="font-mono text-[0.58rem] uppercase tracking-widest text-muted print:text-black/70">{k}</dt>
                        <dd className="font-serif text-base text-ink print:text-black">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {[
                  ["Medicines and supplements", f.medicines],
                  [p.kind === "child" ? "Clinic or doctor" : "Hospital, midwife or doctor", f.careProvider],
                  ["Good to know", f.notes],
                ]
                  .filter(([, v]) => v && String(v).trim())
                  .map(([k, v]) => (
                    <div key={k as string} className="mt-3">
                      <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted print:text-black/70">{k}</p>
                      <p className="whitespace-pre-wrap font-serif text-base text-ink print:text-black">{v}</p>
                    </div>
                  ))}

                {isMother && partnerName && (
                  <div className="mt-3">
                    <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted print:text-black/70">Partner</p>
                    <p className="font-serif text-base text-ink print:text-black">{partnerName}</p>
                  </div>
                )}
                {p.kind === "child" && (motherName || partnerName) && (
                  <div className="mt-3">
                    <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted print:text-black/70">Parents</p>
                    <p className="font-serif text-base text-ink print:text-black">{[motherName, partnerName].filter(Boolean).join(" & ")}</p>
                  </div>
                )}

                <div className="mt-3 border-t border-border pt-2 print:border-black/30">
                  <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted print:text-black/70">In an emergency, call</p>
                  <p className="whitespace-pre-wrap font-serif text-base text-ink print:text-black">
                    {f.emergencyContact?.trim() || (
                      <>
                        <span className="text-muted print:hidden">Not added yet — add it on the Health page, or write it here once printed.</span>
                        <span className="hidden print:inline">______________________________</span>
                      </>
                    )}
                  </p>
                </div>
                <p className="mt-3 font-mono text-[0.55rem] text-muted print:text-black/60">
                  Printed {long(today)}{p.updatedAt ? ` · last changed ${long(p.updatedAt)}${p.updatedBy ? ` by ${p.updatedBy}` : ""}` : ""}
                </p>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
