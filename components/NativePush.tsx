"use client";

import { useEffect } from "react";

/**
 * Bridges native push into the web app when it's running inside the Capacitor
 * shell. It talks to the FirebaseMessaging plugin through the injected
 * `window.Capacitor` bridge (no bundling needed, since the plugin is registered
 * natively), registers the device token with the server, and routes a tapped
 * notification to its deep link. On a normal browser this is a no-op.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
type Cap = {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
  Plugins?: Record<string, any>;
};

export function NativePush() {
  useEffect(() => {
    const cap: Cap | undefined = (window as any).Capacitor;
    if (!cap?.isNativePlatform?.()) return;
    const FM = cap.Plugins?.FirebaseMessaging;
    if (!FM) return;

    const platform = cap.getPlatform?.() ?? "unknown";
    let cancelled = false;

    async function sendToken(token: string) {
      if (!token) return;
      await fetch("/api/push/native/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, platform }),
      }).catch(() => {});
    }

    async function register() {
      try {
        const perm = await FM.requestPermissions();
        if (perm?.receive && perm.receive !== "granted") return;
        const { token } = await FM.getToken();
        if (!cancelled && token) await sendToken(token);
      } catch {
        /* best-effort */
      }
    }

    register();

    const listeners: Array<{ remove: () => void }> = [];
    // Token can rotate — keep the server current.
    FM.addListener?.("tokenReceived", (e: any) => {
      if (e?.token) sendToken(e.token);
    })?.then?.((l: any) => listeners.push(l));
    // Tapping the notification opens its deep link (same anchors as the bell).
    FM.addListener?.("notificationActionPerformed", (e: any) => {
      const href = e?.notification?.data?.href;
      if (typeof href === "string" && href.startsWith("/")) {
        window.location.assign(href);
      }
    })?.then?.((l: any) => listeners.push(l));

    return () => {
      cancelled = true;
      listeners.forEach((l) => l.remove?.());
    };
  }, []);

  return null;
}
