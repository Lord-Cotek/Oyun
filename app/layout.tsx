import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Mono } from "next/font/google";
import "./globals.css";
import { AssistantChat } from "@/components/AssistantChat";
import { Disclaimer } from "@/components/Disclaimer";
import { PwaRegister } from "@/components/PwaRegister";
import { NativePush } from "@/components/NativePush";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
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
    default: "Oyun — Christian Pregnancy App & Devotional for Couples",
    template: "%s · Oyun",
  },
  description:
    "Oyun is a Christian pregnancy app and daily devotional walking you week by week from conception through your child's first two years — Scripture, prayer, and one thing to do — for an expectant mother and her partner together. Guided by Agbebi.",
  keywords: [
    "Christian pregnancy app",
    "Christian pregnancy tracker",
    "pregnancy devotional",
    "faith-based pregnancy app",
    "pregnancy prayer app",
    "Bible verses for pregnancy",
    "pregnancy week by week Christian",
    "Christian pregnancy journal",
    "pregnancy app for couples",
    "expecting parents devotional",
    "Christian baby app",
    "newborn devotional",
    "letters to my baby",
    "prayer for expecting mothers",
    "Reformed pregnancy app",
    "family worship",
    "children's catechism",
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
    title: "Oyun — Christian Pregnancy App & Devotional for Couples",
    description:
      "A Christian pregnancy companion — Scripture, prayer, and gentle guidance from conception through your child's earliest years, for a mother and her partner. Guided by Agbebi.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Oyun — Christian Pregnancy App for Couples",
    description:
      "Walk pregnancy through your baby's first years with Scripture, prayer, and a circle who loves you. Guided by Agbebi.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0E14" },
    { media: "(prefers-color-scheme: light)", color: "#F4F1EA" },
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
      className={`${playfair.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="grain">
        <div className="relative z-10 flex min-h-dvh flex-col">
          <div className="flex-1">{children}</div>
          <Disclaimer />
        </div>
        <AssistantChat />
        <PwaRegister />
        <NativePush />
      </body>
    </html>
  );
}
