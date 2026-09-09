"use client";

import { useRef, useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import {
  POST_KINDS,
  KIND_LABEL,
  KIND_TONE,
  REACTIONS,
  type PostKind,
} from "@/lib/feed";
import type { FeedPost, MediaItem } from "@/lib/feed-query";
import { Lightbox } from "@/components/media/Lightbox";
import { Avatar } from "@/components/ui/Avatar";

type CreateFn = (input: {
  kind: string;
  body: string;
  mediaUrls?: string[];
}) => Promise<void>;
type EditFn = (input: {
  id: string;
  body: string;
  removeMedia?: boolean;
}) => Promise<void>;
type CommentFn = (input: { postId: string; body: string }) => Promise<void>;
type ReactFn = (input: { postId: string; kind: string }) => Promise<void>;
type IdFn = (id: string) => Promise<void>;

interface Actions {
  onCreate: CreateFn;
  onEdit: EditFn;
  onDelete: IdFn;
  onComment: CommentFn;
  onDeleteComment: IdFn;
  onReact: ReactFn;
}

export function Feed({
  posts,
  composerPlaceholder = "Share something with the family…",
  ...actions
}: { posts: FeedPost[]; composerPlaceholder?: string } & Actions) {
  return (
    <div className="space-y-6">
      <Composer onCreate={actions.onCreate} placeholder={composerPlaceholder} />
      {posts.length === 0 ? (
        <div className="surface-premium rounded-2xl border border-border p-8 text-center">
          <p className="font-mono text-sm leading-relaxed text-muted">
            Nothing shared yet. Be the first — a word, a praise, a prayer, a
            small moment worth keeping.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.id}>
              <PostItem post={p} {...actions} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Photos and videos use SEPARATE inputs with narrow accept lists — the pattern
// that makes Android show its Camera / Files chooser. A combined "image/*"
// (or image+video) input makes Android skip the chooser and open the gallery
// directly, which is exactly the bug this avoids. No `capture` attribute, so
// the chooser (not a forced camera) appears; the camera is one option in it.
const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const VIDEO_ACCEPT = "video/mp4,video/quicktime,video/webm,video/x-m4v,video/3gpp,video/*";
const MAX_FILES = 10;
const MAX_IMAGE_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB

interface Picked {
  id: string;
  file: File;
  preview: string;
  isVideo: boolean;
}

function Composer({
  onCreate,
  placeholder,
}: {
  onCreate: CreateFn;
  placeholder: string;
}) {
  const [kind, setKind] = useState<PostKind>("UPDATE");
  const [body, setBody] = useState("");
  const [picked, setPicked] = useState<Picked[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  // Separate inputs for photos and video — a narrow, image-only accept is what
  // makes Android offer the Camera / Files chooser instead of the gallery.
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();

  const busy = pending || uploading;
  const canSend = (!!body.trim() || picked.length > 0) && !busy;

  function addFiles(list: FileList | null) {
    setError(null);
    if (!list || list.length === 0) return;
    const next: Picked[] = [];
    for (const file of Array.from(list)) {
      if (picked.length + next.length >= MAX_FILES) {
        setError(`You can share up to ${MAX_FILES} at once.`);
        break;
      }
      const isVideo = file.type.startsWith("video/");
      const cap = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      if (file.size > cap) {
        setError(
          isVideo
            ? "That video is larger than 200 MB."
            : "That photo is larger than 25 MB.",
        );
        continue;
      }
      next.push({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
        preview: URL.createObjectURL(file),
        isVideo,
      });
    }
    setPicked((p) => [...p, ...next]);
    resetInputs();
  }

  function resetInputs() {
    if (photoRef.current) photoRef.current.value = "";
    if (videoRef.current) videoRef.current.value = "";
  }

  function removeOne(id: string) {
    setPicked((p) => {
      const gone = p.find((x) => x.id === id);
      if (gone) URL.revokeObjectURL(gone.preview);
      return p.filter((x) => x.id !== id);
    });
  }

  function clearAll() {
    picked.forEach((p) => URL.revokeObjectURL(p.preview));
    setPicked([]);
    resetInputs();
  }

  async function submit() {
    if (!canSend) return;
    setError(null);
    let urls: string[] = [];
    if (picked.length > 0) {
      setUploading(true);
      try {
        urls = await Promise.all(
          picked.map(async (p) => {
            const res = await upload(p.file.name, p.file, {
              access: "public",
              handleUploadUrl: "/api/blob/upload",
              contentType: p.file.type || undefined,
            });
            return res.url;
          }),
        );
      } catch (err) {
        setUploading(false);
        setError(
          (err as Error)?.message ||
            "Something went wrong uploading. Please try again.",
        );
        return;
      }
      setUploading(false);
    }
    start(async () => {
      await onCreate({ kind, body: body.trim(), mediaUrls: urls });
      setBody("");
      setKind("UPDATE");
      clearAll();
    });
  }

  return (
    <div className="surface-premium rounded-2xl border border-border p-5 md:p-6">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {POST_KINDS.map((k) => (
          <button
            key={k.kind}
            type="button"
            onClick={() => setKind(k.kind)}
            className={`rounded-full px-3 py-1.5 font-mono text-[0.68rem] transition-colors ${
              kind === k.kind
                ? "bg-accent text-on-accent"
                : "border border-border text-muted hover:text-ink"
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-border bg-bg px-4 py-3 font-mono text-sm leading-relaxed text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />

      {picked.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {picked.map((p) => (
            <div
              key={p.id}
              className="relative aspect-square overflow-hidden rounded-lg border border-border"
            >
              {p.isVideo ? (
                <video
                  src={p.preview}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.preview}
                  alt="To share"
                  className="h-full w-full object-cover"
                />
              )}
              {p.isVideo && (
                <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[0.55rem] text-white">
                  ▶ video
                </span>
              )}
              <button
                type="button"
                onClick={() => removeOne(p.id)}
                aria-label="Remove"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 font-mono text-xs text-white backdrop-blur hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      {error && (
        <p className="mt-2 font-mono text-[0.68rem] text-negative">{error}</p>
      )}

      {/* Photos — a narrow, image-only accept so Android offers the
          Camera / Files chooser rather than opening the gallery directly. */}
      {/* sr-only (not hidden/display:none): the input stays in the layout, so a
          programmatic click opens Android's Camera / Files chooser instead of a
          default handler like Google Photos. */}
      <input
        ref={photoRef}
        type="file"
        accept={PHOTO_ACCEPT}
        multiple
        className="sr-only"
        onChange={(e) => addFiles(e.target.files)}
      />
      {/* Video — its own input, kept separate from photos. */}
      <input
        ref={videoRef}
        type="file"
        accept={VIDEO_ACCEPT}
        multiple
        className="sr-only"
        onChange={(e) => addFiles(e.target.files)}
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={busy || picked.length >= MAX_FILES}
            onClick={() => photoRef.current?.click()}
            className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-muted transition-colors hover:text-accent disabled:opacity-40"
          >
            <span aria-hidden className="text-sm leading-none">
              📷
            </span>
            Photos
          </button>
          <button
            type="button"
            disabled={busy || picked.length >= MAX_FILES}
            onClick={() => videoRef.current?.click()}
            className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-muted transition-colors hover:text-accent disabled:opacity-40"
          >
            <span aria-hidden className="text-sm leading-none">
              🎥
            </span>
            Video
          </button>
        </div>
        <button
          type="button"
          disabled={!canSend}
          onClick={submit}
          className="btn-primary rounded-lg px-5 py-2.5 font-mono text-sm font-medium text-on-accent transition-transform active:scale-[0.98] disabled:opacity-40"
        >
          {uploading ? "Uploading…" : pending ? "Sharing…" : "Share"}
        </button>
      </div>
    </div>
  );
}

function PostItem({
  post,
  onEdit,
  onDelete,
  onComment,
  onDeleteComment,
  onReact,
}: { post: FeedPost } & Actions) {
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.body);
  const [removeMedia, setRemoveMedia] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const tone = KIND_TONE[post.kind] ?? "sky";
  const hasMedia = post.media.length > 0;

  return (
    <div className="surface-premium rounded-2xl border border-border p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar name={post.author} photoUrl={post.authorImage} size={34} />
          <div className="flex min-w-0 flex-wrap items-center gap-2 font-mono text-[0.64rem] uppercase tracking-widest text-muted">
          <span className="text-ink/85">{post.author}</span>
          <span aria-hidden>·</span>
          <span>{post.when}</span>
          <span
            className="rounded-full border px-2 py-0.5 text-[0.56rem]"
            style={{
              color: `var(--tone-${tone})`,
              borderColor: `color-mix(in srgb, var(--tone-${tone}) 40%, transparent)`,
            }}
          >
            {KIND_LABEL[post.kind] ?? "Update"}
          </span>
          </div>
        </div>
      </div>

      {editing ? (
        <div className="mt-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm leading-relaxed text-ink focus:border-accent focus:outline-none"
          />
          {hasMedia && (
            <label className="mt-2 flex items-center gap-2 font-mono text-[0.68rem] text-muted">
              <input
                type="checkbox"
                checked={removeMedia}
                onChange={(e) => setRemoveMedia(e.target.checked)}
                className="accent-[var(--accent)]"
              />
              Remove the {post.media.length > 1 ? "photos & videos" : "attachment"}
            </label>
          )}
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={pending || (!draft.trim() && !hasMedia)}
              onClick={() =>
                start(async () => {
                  await onEdit({
                    id: post.id,
                    body: draft.trim(),
                    removeMedia,
                  });
                  setEditing(false);
                  setRemoveMedia(false);
                })
              }
              className="btn-primary rounded-lg px-4 py-2 font-mono text-xs font-medium text-on-accent disabled:opacity-40"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setDraft(post.body);
                setRemoveMedia(false);
              }}
              className="rounded-lg px-3 py-2 font-mono text-xs text-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {post.body && (
            <p className="mt-3 whitespace-pre-line font-mono text-sm leading-relaxed text-ink/90">
              {post.body}
            </p>
          )}
          {hasMedia && <MediaGallery media={post.media} />}
        </>
      )}

      {/* reactions */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {REACTIONS.map((r) => {
          const mine = post.reactions.find((x) => x.kind === r.kind)?.mine;
          const count = post.reactions.find((x) => x.kind === r.kind)?.count ?? 0;
          return (
            <button
              key={r.kind}
              type="button"
              disabled={pending}
              onClick={() => start(() => onReact({ postId: post.id, kind: r.kind }))}
              aria-label={r.label}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-xs transition-colors disabled:opacity-50 ${
                mine
                  ? "border-accent/50 bg-accent/10 text-ink"
                  : "border-border text-muted hover:border-accent/40"
              }`}
            >
              <span aria-hidden>{r.glyph}</span>
              {count > 0 && <span className="text-[0.68rem]">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* footer actions */}
      <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[0.68rem] text-muted">
        <button
          type="button"
          onClick={() => setShowComments((s) => !s)}
          className="underline underline-offset-4 hover:text-accent"
        >
          {post.comments.length > 0
            ? `${post.comments.length} ${post.comments.length === 1 ? "reply" : "replies"}`
            : "Reply"}
        </button>
        {post.mine && (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="underline underline-offset-4 hover:text-accent"
            >
              Edit
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => start(() => onDelete(post.id))}
              className="underline underline-offset-4 hover:text-negative disabled:opacity-50"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* comments */}
      {(showComments || post.comments.length > 0) && (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          {post.comments.map((c) => (
            <div key={c.id} className="flex items-start justify-between gap-3">
              <p className="font-mono text-xs leading-relaxed text-ink/85">
                <span className="text-muted">{c.author}</span> · {c.body}
              </p>
              {c.mine && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => start(() => onDeleteComment(c.id))}
                  className="shrink-0 font-mono text-[0.62rem] text-muted underline underline-offset-4 hover:text-negative disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Say something kind…"
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && comment.trim()) {
                  e.preventDefault();
                  const text = comment.trim();
                  start(async () => {
                    await onComment({ postId: post.id, body: text });
                    setComment("");
                  });
                }
              }}
            />
            <button
              type="button"
              disabled={pending || !comment.trim()}
              onClick={() => {
                const text = comment.trim();
                start(async () => {
                  await onComment({ postId: post.id, body: text });
                  setComment("");
                });
              }}
              className="shrink-0 rounded-lg border border-border px-3 py-2 font-mono text-xs text-ink hover:border-accent disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MediaGallery({ media }: { media: MediaItem[] }) {
  const [at, setAt] = useState<number | null>(null);
  const single = media.length === 1;

  return (
    <>
      <div
        className={`mt-3 grid gap-1.5 ${single ? "grid-cols-1" : "grid-cols-2"}`}
      >
        {media.map((m, i) => (
          <button
            key={`${m.url}-${i}`}
            type="button"
            onClick={() => setAt(i)}
            aria-label={
              m.type === "video" ? "Play video" : `Open photo ${i + 1}`
            }
            className={`group relative block w-full overflow-hidden rounded-xl border border-border transition-colors hover:border-accent/50 ${
              single ? "" : "aspect-square"
            }`}
          >
            {m.type === "video" ? (
              <>
                <video
                  src={m.url}
                  muted
                  playsInline
                  preload="metadata"
                  className={
                    single
                      ? "max-h-[32rem] w-full object-cover"
                      : "h-full w-full object-cover"
                  }
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-black/55 text-xl text-white backdrop-blur-sm">
                    ▶
                  </span>
                </span>
              </>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.url}
                alt=""
                loading="lazy"
                className={`transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
                  single
                    ? "max-h-[32rem] w-full object-cover"
                    : "h-full w-full object-cover"
                }`}
              />
            )}
          </button>
        ))}
      </div>

      {at !== null && (
        <Lightbox
          items={media}
          index={at}
          onIndex={setAt}
          onClose={() => setAt(null)}
        />
      )}
    </>
  );
}
