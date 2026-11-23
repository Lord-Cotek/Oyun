import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { clinicianOf } from "@/lib/clinician";
import { patientList } from "@/lib/clinician-db";
import { CopyText } from "@/components/doctor/CopyText";
import { ClinicianProfileForm } from "@/components/doctor/ClinicianForms";
import { SignOutButton } from "@/components/SignOutButton";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Your patients" };
export const dynamic = "force-dynamic";

const SITE_DEFAULT = "https://oyun.cotek.app";

function fmt(iso: string | null, withTime = false): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

/**
 * The clinician's home: their clinic code, and the patients who chose to
 * share with them. See lib/clinician.ts — nobody is here who did not type
 * the code and agree, and anybody can leave at any time.
 */
export default async function DoctorHome() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/doctor");
  const c = await clinicianOf(session.user.id);
  if (!c) redirect("/doctor/join");
  const patients = await patientList(c.id);
  // Their own side of Oyun, if they have one — see the account card below.
  const [memberships, ownsOne] = await Promise.all([
    prisma.membership.count({ where: { userId: session.user.id } }),
    prisma.journey.count({ where: { ownerId: session.user.id } }),
  ]);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_DEFAULT;
  const patientLink = `${site}/doctor/c/${c.code}`;

  return (
    <main className="mx-auto max-w-shell px-4 pb-16 pt-8 sm:px-6">
      <p className="eyebrow text-accent">{c.displayName}</p>
      <h1 className="mt-1 font-serif text-3xl leading-snug text-ink sm:text-4xl">Your patients</h1>
      <p className="mt-2 max-w-prose prose-serif-sm text-muted">
        Patients who chose to share their health log, medicines, tests and appointments with you — by entering your
        clinic code, or by inviting you by email. Oyun does not monitor anyone or alert you — open a patient&rsquo;s
        records when you need them.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <section aria-labelledby="patients-h" className="min-w-0">
          <h2 id="patients-h" className="sr-only">Patients</h2>
          {patients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
              <p className="font-serif text-xl text-ink">No patients have shared with you yet.</p>
              <p className="mx-auto mt-2 max-w-sm prose-serif-sm text-muted">
                Give a patient your code <span className="font-mono text-ink">{c.code}</span>. In Oyun she opens
                Health → Your doctor, types it in, and sees exactly what you will see before she agrees.
              </p>
              <p className="mx-auto mt-2 max-w-sm prose-serif-xs text-muted">
                Or she can invite you from there by email: you will get a message at {session.user.email}, and her
                records open from its link.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {patients.map((p) => (
                <li key={p.linkId}>
                  <Link
                    href={`/doctor/p/${p.linkId}`}
                    className="block rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-serif text-xl leading-snug text-ink">{p.name}</p>
                        <p className="mt-0.5 font-mono text-xs text-muted">
                          {p.loss ? "Pregnancy loss recorded" : p.stage}
                          {!p.born && !p.loss ? ` · due ${fmt(p.dueDate)}` : ""}
                          {p.babyCount > 1 ? ` · ${p.babyCount === 2 ? "twins" : `${p.babyCount} babies`}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {p.urgent > 0 && (
                          <span className="rounded-full bg-negative/15 px-2.5 py-1 font-mono text-[0.68rem] text-negative">
                            {p.urgent} urgent
                          </span>
                        )}
                        {p.high > 0 && (
                          <span className="rounded-full bg-accent2/15 px-2.5 py-1 font-mono text-[0.68rem] text-accent2">
                            {p.high} above target
                          </span>
                        )}
                        {p.urgent === 0 && p.high === 0 && (
                          <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[0.68rem] text-muted">
                            Nothing flagged
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                      Last reading {fmt(p.lastReading)} · you last opened {p.lastViewed ? fmt(p.lastViewed, true) : "never"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 prose-serif-xs text-muted">
            Flags count readings her log marked high or urgent since you last opened her records (or the last two
            weeks). They are a reason to look first — not a clinical judgement, and never sent to you as an alert.
          </p>
        </section>

        <aside className="space-y-4">
          <section id="code" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6">
            <p className="eyebrow text-accent">Your clinic code</p>
            <p className="mt-2 font-mono text-4xl tracking-[0.12em] text-ink">{c.code}</p>
            <p className="mt-2 prose-serif-xs text-muted">
              Patients enter it in Oyun under Health → Your doctor. Or give them the link or QR code below — it opens a
              page that tells them who you are and how to share.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <CopyText value={c.code} label="Copy code" />
              <CopyText value={patientLink} label="Copy patient link" />
              <a href="/doctor/qr?download=1" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent">
                Download QR
              </a>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/doctor/qr" alt={`QR code for ${c.displayName}'s Oyun page`} width={160} height={160} className="mt-4 rounded-lg border border-border bg-white p-1" />
          </section>

          <details className="rounded-2xl border border-border bg-surface p-6">
            <summary className="cursor-pointer font-serif text-lg text-ink">How patients see you</summary>
            <div className="mt-4">
              <ClinicianProfileForm name={c.displayName} title={c.title ?? ""} practice={c.practice ?? ""} />
            </div>
          </details>

          {/* One sign-in, two rooms. Patients here; their own journey — if
              they have or want one — on the other side, never mixed. */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <p className="eyebrow text-muted">Your account</p>
            <p className="mt-2 break-all font-mono text-xs text-muted">Signed in as {session.user.email}</p>
            <p className="mt-3 prose-serif-xs text-muted">
              {memberships > 0
                ? "You also use Oyun yourself. Your own journey is kept completely apart from your patients — they never see anything of yours."
                : "Expecting, or a new parent yourself? You can use Oyun for your own journey with this same sign-in. It stays completely apart from your patients."}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link href="/settings" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent">
                Settings
              </Link>
              {memberships > 0 && (
                <Link href="/journey" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent">
                  Go to my journey
                </Link>
              )}
              {ownsOne === 0 && (
                <Link href="/onboarding" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent">
                  Start my own journey
                </Link>
              )}
              <span className="font-mono text-xs">
                <SignOutButton />
              </span>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
