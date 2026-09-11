import Link from "next/link";
import { type AppointmentKind } from "@prisma/client";
import {
  kindVoice,
  appointmentTitle,
  dayLabel,
  timeLabel,
  daysUntil,
} from "@/lib/appointments";

type Appt = {
  id: string;
  kind: AppointmentKind;
  title: string | null;
  at: Date;
  hasTime: boolean;
  where: string | null;
};

/**
 * The next date or two, sitting beside the due date on the home page.
 *
 * Two at most and one line each. Somebody opening this at six in the morning
 * with a baby on their shoulder needs to know "Thursday, 9:30" and nothing
 * else; the whole book is one tap away.
 */
export function ComingUp({ appointments }: { appointments: Appt[] }) {
  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-bg/40 p-4">
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
          Coming up
        </p>
        <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted">
          No appointments in the book.{" "}
          <Link
            href="/appointments"
            className="text-accent underline underline-offset-4"
          >
            Put the next one in →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-bg/60 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
          Coming up
        </p>
        <Link
          href="/appointments"
          className="font-mono text-[0.58rem] uppercase tracking-widest text-accent underline underline-offset-4 hover:text-accent-deep"
        >
          All →
        </Link>
      </div>

      <ul className="mt-2.5 space-y-2">
        {appointments.map((a) => {
          const at = new Date(a.at);
          const days = daysUntil(at, new Date());
          const time = timeLabel(at, a.hasTime);
          const soon = days <= 2;
          return (
            <li key={a.id} className="leading-snug">
              <p
                className={`font-mono text-xs ${soon ? "text-accent" : "text-ink"}`}
              >
                {dayLabel(at)}
                {time ? ` · ${time}` : ""}
              </p>
              <p className="font-mono text-[0.66rem] text-muted">
                {appointmentTitle(a.kind, a.title)}
                {a.where ? ` · ${a.where}` : ""}
              </p>
            </li>
          );
        })}
      </ul>
      <p className="mt-2.5 font-mono text-[0.58rem] leading-relaxed text-muted">
        {kindVoice(appointments[0].kind).weekAhead
          ? "You'll be reminded a week before, the day before, and that morning."
          : "You'll be reminded the day before, and that morning."}
      </p>
    </div>
  );
}
