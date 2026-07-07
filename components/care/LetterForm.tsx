"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { addLetter } from "@/app/care/actions";

export function LetterForm() {
  const [toBaby, setToBaby] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await addLetter(fd);
        formRef.current?.reset();
      }}
      className="space-y-3"
    >
      <input type="hidden" name="toBaby" value={String(toBaby)} />
      <div className="flex gap-2">
        <Toggle active={toBaby} onClick={() => setToBaby(true)} label="To the baby" />
        <Toggle active={!toBaby} onClick={() => setToBaby(false)} label="To each other" />
      </div>
      <textarea
        name="body"
        rows={4}
        required
        placeholder={
          toBaby
            ? "Dear little one…"
            : "Words to keep for the two of you…"
        }
        className="w-full resize-none rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm leading-relaxed text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <Submit />
    </form>
  );
}

function Toggle({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
        active
          ? "border-accent bg-accent/15 text-accent"
          : "border-border text-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
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
      {pending ? "Keeping…" : "Keep this letter"}
    </button>
  );
}
