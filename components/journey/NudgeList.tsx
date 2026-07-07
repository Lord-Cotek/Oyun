"use client";

import { useTransition } from "react";
import { completeNudge } from "@/app/journey/support-actions";

type NudgeItem = { id: string; text: string; dueAt: string };

export function NudgeList({
  nudges,
  motherName,
}: {
  nudges: NudgeItem[];
  motherName: string;
}) {
  const [pending, start] = useTransition();

  if (nudges.length === 0) {
    return (
      <p className="font-mono text-xs leading-relaxed text-muted">
        No reminders right now. The simplest nudge still holds: check in on{" "}
        {motherName} today.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {nudges.map((n) => (
        <li key={n.id} className="flex items-start gap-2.5">
          <button
            type="button"
            aria-label="Mark done"
            disabled={pending}
            onClick={() => start(() => completeNudge(n.id))}
            className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:bg-accent/10 disabled:opacity-50"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent opacity-0 transition-opacity hover:opacity-100" />
          </button>
          <div>
            <p className="font-mono text-sm text-ink">{n.text}</p>
            <p className="font-mono text-[0.68rem] text-muted">
              {new Date(n.dueAt).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
