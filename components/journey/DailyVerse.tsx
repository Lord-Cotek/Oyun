import { dailyWordIn } from "@/lib/voice-content";
import { isGeneral } from "@/lib/voice";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * The day's word — rotates daily, on top of the weekly stage content. A verse
 * for the faith voice; a word of encouragement and its theme for someone who
 * chose Oyun without religious content. See lib/voice.ts.
 */
export function DailyVerse({ voice }: { voice?: string | null }) {
  const d = dailyWordIn(voice);
  const general = isGeneral(voice);
  return (
    <Card className="p-6">
      <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center md:gap-8">
        <Eyebrow className="md:whitespace-nowrap">{general ? "A word for today" : "A verse for today"}</Eyebrow>
        <div>
          <p className="font-serif text-lg leading-snug text-ink md:text-xl">
            {general ? d.text : <>&ldquo;{d.text}&rdquo;</>}
          </p>
          <p className="mt-2 font-mono text-xs text-muted">
            <span className="text-accent">{d.ref}</span> — {d.reflection}
          </p>
        </div>
      </div>
    </Card>
  );
}
