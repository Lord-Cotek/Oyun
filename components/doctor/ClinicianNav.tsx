"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type ClinicianNavItem = { href: string; label: string };

/** The clinician's links on a wide screen, the current one marked. */
export function ClinicianNav({ items }: { items: ClinicianNavItem[] }) {
  const pathname = usePathname() || "/";
  // Longest match wins, so /doctor/p/… lights "Patients" and nothing else.
  const best = items
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  return (
    <nav aria-label="Clinician" className="hidden items-center gap-1 font-mono text-xs lg:flex">
      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          aria-current={i.href === best ? "page" : undefined}
          className={`rounded-md px-3 py-1.5 tracking-wide transition-colors ${
            i.href === best ? "bg-surface text-accent" : "text-muted hover:text-ink"
          }`}
        >
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
