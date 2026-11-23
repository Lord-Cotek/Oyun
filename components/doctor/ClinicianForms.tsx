"use client";

import { useState, useTransition } from "react";
import { signIn, signOut } from "next-auth/react";
import {
  registerClinician,
  becomeClinician,
  updateClinicianProfile,
  acceptInviteWithNewAccount,
  acceptInviteSignedIn,
  acceptInviteInApp,
  declineInviteInApp,
} from "@/app/doctor/actions";
import { ConfirmButton } from "@/components/ui/Confirm";

const input =
  "prose-serif-sm w-full rounded-lg border border-border bg-bg px-4 py-3 text-ink placeholder:text-muted focus:border-accent focus:outline-none";
const label = "eyebrow mb-2 block text-muted";

/** The three details patients see, shared by every clinician form. */
function ProfileFields({ name = "", title = "", practice = "" }: { name?: string; title?: string; practice?: string }) {
  return (
    <>
      <label className="block">
        <span className={label}>Your name, as patients will see it</span>
        <input name="displayName" required maxLength={80} defaultValue={name} placeholder="Dr Adaeze Okafor" className={input} />
      </label>
      <label className="block">
        <span className={label}>Your role (optional)</span>
        <input name="title" maxLength={80} defaultValue={title} placeholder="Consultant obstetrician" className={input} />
      </label>
      <label className="block">
        <span className={label}>Clinic or hospital (optional)</span>
        <input name="practice" maxLength={120} defaultValue={practice} placeholder="St Mary’s Women’s Clinic" className={input} />
      </label>
    </>
  );
}

function Declaration() {
  return (
    <label className="flex items-start gap-2 pt-1">
      <input type="checkbox" name="declared" required className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]" />
      <span className="prose-serif-xs text-muted">
        I am a health professional. I will use what patients choose to share only for their care, and I understand
        Oyun does not monitor patients or alert me to anything.
      </span>
    </label>
  );
}

/** A clinician new to Oyun: an account and a clinic code in one step. */
export function ClinicianJoinForm() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="mt-6 space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError(null);
        const fd = new FormData(e.currentTarget);
        const res = await registerClinician(null, fd);
        if (!res.ok) {
          setError(res.error ?? "That didn’t work. Please try again.");
          setBusy(false);
          return;
        }
        const r = await signIn("credentials", {
          email: String(fd.get("email") ?? "").trim(),
          password: String(fd.get("password") ?? ""),
          redirect: false,
          callbackUrl: "/doctor",
        });
        window.location.href = r?.error ? "/sign-in?callbackUrl=/doctor" : "/doctor";
      }}
    >
      <ProfileFields />
      <label className="block">
        <span className={label}>Email</span>
        <input name="email" type="email" required autoComplete="email" placeholder="you@clinic.org" className={input} />
      </label>
      <label className="block">
        <span className={label}>Password</span>
        <input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" className={input} />
      </label>
      <Declaration />
      {error && <p className="font-mono text-xs text-negative" role="alert">{error}</p>}
      <button type="submit" disabled={busy} className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent hover:bg-accent-deep disabled:opacity-50">
        {busy ? "Creating your account…" : "Create clinician account"}
      </button>
    </form>
  );
}

/** Already in Oyun: add a clinician account beside the one they have. */
export function BecomeClinicianForm({ name }: { name: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <form
      className="mt-6 space-y-3"
      action={(fd) =>
        start(async () => {
          setError(null);
          const res = await becomeClinician(fd);
          if (!res.ok) setError(res.error ?? "That didn’t work. Please try again.");
          else window.location.href = "/doctor";
        })
      }
    >
      <ProfileFields name={name} />
      <Declaration />
      {error && <p className="font-mono text-xs text-negative" role="alert">{error}</p>}
      <button type="submit" disabled={pending} className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent hover:bg-accent-deep disabled:opacity-50">
        {pending ? "Setting up…" : "Set up my clinician account"}
      </button>
    </form>
  );
}

/** How patients see them — editable from the dashboard. */
export function ClinicianProfileForm({ name, title, practice }: { name: string; title: string; practice: string }) {
  const [said, setSaid] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  return (
    <form
      className="space-y-3"
      action={(fd) =>
        start(async () => {
          const res = await updateClinicianProfile(null, fd);
          setSaid({ ok: res.ok, text: res.ok ? (res.message ?? "Saved.") : (res.error ?? "That didn’t save.") });
        })
      }
    >
      <ProfileFields name={name} title={title} practice={practice} />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent disabled:opacity-50">
          {pending ? "Saving…" : "Save"}
        </button>
        {said && <p className={`font-mono text-xs ${said.ok ? "text-positive" : "text-negative"}`} role="status">{said.text}</p>}
      </div>
    </form>
  );
}


/* ── Accepting a patient's emailed invitation — lib/clinician-invite.ts ──── */

/**
 * A doctor new to Oyun: name, a password, one tick — and her records open.
 * The email is the one she invited and is shown, not asked for.
 */
export function InviteNewAccountForm({ token, email, suggestedName, patient }: { token: string; email: string; suggestedName: string; patient: string }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="mt-6 space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError(null);
        const fd = new FormData(e.currentTarget);
        const res = await acceptInviteWithNewAccount(token, fd);
        if (!res.ok) {
          setError(res.error);
          setBusy(false);
          return;
        }
        const dest = `/doctor/p/${res.linkId}`;
        const r = await signIn("credentials", { email, password: String(fd.get("password") ?? ""), redirect: false, callbackUrl: dest });
        window.location.href = r?.error ? `/sign-in?callbackUrl=${encodeURIComponent(dest)}&email=${encodeURIComponent(email)}` : dest;
      }}
    >
      <ProfileFields name={suggestedName} />
      <div>
        <span className={label}>Email</span>
        <p className="rounded-lg border border-border bg-bg/50 px-4 py-3 font-mono text-sm text-muted">{email}</p>
      </div>
      <label className="block">
        <span className={label}>Choose a password</span>
        <input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" className={input} />
      </label>
      <Declaration />
      {error && <p className="font-mono text-xs text-negative" role="alert">{error}</p>}
      <button type="submit" disabled={busy} className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent hover:bg-accent-deep disabled:opacity-50">
        {busy ? "Opening her records…" : `Create account and see ${patient}’s records`}
      </button>
    </form>
  );
}

/**
 * Already signed in with the invited address. One button if they already
 * keep a clinician account; otherwise the three details and the tick first.
 */
export function InviteAcceptForm({ token, needsProfile, name, patient }: { token: string; needsProfile: boolean; name: string; patient: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <form
      className="mt-6 space-y-3"
      action={(fd) =>
        start(async () => {
          setError(null);
          const res = await acceptInviteSignedIn(token, needsProfile ? fd : null);
          if (!res.ok) setError(res.error);
          else window.location.href = `/doctor/p/${res.linkId}`;
        })
      }
    >
      {needsProfile && (
        <>
          <ProfileFields name={name} />
          <Declaration />
        </>
      )}
      {error && <p className="font-mono text-xs text-negative" role="alert">{error}</p>}
      <button type="submit" disabled={pending} className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent hover:bg-accent-deep disabled:opacity-50">
        {pending ? "Opening her records…" : `Accept and see ${patient}’s records`}
      </button>
    </form>
  );
}

/** Sign out and come straight back to the same invitation. */
export function SignOutToInvite({ token }: { token: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: `/doctor/invite/${token}` })}
      className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent"
    >
      Sign out and use the invited address
    </button>
  );
}


/**
 * An invitation shown inside the app to a doctor who already has an account
 * (lib/clinician-invite.ts, rule 6): who is asking, what they would see,
 * Accept — and Decline, for the patient who is not theirs.
 */
export function InAppInvite({
  inviteId,
  patient,
  note,
  sent,
  until,
  sees,
  needsProfile,
  name,
}: {
  inviteId: string;
  patient: string;
  note: string | null;
  sent: string;
  until: string;
  sees: string;
  needsProfile: boolean;
  name: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [gone, setGone] = useState(false);
  const [pending, start] = useTransition();
  if (gone) {
    return (
      <p className="rounded-2xl border border-border bg-surface p-5 prose-serif-sm text-muted" role="status">
        Declined. Nothing was shared, and {patient} has been told.
      </p>
    );
  }
  return (
    <form
      className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-5"
      action={(fd) =>
        start(async () => {
          setError(null);
          const res = await acceptInviteInApp(inviteId, needsProfile ? fd : null);
          if (!res.ok) setError(res.error);
          else window.location.href = `/doctor/p/${res.linkId}`;
        })
      }
    >
      <p className="eyebrow text-accent">Invitation</p>
      <p className="mt-1 font-serif text-xl leading-snug text-ink">{patient} invited you to see her health records.</p>
      <p className="mt-1 font-mono text-xs text-muted">
        Sent {sent} · open until {until}
      </p>
      {note?.trim() && (
        <blockquote className="mt-3 border-l-2 border-accent pl-3 prose-serif-sm text-ink">
          <span className="whitespace-pre-wrap">{note}</span>
        </blockquote>
      )}
      <p className="mt-3 prose-serif-xs text-muted">You would see {sees}. Nothing else of hers, and nothing until you accept.</p>
      {needsProfile && (
        <div className="mt-4 space-y-3">
          <p className="prose-serif-xs text-ink">
            You don&rsquo;t have a clinician account yet. Add how patients should see you — it sits beside your own Oyun account.
          </p>
          <ProfileFields name={name} />
          <Declaration />
        </div>
      )}
      {error && <p className="mt-3 font-mono text-xs text-negative" role="alert">{error}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-mono text-xs font-medium text-on-accent hover:bg-accent-deep disabled:opacity-50">
          {pending ? "Opening her records…" : `Accept and see ${patient}’s records`}
        </button>
        <ConfirmButton
          describe={`the invitation from ${patient} — she will be told you declined`}
          word="Decline"
          sure="Decline — sure?"
          press="none"
          onConfirm={async () => {
            const r = await declineInviteInApp(inviteId);
            if (r.ok) setGone(true);
            return r;
          }}
          className="font-mono text-xs text-muted underline-offset-2 hover:text-negative hover:underline"
        />
      </div>
    </form>
  );
}
