"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Verse } from "@/components/ui/Verse";

/**
 * The Liturgy Rail — family worship as a guided procession, not a wall of
 * cards. Each station is a bead on a warm cord that lights as you move down it:
 * Read → Reflect → … → Amen. One station is in focus at a time; the rest rest
 * quietly. Sealing the last bead ("Amen") keeps the day and lights the streak.
 *
 * The cord is the "threefold cord" (Eccl 4:12) — the household bound together,
 * day after day. Fully client-side; only the final seal touches the server.
 */
export type Station = {
  id: string;
  icon: IconName;
  eyebrow: string;
  verse?: { text: string; ref: string };
  title?: string; // a serif line (a question to talk over, a hymn, a catechism Q)
  answer?: string; // catechism answer
  body?: string; // a mono paragraph (reflection, prayer prompt)
  note?: string; // small muted footnote
  tone?: "accent" | "accent2";
};

export function LiturgyRail({
  stations,
  doneToday,
  onSeal,
  canSeal = true,
  sealPrompt = "Pray it home. When your worship is done, seal the day.",
}: {
  stations: Station[];
  doneToday: boolean;
  onSeal: () => Promise<void>;
  canSeal?: boolean;
  sealPrompt?: string;
}) {
  const AMEN = stations.length; // the final bead index
  // If the day is already kept, show the whole walk as complete; otherwise open
  // at the first station and let them move down the cord.
  const [open, setOpen] = useState(doneToday ? stations.length : 0);
  const [sealed, setSealed] = useState(doneToday);
  const [bloom, setBloom] = useState(false);
  const [pending, start] = useTransition();
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => setSealed(doneToday), [doneToday]);

  function go(i: number) {
    setOpen(i);
    // bring the newly-opened station into a comfortable reading position
    requestAnimationFrame(() => {
      rowRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function seal() {
    if (!canSeal) return;
    start(async () => {
      await onSeal();
      setSealed((s) => !s);
      if (!sealed) {
        setBloom(true);
        setTimeout(() => setBloom(false), 1600);
      }
    });
  }

  return (
    <ol className="relative">
      {stations.map((s, i) => {
        const isOpen = open === i;
        const reached = i <= open;
        const done = i < open;
        const tone = s.tone === "accent2" ? "accent2" : "accent";
        return (
          <li
            key={s.id}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className="relative grid grid-cols-[2.25rem_1fr] gap-3 sm:grid-cols-[2.75rem_1fr] sm:gap-4"
          >
            <Cord index={i} last={false} reached={reached} nextReached={i < open}>
              <Bead
                reached={reached}
                active={isOpen}
                done={done}
                tone={tone}
                onClick={() => go(i)}
              >
                <Icon name={s.icon} size={15} />
              </Bead>
            </Cord>

            <div className={`min-w-0 ${isOpen ? "pb-7" : "pb-4"}`}>
              <button
                type="button"
                onClick={() => go(i)}
                className="group flex w-full items-center gap-2 py-1 text-left"
              >
                <span
                  className={`eyebrow transition-colors ${
                    isOpen
                      ? tone === "accent2"
                        ? "text-accent2"
                        : "text-accent"
                      : done
                        ? "text-muted"
                        : "text-muted group-hover:text-ink"
                  }`}
                >
                  {s.eyebrow}
                </span>
                {done && !isOpen && (
                  <span className="text-positive" aria-label="done">
                    <Check />
                  </span>
                )}
              </button>

              {/* Station body — expanded only when in focus */}
              <div
                className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpen ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                    {s.verse && (
                      <Verse text={s.verse.text} reference={s.verse.ref} size="lg" />
                    )}
                    {s.title && (
                      <p className="font-serif text-xl leading-snug text-ink">
                        {s.title}
                      </p>
                    )}
                    {s.answer && (
                      <p className="mt-2 font-mono text-sm leading-relaxed text-ink/90">
                        <span
                          className={tone === "accent2" ? "text-accent2" : "text-accent"}
                        >
                          A.
                        </span>{" "}
                        {s.answer}
                      </p>
                    )}
                    {s.body && (
                      <p
                        className={`font-mono text-sm leading-relaxed text-ink/90 ${
                          s.verse || s.title ? "mt-4 border-t border-border pt-4" : ""
                        }`}
                      >
                        {s.body}
                      </p>
                    )}
                    {s.note && (
                      <p className="mt-3 font-mono text-[0.7rem] leading-relaxed text-muted">
                        {s.note}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => go(i + 1)}
                      className="mt-5 inline-flex items-center gap-2 font-mono text-xs tracking-wide text-accent transition-transform hover:translate-x-0.5"
                    >
                      {i === stations.length - 1 ? "Bring it to a close" : "Continue"}
                      <Arrow />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}

      {/* Amen — the last bead: seal the day */}
      <li
        ref={(el) => {
          rowRefs.current[AMEN] = el;
        }}
        className="relative grid grid-cols-[2.25rem_1fr] gap-3 sm:grid-cols-[2.75rem_1fr] sm:gap-4"
      >
        <Cord index={AMEN} last reached={open >= AMEN} nextReached={false}>
          <Bead
            reached={open >= AMEN}
            active={open === AMEN}
            done={sealed}
            tone="accent"
            onClick={() => go(AMEN)}
            glow={sealed}
          >
            {sealed ? <Check /> : <Icon name="flame" size={15} />}
          </Bead>
        </Cord>

        <div className="min-w-0 pb-2">
          <button
            type="button"
            onClick={() => go(AMEN)}
            className="flex w-full items-center gap-2 py-1 text-left"
          >
            <span className={`eyebrow ${sealed ? "text-accent" : "text-muted"}`}>
              Amen
            </span>
          </button>

          <div
            className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open === AMEN ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div
                className={`relative overflow-hidden rounded-2xl border p-6 text-center transition-colors ${
                  sealed
                    ? "border-accent/40 bg-accent/[0.08]"
                    : "border-border bg-surface"
                }`}
              >
                {/* the bloom of light when the day is sealed */}
                {bloom && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/40"
                    style={{ animation: "seal-bloom 1.5s ease-out forwards" }}
                  />
                )}
                <p className="relative font-serif text-2xl leading-snug text-ink">
                  {sealed ? "Worship kept today." : "The altar is ready."}
                </p>
                <p className="relative mx-auto mt-2 max-w-sm font-mono text-xs leading-relaxed text-muted">
                  {sealed
                    ? "The household walked this together. Grace upon grace — come again tomorrow."
                    : sealPrompt}
                </p>

                {canSeal ? (
                  <button
                    type="button"
                    onClick={seal}
                    disabled={pending}
                    className={`relative mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-medium transition-all disabled:opacity-50 ${
                      sealed
                        ? "border border-accent/50 bg-transparent text-accent hover:bg-accent/10"
                        : "bg-accent text-on-accent hover:bg-accent-deep hover:shadow-lg hover:shadow-accent/20"
                    }`}
                  >
                    {sealed ? "Kept — undo" : "Seal today’s worship"}
                    {!sealed && <Arrow />}
                  </button>
                ) : (
                  <p className="relative mt-4 font-mono text-xs text-muted">
                    {sealed
                      ? "The household kept worship today."
                      : "A parent or guardian seals the household’s worship."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </li>

      <style>{`
        @keyframes seal-bloom {
          0% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(24); opacity: 0; }
        }
      `}</style>
    </ol>
  );
}

/** One vertical cord segment behind a bead, lit up to where you've walked. */
function Cord({
  index,
  last,
  reached,
  nextReached,
  children,
}: {
  index: number;
  last: boolean;
  reached: boolean;
  nextReached: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex justify-center">
      {/* segment above the bead */}
      {index > 0 && (
        <span
          aria-hidden
          className={`absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 ${
            reached
              ? "bg-gradient-to-b from-accent2 to-accent"
              : "bg-border"
          }`}
        />
      )}
      {/* segment below the bead */}
      {!last && (
        <span
          aria-hidden
          className={`absolute bottom-0 left-1/2 top-8 w-px -translate-x-1/2 ${
            nextReached ? "bg-accent/70" : "bg-border"
          }`}
        />
      )}
      {children}
    </div>
  );
}

function Bead({
  reached,
  active,
  done,
  tone,
  glow = false,
  onClick,
  children,
}: {
  reached: boolean;
  active: boolean;
  done: boolean;
  tone: "accent" | "accent2";
  glow?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const ring =
    tone === "accent2"
      ? "ring-[color-mix(in_srgb,var(--accent2)_45%,transparent)]"
      : "ring-[color-mix(in_srgb,var(--accent)_45%,transparent)]";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "step" : undefined}
      className={`relative z-10 mt-[1.15rem] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
        reached
          ? tone === "accent2"
            ? "border-accent2/50 bg-accent2/15 text-accent2"
            : "border-accent/50 bg-accent/15 text-accent"
          : "border-border bg-surface text-muted"
      } ${active ? `ring-4 ${ring} scale-110` : "hover:scale-105"} ${
        glow ? "animate-pulse-soft" : ""
      }`}
    >
      {done && !active ? <Check /> : children}
    </button>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
