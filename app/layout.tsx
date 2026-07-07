import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Mono } from "next/font/google";
import "./globals.css";
import { AssistantChat } from "@/components/AssistantChat";
import { Disclaimer } from "@/components/Disclaimer";

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
  themeColor: "#0B0E14",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmMono.variable}`}>
      <body className="grain">
        <div className="relative z-10 flex min-h-dvh flex-col">
          <div className="flex-1">{children}</div>
          <Disclaimer />
        </div>
        <AssistantChat />
      </body>
    </html>
  );
}
