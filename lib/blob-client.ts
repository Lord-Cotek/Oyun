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
 * being given up on. The first attempt is the impatient one: most uploads take
 * a second or two, so waiting three-quarters of a minute to discover otherwise
 * is long enough.
 */
const ATTEMPT_MS = [30_000, 45_000];

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
  for (const [attempt, ms] of ATTEMPT_MS.entries()) {
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
        urls[i] = await sendOne(f, folder, () =>
          opts.onProgress?.(
            done,
            real.length,
            `Photo ${i + 1} is taking its time — trying once more…`,
          ),
        );
      } catch {
        // One photograph, not the whole evening.
        failed.push(chosen);
      }
      done += 1;
      opts.onProgress?.(done, real.length);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, real.length) }, worker),
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
