/**
 * Make a photograph smaller before it leaves the phone.
 *
 * A picture off a modern phone is 3-5 MB and four thousand pixels wide.
 * Nothing in this app ever shows one larger than about a thousand, so the
 * other three thousand pixels are carried up a mobile connection, paid for out
 * of somebody's data, stored forever, and then thrown away by the browser on
 * the way to the screen. Fifty-nine of them is a quarter of a gigabyte to put
 * one wedding in a milestone.
 *
 * Resized here, the same fifty-nine are nearer 25 MB. That is the difference
 * between an upload that works on hotel wifi and one that does not.
 *
 * ── The one rule that keeps this safe ────────────────────────────────────
 * Every path below ends at the same guard: the new file is used ONLY if it is
 * actually smaller than the one we were given. Image encoders disagree about
 * what they support, and when `toBlob` is asked for a format a browser cannot
 * write it quietly hands back a PNG instead — which for a photograph is very
 * much bigger. Rather than try to predict every engine, this measures the
 * result and keeps the better of the two. A resize that did not help is not
 * applied, so the worst case is the file the person chose.
 *
 * ── What is deliberately left alone ──────────────────────────────────────
 * GIFs, because drawing one to a canvas keeps a single frame and silently
 * throws the animation away — and a family's animated picture is the picture.
 * Videos, which are not this function's business. Anything that will not
 * decode, which on some Androids includes HEIC straight off an iPhone: it goes
 * up untouched rather than not at all.
 *
 * Orientation is asked for explicitly (`imageOrientation: "from-image"`).
 * Without it, a photograph taken sideways — where the camera writes the pixels
 * one way round and an EXIF tag says to turn them — is redrawn from the raw
 * pixels and the rotation is lost. That is how a resize silently tips
 * everybody's holiday on its side.
 */

/** The longest edge we keep. Comfortably past any screen this is shown on. */
export const MAX_EDGE = 2048;

/** JPEG quality. High enough that a face survives it; low enough to matter. */
const QUALITY = 0.82;

/** Below this, a photograph is already small and re-encoding only costs it. */
const ALREADY_SMALL = 400 * 1024;

/** Formats where redrawing would destroy something we cannot get back. */
function untouchable(type: string): boolean {
  return type === "image/gif" || !type.startsWith("image/");
}

/** Decode, honouring the orientation the camera recorded. */
async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Older Safari rejects the options bag rather than ignoring it.
      try {
        return await createImageBitmap(file);
      } catch {
        /* fall through to an <img>, which applies EXIF itself */
      }
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("could not decode"));
      img.src = url;
    });
  } finally {
    // The bitmap is drawn synchronously by the caller; revoking after the
    // promise settles is safe and keeps the blob from leaking.
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}

function draw(
  source: ImageBitmap | HTMLImageElement,
  w: number,
  h: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no 2d context");
  // A white ground, so a transparent PNG does not become a black rectangle
  // the moment it is written as a JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source as CanvasImageSource, 0, 0, w, h);
  return canvas;
}

function toBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

/** Swap the extension so the name matches what is actually inside. */
function rename(name: string, type: string): string {
  const base = name.includes(".") ? name.slice(0, name.lastIndexOf(".")) : name;
  return `${base}.${type === "image/webp" ? "webp" : "jpg"}`;
}

/**
 * A smaller version of this photograph, or the original where that is the
 * better answer. Never throws: a picture that will not shrink still goes up.
 */
export async function shrinkImage(file: File): Promise<File> {
  if (untouchable(file.type)) return file;

  let source: ImageBitmap | HTMLImageElement | null = null;
  try {
    source = await decode(file);
    const sw = "width" in source ? source.width : 0;
    const sh = "height" in source ? source.height : 0;
    if (!sw || !sh) return file;

    const scale = Math.min(1, MAX_EDGE / Math.max(sw, sh));
    // Already small on both counts: leave it exactly as it is.
    if (scale === 1 && file.size <= ALREADY_SMALL) return file;

    const w = Math.max(1, Math.round(sw * scale));
    const h = Math.max(1, Math.round(sh * scale));
    const canvas = draw(source, w, h);

    // PNG may be carrying transparency, so try WebP first, which keeps it.
    // Everything else is a photograph and belongs in a JPEG.
    const wanted = file.type === "image/png" ? "image/webp" : "image/jpeg";
    let out = await toBlob(canvas, wanted);
    if (out && out.type !== wanted && wanted === "image/webp") {
      // The engine could not write WebP and gave us something else. A flat
      // JPEG is a better fallback than whatever it chose.
      out = await toBlob(canvas, "image/jpeg");
    }
    // Free the backing store on engines that keep it around.
    canvas.width = 0;
    canvas.height = 0;

    // The one rule: only if it actually helped.
    if (!out || out.size >= file.size) return file;
    return new File([out], rename(file.name, out.type), {
      type: out.type,
      lastModified: file.lastModified,
    });
  } catch {
    // Undecodable — HEIC on an Android, a corrupt file, a browser without a
    // canvas. It goes up as it is; that is far better than not at all.
    return file;
  } finally {
    if (source && "close" in source) (source as ImageBitmap).close();
  }
}
