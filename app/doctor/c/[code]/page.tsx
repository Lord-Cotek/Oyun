import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { clinicianLine, normaliseCode } from "@/lib/clinician";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Share with your doctor",
  robots: { index: false, follow: false },
};

/**
 * Where a doctor's QR code or link lands a patient. It shares nothing by
 * itself: it says who the doctor is, what they would see, and the way in —
 * for someone already in Oyun, and for someone who is not yet.
 */
export default async function ClinicDoor({ params }: { params: { code: string } }) {
  const code = normaliseCode(params.code);
  const c = code ? await prisma.clinician.findUnique({ where: { code }, select: { displayName: true, title: true, practice: true } }) : null;
  if (!c || !code) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="eyebrow text-muted">Oyun</p>
        <h1 className="mt-3 font-serif text-3xl text-ink">This clinic code isn&rsquo;t recognised.</h1>
        <p className="mt-4 prose-serif-sm text-muted">Please check it with your doctor or midwife.</p>
      </main>
    );
  }
  const session = await auth();
  const share = `/health/doctor?code=${code}`;
  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <div className="rounded-2xl border border-border bg-surface p-8">
        <p className="eyebrow text-accent">Share your records</p>
        <h1 className="mt-2 font-serif text-3xl leading-snug text-ink">{c.displayName} uses Oyun with patients.</h1>
        {(c.title || c.practice) && <p className="mt-1 font-mono text-xs text-muted">{clinicianLine({ displayName: "", title: c.title, practice: c.practice }).replace(/^ · /, "")}</p>}
        <p className="mt-4 prose-serif-sm text-muted">
          Oyun is a companion for pregnancy and your baby&rsquo;s first two years — with Christian faith or without
          religious content, as you choose. If you share with {c.displayName}, they see your health log, medicines,
          tests and appointments, and any post you choose. Never your diary, letters, moods or circle. You can stop at
          any time.
        </p>
        <div className="mt-6 rounded-lg border border-border bg-bg p-4 text-center">
          <p className="eyebrow text-muted">Clinic code</p>
          <p className="mt-1 font-mono text-3xl tracking-[0.12em] text-ink">{code}</p>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          {session?.user?.id ? (
            <Link href={share} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-5 font-mono text-sm font-medium text-on-accent hover:bg-accent-deep">
              Share with {c.displayName}
            </Link>
          ) : (
            <>
              <Link
                href={`/sign-up?callbackUrl=${encodeURIComponent(share)}`}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-5 font-mono text-sm font-medium text-on-accent hover:bg-accent-deep"
              >
                I&rsquo;m new to Oyun
              </Link>
              <Link
                href={`/sign-in?callbackUrl=${encodeURIComponent(share)}`}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-5 font-mono text-sm text-ink hover:border-accent"
              >
                I already use Oyun
              </Link>
            </>
          )}
        </div>
        <p className="mt-6 prose-serif-xs text-muted">
          Oyun does not monitor your readings or alert your doctor. For anything urgent, contact your maternity unit or
          emergency services.
        </p>
      </div>
    </main>
  );
}
