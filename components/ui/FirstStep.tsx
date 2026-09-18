import { type ReactNode } from "react";

/**
 * The end of an empty room.
 *
 * Every list in Oyun started life empty, and every one of them explained the
 * category it was empty of: "Nothing in the book." True, warm, and no help at
 * all — a mother reading it still has to decide what belongs there, whether
 * hers counts, and where the form is. The commonest outcome is that she closes
 * the page.
 *
 * So each blank room now ends with one particular thing to do, and the button
 * says the thing rather than the category. "Put the 20-week scan in" beats
 * "Add an appointment", because the first is a decision already made and the
 * second is homework. Where we can guess the shape of that first entry we open
 * the form with it already chosen, so the only thing left is the date.
 *
 * Rules this keeps:
 *
 *  - One action, never two. A blank page offering three choices is a blank
 *    page with a decision attached.
 *  - The suggestion is the most likely true thing, not the easiest thing. Every
 *    pregnancy has a 20-week scan in it; not every one has a hospital stay to
 *    record, so we do not ask for one first.
 *  - Never a reproach. It says what could be here, not what is missing.
 */
export function FirstStep({
  children,
  action,
  className = "",
}: {
  /** The warm line. One or two sentences, never a lecture. */
  children: ReactNode;
  /** The one thing to do — a button that opens the form, or a link. */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="prose-serif-sm max-w-prose text-muted">{children}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/** The button a blank room offers. Says the deed, not the category. */
export function FirstStepButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-accent/40 bg-accent/[0.07] px-4 py-2 font-mono text-xs text-accent transition-colors hover:border-accent hover:bg-accent/[0.12]"
    >
      {children}
    </button>
  );
}

/**
 * The same offer, where the form is already on the page and only needs
 * finding. A `<label>` pointed at a field focuses it on click — so this
 * scrolls to the box and puts the cursor in it, with no script at all.
 */
export function FirstStepFocus({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="inline-block cursor-pointer rounded-lg border border-accent/40 bg-accent/[0.07] px-4 py-2 font-mono text-xs text-accent transition-colors hover:border-accent hover:bg-accent/[0.12]"
    >
      {children}
    </label>
  );
}
