"use client";

import { useState, useTransition } from "react";
import { Pressable } from "@/components/ui/Pressable";
import { claim, release, revealPayDetails } from "@/app/r/[slug]/actions";
import {
  GUEST_NAME_MAX,
  GUEST_NOTE_MAX,
  KIND_COPY,
  remaining,
  type ItemKind,
} from "@/lib/registry";
import type { PublicItem } from "@/lib/registry-db";

const field =
  "w-full rounded-lg border border-border bg-bg px-3 py-2.5 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

/**
 * One thing on the list, as a guest sees it.
 *
 * ── What a guest is told about the other guests ──────────────────────────
 * That a thing is taken, and nothing whatever else. Not who took it, not how
 * much they spent, not what else they took. A registry that shows the names
 * turns a gift into a competition, and the friend who can only manage the
 * muslin squares should not have to read that somebody else bought the cot.
 *
 * ── Why the form is two fields and both optional ─────────────────────────
 * Somebody has opened a link their cousin sent them and is standing in a
 * queue. The button should be the whole interaction. A name is asked for
 * because a mother writing fourteen thank-you notes would rather have one
 * than a blank — and it is never required, because some people give quietly
 * and that is theirs to choose.
 */
export function GuestItem({
  slug,
  item,
  closed,
}: {
  slug: string;
  item: PublicItem;
  closed: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  /** Fetched on a tap, never rendered with the page — see the note below. */
  const [pay, setPay] = useState<{
    label: string;
    details: string;
    note: string | null;
  } | null>(null);
  const [asking, startAsking] = useTransition();

  const copy = KIND_COPY[item.kind as ItemKind] ?? KIND_COPY.THING;
  const left = remaining(item.quantity, item.claimed);
  // Neither a whole list nor a fund is ever "taken": several people may give
  // towards the same cot, and several may buy from the same Amazon list.
  const gone = item.kind !== "LIST" && item.kind !== "CASH" && left <= 0;
  const taken = item.mine > 0;

  return (
    <div
      className={`surface-premium rounded-2xl border p-4 ${
        taken ? "border-accent/40 bg-accent/[0.04]" : "border-border"
      }`}
    >
      <div className="flex gap-3.5">
        {item.imageUrl && (
          // A background rather than an <img>: this picture is on a shop's
          // server, not ours, and a shop that takes it down should leave a
          // quiet empty square on a guest's screen, not a broken icon.
          <span
            aria-hidden
            className="h-20 w-20 shrink-0 rounded-lg border border-border bg-bg bg-cover bg-center"
            style={{ backgroundImage: `url(${JSON.stringify(item.imageUrl)})` }}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="prose-serif-sm font-medium text-ink">{item.title}</p>
            {item.mostNeeded && (
              <span className="rounded-full border border-accent/40 bg-accent/[0.08] px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-widest text-accent">
                Most needed
              </span>
            )}
            {item.kind === "HELP" && (
              <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-widest text-muted">
                Not a thing — a hand
              </span>
            )}
            {item.kind === "CASH" && (
              <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-widest text-muted">
                Money towards it
              </span>
            )}
          </div>

          {item.note && (
            <p className="mt-1 prose-serif-xs text-muted">{item.note}</p>
          )}

          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
            <Facts>
              {[
                item.price,
                item.kind !== "LIST" && item.kind !== "CASH" && item.quantity > 1 && !gone
                  ? `${left} still wanted`
                  : null,
                gone ? <span className="text-accent">Taken</span> : null,
                taken ? <span className="text-accent">{copy.claimed}</span> : null,
              ]}
            </Facts>
          </p>

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              // noreferrer as well as noopener: the shop has no business
              // being told which page sent this person, and that page is a
              // private link.
              rel="noopener noreferrer nofollow"
              className="mt-2 inline-block rounded-lg border border-border px-3 py-1.5 font-mono text-[0.62rem] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {item.kind === "LIST" ? "Open the list" : "See it at"}{" "}
              {shopName(item.url)} ↗
            </a>
          )}
        </div>
      </div>

      {/*
        ── Why the details are asked for rather than printed ────────────────
        These are somebody's bank details. Rendering them into the page would
        put them in front of everybody who ever opens the link, in every
        screenshot of it, and in whatever fetches the page to build a preview
        card. Fetched on a tap they reach only the people who meant to give.

        Anybody holding the link can still tap, and the family is told exactly
        that where they type them in. It is a smaller blast radius, not a wall,
        and the wording here does not pretend otherwise.
      */}
      {item.kind === "CASH" && (
        <div className="mt-3 border-t border-border/70 pt-3">
          {pay ? (
            <div className="rounded-xl border border-border bg-bg p-3">
              <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted">
                {pay.label}
              </p>
              <p className="mt-1.5 whitespace-pre-wrap break-words font-mono text-xs text-ink">
                {pay.details}
              </p>
              {pay.note && (
                <p className="mt-2 prose-serif-xs text-muted">{pay.note}</p>
              )}
              <p className="mt-2 prose-serif-xs text-muted">
                Send it to them directly — nothing is paid through this page.
              </p>
            </div>
          ) : (
            <Pressable
              type="button"
              disabled={asking}
              onClick={() =>
                startAsking(async () => {
                  const res = await revealPayDetails(slug);
                  if (res.ok) {
                    setPay({ label: res.label, details: res.details, note: res.note });
                  } else {
                    setError("They have not left a way to send money.");
                  }
                })
              }
              className="rounded-lg border border-border px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
            >
              {asking ? "One moment…" : "Show how to send"}
            </Pressable>
          )}
        </div>
      )}

      {error && <p className="mt-2 prose-serif-xs text-negative">{error}</p>}

      {!closed && (
        <div className="mt-3 border-t border-border/70 pt-3">
          {taken ? (
            <form
              action={async (fd) => {
                setError(null);
                const res = await release(fd);
                if (!res.ok) setError(res.error);
              }}
            >
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="itemId" value={item.id} />
              <Pressable
                press="none"
                type="submit"
                className="font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-accent"
              >
                Actually, I can&rsquo;t
              </Pressable>
            </form>
          ) : open ? (
            <form
              action={async (fd) => {
                setError(null);
                const res = await claim(fd);
                if (res.ok) setOpen(false);
                else setError(res.error);
              }}
              className="space-y-2.5"
            >
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="itemId" value={item.id} />
              {item.kind !== "LIST" && item.kind !== "CASH" && left > 1 && (
                <input
                  type="number"
                  name="quantity"
                  min={1}
                  max={left}
                  defaultValue={1}
                  aria-label="How many you are getting"
                  className={`${field} w-28`}
                />
              )}
              <input
                name="name"
                maxLength={GUEST_NAME_MAX}
                placeholder="Your name (optional)"
                className={field}
              />
              <input
                name="note"
                maxLength={GUEST_NOTE_MAX}
                placeholder={
                  item.kind === "CASH"
                    ? "How much, if you want them to know (optional)"
                    : "A word for them (optional)"
                }
                className={field}
              />
              <div className="flex items-center gap-2">
                <Submit label={copy.claim} />
                <Pressable
                  press="none"
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted hover:text-ink"
                >
                  Not now
                </Pressable>
              </div>
            </form>
          ) : (
            <Pressable
              type="button"
              disabled={gone || pending}
              onClick={() => start(() => setOpen(true))}
              className="rounded-lg border border-border px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
            >
              {gone ? "Already taken" : copy.claim}
            </Pressable>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * A row of small facts with a dot between them.
 *
 * Built from an array rather than written out with separators in the markup,
 * because every one of these is optional — a price, a count, a state — and
 * hand-placed dots leave a leading "·" on the day the price is missing.
 */
function Facts({ children }: { children: (React.ReactNode | null | false)[] }) {
  const kept = children.filter(Boolean);
  if (kept.length === 0) return null;
  return (
    <>
      {kept.map((node, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>·</span>}
          {node}
        </span>
      ))}
    </>
  );
}

function Submit({ label }: { label: string }) {
  return (
    <Pressable
      type="submit"
      className="btn-primary rounded-lg px-4 py-2 font-mono text-xs font-medium text-on-accent"
    >
      {label}
    </Pressable>
  );
}

function shopName(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "the shop";
  }
}
