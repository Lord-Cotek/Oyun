import { dailyDevotion } from "@/lib/daily";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** A verse for today — rotates daily, on top of the weekly stage scripture. */
export function DailyVerse() {
  const d = dailyDevotion();
  return (
    <Card className="p-6">
      <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center md:gap-8">
        <Eyebrow className="md:whitespace-nowrap">A verse for today</Eyebrow>
        <div>
          <p className="font-serif text-lg leading-snug text-ink md:text-xl">
            &ldquo;{d.text}&rdquo;
          </p>
          <p className="mt-2 font-mono text-xs text-muted">
            <span className="text-accent">{d.ref}</span> — {d.reflection}
          </p>
        </div>
      </div>
    </Card>
  );
}
