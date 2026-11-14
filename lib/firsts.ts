/**
 * What a first is called — shared by the form, the timeline and the server.
 *
 * It lived inside a client component, which a server action cannot call:
 * importing from a "use client" file on the server gives back a reference
 * to a component, not the function. So the words live here, and both sides
 * import them.
 */
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

/**
 * The words a first is shared to the circle with.
 *
 * "Ada's first smile 💛", then the parent's own note, then the day if it was
 * not today — a first shared a week late should not read as if it happened
 * this morning. The kind's label is lowercased after a name ("Ada's first
 * smile"); the parent's own title is left exactly as they wrote it.
 */
export function firstPostBody(input: {
  kind: string;
  title?: string | null;
  note?: string | null;
  childName?: string | null;
  occurredAt: Date;
  now?: Date;
}): string {
  const own = input.title?.trim();
  const base = milestoneTitle(input.kind, input.title);
  const name = input.childName?.trim();
  // "Ada’s first smile" for the app's own words; "Ada — Rolled over" for a
  // parent's, which may not be a noun at all and are left as written.
  const said = !name
    ? base
    : own
      ? `${name} — ${own}`
      : `${name}${/s$/i.test(name) ? "’" : "’s"} ${base.charAt(0).toLowerCase() + base.slice(1)}`;
  const now = input.now ?? new Date();
  const sameDay = input.occurredAt.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
  const when = sameDay
    ? null
    : `On ${input.occurredAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: input.occurredAt.getUTCFullYear() === now.getUTCFullYear() ? undefined : "numeric", timeZone: "UTC" })}.`;
  return [`${said} 💛`, input.note?.trim() || null, when].filter(Boolean).join("\n\n");
}
