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
    background_color: "#14110d",
    theme_color: "#14110d",
    orientation: "portrait",
    categories: ["lifestyle", "health", "education"],
    // Long-press the icon for these. The rooms people open most.
    shortcuts: [
      { name: "Worship", short_name: "Worship", url: "/worship", icons: [{ src: "/oyun-icon-192.png", sizes: "192x192" }] },
      { name: "Prayer", short_name: "Prayer", url: "/prayer", icons: [{ src: "/oyun-icon-192.png", sizes: "192x192" }] },
      { name: "Write a letter", short_name: "Write a letter", url: "/letters", icons: [{ src: "/oyun-icon-192.png", sizes: "192x192" }] },
    ],
    icons: [
      { src: "/oyun-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/oyun-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/oyun-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
