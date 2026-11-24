"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { keepMoodCheck } from "@/app/health/mood/actions";
import {
  MOOD_OPTIONS,
  MOOD_QUESTIONS,
  MOOD_STEM,
  moodResult,
  scoreMood,
  type MoodPhase,
  type MoodResult,
} from "@/lib/mood-check";
import { MoodResultView } from "@/components/health/mood/MoodResultView";

/**
 * The mood check, to answer — lib/mood-check.ts.
 *
 * Her answers are added up here, on her phone. Nothing is sent anywhere
 * unless she then presses "Keep this result"; until she does, closing the
 * page leaves no trace of having taken it.
 */
export function MoodCheckForm({ phase, voice }: { phase: MoodPhase; voice: string | null }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<(number | null)[]>(() => MOOD_QUESTIONS.map(() => null));
  const [result, setResult] = useState<MoodResult | null>(null);
  const [kept, setKept] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const missing = answers.findIndex((a) => a === null);
  const answered = answers.filter((a) => a !== null).length;

  function finish() {
    if (missing >= 0) {
      setError("One or more questions are not answered yet.");
      document.getElementById(`mood-q-${missing}`)?.scrollIntoView({ block: "center" });
      return;
    }
    setError(null);
    setResult(moodResult(scoreMood(answers as number[]), phase, voice));
    setTimeout(() => document.getElementById("mood-result-top")?.scrollIntoView({ block: "start" }), 0);
  }

  function again() {
    setAnswers(MOOD_QUESTIONS.map(() => null));
    setResult(null);
    setKept(false);
    setError(null);
  }

  if (result) {
    return (
      <div id="mood-result-top" className="scroll-mt-24">
        <MoodResultView r={result} />
        <div className="mt-4 rounded-xl border border-border bg-bg/40 p-4">
          {kept ? (
            <p className="prose-serif-sm text-ink" role="status">
              Kept, for you only. It is in the list below, where you can remove it or show it to your doctor.
            </p>
          ) : (
            <>
              <p className="prose-serif-sm text-ink">This result has not been saved or sent anywhere.</p>
              <p className="mt-1 prose-serif-xs text-muted">
                Keep it if you would like to compare next time, or to show your doctor. Only you will be able to see it.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    start(async () => {
                      setError(null);
                      const res = await keepMoodCheck(answers);
                      if (!res.ok) setError(res.error);
                      else {
                        setKept(true);
                        router.refresh();
                      }
                    })
                  }
                  className="inline-flex min-h-11 items-center rounded-lg border border-accent/60 px-4 font-mono text-xs text-accent hover:bg-accent/[0.06] disabled:opacity-50"
                >
                  {pending ? "Keeping…" : "Keep this result"}
                </button>
              </div>
            </>
          )}
          {error && <p className="mt-2 prose-serif-xs text-negative">{error}</p>}
          <button
            type="button"
            onClick={again}
            className="mt-2 inline-flex min-h-11 items-center font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-accent"
          >
            Clear my answers
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        finish();
      }}
    >
      <p className="max-w-prose font-serif text-lg text-ink">{MOOD_STEM}</p>
      <ol className="mt-4 space-y-5">
        {MOOD_QUESTIONS.map((q, i) => (
          <li key={i} id={`mood-q-${i}`} className="scroll-mt-24">
            <fieldset>
              <legend className="max-w-prose prose-serif-sm font-medium text-ink">
                <span className="mr-1.5 font-mono text-xs text-muted">{i + 1}.</span>
                {q}
              </legend>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {MOOD_OPTIONS.map((o, v) => {
                  const on = answers[i] === v;
                  return (
                    <label
                      key={o}
                      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 ${on ? "border-accent bg-accent/[0.06]" : "border-border"}`}
                    >
                      <input
                        type="radio"
                        name={`mood-${i}`}
                        checked={on}
                        onChange={() => {
                          setError(null);
                          setAnswers((a) => a.map((x, j) => (j === i ? v : x)));
                        }}
                        className="h-4 w-4 shrink-0 accent-[var(--accent)]"
                      />
                      <span className="prose-serif-sm text-ink">{o}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
      {error && <p className="mt-4 prose-serif-xs text-negative">{error}</p>}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-mono text-xs text-on-accent">
          See what my answers come to
        </button>
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          {answered} of {MOOD_QUESTIONS.length} answered
        </p>
      </div>
    </form>
  );
}
