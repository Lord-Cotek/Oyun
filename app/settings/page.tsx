import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SignOutButton } from "@/components/SignOutButton";
import {
  ProfileForm,
  PasswordForm,
  NotificationForm,
  JourneyForm,
} from "@/components/settings/SettingsForms";
import { PushToggle } from "@/components/PushToggle";

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

  return (
    <>
      <SiteHeader active="settings" />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="animate-fade-up">
          <Eyebrow className="mb-3">Settings</Eyebrow>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            Your account.
          </h1>
        </div>

        <div className="mt-10 space-y-4">
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
              />
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
        </div>
      </main>
    </>
  );
}
