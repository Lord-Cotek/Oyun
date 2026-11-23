import type { Metadata } from "next";
import { ConfirmEmailNote } from "@/components/settings/ConfirmEmailNote";
import { resendConfirm } from "@/app/settings/actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { ROLE_LABEL, INVITABLE_ROLES } from "@/lib/roles";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { ShareButton } from "@/components/ShareButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Avatar } from "@/components/ui/Avatar";
import { SignOutButton } from "@/components/SignOutButton";
import { InvitePanel } from "@/components/InvitePanel";

import {
  ProfileForm,
  PasswordForm,
  NotificationForm,
  JourneyForm,
} from "@/components/settings/SettingsForms";
import { PushToggle } from "@/components/PushToggle";
import { MarkLoss } from "@/components/settings/MarkLoss";
import { DeleteAccount } from "@/components/settings/DeleteAccount";
import { LeaveCircle } from "@/components/settings/LeaveCircle";
import { ExportButton } from "@/components/settings/ExportButton";
import { RaiseConcern } from "@/components/settings/RaiseConcern";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { getLang, yorubaOffered } from "@/lib/lang";
import { isOn } from "@/lib/flags";
import { VoiceForm } from "@/components/settings/VoiceForm";
import { voiceOf } from "@/lib/voice";

export const metadata: Metadata = {
  title: "Settings",
  description: "Your account and preferences.",
  robots: { index: false },
};

function toDateInput(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function SettingsPage() {
  const [lang, offered] = await Promise.all([getLang(), yorubaOffered()]);
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/settings");

  const [user, active, canWrite] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    getActiveMembership(session.user.id),
    isOn("concerns"),
  ]);
  if (!user) redirect("/sign-in");

  const isMother = active?.role === "MOTHER";
  const supporterCount =
    isMother && active
      ? await prisma.membership.count({
          where: {
            journeyId: active.journey.id,
            role: { in: INVITABLE_ROLES },
          },
        })
      : 0;

  return (
    <>
      <SiteHeader active="settings" />
      <main className="mx-auto max-w-3xl px-6 pb-10">
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
            <ProfileForm
              name={user.name ?? ""}
              email={user.email ?? ""}
              image={user.image}
            />
            <ConfirmEmailNote
              email={user.email ?? ""}
              pending={user.pendingEmail}
              confirmed={!!user.emailVerified}
              onResend={resendConfirm}
            />
          </Card>

          <Card className="p-8">
            <Eyebrow className="mb-4">Password</Eyebrow>
            <PasswordForm />
          </Card>

          {/* How Oyun speaks to them — see lib/voice.ts. */}
          <Card className="p-8" id="voice">
            <Eyebrow className="mb-4">How Oyun speaks to you</Eyebrow>
            <VoiceForm current={voiceOf(user.voice)} />
          </Card>

          {/* Offered only while the "yoruba" switch is on — see lib/i18n.ts. */}
          {offered && (
            <Card className="p-8">
              <Eyebrow className="mb-4">Language · Èdè</Eyebrow>
              <p className="mb-4 prose-serif-xs text-muted">Signing in and the menus, on this device.</p>
              <LanguageSwitch current={lang} />
            </Card>
          )}

          <Card className="p-8">
            <Eyebrow className="mb-4">Notifications</Eyebrow>
            <NotificationForm
              notifyByEmail={user.notifyByEmail}
              weeklyDigest={user.weeklyDigest}
              categories={{
                notifyCircle: user.notifyCircle,
                notifyHer: user.notifyHer,
                notifyDates: user.notifyDates,
                notifyDiary: user.notifyDiary,
                notifyHouse: user.notifyHouse,
                notifyMorning: user.notifyMorning,
              }}
              morningHour={user.morningHour}
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
              <InvitePanel hasSupporter={supporterCount > 0} general={voiceOf(user.voice) === "GENERAL"} />
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

          {/*
            Somewhere to turn.
            Placed above the dangerous heading and below the everyday ones,
            because the person who needs it is not browsing — they came here
            looking for a way to reach a human, and found one.
          */}
          {canWrite && (
            <Card className="p-8">
              <Eyebrow className="mb-3">Something is wrong</Eyebrow>
              <p className="mb-5 prose-serif-xs text-muted">
                If you are worried about somebody, or somebody in your circle
                should not be here, or anything at all has gone wrong — tell us
                and a person will read it. We only ever see what you write
                here; we cannot read your diary, your letters, or anything else
                your family has kept.
              </p>
              <RaiseConcern />
            </Card>
          )}

          {isMother && active?.journey.status === "ACTIVE" && (
            <Card className="border-accent2/20 p-8">
              <Eyebrow className="mb-4 text-accent2">If the road turns hard</Eyebrow>
              <MarkLoss general={voiceOf(user.voice) === "GENERAL"} />
            </Card>
          )}

          {active && !isMother && (
            <Card className="p-8">
              <Eyebrow className="mb-3">Your place in the circle</Eyebrow>
              <LeaveCircle motherName={active.journey.owner?.name?.split(" ")[0] ?? "her"} />
            </Card>
          )}

          <Card className="p-8">
            <Eyebrow className="mb-3">Take everything with you</Eyebrow>
            <p className="mb-5 prose-serif-xs text-muted">
              These months are your family&rsquo;s, not ours. Download the lot —
              letters, requests, firsts, the appointments and what came of them —
              as one file: a page you can read or print without any app, and the
              same records again as data. Photographs are linked, not packed in.
            </p>
            <ExportButton />
          </Card>

          <Card className="flex flex-wrap items-center justify-between gap-4 p-8">
            <div className="min-w-0">
              <Eyebrow className="mb-2">Session</Eyebrow>
              <p className="break-all font-mono text-xs text-muted">
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
