/**
 * A person's avatar — their photo if present, else their first initial in a
 * tinted disc. Role-tintable (amber by default, rose for maternal/care roles)
 * so lists like the Circle can be scanned by role at a glance.
 */
export function Avatar({
  name,
  photoUrl,
  tone = "accent",
  size = 40,
}: {
  name?: string | null;
  photoUrl?: string | null;
  tone?: "accent" | "accent2";
  size?: number;
}) {
  const initial = (name?.trim()?.charAt(0) ?? "•").toUpperCase();
  const toneClass =
    tone === "accent2"
      ? "bg-accent2/15 text-accent2 ring-[color-mix(in_srgb,var(--accent2)_30%,transparent)]"
      : "bg-accent/15 text-accent ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]";

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name ?? "Profile photo"}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover ring-1 ring-border"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-serif ring-1 ${toneClass}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </span>
  );
}
