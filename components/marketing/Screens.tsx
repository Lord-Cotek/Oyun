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
    src: "/shots/home.jpg",
    title: "Where you are this week",
    caption:
      "The week, drawn; what is changing; and a word written for exactly this stage — with Christian faith or without religious content, as you choose.",
    alt: "The journey home page on a phone at week 18: the title 'The first felt movements', a drawing of the baby, and a ring showing 18 of 40 weeks with 150 days to go.",
  },
  {
    src: "/shots/health.jpg",
    title: "The health log",
    caption:
      "Blood pressure, glucose, weight and how you feel, a few seconds each — kept together for your doctor, and shared with them only if you choose.",
    alt: "The health log on a phone: today's glucose slots for fasting and after each meal, ready to fill in, under the tabs for cards, log, medicines, tests, report and your doctor.",
  },
  {
    src: "/shots/support.jpg",
    title: "Asking your circle",
    caption:
      "Name a real need — a scan, a fear, a decision. The people you invited carry it with you, by name, and nobody else sees it.",
    alt: "A request on a phone: 'The 20-week scan on Thursday — a bit nervous about this one. A message that morning would mean a lot', with reactions beneath it.",
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

      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
