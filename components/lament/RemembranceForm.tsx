"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { addRemembrance } from "@/app/lament/actions";

export function RemembranceForm({ placeholder }: { placeholder?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await addRemembrance(fd);
        formRef.current?.reset();
      }}
      className="space-y-3"
    >
      <textarea
        name="body"
        rows={4}
        required
        maxLength={4000}
        placeholder={placeholder ?? "A memory, a prayer, a word you want to keep…"}
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
      {pending ? "Keeping…" : "Leave this word"}
    </button>
  );
}
