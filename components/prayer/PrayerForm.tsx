"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { addPrayerRequest } from "@/app/prayer/actions";

export function PrayerForm() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await addPrayerRequest(fd);
        formRef.current?.reset();
      }}
      className="space-y-3"
    >
      <input
        name="title"
        required
        maxLength={200}
        placeholder="What can your circle pray for?"
        className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <textarea
        name="body"
        rows={3}
        placeholder="Any detail you'd like to add (optional)"
        className="w-full resize-none rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm leading-relaxed text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <Submit />
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
    >
      {pending ? "Sharing…" : "Ask for prayer"}
    </button>
  );
}
