"use client";

import { useEffect } from "react";

/** Registers the service worker so Oyun is installable and works offline. */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Check for an updated worker (e.g. the cache-safety fix) on each load.
          reg.update().catch(() => {});
        })
        .catch(() => {
          /* registration is best-effort */
        });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
