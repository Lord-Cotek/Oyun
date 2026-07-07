"use client";

import { useTransition } from "react";
import { markSupport } from "@/app/journey/support-actions";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function SupportActions({
  prayedToday,
  reachedOutToday,
  streak,
  prayedLast7,
  motherName,
}: {
  prayedToday: boolean;
  reachedOutToday: boolean;
  streak: number;
  prayedLast7: number;
  motherName: string;
}) {
  const [pending, start] = useTransition();

  return (
    <div>
      <Eyebrow className="mb-3">Stand with her today</Eyebrow>
      <div className="grid grid-cols-2 gap-3">
        <ActionButton
          done={prayedToday}
          disabled={pending}
          label="I prayed for her"
          doneLabel="Prayed today"
          onClick={() => start(() => markSupport("prayed"))}
        />
        <ActionButton
          done={reachedOutToday}
          disabled={pending}
          label="I reached out"
          doneLabel="Reached out"
          onClick={() => start(() => markSupport("reachedOut"))}
        />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div>
          <p className="font-serif text-3xl leading-none text-accent">{streak}</p>
          <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
            day{streak === 1 ? "" : "s"} in prayer
          </p>
        </div>
        <div className="h-8 w-px bg-border" aria-hidden />
        <p className="font-mono text-xs leading-relaxed text-muted">
          {streak > 0
            ? `You've prayed for ${motherName} ${prayedLast7} of the last 7 days. Keep the faith — steady presence is the gift.`
            : `Begin today. A single faithful prayer for ${motherName} is not small in God's eyes.`}
        </p>
      </div>
    </div>
  );
}

function ActionButton({
  done,
  disabled,
  label,
  doneLabel,
  onClick,
}: {
  done: boolean;
  disabled: boolean;
  label: string;
  doneLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={done}
      title={done ? "Tap to undo" : undefined}
      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 font-mono text-xs transition-colors disabled:opacity-50 ${
        done
          ? "border-accent/50 bg-accent/10 text-accent"
          : "border-border text-ink hover:border-accent hover:text-accent"
      }`}
    >
      {done ? (
        <>
          <CheckIcon /> {doneLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
