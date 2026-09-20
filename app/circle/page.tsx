import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership, getJourneyMembers } from "@/lib/data";
import { ROLE_LABEL, isHousehold } from "@/lib/roles";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatCard } from "@/components/ui/StatCard";
import { PageHero } from "@/components/ui/PageHero";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { InvitePanel } from "@/components/InvitePanel";
import { revokeInvite, removeMember } from "./actions";
import { welcomeRequest, declineRequest } from "./join-actions";
import { JoinRequests } from "@/components/circle/JoinRequests";

export const metadata: Metadata = {
  title: "Circle",
  description: "The people walking with you.",
  robots: { index: false },
};


export default async function CirclePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/circle");

  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  /**
   * The household, not the mother alone.
   *
   * Inviting, welcoming and removing used to be hers by herself, which made
   * the man walking this with her a guest in the part of the app that decides
   * who else is in it. They are in this together — so either of them can open
   * the door, and either of them can close it.
   */
  if (!isHousehold(active.role)) redirect("/journey");
  const isMother = active.role === "MOTHER";

  const journeyId = active.journey.id;
  const [members, pending, asks] = await Promise.all([
    getJourneyMembers(journeyId),
    prisma.invite.findMany({
      where: { journeyId, acceptedAt: null },
      orderBy: { createdAt: "desc" },
    }),
    // People who followed a shared link and asked to come in. Oldest first:
    // somebody who has been waiting a fortnight should not be pushed down the
    // page by somebody who asked this morning.
    prisma.joinRequest.findMany({
      where: { journeyId, status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 50,
      select: {
        id: true,
        name: true,
        relation: true,
        email: true,
        note: true,
        createdAt: true,
        share: { select: { post: { select: { body: true } } } },
      },
    }),
  ]);

  const supporters = members.filter((m) => m.role !== "MOTHER");

  return (
    <>
      <SiteHeader active="circle" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <PageHero
          eyebrow="Your circle"
          title="The people walking with you."
          lede={
            isMother
              ? "You were never meant to carry this alone. Invite a husband or an accountability partner, and they'll see how to support and pray for you each week."
              : "Neither of you was meant to carry this alone. Invite family, a friend from church, or an accountability partner, and they'll see how to support and pray for you both each week."
          }
          aside={
            <StatCard
              label="Walking with you"
              value={supporters.length + 1}
              hint={supporters.length === 0 ? "just you, for now" : "including you"}
            />
          }
        />

        {asks.length > 0 && (
          <div className="mt-6">
            <Card className="border-accent/30">
              <JoinRequests
                asks={asks.map((a) => ({
                  id: a.id,
                  name: a.name,
                  relation: a.relation,
                  email: a.email,
                  note: a.note,
                  createdAt: a.createdAt.toISOString(),
                  from:
                    a.share?.post.body.trim().split("\n")[0].slice(0, 80) ??
                    null,
                }))}
                roles={[
                  { value: "FAMILY", label: ROLE_LABEL.FAMILY },
                  { value: "FRIEND", label: ROLE_LABEL.FRIEND },
                  { value: "ACCOUNTABILITY", label: ROLE_LABEL.ACCOUNTABILITY },
                ]}
                onWelcome={welcomeRequest}
                onDecline={declineRequest}
              />
            </Card>
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="min-w-0 space-y-4">
            <Card>
              <Eyebrow className="mb-4">Walking with you</Eyebrow>
              <ul className="space-y-3">
                <MemberRow
                  name={session.user.name ?? "You"}
                  sub="You"
                  role="MOTHER"
                />
                {supporters.map((m) => (
                  <MemberRow
                    key={m.id}
                    name={m.user.name ?? m.user.email ?? "A supporter"}
                    sub={m.user.email ?? ""}
                    role={m.role}
                    photoUrl={m.user.image}
                    removeId={m.id}
                  />
                ))}
                {supporters.length === 0 && (
                  <li className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-4 py-8 text-center">
                    <Icon name="users" size={28} className="text-accent2" />
                    <p className="max-w-xs prose-serif-xs text-muted">
                      {isMother
                        ? "No one else yet. Invite a spouse, or a friend from church who will pray — you were never meant to carry this alone."
                        : "No one else yet. Invite family, or a friend from church who will pray — neither of you was meant to carry this alone."}
                    </p>
                  </li>
                )}
              </ul>
            </Card>

            {pending.length > 0 && (
              <Card>
                <Eyebrow className="mb-4">Pending invitations</Eyebrow>
                <ul className="space-y-3">
                  {pending.map((inv) => (
                    <li
                      key={inv.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border border-l-2 border-l-accent2/50 bg-bg p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Icon name="clock" size={18} className="shrink-0 text-accent2" />
                        <div className="min-w-0">
                          <p className="truncate font-mono text-sm text-ink">
                            {inv.email}
                          </p>
                          <p className="font-mono text-[0.68rem] text-muted">
                            {ROLE_LABEL[inv.role]} · awaiting · sent{" "}
                            {inv.createdAt.toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <form action={revokeInvite}>
                        <input type="hidden" name="inviteId" value={inv.id} />
                        <button
                          type="submit"
                          className="shrink-0 font-mono text-[0.7rem] text-muted underline underline-offset-2 hover:text-negative"
                        >
                          Cancel
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          <Card className="min-w-0">
            <InvitePanel hasSupporter={supporters.length > 0} isMother={isMother} />
          </Card>
        </div>
      </main>
    </>
  );
}

function MemberRow({
  name,
  sub,
  role,
  photoUrl,
  removeId,
}: {
  name: string;
  sub: string;
  role: string;
  photoUrl?: string | null;
  removeId?: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg p-3">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar
          name={name}
          photoUrl={photoUrl}
          tone={isHousehold(role) ? "accent" : "accent2"}
          size={36}
        />
        <div className="min-w-0">
          <p className="truncate font-mono text-sm text-ink">{name}</p>
          <p className="truncate font-mono text-[0.68rem] text-muted">
            {ROLE_LABEL[role]}
            {sub ? ` · ${sub}` : ""}
          </p>
        </div>
      </div>
      {removeId && (
        <form action={removeMember}>
          <input type="hidden" name="membershipId" value={removeId} />
          <button
            type="submit"
            className="shrink-0 font-mono text-[0.7rem] text-muted underline underline-offset-2 hover:text-negative"
          >
            Remove
          </button>
        </form>
      )}
    </li>
  );
}
