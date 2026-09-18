"use client";

import { useState, useTransition } from "react";
import { Pressable } from "@/components/ui/Pressable";
import {
  moveItem,
  removeItem,
  setMostNeeded,
  updateItem,
} from "@/app/registry/actions";
import {
  KIND_COPY,
  NOTE_MAX,
  PRICE_MAX,
  QUANTITY_MAX,
  TITLE_MAX,
  remaining,
  type ItemKind,
} from "@/lib/registry";

export interface HostItem {
  id: string;
  kind: ItemKind;
  title: string;
  note: string | null;
  url: string | null;
  imageUrl: string | null;
  price: string | null;
  quantity: number;
  mostNeeded: boolean;
  claimed: number;
  /** Who has taken it, or null while she has asked to be surprised. */
  takers: { id: string; name: string | null; note: string | null }[] | null;
}

const field =
  "w-full rounded-lg border border-border bg-bg px-3 py-2 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

/**
 * The list, as she keeps it.
 *
 * Every row says three things: what it is, whether anybody has taken it, and
 * what she can do about it. The order matters — a mother opening this wants
 * to know what is still needed before she wants to know how to edit it.
 *
 * Most-needed rows float to the top, here and on the public page, because
 * "we genuinely need these three and the rest is lovely but optional" is the
 * single most useful thing a registry can say and every other registry buries
 * it under an alphabetical sort.
 */
export function ItemList({
  items,
  showClaims,
  closed,
}: {
  items: HostItem[];
  /** False while she has asked to be surprised — counts only, no names. */
  showClaims: boolean;
  closed: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={item.id}>
          <Row
            item={item}
            showClaims={showClaims}
            closed={closed}
            first={i === 0}
            last={i === items.length - 1}
          />
        </li>
      ))}
    </ul>
  );
}

function Row({
  item,
  showClaims,
  closed,
  first,
  last,
}: {
  item: HostItem;
  showClaims: boolean;
  closed: boolean;
  first: boolean;
  last: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [note, setNote] = useState(item.note ?? "");
  const [price, setPrice] = useState(item.price ?? "");
  const [quantity, setQuantity] = useState(item.quantity);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const left = remaining(item.quantity, item.claimed);

  return (
    <div className="surface-premium rounded-2xl border border-border p-4">
      <div className="flex gap-3.5">
        {item.imageUrl && (
          // A background, not an <img>: the picture lives on somebody else's
          // server and may be gone by Tuesday. A background that 404s is an
          // empty square; an <img> that 404s is a broken-image icon.
          <span
            aria-hidden
            className="h-16 w-16 shrink-0 rounded-lg border border-border bg-bg bg-cover bg-center"
            style={{ backgroundImage: `url(${JSON.stringify(item.imageUrl)})` }}
          />
        )}
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="space-y-2.5">
              <input
                value={title}
                maxLength={TITLE_MAX}
                onChange={(e) => setTitle(e.target.value)}
                className={field}
              />
              <textarea
                value={note}
                rows={2}
                maxLength={NOTE_MAX}
                onChange={(e) => setNote(e.target.value)}
                placeholder="A word about it"
                className={`${field} resize-none`}
              />
              <div className="flex gap-2">
                {item.kind === "THING" && (
                  <input
                    value={price}
                    maxLength={PRICE_MAX}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="About how much"
                    className={field}
                  />
                )}
                {item.kind !== "LIST" && (
                  <input
                    type="number"
                    min={1}
                    max={QUANTITY_MAX}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    className={`${field} w-24 shrink-0`}
                  />
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <p className="prose-serif-sm font-medium text-ink">{item.title}</p>
                {item.mostNeeded && (
                  <span className="rounded-full border border-accent/40 bg-accent/[0.08] px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-widest text-accent">
                    Most needed
                  </span>
                )}
                {item.kind !== "THING" && (
                  <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-widest text-muted">
                    {KIND_COPY[item.kind].label}
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
                    item.kind !== "LIST" && item.quantity > 1
                      ? `${item.quantity} wanted`
                      : null,
                    <Taken
                      key="taken"
                      item={item}
                      left={left}
                      showClaims={showClaims}
                    />,
                  ]}
                </Facts>
              </p>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-1 inline-block font-mono text-[0.62rem] text-muted underline underline-offset-2 hover:text-accent"
                >
                  {shopName(item.url)} ↗
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {error && <p className="mt-2 prose-serif-xs text-negative">{error}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
        {editing ? (
          <>
            <Pressable
              press="none"
              type="button"
              disabled={pending || !title.trim()}
              onClick={() =>
                start(async () => {
                  const res = await updateItem({
                    id: item.id,
                    title,
                    note,
                    price,
                    quantity,
                  });
                  if (res.ok) setEditing(false);
                  else setError(res.error);
                })
              }
              className="py-2 underline underline-offset-4 hover:text-accent disabled:opacity-50"
            >
              Save
            </Pressable>
            <Pressable
              press="none"
              type="button"
              onClick={() => {
                setEditing(false);
                setTitle(item.title);
                setNote(item.note ?? "");
                setPrice(item.price ?? "");
                setQuantity(item.quantity);
                setError(null);
              }}
              className="py-2 underline underline-offset-4 hover:text-ink"
            >
              Cancel
            </Pressable>
          </>
        ) : (
          !closed && (
            <>
              <Pressable
                press="none"
                type="button"
                onClick={() => setEditing(true)}
                className="py-2 underline underline-offset-4 hover:text-accent"
              >
                Edit
              </Pressable>
              <Pressable
                press="none"
                type="button"
                disabled={pending}
                onClick={() =>
                  start(() => setMostNeeded(item.id, !item.mostNeeded).then(() => {}))
                }
                className="py-2 underline underline-offset-4 hover:text-accent disabled:opacity-50"
              >
                {item.mostNeeded ? "Not urgent" : "Most needed"}
              </Pressable>
              {!first && (
                <Pressable
                  press="none"
                  type="button"
                  disabled={pending}
                  aria-label={`Move ${item.title} up`}
                  onClick={() => start(() => moveItem(item.id, "up").then(() => {}))}
                  className="py-2 underline underline-offset-4 hover:text-accent disabled:opacity-50"
                >
                  Up
                </Pressable>
              )}
              {!last && (
                <Pressable
                  press="none"
                  type="button"
                  disabled={pending}
                  aria-label={`Move ${item.title} down`}
                  onClick={() => start(() => moveItem(item.id, "down").then(() => {}))}
                  className="py-2 underline underline-offset-4 hover:text-accent disabled:opacity-50"
                >
                  Down
                </Pressable>
              )}
              <Pressable
                press="none"
                type="button"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const res = await removeItem(item.id);
                    if (!res.ok) setError(res.error);
                  })
                }
                className="py-2 underline underline-offset-4 hover:text-negative disabled:opacity-50"
              >
                Remove
              </Pressable>
            </>
          )
        )}
      </div>

      {/* Who, when she is allowed to know. The names are the whole point of
          keeping this: they are what thank-you notes are written from. */}
      {showClaims && item.takers && item.takers.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-border/70 pt-2.5">
          {item.takers.map((t) => (
            <li key={t.id} className="prose-serif-xs text-muted">
              <span className="text-ink">{t.name?.trim() || "Someone"}</span>
              {t.note ? ` — ${t.note}` : ""}
            </li>
          ))}
        </ul>
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

/** How much of this is spoken for, said the way a person would say it. */
function Taken({
  item,
  left,
  showClaims,
}: {
  item: HostItem;
  left: number;
  showClaims: boolean;
}) {
  if (item.kind === "LIST") {
    return item.claimed > 0 ? (
      <span className="text-accent">
        {item.claimed} {item.claimed === 1 ? "person has" : "people have"} taken
        something from it
      </span>
    ) : null;
  }
  if (item.claimed === 0) return <span>Nobody yet</span>;
  if (left === 0) {
    return (
      <span className="text-accent">
        {showClaims ? "Taken" : "Spoken for"}
      </span>
    );
  }
  return (
    <span className="text-accent">
      {item.claimed} of {item.quantity} taken
    </span>
  );
}

/** "amazon.ae", so a link says where it goes before anybody taps it. */
function shopName(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "the shop";
  }
}
