import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OyunMark } from "@/components/ui/OyunMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";
import { NotificationBell } from "@/components/NotificationBell";
import { TabBar, type Tab } from "@/components/TabBar";
import { ClinicianNav, type ClinicianNavItem } from "@/components/doctor/ClinicianNav";

/**
 * The clinician's own menu — see lib/clinician.ts.
 *
 * ── Where it appears ─────────────────────────────────────────────────────
 * On every page under /doctor, and on the shared pages (Settings) for
 * somebody who is a clinician and in no journey at all. A doctor is not in
 * anybody's circle, so the family's menu — Journey, Life, Support — is a
 * row of rooms that are not theirs; shown to them, each one only bounces.
 * And the patients page used to have no menu at all, so there was no way
 * from it to their own account. One header, both places, fixes both.
 *
 * ── What is on it ────────────────────────────────────────────────────────
 * Patients, Settings, how it works — and "My journey" for a clinician who
 * also uses Oyun herself, which is the door between her two rooms. On a
 * phone the same links sit in the bottom bar the rest of Oyun uses, with
 * Sign out under More, so the two kinds of account feel like one app.
 */
export async function ClinicianHeader() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const [clinician, memberships, unread] = userId
    ? await Promise.all([
        prisma.clinician.findUnique({ where: { userId }, select: { id: true } }),
        prisma.membership.count({ where: { userId } }),
        prisma.notification.count({ where: { userId, readAt: null } }),
      ])
    : [null, 0, 0];

  const items: ClinicianNavItem[] = userId
    ? [
        ...(clinician ? [{ href: "/doctor", label: "Patients" }] : []),
        ...(memberships > 0 ? [{ href: "/journey", label: "My journey" }] : []),
        { href: "/settings", label: "Settings" },
        { href: "/doctors", label: "How it works" },
      ]
    : [];
  const ICON: Record<string, Tab["icon"]> = { "/doctor": "users", "/journey": "home", "/settings": "settings", "/doctors": "compass" };
  const asTab = (i: ClinicianNavItem): Tab => ({ href: i.href, label: i.label, icon: ICON[i.href] ?? "star" });
  const tabs = items.filter((i) => i.href !== "/doctors").map(asTab);
  const more = items.filter((i) => i.href === "/doctors").map(asTab);

  return (
    <>
      <header className="sticky top-0 z-30 safe-top border-b border-[var(--glass-hairline)] bg-[var(--glass-tint)] shadow-[var(--shadow-1)] backdrop-blur-xl backdrop-saturate-150 print:hidden">
        <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-3 px-4 sm:px-6">
          <Link href={clinician ? "/doctor" : "/"} className="flex min-w-0 items-center gap-2.5">
            <OyunMark size={28} className="shrink-0 text-ink" />
            <span className="font-serif text-lg text-ink">Oyun</span>
            <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
              For clinicians
            </span>
          </Link>
          <div className="flex items-center gap-1">
            {userId ? (
              <>
                <ClinicianNav items={items} />
                <span className="hidden font-mono text-xs lg:inline">
                  <SignOutButton />
                </span>
                <NotificationBell initialUnread={unread} />
              </>
            ) : (
              <Link href="/sign-in?callbackUrl=/doctor" className="rounded-md px-3 py-1.5 font-mono text-xs text-muted hover:text-ink">
                Sign in
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>
      <span id="page" tabIndex={-1} className="block outline-none" />
      {/* Phones and tablets: the same bottom bar as the rest of Oyun, with
          Sign out under More. */}
      {userId && <TabBar tabs={tabs} more={more} />}
    </>
  );
}
