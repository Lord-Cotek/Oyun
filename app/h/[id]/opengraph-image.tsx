import { ImageResponse } from "next/og";
import { hymnBySlug } from "@/lib/hymns";

export const runtime = "nodejs";
export const alt = "A hymn shared from Oyun";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image({ params }: { params: { id: string } }) {
  const hymn = hymnBySlug(params.id);
  const title = hymn?.title ?? "A hymn";
  const line = hymn?.line ?? "Sing along in family worship.";
  const author = hymn?.author ?? "";

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
          background: "#0B0E14",
          color: "#ECE8DE",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 120 120">
            <g transform="translate(60,60)">
              <path
                d="M 0 -46 C 42 -46 56 -6 56 12 C 56 40 33 52 0 52 C -33 52 -56 40 -56 12 C -56 -6 -42 -46 0 -46"
                fill="none"
                stroke="#ECE8DE"
                strokeWidth={6}
                strokeLinecap="round"
              />
              <path
                d="M -3 -20 C 22 -18 30 8 18 28 C 11 40 -7 43 -17 33 C -26 24 -22 10 -10 10 C -3 10 -1 -4 -3 -20 Z"
                fill="#E6A94E"
              />
            </g>
          </svg>
          <div style={{ fontSize: 34, fontFamily: "serif" }}>Oyun</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, color: "#E6A94E", letterSpacing: 6, textTransform: "uppercase" }}>
            A hymn to sing
          </div>
          <div style={{ fontSize: 68, fontFamily: "serif", lineHeight: 1.1, marginTop: 18, maxWidth: 1040 }}>
            {title}
          </div>
          <div style={{ fontSize: 30, color: "#B9BEC6", marginTop: 22, maxWidth: 1000, fontStyle: "italic", fontFamily: "serif" }}>
            {`“${line}”`}
          </div>
        </div>

        <div style={{ fontSize: 24, color: "#8A9099" }}>
          {author ? `${author} · oyun.cotek.app` : "oyun.cotek.app"}
        </div>
      </div>
    ),
    { ...size },
  );
}
