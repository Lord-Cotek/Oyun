"use client";

import { useState, useTransition } from "react";
import { Pressable } from "@/components/ui/Pressable";
import { revealShipping } from "@/app/r/[slug]/actions";
import type { ShipReach } from "@/lib/registry";

type Address = {
  name: string | null;
  address: string;
  phone: string | null;
  note: string | null;
};

/**
 * "Where do I send it?", asked and answered.
 *
 * ── Why it is asked for rather than printed ──────────────────────────────
 * The same reasoning as the transfer details on a cash card, applied to
 * something worse: a home address rendered into the page would be in front of
 * everybody who ever opened the link, in every screenshot of it, in a
 * browser's saved copy and in whatever fetches the link to build a preview
 * card. Fetched on a tap it reaches the people who meant to post something.
 *
 * Who may tap at all is the family's choice and is enforced on the server —
 * see revealShipping. This component never decides; it renders what came
 * back, including the refusal.
 *
 * ── Two places, one component ────────────────────────────────────────────
 * `band` sits once near the top of the page, for the person who came to buy
 * and wants the address before they start. `inline` sits on a card somebody
 * has just taken, which is the moment they are standing at a checkout being
 * asked for it. Two moments, one set of rules.
 */
export function ShipReveal({
  slug,
  reach,
  tone = "band",
}: {
  slug: string;
  reach: ShipReach;
  tone?: "band" | "inline";
}) {
  const [found, setFound] = useState<Address | null>(null);
  const [refused, setRefused] = useState<"none" | "circle" | null>(null);
  const [asking, start] = useTransition();

  const ask = () =>
    start(async () => {
      const res = await revealShipping(slug);
      if (res.ok) {
        setFound({
          name: res.name,
          address: res.address,
          phone: res.phone,
          note: res.note,
        });
        setRefused(null);
      } else {
        setFound(null);
        setRefused(res.reason);
      }
    });

  // The family keeps it to their circle and this reader is not signed in as
  // one of them. Said before they tap as well as after, so nobody taps a
  // button twice wondering whether it is broken.
  const held = reach === "CIRCLE";

  const body = (
    <>
      {found ? (
        <div className="rounded-xl border border-border bg-bg p-3">
          <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted">
            Send it to
          </p>
          {found.name && (
            <p className="mt-1.5 prose-serif-sm text-ink">{found.name}</p>
          )}
          <p className="mt-1 whitespace-pre-wrap break-words prose-serif-sm text-ink">
            {found.address}
          </p>
          {found.phone && (
            <p className="mt-1.5 font-mono text-xs text-ink">{found.phone}</p>
          )}
          {found.note && (
            <p className="mt-2 prose-serif-xs text-muted">{found.note}</p>
          )}
        </div>
      ) : (
        <>
          <Pressable
            type="button"
            disabled={asking}
            onClick={ask}
            className={
              tone === "band"
                ? "inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-accent/50 px-4 font-mono text-sm text-accent transition-colors hover:bg-accent/[0.06] disabled:opacity-60 sm:w-auto"
                : "inline-flex min-h-11 items-center rounded-lg px-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-accent disabled:opacity-60"
            }
          >
            {asking ? "One moment…" : "Where to send it"}
          </Pressable>
          {/* Deliberately not a repeat of the line above the button: by the
              time somebody has tapped, they have read that once, and being
              told the same sentence again reads as a page that has not
              understood the question. This one says what to do next. */}
          {refused === "circle" && (
            <p className="mt-2 prose-serif-xs text-muted">
              Ask them for it and they will send it to you.
            </p>
          )}
          {refused === "none" && (
            <p className="mt-2 prose-serif-xs text-muted">
              They have not left an address.
            </p>
          )}
        </>
      )}
    </>
  );

  if (tone === "inline") {
    return <div className="mt-2">{body}</div>;
  }

  return (
    <section className="mt-8 rounded-2xl border border-border bg-bg p-4">
      <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
        Having something delivered
      </p>
      <p className="mb-3 mt-1.5 prose-serif-sm text-muted">
        {held
          ? "They post to an address they keep to the people walking with them."
          : "They have left an address for anything that comes by post."}
      </p>
      {body}
    </section>
  );
}
