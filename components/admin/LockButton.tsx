"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { lock } from "@/app/admintc/unlock-actions";

/** Close the centre without signing out of the app. */
export function LockButton() {
  const [busy, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() =>
        start(async () => {
          await lock();
          router.refresh();
        })
      }
      className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40 underline underline-offset-4 hover:text-white disabled:opacity-40"
    >
      {busy ? "Locking…" : "Lock"}
    </button>
  );
}
