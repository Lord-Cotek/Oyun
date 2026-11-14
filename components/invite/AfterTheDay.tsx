"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CoverPicker } from "@/components/ui/CoverPicker";

type Sent = { ok: true; sent: number; failed: number } | { ok: false; error: string };

/**
 * After the day: photographs from it, a thank-you for coming, and a way to
 * send that to the people who came.
 *
 * ── Who sees the photographs ─────────────────────────────────────────────
 * Anybody holding the invitation's link — said plainly above the picker,
 * because a host choosing pictures of a family party should know exactly
 * where they go. The link was unguessable and unindexed before; it still is.
 *
 * ── Who is emailed ───────────────────────────────────────────────────────
 * Only guests who said yes, left an address, and replied on a form that
 * promised "a thank-you afterwards". Everybody else can be reached with the
 * WhatsApp message, which the host sends themself.
 *
 * Actions arrive as props, so this one file serves both apps.
 */
export function AfterTheDay({
  title,
  url,
  photos,
  note,
  emailWaiting,
  emailSent,
  coverChoices = [],
  onAddPhoto,
  onRemovePhoto,
  onSaveNote,
  onEmail,
}: {
  title: string;
  url: string;
  photos: string[];
  note: string | null;
  emailWaiting: number;
  emailSent: number;
  coverChoices?: string[];
  onAddPhoto: (url: string | null) => Promise<{ ok: boolean }>;
  onRemovePhoto: (url: string) => Promise<{ ok: boolean; error?: string }>;
  onSaveNote: (text: string) => Promise<{ ok: boolean; error?: string }>;
  onEmail: () => Promise<Sent>;
}) {
  const router = useRouter();
  const [text, setText] = useState(note ?? "");
  const [saved, setSaved] = useState(false);
  const [said, setSaid] = useState<{ ok: boolean; text: string } | null>(null);
  const [asking, setAsking] = useState(false);
  const [busy, start] = useTransition();

  const message = [
    `Thank you so much for coming to ${title}! 💛`,
    note?.trim() || null,
    "",
    photos.length ? `Some photos from the day: ${url}` : `The invitation, any time: ${url}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  return (
    <div className="mt-4 rounded-xl border border-accent/30 bg-bg/50 p-4">
      <p className="font-serif text-lg text-ink">After the day</p>
      <p className="mt-0.5 prose-serif-xs text-muted">
        A thank-you for coming, and a few photographs. They appear on the
        invitation page for anyone who has its link.
      </p>

      {photos.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {photos.map((p) => (
            <li key={p} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p} alt="" className="aspect-square w-full rounded-lg object-cover" />
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  start(async () => {
                    await onRemovePhoto(p);
                    router.refresh();
                  })
                }
                aria-label="Remove this photo"
                className="absolute right-1 top-1 rounded-full bg-bg/90 px-2 py-0.5 font-mono text-[0.6rem] text-ink"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      {photos.length < 12 && (
        <div className="mt-3">
          <CoverPicker
            key={photos.length}
            current={null}
            choices={coverChoices.filter((c) => !photos.includes(c))}
            action={async (u) => {
              const res = await onAddPhoto(u);
              router.refresh();
              return res;
            }}
            label={photos.length ? "Add another photo" : "Add photos from the day"}
          />
        </div>
      )}

      <label className="mt-4 block">
        <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
          Your thank-you for coming
        </span>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setSaved(false);
          }}
          rows={3}
          maxLength={600}
          placeholder="Thank you for making the day so special — we felt so loved."
          className="mt-1.5 w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>
      <button
        type="button"
        disabled={busy || text.trim() === (note ?? "").trim()}
        onClick={() =>
          start(async () => {
            const res = await onSaveNote(text);
            setSaved(res.ok);
            router.refresh();
          })
        }
        className="mt-1 font-mono text-[0.68rem] text-accent underline underline-offset-4 disabled:text-muted disabled:no-underline"
      >
        {saved ? "Saved" : "Save the thank-you"}
      </button>

      {(photos.length > 0 || (note ?? "").trim()) && (
        <div className="mt-4 border-t border-border/70 pt-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">Send it</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-accent px-3.5 py-2 font-mono text-xs font-medium text-on-accent hover:bg-accent-deep"
            >
              Send on WhatsApp
            </a>
            {emailWaiting > 0 && !asking && (
              <button
                type="button"
                onClick={() => {
                  setAsking(true);
                  setSaid(null);
                }}
                className="rounded-lg border border-accent/60 px-3.5 py-2 font-mono text-xs text-accent hover:bg-accent/[0.06]"
              >
                Email it to {emailWaiting === 1 ? "the 1 guest" : `the ${emailWaiting} guests`} who came
              </button>
            )}
          </div>
          <p className="mt-1.5 prose-serif-xs text-muted">
            {emailWaiting > 0
              ? `Email reaches the guests who said yes, left an address and agreed to a thank-you afterwards${emailSent ? ` — ${emailSent} already have it` : ""}. WhatsApp reaches everyone else.`
              : emailSent > 0
                ? `Emailed to ${emailSent === 1 ? "the 1 guest" : `all ${emailSent} guests`} who agreed to it. WhatsApp reaches everyone else.`
                : "Nobody agreed to an email afterwards when they replied, so WhatsApp is the way to reach them."}
          </p>
          {asking && (
            <div className="mt-2 rounded-lg border border-accent/40 bg-accent/[0.05] p-3">
              <p className="prose-serif-xs text-ink">
                Send your thank-you{photos.length ? " and photos" : ""} to {emailWaiting === 1 ? "1 guest" : `${emailWaiting} guests`} now? Each gets it once.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    start(async () => {
                      const res = await onEmail();
                      setAsking(false);
                      setSaid(
                        res.ok
                          ? { ok: true, text: res.failed ? `Sent to ${res.sent}. ${res.failed} could not be delivered — try again later.` : `Sent to ${res.sent === 1 ? "1 guest" : `${res.sent} guests`}.` }
                          : { ok: false, text: res.error },
                      );
                      router.refresh();
                    })
                  }
                  className="rounded-lg bg-accent px-3.5 py-2 font-mono text-xs font-medium text-on-accent disabled:opacity-60"
                >
                  {busy ? "Sending…" : "Yes, send it"}
                </button>
                <button type="button" onClick={() => setAsking(false)} className="rounded-lg px-3 py-2 font-mono text-xs text-muted hover:text-ink">
                  Not yet
                </button>
              </div>
            </div>
          )}
          {said && (
            <p role="status" className={`mt-2 font-mono text-[0.66rem] ${said.ok ? "text-positive" : "text-negative"}`}>
              {said.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
