import { type ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { OyunMark } from "@/components/ui/OyunMark";

/**
 * A warm, hopeful blank state — a soft mark (or custom icon), a serif title, an
 * optional Scripture, a gentle line of guidance, and an optional action. Turns
 * every dead-end (empty nursery, no prayers yet) into an invitation.
 */
export function EmptyState({
  icon,
  title,
  verse,
  children,
  action,
  className = "",
}: {
  icon?: ReactNode;
  title: ReactNode;
  verse?: { text: string; reference: string };
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`flex flex-col items-center gap-4 py-14 text-center ${className}`}>
      <div className="text-accent">
        {icon ?? <OyunMark size={48} className="animate-breathe text-accent" />}
      </div>
      <h3 className="font-serif text-2xl leading-tight text-ink">{title}</h3>
      {children && (
        <p className="max-w-sm font-mono text-xs leading-relaxed text-muted">
          {children}
        </p>
      )}
      {verse && (
        <p className="max-w-sm font-serif text-base italic leading-snug text-muted">
          &ldquo;{verse.text}&rdquo;
          <span className="mt-1 block font-mono text-[0.68rem] not-italic uppercase tracking-widest text-accent">
            {verse.reference}
          </span>
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </Card>
  );
}
