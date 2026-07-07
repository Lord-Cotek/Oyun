import { familyWorship } from "@/lib/worship";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Today's family-worship rhythm: a verse to read, a prayer, and a catechism Q. */
export function FamilyWorship() {
  const { liturgy, catechism, catechismNumber } = familyWorship();
  return (
    <Card className="p-8">
      <Eyebrow className="mb-4">Family worship today</Eyebrow>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-2 text-muted">Read together</p>
          <p className="font-serif text-lg leading-snug text-ink">
            &ldquo;{liturgy.read.text}&rdquo;
          </p>
          <p className="mt-2 font-mono text-xs text-accent">{liturgy.read.ref}</p>
          <p className="mt-4 font-mono text-sm leading-relaxed text-muted">
            {liturgy.pray}
          </p>
        </div>
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
            A gentle rhythm for the household — learned by repetition, long before
            it&rsquo;s fully understood.
          </p>
        </div>
      </div>
    </Card>
  );
}
