import Link from "next/link";

export type TaggedPost = { id: string; at: string; author: string; body: string; photo: string | null };

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The Life posts somebody is in, newest first — their story as the family
 * told it. Only posts the reader may already see reach this list; the page
 * that builds it applies the same rule as the diary.
 *
 * Shared with the sibling app and drift-checked.
 */
export function TaggedPosts({ name, posts }: { name: string; posts: TaggedPost[] }) {
  const first = name.trim() || "them";
  return (
    <section aria-label={`In Life with ${first}`}>
      <p className="eyebrow mb-3 text-muted">In Life</p>
      {posts.length === 0 ? (
        <p className="prose-serif-sm text-muted">
          Nothing yet. Tag {first} in a Life post — <span className="text-ink">Who&rsquo;s in this?</span> — and it
          gathers here.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/life/${p.id}`}
                className="flex items-start gap-3 rounded-xl border border-border bg-bg/50 p-3 transition-colors hover:border-accent/40"
              >
                {p.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                )}
                <span className="min-w-0">
                  <span className="block font-mono text-[0.62rem] text-muted">
                    {fmt(p.at)} · {p.author}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block prose-serif-xs text-ink">
                    {p.body || "A photo"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
