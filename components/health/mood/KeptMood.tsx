"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/ui/Confirm";
import { removeMoodCheck, setMoodForDoctor, setMoodForPartner } from "@/app/health/mood/actions";

type Result = { ok: true } | { ok: false; error: string };

/** One switch: it moves at once, and goes back if saving it fails. */
function Switch({
  label,
  shared,
  onSet,
  onError,
}: {
  label: string;
  shared: boolean;
  onSet: (want: boolean) => Promise<Result>;
  onError: (message: string | null) => void;
}) {
  const router = useRouter();
  const [on, setOn] = useState(shared);
  const [pending, start] = useTransition();
  useEffect(() => setOn(shared), [shared]);
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        checked={on}
        disabled={pending}
        onChange={(e) => {
          const want = e.target.checked;
          setOn(want);
          start(async () => {
            onError(null);
            const res = await onSet(want);
            if (!res.ok) {
              onError(res.error);
              setOn(!want);
            }
            router.refresh();
          });
        }}
        className="h-4 w-4 shrink-0 accent-[var(--accent)]"
      />
      <span className="prose-serif-xs text-ink">{label}</span>
    </label>
  );
}

/**
 * The controls on one kept result: show it to her partner, show it to her
 * doctor, or remove it. Each switch is offered only when there is somebody
 * to show it to, and each is off until she turns it on.
 */
export function KeptMoodControls({
  id,
  forDoctor,
  forPartner,
  hasDoctor,
  partnerName,
}: {
  id: string;
  forDoctor: boolean;
  forPartner: boolean;
  hasDoctor: boolean;
  /** Her partner's first name, or null when there is no partner on the journey. */
  partnerName: string | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-3 border-t border-border/70 pt-2">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-0">
        {partnerName && (
          <Switch label={`Show this one to ${partnerName}`} shared={forPartner} onSet={(want) => setMoodForPartner(id, want)} onError={setError} />
        )}
        {hasDoctor && <Switch label="Show this one to my doctor" shared={forDoctor} onSet={(want) => setMoodForDoctor(id, want)} onError={setError} />}
      </div>
      {partnerName && forPartner && (
        <p className="prose-serif-xs text-muted">
          {partnerName} sees what this comes to and what helps, not your answers one by one. Untick it and it is gone from his page.
        </p>
      )}
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
      {error && <p className="prose-serif-xs text-negative">{error}</p>}
    </div>
  );
}
