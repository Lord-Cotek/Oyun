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
};

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

/**
 * One photograph, with a deadline and a second try.
 *
 * Throws once both attempts are spent; the caller counts it as lost and moves
 * on. Never hangs: that is the entire point of it.
 */
async function sendOne(
  f: File,
  folder: string,
  onRetry?: () => void,
): Promise<string> {
  const ext = f.name.includes(".") ? f.name.slice(f.name.lastIndexOf(".")) : "";
  let last: unknown;
  for (const [attempt, ms] of attemptsFor(f.size).entries()) {
    if (attempt > 0) onRetry?.();
    const control = new AbortController();
    const deadline = setTimeout(() => control.abort(), ms);
    try {
      const res = await upload(`${folder}/${randomId()}${ext}`, f, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        contentType: f.type || undefined,
        abortSignal: control.signal,
      });
      return res.url;
    } catch (err) {
      last = err;
    } finally {
      clearTimeout(deadline);
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

  async function worker() {
    for (;;) {
      const i = next++;
      if (i >= real.length) return;
      const chosen = real[i];
      try {
        // Shrink it here, inside the worker, so the big one is released as
        // soon as its smaller copy is on the wire rather than sixty of them
        // being held at once. Done once, not once per attempt.
        const f = await beforeLongEnough(shrinkImage(chosen), SHRINK_MS, chosen);
        const url = await sendOne(f, folder, () =>
          opts.onProgress?.(
            done,
            real.length,
            `Photo ${i + 1} is taking its time — trying once more…`,
          ),
        );
        urls[i] = url;
        opts.onOne?.(i, url);
      } catch {
        // One photograph, not the whole evening.
        failed.push(chosen);
      }
      done += 1;
      opts.onProgress?.(done, real.length);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(concurrencyFor(real), real.length) },
      worker,
    ),
  );

  return { urls: urls.filter((u): u is string => u !== null), failed };
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

/** Read the selected files from a form's file input by name. */
export function filesFromForm(form: HTMLFormElement, name: string): File[] {
  const input = form.elements.namedItem(name) as HTMLInputElement | null;
  return input?.files ? Array.from(input.files) : [];
}
