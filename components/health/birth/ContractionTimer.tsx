"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/ui/Confirm";
import {
  clearContractions,
  removeContraction,
  saveLabourNote,
  startContraction,
  stopContraction,
} from "@/app/health/birth/timer/actions";
import {
  FORGOTTEN_AFTER_SEC,
  LABOUR_ALWAYS,
  LABOUR_NOTE_MAX,
  clock,
  contractionRows,
  spoken,
  summarise,
  type LabourWords,
} from "@/lib/labour";
import { phoneParts } from "@/lib/when-to-call";

interface Item {
  id: string;
  startedAt: string;
  endedAt: string | null;
}

/** How often the page looks for a tap made on the other phone. */
const SYNC_MS = 15_000;

/** The phone's own clock and time zone — so only ever called once the page is on the phone. */
const localTime = (ms: number) =>
  new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/**
 * The contraction timer — lib/labour.ts.
 *
 * One large button: press when it starts, press when it eases. Under it, how
 * long each lasted and how far apart they are, and one sentence to read to
 * the midwife. It never says when to go in; beside the numbers it shows what
 * her own hospital told her, typed in ahead of time.
 *
 * Taps are timed on the phone and saved straight away, so two phones in the
 * same room show the same list and a lost signal cannot stretch a
 * contraction. The screen is kept awake while one is being timed.
 */
export function ContractionTimer({
  initial,
  note,
  words,
  reader,
}: {
  initial: Item[];
  note: string | null;
  words: LabourWords;
  reader: "MOTHER" | "PARTNER";
}) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initial);
  const [now, setNow] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(note ?? "");
  const [line, setLine] = useState(0);

  // What the server has is the truth; a tap shows at once and is then
  // replaced by it. Keyed on the content, not the array, so a refresh that
  // brings nothing new does not disturb the screen.
  const sig = JSON.stringify(initial);
  useEffect(() => {
    setItems(JSON.parse(sig) as Item[]);
  }, [sig]);
  useEffect(() => setNoteText(note ?? ""), [note]);

  // The clock starts once the page is on the phone, so the server and the
  // phone never disagree about what was drawn first.
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Pick up the other phone's taps.
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, SYNC_MS);
    return () => clearInterval(t);
  }, [router]);

  const rows = useMemo(() => contractionRows(items), [items]);
  const running = rows.find((r) => r.end === null) ?? null;
  const runningSec = running && now !== null ? Math.max(0, Math.round((now - running.start) / 1000)) : 0;
  const forgotten = running !== null && runningSec > FORGOTTEN_AFTER_SEC;
  const last = [...rows].reverse().find((r) => r.end !== null) ?? null;
  const sinceLastStart = !running && last && now !== null ? Math.max(0, Math.round((now - last.start) / 1000)) : null;
  const summary = now !== null ? summarise(rows, now) : null;

  // Keep the screen on while one is being timed.
  const lock = useRef<{ release: () => Promise<void> } | null>(null);
  useEffect(() => {
    let gone = false;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } };
    if (running && nav.wakeLock) {
      nav.wakeLock
        .request("screen")
        .then((l) => {
          if (gone) void l.release();
          else lock.current = l;
        })
        .catch(() => {});
    }
    return () => {
      gone = true;
      void lock.current?.release().catch(() => {});
      lock.current = null;
    };
  }, [running?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function press() {
    setError(null);
    const at = new Date().toISOString();
    if (running) {
      const id = running.id;
      setItems((xs) => xs.map((x) => (x.id === id ? { ...x, endedAt: at } : x)));
      setLine((n) => n + 1);
      start(async () => {
        const res = await stopContraction(id, at);
        if (!res.ok) setError(res.error);
        router.refresh();
      });
    } else {
      const temp = `new-${at}`;
      setItems((xs) => [...xs, { id: temp, startedAt: at, endedAt: null }]);
      start(async () => {
        const res = await startContraction(at);
        if (!res.ok) {
          setError(res.error);
          setItems((xs) => xs.filter((x) => x.id !== temp));
        } else {
          setItems((xs) => xs.map((x) => (x.id === temp ? { id: res.id, startedAt: res.startedAt, endedAt: null } : x)));
        }
        router.refresh();
      });
    }
  }

  function remove(id: string) {
    setItems((xs) => xs.filter((x) => x.id !== id));
    start(async () => {
      if (!id.startsWith("new-")) {
        const res = await removeContraction(id);
        if (!res.ok) setError(res.error);
      }
      router.refresh();
    });
  }

  // A tap made a moment ago is still being saved; do not let a second tap
  // try to stop a contraction the server has not been told about yet.
  const saving = running?.id.startsWith("new-") ?? false;
  const shown = [...rows].reverse().slice(0, 30);
  // The server does not know her time zone. Times are left blank in what it
  // sends and filled in on the phone, so the two never disagree.
  const timeOf = (ms: number) => (now === null ? "" : localTime(ms));
  const wordLine = words.lines[line % words.lines.length];

  return (
    <div className="space-y-6">
      {/* ── The button ── */}
      <section aria-label="Timer" className="rounded-2xl border border-border bg-surface p-5 text-center">
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted" aria-live="polite">
          {running ? "Contraction — timing" : sinceLastStart !== null ? "Since the last one began" : "Ready"}
        </p>
        <p className="mt-1 font-serif text-5xl tabular-nums text-ink" data-testid="timer-clock">
          {running ? clock(runningSec) : sinceLastStart !== null ? clock(sinceLastStart) : "0:00"}
        </p>
        <button
          type="button"
          onClick={press}
          disabled={saving}
          className={`mt-4 inline-flex min-h-[4.5rem] w-full items-center justify-center rounded-2xl px-4 font-serif text-xl transition-colors disabled:opacity-60 ${
            running ? "border-2 border-accent bg-bg text-accent" : "bg-accent text-on-accent"
          }`}
        >
          {running ? "It has eased" : "A contraction has started"}
        </button>
        {forgotten && running && (
          <p className="mt-3 prose-serif-xs text-muted">
            This one has been running for more than five minutes. If it was not stopped,{" "}
            <button type="button" onClick={() => remove(running.id)} className="text-accent underline underline-offset-4">
              take it off the list
            </button>
            .
          </p>
        )}
        {error && <p className="mt-3 prose-serif-xs text-negative">{error}</p>}
      </section>

      {/* ── What her own hospital said ── */}
      <section aria-labelledby="hospital-said" className="rounded-2xl border border-accent/40 bg-accent/[0.05] p-5">
        <h2 id="hospital-said" className="eyebrow mb-1.5 text-accent">
          What your hospital told you
        </h2>
        {editingNote ? (
          <div>
            <label htmlFor="labour-note" className="sr-only">
              What your hospital or midwife told you about when to come in
            </label>
            <textarea
              id="labour-note"
              value={noteText}
              maxLength={LABOUR_NOTE_MAX}
              rows={4}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="In their words: when to ring, when to come in, and the number of the labour ward."
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <div className="mt-2 flex gap-4 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const res = await saveLabourNote(noteText);
                    if (res.ok) setEditingNote(false);
                    else setError(res.error);
                    router.refresh();
                  })
                }
                className="py-2 underline underline-offset-4 hover:text-accent disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingNote(false);
                  setNoteText(note ?? "");
                }}
                className="py-2 underline underline-offset-4 hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {note ? (
              <p className="whitespace-pre-line break-words font-serif text-lg text-ink">
                {phoneParts(note).map((part, i) =>
                  part.tel ? (
                    <a key={i} href={`tel:${part.tel}`} className="text-accent underline underline-offset-4">
                      {part.text}
                    </a>
                  ) : (
                    <span key={i}>{part.text}</span>
                  ),
                )}
              </p>
            ) : (
              <p className="max-w-prose prose-serif-sm text-ink/85">
                Nothing written yet. Ask at {reader === "MOTHER" ? "your" : "her"} next appointment when they want to be
                rung and when to come in, and write their answer here, with the labour ward&apos;s number. Oyun does not
                decide that for you: it depends on things only they know.
              </p>
            )}
            <button
              type="button"
              onClick={() => setEditingNote(true)}
              className="mt-2 inline-flex min-h-11 items-center font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-accent"
            >
              {note ? "Change it" : "Write it down"}
            </button>
          </>
        )}
        <p className="mt-2 border-t border-accent/20 pt-2 prose-serif-xs text-ink/85">{LABOUR_ALWAYS}</p>
      </section>

      {/* ── For the midwife ── */}
      <section aria-labelledby="for-midwife" className="rounded-2xl border border-border bg-surface p-5">
        <h2 id="for-midwife" className="eyebrow mb-1.5 text-muted">
          To tell the midwife
        </h2>
        {summary ? (
          <p className="font-serif text-lg text-ink" data-testid="timer-summary">
            {spoken(summary)}
          </p>
        ) : (
          <p className="prose-serif-sm text-muted">Once two have been timed, how long they last and how far apart they are will be said here.</p>
        )}
      </section>

      {/* ── The list ── */}
      {rows.length > 0 && (
        <section aria-labelledby="timed">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <h2 id="timed" className="eyebrow text-muted">
              Timed · {rows.length}
            </h2>
            <ConfirmButton
              press="none"
              word="Clear all"
              describe="every timed contraction"
              onConfirm={async () => {
                const res = await clearContractions();
                if (!res.ok) {
                  setError(res.error);
                  return { ok: false };
                }
                setItems([]);
                router.refresh();
              }}
              className="py-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-negative"
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 border-b border-border px-4 py-2 font-mono text-[0.58rem] uppercase tracking-widest text-muted">
              <span>Began</span>
              <span className="text-right">Lasted</span>
              <span className="text-right">Apart</span>
              <span className="sr-only">Remove</span>
            </div>
            <ul>
              {shown.map((r) => (
                <li key={r.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 border-b border-border/60 px-4 py-2 last:border-b-0">
                  <span className="prose-serif-sm text-ink">{timeOf(r.start)}</span>
                  <span className="text-right font-mono text-sm tabular-nums text-ink">{r.lengthSec === null ? "…" : clock(r.lengthSec)}</span>
                  <span className="text-right font-mono text-sm tabular-nums text-muted">{r.gapSec === null ? "—" : clock(r.gapSec)}</span>
                  <button
                    type="button"
                    aria-label={`Remove the contraction at ${timeOf(r.start)}`}
                    onClick={() => remove(r.id)}
                    className="-mr-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:text-negative"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {rows.length > shown.length && <p className="mt-2 prose-serif-xs text-muted">Showing the latest {shown.length}.</p>}
          <p className="mt-2 prose-serif-xs text-muted">“Apart” is from the start of one to the start of the next.</p>
        </section>
      )}

      {/* ── Words ── */}
      <section aria-labelledby="words" className="rounded-2xl border border-border bg-surface p-5">
        <h2 id="words" className="eyebrow mb-2 text-muted">
          {words.heading}
        </h2>
        <ul className="space-y-1.5">
          {words.breathing.map((b) => (
            <li key={b} className="prose-serif-sm text-ink">
              {b}
            </li>
          ))}
        </ul>
        <figure className="mt-4 border-l-2 border-accent/50 pl-4" aria-live="polite">
          <blockquote className="font-serif text-lg leading-relaxed text-ink">
            {wordLine.ref ? `“${wordLine.text.replace(/[“”]/g, "")}”` : wordLine.text}
          </blockquote>
          {wordLine.ref && <figcaption className="mt-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted">{wordLine.ref}</figcaption>}
        </figure>
        <button
          type="button"
          onClick={() => setLine((n) => n + 1)}
          className="mt-2 inline-flex min-h-11 items-center font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-accent"
        >
          Another
        </button>
        {words.prayers.length > 0 && (
          <ul className="mt-2 space-y-1.5 border-t border-border/70 pt-3">
            {words.prayers.map((p) => (
              <li key={p} className="prose-serif-sm italic text-ink/85">
                {p}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
