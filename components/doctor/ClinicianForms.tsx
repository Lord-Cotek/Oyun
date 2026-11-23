"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { registerClinician, becomeClinician, updateClinicianProfile } from "@/app/doctor/actions";

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
