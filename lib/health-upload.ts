"use client";

import { upload } from "@vercel/blob/client";

/**
 * Uploading health proof from the browser.
 *
 * Two promises this keeps that the family upload does not have to:
 *
 *  1. A photograph is ALWAYS redrawn before it leaves the phone. Drawing it
 *     onto a canvas and saving a fresh JPEG carries the pixels and nothing
 *     else — no camera details, no GPS position of the house. If a photo
 *     cannot be redrawn (a format this browser cannot open), it is refused
 *     rather than sent as it was. PDFs go as they are: a lab's report has no
 *     camera position in it, and rewriting a PDF in the browser is not safe.
 *
 *  2. It asks for private storage. Where the store does not offer it, the
 *     file goes behind an unguessable address instead — and either way the
 *     address is only ever handed to the server, which serves the file
 *     through a checked route.
 *
 * ── And one it learned the hard way: nothing here may wait for ever ──────
 * On an iPhone a photo sat at "Uploading the photo…" and never moved, and the
 * reading could not be saved. Every step that can stall now has a deadline —
 * opening the photo, sending it, registering it — an upload that has not
 * moved a byte in a while is abandoned and tried once more, and the person
 * can remove a photo at any moment. The family uploader (lib/blob-client.ts)
 * learned the same lessons first; the reasoning there applies here.
 */

export type UploadedHealthFile = { url: string; access: "private" | "public"; contentType: string; size: number };
export type UploadOptions = { signal?: AbortSignal; onProgress?: (percent: number) => void };

const MAX_EDGE = 2048;
const MAX_PDF = 20 * 1024 * 1024;
/** Opening and redrawing one photo. A step with no deadline can hang the form. */
const PREPARE_MS = 20_000;
/** Nothing sent for this long: the connection is gone, not slow. */
const STALL_MS = 30_000;
/** Whole-attempt backstop: a floor plus a pessimistic allowance per megabyte. */
const attemptMs = (bytes: number) => Math.min(10 * 60_000, 30_000 + (bytes / (1024 * 1024)) * 8_000);
/** Registering the uploaded file with the server. */
const REGISTER_MS = 30_000;

export class UploadCancelled extends Error {
  constructor() {
    super("cancelled");
    this.name = "UploadCancelled";
  }
}

export function isPdf(f: File) {
  return f.type === "application/pdf" || /\.pdf$/i.test(f.name);
}

/** `work`, or a plain error saying what took too long. */
export async function withDeadline<T>(work: Promise<T>, ms: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([work, new Promise<T>((_, reject) => (timer = setTimeout(() => reject(new Error(message)), ms)))]);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Open a photo, honouring the way the camera held it. Three ways, because
 * engines differ: some Safari versions reject the options bag rather than
 * ignore it, and where the bitmap route fails an <img> still opens the file
 * and applies its orientation itself.
 */
async function decode(file: File): Promise<{ src: CanvasImageSource; w: number; h: number; done: () => void }> {
  if (typeof createImageBitmap === "function") {
    for (const opts of [{ imageOrientation: "from-image" } as ImageBitmapOptions, undefined]) {
      try {
        const b = opts ? await createImageBitmap(file, opts) : await createImageBitmap(file);
        return { src: b, w: b.width, h: b.height, done: () => b.close?.() };
      } catch {
        /* next way */
      }
    }
  }
  const url = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("could not open"));
    i.src = url;
  }).catch(() => null);
  if (!img || !img.naturalWidth) {
    URL.revokeObjectURL(url);
    throw new Error("That photo could not be opened here. Try a screenshot of it, or save it as a JPEG first.");
  }
  return { src: img, w: img.naturalWidth, h: img.naturalHeight, done: () => URL.revokeObjectURL(url) };
}

/** Redraw a photo to strip everything but the picture. */
export async function cleanImage(file: File): Promise<File> {
  const pic = await decode(file);
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(pic.w, pic.h));
    const w = Math.max(1, Math.round(pic.w * scale));
    const h = Math.max(1, Math.round(pic.h * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("That photo could not be prepared.");
    ctx.drawImage(pic.src, 0, 0, w, h);
    let blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.85));
    // Some engines hand back nothing from toBlob under memory pressure; the
    // data-URL route still works there.
    if (!blob) blob = await (await fetch(canvas.toDataURL("image/jpeg", 0.85))).blob().catch(() => null);
    if (!blob || !blob.size) throw new Error("That photo could not be prepared.");
    return new File([blob], "photo.jpg", { type: "image/jpeg" });
  } finally {
    pic.done();
  }
}

function rid() {
  const a = new Uint8Array(12);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Whether this store takes private files — learned once per page, so a public-only store costs one refusal, not one per photo. */
let privateWorks: boolean | null = null;

const isAccessError = (e: unknown) => /private|access/i.test(String((e as Error)?.message ?? ""));

/**
 * One attempt at sending, abandoned if it stalls or overruns. Rejects with
 * `{ stalled: true }` attached when it was us that stopped it, so the caller
 * knows a retry is worth it.
 */
async function sendOnce(path: string, f: File, access: "private" | "public", opts: UploadOptions) {
  const ctl = new AbortController();
  const onOuterAbort = () => ctl.abort();
  opts.signal?.addEventListener("abort", onOuterAbort);
  let stalled = false;
  let stallTimer: ReturnType<typeof setTimeout> | undefined;
  const kick = () => {
    clearTimeout(stallTimer);
    stallTimer = setTimeout(() => {
      stalled = true;
      ctl.abort();
    }, STALL_MS);
  };
  const total = setTimeout(() => {
    stalled = true;
    ctl.abort();
  }, attemptMs(f.size));
  kick();
  try {
    return await upload(path, f, {
      access,
      handleUploadUrl: "/api/health/upload",
      contentType: f.type,
      abortSignal: ctl.signal,
      onUploadProgress: (p) => {
        kick();
        opts.onProgress?.(Math.min(99, Math.round(p.percentage)));
      },
    });
  } catch (err) {
    if (opts.signal?.aborted) throw new UploadCancelled();
    if (stalled) throw Object.assign(new Error("The connection stopped."), { stalled: true });
    throw err;
  } finally {
    clearTimeout(stallTimer);
    clearTimeout(total);
    opts.signal?.removeEventListener("abort", onOuterAbort);
  }
}

/** One file, cleaned and uploaded. The caller registers it with the server. */
export async function uploadHealthFile(file: File, journeyId: string, opts: UploadOptions = {}): Promise<UploadedHealthFile> {
  let f: File;
  if (isPdf(file)) {
    if (file.size > MAX_PDF) throw new Error("That PDF is over 20 MB.");
    f = new File([file], "report.pdf", { type: "application/pdf" });
  } else {
    f = await withDeadline(cleanImage(file), PREPARE_MS, "That photo took too long to prepare. Try a screenshot of it instead.");
  }
  if (opts.signal?.aborted) throw new UploadCancelled();
  opts.onProgress?.(0);

  const path = `health/${journeyId}/${rid()}${isPdf(f) ? ".pdf" : ".jpg"}`;
  let access: "private" | "public" = privateWorks === false ? "public" : "private";
  let retried = false;
  for (;;) {
    try {
      const r = await sendOnce(path, f, access, opts);
      if (access === "private") privateWorks = true;
      opts.onProgress?.(100);
      return { url: r.url, access, contentType: f.type, size: f.size };
    } catch (err) {
      if (err instanceof UploadCancelled) throw err;
      // A store without private files says so: use the unguessable address.
      if (access === "private" && isAccessError(err)) {
        privateWorks = false;
        access = "public";
        continue;
      }
      // A stall on a phone is usually the connection blinking: once more.
      if ((err as { stalled?: boolean }).stalled && !retried) {
        retried = true;
        continue;
      }
      if ((err as { stalled?: boolean }).stalled) throw new Error("The upload stopped — check your connection and try again.");
      throw err;
    }
  }
}

/** Register with the server, but never wait for ever on it. */
export function registerWithDeadline<T>(work: Promise<T>): Promise<T> {
  return withDeadline(work, REGISTER_MS, "The upload finished but could not be saved — try again.");
}
