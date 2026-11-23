import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OyunMark } from "@/components/ui/OyunMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";

export const metadata: Metadata = {
  title: { default: "For clinicians", template: "%s · Oyun for clinicians" },
  robots: { index: false, follow: false },
};

/**
 * The clinician's room has its own frame. Not the family's header and tab
 * bar — a doctor is not in anybody's circle, and the rooms in that menu are
 * not theirs to be offered. See lib/clinician.ts.
 */
export default async function DoctorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  // A clinician who is also in a journey — her own, or somebody's circle —
  // gets the way back to it. The two rooms never mix; this is the door.
  const hasJourney = session?.user?.id
    ? (await prisma.membership.count({ where: { userId: session.user.id } })) > 0
    : false;
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--glass-hairline)] bg-[var(--glass-tint)] backdrop-blur-xl print:hidden">
        <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/doctor" className="flex items-center gap-2.5">
            <OyunMark size={28} className="text-ink" />
            <span className="font-serif text-lg text-ink">Oyun</span>
            <span className="hidden rounded-full border border-border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-muted sm:inline">
              For clinicians
            </span>
          </Link>
          <div className="flex items-center gap-1 font-mono text-xs">
            {session?.user?.id ? (
              <>
                <Link href="/doctor" className="rounded-md px-2 py-1.5 text-muted hover:text-ink sm:px-3">
                  Patients
                </Link>
                {hasJourney && (
                  <Link href="/journey" className="rounded-md px-2 py-1.5 text-muted hover:text-ink sm:px-3">
                    My journey
                  </Link>
                )}
                <span className="hidden sm:inline">
                  <SignOutButton />
                </span>
              </>
            ) : (
              <Link href="/sign-in?callbackUrl=/doctor" className="rounded-md px-3 py-1.5 text-muted hover:text-ink">
                Sign in
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div id="page">{children}</div>
    </>
  );
}
