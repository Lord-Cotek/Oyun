"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { lookUpClinician, shareWithClinician, changeSharing, stopSharing, setPostForDoctor } from "@/app/health/doctor/actions";
import { ConfirmButton } from "@/components/ui/Confirm";

const btn = "inline-flex min-h-11 items-center rounded-lg px-4 font-mono text-xs font-medium disabled:opacity-50";
const box = "mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]";

/** What is shared and what is not — the same list she agrees to, and keeps seeing. */
export function WhatIsShared({ photos, appointments }: { photos: boolean; appointments: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="eyebrow mb-2 text-positive">Your doctor sees</p>
        <ul className="space-y-1.5 prose-serif-xs text-ink">
          <li>Your health log — readings, symptoms and notes</li>
          <li>Medicines, and the doses you marked taken</li>
          <li>Tests and vaccines</li>
          <li>Your stage and due date</li>
          {appointments && <li>Appointments and scans, with what came of them</li>}
          {photos && <li>Photographs you attached to readings and tests</li>}
          <li>Only the Life posts you choose, one by one</li>
        </ul>
      </div>
      <div>
        <p className="eyebrow mb-2 text-muted">Never</p>
        <ul className="space-y-1.5 prose-serif-xs text-muted">
          <li>Your other Life posts and photos</li>
          <li>Letters, your journal and your moods</li>
          <li>Your circle and anything they write</li>
          <li>Requests for prayer or support</li>
          {!appointments && <li>Appointments and scans</li>}
          {!photos && <li>Photographs on readings and tests</li>}
        </ul>
      </div>
    </div>
  );
}

/** Enter a code, see who it is and what they will see, then agree. */
export function ShareWithDoctor({ initialCode = "" }: { initialCode?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [found, setFound] = useState<{ code: string; line: string; displayName: string } | null>(null);
  const [photos, setPhotos] = useState(true);
  const [appointments, setAppointments] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (done) {
    return (
      <p className="rounded-lg border border-positive/40 bg-positive/[0.06] p-4 prose-serif-sm text-ink" role="status">
        Shared with {done}. You can change what they see, or stop, at any time on this page.
      </p>
    );
  }

  return (
    <div>
      {!found ? (
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            start(async () => {
              const r = await lookUpClinician(code);
              if (r.ok) setFound({ code: r.code, line: r.line, displayName: r.displayName });
              else setError(r.error);
            });
          }}
        >
          <label className="block min-w-0 flex-1">
            <span className="eyebrow mb-2 block text-muted">Your doctor&rsquo;s clinic code</span>
            <input
              id="clinic-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="K7Q-3PM"
              autoComplete="off"
              autoCapitalize="characters"
              maxLength={12}
              className="w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-lg uppercase tracking-[0.12em] text-ink placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </label>
          <button type="submit" disabled={pending || !code.trim()} className={`${btn} bg-accent text-on-accent hover:bg-accent-deep`}>
            {pending ? "Looking…" : "Find"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-accent/40 bg-accent/[0.06] p-4">
            <p className="eyebrow text-accent">Share with</p>
            <p className="mt-1 font-serif text-xl text-ink">{found.line}</p>
            <button type="button" onClick={() => { setFound(null); setAgreed(false); }} className="mt-1 font-mono text-[0.7rem] text-muted underline underline-offset-2">
              Not who you expected? Enter the code again
            </button>
          </div>
          <div className="space-y-2">
            <label className="flex items-start gap-2">
              <input type="checkbox" checked={appointments} onChange={(e) => setAppointments(e.target.checked)} className={box} />
              <span className="prose-serif-xs text-ink">Include appointments and scans</span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" checked={photos} onChange={(e) => setPhotos(e.target.checked)} className={box} />
              <span className="prose-serif-xs text-ink">Include photographs on readings and tests (a home test, a result letter)</span>
            </label>
          </div>
          <WhatIsShared photos={photos} appointments={appointments} />
          <label className="flex items-start gap-2 rounded-lg border border-border p-3">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className={box} />
            <span className="prose-serif-xs text-ink">
              I want {found.displayName} to see the records above. I understand Oyun does not watch my readings or alert
              them — for anything urgent I contact my maternity unit or emergency services myself. I can stop sharing at
              any time.
            </span>
          </label>
          <button
            type="button"
            disabled={pending || !agreed}
            onClick={() =>
              start(async () => {
                setError(null);
                const r = await shareWithClinician({ code: found.code, withPhotos: photos, withAppointments: appointments, agreed });
                if (!r.ok) setError(r.error ?? "That didn’t work.");
                else {
                  setDone(found.displayName);
                  router.refresh();
                }
              })
            }
            className={`${btn} w-full justify-center bg-accent text-on-accent hover:bg-accent-deep`}
          >
            {pending ? "Sharing…" : `Share with ${found.displayName}`}
          </button>
        </div>
      )}
      {error && <p className="mt-2 font-mono text-xs text-negative" role="alert">{error}</p>}
    </div>
  );
}

/** One doctor she shares with: what they see, change it, or stop. */
export function SharedDoctor({
  linkId,
  line,
  displayName,
  since,
  photos: initialPhotos,
  appointments: initialAppointments,
  views,
}: {
  linkId: string;
  line: string;
  displayName: string;
  since: string;
  photos: boolean;
  appointments: boolean;
  views: string[];
}) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initialPhotos);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [saved, setSaved] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const dirty = photos !== initialPhotos || appointments !== initialAppointments;
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <p className="font-serif text-xl text-ink">{line}</p>
      <p className="mt-0.5 font-mono text-xs text-muted">Sharing since {since}</p>
      <div className="mt-4">
        <WhatIsShared photos={photos} appointments={appointments} />
      </div>
      <div className="mt-4 space-y-2 border-t border-border pt-4">
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={appointments} onChange={(e) => setAppointments(e.target.checked)} className={box} />
          <span className="prose-serif-xs text-ink">Appointments and scans</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={photos} onChange={(e) => setPhotos(e.target.checked)} className={box} />
          <span className="prose-serif-xs text-ink">Photographs on readings and tests</span>
        </label>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            disabled={!dirty || pending}
            onClick={() =>
              start(async () => {
                const r = await changeSharing(linkId, { withPhotos: photos, withAppointments: appointments });
                setSaved(r.ok ? "Saved." : (r.error ?? "That didn’t save."));
                router.refresh();
              })
            }
            className={`${btn} border border-border text-ink hover:border-accent`}
          >
            {pending ? "Saving…" : "Save"}
          </button>
          {saved && <span className="font-mono text-xs text-positive" role="status">{saved}</span>}
          <div className="ml-auto">
            <ConfirmButton
              describe={`sharing with ${displayName}`}
              word="Stop sharing"
              sure="Stop — sure?"
              press="none"
              onConfirm={async () => {
                const r = await stopSharing(linkId);
                router.refresh();
                return r;
              }}
              className="font-mono text-xs text-negative underline-offset-2 hover:underline"
            />
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-border pt-4">
        <p className="eyebrow mb-2 text-muted">When they opened your records</p>
        {views.length ? (
          <ul className="space-y-1 font-mono text-xs text-ink">
            {views.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        ) : (
          <p className="prose-serif-xs text-muted">Not yet.</p>
        )}
      </div>
    </div>
  );
}

/** One of her Life posts, with a switch to show it to her doctor. */
export function PostForDoctor({ postId, on }: { postId: string; on: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState(on);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      aria-pressed={value}
      onClick={() =>
        start(async () => {
          const r = await setPostForDoctor(postId, !value);
          if (r.ok) {
            setValue(!value);
            router.refresh();
          }
        })
      }
      className={`${btn} shrink-0 ${value ? "border border-positive/50 bg-positive/10 text-positive" : "border border-border text-ink hover:border-accent"}`}
    >
      {value ? "Shared · take back" : "Share with doctor"}
    </button>
  );
}
