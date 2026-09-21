/**
 * Getting a video ready to send, in the browser, before it goes anywhere.
 *
 * Two jobs, and they are independent on purpose: a poster frame so the thing
 * looks like a video before anybody touches it, and — for the big ones only —
 * a smaller copy so it does not take three minutes to send.
 *
 * ── The size of the problem ──────────────────────────────────────────────
 * A modern phone shoots 4K60 at around 50 Mbps. Thirty seconds of that is
 * roughly 180 MB. On an ordinary home connection that is minutes of
 * uploading, and on the other end it is a file that has to be dragged down
 * before it will start playing. Re-encoded at 1080p it is nearer 15 MB, and
 * everything about it — sending, storing, watching — gets about ten times
 * easier.
 *
 * ── Why nothing here is allowed to fail loudly ───────────────────────────
 * Every function below returns null rather than throwing, and the caller is
 * written to carry on with the original file. Shrinking a video is a
 * nice-to-have; sending it is not. A browser that cannot do this must still
 * be able to share a clip of a baby's first steps, so every unsupported
 * API, every codec mismatch and every decode error ends the same way: use
 * what the family actually picked.
 */

/**
 * Over this, a video is worth shrinking. Under it, it is not.
 *
 * Twenty-five megabytes is roughly a ten-second 4K clip or a minute of
 * ordinary 1080p. Below that the upload is already quick, and re-encoding
 * would cost quality for a saving nobody would notice.
 */
export const SHRINK_OVER_BYTES = 25 * 1024 * 1024;

/**
 * What we shrink to.
 *
 * 1080p rather than 720p, deliberately. This is a family's record of a child
 * and it will be watched in ten years; the extra few megabytes are the
 * cheapest thing in the whole exchange. 4 Mbps is generous for 1080p from a
 * phone camera and leaves the result looking like the original on a phone
 * screen.
 */
const TARGET_LONG_EDGE = 1920;
const TARGET_BITS_PER_SECOND = 4_000_000;

/** Where in the clip the poster frame comes from. */
const POSTER_AT_SECONDS = 1;
const POSTER_LONG_EDGE = 960;
const POSTER_QUALITY = 0.72;

/** How long we will wait for a browser to do any one of these things. */
const METADATA_TIMEOUT_MS = 15_000;

export type PrepProgress = {
  /** 0–1, or null where the browser will not tell us. */
  ratio: number | null;
  /** Seconds of the clip done so far. */
  done: number;
  /** Seconds in the whole clip. */
  total: number;
};

/**
 * Can this browser make a smaller copy that is still an MP4?
 *
 * ── Why MP4 or nothing ───────────────────────────────────────────────────
 * Several browsers will happily record WebM instead, and a WebM lands on an
 * iPhone as a file that will not play. Producing something the grandmother
 * this was sent to cannot open is worse than sending the big original, so
 * the rule is simple: if the browser cannot give us H.264 in MP4, we do not
 * re-encode at all.
 */
export function canShrink(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof MediaRecorder === "undefined") return false;
  if (typeof HTMLCanvasElement === "undefined") return false;
  if (typeof HTMLCanvasElement.prototype.captureStream !== "function") {
    return false;
  }
  return MP4_TYPES.some((t) => {
    try {
      return MediaRecorder.isTypeSupported(t);
    } catch {
      return false;
    }
  });
}

const MP4_TYPES = [
  'video/mp4;codecs="avc1.4d002a,mp4a.40.2"',
  'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
  'video/mp4;codecs=avc1',
  "video/mp4",
];

function bestMp4Type(): string | null {
  for (const t of MP4_TYPES) {
    try {
      if (MediaRecorder.isTypeSupported(t)) return t;
    } catch {
      /* keep looking */
    }
  }
  return null;
}

/** A hidden <video> wound to a frame, with everything a phone needs to allow it. */
async function loadVideo(file: File): Promise<{
  el: HTMLVideoElement;
  url: string;
} | null> {
  const url = URL.createObjectURL(file);
  const el = document.createElement("video");
  // `muted` and `playsInline` are not preferences on iOS — without them the
  // browser refuses to play or even decode this at all outside a gesture.
  el.muted = true;
  el.playsInline = true;
  el.preload = "auto";
  el.crossOrigin = "anonymous";
  el.src = url;

  const ok = await new Promise<boolean>((resolve) => {
    const done = (v: boolean) => {
      clearTimeout(timer);
      el.removeEventListener("loadeddata", onLoad);
      el.removeEventListener("error", onErr);
      resolve(v);
    };
    const onLoad = () => done(true);
    const onErr = () => done(false);
    const timer = setTimeout(() => done(false), METADATA_TIMEOUT_MS);
    el.addEventListener("loadeddata", onLoad);
    el.addEventListener("error", onErr);
    el.load();
  });

  if (!ok || !el.videoWidth || !el.videoHeight) {
    URL.revokeObjectURL(url);
    return null;
  }
  return { el, url };
}

/** Fit a frame inside a long edge, keeping the shape and staying even. */
function fit(w: number, h: number, longEdge: number): { w: number; h: number } {
  const big = Math.max(w, h);
  const scale = big > longEdge ? longEdge / big : 1;
  // Even numbers: H.264 encoders reject odd dimensions, and some of them do
  // it by producing a file rather than an error.
  const even = (n: number) => Math.max(2, Math.round(n * scale / 2) * 2);
  return { w: even(w), h: even(h) };
}

/**
 * A still from the clip, for the poster.
 *
 * ── Why this matters more than it sounds ─────────────────────────────────
 * Without one, a video in a feed is a black rectangle until the browser has
 * fetched enough of it to draw a frame — which on a slow connection is
 * several seconds of a family's post looking broken. With one, the moment is
 * there immediately and the video loads underneath it.
 *
 * Taken a second in rather than at zero, because the first frame of a phone
 * video is very often black, or a blurred half-exposure while the camera is
 * still settling.
 */
export async function posterFor(file: File): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  const loaded = await loadVideo(file);
  if (!loaded) return null;
  const { el, url } = loaded;

  try {
    const at = Math.min(
      POSTER_AT_SECONDS,
      Number.isFinite(el.duration) && el.duration > 0 ? el.duration / 2 : 0,
    );
    const seeked = await new Promise<boolean>((resolve) => {
      const done = (v: boolean) => {
        clearTimeout(timer);
        el.removeEventListener("seeked", onSeek);
        el.removeEventListener("error", onErr);
        resolve(v);
      };
      const onSeek = () => done(true);
      const onErr = () => done(false);
      const timer = setTimeout(() => done(false), METADATA_TIMEOUT_MS);
      el.addEventListener("seeked", onSeek);
      el.addEventListener("error", onErr);
      try {
        el.currentTime = at;
      } catch {
        done(false);
      }
    });
    if (!seeked) return null;

    const size = fit(el.videoWidth, el.videoHeight, POSTER_LONG_EDGE);
    const canvas = document.createElement("canvas");
    canvas.width = size.w;
    canvas.height = size.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(el, 0, 0, size.w, size.h);

    return await new Promise<Blob | null>((resolve) => {
      try {
        canvas.toBlob((b) => resolve(b), "image/jpeg", POSTER_QUALITY);
      } catch {
        // A tainted canvas, which should not happen for a blob URL — but a
        // missing poster is a cosmetic loss and must never stop a post.
        resolve(null);
      }
    });
  } catch {
    return null;
  } finally {
    el.removeAttribute("src");
    el.load();
    URL.revokeObjectURL(url);
  }
}

/**
 * A smaller copy of a big clip.
 *
 * ── How, and why this way ────────────────────────────────────────────────
 * The video is played, hidden and muted, into a canvas at the smaller size,
 * and the canvas is recorded. It is the one route that works on both of the
 * browsers this app actually runs in: Safari does not implement
 * `HTMLMediaElement.captureStream`, so the obvious approach is out, but it
 * does implement `canvas.captureStream` and MediaRecorder with H.264.
 *
 * The cost is that it runs at the speed of the clip — a minute of video
 * takes about a minute to shrink. That is why it is only done above
 * SHRINK_OVER_BYTES, why the caller shows progress throughout, and why the
 * whole thing can be abandoned. Even so it is the better trade: a minute of
 * visible, cancellable work against several minutes of invisible uploading.
 *
 * Returns null — meaning "send the original" — for anything at all that goes
 * wrong, including a result that came out no smaller than what we started
 * with, which can happen with an already-compressed clip.
 */
export async function shrinkVideo(
  file: File,
  opts: {
    onProgress?: (p: PrepProgress) => void;
    signal?: AbortSignal;
  } = {},
): Promise<File | null> {
  if (!canShrink()) return null;
  const mimeType = bestMp4Type();
  if (!mimeType) return null;

  const loaded = await loadVideo(file);
  if (!loaded) return null;
  const { el, url } = loaded;

  let raf = 0;
  let audioCtx: AudioContext | null = null;

  try {
    const total =
      Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 0;
    const size = fit(el.videoWidth, el.videoHeight, TARGET_LONG_EDGE);

    /**
     * No guard on the source dimensions here, deliberately.
     *
     * The first version skipped anything already 1920 wide or less, on the
     * reasoning that there was nothing to scale down. That was the wrong
     * test: a clip only reaches this function because it is over
     * SHRINK_OVER_BYTES, and a 1080p file that large is large because of its
     * bitrate, not its size on screen — re-encoding it at 4 Mbps is exactly
     * the saving we are after. A 40 MB 1080p clip was being sent whole.
     *
     * What protects against pointless re-encoding is the check at the other
     * end: if the result is not meaningfully smaller, it is thrown away and
     * the original goes up untouched.
     */

    const canvas = document.createElement("canvas");
    canvas.width = size.w;
    canvas.height = size.h;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return null;

    const stream = canvas.captureStream();

    // Keep the sound. Routed through a Web Audio graph because that is the
    // only way to get a track off a <video> in Safari — and the element is
    // muted, so nothing plays out loud in the room while this happens.
    try {
      const AC: typeof AudioContext =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AC) {
        audioCtx = new AC();
        const src = audioCtx.createMediaElementSource(el);
        const dest = audioCtx.createMediaStreamDestination();
        src.connect(dest);
        for (const t of dest.stream.getAudioTracks()) stream.addTrack(t);
      }
    } catch {
      // A silent copy is a poor outcome but a workable one; the alternative
      // here is no copy at all.
    }

    const chunks: BlobPart[] = [];
    const rec = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: TARGET_BITS_PER_SECOND,
    });
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    const finished = new Promise<void>((resolve) => {
      rec.onstop = () => resolve();
      rec.onerror = () => resolve();
    });

    const draw = () => {
      try {
        ctx.drawImage(el, 0, 0, size.w, size.h);
      } catch {
        /* a frame we could not draw is a frame we skip */
      }
      opts.onProgress?.({
        done: el.currentTime,
        total,
        ratio: total > 0 ? Math.min(1, el.currentTime / total) : null,
      });
      raf = requestAnimationFrame(draw);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      try {
        if (rec.state !== "inactive") rec.stop();
      } catch {
        /* already stopped */
      }
    };

    el.addEventListener("ended", stop, { once: true });
    opts.signal?.addEventListener("abort", stop, { once: true });

    rec.start(1000);
    draw();
    try {
      await el.play();
    } catch {
      stop();
      return null;
    }

    await finished;
    cancelAnimationFrame(raf);

    if (opts.signal?.aborted) return null;
    if (chunks.length === 0) return null;

    const blob = new Blob(chunks, { type: "video/mp4" });
    // It came out bigger, or barely smaller. Keep the original: it is at
    // least the quality the family actually recorded.
    if (blob.size >= file.size * 0.9) return null;

    const base = file.name.replace(/\.[^.]+$/, "") || "video";
    return new File([blob], `${base}.mp4`, {
      type: "video/mp4",
      lastModified: Date.now(),
    });
  } catch {
    return null;
  } finally {
    cancelAnimationFrame(raf);
    try {
      el.pause();
    } catch {
      /* nothing to pause */
    }
    el.removeAttribute("src");
    el.load();
    URL.revokeObjectURL(url);
    try {
      await audioCtx?.close();
    } catch {
      /* already closed */
    }
  }
}

/** "1 min 20 s left" — honest and rough, for the shrinking bar. */
export function shrinkLeft(p: PrepProgress): string | null {
  if (!p.total || p.done <= 0) return null;
  const left = Math.max(0, p.total - p.done);
  if (left < 1) return "Nearly there";
  if (left < 60) return `About ${Math.ceil(left)} seconds left`;
  const m = Math.floor(left / 60);
  const s = Math.round(left % 60);
  return `About ${m} min ${s ? `${s} s ` : ""}left`;
}
