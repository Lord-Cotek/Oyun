"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { InstallButton } from "@/components/InstallButton";

/**
 * The rest of the rooms, on a desktop.
 *
 * The header ran out of room once the father was given the nursery, the firsts
 * and the appointment book — eleven links measured 1042px inside a 1024px
 * screen, so the last of them simply fell off the edge. The daily rooms stay
 * inline; everything else lives here.
 *
 * Closes on Escape and on a click outside, and every item is a plain link, so
 * it still gets you there if the script never arrives.
 */
export function NavMoreMenu({
  items,
  current,
}: {
  items: { href: string; label: string; current: boolean }[];
  current: boolean;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`rounded-md px-3 py-1.5 tracking-wide transition-colors ${
          current || open ? "bg-surface text-accent" : "text-muted hover:text-ink"
        }`}
      >
        More
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 min-w-[13rem] rounded-xl border border-border bg-surface p-1.5 shadow-[var(--shadow-2)]"
        >
          {items.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              role="menuitem"
              aria-current={l.current ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2 tracking-wide transition-colors ${
                l.current
                  ? "bg-bg text-accent"
                  : "text-muted hover:bg-bg hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="my-1.5 h-px bg-border" aria-hidden />
          <div className="px-1 pb-1">
            <InstallButton className="mb-1 w-full" />
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full rounded-lg px-2 py-2 text-left tracking-wide text-muted transition-colors hover:bg-bg hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
