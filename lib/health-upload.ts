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
 */

export type UploadedHealthFile = { url: string; access: "private" | "public"; contentType: string; size: number };

const MAX_EDGE = 2048;
const MAX_PDF = 20 * 1024 * 1024;

export function isPdf(f: File) {
  return f.type === "application/pdf" || /\.pdf$/i.test(f.name);
}

/** Redraw a photo to strip everything but the picture. */
export async function cleanImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions).catch(() => null);
  if (!bitmap) throw new Error("That photo could not be opened here. Try taking it again, or save it as a JPEG first.");
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("That photo could not be prepared.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.85));
  if (!blob) throw new Error("That photo could not be prepared.");
  return new File([blob], "photo.jpg", { type: "image/jpeg" });
}

function rid() {
  const a = new Uint8Array(12);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** One file, cleaned and uploaded. The caller registers it with the server. */
export async function uploadHealthFile(file: File, journeyId: string): Promise<UploadedHealthFile> {
  let f: File;
  if (isPdf(file)) {
    if (file.size > MAX_PDF) throw new Error("That PDF is over 20 MB.");
    f = new File([file], "report.pdf", { type: "application/pdf" });
  } else {
    f = await cleanImage(file);
  }
  const path = `health/${journeyId}/${rid()}${isPdf(f) ? ".pdf" : ".jpg"}`;
  const send = (access: "private" | "public") =>
    upload(path, f, { access, handleUploadUrl: "/api/health/upload", contentType: f.type });
  try {
    const r = await send("private");
    return { url: r.url, access: "private", contentType: f.type, size: f.size };
  } catch (err) {
    // A store without private files says so; anything else is a real failure.
    if (!/private|access/i.test(String((err as Error)?.message ?? ""))) throw err;
    const r = await send("public");
    return { url: r.url, access: "public", contentType: f.type, size: f.size };
  }
}
