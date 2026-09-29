"use client";

import { useState, useTransition } from "react";
import { Pressable } from "@/components/ui/Pressable";
import { addItem, previewLink } from "@/app/registry/actions";
import {
  ITEM_KINDS,
  KIND_COPY,
  NOTE_MAX,
  PRICE_MAX,
  QUANTITY_MAX,
  TITLE_MAX,
  type ItemKind,
} from "@/lib/registry";

const field =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";
const label =
  "mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted";

/**
 * Putting something on the list.
 *
 * ── Why the link comes first ─────────────────────────────────────────────
 * The way a person actually does this is: they are standing in a shop's app,
 * they press share, they paste. So the first thing here is a box to paste
 * into, and everything else fills itself in — name, picture, price — from
 * whatever the shop says about its own page.
 *
 * What comes back is a suggestion and is shown as one. Those tags are written
 * for social networks and are often wrong, sometimes comically so, so every
 * field is editable before anything is saved and nothing is saved until she
 * presses the button. A registry with the wrong name on a cot is worse than
 * one she typed by hand.
 *
 * ── The four kinds ───────────────────────────────────────────────────────
 * A thing, a hand, money towards something, and a whole list.
 *
 * "A hand" is the reason this is Oyun's registry rather than a copy of
 * somebody else's: a week of meals is the most useful thing anybody gives a
 * new mother, and no shop sells it.
 *
 * "Money towards it" only appears once she has said where money can be sent
 * — see components/registry/PayDetails.tsx. It is a card with a purpose on
 * it, not a payment: people send to her directly and nothing passes through
 * this app.
 *
 * "A whole list" recognises a pasted Amazon wishlist and offers to put it on
 * as one card rather than pretending to know what is inside it — see
 * lib/link-preview.ts for why it does not go rummaging.
 */
export function AddItem({ takesMoney }: { takesMoney: boolean }) {
  const [kind, setKind] = useState<ItemKind>("THING");
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mostNeeded, setMostNeeded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [readUrl, setReadUrl] = useState<string | null>(null);
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reading, startReading] = useTransition();
  const [saving, startSaving] = useTransition();

  const copy = KIND_COPY[kind];

  function clear() {
    setLink("");
    setTitle("");
    setNote("");
    setPrice("");
    setQuantity(1);
    setMostNeeded(false);
    setImageUrl(null);
    setReadUrl(null);
    setSaid(null);
    setError(null);
  }

  function read() {
    const raw = link.trim();
    if (!raw) return;
    setError(null);
    setSaid(null);
    startReading(async () => {
      const p = await previewLink(raw);
      setReadUrl(p.url);
      if (p.title && !title.trim()) setTitle(p.title);
      if (p.price && !price.trim()) setPrice(p.price);
      setImageUrl(p.imageUrl);
      // A wishlist is a list. Say so and switch, rather than quietly adding
      // somebody's whole Amazon list as though it were one sleepsuit.
      if (p.wholeList && kind === "THING") {
        setKind("LIST");
        setSaid("That looks like a whole list, so it will go on as one card.");
      } else if (p.failed) {
        setSaid(p.failed);
      } else if (p.title) {
        setSaid("Read from the shop — change anything that is wrong.");
      }
    });
  }

  function save() {
    const name = title.trim();
    if (!name) {
      setError("What is it called?");
      return;
    }
    setError(null);
    startSaving(async () => {
      const res = await addItem({
        kind,
        title: name,
        note,
        price,
        quantity,
        mostNeeded,
        url: readUrl ?? link.trim() ?? undefined,
        imageUrl: imageUrl ?? undefined,
      });
      if (res.ok) clear();
      else setError(res.error);
    });
  }

  const busy = reading || saving;

  return (
    <div className="surface-premium rounded-2xl border border-border p-5 md:p-6">
      <div className="mb-4 flex flex-wrap gap-1.5">
        {/* "Money towards it" only appears once there is somewhere for the
            money to go. A card that asks for money and cannot say where to
            send it is a dead end dressed up as a gift. */}
        {ITEM_KINDS.filter((k) => k !== "CASH" || takesMoney).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-full px-3 py-1.5 font-mono text-[0.68rem] transition-colors ${
              kind === k
                ? "bg-accent text-on-accent"
                : "border border-border text-muted hover:text-ink"
            }`}
          >
            {KIND_COPY[k].label}
          </button>
        ))}
      </div>

      <p className="mb-4 prose-serif-sm text-muted">{copy.blurb}</p>

      {kind !== "HELP" && kind !== "CASH" && (
        <div className="mb-4">
          <label htmlFor="registry-link" className={label}>
            {kind === "LIST" ? "The list's address" : "Link from the shop"}
          </label>
          <div className="flex gap-2">
            <input
              id="registry-link"
              type="url"
              inputMode="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onBlur={read}
              placeholder="https://…"
              className={field}
            />
            <Pressable
              type="button"
              onClick={read}
              disabled={busy || !link.trim()}
              className="shrink-0 rounded-lg border border-border px-3 py-2.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
            >
              {reading ? "Reading…" : "Read"}
            </Pressable>
          </div>
          {said && (
            <p role="status" className="mt-2 prose-serif-xs text-muted">
              {said}
            </p>
          )}
        </div>
      )}

      {imageUrl && (
        <div className="mb-4 flex items-center gap-3">
          {/* A background rather than an <img>: this URL came from somebody
              else's server and may well be gone by Tuesday. A background that
              fails shows an empty square; an <img> that fails shows a broken
              icon on a page a guest is reading. */}
          <span
            aria-hidden
            className="h-16 w-16 shrink-0 rounded-lg border border-border bg-bg bg-cover bg-center"
            style={{ backgroundImage: `url(${JSON.stringify(imageUrl)})` }}
          />
          <button
            type="button"
            onClick={() => setImageUrl(null)}
            className="font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-2 hover:text-accent"
          >
            No picture
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="registry-title" className={label}>
            What it is
          </label>
          <input
            id="registry-title"
            value={title}
            maxLength={TITLE_MAX}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={copy.placeholder}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="registry-note" className={label}>
            A word about it <span className="normal-case">(optional)</span>
          </label>
          <textarea
            id="registry-note"
            value={note}
            rows={2}
            maxLength={NOTE_MAX}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              kind === "HELP"
                ? "Any evening that suits you — we will be home."
                : kind === "CASH"
                  ? "Anything towards it helps. Truly, nothing is expected."
                  : "Size 0–3 months. Any colour but white."
            }
            className={`${field} resize-none`}
          />
        </div>

        {kind !== "LIST" && (
          <div className="flex flex-wrap gap-4">
            {(kind === "THING" || kind === "CASH") && (
              <div className="min-w-[8rem] flex-1">
                <label htmlFor="registry-price" className={label}>
                  {kind === "CASH" ? "A suggested amount" : "About how much"}
                </label>
                <input
                  id="registry-price"
                  value={price}
                  maxLength={PRICE_MAX}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={kind === "CASH" ? "Any amount at all" : "AED 249"}
                  className={field}
                />
              </div>
            )}
            <div className={kind === "CASH" ? "hidden" : "w-28"}>
              <label htmlFor="registry-quantity" className={label}>
                How many
              </label>
              <input
                id="registry-quantity"
                type="number"
                min={1}
                max={QUANTITY_MAX}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className={field}
              />
            </div>
          </div>
        )}

        <label className="flex items-center gap-2.5 font-mono text-[0.68rem] text-muted">
          <input
            type="checkbox"
            checked={mostNeeded}
            onChange={(e) => setMostNeeded(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          One of the things we most need
        </label>
      </div>

      {error && <p className="mt-3 prose-serif-xs text-negative">{error}</p>}

      <div className="mt-5 flex items-center gap-3">
        <Pressable
          type="button"
          onClick={save}
          disabled={busy || !title.trim()}
          className="btn-primary rounded-lg px-5 py-2.5 font-mono text-sm font-medium text-on-accent disabled:opacity-40"
        >
          {saving ? "Adding…" : "Add to the list"}
        </Pressable>
        {(title || link || note) && (
          <Pressable
            type="button"
            onClick={clear}
            className="rounded-lg px-2 py-2 font-mono text-[0.68rem] uppercase tracking-widest text-muted hover:text-ink"
          >
            Clear
          </Pressable>
        )}
      </div>
    </div>
  );
}
