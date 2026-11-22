"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SKIN_TONES, TONE_KEYS, type ToneKey } from "@/lib/growth-scene";
import { setSkinTone } from "@/app/journey/weeks/actions";

/** Five swatches: the baby's skin tone in every growth picture. */
export function SkinTonePicker({ value, chosen }: { value: ToneKey; chosen: boolean }) {
  const router = useRouter();
  const [current, setCurrent] = useState<ToneKey>(value);
  const [pending, start] = useTransition();
  return (
    <fieldset className="mt-4">
      <legend className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
        Baby&rsquo;s skin tone{!chosen && <span className="ml-2 normal-case tracking-normal text-accent">— choose one</span>}
      </legend>
      <div className="mt-2 flex flex-wrap items-center gap-2.5">
        {TONE_KEYS.map((k) => {
          const t = SKIN_TONES[k];
          const on = current === k;
          return (
            <button
              key={k}
              type="button"
              disabled={pending}
              aria-pressed={on}
              aria-label={t.label}
              title={t.label}
              onClick={() => {
                setCurrent(k);
                start(async () => {
                  await setSkinTone(k);
                  router.refresh();
                });
              }}
              className={`h-10 w-10 rounded-full border-2 transition-transform active:scale-95 ${on ? "scale-110 border-accent shadow-md" : "border-border"}`}
              style={{ background: `linear-gradient(135deg, ${t.skin[0][1]}, ${t.skin[1][1]} 55%, ${t.skin[2][1]})` }}
            />
          );
        })}
        <span className="font-mono text-[0.62rem] text-muted">{SKIN_TONES[current].label}</span>
      </div>
    </fieldset>
  );
}
