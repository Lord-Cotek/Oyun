import Link from "next/link";
import { familyWorship } from "@/lib/worship";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WorshipTracker } from "@/components/journey/WorshipTracker";

/**
 * Today's family-worship rhythm on the journey — a compact preview that links
 * to the full page. During pregnancy we show the read-together verse and
 * prayer; once the baby has arrived (`showCatechism`) we add the catechism.
 */
export function FamilyWorship({
  showCatechism = false,
  streak,
}: {
  showCatechism?: boolean;
  streak?: { doneToday: boolean; streak: number; last7: number };
}) {
  const { liturgy, catechism, catechismNumber } = familyWorship();
  return (
    <Card className="p-8">
      <Eyebrow className="mb-4">Family worship today</Eyebrow>
      <div className={showCatechism ? "grid gap-6 md:grid-cols-2" : ""}>
        <div>
          <p className="eyebrow mb-2 text-muted">Read together</p>
          <p className="max-w-prose font-serif text-lg leading-snug text-ink">
            &ldquo;{liturgy.read.text}&rdquo;
          </p>
          <p className="mt-2 font-mono text-xs text-accent">{liturgy.read.ref}</p>
          <p className="mt-4 max-w-prose font-mono text-sm leading-relaxed text-muted">
            {liturgy.pray}
          </p>
        </div>

        {showCatechism && (
          <div className="md:border-l md:border-border md:pl-6">
            <p className="eyebrow mb-2 text-muted">
              Catechism · Question {catechismNumber}
            </p>
            <p className="font-serif text-lg leading-snug text-ink">
              {catechism.q}
            </p>
            <p className="mt-2 font-mono text-sm leading-relaxed text-ink/90">
              <span className="text-accent">A.</span> {catechism.a}
            </p>
            <p className="mt-4 font-mono text-[0.7rem] leading-relaxed text-muted">
              A gentle rhythm for the household — learned by repetition, long
              before it&rsquo;s fully understood.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
        {streak ? (
          <WorshipTracker
            doneToday={streak.doneToday}
            streak={streak.streak}
            last7={streak.last7}
          />
        ) : (
          <span />
        )}
        <Link
          href="/worship"
          className="font-mono text-xs text-accent hover:underline"
        >
          Open family worship &rarr;
        </Link>
      </div>
    </Card>
  );
}
