import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Oyun — Guided by Agbebi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0B0E14",
          color: "#ECE8DE",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
          }}
        >
          <div style={{ fontSize: 96, fontFamily: "serif", letterSpacing: -2 }}>
            Oyun
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#E6A94E",
              letterSpacing: 8,
              textTransform: "uppercase",
              marginTop: 12,
            }}
          >
            Guided by Agbebi
          </div>
          <div style={{ fontSize: 30, color: "#8A9099", marginTop: 28, maxWidth: 820 }}>
            Walk the whole journey — together — with Scripture at the center.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
