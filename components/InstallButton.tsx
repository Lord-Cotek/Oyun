"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * "Install Oyun" affordance. On Chromium (Android/desktop) it uses the native
 * beforeinstallprompt. On iOS Safari (which has no such event) it reveals the
 * Add-to-Home-Screen steps. Hidden entirely once installed.
 */
export function InstallButton({ className = "" }: { className?: string }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOS, setShowIOS] = useState(false);

  useEffect(() => {
    // Inside the native app (App Store / Play install) there's nothing to
    // install — the button is redundant, so hide it entirely.
    const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } })
      .Capacitor;
    const inNativeShell =
      cap?.isNativePlatform?.() === true ||
      window.navigator.userAgent.includes("OyunNative");
    if (inNativeShell) {
      setInstalled(true);
      return;
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) {
      setInstalled(true);
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua);
    setIsIOS(ios);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;
  // Nothing to offer: not iOS and no native prompt captured yet.
  if (!deferred && !isIOS) return null;

  async function onClick() {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    } else if (isIOS) {
      setShowIOS((v) => !v);
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
      >
        <DownloadIcon />
        Install Oyun
      </button>

      {showIOS && isIOS && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-border bg-surface p-4 shadow-xl">
          <p className="eyebrow mb-2">Add to Home Screen</p>
          <ol className="list-decimal space-y-1 pl-4 font-mono text-[0.7rem] leading-relaxed text-muted">
            <li>Tap the Share button in Safari.</li>
            <li>Choose &ldquo;Add to Home Screen&rdquo;.</li>
            <li>Tap Add — Oyun lives on your home screen.</li>
          </ol>
          <button
            type="button"
            onClick={() => setShowIOS(false)}
            className="mt-2 font-mono text-[0.68rem] text-accent underline underline-offset-2"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}
