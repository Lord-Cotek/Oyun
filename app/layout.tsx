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
    default: "Oyun — Walk the whole journey, together",
    template: "%s · Oyun",
  },
  description:
    "A Christian companion for the whole journey — conception through a child's first two years — for an expectant mother and her partner. Guided by Agbebi.",
  applicationName: "Oyun",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Oyun",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    siteName: "Oyun",
    title: "Oyun — Walk the whole journey, together",
    description:
      "Scripture at the center, from conception through a child's earliest years. Guided by Agbebi.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Oyun",
    description: "Walk the whole journey — together — with Scripture at the center.",
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
