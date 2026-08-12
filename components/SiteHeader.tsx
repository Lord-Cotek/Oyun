import Link from "next/link";
import { OyunMark } from "@/components/ui/OyunMark";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InstallButton } from "@/components/InstallButton";
import { NotificationBell } from "@/components/NotificationBell";
import { TabBar, type Tab } from "@/components/TabBar";
import { type IconName } from "@/components/ui/Icon";
import { JourneySwitcher } from "@/components/JourneySwitcher";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership, getMyJourneys } from "@/lib/data";

type ActiveKey =
  | "journey"
  | "care"
  | "firsts"
  | "circle"
  | "settings"
  | "prayer"
  | "nursery"
  | "worship";

export async function SiteHeader({
  active,
  showCare = true,
}: {
  active?: ActiveKey;
  showCare?: boolean;
}) {
  const session = await auth();
  let unread = 0;
  let isMother = false;
  let isHousehold = false;
  let inLoss = false;
  let journeys: Awaited<ReturnType<typeof getMyJourneys>> = [];
  let activeJourneyId: string | null = null;
  if (session?.user?.id) {
    const [count, membership, myJourneys] = await Promise.all([
      prisma.notification.count({ where: { userId: session.user.id, readAt: null } }),
      getActiveMembership(session.user.id),
      getMyJourneys(session.user.id),
    ]);
    unread = count;
    isMother = membership?.role === "MOTHER";
    isHousehold = membership?.role === "MOTHER" || membership?.role === "PARTNER";
    inLoss = membership?.journey.status === "LOSS";
    journeys = myJourneys;
    activeJourneyId = membership?.journey.id ?? null;
  }
  const ownsJourney = journeys.some((j) => j.isOwner);

  // The full nav, used inline on desktop and inside the mobile menu.
  const links: { href: string; label: string; current: boolean }[] = [
    { href: "/journey", label: "Journey", current: active === "journey" },
    { href: "/prayer", label: "Prayer", current: active === "prayer" },
    ...(!inLoss && isHousehold
      ? [{ href: "/worship", label: "Worship", current: active === "worship" }]
      : []),
    ...(showCare && isMother && !inLoss
      ? [{ href: "/care", label: "Care", current: active === "care" }]
      : []),
    ...(isMother && !inLoss
      ? [{ href: "/child", label: "Nursery", current: active === "nursery" }]
      : []),
    ...(isMother && !inLoss
      ? [{ href: "/firsts", label: "Firsts", current: active === "firsts" }]
      : []),
    ...(isMother
      ? [{ href: "/circle", label: "Circle", current: active === "circle" }]
      : []),
    { href: "/settings", label: "Settings", current: active === "settings" },
  ];

  // Bottom tab bar (phones/tablets): the same role-filtered nav, with the four
  // most-used sections as thumb-reachable primaries and the rest in a More
  // sheet. "Journey" becomes "Home".
  const ICON_BY_HREF: Record<string, IconName> = {
    "/journey": "home",
    "/prayer": "hands",
    "/worship": "flame",
    "/care": "heart",
    "/child": "star",
    "/firsts": "sparkles",
    "/circle": "users",
    "/settings": "settings",
  };
  const navTabs: Tab[] = links.map((l) => ({
    href: l.href,
    label: l.href === "/journey" ? "Home" : l.label,
    icon: ICON_BY_HREF[l.href] ?? "star",
  }));
  // Keep Settings in the More sheet (never a primary tab) so the sheet — and
  // its Install / Sign out controls — is always reachable, even for roles with
  // only a few sections.
  const settingsTab = navTabs.find((t) => t.href === "/settings");
  const primaryPool = navTabs.filter((t) => t.href !== "/settings");
  const tabs = primaryPool.slice(0, 4);
  const moreItems = [
    ...primaryPool.slice(4),
    ...(settingsTab ? [settingsTab] : []),
  ];

  return (
    <>
    <header className="safe-top border-b border-border">
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link href="/journey" className="flex shrink-0 items-center gap-2.5">
            <OyunMark size={28} className="text-ink" />
            <span className="hidden font-serif text-lg text-ink sm:inline">Oyun</span>
          </Link>
          <JourneySwitcher
            journeys={journeys}
            activeId={activeJourneyId}
            canStartOwn={!ownsJourney && journeys.length > 0}
          />
        </div>

        <div className="flex items-center gap-1">
          {/* Inline nav — larger screens only */}
          <nav className="hidden items-center gap-1 font-mono text-xs lg:flex">
            {links.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
            <span className="mx-1 h-4 w-px bg-border" aria-hidden />
            <InstallButton className="mr-1 hidden lg:block" />
            <SignOutButton />
          </nav>

          {/* Always-visible controls */}
          <NotificationBell initialUnread={unread} />
          <ThemeToggle />
        </div>
      </div>
    </header>

    {/* Primary nav on phones & tablets — hidden on lg (top nav takes over) */}
    <TabBar tabs={tabs} more={moreItems} />
    </>
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
