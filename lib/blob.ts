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
export async function uploadImages(
  files: FormDataEntryValue[],
  folder: string,
  max = 8,
): Promise<string[]> {
  const real = files.filter((f) => typeof f !== "string" && (f as File).size > 0).slice(0, max);
  const urls = await Promise.all(real.map((f) => uploadImage(f, folder)));
  return urls.filter((u): u is string => !!u);
}
