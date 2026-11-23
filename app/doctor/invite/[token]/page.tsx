import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clinicianOf } from "@/lib/clinician";
import { inviteByToken, inviteState } from "@/lib/clinician-invite";
import { InviteNewAccountForm, InviteAcceptForm, SignOutToInvite } from "@/components/doctor/ClinicianForms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "A patient's invitation",
  robots: { index: false, follow: false, nocache: true },
  // The link is the key; it must not travel in a Referer header.
  referrer: "no-referrer",
};

function Shell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-2xl border border-border bg-surface p-8">
        <p className="eyebrow text-accent">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-3xl leading-snug text-ink">{title}</h1>
        {children}
      </div>
    </main>
  );
}

/**
 * Where the emailed invitation lands a doctor — see lib/clinician-invite.ts.
 *
 * One page for every case, so the email needs only one link: no account yet
 * (make one here, and her records open), an account already (sign in, then
 * one button), signed in as somebody else (said plainly, never attached to
 * the wrong account), or a link that has lapsed.
 */
export default async function ClinicianInvitePage({ params }: { params: { token: string } }) {
  const token = String(params.token);
  const invite = await inviteByToken(token);
  if (!invite) {
    return (
      <Shell eyebrow="Oyun for clinicians" title="This invitation link isn’t recognised.">
        <p className="mt-3 prose-serif-sm text-muted">
          It may have been replaced by a newer one. Please use the most recent email, or ask your patient to send it again.
        </p>
      </Shell>
    );
  }
  const state = inviteState(invite);
  const patient = invite.journey.owner.name?.trim() || "Your patient";
  const session = await auth();
  const me = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, email: true, name: true } })
    : null;

  if (state === "accepted") {
    // Theirs already: straight to her records.
    if (me) {
      const c = await clinicianOf(me.id);
      const link = c
        ? await prisma.clinicianLink.findFirst({ where: { clinicianId: c.id, journeyId: invite.journeyId, endedAt: null }, select: { id: true } })
        : null;
      if (link) redirect(`/doctor/p/${link.id}`);
    }
    return (
      <Shell eyebrow="Oyun for clinicians" title="This invitation has already been accepted.">
        <p className="mt-3 prose-serif-sm text-muted">Sign in to see your patients.</p>
        <Link href="/sign-in?callbackUrl=/doctor" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-mono text-sm font-medium text-on-accent hover:bg-accent-deep">
          Clinician sign in
        </Link>
      </Shell>
    );
  }
  if (state !== "open") {
    return (
      <Shell eyebrow="Oyun for clinicians" title={state === "expired" ? "This invitation has expired." : "This invitation was withdrawn."}>
        <p className="mt-3 prose-serif-sm text-muted">
          Nothing is shared. If {patient} still wants to share her records with you, she can send a new invitation from
          Oyun — or you can give her your clinic code.
        </p>
      </Shell>
    );
  }

  const intro = (
    <>
      <p className="mt-3 prose-serif-sm text-muted">
        She keeps her pregnancy health records in Oyun and would like you, as her doctor or midwife, to be able to see
        them: her home readings, symptoms and notes, medicines and doses, tests
        {invite.withAppointments ? ", appointments and scans" : ""}
        {invite.withPhotos ? ", and the photographs attached to them" : ""}. Nothing else of hers is shared.
      </p>
      {invite.note?.trim() && (
        <blockquote className="mt-4 border-l-2 border-accent pl-3 prose-serif-sm text-ink">
          <span className="whitespace-pre-wrap">{invite.note}</span>
          <span className="mt-1 block font-mono text-[0.68rem] text-muted">— {patient}</span>
        </blockquote>
      )}
    </>
  );
  const foot = (
    <p className="mt-6 prose-serif-xs text-muted">
      Free, and not a monitoring service: Oyun does not alert you to anything. She can see when you open her records and
      can stop sharing at any time.
    </p>
  );
  const title = `${patient} invited you to see her health records.`;

  // ── Nobody signed in ────────────────────────────────────────────────────
  if (!me) {
    const account = await prisma.user.findUnique({ where: { email: invite.email }, select: { id: true } });
    const signIn = `/sign-in?callbackUrl=${encodeURIComponent(`/doctor/invite/${token}`)}&email=${encodeURIComponent(invite.email)}`;
    if (account) {
      return (
        <Shell eyebrow="A patient’s invitation" title={title}>
          {intro}
          <p className="mt-5 prose-serif-sm text-ink">
            You already have an Oyun account with <span className="font-mono text-sm">{invite.email}</span>. Sign in and
            her records are one tap away.
          </p>
          <Link href={signIn} className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-5 font-mono text-sm font-medium text-on-accent hover:bg-accent-deep">
            Sign in to accept
          </Link>
          {foot}
        </Shell>
      );
    }
    return (
      <Shell eyebrow="A patient’s invitation" title={title}>
        {intro}
        <p className="mt-5 prose-serif-sm text-ink">Create your free clinician account and her records open straight away.</p>
        <InviteNewAccountForm token={token} email={invite.email} suggestedName={invite.doctorName ?? ""} patient={patient} />
        {foot}
      </Shell>
    );
  }

  // ── Signed in, but not as the invited address ───────────────────────────
  if (invite.journey.ownerId === me.id) {
    return (
      <Shell eyebrow="Your invitation" title="This link is for your doctor.">
        <p className="mt-3 prose-serif-sm text-muted">
          You sent this invitation to <span className="font-mono text-sm text-ink">{invite.email}</span>. It works when
          they open it from their own email. You can see it, send it again or cancel it under Health → Your doctor.
        </p>
        <Link href="/health/doctor" className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-border px-5 font-mono text-xs text-ink hover:border-accent">
          Back to Your doctor
        </Link>
      </Shell>
    );
  }
  if ((me.email ?? "").toLowerCase() !== invite.email) {
    return (
      <Shell eyebrow="A different account" title={`This invitation was sent to ${invite.email}.`}>
        <p className="mt-3 prose-serif-sm text-muted">
          You are signed in as <span className="font-mono text-sm text-ink">{me.email}</span>. For her privacy, only
          the address she invited can accept. Sign in (or create an account) with that address — or ask {patient} to
          invite the address you use, or give her your clinic code.
        </p>
        <div className="mt-5">
          <SignOutToInvite token={token} />
        </div>
      </Shell>
    );
  }

  // ── Signed in as the invited address ────────────────────────────────────
  const clinician = await clinicianOf(me.id);
  return (
    <Shell eyebrow="A patient’s invitation" title={title}>
      {intro}
      {!clinician && (
        <p className="mt-5 prose-serif-sm text-ink">
          You don&rsquo;t have a clinician account yet. Add how patients should see you — it sits beside your own Oyun
          account, and you can move between the two at any time.
        </p>
      )}
      <InviteAcceptForm token={token} needsProfile={!clinician} name={invite.doctorName ?? me.name ?? ""} patient={patient} />
      {foot}
    </Shell>
  );
}
