"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { addCheckIn } from "@/app/care/actions";
import { MOOD_ORDER, MOOD_META } from "@/lib/moods";
import { DraftTextarea } from "@/components/ui/DraftTextarea";

export function CheckInForm({ shareable = true }: { shareable?: boolean }) {
  const [mood, setMood] = useState<string>("STEADY");
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await addCheckIn(fd);
        formRef.current?.reset();
        setMood("STEADY");
      }}
      className="space-y-4"
    >
      <input type="hidden" name="mood" value={mood} />
      <div className="flex flex-wrap gap-2">
        {MOOD_ORDER.map((m) => {
          const meta = MOOD_META[m];
          const selected = mood === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              aria-pressed={selected}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
                selected
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border text-muted hover:border-accent/60 hover:text-ink"
              }`}
            >
              {meta.label}
            </button>
          );
        })}
      </div>
      <DraftTextarea
        draftKey="care:checkin"
        name="note"
        rows={2}
        placeholder={
          shareable
            ? "A word about today (optional) — this stays yours unless you share it."
            : "A word about today (optional) — this stays yours."
        }
        className="w-full resize-none rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />
      {/* Off unless she ticks it. Her mood goes to whoever she chose on this
          page; her words go only where she sends them. When she keeps her
          mood to herself there is nobody to share a note with. */}
      {shareable && (
        <label className="flex items-start gap-2.5 prose-serif-xs text-muted">
          <input
            type="checkbox"
            name="shareNote"
            className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--accent)]"
          />
          <span>
            Share this note with the people who see how I am — not just the
            mood.
          </span>
        </label>
      )}
      <Submit label="Save today" />
    </form>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
