"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { updateMilestone, deleteMilestone } from "@/app/care/actions";
import { MilestoneFields, milestoneTitle } from "@/components/care/MilestoneFields";

export type MilestoneData = {
  id: string;
  kind: string;
  title: string | null;
  note: string | null;
  occurredAt: string; // ISO
  photoUrls: string[];
  childId: string | null;
  childName: string | null;
};

export function MilestoneItem({
  m,
  children,
}: {
  m: MilestoneData;
  children: { id: string; name: string }[];
}) {
  const [editing, setEditing] = useState(false);
  const occurred = new Date(m.occurredAt);
  const childId = m.childId ?? "";

  if (editing) {
    return (
      <li className="relative">
        <span className="absolute -left-[1.4rem] top-1.5 h-2 w-2 rounded-full bg-accent ring-4 ring-bg" />
        <form
          action={async (fd) => {
            await updateMilestone(fd);
            setEditing(false);
          }}
          className="space-y-3 rounded-lg border border-border bg-bg p-4"
        >
          <input type="hidden" name="id" value={m.id} />
          <MilestoneFields
            children={children}
            existingPhotoUrls={m.photoUrls}
            defaults={{
              kind: m.kind,
              title: m.title,
              note: m.note,
              occurredAt: occurred.toISOString().slice(0, 10),
              childId,
            }}
          />
          <div className="flex items-center gap-3">
            <SaveBtn />
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="font-mono text-xs text-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="relative">
      <span className="absolute -left-[1.4rem] top-1.5 h-2 w-2 rounded-full bg-accent ring-4 ring-bg" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-sm text-ink">
            {milestoneTitle(m.kind, m.title)}
            {m.childName && (
              <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[0.6rem] text-accent">
                {m.childName}
              </span>
            )}
          </p>
          {m.note && (
            <p className="mt-0.5 font-mono text-xs leading-relaxed text-muted">{m.note}</p>
          )}
          <p className="mt-0.5 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
            {occurred.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {m.photoUrls.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {m.photoUrls.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt={`${milestoneTitle(m.kind, m.title)} — photo`}
                  className="h-28 w-28 rounded-lg border border-border object-cover sm:h-32 sm:w-32"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Edit"
            className="font-mono text-[0.68rem] text-muted hover:text-accent"
          >
            Edit
          </button>
          <form action={deleteMilestone}>
            <input type="hidden" name="id" value={m.id} />
            <DeleteBtn />
          </form>
        </div>
      </div>
    </li>
  );
}

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

function DeleteBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Delete"
      className="font-mono text-[0.68rem] text-muted hover:text-negative disabled:opacity-50"
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}
