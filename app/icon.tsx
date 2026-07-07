import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0E14",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 120 120">
          <g transform="translate(60,60)">
            <path
              d="M 0 -46 C 42 -46 56 -6 56 12 C 56 40 33 52 0 52 C -33 52 -56 40 -56 12 C -56 -6 -42 -46 0 -46"
              fill="none"
              stroke="#ECE8DE"
              strokeWidth={8}
              strokeLinecap="round"
            />
            <path
              d="M -3 -20 C 22 -18 30 8 18 28 C 11 40 -7 43 -17 33 C -26 24 -22 10 -10 10 C -3 10 -1 -4 -3 -20 Z"
              fill="#E6A94E"
            />
          </g>
        </svg>
      </div>
    ),
    { ...size },
  );
}
