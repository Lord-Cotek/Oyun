"use client";

import { useRef, useState, useTransition } from "react";
import { Pressable } from "@/components/ui/Pressable";
import {
  setClosed,
  setShowClaims,
  setSharedWithCircle,
  updateRegistry,
} from "@/app/registry/actions";
import { HOST_MAX, MESSAGE_MAX, TITLE_MAX } from "@/lib/registry";

const field =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";
const label =
  "mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted";

/**
 * What the page says, whether she is surprised, and when it is finished.
 *
 * Folded away, because these are three decisions made once and the list is
 * what she came here for.
 */
export function RegistrySettings({
  title,
  hostName,
  message,
  showClaims,
  closed,
  sharedWithCircle,
  circleCount,
}: {
  title: string;
  hostName: string;
  message: string | null;
  showClaims: boolean;
  closed: boolean;
  /** Whether the list is already open to the people in this journey. */
  sharedWithCircle: boolean;
  /** How many people that is, so the button can say who it is telling. */
  circleCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="rounded-2xl border border-border bg-bg p-4">
      <Pressable
        press="none"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-1 text-left"
      >
        <span className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          How it reads, and when it ends
        </span>
        <span aria-hidden className="font-mono text-xs text-muted">
          {open ? "−" : "+"}
        </span>
      </Pressable>

      {open && (
        <div className="mt-4 space-y-5">
          <form
            ref={formRef}
            action={async (fd) => {
              setError(null);
              setSaid(null);
              const res = await updateRegistry(fd);
              if (res.ok) setSaid("Saved.");
              else setError(res.error);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="registry-name" className={label}>
                What the page is called
              </label>
              <input
                id="registry-name"
                name="title"
                defaultValue={title}
                maxLength={TITLE_MAX}
                required
                className={field}
              />
            </div>
            <div>
              <label htmlFor="registry-host" className={label}>
                Who it is from
              </label>
              <input
                id="registry-host"
                name="hostName"
                defaultValue={hostName}
                maxLength={HOST_MAX}
                required
                className={field}
              />
              <p className="mt-1.5 prose-serif-xs text-muted">
                However you want a guest to see you. Whatever you type here is
                all a stranger opening the link learns about you.
              </p>
            </div>
            <div>
              <label htmlFor="registry-message" className={label}>
                A word to whoever opens it
              </label>
              <textarea
                id="registry-message"
                name="message"
                defaultValue={message ?? ""}
                rows={3}
                maxLength={MESSAGE_MAX}
                placeholder="Thank you for thinking of us. Nothing here is expected — your prayers are the gift."
                className={`${field} resize-none`}
              />
            </div>
            <Save />
            {said && <p className="prose-serif-xs text-muted">{said}</p>}
            {error && <p className="prose-serif-xs text-negative">{error}</p>}
          </form>

          <div className="border-t border-border pt-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={!showClaims}
                disabled={pending || closed}
                onChange={(e) =>
                  start(() => setShowClaims(!e.target.checked).then(() => {}))
                }
                className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
              />
              <span>
                <span className="block font-mono text-[0.68rem] text-ink">
                  Keep it a surprise
                </span>
                <span className="mt-1 block prose-serif-xs text-muted">
                  You will see that something is spoken for, and not by whom,
                  until you finish the registry. Then the whole list appears —
                  you will want it for thank-yous.
                </span>
              </span>
            </label>
          </div>

          {/* ── The circle ───────────────────────────────────────────────
              Separate from the public link on purpose. The link is for
              whoever it is sent to; this is for the people already here,
              and it is the only notification any of them gets about a
              registry — see setSharedWithCircle. */}
          <div className="border-t border-border pt-4">
            <p className="prose-serif-xs text-muted">
              {sharedWithCircle
                ? "Your circle can see this list in Oyun. They were told once, when you opened it — and will not be pestered again as you add things."
                : circleCount > 0
                  ? `Open it to your circle and the ${circleCount} ${circleCount === 1 ? "person" : "people"} walking with you will find it in Oyun. They are told once, and never again as you add things.`
                  : "Nobody is in your circle yet. Invite someone first, and you can open the list to them here."}
            </p>
            <Pressable
              type="button"
              disabled={pending || closed || (!sharedWithCircle && circleCount === 0)}
              onClick={() =>
                start(() =>
                  setSharedWithCircle(!sharedWithCircle).then((r) => {
                    if (!r.ok) setError(r.error);
                  }),
                )
              }
              className="mt-3 rounded-lg border border-border px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {sharedWithCircle ? "Take it back from the circle" : "Open it to your circle"}
            </Pressable>
          </div>

          <div className="border-t border-border pt-4">
            <p className="prose-serif-xs text-muted">
              {closed
                ? "This registry is finished. The link still opens and still reads — it simply stops asking."
                : "When the shower is over and the baby is here, finish it. Nothing is deleted; the page stays as a record of who gave what."}
            </p>
            <Pressable
              type="button"
              disabled={pending}
              onClick={() => start(() => setClosed(!closed).then(() => {}))}
              className="mt-3 rounded-lg border border-border px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {closed ? "Open it again" : "Finish the registry"}
            </Pressable>
          </div>
        </div>
      )}
    </div>
  );
}

function Save() {
  return (
    <Pressable
      type="submit"
      className="btn-primary rounded-lg px-4 py-2 font-mono text-xs font-medium text-on-accent"
    >
      Save
    </Pressable>
  );
}
