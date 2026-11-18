import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { keptToMother, logAccess } from "@/lib/health-log-db";
import { buildReport, presetPeriod } from "@/lib/health-report";
import { localDay } from "@/lib/medication";
import { motherTimeZone } from "@/lib/medication-db";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { HealthTabs } from "@/components/health/HealthTabs";
import { ReportDocument } from "@/components/health/report/ReportDocument";
import { ReportActions, type LinkRow } from "@/components/health/report/ReportActions";

export const metadata: Metadata = { title: "Doctor's report", robots: { index: false } };

const ymd = /^\d{4}-\d{2}-\d{2}$/;
const nice = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/**
 * The doctor's report: choose a period, see it as the doctor will, then
 * print it, save it as a PDF, download the numbers, or make a view-only link
 * (Mum, or her partner while she shares the log).
 */
export default async function ReportPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/report");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");
  const a = await logAccess(session.user.id, active.journey.id);
  if (!a) {
    const kept = await keptToMother(active.journey.id);
    return (
      <>
        <SiteHeader active="health" />
        <main className="mx-auto max-w-3xl px-6 pb-14">
          <PageHero eyebrow="Health" title="Doctor's report." lede="" />
          <HealthTabs active="report" />
          <p className="mt-8 prose-serif-sm text-muted">{kept ? "She has chosen to keep her health log to herself for now." : "The report is not open to you."}</p>
        </main>
      </>
    );
  }

  const tz = await motherTimeZone(a.journeyId);
  const today = localDay(new Date(), tz);
  const preset = ["week", "2w", "4w", "since", "custom"].includes(searchParams.p ?? "") ? searchParams.p! : "week";
  let period = presetPeriod(preset, today, searchParams.since);
  if (preset === "custom" && ymd.test(searchParams.from ?? "") && ymd.test(searchParams.to ?? "") && searchParams.from! <= searchParams.to!) {
    period = { from: searchParams.from!, to: searchParams.to! > today ? today : searchParams.to! };
  }
  const photos = searchParams.photos === "1";
  const report = await buildReport(a.journeyId, period, { photos, dob: searchParams.dob, clinic: searchParams.clinic });

  // Both of them see every link, and who made it.
  const rows = await prisma.healthReportLink.findMany({
    where: { journeyId: a.journeyId },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: { views: { orderBy: { at: "desc" }, take: 1 }, _count: { select: { views: true } } },
  });
  const makers = new Map(
    (await prisma.user.findMany({ where: { id: { in: [...new Set(rows.map((l) => l.createdById))] } }, select: { id: true, name: true } })).map((u) => [u.id, u.name?.trim().split(" ")[0] || "someone"]),
  );
  const links: LinkRow[] = rows.map((l) => ({
    id: l.id,
    label: l.label,
    period: `${nice(l.fromDay)}–${nice(l.toDay)}`,
    expires: l.expiresAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: tz }),
    views: l._count.views,
    lastView: l.views[0] ? l.views[0].at.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: tz }) : null,
    live: !l.revokedAt && l.expiresAt.getTime() > Date.now(),
    photos: l.withPhotos,
    by: l.createdById === a.userId ? null : makers.get(l.createdById) ?? "someone",
  }));

  // The pill follows its radio the moment it is tapped (has-[:checked]), not
  // only after the form is sent; a visible ring follows keyboard focus.
  const opt = "inline-flex min-h-10 cursor-pointer items-center rounded-full border border-border px-3.5 font-mono text-xs text-muted has-[:checked]:border-accent has-[:checked]:bg-accent/[0.12] has-[:checked]:text-accent has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent";
  return (
    <>
      <div className="print:hidden">
        <SiteHeader active="health" />
      </div>
      <main className="mx-auto max-w-4xl px-6 pb-14 print:max-w-none print:px-0 print:pb-0">
        <div className="print:hidden">
          <PageHero eyebrow="Health" title="Doctor's report." lede="Everything from the period you choose on one clean page — summary, daily readings, trends, medicines, tests and notes. Print it, save it as a PDF, or send your doctor a link." />
          <HealthTabs active="report" />
          <form method="get" className="mt-6 space-y-3 rounded-2xl border border-border bg-surface p-5">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["week", "This week"],
                  ["2w", "Last 2 weeks"],
                  ["4w", "Last 4 weeks"],
                  ["since", "Since a date"],
                  ["custom", "Custom"],
                ] as const
              ).map(([k, l]) => (
                <label key={k} className={opt}>
                  <input type="radio" name="p" value={k} defaultChecked={preset === k} className="sr-only" />
                  {l}
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="block">
                <span className="mb-1 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">Since</span>
                <input id="rp-since" type="date" name="since" defaultValue={searchParams.since ?? ""} max={today} className="rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink" />
              </label>
              <label className="block">
                <span className="mb-1 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">Custom from</span>
                <input id="rp-from" type="date" name="from" defaultValue={searchParams.from ?? ""} max={today} className="rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink" />
              </label>
              <label className="block">
                <span className="mb-1 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">to</span>
                <input id="rp-to" type="date" name="to" defaultValue={searchParams.to ?? ""} max={today} className="rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink" />
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="block">
                <span className="mb-1 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">Date of birth (optional)</span>
                <input id="rp-dob" type="date" name="dob" defaultValue={searchParams.dob ?? ""} className="rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink" />
              </label>
              <label className="block min-w-[14rem] flex-1">
                <span className="mb-1 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">Clinic and doctor (optional)</span>
                <input id="rp-clinic" name="clinic" defaultValue={searchParams.clinic ?? report.header.clinic ?? ""} className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink" />
              </label>
            </div>
            <label className="flex min-h-11 items-center gap-2.5 font-mono text-xs text-ink">
              <input type="checkbox" name="photos" value="1" defaultChecked={photos} className="h-4 w-4 accent-[var(--accent)]" />
              Include the photo appendix
            </label>
            <button type="submit" className="min-h-11 rounded-lg border border-accent/60 px-4 font-mono text-xs text-accent">
              Update the report
            </button>
          </form>
        </div>
        {/* Not print-hidden as a whole: its controls hide themselves, and the
            QR block for a link just made prints above the report. */}
        <div className="mt-4 print:mb-3 print:mt-0">
          <ReportActions period={period} withPhotos={photos} isMother={a.isMother} motherName={a.motherName.split(" ")[0] || "Mum"} links={links} />
        </div>
        <p className="mb-3 mt-6 eyebrow text-muted print:hidden">Preview — exactly as it prints</p>
        <div className="overflow-x-auto rounded-xl border border-border print:overflow-visible print:rounded-none print:border-0">
          <ReportDocument r={report} fileBase="/api/health/file/" />
        </div>
      </main>
    </>
  );
}
