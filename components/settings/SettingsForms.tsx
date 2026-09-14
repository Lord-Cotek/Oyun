"use client";

import { useState, type ReactNode } from "react";
import { CATEGORIES } from "@/lib/notify-prefs";
import { uploadToBlob, filesFromForm } from "@/lib/blob-client";
import { Avatar } from "@/components/ui/Avatar";
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
  image,
}: {
  name: string;
  email: string;
  image?: string | null;
}) {
  const { busy, result, run } = useAction(updateProfile);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || uploading) return;
    setUploadError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const files = filesFromForm(form, "photo");
    if (files.length) {
      setUploading(true);
      try {
        const [url] = await uploadToBlob(files.slice(0, 1), "people");
        if (url) fd.set("photoUrl", url);
      } catch (err) {
        setUploading(false);
        setUploadError((err as Error).message);
        return;
      }
      setUploading(false);
    }
    fd.delete("photo");
    await run(fd);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex items-center gap-4">
        <Avatar name={name} photoUrl={preview ?? image ?? null} size={64} />
        <div className="min-w-0 flex-1">
          <span className="eyebrow mb-2 block text-muted">Profile photo</span>
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 font-mono text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:font-mono file:text-xs file:text-on-accent"
          />
        </div>
      </div>
      <Field label="Your name">
        <input name="name" defaultValue={name} placeholder="What Agbebi calls you" className={inputClass} />
      </Field>
      <Field label="Email">
        <input name="email" type="email" defaultValue={email} className={inputClass} />
      </Field>
      {uploadError && (
        <p className="font-mono text-xs text-negative">{uploadError}</p>
      )}
      <div className="flex items-center gap-4">
        <SubmitBtn busy={busy || uploading} label={uploading ? "Uploading…" : "Save profile"} />
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

/**
 * What may interrupt this family.
 *
 * This used to be two switches — email me when something happens, and a weekly
 * summary — which is all or nothing across eleven different kinds of thing.
 * Somebody who wanted to know when a scan was coming up also got a buzz for
 * every reaction to a photograph, and their only remedy was to switch the lot
 * off, which is what people do.
 *
 * Five rows now, one per thing a family recognises, plus the two delivery
 * switches underneath. The rows and their wording live in lib/notify-prefs.ts
 * beside the map that assigns every notification type to one.
 */
export function NotificationForm({
  notifyByEmail,
  weeklyDigest,
  categories,
}: {
  notifyByEmail: boolean;
  weeklyDigest: boolean;
  categories: Record<string, boolean>;
}) {
  const { busy, result, run } = useAction(updateNotifications);
  return (
    <form action={run} className="space-y-5">
      <div className="space-y-4">
        {CATEGORIES.map((c) => (
          <Toggle
            key={c.field}
            name={c.field}
            defaultChecked={categories[c.field] !== false}
            title={c.label}
            hint={c.hint}
          />
        ))}
      </div>

      <p className="prose-serif-xs max-w-prose text-muted">
        These decide what taps you on the shoulder. Everything is still written
        down and still appears in the bell either way — switching a row off
        never loses anything, it only stops the interruption.
      </p>

      <div className="space-y-4 border-t border-border pt-5">
        <p className="eyebrow text-muted">How it reaches you</p>
        <Toggle
          name="notifyByEmail"
          defaultChecked={notifyByEmail}
          title="Email as well as the phone"
          hint="For the rows you have left on above."
        />
        <Toggle
          name="weeklyDigest"
          defaultChecked={weeklyDigest}
          title="One quiet summary each week"
          hint="This stage, a verse, and how your circle prayed. Sent whatever the rows above say — it is a look back, not an interruption."
        />
      </div>

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
