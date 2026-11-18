"use client";

import { useEffect, useState } from "react";
import { discardHealthFile, registerHealthFile } from "@/app/health/log/actions";
import { isPdf, uploadHealthFile } from "@/lib/health-upload";
import { isIos } from "@/lib/shell";

type Pending = { key: string; preview: string | null; id: string | null; error: string | null };

/**
 * Photo or PDF proof for a health entry — a camera button, a gallery/PDF
 * button, thumbnails, and remove. Uploads at once (photos redrawn first, so
 * nothing but the picture leaves the phone) and tells its parent the ids.
 * Anything uploaded and then abandoned is handed back to `onAbandon` so the
 * parent can discard it if the entry is never saved.
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

  async function add(list: FileList | null) {
    if (!list) return;
    for (const f of Array.from(list).slice(0, Math.max(0, max - pending.length))) {
      const key = `${Date.now()}-${Math.random()}`;
      setPending((p) => [...p, { key, preview: isPdf(f) ? null : URL.createObjectURL(f), id: null, error: null }]);
      try {
        const up = await uploadHealthFile(f, journeyId);
        const reg = await registerHealthFile(up);
        if (!reg.ok) throw new Error(reg.error);
        setPending((p) => p.map((x) => (x.key === key ? { ...x, id: reg.id } : x)));
      } catch (e) {
        setPending((p) => p.map((x) => (x.key === key ? { ...x, error: (e as Error).message || "That did not upload." } : x)));
      }
    }
  }

  function drop(key: string) {
    const p = pending.find((x) => x.key === key);
    if (p?.id) void discardHealthFile(p.id);
    setPending((l) => l.filter((x) => x.key !== key));
  }

  return (
    <div>
      <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {!ios && (
          <label className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-border px-3 font-mono text-xs text-ink hover:border-accent">
            📷 Take a photo
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => { void add(e.target.files); e.target.value = ""; }} />
          </label>
        )}
        <label className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-border px-3 font-mono text-xs text-ink hover:border-accent">
          {ios ? "Add a photo or PDF" : "Choose photo or PDF"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/heic,application/pdf" multiple className="sr-only" onChange={(e) => { void add(e.target.files); e.target.value = ""; }} />
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
              {!p.id && !p.error && <span className="absolute inset-0 flex items-center justify-center bg-black/40 font-mono text-[0.6rem] text-white">…</span>}
              {p.error && <span className="absolute inset-0 flex items-center justify-center bg-negative/70 font-mono text-[0.55rem] text-white">failed</span>}
              <button type="button" aria-label="Remove this file" onClick={() => drop(p.key)} className="absolute right-0 top-0 h-6 w-6 rounded-bl-lg bg-black/60 font-mono text-xs text-white">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      {pending.some((p) => p.error) && <p className="mt-1 font-mono text-[0.62rem] text-negative">{pending.find((p) => p.error)?.error}</p>}
    </div>
  );
}
