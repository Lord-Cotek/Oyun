"use client";

import { useEffect, useRef, type TextareaHTMLAttributes } from "react";
import { useKeptDraft, RESTORED_NOTE } from "@/lib/use-draft";

/**
 * A writing box that survives the tab closing.
 *
 * Drop-in for a plain `<textarea>` inside a form: same name, same placeholder,
 * same styling. What it adds is that every keystroke is written to this device,
 * so a phone that kills the tab — a camera opening, a call coming in, a browser
 * reclaiming memory, a tab closed by accident at 11pm — costs nothing.
 *
 * Clearing
 * ────────
 * It listens for the form's own `reset` event, which is what every save path in
 * this app already fires on success. That is deliberate: nothing in here can
 * tell whether a save worked, and clearing on *submit* would throw the words
 * away precisely when the save failed, which is the case this exists for.
 *
 * So a form using this must call `form.reset()` when the write succeeds — and
 * must NOT call it when the write fails.
 */
export function DraftTextarea({
  draftKey,
  showRestoredNote = true,
  ...props
}: {
  /** Unique per box. Include the row id where a page has several. */
  draftKey: string;
  /** Suppress the "picked up where you left off" line in a tight space. */
  showRestoredNote?: boolean;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">) {
  const { value, setValue, clear, restored } = useKeptDraft(draftKey);
  const box = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const form = box.current?.form;
    if (!form) return;
    const onReset = () => clear();
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [clear]);

  return (
    <>
      <textarea
        {...props}
        ref={box}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {showRestoredNote && restored && (
        <p className="prose-serif-xs text-muted" role="status">
          {RESTORED_NOTE}
        </p>
      )}
    </>
  );
}
