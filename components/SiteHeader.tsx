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
import { circleSeesRegistry } from "@/lib/registry";
import { getLang } from "@/lib/lang";
import { sayIn, wordsFor } from "@/lib/i18n";
import { isGeneral, wordsForVoice } from "@/lib/voice";
import { ClinicianHeader } from "@/components/doctor/ClinicianHeader";

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
  | "scripture"
  | "registry"
  | "shared"
  | "health";

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
  /** The circle sees the registry only once the family has opened it. */
  let registryOpen = false;
  let journeys: Awaited<ReturnType<typeof getMyJourneys>> = [];
  let activeJourneyId: string | null = null;
  /** Keeps a clinician's account beside their own — see lib/clinician.ts. */
  let isClinician = false;
  if (session?.user?.id) {
    isClinician = !!(await prisma.clinician.findUnique({ where: { userId: session.user.id }, select: { id: true } }));
    const [count, membership, myJourneys] = await Promise.all([
      prisma.notification.count({ where: { userId: session.user.id, readAt: null } }),
      getActiveMembership(session.user.id),
      getMyJourneys(session.user.id),
    ]);
    unread = count;
    isMother = membership?.role === "MOTHER";
    isHousehold = membership?.role === "MOTHER" || membership?.role === "PARTNER";
    inLoss = membership?.journey.status === "LOSS";
    if (membership) {
      const reg = await prisma.registry.findUnique({
        where: { journeyId: membership.journey.id },
        select: { sharedWithCircleAt: true, closedAt: true },
      });
      registryOpen = !!reg && circleSeesRegistry(reg);
    }
    journeys = myJourneys;
    activeJourneyId = membership?.journey.id ?? null;
  }
  // A clinician in no journey at all has no family rooms: on the pages the
  // two kinds of account share (Settings), they get their own menu, not a
  // row of rooms that would each only turn them away.
  if (isClinician && journeys.length === 0) return <ClinicianHeader />;
  const ownsJourney = journeys.some((j) => j.isOwner);
  // How Oyun speaks to this reader — see lib/voice.ts. Without religious
  // content, the two rooms that are only worship are not offered, and the
  // prayer room is the same room under its plain name.
  const general = isGeneral(session?.user?.voice);
  const vw = wordsForVoice(session?.user?.voice);

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
    // liturgy, against its own record.
    //
    // It stays after a loss too, for everybody. Both the family and the
    // circle get a grief liturgy in this room rather than being shut out of
    // it: grief is not a reason to stop drawing near to God, and the words
    // change rather than the door.
    ...(general
      ? []
      : [
          { href: "/worship", label: "Worship", current: active === "worship" },
          // The reading plan, today's chapter and the reflection journal: a
          // room of its own, so a long prayer list on Worship never pushes it
          // down.
          { href: "/scripture", label: "Scripture", current: active === "scripture" },
        ]),
    { href: "/prayer", label: vw.prayerRoom, current: active === "prayer" },
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
    // The health cards are the two of theirs — hers, his, the children's —
    // and stay theirs after a loss too: her own card still matters then.
    ...(isHousehold
      ? [{ href: "/health", label: "Health", current: active === "health" }]
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
    // The two of them decide what the baby needs; the circle is who the list
    // is for, and gets it once the family has opened it to them — /registry
    // sends them on to the read-only page. Never a bottom tab either way: a
    // gift list is not a daily rhythm, and a thing you do twice should not
    // take a place from a thing you do every morning.
    ...((isHousehold || registryOpen) && !inLoss
      ? [{ href: "/registry", label: "Registry", current: active === "registry" }]
      : []),
    // Under More on purpose. It is a thing you go looking for on the one day
    // you need it, not a room you visit; and putting "what have I shared with
    // the world" beside the daily rhythms would give it a weight in the app
    // it does not have in a life.
    ...(isHousehold
      ? [{ href: "/shared", label: "Shared outside", current: active === "shared" }]
      : []),
    // Their patients, for a doctor or midwife who also has a journey of
    // their own. Under More: it is a different room, not a family one.
    ...(isClinician ? [{ href: "/doctor", label: "My patients", current: false }] : []),
    { href: "/help", label: "How this works", current: active === "help" },
    { href: "/settings", label: "Settings", current: active === "settings" },
  ];
  // The menus in the reader's language — see lib/i18n.ts. English as written
  // unless they chose Yorùbá and the switch for it is on.
  const lang = await getLang();
  const words = wordsFor(lang);
  const say = (en: string) => sayIn(words, en);
  for (const l of links) l.label = say(l.label);

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
    "/scripture": "book",
    "/appointments": "calendar",
    "/care": "heart",
    "/health": "pulse",
    "/child": "star",
    "/firsts": "sparkles",
    "/circle": "users",
    "/registry": "gift",
    "/shared": "share",
    "/help": "compass",
    "/doctor": "pulse",
    "/settings": "settings",
  };
  const navTabs: Tab[] = links.map((l) => ({
    href: l.href,
    label: l.href === "/journey" ? say("Home") : l.label,
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
    {/* For a keyboard or a screen reader: past the menus, straight to the page. */}
    <a
      href="#page"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-3 focus:font-mono focus:text-sm focus:text-on-accent"
    >
      Skip to the page
    </a>
    <header lang={lang === "yo" ? "yo" : undefined} className="sticky top-0 z-30 safe-top border-b border-[var(--glass-hairline)] bg-[var(--glass-tint)] shadow-[var(--shadow-1)] backdrop-blur-xl backdrop-saturate-150">
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
            clinician={isClinician}
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
              words={words}
            />
          </nav>

          {/* Always-visible controls */}
          <Link
            href="/search"
            aria-label={say("Search")}
            title={say("Search")}
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

    {/* Where "Skip to the page" lands: just past the header. */}
    <span id="page" tabIndex={-1} className="block outline-none" />
    {/* Primary nav on phones & tablets — hidden on lg (top nav takes over) */}
    <TabBar tabs={tabs} more={moreItems} words={words} />
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
