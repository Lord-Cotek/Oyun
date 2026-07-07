"use client";

import { useState, type ReactNode } from "react";
import {
  updateProfile,
  changePassword,
  updateNotifications,
  updateJourney,
} from "@/app/settings/actions";

type Result = { ok: boolean; error?: string; message?: string };
type Action = (prev: unknown, fd: FormData) => Promise<Result>;

function useAction(action: Action) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  async function run(fd: FormData) {
    setBusy(true);
    setResult(null);
    const r = await action(null, fd);
    setResult(r);
    setBusy(false);
  }
  return { busy, result, run };
}

function Status({ result }: { result: Result | null }) {
  if (!result) return null;
  return result.ok ? (
    <p className="font-mono text-xs text-positive">{result.message ?? "Saved."}</p>
  ) : (
    <p className="font-mono text-xs text-negative">{result.error ?? "Something went wrong."}</p>
  );
}

function SubmitBtn({ busy, label }: { busy: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
    >
      {busy ? "Saving…" : label}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block text-muted">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

export function ProfileForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const { busy, result, run } = useAction(updateProfile);
  return (
    <form
      action={run}
      className="space-y-3"
    >
      <Field label="Your name">
        <input name="name" defaultValue={name} placeholder="What Agbebi calls you" className={inputClass} />
      </Field>
      <Field label="Email">
        <input name="email" type="email" defaultValue={email} className={inputClass} />
      </Field>
      <div className="flex items-center gap-4">
        <SubmitBtn busy={busy} label="Save profile" />
        <Status result={result} />
      </div>
    </form>
  );
}

export function PasswordForm() {
  const { busy, result, run } = useAction(changePassword);
  return (
    <form action={run} className="space-y-3">
      <Field label="Current password">
        <input name="current" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <Field label="New password">
        <input name="next" type="password" autoComplete="new-password" minLength={8} required placeholder="At least 8 characters" className={inputClass} />
      </Field>
      <div className="flex items-center gap-4">
        <SubmitBtn busy={busy} label="Update password" />
        <Status result={result} />
      </div>
    </form>
  );
}

export function NotificationForm({
  notifyByEmail,
  weeklyDigest,
}: {
  notifyByEmail: boolean;
  weeklyDigest: boolean;
}) {
  const { busy, result, run } = useAction(updateNotifications);
  return (
    <form action={run} className="space-y-4">
      <Toggle
        name="notifyByEmail"
        defaultChecked={notifyByEmail}
        title="Email me when something happens"
        hint="A prayer, an encouragement, or a new member joining your circle."
      />
      <Toggle
        name="weeklyDigest"
        defaultChecked={weeklyDigest}
        title="Weekly email"
        hint="A gentle summary each week: this stage, a verse, and how your circle prayed."
      />
      <div className="flex items-center gap-4">
        <SubmitBtn busy={busy} label="Save preferences" />
        <Status result={result} />
      </div>
    </form>
  );
}

function Toggle({
  name,
  defaultChecked,
  title,
  hint,
}: {
  name: string;
  defaultChecked: boolean;
  title: string;
  hint: string;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 accent-[color:var(--accent)]"
      />
      <span>
        <span className="block font-mono text-sm text-ink">{title}</span>
        <span className="block font-mono text-[0.7rem] leading-relaxed text-muted">{hint}</span>
      </span>
    </label>
  );
}

export function JourneyForm({
  dueDate,
  babyName,
  babyCount,
}: {
  dueDate: string;
  babyName: string;
  babyCount: number;
}) {
  const { busy, result, run } = useAction(updateJourney);
  return (
    <form action={run} className="space-y-3">
      <Field label="Due date or birth date">
        <input name="dueDate" type="date" defaultValue={dueDate} required className={inputClass} />
      </Field>
      <Field label="How many babies?">
        <select name="babyCount" defaultValue={String(babyCount)} className={inputClass}>
          <option value="1">One</option>
          <option value="2">Twins</option>
          <option value="3">Triplets</option>
          <option value="4">More than three</option>
        </select>
      </Field>
      <Field label="Baby's name (optional)">
        <input name="babyName" defaultValue={babyName} placeholder="If you've chosen one" className={inputClass} />
      </Field>
      <div className="flex items-center gap-4">
        <SubmitBtn busy={busy} label="Save journey" />
        <Status result={result} />
      </div>
    </form>
  );
}
