"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
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

  const onTheWay = child.ageLabel === "on the way";
  const sexLabel = child.sex === "boy" ? "Boy" : child.sex === "girl" ? "Girl" : null;

  return (
    <Card className="p-6 transition-colors hover:border-accent2/50">
      <div className="flex items-start gap-4">
        <Avatar name={child.name} photoUrl={child.photoUrl} tone="accent2" size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-serif text-2xl leading-tight text-ink">{child.name}</p>
            {onTheWay && (
              <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-accent">
                On the way
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
            {[sexLabel, onTheWay ? null : child.ageLabel].filter(Boolean).join(" · ") ||
              "Little one"}
          </p>
          {child.note && (
            <p className="mt-2 font-mono text-xs leading-relaxed text-muted">{child.note}</p>
          )}
          <p className="mt-2.5 flex items-center gap-1.5 font-mono text-[0.68rem] text-muted">
            <Icon name="star" size={13} className="text-accent" />
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
