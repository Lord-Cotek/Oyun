import Link from "next/link";
import { OyunMark } from "@/components/ui/OyunMark";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InstallButton } from "@/components/InstallButton";
import { NotificationBell } from "@/components/NotificationBell";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";

export async function SiteHeader({
  active,
  showCare = true,
}: {
  active?: "journey" | "care" | "circle" | "settings";
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

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-shell items-center justify-between gap-3 px-6 py-4">
        <Link href="/journey" className="flex items-center gap-2.5">
          <OyunMark size={30} className="text-ink" />
          <span className="font-serif text-lg text-ink">Oyun</span>
        </Link>
        <nav className="flex items-center gap-1 font-mono text-xs">
          <NavLink href="/journey" label="Journey" current={active === "journey"} />
          {showCare && isMother && (
            <NavLink href="/care" label="Care" current={active === "care"} />
          )}
          {isMother && (
            <NavLink href="/circle" label="Circle" current={active === "circle"} />
          )}
          <NavLink href="/settings" label="Settings" current={active === "settings"} />
          <span className="mx-1 hidden h-4 w-px bg-border sm:block" aria-hidden />
          <InstallButton className="mr-1 hidden md:block" />
          <NotificationBell initialUnread={unread} />
          <ThemeToggle className="ml-1" />
          <span className="mx-1 hidden h-4 w-px bg-border sm:block" aria-hidden />
          <span className="hidden sm:inline-block">
            <SignOutButton />
          </span>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
  current,
  className = "",
}: {
  href: string;
  label: string;
  current?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`rounded-md px-3 py-1.5 tracking-wide transition-colors ${
        current ? "bg-surface text-accent" : "text-muted hover:text-ink"
      } ${className}`}
    >
      {label}
    </Link>
  );
}
