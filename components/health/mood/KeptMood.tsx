"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/ui/Confirm";
import { removeMoodCheck, setMoodForDoctor } from "@/app/health/mood/actions";

/** The controls on one kept result: show it to her doctor, or remove it. */
export function KeptMoodControls({ id, shared, hasDoctor }: { id: string; shared: boolean; hasDoctor: boolean }) {
  const router = useRouter();
  const [on, setOn] = useState(shared);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  useEffect(() => setOn(shared), [shared]);

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border/70 pt-2">
      <label className={`flex min-h-11 items-center gap-2.5 ${hasDoctor ? "cursor-pointer" : "opacity-60"}`}>
        <input
          type="checkbox"
          checked={on}
          disabled={pending || !hasDoctor}
          onChange={(e) => {
            const want = e.target.checked;
            setOn(want);
            start(async () => {
              setError(null);
              const res = await setMoodForDoctor(id, want);
              if (!res.ok) {
                setError(res.error);
                setOn(!want);
              }
              router.refresh();
            });
          }}
          className="h-4 w-4 shrink-0 accent-[var(--accent)]"
        />
        <span className="prose-serif-xs text-ink">Show this one to my doctor</span>
      </label>
      <ConfirmButton
        press="none"
        describe="this mood check result"
        onConfirm={async () => {
          const res = await removeMoodCheck(id);
          if (!res.ok) {
            setError(res.error);
            return { ok: false };
          }
          router.refresh();
        }}
        className="py-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-negative"
      />
      {error && <p className="w-full prose-serif-xs text-negative">{error}</p>}
    </div>
  );
}
