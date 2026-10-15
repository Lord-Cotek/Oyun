"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { uploadOneToBlob } from "@/lib/blob-client";
import { useAttempt, type Attempted } from "@/lib/use-attempt";
import { Pressable } from "@/components/ui/Pressable";
import { Icon } from "@/components/ui/Icon";

/**
 * Choosing the photograph at the top of the home screen.
 *
 * The cover started out as "whatever was shared most recently", which is a
 * good default and a poor permanent answer: the first thing you see every
 * morning should not change because somebody posted a screenshot of a receipt.
 * So it can be pinned — and un-pinned, which matters just as much. Going back
 * to automatic is one tap and is offered plainly, because a setting you cannot
 * undo is a setting people are afraid to touch.
 *
 * Three ways to choose, in the order people actually want them:
 *
 *   A picture already here. Almost always what is wanted, and it costs no
 *   upload, no waiting and no data — on a phone on a poor signal that is the
 *   difference between a feature and a spinner.
 *
 *   A new photograph. Straight from the camera roll to blob storage, through
 *   the same path everything else in the app uses, so it is shrunk before it
 *   is sent and a failure says so rather than hanging.
 *
 *   Back to automatic, offered only once something is pinned.
 *
 * The change shows the moment it is tapped and rolls back if the server
 * refuses — see lib/use-attempt. Optimism with no way back would be worse
 * here than most places: a cover that looks changed but is not is something
 * you would only discover the next morning.
 */
export function CoverPicker({
  current,
  choices,
  action,
  label = "Cover",
}: {
  /** What is pinned now, or null when following the feed. */
  current: string | null;
  /** Photographs already in this house, newest first. */
  choices: string[];
  /** Bound server action. Returns `{ ok: false }` to refuse. */
  action: (url: string | null) => Promise<Attempted>;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState<string | null>(current);
  const [busy, setBusy] = useState(false);
  const [trouble, setTrouble] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { attempt, slipped, settled } = useAttempt();
  // A portal needs document, which the server has not got.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function choose(url: string | null) {
    const before = shown;
    settled();
    setTrouble(null);
    attempt(
      () => setShown(url),
      () => action(url),
      () => setShown(before),
      "That didn’t save. Tap again?",
    );
    setOpen(false);
  }

  async function onFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    setTrouble(null);
    try {
      const url = await uploadOneToBlob([file], "covers");
      if (url) choose(url);
    } catch (e) {
      setTrouble(
        e instanceof Error
          ? e.message
          : "That photo couldn’t upload. Try a smaller one?",
      );
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <>
      <Pressable
        press="control"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-black/35 px-4 font-serif text-sm backdrop-blur-sm on-band"
      >
        <Icon name="image" size={16} />
        {label}
      </Pressable>

      {(slipped || trouble) && (
        <p role="status" className="mt-2 font-serif text-sm italic on-band">
          {slipped ?? trouble}
        </p>
      )}

      {/* ── Portalled to <body>, and it has to be ────────────────────────
          This sheet is `position: fixed`, and it lives inside the hero, and
          the hero carries `animate-fade-up`. An ancestor with a transform
          becomes the containing block for fixed descendants — so "fixed to
          the bottom of the screen" quietly became "fixed to the bottom of the
          hero", and the sheet was drawn 280px above the top of the viewport.
          With two photographs it was short enough to land on screen anyway
          and looked merely odd; with ten it left the screen entirely.

          Measuring the box is what found it. It is the same trap as the one
          in Pressable — an animation that holds a transform changing what the
          CSS around it means — and the general answer for anything modal is
          to render it out of the tree it was declared in. */}
      {open &&
        mounted &&
        createPortal(
          <>
              {/* The scrim closes it, which is the gesture everybody tries first. */}
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[70] bg-black/45"
            />
            <div
              role="dialog"
              aria-label="Choose the cover photograph"
              className="fixed inset-x-0 bottom-0 z-[71] max-h-[78dvh] overflow-y-auto rounded-t-3xl border-t border-border bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            >
              {/* ── Pinned, so the way OUT of the grid never scrolls away ────
                  The grid is the tallest thing here and it grows with the
                  house. With seven or eight photographs it filled the sheet,
                  pushed "Upload a photo" off the top, and the feature read as
                  "you may choose one of these and nothing else" — the one house
                  with a single photograph was the only one where the button
                  stayed in view. A control that exists but cannot be found has
                  not been built. */}
              <div className="sticky top-0 z-10 -mx-5 -mt-5 border-b border-border bg-surface px-5 pb-4 pt-5">
                {/* A grabber, because a sheet that looks draggable is a sheet
                    people understand without being told. */}
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />

                <h2 className="font-serif text-xl text-ink">Cover photograph</h2>
                <p className="mt-1 font-serif text-sm italic text-muted">
                  {current
                    ? "Pinned. Choose another, or go back to following what is shared."
                    : "Following whatever was shared most recently. Pick one to pin it."}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-accent px-4 font-mono text-xs text-on-accent">
                    <Icon name="image" size={15} />
                    {busy ? "Uploading…" : "Upload a photo"}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={busy}
                      onChange={(e) => onFile(e.target.files)}
                    />
                  </label>

                  {current && (
                    <Pressable
                      press="control"
                      onClick={() => choose(null)}
                      className="inline-flex min-h-11 items-center rounded-full border border-border px-4 font-mono text-xs text-ink"
                    >
                      Follow the latest instead
                    </Pressable>
                  )}
                </div>
              </div>

              {choices.length > 0 ? (
                <>
                  <p className="mb-2 mt-5 font-serif text-sm italic text-muted">
                    Already here
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {choices.map((url) => {
                      const on = url === shown;
                      return (
                        <Pressable
                          key={url}
                          press="tile"
                          onClick={() => choose(url)}
                          aria-pressed={on}
                          // `bg-border/50` under the picture on purpose: a
                          // thumbnail whose image fails to load would otherwise
                          // be an invisible square, and an invisible square is
                          // still tappable — you would set the cover to a
                          // broken picture without ever seeing it.
                          className={`relative aspect-square overflow-hidden rounded-xl bg-border/50 bg-cover bg-center ring-2 ${
                            on ? "ring-accent" : "ring-transparent"
                          }`}
                          style={{ backgroundImage: `url("${encodeURI(url)}")` }}
                        >
                          {on && (
                            <span className="absolute bottom-1 right-1 rounded-full bg-accent px-1.5 py-0.5 font-mono text-[0.55rem] text-on-accent">
                              ✓
                            </span>
                          )}
                        </Pressable>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="mt-5 font-serif text-sm italic text-muted">
                  Nothing shared here yet — upload one, and it becomes the cover.
                </p>
              )}
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
