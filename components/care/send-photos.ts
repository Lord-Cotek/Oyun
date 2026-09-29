"use client";

import { filesFromForm, uploadToBlob } from "@/lib/blob-client";

/**
 * Put the chosen photographs in Blob storage from the browser, and leave the
 * form carrying only their URLs.
 *
 * These used to travel as FILES inside a server action's request body. Next
 * caps that body at 8 MB and a phone photograph is 3-5 MB, so three of them
 * were enough to have the whole request rejected — which is why the limit here
 * was eight and why raising it would have made things worse rather than
 * better. Uploaded from the browser instead, they go straight to storage, one
 * connection each, shrunk on the way (see lib/shrink-image.ts), and the server
 * action carries a few hundred bytes of URL.
 *
 * Returns how many did not make it, so the form can say so. It never silently
 * drops one: over the limit throws before anything is uploaded.
 */
export async function sendPhotos(
  form: HTMLFormElement | null,
  fd: FormData,
  onMessage: (m: { ok: boolean; text: string }) => void,
): Promise<number> {
  const files = form ? filesFromForm(form, "photo") : [];
  // The server no longer wants the bytes, only the addresses.
  fd.delete("photo");
  if (!files.length) return 0;

  onMessage({ ok: true, text: `Uploading ${files.length} photos…` });
  const { urls, failed } = await uploadToBlob(files, "milestones", {
    onProgress: (done, total, note) =>
      onMessage({ ok: true, text: note ?? `Uploading photo ${done} of ${total}…` }),
  });
  for (const u of urls) fd.append("photoUrls", u);
  return failed.length;
}
