/**
 * The browser's "you can install this" moment, caught once and kept.
 *
 * Chromium fires `beforeinstallprompt` a single time, early in the first page
 * load. The install button lives inside menus that are only mounted when
 * somebody opens them — long after the event has come and gone — so a button
 * listening for itself never heard it, and on Android it simply never
 * appeared. PwaRegister, which is on every page from the start, calls
 * `captureInstallPrompt()`; the button reads what was caught and subscribes
 * for anything later.
 */

export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let caught: InstallPromptEvent | null = null;
let listening = false;
const subscribers = new Set<(e: InstallPromptEvent | null) => void>();

function tell() {
  subscribers.forEach((fn) => fn(caught));
}

/** Start listening. Safe to call more than once. */
export function captureInstallPrompt(): void {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    caught = e as InstallPromptEvent;
    tell();
  });
  window.addEventListener("appinstalled", () => {
    caught = null;
    tell();
  });
}

/** What has been caught so far, if anything. */
export function installPrompt(): InstallPromptEvent | null {
  return caught;
}

/** A prompt can be used once; after it is, forget it. */
export function spendInstallPrompt(): void {
  caught = null;
  tell();
}

/** Hear about it arriving (or going). Returns the unsubscribe. */
export function onInstallPrompt(fn: (e: InstallPromptEvent | null) => void): () => void {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}
