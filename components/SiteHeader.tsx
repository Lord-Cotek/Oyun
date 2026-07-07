import Link from "next/link";
import { OyunMark } from "@/components/ui/OyunMark";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InstallButton } from "@/components/InstallButton";
import { NotificationBell } from "@/components/NotificationBell";
import { MobileMenu } from "@/components/MobileMenu";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";

type ActiveKey = "journey" | "care" | "circle" | "settings" | "prayer";

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
  if (session?.user?.id) {
    const [count, membership] = await Promise.all([
      prisma.notification.count({ where: { userId: session.user.id, readAt: null } }),
      getActiveMembership(session.user.id),
    ]);
    unread = count;
    isMother = membership?.role === "MOTHER";
  }

  // The full nav, used inline on desktop and inside the mobile menu.
  const links: { href: string; label: string; current: boolean }[] = [
    { href: "/journey", label: "Journey", current: active === "journey" },
    { href: "/prayer", label: "Prayer", current: active === "prayer" },
    ...(showCare && isMother
      ? [{ href: "/care", label: "Care", current: active === "care" }]
      : []),
    ...(isMother
      ? [{ href: "/circle", label: "Circle", current: active === "circle" }]
      : []),
    { href: "/settings", label: "Settings", current: active === "settings" },
  ];

  return (
    <header className="safe-top border-b border-border">
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-2 px-4 sm:px-6">
        <Link href="/journey" className="flex shrink-0 items-center gap-2.5">
          <OyunMark size={28} className="text-ink" />
          <span className="font-serif text-lg text-ink">Oyun</span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Inline nav — desktop / tablet only */}
          <nav className="hidden items-center gap-1 font-mono text-xs md:flex">
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
