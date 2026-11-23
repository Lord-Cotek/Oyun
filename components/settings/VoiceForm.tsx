"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { VoicePicker } from "@/components/VoicePicker";
import { updateVoice } from "@/app/settings/actions";
import type { Voice } from "@/lib/voice";

/**
 * Settings: how Oyun speaks to you. Saved with a button rather than on tap,
 * because it changes words across the whole app and a stray tap on a phone
 * should not do that by itself.
 */
export function VoiceForm({ current }: { current: Voice }) {
  const router = useRouter();
  const [voice, setVoice] = useState<Voice>(current);
  const [saved, setSaved] = useState<Voice>(current);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function save() {
    setMessage(null);
    setError(null);
    start(async () => {
      const res = await updateVoice(voice);
      if (!res.ok) {
        setError(res.error ?? "That didn’t save. Please try again.");
        return;
      }
      setSaved(voice);
      setMessage(res.message ?? "Saved.");
      router.refresh();
    });
  }

  return (
    <div>
      <VoicePicker value={voice} onChange={setVoice} name="settings-voice" />
      <p className="mt-3 prose-serif-xs text-muted">
        Only for you. Others in your circle keep their own choice, and nothing anyone has written is changed.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending || voice === saved}
          className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-mono text-xs font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {message && <p className="font-mono text-xs text-positive" role="status">{message}</p>}
        {error && <p className="font-mono text-xs text-negative" role="alert">{error}</p>}
      </div>
    </div>
  );
}
