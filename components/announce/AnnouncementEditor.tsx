"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { AnnouncementCard } from "@/components/announce/AnnouncementCard";
import { uploadToBlob } from "@/lib/blob-client";
import {
  BIRTH_VERSES,
  MAX_BABIES,
  MAX_NAMES,
  MAX_PHOTOS_ANN,
  STYLES,
  type AnnouncementData,
  type Baby,
  type StyleKey,
} from "@/lib/announcement";
import { saveAnnouncement } from "@/app/journey/announce/actions";

const input =
  "w-full rounded-lg border border-border bg-bg px-3 py-2.5 font-body text-[0.95rem] text-ink placeholder:text-muted focus:border-accent focus:outline-none";
const label = "eyebrow mb-1.5 block text-muted";
const quiet = "font-mono text-[0.68rem] text-muted underline-offset-4 hover:text-accent hover:underline disabled:opacity-50";

/**
 * Making the announcement. Every change shows at once in the card beside it
 * (below it, on a phone) — the same card everyone who opens the link sees.
 */
export function AnnouncementEditor({
  initial,
  link,
  general = false,
}: {
  initial: AnnouncementData;
  link: string | null;
  /** Without religious content — lib/voice.ts. No verse is offered; one already on the card can only be taken off. */
  general?: boolean;
}) {
  const [d, setD] = useState<AnnouncementData>(initial);
  const [path, setPath] = useState<string | null>(link);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof AnnouncementData>(k: K, v: AnnouncementData[K]) => setD((x) => ({ ...x, [k]: v }));
  const setBaby = (i: number, b: Baby) => set("babies", d.babies.map((x, j) => (j === i ? b : x)));

  // The preview never shows an empty heading while a name is being typed.
  const preview = useMemo<AnnouncementData>(
    () => ({
      ...d,
      babies: d.babies.map((b) => ({
        fullName: b.fullName.trim() || "Your little one",
        names: b.names.filter((n) => n.name.trim()),
      })),
    }),
    [d],
  );

  async function addPhotos(files: FileList | null) {
    const list = Array.from(files ?? []);
    if (!list.length) return;
    const room = MAX_PHOTOS_ANN - d.photoUrls.length;
    if (room <= 0) return setError(`${MAX_PHOTOS_ANN} photographs is the most a card can hold.`);
    setError(null);
    setUploading(`Uploading ${Math.min(room, list.length)}…`);
    try {
      const out = await uploadToBlob(list.slice(0, room), "announcements", {
        max: room,
        onProgress: (done, total) => setUploading(`Uploading ${done} of ${total}…`),
      });
      const got = out.urls.filter((u): u is string => !!u);
      setD((x) => ({ ...x, photoUrls: [...x.photoUrls, ...got].slice(0, MAX_PHOTOS_ANN) }));
      if (out.failed.length) setError(`${out.failed.length} photo${out.failed.length === 1 ? "" : "s"} could not upload. Try a smaller one.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Those photos could not upload just now.");
    } finally {
      setUploading(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // The site's address is only known in the browser. Read after the page has
  // loaded, not while drawing: the server drew the bare path, and a first
  // draw in the browser that differed made React throw the page away and
  // start again (a visible flicker, and an error in the log).
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const fullLink = path ? `${origin}${path}` : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)]">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          setNote(null);
          start(async () => {
            const r = await saveAnnouncement(d).catch(() => ({ ok: false as const, error: "That did not save. Try again in a moment." }));
            if (r.ok) {
              setPath(r.path);
              setNote(link || path ? "Saved. Everyone with the link sees the new card." : "Your announcement is ready to share.");
            } else setError(r.error);
          });
        }}
      >
        {/* Photographs */}
        <section className="rounded-2xl border border-border bg-surface p-5">
          <p className="font-serif text-lg text-ink">Photographs</p>
          <p className="mt-0.5 prose-serif-xs text-muted">
            Up to {MAX_PHOTOS_ANN}. The first is the big one at the top of the card.
          </p>
          {d.photoUrls.length > 0 && (
            <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {d.photoUrls.map((u, i) => (
                <li key={u} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u} alt={`Photograph ${i + 1}`} className="aspect-square w-full rounded-lg object-cover" />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded-full bg-accent px-1.5 py-0.5 font-mono text-[0.55rem] text-on-accent">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`Remove photograph ${i + 1}`}
                    onClick={() => set("photoUrls", d.photoUrls.filter((x) => x !== u))}
                    className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 font-mono text-sm leading-none text-white hover:bg-black/75"
                  >
                    ×
                  </button>
                  {i > 0 && (
                    <button
                      type="button"
                      className={`${quiet} mt-1 block`}
                      onClick={() => set("photoUrls", [u, ...d.photoUrls.filter((x) => x !== u)])}
                    >
                      Make cover
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {d.photoUrls.length < MAX_PHOTOS_ANN && (
            <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-dashed border-accent/50 px-4 font-mono text-xs text-accent hover:bg-accent/5">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                multiple
                className="sr-only"
                onChange={(e) => addPhotos(e.target.files)}
                disabled={!!uploading}
              />
              {uploading ?? (d.photoUrls.length ? "Add more photographs" : "Add photographs")}
            </label>
          )}
        </section>

        {/* Names and meanings */}
        {d.babies.map((b, i) => (
          <section key={i} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-serif text-lg text-ink">{d.babies.length > 1 ? `Baby ${i + 1}` : "Their name"}</p>
              {d.babies.length > 1 && (
                <button type="button" className={quiet} onClick={() => set("babies", d.babies.filter((_, j) => j !== i))}>
                  Remove
                </button>
              )}
            </div>
            <label className="mt-3 block" htmlFor={`full-${i}`}>
              <span className={label}>Full name, as it should read</span>
              <input
                id={`full-${i}`}
                className={`${input} font-serif text-lg`}
                value={b.fullName}
                maxLength={90}
                placeholder="Ayọ̀mídé Grace Bassey"
                onChange={(e) => setBaby(i, { ...b, fullName: e.target.value })}
              />
            </label>
            <p className={`${label} mt-4`}>Each name and what it means</p>
            <ul className="space-y-2">
              {b.names.map((n, j) => (
                <li key={j} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)_auto] gap-2">
                  <input
                    aria-label={`Name ${j + 1}`}
                    className={input}
                    value={n.name}
                    maxLength={40}
                    placeholder="Ayọ̀mídé"
                    onChange={(e) => setBaby(i, { ...b, names: b.names.map((x, k) => (k === j ? { ...x, name: e.target.value } : x)) })}
                  />
                  <input
                    aria-label={`What ${n.name || `name ${j + 1}`} means`}
                    className={`${input} italic`}
                    value={n.meaning}
                    maxLength={140}
                    placeholder="My joy has come"
                    onChange={(e) => setBaby(i, { ...b, names: b.names.map((x, k) => (k === j ? { ...x, meaning: e.target.value } : x)) })}
                  />
                  <button
                    type="button"
                    aria-label={`Remove name ${j + 1}`}
                    className="px-1 font-mono text-sm text-muted hover:text-negative"
                    onClick={() => setBaby(i, { ...b, names: b.names.filter((_, k) => k !== j) })}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            {b.names.length < MAX_NAMES && (
              <button
                type="button"
                className={`${quiet} mt-2`}
                onClick={() => setBaby(i, { ...b, names: [...b.names, { name: "", meaning: "" }] })}
              >
                + Add a name
              </button>
            )}
          </section>
        ))}
        {d.babies.length < MAX_BABIES && (
          <button
            type="button"
            className={quiet}
            onClick={() => set("babies", [...d.babies, { fullName: "", names: [{ name: "", meaning: "" }] }])}
          >
            + Another baby (twins, triplets)
          </button>
        )}

        {/* The day */}
        <section className="rounded-2xl border border-border bg-surface p-5">
          <p className="font-serif text-lg text-ink">The day</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label htmlFor="ann-born" className="col-span-2 block sm:col-span-1">
              <span className={label}>Born on</span>
              <input id="ann-born" type="date" className={input} value={d.bornOn} onChange={(e) => set("bornOn", e.target.value)} required />
            </label>
            <label htmlFor="ann-time" className="block">
              <span className={label}>Time (optional)</span>
              <input
                id="ann-time"
                type="time"
                className={input}
                value={d.timeOfBirth ?? ""}
                onChange={(e) => set("timeOfBirth", e.target.value || null)}
              />
            </label>
            <label htmlFor="ann-weight" className="block">
              <span className={label}>Weight (optional)</span>
              <input
                id="ann-weight"
                className={input}
                value={d.weight ?? ""}
                maxLength={24}
                placeholder="3.4 kg"
                onChange={(e) => set("weight", e.target.value || null)}
              />
            </label>
            <label htmlFor="ann-place" className="col-span-2 block sm:col-span-1">
              <span className={label}>Place (optional)</span>
              <input
                id="ann-place"
                className={input}
                value={d.place ?? ""}
                maxLength={60}
                placeholder="The hospital or town"
                onChange={(e) => set("place", e.target.value || null)}
              />
            </label>
          </div>
        </section>

        {/* Words */}
        <section className="rounded-2xl border border-border bg-surface p-5">
          <p className="font-serif text-lg text-ink">Your words</p>
          {general ? (
            // Without religious content (lib/voice.ts) no verse is offered:
            // the list is not here to choose from. The one case left is a
            // card that already carries a verse — chosen by the other parent,
            // or before this choice was made. It is their card too, so it is
            // named plainly and can be taken off; it cannot be added here.
            d.verseRef && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-bg p-3">
                <p className="prose-serif-xs text-muted">
                  This card carries a verse chosen earlier: <span className="text-ink">{d.verseRef}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => set("verseRef", null)}
                  className="font-mono text-xs text-accent underline underline-offset-4"
                >
                  Take it off the card
                </button>
              </div>
            )
          ) : (
            <label htmlFor="ann-verse" className="mt-3 block">
              <span className={label}>A verse</span>
              <select id="ann-verse" className={input} value={d.verseRef ?? ""} onChange={(e) => set("verseRef", e.target.value || null)}>
                {BIRTH_VERSES.map((v) => (
                  <option key={v.ref} value={v.ref}>
                    {v.ref} — {v.text.length > 52 ? `${v.text.slice(0, 52)}…` : v.text}
                  </option>
                ))}
                <option value="">No verse</option>
              </select>
            </label>
          )}
          <label htmlFor="ann-message" className="mt-3 block">
            <span className={label}>A few words from you (optional)</span>
            <textarea
              id="ann-message"
              rows={4}
              maxLength={1200}
              className={`${input} resize-y`}
              placeholder={
                general
                  ? "We are so happy to introduce our little one. Thank you for every kind word that carried us here."
                  : "After years of praying, God has answered. Thank you for every prayer that carried us here."
              }
              value={d.message ?? ""}
              onChange={(e) => set("message", e.target.value || null)}
            />
          </label>
          <label htmlFor="ann-signed" className="mt-3 block">
            <span className={label}>Signed</span>
            <input
              id="ann-signed"
              className={input}
              maxLength={60}
              value={d.signedAs ?? ""}
              placeholder="Amara & Tunde"
              onChange={(e) => set("signedAs", e.target.value || null)}
            />
          </label>
        </section>

        {/* Style */}
        <section className="rounded-2xl border border-border bg-surface p-5">
          <p className="font-serif text-lg text-ink">The look of the card</p>
          <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="The look of the card">
            {(Object.keys(STYLES) as StyleKey[]).map((k) => {
              const s = STYLES[k];
              const on = d.style === k;
              return (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => set("style", k)}
                  className={`rounded-xl border p-2 text-left transition-colors ${on ? "border-accent ring-1 ring-accent" : "border-border hover:border-accent/50"}`}
                >
                  <span className="flex h-12 items-center justify-center rounded-lg" style={{ background: s.paper, border: `1px solid ${s.edge}` }}>
                    <span className="font-serif text-lg italic" style={{ color: s.ink }}>
                      Aa
                    </span>
                    <span className="ml-2 h-2.5 w-2.5 rounded-full" style={{ background: s.accent }} />
                  </span>
                  <span className="mt-1.5 block text-center font-mono text-[0.65rem] text-muted">{s.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {error && (
          <p role="alert" className="font-mono text-xs text-negative">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending || !!uploading}
          className="w-full rounded-xl bg-accent px-5 py-3.5 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
        >
          {pending ? "Saving…" : path ? "Save changes" : "Save and get the link"}
        </button>

        {fullLink && (
          <section className="rounded-2xl border border-accent/40 bg-accent/[0.07] p-5" aria-live="polite">
            <p className="font-serif text-lg text-ink">{note ?? "Your announcement's link"}</p>
            <p className="mt-1 prose-serif-xs text-muted">
              It is in Life for your circle already. Send this link to anyone else — they can send a word of welcome, and ask
              to join your circle. Close it any time from Shared outside.
            </p>
            <p className="mt-3 break-all rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs text-ink">{fullLink}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 font-mono text-xs text-on-accent hover:bg-accent-deep"
                onClick={async () => {
                  const shareData = { title: "Welcome to the world", text: `Welcome to the world, ${preview.babies.map((b) => b.fullName).join(" & ")}!`, url: fullLink };
                  try {
                    if (navigator.share) await navigator.share(shareData);
                    else {
                      await navigator.clipboard.writeText(fullLink);
                      setCopied(true);
                    }
                  } catch {
                    // They closed the share sheet; nothing to do.
                  }
                }}
              >
                Share
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent"
                onClick={async () => {
                  await navigator.clipboard.writeText(fullLink).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
                }}
              >
                {copied ? "Copied" : "Copy link"}
              </button>
              <a
                href={path!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent"
              >
                Open the page
              </a>
            </div>
          </section>
        )}
      </form>

      <aside className="lg:sticky lg:top-20 lg:self-start" aria-label="How it will look">
        <p className="eyebrow mb-3 text-muted">How it will look</p>
        <AnnouncementCard data={preview} preview />
      </aside>
    </div>
  );
}
