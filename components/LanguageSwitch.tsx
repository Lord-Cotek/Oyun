"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLanguage } from "@/app/language/actions";
import type { Lang } from "@/lib/i18n";

/**
 * English or Yorùbá. Each name is written in its own language, so whoever
 * needs the other one can find it. Shown only while the "yoruba" switch is on.
 * Shared with the sibling app and drift-checked.
 */
export function LanguageSwitch({ current, className = "" }: { current: Lang; className?: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const pick = (lang: Lang) =>
    start(async () => {
      await setLanguage(lang);
      router.refresh();
    });
  const chip = (on: boolean) =>
    `inline-flex min-h-11 items-center rounded-full border px-4 font-mono text-xs transition-colors disabled:opacity-60 ${
      on ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:text-ink"
    }`;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} role="group" aria-label="Language · Èdè">
      <button type="button" lang="en" className={chip(current === "en")} aria-pressed={current === "en"} disabled={pending} onClick={() => pick("en")}>
        English
      </button>
      <button type="button" lang="yo" className={chip(current === "yo")} aria-pressed={current === "yo"} disabled={pending} onClick={() => pick("yo")}>
        Yorùbá
      </button>
    </div>
  );
}
