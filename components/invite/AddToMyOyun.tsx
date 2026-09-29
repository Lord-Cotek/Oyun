"use client";

import { useState } from "react";
import { addInvitationToMyDiary } from "@/app/i/[slug]/add-to-diary";

/**
 * "Put it in my own Oyun diary" — for a guest who already keeps a house here.
 *
 * Two mothers both use Oyun and one invites the other to a shower. The .ics
 * button beside this one puts the day in their phone's calendar, which is
 * right for everybody else — but for these two it left the day missing from
 * the one app the second household actually keeps its days in, so nobody
 * there got the day-before or the morning.
 *
 * Shown only to the mother or the one beside her, signed in. For everybody else the
 * calendar file is the answer, and an offer that ends at a sign-in page is
 * worse than no offer — so this is not rendered at all rather than rendered
 * and then refused.
 */
export function AddToMyOyun({ slug }: { slug: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "already">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  if (state === "done" || state === "already") {
    return (
      <p role="status" className="font-mono text-xs text-positive">
        {state === "already"
          ? "Already in your diary."
          : "In your diary — you will be reminded the day before and on the morning."}
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={state === "busy"}
        onClick={async () => {
          setState("busy");
          setError(null);
          const res = await addInvitationToMyDiary(slug);
          if (res.ok) setState(res.already ? "already" : "done");
          else {
            setState("idle");
            setError(res.error);
          }
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-accent/50 px-3.5 py-2 font-mono text-xs text-accent transition-colors hover:bg-accent/[0.08] disabled:opacity-50"
      >
        {state === "busy" ? "Adding…" : "Put it in my Oyun diary"}
      </button>
      {error && (
        <p className="mt-1.5 font-mono text-[0.68rem] text-negative">{error}</p>
      )}
    </div>
  );
}
