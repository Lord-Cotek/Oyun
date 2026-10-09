/**
 * What a page looks like while it is still being fetched.
 *
 * There was nothing at all: every route is a server component that waits for
 * its data, so tapping a tab left the previous screen sitting there with no
 * sign that anything had been heard. People read that as a dead button and tap
 * again. Next renders the nearest `loading.tsx` the instant a navigation
 * starts, so this is the difference between "nothing happened" and "it is
 * coming".
 *
 * Deliberately quiet: the shapes of the page in the page's own colours,
 * breathing rather than spinning. A spinner says "wait"; this says "here it
 * comes", which is truer and calmer, and calm is the whole voice of the app.
 *
 * Quiet, but not absent. The bars are a solid `--border` on a solid
 * `--surface` — 1.65:1, measured — because at half opacity on a half-opaque
 * card they came to 1.22:1 and simply could not be seen. A placeholder nobody
 * can see is the same as no placeholder at all.
 *
 * ── Why there is more than one shape ──────────────────────────────────────
 * Every room used to load as a hero and three identical cards, whatever it
 * actually was. That is a placeholder, not a preview: the feed arrived and
 * jumped, because a feed is not three cards; the liturgy arrived and jumped,
 * because a procession down a cord is not three cards either. The eye has
 * already started reading the layout by the time the data lands, and moving it
 * underneath them is the thing that makes an app feel unsteady.
 *
 * So each shape below is the geometry of a real room — the same widths, the
 * same gaps, the same number of things — and `shape` on PageSkeleton picks the
 * one this room is. When the content arrives it settles into the space that
 * was already held for it.
 */

function Bar({ w = "100%", h = "1rem" }: { w?: string; h?: string }) {
  return (
    <span
      aria-hidden
      className="block animate-pulse rounded bg-border motion-reduce:animate-none"
      style={{ width: w, height: h }}
    />
  );
}

/** A circle, for where a face or a bead goes. */
function Dot({ size = "2rem" }: { size?: string }) {
  return (
    <span
      aria-hidden
      className="block shrink-0 animate-pulse rounded-full bg-border motion-reduce:animate-none"
      style={{ width: size, height: size }}
    />
  );
}

/** The editorial hero every page opens with. */
export function HeroSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-8">
      <Bar w="7rem" h="0.6rem" />
      <div className="flex flex-col gap-2.5">
        <Bar w="90%" h="2rem" />
        <Bar w="62%" h="2rem" />
      </div>
      <div className="mt-1 flex flex-col gap-2">
        <Bar h="0.8rem" />
        <Bar w="85%" h="0.8rem" />
      </div>
    </div>
  );
}

/** A card of body text — the shape most rooms are made of. */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
      <Bar w="5.5rem" h="0.6rem" />
      {Array.from({ length: lines }).map((_, i) => (
        <Bar key={i} w={i === lines - 1 ? "70%" : "100%"} h="0.85rem" />
      ))}
    </div>
  );
}

/** A row of tiles, as on the home pages. */
export function TilesSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-28 flex-col justify-end gap-2 rounded-2xl border border-border bg-surface p-4"
        >
          <Bar w="60%" h="1rem" />
          <Bar w="40%" h="0.7rem" />
        </div>
      ))}
    </div>
  );
}

/**
 * Posts in the family feed: who wrote it, what they said, and — on some of
 * them — a photograph. The picture is the reason this needs its own shape; a
 * card skeleton holds nowhere near enough room for one, so the page used to
 * lurch downward the moment the first photo post arrived.
 */
export function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5"
        >
          <div className="flex items-center gap-3">
            <Dot size="2rem" />
            <div className="flex flex-col gap-1.5">
              <Bar w="7rem" h="0.8rem" />
              <Bar w="4rem" h="0.6rem" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Bar h="0.85rem" />
            <Bar w={i % 2 ? "58%" : "76%"} h="0.85rem" />
          </div>
          {/* Every other post carries a picture, which is about the rate they
              actually arrive at. */}
          {i % 2 === 0 && <Bar h="11rem" />}
          <div className="flex gap-1.5">
            <Bar w="3.2rem" h="1.6rem" />
            <Bar w="3.2rem" h="1.6rem" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * A list of people — the circle, the compound, the people of the house. A face
 * on the left, a name and a role beside it.
 */
export function RowsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
      <Bar w="5.5rem" h="0.6rem" />
      <ul className="flex flex-col gap-4 pt-1">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="flex items-center gap-3">
            <Dot size="2.25rem" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Bar w={`${6 + ((i * 3) % 5)}rem`} h="0.85rem" />
              <Bar w="3.5rem" h="0.6rem" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The liturgy rail: beads on a cord, one station open and the rest at rest.
 *
 * The geometry here is copied from LiturgyRail itself, not approximated — the
 * same `2.25rem 1fr` grid, the same `h-9 w-9` bead at the same `1.15rem` drop,
 * the same cord down the middle of the first column. That is the difference
 * between a placeholder and a preview: worship opens with the beads already in
 * the right place, and the readings fill in around them instead of shoving
 * them down the screen.
 */
export function RailSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ol className="relative">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="relative grid grid-cols-[2.25rem_1fr] gap-3 sm:grid-cols-[2.75rem_1fr] sm:gap-4"
        >
          <div className="relative flex justify-center">
            {/* the cord, above and below the bead */}
            {i > 0 && (
              <span
                aria-hidden
                className="absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 bg-border"
              />
            )}
            {i < count - 1 && (
              <span
                aria-hidden
                className="absolute bottom-0 left-1/2 top-8 w-px -translate-x-1/2 bg-border"
              />
            )}
            <span className="relative z-10 mt-[1.15rem]">
              <Dot size="2.25rem" />
            </span>
          </div>

          {/* One station is open and much taller than the rest. Holding that
              difference is the point — otherwise worship loads as an even
              stack and then shoves everything down as the reading appears. */}
          <div className={`min-w-0 ${i === 0 ? "pb-7" : "pb-4"}`}>
            <div className="py-1">
              <Bar w="5rem" h="0.7rem" />
            </div>
            {i === 0 && (
              <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
                <Bar w="92%" h="1.4rem" />
                <Bar w="70%" h="1.4rem" />
                <Bar w="8rem" h="0.6rem" />
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Dated rows: the diary, appointments, the days coming up. */
export function DatesSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
      <Bar w="5.5rem" h="0.6rem" />
      <ul className="flex flex-col gap-4 pt-1">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="flex items-start gap-4">
            <div className="flex w-14 shrink-0 flex-col gap-1">
              <Bar w="100%" h="0.75rem" />
              <Bar w="70%" h="0.6rem" />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Bar w={`${7 + ((i * 4) % 6)}rem`} h="0.85rem" />
              <Bar w="40%" h="0.6rem" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Which room this is, and therefore what shape to hold open for it. */
export type Shape = "cards" | "tiles" | "feed" | "rows" | "rail" | "dates";

/**
 * The whole page, assembled.
 *
 * `aria-busy` and the live region are what a screen reader needs; the shapes
 * are for everyone else.
 */
export function PageSkeleton({
  shape = "cards",
  cards = 2,
}: {
  shape?: Shape;
  cards?: number;
}) {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="mx-auto flex max-w-shell flex-col gap-6 px-6 py-10"
    >
      <span className="sr-only">Loading…</span>
      <HeroSkeleton />
      {shape === "tiles" && (
        <>
          <TilesSkeleton />
          {Array.from({ length: cards }).map((_, i) => (
            <CardSkeleton key={i} lines={i === 0 ? 4 : 3} />
          ))}
        </>
      )}
      {shape === "feed" && <FeedSkeleton />}
      {shape === "rows" && <RowsSkeleton />}
      {shape === "rail" && <RailSkeleton />}
      {shape === "dates" && <DatesSkeleton />}
      {shape === "cards" &&
        Array.from({ length: cards }).map((_, i) => (
          <CardSkeleton key={i} lines={i === 0 ? 4 : 3} />
        ))}
    </main>
  );
}
