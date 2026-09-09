import { upload } from "@vercel/blob/client";

/**
 * Upload images straight from the browser to Vercel Blob and return their public
 * URLs. Skips empty inputs. Throws with a friendly message on failure so the
 * caller can surface it (never hang).
 */
export async function uploadToBlob(
  files: File[],
  folder: string,
  max = 6,
): Promise<string[]> {
  const real = files.filter((f) => f && f.size > 0).slice(0, max);
  const urls: string[] = [];
  for (const f of real) {
    const ext = f.name.includes(".") ? f.name.slice(f.name.lastIndexOf(".")) : "";
    try {
      const res = await upload(`${folder}/${crypto.randomUUID()}${ext}`, f, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        contentType: f.type || undefined,
      });
      urls.push(res.url);
    } catch {
      throw new Error(
        "That photo couldn't upload. It may be too large (max 15 MB) or an unsupported format.",
      );
    }
  }
  return urls;
}

/** Read the selected files from a form's file input by name. */
export function filesFromForm(form: HTMLFormElement, name: string): File[] {
  const input = form.elements.namedItem(name) as HTMLInputElement | null;
  return input?.files ? Array.from(input.files) : [];
}
