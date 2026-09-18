"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { DraftTextarea } from "@/components/ui/DraftTextarea";
import { Pressable } from "@/components/ui/Pressable";
import { type LetterReplyItem } from "@/lib/letter-replies";
import { replyToLetter, deleteLetterReply } from "@/app/letters/reply-actions";

/**
 * Writing back to a letter, in words.
 *
 * A letter had a row of emoji under it and nothing else. An emoji is the right
 * weight for "I have seen this" and the wrong one for answering it — somebody
 * who reads a letter written to them and wants to say something back was
 * being handed a heart and shown the door. So this is the door.
 *
 * ── Why it is closed until you ask for it ────────────────────────────────
 * The box is not sitting open under every letter. A letter is meant to be
 * read, and a page of letters each with an empty textarea under it reads like
 * a comment section, which is the one thing these rooms are not. So a letter
 * with no replies shows one quiet line — "Write back" — and the box appears
 * when somebody means to use it.
 *
 * ── Why there is no optimistic append ────────────────────────────────────
 * Taps are optimistic in this app; writing is not. A reaction that fails can
 * be put back with nobody much the poorer, but words are not a toggle: showing
 * somebody's letter as sent and then quietly removing it is worse than the
 * half-second it takes the server to say yes. The same reason the letter form
 * itself waits. What the box does guarantee is that the words survive — every
 * keystroke is kept on the device, and cleared only on a save that worked.
 */
export function LetterReplies({
  letterId,
  replies,
  viewerId,
  /** What to call somebody whose name we do not have. */
  fallbackName = "Someone",
}: {
  letterId: string;
  replies: LetterReplyItem[];
  viewerId: string;
  fallbackName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="mt-3 border-t border-border/70 pt-3">
      {replies.length > 0 && (
        <ul className="space-y-2.5">
          {replies.map((r) => (
            <li key={r.id} className="flex gap-2.5">
              {/* A hairline down the side, the way a quoted answer is marked
                  in a letter rather than in a chat app. */}
              <span
                aria-hidden
                className="mt-1 w-px shrink-0 self-stretch bg-border"
              />
              <div className="min-w-0 flex-1">
                <p className="whitespace-pre-wrap prose-serif-sm text-ink">
                  {r.body}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                  <span>
                    {r.authorId === viewerId
                      ? "You"
                      : r.authorName?.trim() || fallbackName}
                  </span>
                  <span aria-hidden>·</span>
                  <span>
                    {new Date(r.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {r.authorId === viewerId && (
                    <Remove replyId={r.id} onFail={setFailed} />
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {open ? (
        <form
          ref={formRef}
          action={async (fd) => {
            const body = String(fd.get("body") ?? "");
            setFailed(null);
            const res = await replyToLetter(letterId, body);
            if (res.ok) {
              // Only on success — resetting is what clears the kept draft, and
              // throwing the words away on a failure is the exact thing the
              // draft is there to prevent. See components/ui/DraftTextarea.
              formRef.current?.reset();
              setOpen(false);
            } else {
              setFailed("That didn’t send. Your words are still here — try again?");
            }
          }}
          className={replies.length > 0 ? "mt-3 space-y-2" : "space-y-2"}
        >
          <DraftTextarea
            draftKey={`letter-reply:${letterId}`}
            id={`letter-reply-${letterId}`}
            name="body"
            rows={3}
            required
            maxLength={2000}
            autoFocus
            placeholder="Write back…"
            showRestoredNote={false}
            className="w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <Send />
            <Pressable
              type="button"
              onClick={() => {
                setOpen(false);
                setFailed(null);
              }}
              className="rounded-lg px-2 py-1.5 font-mono text-[0.68rem] uppercase tracking-widest text-muted"
            >
              Not now
            </Pressable>
          </div>
        </form>
      ) : (
        <Pressable
          type="button"
          onClick={() => setOpen(true)}
          className={`rounded-lg font-mono text-[0.68rem] uppercase tracking-widest text-muted transition-colors hover:text-accent ${
            replies.length > 0 ? "mt-3 block" : "block"
          }`}
        >
          {replies.length > 0 ? "Add to this" : "Write back"}
        </Pressable>
      )}

      {failed && (
        <p role="status" className="mt-2 prose-serif-xs text-muted">
          {failed}
        </p>
      )}
    </div>
  );
}

function Send() {
  const { pending } = useFormStatus();
  return (
    <Pressable
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-3 py-1.5 font-mono text-xs font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
    >
      {pending ? "Sending…" : "Send"}
    </Pressable>
  );
}

/**
 * Taking your own words back.
 *
 * Two taps, because there is no undo behind it and a letter thread is not a
 * place to lose something by brushing the screen. Only ever shown on your own
 * reply; the server checks the same thing again.
 */
function Remove({
  replyId,
  onFail,
}: {
  replyId: string;
  onFail: (message: string | null) => void;
}) {
  const [armed, setArmed] = useState(false);
  const [going, setGoing] = useState(false);

  return (
    <Pressable
      type="button"
      disabled={going}
      // The letter itself has a "Remove" a few lines above this one, and on
      // that page they read identically — to a screen reader, two buttons
      // called Remove, one of which throws away the letter and everything
      // under it. Say which is which.
      aria-label={armed ? "Yes, remove your reply" : "Remove your reply"}
      onClick={async () => {
        if (!armed) {
          setArmed(true);
          return;
        }
        setGoing(true);
        onFail(null);
        const res = await deleteLetterReply(replyId);
        if (!res.ok) {
          setGoing(false);
          setArmed(false);
          onFail("That didn’t come back off. Try again?");
        }
        // On success the page revalidates and this row goes with it.
      }}
      className="rounded font-mono text-[0.62rem] uppercase tracking-widest text-muted underline decoration-border underline-offset-2 hover:text-accent disabled:opacity-50"
    >
      {going ? "Removing…" : armed ? "Sure?" : "Remove"}
    </Pressable>
  );
}
