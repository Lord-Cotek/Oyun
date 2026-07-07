import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership, getJourneyMembers } from "@/lib/data";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { InvitePanel } from "@/components/InvitePanel";
import { revokeInvite, removeMember } from "./actions";

export const metadata: Metadata = {
  title: "Circle",
  description: "The people walking with you.",
  robots: { index: false },
};

const ROLE_LABEL: Record<string, string> = {
  MOTHER: "Mother",
  PARTNER: "Husband / Partner",
  ACCOUNTABILITY: "Accountability partner",
};

export default async function CirclePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/circle");

  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (active.role !== "MOTHER") redirect("/journey");

  const journeyId = active.journey.id;
  const [members, pending] = await Promise.all([
    getJourneyMembers(journeyId),
    prisma.invite.findMany({
      where: { journeyId, acceptedAt: null },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const supporters = members.filter((m) => m.role !== "MOTHER");

  return (
    <>
      <SiteHeader active="circle" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <div className="animate-fade-up">
          <Eyebrow className="mb-3">Your circle</Eyebrow>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            The people walking with you.
          </h1>
          <p className="mt-4 max-w-prose font-mono text-sm leading-relaxed text-muted">
            You were never meant to carry this alone. Invite a husband or an
            accountability partner, and they&rsquo;ll see how to support and pray
            for you each week.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-4">
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
                    removeId={m.id}
                  />
                ))}
                {supporters.length === 0 && (
                  <li className="font-mono text-xs leading-relaxed text-muted">
                    No supporters yet. Invite someone below — a spouse, a friend
                    from church, someone who will pray.
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
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-mono text-sm text-ink">
                          {inv.email}
                        </p>
                        <p className="font-mono text-[0.68rem] text-muted">
                          {ROLE_LABEL[inv.role]} · sent{" "}
                          {inv.createdAt.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
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

          <Card>
            <InvitePanel hasSupporter={supporters.length > 0} />
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
  removeId,
}: {
  name: string;
  sub: string;
  role: string;
  removeId?: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg p-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 font-serif text-sm text-accent">
          {name.charAt(0).toUpperCase()}
        </span>
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
