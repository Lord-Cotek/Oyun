"use client";

import { useState } from "react";
import { MilestoneItem, type MilestoneData } from "@/components/care/MilestoneItem";

/**
 * The "firsts" timeline with an optional per-child filter (shown only when the
 * journey has more than one child). Client-side so filtering is instant.
 */
export function FirstsTimeline({
  milestones,
  children,
}: {
  milestones: MilestoneData[];
  children: { id: string; name: string }[];
}) {
  const [childId, setChildId] = useState<string>("all");
  const filtered =
    childId === "all" ? milestones : milestones.filter((m) => m.childId === childId);

  return (
    <div>
      {children.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Chip active={childId === "all"} onClick={() => setChildId("all")}>
            All
          </Chip>
          {children.map((c) => (
            <Chip
              key={c.id}
              active={childId === c.id}
              onClick={() => setChildId(c.id)}
            >
              {c.name}
            </Chip>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="font-mono text-xs leading-relaxed text-muted">
          {milestones.length === 0
            ? "Nothing logged yet. The firsts go by quickly — catch the next one here."
            : "No firsts for this little one yet."}
        </p>
      ) : (
        <ol className="relative space-y-5 border-l border-border pl-5">
          {filtered.map((m) => (
            <MilestoneItem key={m.id} m={m} children={children} />
          ))}
        </ol>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
        active
          ? "border-accent bg-accent/10 text-accent"
          : "border-border text-muted hover:border-accent/50 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
