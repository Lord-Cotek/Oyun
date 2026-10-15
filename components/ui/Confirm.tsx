"use client";

import { useEffect, useRef, useState } from "react";
import { Pressable, type Press } from "@/components/ui/Pressable";

/**
 * A button that will not throw something away on the first tap.
 *
 * ── The bug this exists to fix ───────────────────────────────────────────
 * Every Remove and Delete in this app fired the instant it was touched. A
 * thumb brushing the screen while scrolling a list of photographs deleted
 * one, silently and for good, and there was nothing to undo it with. In an
 * app whose whole purpose is keeping things — a scan photograph, a letter to
 * a child, a milestone written down once — that is the most expensive
 * possible bug, because the thing lost is the thing the family came for.
 *
 * One pattern existed, hand-written inside LetterReplies, and it was right.
 * This is that pattern made shared, hardened, and given to every destructive
 * control in both apps.
 *
 * ── Why two taps rather than a dialog ────────────────────────────────────
 * For the small things — a reply, a nudge, a line on a registry — a modal is
 * heavier than the act it guards. It steals the screen, it needs dismissing,
 * and people learn to swat it away without reading, which is how a
 * confirmation stops confirming anything. Arming in place keeps the thumb
 * where it already is, says what is about to happen in the word on the
 * button, and costs one deliberate tap.
 *
 * The genuinely irreversible things are different and get a dialog that
 * names what is going — see ConfirmDialog below.
 *
 * ── The part that actually stops accidents ───────────────────────────────
 * Not the second tap. A double-tap, or a tap that lands as the list settles
 * under a finger, fires twice in the same spot in well under two hundred
 * milliseconds, and a naive arm-then-confirm passes both straight through —
 * it feels safe and is not. So the confirm is dead for GUARD_MS after
 * arming. That window is far longer than a stray double-tap and far shorter
 * than anybody deliberately reaching back to the button.
 *
 * And it disarms itself after DISARM_MS. A button left sitting on "Sure?"
 * halfway down a page is a trap for whoever picks the phone up next.
 */

/** How long the confirm ignores taps after arming. A double-tap is ~150ms. */
const GUARD_MS = 450;

/** How long an armed button waits before going quiet again. */
const DISARM_MS = 5_000;

export function ConfirmButton({
  onConfirm,
  word = "Remove",
  sure = "Sure?",
  busyWord,
  describe,
  className = "",
  press = "control",
  disabled = false,
  onError,
}: {
  /**
   * What to do on the second, deliberate tap. Returning `{ ok: false }` or
   * throwing puts the button back the way it was and reports it — a delete
   * that silently did nothing is worse than one that says so.
   */
  onConfirm: () => Promise<{ ok: boolean } | void>;
  /** The resting label. */
  word?: string;
  /** The armed label. Keep it short; it replaces the word in place. */
  sure?: string;
  /** While it runs. Defaults to the word plus an ellipsis. */
  busyWord?: string;
  /**
   * What this removes, in a phrase — "your reply", "this photograph".
   *
   * Only for the screen reader, and it matters more than it looks: a page
   * often carries several buttons all called Remove, and without this they
   * are announced identically while doing entirely different damage.
   */
  describe: string;
  className?: string;
  press?: Press;
  disabled?: boolean;
  onError?: (message: string | null) => void;
}) {
  const [armed, setArmed] = useState(false);
  const [going, setGoing] = useState(false);
  const armedAt = useRef(0);

  // Disarm on its own, and clean up if the row is unmounted mid-countdown.
  useEffect(() => {
    if (!armed || going) return;
    const t = setTimeout(() => setArmed(false), DISARM_MS);
    return () => clearTimeout(t);
  }, [armed, going]);

  return (
    <Pressable
      type="button"
      press={press}
      disabled={disabled || going}
      aria-label={armed ? `Yes, remove ${describe}` : `Remove ${describe}`}
      className={className}
      onClick={async () => {
        if (!armed) {
          setArmed(true);
          armedAt.current = Date.now();
          return;
        }
        // The guard window. See the note above — this is the bit that works.
        if (Date.now() - armedAt.current < GUARD_MS) return;

        setGoing(true);
        onError?.(null);
        try {
          const res = await onConfirm();
          if (res && res.ok === false) {
            setGoing(false);
            setArmed(false);
            onError?.("That didn’t come off. Try again?");
          }
          // On success the page revalidates and this button goes with it.
        } catch {
          setGoing(false);
          setArmed(false);
          onError?.("That didn’t come off. Try again?");
        }
      }}
    >
      {going ? (busyWord ?? `${word}…`) : armed ? sure : word}
    </Pressable>
  );
}

/**
 * For the things that take other things with them.
 *
 * ── When this rather than the button above ───────────────────────────────
 * When somebody could reasonably not know what else is about to go. Removing
 * a child removes their whole record; removing somebody from the circle
 * takes away everything they can still see; deleting a post takes the
 * photographs on it. Two taps cannot say any of that, and a person who
 * understood only half of what they were agreeing to has not agreed.
 *
 * So this names the thing, in the family's own words, and lists what goes
 * with it.
 *
 * ── Why the safe choice is the one the keyboard lands on ─────────────────
 * Focus goes to Cancel, not to the red button. Somebody who opens this by
 * accident and hits Enter should end up exactly where they started, and
 * Escape does the same. The destructive button is never the default.
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmWord,
  onConfirm,
  onCancel,
  busy = false,
}: {
  open: boolean;
  /** Names the thing: "Remove Ade from the nursery?" */
  title: string;
  /** What goes with it, plainly. Say "cannot be undone" only when true. */
  body: string;
  confirmWord: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      // The backdrop cancels. It is the safe direction, so it is the one a
      // stray tap outside the card should take.
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-fade-up"
      >
        <p className="font-serif text-xl leading-snug text-ink">{title}</p>
        <p className="mt-2 prose-serif-sm text-muted">{body}</p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="min-h-11 rounded-lg border border-border px-4 font-mono text-sm text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            Keep it
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="min-h-11 rounded-lg bg-negative px-4 font-mono text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Removing…" : confirmWord}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * The same guard, for a plain `<form action={serverAction}>`.
 *
 * Most of the destructive controls in this app live in server components and
 * are a hidden input plus a submit button. They cannot hold the armed state
 * themselves, and rewriting each page into a client component to guard one
 * button would be a poor trade. This is the small client island that does it:
 * it takes the server action and the fields it needs, and either arms in
 * place or opens the dialog.
 */
export function ConfirmAction({
  action,
  fields,
  describe,
  word = "Remove",
  className = "",
  press = "none",
  dialog,
}: {
  action: (formData: FormData) => void | Promise<void>;
  /** The hidden inputs the action expects, by name. */
  fields: Record<string, string>;
  describe: string;
  word?: string;
  className?: string;
  press?: Press;
  /** Given, this opens a dialog naming what goes instead of arming in place. */
  dialog?: { title: string; body: string; confirmWord: string };
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const fire = () => {
    setBusy(true);
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) fd.set(k, v);
    void action(fd);
  };

  if (!dialog) {
    return (
      <ConfirmButton
        describe={describe}
        word={word}
        press={press}
        className={className}
        onConfirm={async () => {
          fire();
        }}
      />
    );
  }

  return (
    <>
      <Pressable
        type="button"
        press={press}
        onClick={() => setOpen(true)}
        aria-label={`Remove ${describe}`}
        className={className}
      >
        {word}
      </Pressable>
      <ConfirmDialog
        open={open}
        title={dialog.title}
        body={dialog.body}
        confirmWord={dialog.confirmWord}
        busy={busy}
        onCancel={() => setOpen(false)}
        onConfirm={fire}
      />
    </>
  );
}
