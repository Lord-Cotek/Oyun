"use client";

import { useEffect, useRef, useState } from "react";
import { discardHealthFile, registerHealthFile } from "@/app/health/log/actions";
import { isPdf, registerWithDeadline, uploadHealthFile, UploadCancelled } from "@/lib/health-upload";
import { isIos } from "@/lib/shell";

type Pending = {
  key: string;
  preview: string | null;
  id: string | null;
  error: string | null;
  /** null while the photo is being prepared; 0–100 while it is sent. */
  percent: number | null;
};

/**
 * Photos and PDFs the phone hands over. No HEIC: listing it tells an iPhone
 * to send its own format, which many browsers cannot open; leaving it out
 * makes the iPhone hand over a JPEG, as it does for the family's photos.
 */
const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";

/**
 * Photo or PDF proof for a health entry — used by the log, medicines and
 * tests alike. A camera button (not on iOS, where opening the camera from
 * the app is not allowed yet), a gallery/PDF button, thumbnails.
 *
 * Each file uploads on its own, side by side, so one slow photo never holds
 * up another. Each thumbnail shows how far it has got, can be removed at any
 * moment (which stops its upload), and can be tried again if it failed — so
 * nothing can leave the form stuck at "Uploading". The parent hears the ids,
 * what was removed, and whether anything is still going.
 */
export function HealthPhotoPicker({
  journeyId,
  existing = [],
  onChange,
  max = 6,
  label = "Photo proof (optional)",
}: {
  journeyId: string;
  existing?: { id: string; contentType: string }[];
  onChange: (s: { fileIds: string[]; removeFileIds: string[]; uploading: boolean }) => void;
  max?: number;
  label?: string;
}) {
  const [pending, setPending] = useState<Pending[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const files = useRef(new Map<string, File>());
  const controllers = useRef(new Map<string, AbortController>());
  // Decided after mount, so the server and the phone draw the same first frame.
  const [ios, setIos] = useState(false);
  useEffect(() => setIos(isIos()), []);

  useEffect(() => {
    onChange({
      fileIds: pending.filter((p) => p.id).map((p) => p.id!),
      removeFileIds: removed,
      uploading: pending.some((p) => !p.id && !p.error),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, removed]);

  // Leaving the form stops anything still going.
  useEffect(() => {
    const ctl = controllers.current;
    return () => ctl.forEach((c) => c.abort());
  }, []);

  const patch = (key: string, p: Partial<Pending>) => setPending((l) => l.map((x) => (x.key === key ? { ...x, ...p } : x)));

  async function run(key: string) {
    const f = files.current.get(key);
    if (!f) return;
    const ctl = new AbortController();
    controllers.current.set(key, ctl);
    patch(key, { error: null, percent: null });
    try {
      const up = await uploadHealthFile(f, journeyId, { signal: ctl.signal, onProgress: (percent) => patch(key, { percent }) });
      if (ctl.signal.aborted) return;
      const reg = await registerWithDeadline(registerHealthFile(up));
      if (!reg.ok) throw new Error(reg.error);
      if (ctl.signal.aborted) {
        void discardHealthFile(reg.id);
        return;
      }
      patch(key, { id: reg.id, percent: 100 });
    } catch (e) {
      if (e instanceof UploadCancelled || ctl.signal.aborted) return;
      patch(key, { error: (e as Error).message || "That did not upload." });
    } finally {
      if (controllers.current.get(key) === ctl) controllers.current.delete(key);
    }
  }

  function add(list: FileList | null) {
    if (!list) return;
    const room = Math.max(0, max - pending.length);
    for (const f of Array.from(list).slice(0, room)) {
      const key = `${Date.now()}-${Math.random()}`;
      files.current.set(key, f);
      setPending((p) => [...p, { key, preview: isPdf(f) ? null : URL.createObjectURL(f), id: null, error: null, percent: null }]);
      void run(key);
    }
  }

  function drop(key: string) {
    controllers.current.get(key)?.abort();
    controllers.current.delete(key);
    files.current.delete(key);
    const p = pending.find((x) => x.key === key);
    if (p?.id) void discardHealthFile(p.id);
    if (p?.preview) URL.revokeObjectURL(p.preview);
    setPending((l) => l.filter((x) => x.key !== key));
  }

  const going = pending.filter((p) => !p.id && !p.error);
  const failed = pending.find((p) => p.error);

  return (
    <div>
      <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {!ios && (
          <label className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-border px-3 font-mono text-xs text-ink hover:border-accent">
            📷 Take a photo
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
          </label>
        )}
        <label className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-border px-3 font-mono text-xs text-ink hover:border-accent">
          {ios ? "Add a photo or PDF" : "Choose photo or PDF"}
          <input type="file" accept={ACCEPT} multiple className="sr-only" onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
        </label>
      </div>
      {(pending.length > 0 || existing.length > 0) && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {existing.map((f) => {
            const gone = removed.includes(f.id);
            return (
              <li key={f.id} className={`relative h-16 w-16 overflow-hidden rounded-lg border border-border ${gone ? "opacity-30" : ""}`}>
                {f.contentType === "application/pdf" ? (
                  <span className="flex h-full items-center justify-center font-mono text-[0.6rem] text-muted">PDF</span>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/api/health/file/${f.id}`} alt="" className="h-full w-full object-cover" />
                )}
                <button type="button" aria-label={gone ? "Keep this file" : "Remove this file"} onClick={() => setRemoved((r) => (gone ? r.filter((x) => x !== f.id) : [...r, f.id]))} className="absolute right-0 top-0 h-6 w-6 rounded-bl-lg bg-black/60 font-mono text-xs text-white">
                  {gone ? "↺" : "×"}
                </button>
              </li>
            );
          })}
          {pending.map((p) => (
            <li key={p.key} className="relative h-16 w-16 overflow-hidden rounded-lg border border-border" title={p.error ?? ""}>
              {p.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.preview} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center font-mono text-[0.6rem] text-muted">PDF</span>
              )}
              {!p.id && !p.error && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 font-mono text-[0.62rem] text-white" aria-live="polite">
                  {p.percent === null ? "…" : `${p.percent}%`}
                </span>
              )}
              {p.error && (
                <button type="button" onClick={() => void run(p.key)} className="absolute inset-0 flex flex-col items-center justify-center bg-negative/75 font-mono text-[0.55rem] leading-tight text-white" aria-label="Try this upload again">
                  failed
                  <span className="underline">retry</span>
                </button>
              )}
              <button type="button" aria-label="Remove this file" onClick={() => drop(p.key)} className="absolute right-0 top-0 z-10 h-6 w-6 rounded-bl-lg bg-black/60 font-mono text-xs text-white">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      {going.length > 0 && (
        <p className="mt-1 font-mono text-[0.62rem] text-muted" role="status">
          Uploading {going.length === 1 ? "1 file" : `${going.length} files`}… tap × to remove one.
        </p>
      )}
      {failed && <p className="mt-1 font-mono text-[0.62rem] text-negative">{failed.error} Tap the photo to try again, or × to remove it.</p>}
    </div>
  );
}
