import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin, audit, unlockedFor, UNLOCK_MINUTES } from "@/lib/admin";
import { openConcernCount } from "@/lib/admin-db";
import { Unlock } from "@/components/admin/Unlock";
import { LockButton } from "@/components/admin/LockButton";

/**
 * The admin centre.
 *
 * ── Where it is, and where it is not ─────────────────────────────────────
 * It is at /admintc and nowhere else. It appears in no navigation, no menu and
 * no footer; nothing in the app links to it; robots.txt disallows it and
 * every page here says noindex for itself. To anybody who is not an admin —
 * signed in or not — it returns 404, so a stranger who guesses the address is
 * told nothing about whether there is anything at it.
 *
 * ── It deliberately looks nothing like Oyun ──────────────────────────────
 * No site header, no tab bar, none of the warmth. This is a back office, and
 * a back office that looks like the family's own rooms is one an operator
 * forgets they are standing in. The plainness is the point.
 */

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

/**
 * Ordered by how often somebody standing here needs each one: the queue and
 * the search first, the occasional jobs next, the record and the housekeeping
 * last. Not alphabetically, and not in the order they happened to be built.
 */
const tabs = [
  { href: "/admintc", label: "Overview" },
  { href: "/admintc/people", label: "Find a person" },
  { href: "/admintc/concerns", label: "Concerns" },
  { href: "/admintc/broadcast", label: "Broadcast" },
  { href: "/admintc/emails", label: "Emails" },
  { href: "/admintc/flags", label: "Switches" },
  { href: "/admintc/audit", label: "What was done" },
  { href: "/admintc/admins", label: "Admins" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Every page under here is behind these lines. A page that forgets them
  // still gets them, because the layout runs first.
  const admin = await requireAdmin();
  const open = unlockedFor(admin.email);

  // Being an admin gets you the password box. Only the password gets you the
  // centre — and the actions check for themselves as well, in case a cookie
  // runs out between the page rendering and a button being pressed.
  if (!open) {
    return (
      <div className="min-h-dvh bg-[#0f0f10] text-[#e7e5e2]">
        <Unlock email={admin.email} minutes={UNLOCK_MINUTES} />
      </div>
    );
  }

  await audit(admin.email, "opened the admin centre");

  // A concern nobody has answered should be visible before anybody clicks
  // anything. Somebody frightened enough to write to us should not be waiting
  // behind a tab that looks like every other tab.
  const waiting = await openConcernCount().catch(() => 0);

  return (
    <div className="min-h-dvh bg-[#0f0f10] text-[#e7e5e2]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
              Oyun · admin
            </p>
            <p className="mt-0.5 font-mono text-xs text-white/70">
              {admin.email}
              {admin.isSuper && (
                <span className="ml-2 rounded border border-amber-400/40 px-1.5 py-0.5 text-[0.58rem] uppercase tracking-widest text-amber-300">
                  super
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LockButton />
            <Link
              href="/journey"
              className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40 underline underline-offset-4 hover:text-white"
            >
              Leave
            </Link>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl flex-wrap gap-1 px-5 pb-3">
          {tabs.map((t) => {
            const flag = t.href === "/admintc/concerns" && waiting > 0;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`rounded border px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest transition-colors ${
                  flag
                    ? "border-red-400/50 text-red-300 hover:border-red-400"
                    : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                }`}
              >
                {t.label}
                {flag && <span className="ml-1.5">{waiting}</span>}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>

      <footer className="mx-auto max-w-5xl px-5 pb-10">
        <p className="border-t border-white/10 pt-4 font-mono text-[0.58rem] leading-relaxed text-white/30">
          This centre can read accounts — who exists, when they joined, which
          journeys they are in. It cannot read what a family wrote: no diary
          entries, no letters, no addresses, nothing on a registry. That is
          enforced in lib/admin-db.ts and checked by `npm run verify:admin`.
          Everything done here is written down under &ldquo;What was
          done&rdquo;.
        </p>
      </footer>
    </div>
  );
}
