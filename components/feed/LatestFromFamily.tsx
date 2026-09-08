import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { KIND_LABEL } from "@/lib/feed";
import type { FeedPost } from "@/lib/feed-query";

/**
 * A quiet "today" surface on the home page — the newest few things the family
 * has shared, so opening the app feels like life is happening, not like a
 * dashboard. Links through to the full feed.
 */
export function LatestFromFamily({
  posts,
  greeting,
}: {
  posts: FeedPost[];
  greeting?: string;
}) {
  return (
    <div className="surface-premium rounded-2xl border border-border p-6 md:p-7">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          {greeting && (
            <p className="font-serif text-lg leading-snug text-ink">{greeting}</p>
          )}
          <Eyebrow className={greeting ? "mt-1" : ""}>Latest from the family</Eyebrow>
        </div>
        <Link
          href="/family"
          className="shrink-0 font-mono text-[0.68rem] uppercase tracking-widest text-accent underline underline-offset-4 hover:text-accent-deep"
        >
          All →
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="font-mono text-sm leading-relaxed text-muted">
          Nothing shared yet.{" "}
          <Link
            href="/family"
            className="text-accent underline underline-offset-4"
          >
            Share the first thing →
          </Link>
        </p>
      ) : (
        <ul className="space-y-2.5">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href="/family"
                className="block rounded-xl border border-border bg-bg/50 p-4 transition-colors hover:border-accent/40"
              >
                <div className="mb-1 flex flex-wrap items-center gap-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                  <span className="text-ink/80">{p.author}</span>
                  <span aria-hidden>·</span>
                  <span>{p.when}</span>
                  <span className="text-accent">{KIND_LABEL[p.kind] ?? ""}</span>
                </div>
                <p className="line-clamp-2 font-mono text-sm leading-relaxed text-ink/90">
                  {p.body}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
