import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Oyun's native shell. The app is a thin, branded Capacitor wrapper around the
 * live site (oyun.cotek.app), so the installed iOS/Android app always reflects
 * the deployed web app / PWA exactly. Icons, splash and colours are wired from
 * the brand mark in ./assets via @capacitor/assets — no store placeholders.
 */
const config: CapacitorConfig = {
  appId: "app.cotek.oyun",
  appName: "Oyun",
  webDir: "www",
  backgroundColor: "#0B0E14",
  server: {
    url: "https://oyun.cotek.app",
    allowNavigation: ["oyun.cotek.app"],
    androidScheme: "https",
    iosScheme: "https",
  },
  // Let the web app know it's inside the native shell (e.g. to hide the PWA
  // "install" prompt).
  appendUserAgent: "OyunNative",
  ios: {
    backgroundColor: "#0B0E14",
  },
  android: {
    backgroundColor: "#0B0E14",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      backgroundColor: "#0B0E14",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#0B0E14",
      overlaysWebView: false,
    },
  },
};

export default config;
