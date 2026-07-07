import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { OyunMark } from "@/components/ui/OyunMark";
import { Verse } from "@/components/ui/Verse";

export const metadata: Metadata = {
  title: "Walk the whole journey, together",
  description:
    "Oyun pairs each stage — conception through a child's first two years — with Scripture, a reflection, and one thing to do. With an accountability layer for the mother and her partner. Guided by Agbebi.",
};

const PILLARS = [
  {
    eyebrow: "Every stage",
    title: "Conception to two years",
    body: "Forty weeks of pregnancy and the child's first twenty-four months — each stage paired with what's unfolding, a scripture, a short reflection, and one concrete thing to do.",
  },
  {
    eyebrow: "The signature",
    title: "An accountability layer",
    body: "The mother is not the only user. A husband or accountability partner gets their own view — how to support and pray for her, right where she is this week.",
  },
  {
    eyebrow: "Guided by Agbebi",
    title: "A companion, not a doctor",
    body: "Agbebi — Yoruba for midwife, the one who receives the child — offers Scripture, prayer, and gentle support. Never medical advice; always pointing back to God's Word.",
  },
];

export default function Landing() {
  return (
    <main className="mx-auto max-w-shell px-6">
      {/* Hero */}
      <section className="flex min-h-[88dvh] flex-col justify-center py-20">
        <div className="animate-fade-up">
          <div className="mb-10 flex items-center gap-4">
            <OyunMark size={64} className="animate-breathe text-ink" />
            <div>
              <p className="font-serif text-2xl leading-none text-ink">Oyun</p>
              <Eyebrow className="mt-1.5 text-muted">Guided by Agbebi</Eyebrow>
            </div>
          </div>

          <Eyebrow className="mb-5">A COTEK companion</Eyebrow>
          <h1 className="max-w-3xl font-serif text-4xl leading-[1.08] text-ink sm:text-5xl md:text-6xl">
            Walk the whole journey — together — with Scripture at the center.
          </h1>
          <p className="mt-6 max-w-prose font-mono text-sm leading-relaxed text-muted">
            From the first quiet weeks of the womb through a child's earliest
            years, Oyun keeps you where you actually are: what's unfolding this
            stage, a word from Scripture, one thing to do, and a way for a
            husband or accountability partner to carry it with you.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="/sign-in">Begin the journey</Button>
            <Button href="/sign-in" variant="ghost">
              I have an invite
            </Button>
          </div>
        </div>
      </section>

      {/* Verse rest */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-prose text-center">
          <Verse
            size="lg"
            text="For you formed my inward parts; you knitted me together in my mother's womb."
            reference="Psalm 139:13"
          />
        </div>
      </section>

      {/* Pillars */}
      <section className="grid gap-5 border-t border-border py-20 md:grid-cols-3">
        {PILLARS.map((p) => (
          <Card key={p.title} className="animate-fade-up">
            <Eyebrow className="mb-4">{p.eyebrow}</Eyebrow>
            <h2 className="font-serif text-2xl leading-snug text-ink">{p.title}</h2>
            <p className="mt-3 font-mono text-xs leading-relaxed text-muted">
              {p.body}
            </p>
          </Card>
        ))}
      </section>

      {/* Stewardship voice */}
      <section className="border-t border-border py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow className="mb-4">Why Oyun</Eyebrow>
            <h2 className="font-serif text-3xl leading-snug text-ink">
              Restraint is the point.
            </h2>
          </div>
          <div className="space-y-4 font-mono text-sm leading-relaxed text-muted">
            <p>
              Most apps for this season are loud with charts, comparisons, and
              worry. Oyun is spare on purpose. It gives you a little, faithfully,
              at the right time — and gets out of the way.
            </p>
            <p>
              It will not promise you an easy delivery or a guaranteed outcome.
              God is not a lever. He is good, sovereign, and near — in joy and in
              the hard things alike. That is the ground we stand on.
            </p>
            <p>
              For everything medical, Oyun sends you to your doctor or midwife —
              plainly and every time. Its work is the other thing: to keep
              Scripture, prayer, and the people who love you close.
            </p>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border py-24 text-center">
        <Eyebrow className="mb-4">Begin</Eyebrow>
        <h2 className="mx-auto max-w-2xl font-serif text-3xl leading-snug text-ink md:text-4xl">
          Start where you are. Agbebi will meet you there.
        </h2>
        <div className="mt-8 flex justify-center">
          <Button href="/sign-in">Enter Oyun</Button>
        </div>
      </section>
    </main>
  );
}
