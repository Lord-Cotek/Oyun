"use client";

import { useState } from "react";

export const MILESTONE_KINDS: { value: string; label: string }[] = [
  { value: "FIRST_KICK", label: "First kick" },
  { value: "ULTRASOUND", label: "Ultrasound" },
  { value: "HEARTBEAT", label: "Heartbeat" },
  { value: "BIRTH", label: "Birth" },
  { value: "FIRST_SMILE", label: "First smile" },
  { value: "FIRST_WORD", label: "First word" },
  { value: "FIRST_STEPS", label: "First steps" },
  { value: "CUSTOM", label: "Something else" },
];

export const KIND_LABEL: Record<string, string> = Object.fromEntries(
  MILESTONE_KINDS.map((k) => [k.value, k.label]),
);

export function milestoneTitle(kind: string, title?: string | null): string {
  if (title && title.trim()) return title.trim();
  if (kind === "CUSTOM") return "A first";
  return KIND_LABEL[kind] ?? "A first";
}

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

export function MilestoneFields({
  children = [],
  defaults,
  existingPhotoUrls = [],
}: {
  children?: { id: string; name: string }[];
  defaults?: {
    kind?: string;
    title?: string | null;
    note?: string | null;
    occurredAt?: string;
    childId?: string | null;
  };
  existingPhotoUrls?: string[];
}) {
  const [kind, setKind] = useState(defaults?.kind ?? "FIRST_KICK");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="eyebrow mb-1.5 block text-muted">The first</span>
          <select
            name="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className={inputClass}
          >
            {MILESTONE_KINDS.map((k) => (
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
            defaultValue={defaults?.occurredAt}
            className={`${inputClass} [color-scheme:dark]`}
          />
        </label>
      </div>

      {kind === "CUSTOM" && (
        <label className="block">
          <span className="eyebrow mb-1.5 block text-muted">What is it?</span>
          <input
            name="title"
            required
            defaultValue={defaults?.title ?? ""}
            placeholder="e.g. First laugh, first bath, first tooth"
            className={inputClass}
          />
        </label>
      )}

      {children.length > 0 && (
        <label className="block">
          <span className="eyebrow mb-1.5 block text-muted">Which child?</span>
          <select name="childId" defaultValue={defaults?.childId ?? ""} className={inputClass}>
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
        defaultValue={defaults?.note ?? ""}
        placeholder="A note to remember it by (optional)"
        className={inputClass}
      />

      {existingPhotoUrls.length > 0 && (
        <div>
          <span className="eyebrow mb-1.5 block text-muted">Photos</span>
          <div className="flex flex-wrap gap-3">
            {existingPhotoUrls.map((url) => (
              <label key={url} className="flex cursor-pointer flex-col items-center gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Photo" className="h-16 w-16 rounded-lg border border-border object-cover" />
                <span className="flex items-center gap-1 font-mono text-[0.62rem] text-muted">
                  <input
                    type="checkbox"
                    name="removePhoto"
                    value={url}
                    className="h-3.5 w-3.5 accent-[color:var(--negative)]"
                  />
                  remove
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <label className="block">
        <span className="eyebrow mb-1.5 block text-muted">
          {existingPhotoUrls.length > 0 ? "Add more photos" : "Photos (optional)"}
        </span>
        <input
          type="file"
          name="photo"
          multiple
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          className="w-full font-mono text-xs text-muted file:mr-3 file:rounded-md file:border file:border-border file:bg-bg file:px-3 file:py-1.5 file:font-mono file:text-xs file:text-ink hover:file:border-accent hover:file:text-accent"
        />
        <span className="mt-1 block font-mono text-[0.68rem] text-muted">
          You can select several at once (up to 8).
        </span>
      </label>
    </div>
  );
}
