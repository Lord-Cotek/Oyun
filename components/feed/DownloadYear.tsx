"use client";

import { useState } from "react";
import { makeZip, photoName, type ZipEntry } from "@/lib/zip-browser";

export type DownloadItem = { url: string; at: string; type: "image" | "video" };

/** A part of the download, kept small enough for a phone to hold. */
const PART_BYTES = 250 * 1024 * 1024;

const EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/heic": ".heic",
  "image/heif": ".heif",
  "image/gif": ".gif",
  "video/mp4": ".mp4",
  "video/quicktime": ".mov",
  "video/webm": ".webm",
};

function extFor(url: string, type: string | null): string {
  if (type && EXT[type.split(";")[0].trim()]) return EXT[type.split(";")[0].trim()];
  const m = /\.([a-z0-9]{2,5})(?:$|\?)/i.exec(new URL(url).pathname);
  return m ? `.${m[1].toLowerCase()}` : ".jpg";
}

/**
 * Fetched straight from where the photo is kept; where the browser is not
 * allowed to, through this site's own photo proxy (signed-in people only,
 * Vercel Blob addresses only).
 */
async function fetchOne(url: string): Promise<{ data: Uint8Array; type: string | null } | null> {
  for (const src of [url, `/api/blob/proxy?url=${encodeURIComponent(url)}`]) {
    try {
      const res = await fetch(src, { cache: "no-store" });
      if (!res.ok) continue;
      return { data: new Uint8Array(await res.arrayBuffer()), type: res.headers.get("content-type") };
    } catch {
      // Try the next way.
    }
  }
  return null;
}

function save(blob: Blob, name: string) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 60_000);
}

/**
 * Every photograph and video of a year, in one ZIP (or a few, for a big
 * year), named by the day it was shared. Only what this person can already
 * see: the list comes from the same page, under the same rules.
 */
export function DownloadYear({ year, items, title }: { year: number; items: DownloadItem[]; title: string }) {
  const [state, setState] = useState<{ done: number; failed: number; running: boolean; finished: boolean }>({
    done: 0,
    failed: 0,
    running: false,
    finished: false,
  });
  if (items.length === 0) return null;
  const videos = items.filter((i) => i.type === "video").length;
  const what = videos > 0 ? "photos and videos" : items.length === 1 ? "photo" : "photos";

  async function run() {
    setState({ done: 0, failed: 0, running: true, finished: false });
    const used = new Map<string, number>();
    let part: ZipEntry[] = [];
    let bytes = 0;
    let partNo = 0;
    let failed = 0;
    const base = `${title.replace(/[^\p{L}\p{N} ]+/gu, "").trim() || "Photos"} ${year}`;
    const flush = (last: boolean) => {
      if (part.length === 0) return;
      partNo += 1;
      const name = last && partNo === 1 ? `${base}.zip` : `${base} part ${partNo}.zip`;
      save(makeZip(part), name);
      part = [];
      bytes = 0;
    };
    // Oldest first, so the parts run through the year in order.
    const sorted = [...items].sort((a, b) => a.at.localeCompare(b.at));
    for (let i = 0; i < sorted.length; i++) {
      const it = sorted[i];
      const got = await fetchOne(it.url);
      if (!got) {
        failed += 1;
      } else {
        const at = new Date(it.at);
        part.push({ name: photoName(at, extFor(it.url, got.type), used), data: got.data, date: at });
        bytes += got.data.length;
        if (bytes >= PART_BYTES) flush(false);
      }
      setState({ done: i + 1, failed, running: true, finished: false });
    }
    flush(true);
    setState({ done: sorted.length, failed, running: false, finished: true });
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3">
      <button
        type="button"
        onClick={run}
        disabled={state.running}
        className="inline-flex min-h-11 items-center rounded-lg border border-accent/40 px-4 font-mono text-xs text-accent transition-colors hover:bg-accent/10 disabled:opacity-60"
      >
        {state.running ? `Gathering ${state.done} of ${items.length}…` : `Download ${year}'s ${what} (${items.length})`}
      </button>
      <p className="font-mono text-[0.65rem] text-muted" aria-live="polite">
        {state.finished
          ? state.failed > 0
            ? `Saved. ${state.failed} could not be fetched just now — try again later for those.`
            : "Saved to your downloads, named by the day each was shared."
          : "A ZIP file, named by the day each was shared. A big year comes in parts."}
      </p>
    </div>
  );
}
