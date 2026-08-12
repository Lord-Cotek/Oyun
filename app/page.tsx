import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { OyunMark } from "@/components/ui/OyunMark";
import { Verse } from "@/components/ui/Verse";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InstallButton } from "@/components/InstallButton";

export const metadata: Metadata = {
  title: "Christian Pregnancy App & Devotional for Couples",
  description:
    "Oyun is a Christian pregnancy app that pairs each week — conception through your child's first two years — with Scripture, a reflection, and one thing to do, plus a circle of support for the mother and her partner. Guided by Agbebi.",
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
    body: "Forty weeks of pregnancy and the child's first twenty-four months — each stage paired with what's unfolding, a scripture, a short reflection, and one thing to do. Plus a fresh verse each day.",
  },
  {
    eyebrow: "Guided by Agbebi",
    title: "A companion, not a doctor",
    icon: "heart",
    body: "Agbebi — Yoruba for midwife, the one who receives the child — offers Scripture, prayer, and gentle, Reformed encouragement. Never medical advice; always pointing back to God's Word.",
  },
  {
    eyebrow: "The signature",
    title: "A circle of support",
    icon: "users",
    signature: true,
    body: "You are not the only user. Invite your husband and accountability partners — each gets their own view of how to pray for you, encourage you, and carry you, right where you are this week.",
  },
  {
    eyebrow: "Named intercession",
    title: "Prayer, together",
    icon: "flame",
    body: "A shared prayer wall for your circle. Name a real need — a scan, a fear, a decision — and watch, together, for how God answers it.",
  },
  {
    eyebrow: "An altar at home",
    title: "Family worship & catechism",
    icon: "book",
    body: "A daily household rhythm: read a Scripture, sit with a short reflection, pray, sing a hymn — and, once your little one arrives, a children's catechism question. Build the habit from the start.",
  },
  {
    eyebrow: "Kept & remembered",
    title: "Care and keepsakes",
    icon: "star",
    body: "Chart how your heart is over time, write letters to your baby, and keep a timeline of firsts with photos — with a profile for each child, twins and all.",
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
        "A Christian pregnancy app and daily devotional — Scripture, prayer, and gentle guidance from conception through a child's first two years, for a mother and her partner. Guided by Agbebi.",
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
            <Button href="/sign-up">Begin the journey</Button>
            <Button href="/sign-in" variant="ghost">
              I already have an account
            </Button>
            <InstallButton />
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

      {/* What's inside */}
      <section className="border-t border-border py-20">
        <div className="mb-10 max-w-prose">
          <Eyebrow className="mb-4">Inside Oyun</Eyebrow>
          <h2 className="font-serif text-3xl leading-snug text-ink">
            A little, faithfully — at the right time.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
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
              <p className="mt-3 font-mono text-xs leading-relaxed text-muted">
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
            <p>
              And if the road should turn to loss, Oyun does not vanish or pretend.
              It becomes a place of lament and remembrance — Scripture for grief, a
              way to remember your child by name, and your circle drawn near. No one
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
