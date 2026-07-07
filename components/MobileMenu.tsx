"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { InstallButton } from "@/components/InstallButton";

type NavItem = { href: string; label: string; current?: boolean };

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:border-accent"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-bg/70"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <nav className="app-menu-top fixed inset-x-0 z-50 border-b border-border bg-surface p-4 shadow-2xl">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={item.current ? "page" : undefined}
                    className={`block rounded-lg px-4 py-3 font-mono text-sm tracking-wide transition-colors ${
                      item.current
                        ? "bg-accent/10 text-accent"
                        : "text-ink hover:bg-bg"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <InstallButton />
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="rounded-lg px-4 py-2 font-mono text-sm text-muted transition-colors hover:text-ink"
              >
                Sign out
              </button>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
