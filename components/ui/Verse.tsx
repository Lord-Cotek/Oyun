/** A display component for scripture: Playfair, reference in mono eyebrow beneath. */
export function Verse({
  text,
  reference,
  className = "",
  size = "md",
}: {
  text: string;
  reference: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg"
      ? "text-2xl md:text-3xl"
      : size === "sm"
        ? "text-lg"
        : "text-xl md:text-2xl";

  return (
    <figure className={className}>
      <blockquote>
        <p className={`font-serif leading-snug text-ink ${sizeClass}`}>
          &ldquo;{text}&rdquo;
        </p>
      </blockquote>
      <figcaption className="eyebrow mt-3">{reference}</figcaption>
    </figure>
  );
}
