import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { liveReportLink } from "@/lib/health-report-link";
import { buildReport } from "@/lib/health-report";
import { ReportDocument } from "@/components/health/report/ReportDocument";
import { PrintButton } from "@/components/health/report/PrintButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Health report",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

/**
 * What the doctor sees: one report, for the period she chose, and nothing
 * else in the app. No login. The link works only while it is open and in
 * date; every opening is recorded so she can see when it was looked at.
 */
export default async function DoctorReport({ params }: { params: { token: string } }) {
  const link = await liveReportLink(String(params.token));
  if (!link) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="eyebrow text-muted">Health report</p>
        <h1 className="mt-3 font-display text-3xl text-ink">This link is no longer open.</h1>
        <p className="mt-4 prose-serif-sm text-muted">It has expired or was closed by the person who shared it. Ask them for a new one if you still need it.</p>
      </main>
    );
  }
  await prisma.healthReportView.create({ data: { linkId: link.id } });
  const period = { from: link.fromDay.toISOString().slice(0, 10), to: link.toDay.toISOString().slice(0, 10) };
  const report = await buildReport(link.journeyId, period, { photos: link.withPhotos });
  const until = link.expiresAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: report.header.tz });

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 print:max-w-none print:p-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="font-mono text-xs text-muted">View-only health report, shared by the patient · open until {until}</p>
        <PrintButton />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border print:overflow-visible print:rounded-none print:border-0">
        <ReportDocument r={report} fileBase={`/api/health/report-file/${params.token}/`} />
      </div>
    </main>
  );
}
