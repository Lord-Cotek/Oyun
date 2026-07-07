import Link from "next/link";
import { OyunMark } from "@/components/ui/OyunMark";
import { SignOutButton } from "@/components/SignOutButton";

export function SiteHeader({
  active,
  showCare = true,
}: {
  active?: "journey" | "care";
  showCare?: boolean;
}) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-4">
        <Link href="/journey" className="flex items-center gap-2.5">
          <OyunMark size={30} className="text-ink" />
          <span className="font-serif text-lg text-ink">Oyun</span>
        </Link>
        <nav className="flex items-center gap-1 font-mono text-xs">
          <NavLink href="/journey" label="Journey" current={active === "journey"} />
          {showCare && (
            <NavLink href="/care" label="Care" current={active === "care"} />
          )}
          <span className="mx-1 h-4 w-px bg-border" aria-hidden />
          <SignOutButton />
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
  current,
}: {
  href: string;
  label: string;
  current?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`rounded-md px-3 py-1.5 tracking-wide transition-colors ${
        current ? "bg-surface text-accent" : "text-muted hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}
