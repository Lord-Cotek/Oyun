import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Avatar } from "@/components/ui/Avatar";
import { SignOutButton } from "@/components/SignOutButton";
import { InvitePanel } from "@/components/InvitePanel";

const ROLE_LABEL: Record<string, string> = {
  MOTHER: "Mother",
  PARTNER: "Husband / Partner",
  ACCOUNTABILITY: "Accountability partner",
};
import {
  ProfileForm,
  PasswordForm,
  NotificationForm,
  JourneyForm,
} from "@/components/settings/SettingsForms";
import { PushToggle } from "@/components/PushToggle";
import { MarkLoss } from "@/components/settings/MarkLoss";
import { DeleteAccount } from "@/components/settings/DeleteAccount";

export const metadata: Metadata = {
  title: "Settings",
  description: "Your account and preferences.",
  robots: { index: false },
};

function toDateInput(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/settings");

  const [user, active] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    getActiveMembership(session.user.id),
  ]);
  if (!user) redirect("/sign-in");

  const isMother = active?.role === "MOTHER";
  const supporterCount =
    isMother && active
      ? await prisma.membership.count({
          where: {
            journeyId: active.journey.id,
            role: { in: ["PARTNER", "ACCOUNTABILITY"] },
          },
        })
      : 0;

  return (
    <>
      <SiteHeader active="settings" />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <PageHero
          eyebrow="Settings"
          title="Your account."
          lede={
            <span className="flex flex-wrap items-center gap-2">
              Signed in as {user.email}
              {active && (
                <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-accent">
                  {ROLE_LABEL[active.role]}
                </span>
              )}
            </span>
          }
          aside={
            <Avatar
              name={user.name}
              photoUrl={user.image}
              tone={isMother ? "accent2" : "accent"}
              size={76}
            />
          }
        />

        <div className="mt-6 space-y-4">
          <Card className="p-8">
            <Eyebrow className="mb-4">Profile</Eyebrow>
            <ProfileForm name={user.name ?? ""} email={user.email ?? ""} />
          </Card>

          <Card className="p-8">
            <Eyebrow className="mb-4">Password</Eyebrow>
            <PasswordForm />
          </Card>

          <Card className="p-8">
            <Eyebrow className="mb-4">Notifications</Eyebrow>
            <NotificationForm
              notifyByEmail={user.notifyByEmail}
              weeklyDigest={user.weeklyDigest}
            />
            <div className="mt-6 border-t border-border pt-6">
              <PushToggle />
            </div>
          </Card>

          {isMother && active && (
            <Card className="p-8">
              <Eyebrow className="mb-4">Your journey</Eyebrow>
              <JourneyForm
                dueDate={toDateInput(active.journey.dueDate)}
                babyName={active.journey.babyName ?? ""}
                babyCount={active.journey.babyCount}
              />
            </Card>
          )}

          {isMother && active && active.journey.status === "ACTIVE" && (
            <Card className="p-8">
              <InvitePanel hasSupporter={supporterCount > 0} />
              <div className="mt-5 border-t border-border pt-4">
                <Link
                  href="/circle"
                  className="font-mono text-xs text-accent underline underline-offset-4"
                >
                  Manage your circle &rarr;
                </Link>
              </div>
            </Card>
          )}

          {isMother && active?.journey.status === "ACTIVE" && (
            <Card className="border-accent2/20 p-8">
              <Eyebrow className="mb-4 text-accent2">If the road turns hard</Eyebrow>
              <MarkLoss />
            </Card>
          )}

          <Card className="flex items-center justify-between p-8">
            <div>
              <Eyebrow className="mb-2">Session</Eyebrow>
              <p className="font-mono text-xs text-muted">
                Signed in as {user.email}
              </p>
            </div>
            <SignOutButton />
          </Card>

          <Card className="border-negative/30 p-8">
            <DeleteAccount email={user.email ?? ""} />
          </Card>
        </div>
      </main>
    </>
  );
}
