import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oyun.cotek.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/journey",
        "/care",
        "/child",
        "/together",
        "/settings",
        "/onboarding",
        "/reset-password",
        "/api",
        // An invitation is for the people it was handed to. The link is
        // unguessable and each page says noindex for itself, but a crawler
        // that finds one pasted in a public forum should be told plainly too.
        "/i",
        // A registry is for the people it was handed to. Same reasoning as an
        // invitation: unguessable link, noindex on the page itself, and this
        // for the crawler that finds one pasted in a public forum.
        "/r",
        "/appointments",
        "/dates",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
