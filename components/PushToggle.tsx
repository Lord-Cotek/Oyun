"use client";

import { useEffect, useState } from "react";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function PushToggle() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      !!VAPID_PUBLIC;
    setSupported(ok);
    if (!ok) return;
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setSubscribed(!!sub))
      .catch(() => {});
  }, []);

  if (!VAPID_PUBLIC) {
    return (
      <p className="font-mono text-[0.7rem] leading-relaxed text-muted">
        Push notifications aren&rsquo;t configured yet.
      </p>
    );
  }

  if (!supported) {
    return (
      <p className="font-mono text-[0.7rem] leading-relaxed text-muted">
        This browser doesn&rsquo;t support push notifications. On iPhone, install
        Oyun to your Home Screen first, then enable them from there.
      </p>
    );
  }

  async function enable() {
    setBusy(true);
    setMsg(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMsg("Permission was declined.");
        setBusy(false);
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC!) as BufferSource,
      });
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      if (res.ok) {
        setSubscribed(true);
        setMsg("Notifications are on for this device.");
      } else {
        setMsg("Couldn't enable notifications. Please try again.");
      }
    } catch {
      setMsg("Couldn't enable notifications. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    setMsg(null);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setSubscribed(false);
      setMsg("Notifications turned off for this device.");
    } catch {
      setMsg("Couldn't turn them off. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-bg p-4">
      <p className="font-mono text-sm text-ink">Push to this device</p>
      <p className="mb-3 font-mono text-[0.7rem] leading-relaxed text-muted">
        Get a gentle notification on this device when someone prays for you or
        sends a word — even when Oyun is closed.
      </p>
      <div className="flex items-center gap-3">
        {subscribed ? (
          <button
            type="button"
            onClick={disable}
            disabled={busy}
            className="rounded-lg border border-border px-3.5 py-2 font-mono text-xs text-ink transition-colors hover:border-negative hover:text-negative disabled:opacity-50"
          >
            {busy ? "…" : "Turn off"}
          </button>
        ) : (
          <button
            type="button"
            onClick={enable}
            disabled={busy}
            className="rounded-lg bg-accent px-3.5 py-2 font-mono text-xs font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
          >
            {busy ? "Enabling…" : "Enable notifications"}
          </button>
        )}
        {msg && <span className="font-mono text-[0.7rem] text-muted">{msg}</span>}
      </div>
    </div>
  );
}
