"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { InstallButton } from "@/components/InstallButton";

export type Tab = { href: string; label: string; icon: IconName };
type MoreItem = { href: string; label: string; icon: IconName };

/**
 * The app's primary navigation on phones & tablets — a fixed bottom tab bar,
 * thumb-reachable and safe-area aware, with an active pill that slides to the
 * current section. Up to four primary tabs plus a "More" sheet for the rest.
 * Hidden on lg, where the top nav takes over.
 */
export function TabBar({ tabs, more }: { tabs: Tab[]; more: MoreItem[] }) {
  const pathname = usePathname() || "/";
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  // Close the sheet whenever we navigate.
  useEffect(() => setSheet(false), [pathname]);

  // Longest-prefix wins, so "/journey" doesn't also light up on a subpath.
  const candidates = [...tabs, ...more];
  const best = candidates
    .filter((c) => pathname === c.href || pathname.startsWith(c.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const moreActive = more.some((m) => m.href === best);

  return (
    <>
      <nav
        aria-label="Primary"
        className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 backdrop-blur lg:hidden"
      >
        <ul className="mx-auto flex max-w-shell items-stretch justify-around px-1">
          {tabs.map((t) => {
            const active = t.href === best;
            return (
              <li key={t.href} className="flex-1">
                <Link
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative flex flex-col items-center gap-1 px-1 pb-1.5 pt-2.5"
                >
                  <span
                    aria-hidden
                    className={`absolute top-0 h-0.5 w-8 rounded-full bg-accent transition-opacity ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <TabIcon active={active}>
                    <Icon name={t.icon} size={22} />
                  </TabIcon>
                  <span
                    className={`font-mono text-[0.6rem] tracking-wide transition-colors ${
                      active ? "text-accent" : "text-muted group-hover:text-ink"
                    }`}
                  >
                    {t.label}
                  </span>
                </Link>
              </li>
            );
          })}

          {more.length > 0 && (
            <li className="flex-1">
              <button
                type="button"
                onClick={() => setSheet(true)}
                aria-expanded={sheet}
                aria-haspopup="menu"
                className="group relative flex w-full flex-col items-center gap-1 px-1 pb-1.5 pt-2.5"
              >
                <span
                  aria-hidden
                  className={`absolute top-0 h-0.5 w-8 rounded-full bg-accent transition-opacity ${
                    moreActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <TabIcon active={moreActive || sheet}>
                  <MoreGlyph />
                </TabIcon>
                <span
                  className={`font-mono text-[0.6rem] tracking-wide transition-colors ${
                    moreActive || sheet
                      ? "text-accent"
                      : "text-muted group-hover:text-ink"
                  }`}
                >
                  More
                </span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* More sheet */}
      {sheet && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm"
            onClick={() => setSheet(false)}
            aria-hidden
          />
          <div
            role="menu"
            className="safe-bottom fixed inset-x-0 bottom-0 z-50 animate-fade-up rounded-t-2xl border-t border-border bg-surface p-4 shadow-2xl"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" aria-hidden />
            <ul className="grid grid-cols-2 gap-2">
              {more.map((m) => {
                const active = m.href === best;
                return (
                  <li key={m.href}>
                    <Link
                      href={m.href}
                      role="menuitem"
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                        active
                          ? "border-accent/50 bg-accent/10 text-accent"
                          : "border-border bg-bg text-ink hover:border-accent/40"
                      }`}
                    >
                      <Icon name={m.icon} size={18} />
                      <span className="font-mono text-sm tracking-wide">
                        {m.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <InstallButton />
              <button
                type="button"
                onClick={() => {
                  setSheet(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="rounded-lg px-4 py-2 font-mono text-sm text-muted transition-colors hover:text-ink"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TabIcon({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
        active
          ? "bg-accent/12 text-accent"
          : "text-muted group-hover:text-ink group-active:scale-90"
      }`}
    >
      {children}
    </span>
  );
}

function MoreGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
