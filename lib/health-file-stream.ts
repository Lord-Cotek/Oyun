/**
 * Fetch a health file from storage on the server and pass it on, marked
 * private and never cached. Used by the signed-in file route and, later,
 * the doctor's report link — each checks its own permission first; this
 * only moves the bytes.
 */
/** Shared with the report-link route: fetch from storage and pass it on. */
export async function streamHealthFile(file: { url: string; access: string; contentType: string }) {
  let body: ReadableStream | null = null;
  let type = file.contentType;
  try {
    if (file.access === "private") {
      const { get } = await import("@vercel/blob");
      const got = await get(file.url, { access: "private", useCache: false });
      if (got && got.statusCode === 200) {
        body = got.stream;
        type = got.blob.contentType || type;
      }
    } else {
      const res = await fetch(file.url, { cache: "no-store" });
      if (res.ok) body = res.body;
    }
  } catch {
    body = null;
  }
  if (!body) return new Response("Not found", { status: 404 });
  return new Response(body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
      "X-Robots-Tag": "noindex",
    },
  });
}
