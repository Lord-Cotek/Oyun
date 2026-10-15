/**
 * A display component for scripture: Playfair, reference beneath.
 *
 * `onBand` is for the closing verse, which now sits on a band of colour
 * rather than on the page ground. It exists because the default sets its own
 * ink and eyebrow colours, and those are exactly wrong on clay — the band
 * declares the cream that belongs on it, so on a band this component's job is
 * to inherit rather than to decide. The reference also drops its mono
 * uppercase there: a band already says "this is a set-apart thing", and the
 * label was saying it a second time in the voice of a receipt.
 */
export function Verse({
  text,
  reference,
  className = "",
  size = "md",
  onBand = false,
}: {
  text: string;
  reference: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  onBand?: boolean;
}) {
  const sizeClass =
    size === "lg"
      ? "text-2xl md:text-3xl"
      : size === "sm"
        ? "text-lg"
        : "text-xl md:text-2xl";

  return (
    <figure className={`relative ${className}`}>
      <blockquote>
        <p
          className={`font-serif leading-snug ${onBand ? "" : "text-ink"} ${sizeClass}`}
        >
          &ldquo;{text}&rdquo;
        </p>
      </blockquote>
      <figcaption
        className={
          onBand ? "mt-3 font-serif text-sm italic opacity-75" : "eyebrow mt-3"
        }
      >
        {reference}
      </figcaption>
    </figure>
  );
}
