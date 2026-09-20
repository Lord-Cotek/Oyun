import Link from "next/link";
import { OyunMark } from "@/components/ui/OyunMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavMoreMenu } from "@/components/NavMoreMenu";
import { NotificationBell } from "@/components/NotificationBell";
import { TabBar, type Tab } from "@/components/TabBar";
import { Icon, type IconName } from "@/components/ui/Icon";
import { JourneySwitcher } from "@/components/JourneySwitcher";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership, getMyJourneys } from "@/lib/data";

type ActiveKey =
  | "journey"
  | "life"
  | "letters"
  | "care"
  | "firsts"
  | "circle"
  | "settings"
  | "prayer"
  | "appointments"
  | "help"
  | "nursery"
  | "worship"
  | "registry"
  | "shared";

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
    { href: "/life", label: "Life", current: active === "life" },
    ...(isHousehold
      ? [{ href: "/letters", label: "Letters", current: active === "letters" }]
      : []),
    // Worship comes before Prayer so it sits in the thumb-reachable bottom tabs
    // — worship is the daily rhythm, always one tap away. It is everybody's
    // now: the circle keeps its own altar in the same room, on the same day's
    // liturgy, against its own record. Still hidden after a loss, for whom the
    // words of this particular liturgy would be a wound.
    ...(!inLoss
      ? [{ href: "/worship", label: "Worship", current: active === "worship" }]
      : []),
    { href: "/prayer", label: "Prayer", current: active === "prayer" },
    ...(isHousehold && !inLoss
      ? [
          {
            href: "/appointments",
            label: "Appointments",
            current: active === "appointments",
          },
        ]
      : []),
    ...(showCare && isMother && !inLoss
      ? [{ href: "/care", label: "Care", current: active === "care" }]
      : []),
    // The nursery and the firsts belong to both parents — he keeps these too.
    ...(isHousehold && !inLoss
      ? [{ href: "/child", label: "Nursery", current: active === "nursery" }]
      : []),
    ...(isHousehold && !inLoss
      ? [{ href: "/firsts", label: "Firsts", current: active === "firsts" }]
      : []),
    // The household, not the mother alone. Inviting and welcoming became
    // theirs together; a link she can see and he cannot would have left him
    // able to reach the page only by typing the address.
    ...(isHousehold
      ? [{ href: "/circle", label: "Circle", current: active === "circle" }]
      : []),
    // The registry is the two of them deciding what the baby needs, so it
    // sits with the rooms only they can open. It is never a bottom tab: a
    // gift list is not a daily rhythm, and a thing you do twice should not
    // take a place from a thing you do every morning.
    ...(isHousehold && !inLoss
      ? [{ href: "/registry", label: "Registry", current: active === "registry" }]
      : []),
    // Under More on purpose. It is a thing you go looking for on the one day
    // you need it, not a room you visit; and putting "what have I shared with
    // the world" beside the daily rhythms would give it a weight in the app
    // it does not have in a life.
    ...(isHousehold
      ? [{ href: "/shared", label: "Shared outside", current: active === "shared" }]
      : []),
    { href: "/help", label: "How this works", current: active === "help" },
    { href: "/settings", label: "Settings", current: active === "settings" },
  ];

  // Desktop: the daily rooms stay inline, the rest go under More. Eleven links
  // measured 1042px inside a 1024px screen, so the last simply fell off the
  // edge — a nav you cannot reach is worse than one that asks for a click.
  const DESK_INLINE = ["/journey", "/life", "/worship", "/prayer", "/appointments"];
  const deskPrimary = links.filter((l) => DESK_INLINE.includes(l.href));
  const deskSecondary = links.filter((l) => !DESK_INLINE.includes(l.href));

  // Bottom tab bar (phones/tablets): the same role-filtered nav, with the four
  // most-used sections as thumb-reachable primaries and the rest in a More
  // sheet. "Journey" becomes "Home".
  const ICON_BY_HREF: Record<string, IconName> = {
    "/journey": "home",
    "/life": "leaf",
    "/letters": "message",
    "/prayer": "hands",
    "/worship": "flame",
    "/appointments": "calendar",
    "/care": "heart",
    "/child": "star",
    "/firsts": "sparkles",
    "/circle": "users",
    "/registry": "gift",
    "/help": "question",
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
    <header className="sticky top-0 z-30 safe-top border-b border-[var(--glass-hairline)] bg-[var(--glass-tint)] shadow-[var(--shadow-1)] backdrop-blur-xl backdrop-saturate-150">
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
            {deskPrimary.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
            <NavMoreMenu
              items={deskSecondary}
              current={deskSecondary.some((l) => l.current)}
            />
          </nav>

          {/* Always-visible controls */}
          <Link
            href="/search"
            aria-label="Search"
            title="Search"
            // 44pt. It was 18px of icon in 8px of padding — 34px, and the
            // first thing a thumb reaches for at the top of every screen.
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <Icon name="search" size={18} aria-hidden="true" />
          </Link>
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
