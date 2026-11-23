import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clinicianOf } from "@/lib/clinician";
import { invitesWaitingFor } from "@/lib/clinician-invite";
import { InvitationsWaiting } from "@/components/doctor/InvitationsWaiting";

export const metadata: Metadata = { title: "Invitations" };
export const dynamic = "force-dynamic";

/**
 * Where the bell leads when a patient invites a doctor who already has an
 * account — lib/clinician-invite.ts, rule 6. It works for somebody with no
 * clinician account yet (a mother who is also a midwife): accepting here
 * sets one up beside the account she has.
 */
export default async function Invitations() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/doctor/invitations");
  const [waiting, clinician, me] = await Promise.all([
    invitesWaitingFor(session.user.id),
    clinicianOf(session.user.id),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true, emailVerified: true } }),
  ]);
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6">
      <p className="eyebrow text-accent">For doctors and midwives</p>
      <h1 className="mt-1 font-serif text-3xl leading-snug text-ink">Invitations from patients</h1>
      <div className="mt-6">
        {waiting.length > 0 ? (
          <InvitationsWaiting userId={session.user.id} heading={false} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-6">
            <p className="font-serif text-xl text-ink">No invitations are waiting.</p>
            <p className="mt-2 prose-serif-sm text-muted">
              {me && !me.emailVerified
                ? `Invitations appear here once your email address (${me.email}) is confirmed. Until then, open the link in the invitation email itself — or confirm your address from Settings.`
                : "It may have been accepted already, withdrawn by the patient, or expired. A patient can send a new one from her Oyun, or you can give her your clinic code."}
            </p>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {clinician && (
          <Link href="/doctor" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent">
            Your patients
          </Link>
        )}
        <Link href="/settings" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent">
          Settings
        </Link>
      </div>
    </main>
  );
}
