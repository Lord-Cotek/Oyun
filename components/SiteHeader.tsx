import Link from "next/link";
import { OyunMark } from "@/components/ui/OyunMark";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InstallButton } from "@/components/InstallButton";
import { NotificationBell } from "@/components/NotificationBell";
import { MobileMenu } from "@/components/MobileMenu";
import { JourneySwitcher } from "@/components/JourneySwitcher";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership, getMyJourneys } from "@/lib/data";

type ActiveKey =
  | "journey"
  | "care"
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
    ...(isMother
      ? [{ href: "/circle", label: "Circle", current: active === "circle" }]
      : []),
    { href: "/settings", label: "Settings", current: active === "settings" },
  ];

  return (
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

          {/* Mobile menu — phones only */}
          <MobileMenu items={links} />
        </div>
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
