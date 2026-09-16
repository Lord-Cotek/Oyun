import { put } from "@vercel/blob";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

/**
 * Upload a milestone photo to Vercel Blob and return its public URL.
 * Returns null when there's no file, no configured token, or the file is
 * unsupported / too large — the milestone is still saved without a photo.
 */
export async function uploadImage(
  file: FormDataEntryValue | null,
  folder: string,
): Promise<string | null> {
  if (!file || typeof file === "string") return null;
  const f = file as File;
  if (!f.size || f.size === 0) return null;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  if (f.size > MAX_BYTES) throw new Error("That photo is larger than 8 MB.");
  if (f.type && !ALLOWED.includes(f.type)) {
    throw new Error("Please upload a JPEG, PNG, WebP, or HEIC image.");
  }

  const ext = f.name.includes(".") ? f.name.slice(f.name.lastIndexOf(".")) : "";
  const blob = await put(`${folder}/${crypto.randomUUID()}${ext}`, f, {
    access: "public",
    addRandomSuffix: false,
    contentType: f.type || undefined,
  });
  return blob.url;
}

/** Upload several images at once, keeping only the successful ones. Capped. */
/**
 * How many photographs one milestone will hold here.
 *
 * Lower than the sibling app's sixty, and for a reason worth writing down:
 * these go up through a SERVER ACTION, so every byte crosses in the request
 * body, and next.config caps that at 8 MB. Phone photographs are 3-5 MB each.
 * Raising this number without first moving these uploads to the browser — the
 * way the other app does it, straight to Blob storage — would just move the
 * failure from "some were dropped" to "the whole thing was rejected".
 */
export const MAX_MILESTONE_PHOTOS = 8;

export async function uploadImages(
  files: FormDataEntryValue[],
  folder: string,
  max = MAX_MILESTONE_PHOTOS,
): Promise<string[]> {
  const real = files.filter((f) => typeof f !== "string" && (f as File).size > 0);
  // Refused, not quietly trimmed. Keeping the first eight of twenty and saying
  // nothing is how fifty-three photographs went missing in the sibling app.
  if (real.length > max) {
    throw new Error(
      `That is ${real.length} photos, and ${max} is the most one of these can hold. Choose ${max} or fewer.`,
    );
  }
  const urls = await Promise.all(real.map((f) => uploadImage(f, folder)));
  return urls.filter((u): u is string => !!u);
}
