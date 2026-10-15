import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * What using Oyun actually looks like.
 *
 * The front page used to ask a stranger to sign up for something they had
 * never seen — handsome type, and not one picture of the product. These are
 * real screenshots of the running app, taken at phone width from a demo
 * journey of invented people. Nothing here belongs to a real family.
 */
const SCREENS = [
  {
    src: "/shots/worship.jpg",
    title: "Today’s liturgy",
    caption:
      "Read, reflect, pray, sing — a short, unhurried rhythm the two of you walk together, different every day and never long.",
    alt: "The worship page on a phone, open at the first station: Isaiah 60:22 in large type — the little one will become a thousand — with the rest of the evening, reflect, talk together, pray, sing and amen, listed down the page.",
  },
  {
    src: "/shots/life.jpg",
    title: "The family diary",
    caption:
      "How you are, a praise, a prayer to be carried, a small moment worth keeping. Seen by the people you invited and nobody else.",
    alt: "The family diary on a phone, showing three posts: a mother recording the baby kicking hard enough for her husband to feel it, a father asking for prayer before a growth scan, and a sister replying with Psalm 139.",
  },
  {
    src: "/shots/prayer.jpg",
    title: "The prayer wall",
    caption:
      "Name a real need — a scan, a fear, a decision. Your circle prays against it by name, and together you watch for the answer.",
    alt: "The prayer wall on a phone, with two requests a family is carrying, each showing who asked, when, and how many people are praying, above a section of requests that have been answered.",
  },
];

export function Screens() {
  return (
    <section className="border-t border-border py-20">
      <div className="mb-10 max-w-prose">
        <Eyebrow className="mb-4">What it looks like</Eyebrow>
        <h2 className="font-serif text-3xl leading-snug text-ink">
          Three rooms you will actually use.
        </h2>
      </div>

      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {SCREENS.map((s) => (
          <li key={s.src}>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-2)]">
              <Image
                src={s.src}
                alt={s.alt}
                width={780}
                height={1560}
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
                className="h-auto w-full"
              />
            </div>
            <h3 className="mt-5 font-serif text-xl leading-snug text-ink">
              {s.title}
            </h3>
            <p className="prose-serif-xs mt-1.5 text-muted">{s.caption}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
