import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clinicianAccess } from "@/lib/clinician";
import { buildReport, presetPeriod } from "@/lib/health-report";
import { localDay } from "@/lib/medication";
import { motherTimeZone } from "@/lib/medication-db";
import { computePosition, gestationLabel } from "@/lib/stage";
import { appointmentTitle } from "@/lib/appointments";
import { KIND_LABEL, PLAIN_KIND_LABEL } from "@/lib/feed";
import { mediaOfPost } from "@/lib/post-media";
import { SharedMedia } from "@/components/share/SharedMedia";
import { ReportDocument } from "@/components/health/report/ReportDocument";
import { PrintButton } from "@/components/health/report/PrintButton";
import { EndLinkButton } from "@/components/doctor/EndLinkButton";

export const dynamic = "force-dynamic";
// No title from the patient's name: a browser tab or a history list is not
// somewhere her name should sit beside the word "doctor".
export const metadata: Metadata = { title: "Patient", robots: { index: false, follow: false } };

const PERIODS: { key: string; label: string }[] = [
  { key: "week", label: "7 days" },
  { key: "2w", label: "2 weeks" },
  { key: "4w", label: "4 weeks" },
  { key: "since", label: "Whole pregnancy" },
];
const TABS = [
  { key: "report", label: "Health report" },
  { key: "appointments", label: "Appointments & scans" },
  { key: "posts", label: "Shared posts" },
] as const;

function fmt(d: Date, tz: string, time = false): string {
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: tz,
    ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

/**
 * One patient, as she chose to share herself with this clinician — see
 * lib/clinician.ts. Every opening is recorded and shown to her.
 */
export default async function DoctorPatient({
  params,
  searchParams,
}: {
  params: { link: string };
  searchParams: { tab?: string; p?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect(`/sign-in?callbackUrl=/doctor/p/${params.link}`);
  const link = await clinicianAccess(session.user.id, params.link);
  if (!link) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="eyebrow text-muted">Patient</p>
        <h1 className="mt-3 font-serif text-3xl text-ink">These records are not shared with you.</h1>
        <p className="mt-4 prose-serif-sm text-muted">
          She may have stopped sharing, or the link belongs to another clinician. Nothing is shown.
        </p>
        <Link href="/doctor" className="mt-6 inline-block font-mono text-xs text-accent underline underline-offset-4">
          Back to your patients
        </Link>
      </main>
    );
  }

  // Recorded before anything is read, so she sees every opening — even one
  // that failed partway.
  await prisma.clinicianView.create({ data: { linkId: link.id } });

  const tab = TABS.some((t) => t.key === searchParams.tab) ? searchParams.tab! : "report";
  const j = link.journey;
  const name = j.owner.name?.trim() || j.owner.email || "Patient";
  const tz = await motherTimeZone(j.id);
  const pos = computePosition(j.dueDate);
  const stage = pos.born ? `Month ${pos.month} after birth` : gestationLabel(pos.week ?? 0, pos.dayInWeek ?? 0);
  const href = (q: Record<string, string>) =>
    `/doctor/p/${link.id}?${new URLSearchParams({ tab, ...(searchParams.p ? { p: searchParams.p } : {}), ...q }).toString()}`;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 print:max-w-none print:p-0">
      <div className="print:hidden">
        <Link href="/doctor" className="font-mono text-xs text-muted hover:text-ink">
          ← Your patients
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-serif text-3xl leading-snug text-ink">{name}</h1>
            <p className="mt-1 font-mono text-xs text-muted">
              {j.status === "LOSS" ? "Pregnancy loss recorded" : stage}
              {!pos.born && j.status !== "LOSS" ? ` · due ${fmt(j.dueDate, tz)}` : ""}
              {j.babyCount > 1 ? ` · ${j.babyCount === 2 ? "twins" : `${j.babyCount} babies`}` : ""}
            </p>
          </div>
          <EndLinkButton linkId={link.id} name={name} />
        </div>
        <p className="mt-3 rounded-lg border border-border bg-surface px-4 py-3 prose-serif-xs text-muted">
          Shared with you since {fmt(link.createdAt, tz)} — health log, medicines, tests
          {link.withAppointments ? ", appointments and scans" : ""}
          {link.withPhotos ? ", with photographs" : ""}, and any post she chooses. She can see each time you open this
          page, and can stop sharing at any time. Oyun does not monitor her or alert you.
        </p>

        <nav aria-label="Sections" className="mt-5 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`/doctor/p/${link.id}?tab=${t.key}`}
              aria-current={tab === t.key ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-full px-4 font-mono text-xs transition-colors ${
                tab === t.key ? "bg-accent text-on-accent" : "border border-border text-ink hover:border-accent"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {tab === "report" && <ReportTab linkId={link.id} journeyId={j.id} dueDate={j.dueDate} tz={tz} photos={link.withPhotos} p={searchParams.p} href={href} />}
        {tab === "appointments" && <AppointmentsTab journeyId={j.id} tz={tz} shared={link.withAppointments} />}
        {tab === "posts" && <PostsTab journeyId={j.id} tz={tz} />}
      </div>
    </main>
  );
}

async function ReportTab({
  linkId,
  journeyId,
  dueDate,
  tz,
  photos,
  p,
  href,
}: {
  linkId: string;
  journeyId: string;
  dueDate: Date;
  tz: string;
  photos: boolean;
  p?: string;
  href: (q: Record<string, string>) => string;
}) {
  const today = localDay(new Date(), tz);
  const preset = PERIODS.some((x) => x.key === p) ? p! : "2w";
  // "Whole pregnancy" runs from forty weeks before the due date.
  const since = new Date(dueDate.getTime() - 280 * 86_400_000).toISOString().slice(0, 10);
  const period = presetPeriod(preset, today, since);
  const report = await buildReport(journeyId, period, { photos });
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((x) => (
            <Link
              key={x.key}
              href={href({ tab: "report", p: x.key })}
              aria-current={preset === x.key ? "true" : undefined}
              className={`inline-flex min-h-9 items-center rounded-full px-3 font-mono text-[0.7rem] ${
                preset === x.key ? "bg-ink text-bg" : "border border-border text-muted hover:text-ink"
              }`}
            >
              {x.label}
            </Link>
          ))}
        </div>
        <PrintButton />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border print:overflow-visible print:rounded-none print:border-0">
        <ReportDocument r={report} fileBase={`/api/doctor/file/${linkId}/`} />
      </div>
    </>
  );
}

async function AppointmentsTab({ journeyId, tz, shared }: { journeyId: string; tz: string; shared: boolean }) {
  if (!shared) {
    return <p className="prose-serif-sm text-muted">She has chosen not to share her appointments.</p>;
  }
  const rows = await prisma.appointment.findMany({
    where: { journeyId, cancelledAt: null },
    orderBy: { at: "desc" },
    take: 60,
    select: { id: true, kind: true, title: true, at: true, hasTime: true, where: true, who: true, questions: true, outcome: true, attendedAt: true },
  });
  const now = new Date();
  const upcoming = rows.filter((r) => r.at >= now).reverse();
  const past = rows.filter((r) => r.at < now);
  const Row = ({ r }: { r: (typeof rows)[number] }) => (
    <li className="rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-serif text-lg text-ink">{appointmentTitle(r.kind, r.title)}</p>
        <p className="font-mono text-xs text-muted">{fmt(r.at, tz, r.hasTime)}</p>
      </div>
      {(r.where || r.who) && <p className="mt-1 font-mono text-xs text-muted">{[r.who, r.where].filter(Boolean).join(" · ")}</p>}
      {r.questions?.trim() && (
        <div className="mt-3">
          <p className="eyebrow text-muted">Her questions</p>
          <p className="mt-1 whitespace-pre-wrap prose-serif-xs text-ink">{r.questions}</p>
        </div>
      )}
      {r.outcome?.trim() && (
        <div className="mt-3">
          <p className="eyebrow text-muted">What came of it</p>
          <p className="mt-1 whitespace-pre-wrap prose-serif-xs text-ink">{r.outcome}</p>
        </div>
      )}
    </li>
  );
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section>
        <h2 className="mb-3 font-serif text-xl text-ink">Coming up</h2>
        {upcoming.length ? <ul className="space-y-3">{upcoming.map((r) => <Row key={r.id} r={r} />)}</ul> : <p className="prose-serif-xs text-muted">Nothing in her book.</p>}
      </section>
      <section>
        <h2 className="mb-3 font-serif text-xl text-ink">Before</h2>
        {past.length ? <ul className="space-y-3">{past.map((r) => <Row key={r.id} r={r} />)}</ul> : <p className="prose-serif-xs text-muted">Nothing yet.</p>}
      </section>
    </div>
  );
}

async function PostsTab({ journeyId, tz }: { journeyId: string; tz: string }) {
  const posts = await prisma.post.findMany({
    where: { journeyId, forDoctorAt: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 50,
    // Everything on the post, the way the feed reads it: photographs and
    // videos, each video's still, and the single picture older posts carry.
    select: { id: true, kind: true, body: true, mediaUrls: true, posterUrls: true, imageUrl: true, createdAt: true, author: { select: { name: true } } },
  });
  if (!posts.length) {
    return (
      <p className="prose-serif-sm text-muted">
        She hasn&rsquo;t shared any posts with you. Her diary stays private unless she chooses a post, one at a time.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {posts.map((p) => (
        <li key={p.id} className="rounded-xl border border-border bg-surface p-4">
          <p className="font-mono text-[0.68rem] uppercase tracking-widest text-muted">
            {(PLAIN_KIND_LABEL[p.kind] ?? KIND_LABEL[p.kind] ?? "Update")} · {p.author.name ?? "Family"} · {fmt(p.createdAt, tz)}
          </p>
          {p.body?.trim() && <p className="mt-2 whitespace-pre-wrap prose-serif-sm text-ink">{p.body}</p>}
          {/* The same viewer a shared post has everywhere else: a photograph
              opens whole and can be zoomed, and a video plays. */}
          <div className="max-w-2xl">
            <SharedMedia media={mediaOfPost(p)} alt={`Shared by ${p.author.name ?? "her family"}`} />
          </div>
        </li>
      ))}
    </ul>
  );
}
