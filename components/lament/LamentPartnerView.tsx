import { prisma } from "@/lib/prisma";
import { dailyLament } from "@/lib/lament";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";
import { Verse } from "@/components/ui/Verse";
import { RemembranceForm } from "@/components/lament/RemembranceForm";

const HOW_TO_COME_NEAR = [
  "Show up. Presence matters more than words — a text, a meal, sitting in silence.",
  "Don't try to fix it or explain it. Resist \"at least\" and \"everything happens for a reason.\" Just grieve with her.",
  "Say the baby's name. Her child was real. Being remembered is a comfort, not a reminder of pain.",
  "Keep coming back. Grief outlasts the first week. Check in next month, and the month after.",
  "Pray with her and for her — out loud when she wants it, quietly when she doesn't.",
];

/** The circle's view — how to grieve *with* her, not fall silent. */
export async function LamentPartnerView({
  journeyId,
  motherName,
}: {
  journeyId: string;
  motherName: string;
}) {
  const lament = dailyLament();
  const remembrances = await prisma.remembrance.findMany({
    where: { journeyId },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
    take: 50,
  });

  return (
    <main className="mx-auto max-w-shell px-6 py-10">
      <div className="animate-fade-up">
        <OyunMark size={40} className="mb-6 text-ink" />
        <Eyebrow className="mb-3 text-accent2">Grieve with her</Eyebrow>
        <h1 className="max-w-3xl font-serif text-4xl leading-tight text-ink md:text-5xl">
          {motherName} has lost her baby.
        </h1>
        <p className="mt-4 max-w-prose font-mono text-sm leading-relaxed text-muted">
          This is one of the hardest roads. She does not need you to have answers
          — she needs you not to disappear. Come near, stay near, and let God&rsquo;s
          comfort reach her through you.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <Card className="p-8">
            <Eyebrow className="mb-4 text-accent2">How to come near</Eyebrow>
            <ul className="space-y-3">
              {HOW_TO_COME_NEAR.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent2" />
                  <span className="font-mono text-sm leading-relaxed text-ink/90">
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-8">
            <Eyebrow className="mb-4">Leave a word of remembrance</Eyebrow>
            <p className="mb-5 font-mono text-xs leading-relaxed text-muted">
              Write something for {motherName} to keep — a memory, a promise to
              pray, the baby&rsquo;s name spoken with love. She will see it in her
              own space.
            </p>
            <RemembranceForm
              placeholder={`A word for ${motherName} to hold onto…`}
            />
            <div className="mt-6 space-y-3 border-t border-border pt-5">
              {remembrances.map((r) => (
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
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-8">
            <Eyebrow className="mb-4 text-accent2">Pray this today</Eyebrow>
            <Verse text={lament.text} reference={lament.ref} />
            <p className="mt-6 border-t border-border pt-6 font-mono text-sm leading-relaxed text-muted">
              {lament.reflection}
            </p>
          </Card>
          <Card className="border-accent2/30 bg-accent2/[0.05] p-6">
            <Eyebrow className="mb-3 text-accent2">The simplest step</Eyebrow>
            <p className="font-mono text-xs leading-relaxed text-muted">
              You don&rsquo;t need the right words. Send {motherName} a message right
              now — &ldquo;I&rsquo;m so sorry. I&rsquo;m here. I&rsquo;m praying for you.&rdquo; That
              is enough. Then send another next week.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
