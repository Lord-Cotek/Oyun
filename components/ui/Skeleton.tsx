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
 */

function Bar({ w = "100%", h = "1rem" }: { w?: string; h?: string }) {
  return (
    <span
      aria-hidden
      className="block animate-pulse rounded bg-border/50 motion-reduce:animate-none"
      style={{ width: w, height: h }}
    />
  );
}

/** The editorial hero every page opens with. */
export function HeroSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/50 p-8">
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
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/50 p-6">
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
          className="flex h-28 flex-col justify-end gap-2 rounded-2xl border border-border bg-surface/50 p-4"
        >
          <Bar w="60%" h="1rem" />
          <Bar w="40%" h="0.7rem" />
        </div>
      ))}
    </div>
  );
}

/**
 * The whole page, assembled.
 *
 * `aria-busy` and the live region are what a screen reader needs; the shapes
 * are for everyone else.
 */
export function PageSkeleton({
  tiles = false,
  cards = 2,
}: {
  tiles?: boolean;
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
      {tiles && <TilesSkeleton />}
      {Array.from({ length: cards }).map((_, i) => (
        <CardSkeleton key={i} lines={i === 0 ? 4 : 3} />
      ))}
    </main>
  );
}
