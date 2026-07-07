import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oyun — Guided by Agbebi",
    short_name: "Oyun",
    description:
      "A Christian companion for the whole journey — conception through a child's earliest years. Guided by Agbebi.",
    start_url: "/journey",
    scope: "/",
    display: "standalone",
    background_color: "#0B0E14",
    theme_color: "#0B0E14",
    orientation: "portrait",
    categories: ["lifestyle", "health", "education"],
    icons: [
      { src: "/oyun-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/oyun-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/oyun-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
