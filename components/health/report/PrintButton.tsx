"use client";

/** Print, or save as a PDF from the same dialog. */
export function PrintButton({ label = "Print, or save as PDF" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 font-mono text-xs font-medium text-on-accent hover:bg-accent-deep">
      {label}
    </button>
  );
}
