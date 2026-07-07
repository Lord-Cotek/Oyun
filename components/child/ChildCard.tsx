"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ChildForm } from "@/components/child/ChildForm";
import { deleteChild } from "@/app/child/actions";

type Child = {
  id: string;
  name: string;
  sex: string | null;
  birthDate: string | null;
  photoUrl: string | null;
  note: string | null;
  ageLabel: string | null;
  firsts: number;
};

export function ChildCard({ child }: { child: Child }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <Card className="p-6">
        <p className="eyebrow mb-4">Edit {child.name}</p>
        <ChildForm child={child} onDone={() => setEditing(false)} />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        {child.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={child.photoUrl}
            alt={child.name}
            className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent/15 font-serif text-2xl text-accent">
            {child.name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-serif text-2xl leading-tight text-ink">{child.name}</p>
          <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
            {[child.sex === "boy" ? "Boy" : child.sex === "girl" ? "Girl" : null, child.ageLabel]
              .filter(Boolean)
              .join(" · ") || "Little one"}
          </p>
          {child.note && (
            <p className="mt-2 font-mono text-xs leading-relaxed text-muted">{child.note}</p>
          )}
          <p className="mt-2 font-mono text-[0.68rem] text-muted">
            {child.firsts} first{child.firsts === 1 ? "" : "s"} remembered
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="font-mono text-xs text-muted hover:text-accent"
        >
          Edit
        </button>
        <form action={deleteChild}>
          <input type="hidden" name="id" value={child.id} />
          <button
            type="submit"
            className="font-mono text-xs text-muted underline-offset-2 hover:text-negative hover:underline"
          >
            Remove
          </button>
        </form>
      </div>
    </Card>
  );
}
