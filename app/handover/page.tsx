import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { computePosition } from "@/lib/stage";
import { bornOn } from "@/lib/journey-complete";
import { handoverReady, idileBase } from "@/lib/handover";
import { SiteHeader } from "@/components/SiteHeader";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { startHandover } from "./actions";

export const metadata: Metadata = { title: "Bring the family to Ìdílé", robots: { index: false } };

const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function HandoverPage({ searchParams }: { searchParams: { error?: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/handover");
  const userId = session.user.id;
  const active = await getActiveMembership(userId);
  if (!active || active.journey.ownerId !== userId || active.journey.status !== "ACTIVE") redirect("/journey");
  const j = active.journey;
  if (!computePosition(j.dueDate).born) redirect("/journey");

  const [children, members, myLetters, firsts, lastPass, me] = await Promise.all([
    prisma.child.findMany({ where: { journeyId: j.id }, orderBy: { createdAt: "asc" }, select: { name: true, birthDate: true } }),
    prisma.membership.findMany({
      where: { journeyId: j.id, role: { not: "MOTHER" } },
      orderBy: { createdAt: "asc" },
      select: { role: true, userId: true, user: { select: { name: true, email: true } } },
    }),
    prisma.letter.count({ where: { journeyId: j.id, authorId: userId, toBaby: true } }),
    prisma.milestone.count({ where: { journeyId: j.id, kind: { not: "BIRTH" } } }),
    prisma.handover.findFirst({ where: { journeyId: j.id, claimedAt: { not: null } }, orderBy: { claimedAt: "desc" }, select: { claimedAt: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { email: true } }),
  ]);
  const partner = members.find((m) => m.role === "PARTNER" && m.user.email);
  const circle = members.filter((m) => m.role !== "PARTNER" && m.user.email);
  const others = await prisma.letter.count({ where: { journeyId: j.id, authorId: { not: userId }, toBaby: true } });

  const base = idileBase();
  const ready = handoverReady();
  // Without the shared secret: the simple link, but with a real birthday.
  const born = bornOn({ dueDate: j.dueDate, children });
  const firstName = children[0]?.name ?? j.babyName ?? "";
  const plainLink = base
    ? `${base}/welcome?name=${encodeURIComponent(firstName)}&born=${born.toISOString().slice(0, 10)}`
    : null;

  const box = "mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]";
  const row = "flex items-start gap-3 rounded-lg border border-border bg-bg/50 p-3";

  return (
    <>
      <SiteHeader active="journey" />
      <main className="mx-auto max-w-2xl px-6 pb-12">
        <BackLink href="/journey">Back to your journey</BackLink>
        <Eyebrow className="mb-3 mt-6">The next chapter</Eyebrow>
        <h1 className="font-serif text-3xl leading-snug text-ink">Bring the family to Ìdílé</h1>
        <p className="mt-3 prose-serif-sm text-muted">
          Oyun walks from the first weeks to the second birthday. Ìdílé, its sibling, carries the family on
          through childhood: family worship, catechism, Scripture memory, and every keepsake. Nothing leaves
          here — your journey stays in Oyun for you to read, always.
        </p>

        {lastPass?.claimedAt && (
          <Card className="mt-6 border-accent/30 bg-accent/[0.06]">
            <p className="prose-serif-sm text-ink">
              You brought the family to Ìdílé on {fmt(lastPass.claimedAt)}.
            </p>
            {base && (
              <a href={base} className="mt-2 inline-block font-mono text-xs text-accent underline underline-offset-4">
                Open Ìdílé →
              </a>
            )}
          </Card>
        )}

        {!base ? (
          <Card className="mt-6">
            <p className="prose-serif-sm text-muted">Ìdílé is not linked to this Oyun yet.</p>
          </Card>
        ) : !ready ? (
          <Card className="mt-6">
            <p className="prose-serif-sm text-muted">
              Ìdílé will ask you to confirm {firstName ? `${firstName}'s` : "your little one's"} name and birthday.
            </p>
            <Button href={plainLink!} className="mt-4 w-full">Continue in Ìdílé</Button>
          </Card>
        ) : (
          <form action={startHandover} className="mt-6 space-y-5">
            <Card>
              <Eyebrow className="mb-3">Coming with you</Eyebrow>
              <ul className="space-y-2">
                {children.length > 0 ? (
                  children.map((c, i) => (
                    <li key={i} className="font-serif text-base text-ink">
                      {c.name}
                      <span className="ml-2 font-mono text-[0.68rem] text-muted">
                        {c.birthDate ? `born ${fmt(c.birthDate)}` : "birthday to add in Ìdílé"}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="prose-serif-xs text-muted">
                    {j.babyCount > 1 ? "Your little ones" : j.babyName ?? "Your little one"} — you can check
                    names and birthdays in Ìdílé before anything is saved.
                  </li>
                )}
              </ul>
              <p className="mt-3 font-mono text-[0.65rem] text-muted">
                They join your family tree in Ìdílé with their real birthdays.
              </p>
            </Card>

            <Card>
              <Eyebrow className="mb-3">What else to bring</Eyebrow>
              <div className="space-y-2">
                {partner && (
                  <label className={row}>
                    <input type="checkbox" name="withPartner" defaultChecked className={box} />
                    <span className="prose-serif-xs text-ink">
                      Invite {partner.user.name ?? "your partner"} to the family as a parent
                    </span>
                  </label>
                )}
                {firsts > 0 && (
                  <label className={row}>
                    <input type="checkbox" name="withFirsts" defaultChecked className={box} />
                    <span className="prose-serif-xs text-ink">
                      Their firsts, with photos, as keepsakes ({firsts})
                    </span>
                  </label>
                )}
                {myLetters > 0 && (
                  <label className={row}>
                    <input type="checkbox" name="withLetters" defaultChecked className={box} />
                    <span className="prose-serif-xs text-ink">
                      Your letters to them ({myLetters}) — a sealed one stays sealed until its day
                    </span>
                  </label>
                )}
                {!partner && firsts === 0 && myLetters === 0 && (
                  <p className="prose-serif-xs text-muted">Just the children, this time.</p>
                )}
              </div>
              {others > 0 && (
                <p className="mt-3 font-mono text-[0.65rem] text-muted">
                  Letters others wrote to them stay here, where they can always be read — they are theirs to move.
                </p>
              )}
            </Card>

            {circle.length > 0 && (
              <Card>
                <Eyebrow className="mb-3">Your circle</Eyebrow>
                <p className="mb-3 prose-serif-xs text-muted">Invite any of them along. Each gets an invitation to accept or not.</p>
                <div className="space-y-2">
                  {circle.map((m) => (
                    <label key={m.userId} className={row}>
                      <input type="checkbox" name="circle" value={m.userId} className={box} />
                      <span className="prose-serif-xs text-ink">{m.user.name ?? "Someone in your circle"}</span>
                    </label>
                  ))}
                </div>
              </Card>
            )}

            <Card>
              <label htmlFor="forEmail" className="eyebrow mb-1.5 block text-muted">Your email on Ìdílé</label>
              <input
                id="forEmail"
                name="forEmail"
                type="email"
                required
                defaultValue={me?.email ?? ""}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink focus:border-accent focus:outline-none"
              />
              <p className="mt-1.5 font-mono text-[0.65rem] text-muted">
                Only an Ìdílé account with this email, confirmed, can receive the family. The link works once, for seven days.
              </p>
              {searchParams.error === "email" && (
                <p role="alert" className="mt-2 font-mono text-xs text-negative">That email does not look right.</p>
              )}
            </Card>

            <button
              type="submit"
              className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep"
            >
              Continue to Ìdílé
            </button>
          </form>
        )}
      </main>
    </>
  );
}
