import Link from "next/link";
import { type ReactNode } from "react";

/** A quiet, readable shell for the public legal pages. */
export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-accent"
      >
        <span aria-hidden>←</span> Oyun
      </Link>
      <h1 className="mt-6 font-serif text-4xl leading-tight text-ink">{title}</h1>
      <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
        Last updated {updated}
      </p>
      <div className="legal mt-8 space-y-6">{children}</div>
    </main>
  );
}

/** A titled section of legal copy. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-xl text-ink">{heading}</h2>
      <div className="space-y-3 font-mono text-sm leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}
