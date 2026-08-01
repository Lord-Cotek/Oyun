import Link from "next/link";

/** Persistent, quiet medical disclaimer + legal footer. */
export function Disclaimer() {
  return (
    <footer className="safe-bottom relative z-10 border-t border-border/60 bg-bg/60 px-6 py-5">
      <div className="mx-auto max-w-shell space-y-3">
        <p className="max-w-prose font-mono text-[0.7rem] leading-relaxed text-muted">
          Oyun and Agbebi offer spiritual companionship and encouragement — not
          medical advice. Always consult your doctor or midwife for health
          decisions.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.7rem] text-muted">
          <Link href="/privacy" className="transition-colors hover:text-accent">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-accent">
            Terms
          </Link>
          <Link href="/contact" className="transition-colors hover:text-accent">
            Contact
          </Link>
          <span className="text-muted/70">© cotek app FZ-LLC</span>
        </div>
      </div>
    </footer>
  );
}
