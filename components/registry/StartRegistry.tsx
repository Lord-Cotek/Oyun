"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Pressable } from "@/components/ui/Pressable";
import { createRegistry } from "@/app/registry/actions";
import { HOST_MAX, MESSAGE_MAX, TITLE_MAX } from "@/lib/registry";

const field =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";
const label =
  "mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted";

/**
 * Starting one.
 *
 * Nothing exists until this is filled in. A registry that appeared by itself
 * — empty, on the home screen, asking to be filled — would be the app asking
 * a family for a shopping list, which is the wrong way round entirely.
 *
 * Three fields, and two of them are prefilled. The point is to be through
 * this screen in twenty seconds and looking at the list.
 */
export function StartRegistry({
  suggestedTitle,
  suggestedHost,
}: {
  suggestedTitle: string;
  suggestedHost: string;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (fd) => {
        setError(null);
        const res = await createRegistry(fd);
        if (!res.ok) setError(res.error);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="start-title" className={label}>
          What to call it
        </label>
        <input
          id="start-title"
          name="title"
          defaultValue={suggestedTitle}
          maxLength={TITLE_MAX}
          required
          className={field}
        />
      </div>
      <div>
        <label htmlFor="start-host" className={label}>
          Who it is from
        </label>
        <input
          id="start-host"
          name="hostName"
          defaultValue={suggestedHost}
          maxLength={HOST_MAX}
          required
          className={field}
        />
        <p className="mt-1.5 prose-serif-xs text-muted">
          Whatever you type here is all a stranger opening the link learns
          about you. No due date, no photographs, nothing from the rest of the
          app.
        </p>
      </div>
      <div>
        <label htmlFor="start-message" className={label}>
          A word to whoever opens it <span className="normal-case">(optional)</span>
        </label>
        <textarea
          id="start-message"
          name="message"
          rows={3}
          maxLength={MESSAGE_MAX}
          placeholder="Thank you for thinking of us. Nothing here is expected — your prayers are the gift."
          className={`${field} resize-none`}
        />
      </div>
      {error && <p className="prose-serif-xs text-negative">{error}</p>}
      <Submit />
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Pressable
      type="submit"
      disabled={pending}
      className="btn-primary rounded-lg px-5 py-2.5 font-mono text-sm font-medium text-on-accent disabled:opacity-50"
    >
      {pending ? "Making it…" : "Start the registry"}
    </Pressable>
  );
}
