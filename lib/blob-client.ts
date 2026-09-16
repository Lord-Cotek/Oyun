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

export type UploadOutcome = {
  /** Uploaded, in the order they were chosen. */
  urls: string[];
  /** Tried and did not make it. Everything else was still saved. */
  failed: File[];
};

export async function uploadToBlob(
  files: File[],
  folder: string,
  opts: {
    /** Refuse — not truncate — anything beyond this. Default MAX_PHOTOS. */
    max?: number;
    /** Called as each one lands, for "12 of 59". */
    onProgress?: (done: number, total: number) => void;
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
        // being held at once.
        const f = await shrinkImage(chosen);
        const ext = f.name.includes(".") ? f.name.slice(f.name.lastIndexOf(".")) : "";
        const res = await upload(`${folder}/${randomId()}${ext}`, f, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
          contentType: f.type || undefined,
        });
        urls[i] = res.url;
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
