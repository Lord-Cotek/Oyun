import type { Metadata, Viewport } from "next";
import { Playfair_Display, Literata, DM_Mono } from "next/font/google";
import "./globals.css";
import { AssistantChat } from "@/components/AssistantChat";
import { Disclaimer } from "@/components/Disclaimer";
import { PwaRegister } from "@/components/PwaRegister";
import { OfflineBanner } from "@/components/OfflineBanner";
import { NativePush } from "@/components/NativePush";
import { KnowTheHour } from "@/components/KnowTheHour";

const playfair = Playfair_Display({
  // latin-ext and vietnamese carry ọ, ẹ, ṣ and the tone marks Yorùbá names
  // use; without them those letters fall back to another face mid-word.
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
  variable: "--font-playfair",
});

/**
 * The reading face.
 *
 * Body text used to be set in DM Mono, and the prose helpers escaped it into
 * Playfair — which is a display face: high contrast, tight, drawn for a
 * headline at 40px. At 17px on a phone at eleven at night it is thin and hard
 * work, and a letter to a child is exactly the thing somebody reads then.
 *
 * Literata is drawn for long-form reading on a screen (it is what Google Play
 * Books is set in). Generous x-height so it holds at small sizes, warm without
 * being decorative, and not one of the pairings — Lora, Merriweather, Source
 * Serif — that turn up on every second site. Playfair stays for headings,
 * where it is very good; DM Mono stays for the things monospace is actually
 * for: eyebrows, counts, timestamps, figures in a column.
 */
const literata = Literata({
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
  variable: "--font-literata",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-dm-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oyun.cotek.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Oyun — Pregnancy & Early Parenthood Companion, With Faith or Without",
    template: "%s · Oyun",
  },
  description:
    "Oyun walks you week by week from conception through your child's first two years — what's unfolding, a reflection and one thing to do, a health log for your appointments, and a circle of support — with Christian faith or without religious content, as you choose. Guided by Agbebi.",
  keywords: [
    "pregnancy app",
    "pregnancy week by week",
    "pregnancy app for couples",
    "pregnancy health log",
    "blood pressure in pregnancy log",
    "doctor's report pregnancy",
    "pregnancy journal",
    "baby's first two years",
    "letters to my baby",
    "pregnancy support circle",
    "Christian pregnancy app",
    "pregnancy devotional",
    "pregnancy app without religion",
  ],
  applicationName: "Oyun",
  authors: [{ name: "cotek app FZ-LLC" }],
  creator: "cotek app FZ-LLC",
  publisher: "cotek app FZ-LLC",
  category: "lifestyle",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: "Oyun",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    siteName: "Oyun",
    locale: "en_US",
    title: "Oyun — Pregnancy & Early Parenthood Companion",
    description:
      "A companion from conception through your child's earliest years — each week's stage, a reflection, a health log and the people who love you close. With faith or without. Guided by Agbebi.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Oyun — Pregnancy & Early Parenthood Companion",
    description:
      "Walk pregnancy through your baby's first years with a word for each week and a circle who loves you — with faith or without. Guided by Agbebi.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#14110d" },
    { media: "(prefers-color-scheme: light)", color: "#efeae0" },
  ],
};

// Set the theme before first paint to avoid a flash of the wrong theme.
const themeInit = `(function(){try{var t=localStorage.getItem('oyun-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${literata.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <div className="tabbar-pad relative z-10 flex min-h-dvh flex-col">
          <OfflineBanner />
          <div className="flex-1">{children}</div>
          <Disclaimer />
        </div>
        <AssistantChat />
        <PwaRegister />
        <NativePush />
        <KnowTheHour />
      </body>
    </html>
  );
}
