import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { OyunMark } from "@/components/ui/OyunMark";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InstallButton } from "@/components/InstallButton";
import { Screens } from "@/components/marketing/Screens";

/**
 * The front door is neutral on purpose. Oyun is offered by doctors and
 * midwives to patients of every faith and none, and how Oyun speaks to each
 * person is their own choice at sign-up — see lib/voice.ts. So this page says
 * what Oyun is for everybody, and offers both ways of having it side by side,
 * as equals: with Christian faith, or without religious content.
 */
export const metadata: Metadata = {
  title: "Pregnancy & Early Parenthood Companion — With Faith or Without",
  description:
    "Oyun walks with you from conception through your child's first two years — what's unfolding each week, a reflection, one thing to do, your appointments and health log, and a circle of support. Choose Christian faith or no religious content. Guided by Agbebi.",
  alternates: { canonical: "/" },
};

const PILLARS: {
  eyebrow: string;
  title: string;
  body: string;
  icon: IconName;
  signature?: boolean;
}[] = [
  {
    eyebrow: "Every stage",
    title: "Conception to two years",
    icon: "ring",
    body: "Forty weeks of pregnancy and the child's first twenty-four months — each stage paired with what's unfolding, a short reflection, and one thing to do. Plus a fresh word each day.",
  },
  {
    eyebrow: "Guided by Agbebi",
    title: "A companion, not a doctor",
    icon: "heart",
    body: "Agbebi — Yoruba for midwife, the one who receives the child — offers gentle encouragement in the voice you chose. Never medical advice; for that, always your doctor or midwife.",
  },
  {
    eyebrow: "The signature",
    title: "A circle of support",
    icon: "users",
    signature: true,
    body: "You are not the only user. Invite your partner, family and close friends — each gets their own view of how to encourage you and carry you, right where you are this week.",
  },
  {
    eyebrow: "For your appointments",
    title: "Health log & doctor's report",
    icon: "pulse",
    body: "Blood pressure, readings, medicines, tests and scans, kept in one place — with a clear report to print or share with your doctor or midwife, only when you choose to.",
  },
  {
    eyebrow: "Named and shared",
    title: "Ask for support",
    icon: "hands",
    body: "A shared wall for your circle. Name a real need — a scan, a fear, a decision — and let the people who love you carry it with you.",
  },
  {
    eyebrow: "Kept & remembered",
    title: "Care and keepsakes",
    icon: "star",
    body: "Chart how your heart is over time, write letters to your baby, and keep a timeline of firsts with photos — with a profile for each child, twins and all.",
  },
];

/** The two ways to have Oyun — chosen at sign-up, changed any time. */
const WAYS: { title: string; body: string; points: string[] }[] = [
  {
    title: "With Christian faith",
    body: "Oyun as it was first written: Scripture at the centre of every stage.",
    points: [
      "A Bible verse for each day and each week",
      "Prayer with your circle, by name",
      "Family worship and a Scripture reading plan",
      "Readings for grief, if the road turns to loss",
    ],
  },
  {
    title: "Without religious content",
    body: "Every feature, the same care — with no verses, prayers or worship.",
    points: [
      "A word of encouragement for each day and each week",
      "Your circle holds what you ask them to, by name",
      "Reflections written for exactly where you are",
      "Gentle words for grief, if the road turns to loss",
    ],
  },
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oyun.cotek.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#org`,
      name: "cotek app FZ-LLC",
      url: siteUrl,
      email: "support@cotek.live",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Oyun",
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#org` },
    },
    {
      "@type": "SoftwareApplication",
      name: "Oyun",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "iOS, Android, Web",
      url: siteUrl,
      description:
        "A pregnancy and early-parenthood companion — each week's stage, a reflection, a health log and a circle of support from conception through a child's first two years, with Christian faith or without religious content. Guided by Agbebi.",
      publisher: { "@id": `${siteUrl}/#org` },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export default function Landing() {
  return (
    <main className="mx-auto max-w-shell px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ThemeToggle className="fixed right-5 top-5 z-30" />
      {/* Hero */}
      <section className="flex min-h-[76dvh] flex-col justify-center py-16">
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
            Walk the whole journey — together.
          </h1>
          <p className="mt-6 max-w-prose prose-serif-sm text-muted">
            From the first quiet weeks of pregnancy through a child's earliest
            years, Oyun keeps you where you actually are: what's unfolding this
            stage, a word for the week, one thing to do, and a way for the
            people who love you to carry it with you. With Christian faith, or
            without religious content — you choose.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="/sign-up">Begin the journey</Button>
            <Button href="/sign-in" variant="ghost">
              I already have an account
            </Button>
            <InstallButton />
          </div>

          {/* The two questions a stranger actually has, answered before they
              have to go looking. */}
          <p className="prose-serif-xs mt-6 max-w-prose text-muted">
            Free, with no plans to charge — no ads, no subscription, nothing
            sold on.{" "}
            <span className="text-ink">Your journey is yours.</span> Nothing you
            write is public, there is no feed of strangers, and the circle you
            invite only ever sees what you choose to share with them.
          </p>
        </div>
      </section>

      <Screens />

      {/* Your way — the two voices, as equals. See lib/voice.ts. */}
      <section className="border-t border-border py-20">
        <div className="mb-10 max-w-prose">
          <Eyebrow className="mb-4">Your way</Eyebrow>
          <h2 className="font-serif text-3xl leading-snug text-ink">
            With faith, or without. The same Oyun either way.
          </h2>
          <p className="mt-3 prose-serif-sm text-muted">
            You choose when you sign up, and you can change it any time. It is yours alone — the people in
            your circle each choose for themselves.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {WAYS.map((w) => (
            <Card key={w.title} className="p-7">
              <h3 className="font-serif text-2xl leading-snug text-ink">{w.title}</h3>
              <p className="mt-2 prose-serif-xs text-muted">{w.body}</p>
              <ul className="mt-4 space-y-2">
                {w.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5 prose-serif-xs text-ink/90">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {pt}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* What's inside */}
      <section className="border-t border-border py-20">
        <div className="mb-10 max-w-prose">
          <Eyebrow className="mb-4">Inside Oyun</Eyebrow>
          <h2 className="font-serif text-3xl leading-snug text-ink">
            A little, at the right time.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <Card
              key={p.title}
              className={`animate-fade-up transition-colors hover:border-accent/40 ${
                p.signature ? "border-accent2/30 bg-accent2/[0.05]" : ""
              }`}
            >
              <div className={`mb-4 ${p.signature ? "text-accent2" : "text-accent"}`}>
                <Icon name={p.icon} size={22} />
              </div>
              <Eyebrow className={`mb-2 ${p.signature ? "text-accent2" : ""}`}>
                {p.eyebrow}
              </Eyebrow>
              <h3 className="font-serif text-2xl leading-snug text-ink">{p.title}</h3>
              <p className="mt-3 prose-serif-xs text-muted">
                {p.body}
              </p>
            </Card>
          ))}
        </div>
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
          <div className="space-y-4 prose-serif-sm text-muted">
            <p>
              Most apps for this season are loud with charts, comparisons, and
              worry. Oyun is spare on purpose. It gives you a little, at the right
              time — and gets out of the way.
            </p>
            <p>
              It will not promise you an easy delivery or a guaranteed outcome.
              It is honest about the hard things and stays with you in them, in
              joy and in worry alike.
            </p>
            <p>
              For everything medical, Oyun sends you to your doctor or midwife —
              plainly and every time. Its work is the other thing: to keep the
              right words, and the people who love you, close.
            </p>
            <p>
              And if the road should turn to loss, Oyun does not vanish or pretend.
              It becomes a place of remembrance — gentle words for grief, a way to
              remember your child by name, and your circle drawn near. No one
              should walk that alone.
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
          <Button href="/sign-up">Enter Oyun</Button>
        </div>
      </section>
    </main>
  );
}
