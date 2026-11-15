"use client";

/** The print window, where "Save as PDF" is one of the printers. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 font-mono text-xs font-medium text-on-accent transition-colors hover:bg-accent-deep"
    >
      Print, or save as PDF
    </button>
  );
}
