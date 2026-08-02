import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oyun.cotek.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ) => ({ url: `${siteUrl}${path}`, lastModified: now, changeFrequency, priority });

  return [
    page("", 1, "weekly"),
    page("/sign-up", 0.8, "monthly"),
    page("/sign-in", 0.5, "yearly"),
    page("/privacy", 0.3, "yearly"),
    page("/terms", 0.3, "yearly"),
    page("/contact", 0.4, "yearly"),
  ];
}
