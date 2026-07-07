"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { addMilestone } from "@/app/care/actions";

const KINDS: { value: string; label: string }[] = [
  { value: "FIRST_KICK", label: "First kick" },
  { value: "ULTRASOUND", label: "Ultrasound" },
  { value: "HEARTBEAT", label: "Heartbeat" },
  { value: "BIRTH", label: "Birth" },
  { value: "FIRST_SMILE", label: "First smile" },
  { value: "FIRST_WORD", label: "First word" },
  { value: "FIRST_STEPS", label: "First steps" },
  { value: "CUSTOM", label: "Something else" },
];

export function MilestoneForm({
  children = [],
}: {
  children?: { id: string; name: string }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await addMilestone(fd);
        formRef.current?.reset();
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="eyebrow mb-1.5 block text-muted">The first</span>
          <select
            name="kind"
            defaultValue="FIRST_KICK"
            className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm text-ink focus:border-accent focus:outline-none"
          >
            {KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="eyebrow mb-1.5 block text-muted">When</span>
          <input
            type="date"
            name="occurredAt"
            className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm text-ink focus:border-accent focus:outline-none"
          />
        </label>
      </div>
      {children.length > 0 && (
        <label className="block">
          <span className="eyebrow mb-1.5 block text-muted">Which child?</span>
          <select
            name="childId"
            defaultValue=""
            className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm text-ink focus:border-accent focus:outline-none"
          >
            <option value="">The whole family</option>
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <input
        type="text"
        name="note"
        placeholder="A note to remember it by (optional)"
        className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <label className="block">
        <span className="eyebrow mb-1.5 block text-muted">Photo (optional)</span>
        <input
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          className="w-full font-mono text-xs text-muted file:mr-3 file:rounded-md file:border file:border-border file:bg-bg file:px-3 file:py-1.5 file:font-mono file:text-xs file:text-ink hover:file:border-accent hover:file:text-accent"
        />
      </label>
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
      {pending ? "Remembering…" : "Remember this first"}
    </button>
  );
}
