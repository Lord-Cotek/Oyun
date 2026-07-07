import { prisma } from "@/lib/prisma";
import { getJourneyMembers } from "@/lib/data";
import { dailyLament } from "@/lib/lament";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";
import { Verse } from "@/components/ui/Verse";
import { Button } from "@/components/ui/Button";
import { RemembranceForm } from "@/components/lament/RemembranceForm";
import { BeginAgain } from "@/components/lament/BeginAgain";

/** The mother's grief companion — memorial, lament, the circle drawn near. */
export async function LamentView({
  journeyId,
  babyName,
  lossAt,
  viewerName,
}: {
  journeyId: string;
  babyName: string | null;
  lossAt: Date | null;
  viewerName: string | null;
}) {
  const lament = dailyLament();
  const [members, remembrances] = await Promise.all([
    getJourneyMembers(journeyId),
    prisma.remembrance.findMany({
      where: { journeyId },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
      take: 50,
    }),
  ]);
  const supporters = members.filter((m) => m.role !== "MOTHER");

  return (
    <main className="mx-auto max-w-shell px-6 py-10">
      {/* Memorial */}
      <div className="animate-fade-up text-center">
        <OyunMark size={44} className="mx-auto mb-6 text-ink" />
        <Eyebrow className="mb-3 text-accent2">Held in the hands of God</Eyebrow>
        <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
          {babyName ? `In memory of ${babyName}` : "In memory of your little one"}
        </h1>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">
          {lossAt
            ? lossAt.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Known and loved by their Maker"}
        </p>
        <p className="mx-auto mt-6 max-w-prose font-mono text-sm leading-relaxed text-muted">
          There are no words that make this right, and we will not pretend
          otherwise. Your child was fully known and fully loved by God before
          they were known by anyone else. We are so sorry. You do not walk this
          alone.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <Card className="p-8">
            <Eyebrow className="mb-4 text-accent2">A word for today</Eyebrow>
            <Verse text={lament.text} reference={lament.ref} size="lg" />
            <p className="mt-6 border-t border-border pt-6 font-mono text-sm leading-relaxed text-muted">
              {lament.reflection}
            </p>
          </Card>

          <Card className="p-8">
            <Eyebrow className="mb-4">Words of remembrance</Eyebrow>
            <p className="mb-5 font-mono text-xs leading-relaxed text-muted">
              A place to keep what you and those who love you want to remember —
              a name spoken, a prayer, a hope held. These are yours to keep.
            </p>
            <RemembranceForm />
            <div className="mt-6 space-y-3 border-t border-border pt-5">
              {remembrances.length === 0 ? (
                <p className="font-mono text-xs text-muted">
                  Nothing written yet. When you or your circle are ready, a first
                  word can be very small.
                </p>
              ) : (
                remembrances.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border bg-bg p-4">
                    <p className="whitespace-pre-wrap font-serif text-base leading-relaxed text-ink">
                      {r.body}
                    </p>
                    <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                      {r.author.name ?? "A loved one"} ·{" "}
                      {r.createdAt.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-accent2/30 bg-accent2/[0.05] p-6">
            <Eyebrow className="mb-3 text-accent2">You are not alone</Eyebrow>
            {supporters.length > 0 ? (
              <>
                <p className="mb-4 font-mono text-xs leading-relaxed text-muted">
                  These people have been told, and they are with you. Let them
                  near — you do not have to be strong, or to have words.
                </p>
                <ul className="space-y-2">
                  {supporters.map((m) => (
                    <li key={m.id} className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent2/15 font-serif text-sm text-accent2">
                        {(m.user.name ?? "?").charAt(0).toUpperCase()}
                      </span>
                      <span className="font-mono text-sm text-ink">
                        {m.user.name ?? m.user.email}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="mb-4 font-mono text-xs leading-relaxed text-muted">
                  Please don&rsquo;t carry this by yourself. Invite someone to walk
                  with you — a spouse, a friend, someone from your church who will
                  simply be present.
                </p>
                <Button href="/circle" variant="ghost" className="w-full">
                  Invite someone near
                </Button>
              </>
            )}
          </Card>

          <Card className="p-6">
            <Eyebrow className="mb-3">Lean on the Body</Eyebrow>
            <p className="font-mono text-xs leading-relaxed text-muted">
              Tell your pastor and your church. Grief was never meant to be
              private. The people of God are meant to weep with those who weep
              (Romans 12:15) — let them.
            </p>
          </Card>

          <Card className="p-6">
            <Eyebrow className="mb-3 text-accent2">Agbebi is here</Eyebrow>
            <p className="font-mono text-xs leading-relaxed text-muted">
              If you want to pray, or simply not be alone with your thoughts,
              Agbebi will sit with you — gently, and for as long as you need. She
              is the quiet mark in the corner.
            </p>
          </Card>
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <BeginAgain />
      </div>
    </main>
  );
}
