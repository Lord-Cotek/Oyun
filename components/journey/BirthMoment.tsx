"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { recordBirth } from "@/app/journey/birth-actions";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

export function BirthMoment({
  babyCount,
  overdue,
}: {
  babyCount: number;
  overdue: boolean;
}) {
  const [open, setOpen] = useState(overdue);

  if (!open) {
    return (
      <Card className="border-accent2/40 bg-accent2/[0.06]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <OyunMark size={28} className="text-ink" />
            <p className="font-mono text-sm text-ink">
              Has your {babyCount > 1 ? "little ones" : "little one"} arrived?
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep"
          >
            Yes — welcome them
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-accent/40 bg-accent/[0.06] p-8">
      <Eyebrow className="mb-3">A new life</Eyebrow>
      <h2 className="font-serif text-3xl leading-snug text-ink">
        Welcome, little {babyCount > 1 ? "ones" : "one"}. 🌱
      </h2>
      <p className="mt-3 max-w-prose font-mono text-sm leading-relaxed text-muted">
        Tell us when they arrived and their name{babyCount > 1 ? "s" : ""}. We&rsquo;ll
        set your journey to the right day, begin their profile{babyCount > 1 ? "s" : ""},
        and remember this first of all firsts.
      </p>

      <form action={recordBirth} className="mt-6 space-y-4">
        <label className="block max-w-xs">
          <span className="eyebrow mb-2 block text-muted">Birth date</span>
          <input type="date" name="birthDate" required className={inputClass} />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: babyCount }).map((_, i) => (
            <label key={i} className="block">
              <span className="eyebrow mb-2 block text-muted">
                {babyCount > 1 ? `Baby ${i + 1} name` : "Baby's name"}
              </span>
              <input
                name={`name${i}`}
                placeholder="Their name"
                className={inputClass}
              />
            </label>
          ))}
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="share"
            defaultChecked
            className="h-4 w-4 accent-[color:var(--accent)]"
          />
          <span className="font-mono text-xs text-muted">
            Share the joy with my circle
          </span>
        </label>

        <div className="flex items-center gap-3">
          <Submit multiple={babyCount > 1} />
          {!overdue && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono text-xs text-muted hover:text-ink"
            >
              Not yet
            </button>
          )}
        </div>
      </form>
    </Card>
  );
}

function Submit({ multiple }: { multiple: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
    >
      {pending ? "Welcoming…" : multiple ? "Welcome them" : "Welcome them"}
    </button>
  );
}
