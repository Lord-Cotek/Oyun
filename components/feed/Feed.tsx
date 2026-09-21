"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ConfirmButton, ConfirmDialog } from "@/components/ui/Confirm";
import {
  SHRINK_OVER_BYTES,
  canShrink,
  posterFor,
  shrinkVideo,
  shrinkLeft,
  type PrepProgress,
} from "@/lib/video-prep";
import { randomId } from "@/lib/rand";
import {
  uploadToBlob,
  humanBytes,
  humanLeft,
  type UploadWatch,
} from "@/lib/blob-client";
import {
  POST_KINDS,
  KIND_LABEL,
  REACTIONS,
  type PostKind,
} from "@/lib/feed";
import type { FeedPost, MediaItem } from "@/lib/feed-query";
import { Lightbox } from "@/components/media/Lightbox";
import { Pressable } from "@/components/ui/Pressable";
import { ReactionRow } from "@/components/feed/ReactionRow";
import { mediaAlt } from "@/lib/alt";
import { FirstStep, FirstStepFocus } from "@/components/ui/FirstStep";
import { Avatar } from "@/components/ui/Avatar";
import { isIosNativeShell } from "@/lib/shell";
import { FAMILY_ONLY } from "@/lib/post-visibility";
import {
  ShareOutside,
  type SharePostFn,
  type RevokeShareFn,
  type HideHelloFn,
} from "@/components/feed/ShareOutside";

type CreateFn = (input: {
  kind: string;
  body: string;
  mediaUrls?: string[];
  /** One per mediaUrl, in the same order; "" where there is none. */
  posterUrls?: string[];
  familyOnly?: boolean;
}) => Promise<void>;
type AudienceFn = (input: {
  id: string;
  familyOnly: boolean;
}) => Promise<{ ok: boolean }>;
type EditFn = (input: {
  id: string;
  body: string;
  removeMedia?: boolean;
}) => Promise<void>;
type CommentFn = (input: { postId: string; body: string }) => Promise<void>;
type ReactFn = (input: { postId: string; kind: string }) => Promise<void>;
type ReactCommentFn = (input: {
  commentId: string;
  kind: string;
}) => Promise<void>;
type IdFn = (id: string) => Promise<void>;

interface Actions {
  onCreate: CreateFn;
  onEdit: EditFn;
  onDelete: IdFn;
  onComment: CommentFn;
  onDeleteComment: IdFn;
  onReact: ReactFn;
  onReactToComment: ReactCommentFn;
  /** Change who an existing post is for. See lib/post-visibility.ts. */
  onSetAudience: AudienceFn;
  /** Put one post on a link anybody can open. See lib/post-share.ts. */
  onSharePost: SharePostFn;
  onRevokeShare: RevokeShareFn;
  /** Take down a word that came in from outside. */
  onHideHello: HideHelloFn;
}

export function Feed({
  posts,
  canKeepToFamily,
  composerPlaceholder = "Share something with the family…",
  // A blank diary is the first thing a new house sees, so it gets one
  // particular thing to write rather than four categories to choose between.
  emptyLine = "Nothing here yet. The entries worth having in ten years are the ordinary ones — what somebody said, what you ate, who came round.",
  emptyAction = "Write down one thing that happened today",
  ...actions
}: {
  posts: FeedPost[];
  /**
   * Whether this viewer may keep a post to the family. Required rather than
   * defaulted: somebody in the circle must not be shown a switch that decides
   * who sees them, and a prop with a default is a prop somebody forgets.
   */
  canKeepToFamily: boolean;
  composerPlaceholder?: string;
  emptyLine?: string;
  emptyAction?: string;
} & Actions) {
  return (
    <div className="space-y-6">
      <Composer
        onCreate={actions.onCreate}
        placeholder={composerPlaceholder}
        canKeepToFamily={canKeepToFamily}
      />
      {posts.length === 0 ? (
        <div className="surface-premium rounded-2xl border border-border p-8">
          <FirstStep
            className="text-center [&>div]:flex [&>div]:justify-center"
            action={
              <FirstStepFocus htmlFor="composer-box">{emptyAction}</FirstStepFocus>
            }
          >
            {emptyLine}
          </FirstStep>
        </div>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.id} id={`post-${p.id}`} className="notif-target">
              <PostItem post={p} canKeepToFamily={canKeepToFamily} {...actions} />
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

/**
 * ── Why a half-written post is kept on disk ──────────────────────────────
 *
 * On an iPhone, an installed app that opens the CAMERA from a file input is
 * very often killed by iOS while the camera is up: the camera runs in the same
 * memory-limited process the app does, and iOS reclaims the memory by ending
 * the app. Coming back, it relaunches from scratch — which is exactly what
 * "it closed the app" looks like. The photo library does not do this, because
 * that picker runs in a process of its own.
 *
 * None of that is ours to fix; it is Apple's. What is ours is what survives
 * it. The words are written to disk as they are typed, so the app comes back
 * with the post still there instead of an empty box. The photograph itself
 * cannot be saved — a File dies with the process that held it — so we say so
 * plainly rather than letting somebody wonder where it went.
 */
const DRAFT_KEY = "composer:draft";
const CAMERA_KEY = "composer:camera-opened-at";
/** After this long a kept draft is stale and is dropped rather than restored. */
const DRAFT_TTL = 24 * 60 * 60 * 1000;
/** A relaunch this soon after the picker opened was almost certainly the kill. */
const CAMERA_WINDOW = 3 * 60 * 1000;

function readDraft(): { kind: PostKind; body: string } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as { kind: PostKind; body: string; at: number };
    if (!d?.body?.trim() || Date.now() - (d.at ?? 0) > DRAFT_TTL) return null;
    return { kind: d.kind ?? "UPDATE", body: d.body };
  } catch {
    return null;
  }
}


interface Picked {
  id: string;
  file: File;
  preview: string;
  isVideo: boolean;
  /**
   * Where it ended up, once it has gone up.
   *
   * Kept on the picked item rather than in a list of its own so that pressing
   * Share a second time — after one photograph out of five timed out on a
   * lift, a train, a hospital corridor — sends only the one that did not make
   * it. Re-uploading four photographs to retry a fifth is how a bad minute
   * becomes a bad ten minutes.
   */
  url?: string;
  /**
   * A still lifted from a video before it was sent.
   *
   * Made at pick time, not at send time, so the thumbnail on the composer is
   * already the right frame and the poster is ready the instant the upload
   * finishes. Undefined for photographs and for videos the browser could not
   * read a frame from.
   */
  poster?: Blob;
  /** Where the poster ended up. Empty string means "there isn't one". */
  posterUrl?: string;
}

/**
 * What is happening, while it happens.
 *
 * ── Why this exists at all ───────────────────────────────────────────────
 * An eighty-megabyte video off a modern phone — ten seconds of 4K at sixty
 * frames — takes minutes on a mobile connection, and every second of that
 * used to look exactly like a broken app: one word, "Uploading…", no number,
 * no bar, and no way out. Somebody watching that has no way to tell a working
 * upload from a dead one, and the reasonable thing to do is give up.
 *
 * So: a bar that moves, the size in megabytes so the wait makes sense, an
 * honest estimate once there is enough evidence for one, and a Stop that
 * stops. That is what every app people already use does, and the reason they
 * feel calm to use is not that they are faster — it is that they are legible.
 */
function UploadBar({
  watch,
  startedAt,
  onStop,
}: {
  watch: UploadWatch | null;
  startedAt: number;
  onStop: () => void;
}) {
  const pct = watch && watch.bytes > 0
    ? Math.min(100, Math.round((watch.loaded / watch.bytes) * 100))
    : 0;
  const left = watch
    ? humanLeft(watch.loaded, watch.bytes, Date.now() - startedAt)
    : null;

  return (
    <div className="mt-3 rounded-xl border border-border bg-bg p-3">
      <p
        role="status"
        aria-live="polite"
        className="mb-2 font-mono text-[0.68rem] text-ink"
      >
        {watch && watch.total > 1 ? `Sending ${watch.total} items — ` : "Sending — "}
        <span className="tabular-nums">{pct}%</span>
        {watch && watch.bytes > 0 && (
          <span className="text-muted"> of {humanBytes(watch.bytes)}</span>
        )}
      </p>
      {/* The bar carries the same number the line above says, so a screen
          reader gets one reading of it rather than two that disagree. */}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Upload progress"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Stop on the LEFT, deliberately. The floating button sits bottom-right
          on every screen in the app, and a stop button somebody has to reach
          around a floating circle for is a stop button at exactly the moment
          they are already frustrated. */}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onStop}
          className="shrink-0 rounded-lg border border-border px-3 py-1.5 font-mono text-[0.68rem] text-muted transition-colors hover:border-accent2 hover:text-accent2"
        >
          Stop
        </button>
        {(watch?.note || left) && (
          <p className="min-w-0 font-mono text-[0.62rem] leading-relaxed text-muted">
            {watch?.note ?? left}
          </p>
        )}
      </div>
    </div>
  );
}

function Composer({
  onCreate,
  placeholder,
  canKeepToFamily,
}: {
  onCreate: CreateFn;
  placeholder: string;
  canKeepToFamily: boolean;
}) {
  const [kind, setKind] = useState<PostKind>("UPDATE");
  /**
   * Who this one is for. It deliberately does NOT persist between posts: an
   * audience that stays where you last left it is how somebody writes for
   * everybody and quietly posts to half the house, or the reverse. Each post
   * is its own decision, and the default is the one the diary has always had.
   */
  const [familyOnly, setFamilyOnly] = useState(false);
  const [body, setBody] = useState("");
  const [picked, setPicked] = useState<Picked[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  /**
   * What is happening, in bytes.
   *
   * A button that says "Uploading…" and nothing else is indistinguishable
   * from a button that has died — which is exactly what an eighty-megabyte
   * video looked like, for two and a half minutes, with no way to tell and no
   * way to stop it. A bar that moves is the difference between waiting and
   * giving up.
   */
  const [watch, setWatch] = useState<UploadWatch | null>(null);
  /** Set only while a big clip is being made smaller. */
  const [shrinking, setShrinking] = useState<
    (PrepProgress & { name: string }) | null
  >(null);
  /** When this upload started, for an honest estimate of what is left. */
  const startedAt = useRef(0);
  /** The stop button's other half. Held so the X can reach it mid-flight. */
  const stopper = useRef<AbortController | null>(null);
  // Separate inputs for photos and video — a narrow, image-only accept is what
  // makes Android offer the Camera / Files chooser instead of the gallery.
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  /** Set when a kept draft came back, so we can say why it is there. */
  const [restored, setRestored] = useState<null | "draft" | "camera">(null);
  /** The installed iOS app, where "Take Photo" still ends the app. */
  const [iosApp, setIosApp] = useState(false);

  // Bring back anything the last run of the app was holding. In an effect, not
  // in the initial state, so the server and the first client render agree.
  useEffect(() => {
    setIosApp(isIosNativeShell());
    const draft = readDraft();
    if (!draft) return;
    setKind(draft.kind);
    setBody(draft.body);
    let why: "draft" | "camera" = "draft";
    try {
      const opened = Number(localStorage.getItem(CAMERA_KEY) ?? 0);
      if (opened && Date.now() - opened < CAMERA_WINDOW) why = "camera";
      localStorage.removeItem(CAMERA_KEY);
    } catch {
      /* private browsing — the draft still came back, which is the point */
    }
    setRestored(why);
  }, []);

  // Keep it current as it is typed. Cheap, and the alternative is losing it.
  useEffect(() => {
    try {
      if (body.trim()) {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ kind, body, at: Date.now() }),
        );
      } else {
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch {
      /* nothing to do; the composer still works, it just won't survive */
    }
  }, [kind, body]);

  // Back in the app with the picker closed and nothing taken: the flag has
  // done its job and must not make the NEXT launch claim a crash.
  useEffect(() => {
    const onShow = () => {
      if (document.visibilityState !== "visible") return;
      try {
        localStorage.removeItem(CAMERA_KEY);
      } catch {
        /* ignore */
      }
    };
    document.addEventListener("visibilitychange", onShow);
    return () => document.removeEventListener("visibilitychange", onShow);
  }, []);

  /** Open a picker, having noted that we did — see DRAFT_KEY above. */
  function openPicker(ref: React.RefObject<HTMLInputElement>) {
    try {
      localStorage.setItem(CAMERA_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setRestored(null);
    ref.current?.click();
  }

  function forgetDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(CAMERA_KEY);
    } catch {
      /* ignore */
    }
  }

  const busy = pending || uploading;
  const canSend = (!!body.trim() || picked.length > 0) && !busy;

  /**
   * Make a video smaller and lift a poster from it, before it goes anywhere.
   *
   * Runs at pick time, on purpose: it is the one moment the person is looking
   * at the screen and expecting something to happen. Doing it at Share would
   * add a silent pause between pressing the button and anything moving.
   *
   * Neither step is allowed to stop a post — see lib/video-prep. If the
   * browser cannot shrink, the original goes up; if it cannot draw a frame,
   * the video goes up without a poster and behaves exactly as it does today.
   */
  async function prepare(item: Picked) {
    if (!item.isVideo) return;

    if (item.file.size > SHRINK_OVER_BYTES && canShrink()) {
      setShrinking({ name: item.file.name, ratio: null, done: 0, total: 0 });
      const smaller = await shrinkVideo(item.file, {
        onProgress: (pr) => setShrinking({ name: item.file.name, ...pr }),
      });
      setShrinking(null);
      if (smaller) {
        setPicked((prev) =>
          prev.map((p) => {
            if (p.id !== item.id) return p;
            URL.revokeObjectURL(p.preview);
            return {
              ...p,
              file: smaller,
              preview: URL.createObjectURL(smaller),
            };
          }),
        );
        item = { ...item, file: smaller };
      }
    }

    const poster = await posterFor(item.file);
    if (poster) {
      setPicked((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, poster } : p)),
      );
    }
  }

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
        id: `${file.name}-${file.size}-${randomId()}`,
        file,
        preview: URL.createObjectURL(file),
        isVideo,
      });
    }
    setPicked((p) => [...p, ...next]);
    resetInputs();
    // One at a time: shrinking is heavy, and two at once on a phone is slower
    // than two in a row as well as being unreadable on the bar.
    void (async () => {
      for (const item of next) await prepare(item);
    })();
  }

  function resetInputs() {
    if (photoRef.current) photoRef.current.value = "";
    if (videoRef.current) videoRef.current.value = "";
  }

  /**
   * Take one out — including while it is going up.
   *
   * The X used to remove the thumbnail and nothing else: the upload carried
   * on in the background, invisibly, for as long as it took, and the button
   * still said "Uploading…" for a file that was no longer on the screen. A
   * control that looks like a stop button and is not one is worse than no
   * control at all, so this now stops the batch as well.
   *
   * Everything that already landed is kept, so pressing Share afterwards
   * sends the rest and not the lot.
   */
  function removeOne(id: string) {
    stopper.current?.abort();
    setPicked((p) => {
      const gone = p.find((x) => x.id === id);
      if (gone) URL.revokeObjectURL(gone.preview);
      return p.filter((x) => x.id !== id);
    });
  }

  /** Stop the upload, keep everything on screen. */
  function stopUpload() {
    stopper.current?.abort();
  }

  function clearAll() {
    stopper.current?.abort();
    picked.forEach((p) => URL.revokeObjectURL(p.preview));
    setPicked([]);
    resetInputs();
  }

  /**
   * Share it.
   *
   * ── What this used to do, and why the button stuck on "Uploading…" ──────
   * It ran its own `Promise.all` over every picked file, calling `upload`
   * directly. No deadline, so a socket that stopped answering — which on a
   * phone is a lift, a lift door, a hospital basement — hung for ever and the
   * button said "Uploading…" until the page was closed and the post lost. No
   * retry, so a blink cost the whole thing. No limit on how many were in
   * flight, so five request bodies sat in memory together. And `Promise.all`
   * rejects on the first failure, which threw away every photograph that had
   * already gone up along with the one that had not.
   *
   * All four of those were already solved in lib/blob-client.ts, which was
   * written for exactly this after fifty-three photographs stalled at
   * "52 of 53". This screen simply was not using it. Now it is: deadlines, a
   * second attempt, four at a time, and a failure that costs one photograph
   * rather than the evening.
   */
  async function submit() {
    if (!canSend) return;
    setError(null);

    // Where each one ended up this time round. Held here rather than read back
    // out of `picked`, because a state update set below has not been applied
    // by the time this function needs the list.
    const landed = new Map<string, string>();

    // Only what has not already gone up — see Picked.url.
    const remaining = picked.filter((p) => !p.url);
    if (remaining.length > 0) {
      const control = new AbortController();
      stopper.current = control;
      startedAt.current = Date.now();
      setUploading(true);
      setWatch(null);
      let outcome;
      try {
        outcome = await uploadToBlob(
          remaining.map((p) => p.file),
          "feed",
          {
            max: MAX_FILES,
            signal: control.signal,
            onOne: (i, url) => landed.set(remaining[i].id, url),
            onWatch: setWatch,
          },
        );
      } catch (err) {
        // Only thrown for "too many" — nothing was uploaded.
        stopper.current = null;
        setUploading(false);
        setWatch(null);
        setError(
          (err as Error)?.message ||
            "Something went wrong uploading. Please try again.",
        );
        return;
      }
      stopper.current = null;

      // Whatever landed is remembered before anything else happens, so a
      // failure below still leaves those photographs banked for the retry.
      if (landed.size > 0) {
        setPicked((prev) =>
          prev.map((p) => (landed.has(p.id) ? { ...p, url: landed.get(p.id) } : p)),
        );
      }

      setUploading(false);
      setWatch(null);

      if (outcome.cancelled) {
        // Stopped on purpose. Say nothing accusatory: what landed is banked,
        // the rest is still on screen, and Share picks up from here.
        return;
      }

      if (outcome.failed.length > 0) {
        // Nothing is posted and nothing is discarded: the words, the pictures
        // and the ones already sent all stay on the screen. Pressing Share
        // again retries only what is still missing.
        const n = outcome.failed.length;
        setError(
          `${n === 1 ? "One photo" : `${n} photos`} didn’t make it — your words and the rest are still here. Tap Share to try ${n === 1 ? "it" : "them"} again.`,
        );
        return;
      }
    }

    /**
     * The posters, sent after the media and never in its way.
     *
     * A poster is a 100 kB thumbnail for something that was just tens of
     * megabytes, so it costs nothing next to what has already gone. It is
     * also entirely expendable: if this fails the post still goes, with the
     * videos behaving exactly as they did before posters existed.
     */
    const withPosters = picked.filter((p) => p.poster && !p.posterUrl);
    const posterLanded = new Map<string, string>();
    if (withPosters.length > 0) {
      try {
        const out = await uploadToBlob(
          withPosters.map(
            (p) => new File([p.poster!], `${p.id}-poster.jpg`, { type: "image/jpeg" }),
          ),
          "feed",
          {
            max: MAX_FILES,
            onOne: (i, url) => posterLanded.set(withPosters[i].id, url),
          },
        );
        void out;
      } catch {
        // No poster is a cosmetic loss. Never a reason not to post.
      }
    }

    // Every picked item now has a url; send them in the order they were chosen.
    const sendable = picked
      .map((p) => ({ p, url: p.url ?? landed.get(p.id) }))
      .filter((x): x is { p: Picked; url: string } => !!x.url);
    const urls = sendable.map((x) => x.url);
    const posters = sendable.map(
      (x) => x.p.posterUrl ?? posterLanded.get(x.p.id) ?? "",
    );

    start(async () => {
      await onCreate({
        kind,
        body: body.trim(),
        mediaUrls: urls,
        posterUrls: posters,
        familyOnly,
      });
      setBody("");
      setKind("UPDATE");
      setFamilyOnly(false);
      setRestored(null);
      forgetDraft();
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
        id="composer-box"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-border bg-bg px-4 py-3 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />

      {picked.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {picked.map((p, i) => (
            <div
              key={p.id}
              className="relative aspect-square overflow-hidden rounded-lg border border-border"
            >
              {p.isVideo ? (
                <video
                  src={p.preview}
                  aria-label={`Video ${i + 1} of ${picked.length}, ready to post`}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.preview}
                  alt={`Photo ${i + 1} of ${picked.length}, ready to post`}
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
      {restored && (
        <div className="mt-3 flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/[0.06] p-3">
          <p className="min-w-0 flex-1 font-mono text-[0.68rem] leading-relaxed text-muted">
            {restored === "camera" ? (
              <>
                <span className="text-ink">The app closed</span> while the
                picker was open — nothing you did wrong. Your words were kept;
                the photograph wasn&rsquo;t, so it needs choosing again.
              </>
            ) : (
              <>
                <span className="text-ink">Picked up where you left off.</span>{" "}
                This was still unfinished from last time.
              </>
            )}
          </p>
          <button
            type="button"
            onClick={() => {
              setBody("");
              setKind("UPDATE");
              setRestored(null);
              forgetDraft();
            }}
            className="shrink-0 font-mono text-[0.62rem] uppercase tracking-widest text-muted hover:text-ink"
          >
            Discard
          </button>
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

      {iosApp && (
        <p className="mt-3 rounded-lg border border-border bg-bg/50 px-3 py-2 text-[0.62rem] leading-relaxed text-muted">
          In the app, choose{" "}
          <span className="text-ink">Photo Library</span>.{" "}
          <span className="text-ink">Take Photo</span> closes the app — a fault
          in the current build, fixed in the next one. Anything written is kept
          either way. Safari and the home-screen app are fine.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={busy || picked.length >= MAX_FILES}
            onClick={() => openPicker(photoRef)}
            className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-muted transition-colors hover:text-accent disabled:opacity-40"
          >
            <span aria-hidden className="text-sm leading-none">
              📷
            </span>
            {iosApp ? "Photo library" : "Photos"}
          </button>
          <button
            type="button"
            disabled={busy || picked.length >= MAX_FILES}
            onClick={() => openPicker(videoRef)}
            className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-muted transition-colors hover:text-accent disabled:opacity-40"
          >
            <span aria-hidden className="text-sm leading-none">
              🎥
            </span>
            Video
          </button>
        </div>
        {/* Who it is for, and then Share — in that order and side by side,
            because the audience is a decision about the post being written
            and the last thing read before publishing should be who it goes
            to. It sat with Photos and Video, which are attachments, and that
            put it in the wrong sentence. */}
        <div className="flex items-center gap-4">
          {canKeepToFamily && (
            <button
              type="button"
              id="composer-audience"
              onClick={() => setFamilyOnly((v) => !v)}
              aria-pressed={familyOnly}
              // The chip on an existing post below carries the same two words,
              // meaning the same thing about a different post. They are far
              // apart on the screen and read correctly there — but to anybody
              // hearing the page rather than seeing it they were two identical
              // buttons, so this one says which post it is deciding.
              aria-label={
                familyOnly
                  ? "This post will be kept to the family. Share it with everyone here instead."
                  : "This post will be shared with everyone here. Keep it to the family instead."
              }
              className={`inline-flex items-center gap-1.5 font-mono text-[0.68rem] transition-colors ${
                familyOnly
                  ? "text-accent"
                  : "text-muted hover:text-accent"
              }`}
            >
              <span aria-hidden className="text-sm leading-none">
                {familyOnly ? "🔒" : "👪"}
              </span>
              {familyOnly ? FAMILY_ONLY.onLabel : FAMILY_ONLY.offLabel}
            </button>
          )}
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
      {shrinking && <ShrinkBar at={shrinking} />}
      {uploading && <UploadBar watch={watch} startedAt={startedAt.current} onStop={stopUpload} />}
      {familyOnly && (
        <p className="mt-2 font-mono text-[0.62rem] leading-relaxed text-muted">
          {FAMILY_ONLY.hint}
        </p>
      )}
    </div>
  );
}

/**
 * Changing who a post is for, afterwards.
 *
 * It sits with Edit and Delete rather than up in the header, because it is a
 * thing you do and those are the things you do. The header carries the state
 * — a "Family only" marker, and nothing at all on an ordinary post, since the
 * audience the diary has always had does not need announcing on every entry.
 *
 * Only ever on your own post, and only for somebody who has a family to
 * narrow it to. Narrowing takes effect at once, and cannot unsend: a
 * notification already read has been read. So the word is "keep", not "hide".
 */
function Audience({
  post,
  onSetAudience,
  busy,
}: {
  post: FeedPost;
  onSetAudience: AudienceFn;
  busy: boolean;
}) {
  const [pending, start] = useTransition();
  return (
    <Pressable
      press="none"
      type="button"
      disabled={pending || busy}
      onClick={() =>
        start(async () => {
          await onSetAudience({ id: post.id, familyOnly: !post.familyOnly });
        })
      }
      className="py-2.5 underline underline-offset-4 hover:text-accent disabled:opacity-50"
    >
      {pending
        ? "…"
        : post.familyOnly
          ? "Open to everyone"
          : "Keep to family"}
    </Pressable>
  );
}

function PostItem({
  post,
  canKeepToFamily,
  onEdit,
  onDelete,
  onComment,
  onDeleteComment,
  onReact,
  onReactToComment,
  onSetAudience,
  onSharePost,
  onRevokeShare,
  onHideHello,
}: { post: FeedPost; canKeepToFamily: boolean } & Actions) {
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.body);
  const [removeMedia, setRemoveMedia] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const hasMedia = post.media.length > 0;


  return (
    // `overflow-hidden` is what lets the photographs below reach the card's
    // edges without their corners poking out past its radius.
    <div className="surface-premium overflow-hidden rounded-2xl border border-border p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar name={post.author} photoUrl={post.authorImage} size={34} />
          <div className="flex min-w-0 flex-wrap items-center gap-2 font-mono text-[0.64rem] uppercase tracking-widest text-muted">
          <span className="text-ink/85">{post.author}</span>
          <span aria-hidden>·</span>
          <span>{post.when}</span>
          <span
            className="rounded-full border border-border px-2 py-0.5 text-[0.56rem] text-muted"
            // The chip says "Praise" or "Prayer"; the word is the marker.
            // A hue per kind meant four colours in one row of metadata.
          >
            {KIND_LABEL[post.kind] ?? "Update"}
          </span>
          {/* Who this one is for, said on the post itself rather than only in
              the composer that is long since gone. Somebody who chose a
              smaller audience three weeks ago should be able to see that it
              took, and the family reading it should know the circle is not.
              For whoever wrote it the marker is also the control. */}
          {post.familyOnly && (
            <span className="rounded-full border border-accent/40 bg-accent/[0.08] px-2 py-0.5 text-[0.56rem] text-accent">
              {FAMILY_ONLY.badge}
            </span>
          )}
          </div>
        </div>
      </div>

      {editing ? (
        <div className="mt-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 prose-serif-sm text-ink focus:border-accent focus:outline-none"
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
            <p className="mt-3 whitespace-pre-line prose-serif-sm text-ink/90">
              {post.body}
            </p>
          )}
          {hasMedia && (
            <MediaGallery
              bleed
              media={post.media}
              said={post.body}
              author={post.author}
              when={post.when}
            />
          )}
        </>
      )}

      {/* reactions — they move the moment you tap, and move back if the
          server never heard about it */}
      <ReactionRow
        reactions={post.reactions}
        onToggle={(kind) => onReact({ postId: post.id, kind })}
      />

      {/* ── Footer actions ───────────────────────────────────────────────
          `-my-2` on the row with `py-2.5` on each button: the words stay
          exactly the size they were, and the thing you can hit grows to 44pt.
          They were about sixteen pixels tall, which is fine with a mouse and a
          coin-flip with a thumb — and "Delete" being a coin-flip next to
          "Edit" is the wrong one to get wrong. The negative margin means the
          card does not grow to pay for it. */}
      <div className="-my-2 mt-1 flex flex-wrap items-center gap-3 font-mono text-[0.68rem] text-muted">
        <Pressable
          press="none"
          type="button"
          onClick={() => setShowComments((s) => !s)}
          className="py-2.5 underline underline-offset-4 hover:text-accent"
        >
          {post.comments.length > 0
            ? `${post.comments.length} ${post.comments.length === 1 ? "reply" : "replies"}`
            : "Reply"}
        </Pressable>
        {post.mine && (
          <>
            <Pressable
              press="none"
              type="button"
              onClick={() => setEditing(true)}
              className="py-2.5 underline underline-offset-4 hover:text-accent"
            >
              Edit
            </Pressable>
            {/* A dialog, not two taps: a post carries its photographs and
                videos with it, and the family came here to keep those. */}
            <Pressable
              press="none"
              type="button"
              disabled={pending}
              onClick={() => setRemoving(true)}
              className="py-2.5 underline underline-offset-4 hover:text-negative disabled:opacity-50"
            >
              Delete
            </Pressable>
            <ConfirmDialog
              open={removing}
              title="Delete this post?"
              body={
                post.media.length > 0
                  ? `The ${post.media.length === 1 ? "photograph or video" : `${post.media.length} photographs and videos`} on it go too, along with any replies. This cannot be undone.`
                  : "Any replies go with it, and this cannot be undone."
              }
              confirmWord="Delete it"
              busy={pending}
              onCancel={() => setRemoving(false)}
              onConfirm={() => start(() => onDelete(post.id))}
            />
            {canKeepToFamily && (
              <Audience
                post={post}
                onSetAudience={onSetAudience}
                busy={pending}
              />
            )}
          </>
        )}
        {/* Not inside `post.mine`: the household may share a post the other
            one wrote, which is the common case — she writes it, he sends it
            to his mother. The server decides; see FeedPost.canShare. */}
        {post.canShare && (
          <ShareOutside
            postId={post.id}
            live={post.share}
            hellos={post.hellos}
            onShare={onSharePost}
            onRevoke={onRevokeShare}
            onHideHello={onHideHello}
          />
        )}
      </div>

      {/* comments */}
      {(showComments || post.comments.length > 0) && (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          {post.comments.map((c) => (
            <div key={c.id}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-xs leading-relaxed text-ink/85">
                  <span className="text-muted">{c.author}</span> · {c.body}
                </p>
                {c.mine && (
                  <ConfirmButton
                    press="none"
                    disabled={pending}
                    describe="your reply"
                    onConfirm={async () => {
                      start(() => onDeleteComment(c.id));
                    }}
                    className="shrink-0 font-mono text-[0.62rem] text-muted underline underline-offset-4 hover:text-negative disabled:opacity-50"
                  />
                )}
              </div>
              <ReactionRow
                compact
                label="them"
                reactions={c.reactions}
                onToggle={(kind) => onReactToComment({ commentId: c.id, kind })}
              />
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Say something kind…"
              className="prose-serif-xs w-full rounded-lg border border-border bg-bg px-3 py-2 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
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

/**
 * `bleed` runs the photographs to the edges of the card that holds them,
 * cancelling its padding.
 *
 * A picture of your daughter inset inside a bordered box, inside another
 * bordered box, on a page of bordered boxes, is a thumbnail — it reads as an
 * attachment to the writing rather than as the thing itself. Every app people
 * actually look at photographs in does the opposite: the words are inset, the
 * picture is not. Only the caller inside a padded card asks for it, since the
 * negative margin has to match that card's padding exactly.
 */
function MediaGallery({
  media,
  said,
  author,
  when,
  bleed = false,
}: {
  media: MediaItem[];
  bleed?: boolean;
  /** What was written alongside — the best description of these we will get. */
  said?: string | null;
  author?: string | null;
  when?: string | null;
}) {
  const [at, setAt] = useState<number | null>(null);
  const single = media.length === 1;
  const alts = media.map((m, i) =>
    mediaAlt({
      said,
      author,
      when,
      index: i + 1,
      total: media.length,
      isVideo: m.type === "video",
    }),
  );

  return (
    <>
      <div
        className={`mt-3 grid gap-1.5 ${single ? "grid-cols-1" : "grid-cols-2"} ${
          bleed ? "-mx-5 md:-mx-6" : ""
        }`}
      >
        {media.map((m, i) => (
          <button
            key={`${m.url}-${i}`}
            type="button"
            onClick={() => setAt(i)}
            // An aria-label on the button replaces everything inside it, so
            // this — not the img alt below — is what a screen reader announces.
            // The description starts a sentence of its own, so it is lowered
            // when a verb is put in front of it.
            aria-label={`${m.type === "video" ? "Play" : "Open"} ${
              alts[i].charAt(0).toLowerCase() + alts[i].slice(1)
            }`}
            className={`group relative block w-full overflow-hidden transition-colors ${
              bleed ? "" : "rounded-xl border border-border hover:border-accent/50"
            } ${single ? "" : "aspect-square"}`}
          >
            {m.type === "video" ? (
              <>
                <video
                  src={m.url}
                  poster={m.poster}
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
                alt={alts[i]}
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
          alts={alts}
          index={at}
          onIndex={setAt}
          onClose={() => setAt(null)}
        />
      )}
    </>
  );
}

/**
 * What is happening while a big clip is being made smaller.
 *
 * ── Why this is said out loud ────────────────────────────────────────────
 * Shrinking runs at about the speed of the clip, so a two-minute video is
 * two minutes of the phone apparently doing nothing. Silence there would
 * read as a hang — which is exactly the complaint the uploading bar was
 * built to answer, and it would be a poor joke to reintroduce it one step
 * earlier in the same flow.
 *
 * It also says why, in one line, because "making this smaller so it sends
 * quickly" turns a wait into a reason.
 */
function ShrinkBar({ at }: { at: PrepProgress & { name: string } }) {
  const left = shrinkLeft(at);
  const pct = at.ratio === null ? null : Math.round(at.ratio * 100);
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-3 rounded-xl border border-border bg-bg/60 p-4"
    >
      <p className="font-mono text-xs text-ink">
        Making this video smaller so it sends quickly
        {pct !== null ? ` — ${pct}%` : "…"}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${pct ?? 8}%` }}
        />
      </div>
      <p className="mt-2 font-mono text-[0.62rem] leading-relaxed text-muted">
        {left ? `${left}. ` : ""}The original stays on your phone untouched.
      </p>
    </div>
  );
}
