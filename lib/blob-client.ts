import { upload } from "@vercel/blob/client";
import { randomId } from "./rand";
import { MAX_PHOTOS } from "./photos";
import { shrinkImage } from "./shrink-image";

/**
 * Photos straight from the browser to Blob storage.
 *
 * ── What this used to do, and why it was bad ─────────────────────────────
 * It took `max = 6` and did `files.slice(0, max)`. Somebody put fifty-nine
 * photographs of a wedding into a milestone; six were uploaded, fifty-three
 * were dropped on the floor, the page said "Milestone saved", and nothing
 * anywhere said a word about it. Silently keeping a subset of what a person
 * handed you is the worst thing in this file, and it is now impossible: what
 * does not fit is REFUSED, loudly, before anything is uploaded.
 *
 * It also uploaded strictly one at a time, and threw the moment any single one
 * failed — losing the fifty already done along with the one that broke. On a
 * phone on a hotel wifi, with sixty photographs, one failure is not an edge
 * case; it is what happens.
 *
 * So now: a few at a time, progress as they land, and a failure costs you that
 * photograph and nothing else. The caller is told exactly which ones did not
 * make it and can say so.
 */

export { MAX_PHOTOS };

/** How many to have in flight at once — enough to be quick, few enough that a
 *  phone is not holding sixty request bodies in memory at the same time. */
const CONCURRENCY = 4;

/**
 * Fewer at a time when they are big.
 *
 * Four photographs share a phone's uplink happily. Four videos do not: each
 * gets a quarter of the pipe, each takes four times as long, and all four
 * walk into their deadline together. Sending two means the first is finished
 * and banked while the second is still going, which is also what makes a
 * retry cheap.
 */
export function concurrencyFor(files: { size: number }[]): number {
  const biggest = files.reduce((m, f) => Math.max(m, f.size), 0);
  return biggest > 20 * 1024 * 1024 ? 2 : CONCURRENCY;
}

/**
 * ── Why every upload has a deadline ──────────────────────────────────────
 * Fifty-three photographs went up and the screen stopped at "52 of 53" and
 * stayed there. Nothing was broken in a way anything could see: one request
 * had simply stopped answering. `fetch` has no timeout of its own, so a socket
 * that dies without saying so hangs its worker for ever, `Promise.all` never
 * settles, and the whole batch — fifty-two photographs already safely in
 * storage — waits behind it with no way out but closing the page and losing
 * the lot.
 *
 * So each attempt is given a deadline and then abandoned. One photograph that
 * will not go is one photograph lost, not an evening.
 *
 * And because a stall on a phone is usually the connection blinking rather
 * than anything wrong with the file, a failed one is tried once more before
 * being given up on.
 *
 * ── Why the deadline is not one number ───────────────────────────────────
 * It was thirty seconds flat, which is right for a photograph and wrong for
 * everything else. This uploader also carries the family diary's videos, and
 * the route that signs them allows two hundred megabytes. A forty-megabyte
 * clip on a phone in a hospital car park is not stalled at thirty seconds; it
 * is a third of the way through, and cutting it off there would fail every
 * single time — reliably, and looking exactly like a bug in the app.
 *
 * So the deadline is a floor plus an allowance per megabyte, set at a
 * pessimistic throughput on purpose: the number is not a guess at how long
 * this will take, it is the point past which nothing can be going well. The
 * cap is there so that a genuinely dead socket still ends, eventually,
 * instead of holding a worker for the rest of the evening.
 */
const FLOOR_MS = 30_000;
/** Allowed per MB — roughly a 1 Mbps floor, well below any usable connection. */
const PER_MB_MS = 8_000;
/** However large the file, an attempt ends here. */
const CEILING_MS = 20 * 60_000;

/** The two deadlines this file gets, in order. Exported to be checked. */
export function attemptsFor(bytes: number): number[] {
  const first = Math.min(
    CEILING_MS,
    FLOOR_MS + (bytes / (1024 * 1024)) * PER_MB_MS,
  );
  // The second is more patient than the first: by then we know it is slow.
  return [first, Math.min(CEILING_MS, first * 1.5)];
}

/** The most a photograph may take to be decoded and redrawn before we give up
 *  on shrinking it and send the original instead. Same reasoning as the upload
 *  deadline: a step with no timeout is a step that can hang the batch. */
const SHRINK_MS = 20_000;

/** Whatever `work` gives back, or `fallback` if it takes too long. */
async function beforeLongEnough<T>(
  work: Promise<T>,
  ms: number,
  fallback: T,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export type UploadOutcome = {
  /** Uploaded, in the order they were chosen. */
  urls: string[];
  /** Tried and did not make it. Everything else was still saved. */
  failed: File[];
  /** The person stopped it. What had landed is still in `urls`. */
  cancelled: boolean;
};

/**
 * What is happening, in bytes, while it happens.
 *
 * ── Why bytes and not a count of files ───────────────────────────────────
 * "Uploading…" for two and a half minutes is indistinguishable from a broken
 * app, and so is "Sent 0 of 1". Every other app people use shows a bar that
 * moves, and they are right to: the only question somebody staring at a
 * spinner actually has is whether anything at all is happening, and a count
 * of finished FILES cannot answer it when there is one file and it is eighty
 * megabytes.
 */
export interface UploadWatch {
  /** Files finished, landed or lost. */
  done: number;
  total: number;
  /** Bytes gone, and bytes there are to go. */
  loaded: number;
  bytes: number;
  /** Something being retried, or null. */
  note: string | null;
}

/**
 * Called the moment one lands, with the index it was given in.
 *
 * `urls` above has the failures filtered out of it, which is the right shape
 * for a caller that only wants the list — and useless to one that needs to
 * know WHICH of the files it handed over is now at which address. That caller
 * is the one that wants to let somebody press Share again after a flaky
 * minute and not re-send the four photographs that already went. So the index
 * is offered here, as it happens, rather than reconstructed afterwards.
 */
export type OnOne = (index: number, url: string) => void;

/** Thrown, and recognised, when the person asked for this to stop. */
export class UploadCancelled extends Error {
  constructor() {
    super("cancelled");
    this.name = "UploadCancelled";
  }
}

/**
 * ── Stalled is not the same as slow ──────────────────────────────────────
 * The deadlines above are a backstop, and a crude one: they cannot tell an
 * eighty-megabyte video moving steadily up a phone connection from one that
 * died in the first second. Both look identical from outside — the promise
 * has not settled — so the only safe number was a generous one, and a
 * genuinely dead upload sat there for eleven minutes before anybody found
 * out.
 *
 * Now that the SDK reports bytes as they leave, there is a far better
 * question to ask: has anything moved lately? A big file that is crawling is
 * fine and must never be cut off. A file of any size that has not moved a
 * byte in three-quarters of a minute is not slow, it is gone.
 *
 * So the stall clock is what actually ends most failures, and it resets on
 * every progress event. The total deadline stays behind it for the case the
 * SDK reports no progress at all.
 */
const STALL_MS = 45_000;

/**
 * Over this, upload it in parts.
 *
 * The SDK splits the file, sends the parts in parallel and retries a part
 * that fails on its own. On a phone — high latency, one connection doing all
 * the work — that is most of the difference between a video that arrives and
 * one that gives up, and it means a blip costs one part rather than eighty
 * megabytes. Below the threshold it is pure overhead, so photographs go the
 * ordinary way.
 */
const MULTIPART_OVER = 8 * 1024 * 1024;

/**
 * One file, with a deadline, a stall clock, a second try — and a way out.
 *
 * Throws once both attempts are spent; the caller counts it as lost and moves
 * on. Throws `UploadCancelled`, without retrying, when the person stopped it.
 * Never hangs: that is the entire point of it.
 */
async function sendOne(
  f: File,
  folder: string,
  opts: {
    onRetry?: () => void;
    /** Bytes of THIS file that have gone, as they go. */
    onBytes?: (loaded: number) => void;
    /** The whole batch's stop button. */
    signal?: AbortSignal;
  },
): Promise<string> {
  const ext = f.name.includes(".") ? f.name.slice(f.name.lastIndexOf(".")) : "";
  let last: unknown;
  for (const [attempt, ms] of attemptsFor(f.size).entries()) {
    if (opts.signal?.aborted) throw new UploadCancelled();
    if (attempt > 0) opts.onRetry?.();

    const control = new AbortController();
    const stop = () => control.abort();
    opts.signal?.addEventListener("abort", stop);
    const ceiling = setTimeout(stop, ms);
    let stall = setTimeout(stop, STALL_MS);

    try {
      const res = await upload(`${folder}/${randomId()}${ext}`, f, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        contentType: f.type || undefined,
        multipart: f.size > MULTIPART_OVER,
        abortSignal: control.signal,
        onUploadProgress: ({ loaded }) => {
          clearTimeout(stall);
          stall = setTimeout(stop, STALL_MS);
          opts.onBytes?.(loaded);
        },
      });
      return res.url;
    } catch (err) {
      // Somebody pressed the X. That is an answer, not a failure, and it must
      // not be retried — retrying a cancellation is how a cancel button comes
      // to look like it does nothing at all.
      if (opts.signal?.aborted) throw new UploadCancelled();
      last = err;
    } finally {
      clearTimeout(ceiling);
      clearTimeout(stall);
      opts.signal?.removeEventListener("abort", stop);
    }
  }
  throw last instanceof Error ? last : new Error("upload failed");
}

export async function uploadToBlob(
  files: File[],
  folder: string,
  opts: {
    /** Refuse — not truncate — anything beyond this. Default MAX_PHOTOS. */
    max?: number;
    /**
     * Called as each one lands, for "12 of 59" — and again with a `note` when
     * one is being retried, so a photograph that is taking its time does not
     * look like a page that has died.
     */
    onProgress?: (done: number, total: number, note?: string) => void;
    /** Each one as it lands, by the index it was passed in at. */
    onOne?: OnOne;
    /** Bytes, as they move. See `UploadWatch`. */
    onWatch?: (w: UploadWatch) => void;
    /** The stop button. Aborting it ends the batch and keeps what landed. */
    signal?: AbortSignal;
  } = {},
): Promise<UploadOutcome> {
  const max = opts.max ?? MAX_PHOTOS;
  const real = files.filter((f) => f && f.size > 0);
  if (real.length > max) {
    // Refused as a whole. Half a wedding is not a kindness.
    throw new Error(
      `That is ${real.length} photos, and ${max} is the most one of these can hold. Choose ${max} or fewer.`,
    );
  }

  const urls: (string | null)[] = new Array(real.length).fill(null);
  const failed: File[] = [];
  let done = 0;
  let next = 0;
  let cancelled = false;

  // Bytes are counted per file and summed, rather than accumulated into one
  // running total, because a retry starts that file's count again from zero
  // and a running total would march past 100% and stay there.
  const bytes = real.reduce((n, f) => n + f.size, 0);
  const sent = new Array(real.length).fill(0);
  let note: string | null = null;
  const watch = () =>
    opts.onWatch?.({
      done,
      total: real.length,
      loaded: sent.reduce((a: number, b: number) => a + b, 0),
      bytes,
      note,
    });

  async function worker() {
    for (;;) {
      if (cancelled || opts.signal?.aborted) return;
      const i = next++;
      if (i >= real.length) return;
      const chosen = real[i];
      try {
        // Shrink it here, inside the worker, so the big one is released as
        // soon as its smaller copy is on the wire rather than sixty of them
        // being held at once. Done once, not once per attempt.
        const f = await beforeLongEnough(shrinkImage(chosen), SHRINK_MS, chosen);
        const url = await sendOne(f, folder, {
          signal: opts.signal,
          onBytes: (loaded) => {
            // Capped at the original size: a shrunk copy is smaller than what
            // the person chose, and a bar that finishes early and waits is a
            // bar that has lied.
            sent[i] = Math.min(chosen.size, loaded);
            watch();
          },
          onRetry: () => {
            sent[i] = 0;
            note = `${real.length > 1 ? `Item ${i + 1} is` : "It is"} taking its time — trying once more…`;
            watch();
            opts.onProgress?.(done, real.length, note);
          },
        });
        urls[i] = url;
        sent[i] = chosen.size;
        opts.onOne?.(i, url);
      } catch (err) {
        if (err instanceof UploadCancelled || opts.signal?.aborted) {
          // Stop the whole batch. What already landed is still returned, so
          // the caller can bank it and send only the rest later.
          cancelled = true;
          return;
        }
        // One photograph, not the whole evening.
        failed.push(chosen);
        sent[i] = chosen.size;
      }
      done += 1;
      note = null;
      watch();
      opts.onProgress?.(done, real.length);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(concurrencyFor(real), real.length) },
      worker,
    ),
  );

  return {
    urls: urls.filter((u): u is string => u !== null),
    failed,
    cancelled: cancelled || !!opts.signal?.aborted,
  };
}

/**
 * One file — a photograph of a face — where a failure is the whole operation.
 *
 * Avatars have no partial success to preserve: either the picture is there or
 * the form should say it is not. This keeps that contract rather than making
 * every caller unpack an outcome they cannot act on.
 */
export async function uploadOneToBlob(
  files: File[],
  folder: string,
): Promise<string | null> {
  const { urls, failed } = await uploadToBlob(files.slice(0, 1), folder, { max: 1 });
  if (failed.length) {
    throw new Error(
      "That photo couldn't upload. It may be too large (max 15 MB) or an unsupported format.",
    );
  }
  return urls[0] ?? null;
}

/**
 * "82 MB". Sized for a sentence somebody reads once, so no decimals above a
 * megabyte — "81.7 MB" is not more useful than "82 MB" and is harder to read.
 */
export function humanBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} kB`;
  const mb = n / (1024 * 1024);
  return mb < 10 ? `${mb.toFixed(1)} MB` : `${Math.round(mb)} MB`;
}

/**
 * "about 2 min left", or null when it is too early to say honestly.
 *
 * A phone's uplink in the first second of an upload tells you nothing, and an
 * estimate built on it swings from "4 hours" to "3 seconds" and back, which is
 * worse than no estimate at all. So: nothing until some real time has passed
 * and some real bytes have moved, and rounded coarsely once it appears.
 */
export function humanLeft(
  loaded: number,
  bytes: number,
  sinceMs: number,
): string | null {
  if (sinceMs < 3000 || loaded < 64 * 1024 || loaded >= bytes) return null;
  const perMs = loaded / sinceMs;
  if (perMs <= 0) return null;
  const secs = Math.round((bytes - loaded) / perMs / 1000);
  if (secs < 10) return "nearly there";
  if (secs < 60) return `about ${Math.round(secs / 10) * 10} seconds left`;
  const mins = Math.round(secs / 60);
  if (mins > 30) return "this one will take a while";
  return `about ${mins} minute${mins === 1 ? "" : "s"} left`;
}

/** Read the selected files from a form's file input by name. */
export function filesFromForm(form: HTMLFormElement, name: string): File[] {
  const input = form.elements.namedItem(name) as HTMLInputElement | null;
  return input?.files ? Array.from(input.files) : [];
}
