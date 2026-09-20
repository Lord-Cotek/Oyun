import { ImageResponse } from "next/og";
import { getSharedPost } from "@/lib/post-share-db";

export const runtime = "nodejs";
export const alt = "A moment shared from Oyun";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card that appears in WhatsApp.
 *
 * ── This is the whole of the marketing ───────────────────────────────────
 * Nobody taps a bare URL. What decides whether a grandmother in another city
 * opens this is the picture and the line under it in the message bubble, so
 * this is the one surface where the app is competing for attention — and the
 * only one, because there is no feed, no profile and no suggestions anywhere
 * in this product.
 *
 * ── Two things it must never do ──────────────────────────────────────────
 * It must never show more than the page itself does. WhatsApp, Facebook and
 * everything like them fetch this from their own servers and KEEP IT, on
 * their infrastructure, cached for as long as they like. Nothing here can be
 * un-published later, so nothing here may be anything the family would want
 * back — which is why it carries the words and the family's first names, and
 * deliberately not the photograph.
 *
 * And it must not keep working after the link is closed. It cannot un-cache
 * what has already been fetched, but from the moment a link is revoked or
 * expires this returns the neutral card below, so a fresh forward of a dead
 * link shows nothing of the family at all. `getSharedPost` returning null is
 * what decides that, exactly as it does for the page, so the two can never
 * disagree about whether a link is alive.
 */
function truncate(s: string, n: number): string {
  const one = s.trim().replace(/\s+/g, " ");
  return one.length > n ? `${one.slice(0, n - 1).trimEnd()}…` : one;
}

export default async function Image({
  params,
}: {
  params: { token: string };
}) {
  const shared = await getSharedPost(params.token);

  const heading = shared
    ? `${shared.household} shared a moment`
    : "This link has been closed";
  const line = shared
    ? truncate(shared.body, 200)
    : "Oyun — pregnancy and the first years, kept with the people who love you.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#14110d",
          color: "#efeae0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 120 120">
            <g transform="translate(60,60)">
              <path
                d="M 0 -46 C 42 -46 56 -6 56 12 C 56 40 33 52 0 52 C -33 52 -56 40 -56 12 C -56 -6 -42 -46 0 -46"
                fill="none"
                stroke="#efeae0"
                strokeWidth={6}
                strokeLinecap="round"
              />
              <path
                d="M -3 -20 C 22 -18 30 8 18 28 C 11 40 -7 43 -17 33 C -26 24 -22 10 -10 10 C -3 10 -1 -4 -3 -20 Z"
                fill="#efb35c"
              />
            </g>
          </svg>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#a99e8c",
            }}
          >
            Oyun
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 58, lineHeight: 1.15, color: "#efb35c" }}>
            {heading}
          </div>
          <div style={{ fontSize: 34, lineHeight: 1.4, color: "#efeae0" }}>
            {line}
          </div>
        </div>

        <div style={{ fontSize: 24, color: "#a99e8c" }}>
          {shared
            ? "Shared with you — please keep it between you."
            : "oyun.cotek.app"}
        </div>
      </div>
    ),
    { ...size },
  );
}
