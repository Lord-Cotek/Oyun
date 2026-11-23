"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { growthScene, PALETTE, type Scene } from "@/lib/growth-scene";
import { SEED_PATH, type Motion } from "@/lib/growth-figure";
import { babySizeFor } from "@/lib/babySize";

export type PlayEntry = { label: string; text: string; born: boolean; week: number; month: number };
/** A first the family logged, placed on the journey. Household only. */
export type PlayMoment = { title: string; date: string; born: boolean; week: number; month: number };

/**
 * Play the journey: the baby grows, week by week, from the first curl to
 * where they are today — and, once born, on through the months.
 *
 * Only ever up to today. The track is built from the stages already lived
 * (the weeks page passes exactly those), so nothing ahead is ever shown.
 *
 * Drawn on a canvas from the same figure and scene as the still pictures
 * (lib/growth-figure.ts, lib/growth-scene.ts), so what plays is the picture
 * on the home screen, moving. It runs only while open and visible, and with
 * reduced motion it does not play by itself: it opens at today and the
 * slider moves through the weeks.
 */

const WEEK_S = 0.5;
const MONTH_S = 0.75;
const BIRTH_S = 2.4;

type Track = { total: number; prenatalEnd: number; birthEnd: number; firstWeek: number; lastWeek: number; lastMonth: number; born: boolean };

function buildTrack(entries: PlayEntry[]): Track {
  const weeks = entries.filter((e) => !e.born).map((e) => e.week);
  const months = entries.filter((e) => e.born).map((e) => e.month);
  const firstWeek = weeks.length ? Math.min(...weeks) : 4;
  const lastWeek = weeks.length ? Math.max(...weeks) : 4;
  const born = months.length > 0;
  const lastMonth = born ? Math.max(...months) : 0;
  const prenatalEnd = Math.max(0.5, (lastWeek - firstWeek) * WEEK_S + WEEK_S);
  const birthEnd = born ? prenatalEnd + BIRTH_S : prenatalEnd;
  const total = born ? birthEnd + Math.max(MONTH_S, lastMonth * MONTH_S + MONTH_S) : prenatalEnd;
  return { total, prenatalEnd, birthEnd, firstWeek, lastWeek, lastMonth, born };
}

/** Where the journey is at time `t` of the track. */
function stageAt(tr: Track, t: number): { born: boolean; week: number; month: number; birth: number } {
  if (t <= tr.prenatalEnd || !tr.born) {
    const w = Math.min(tr.lastWeek, tr.firstWeek + Math.max(0, t) / WEEK_S);
    return { born: false, week: w, month: 0, birth: 0 };
  }
  if (t <= tr.birthEnd) return { born: false, week: tr.lastWeek, month: 0, birth: (t - tr.prenatalEnd) / BIRTH_S };
  const m = Math.min(tr.lastMonth, (t - tr.birthEnd) / MONTH_S);
  return { born: true, week: 40, month: m, birth: 1 };
}

/** Where on the track a stage falls — for the moments on the slider. */
function timeOf(tr: Track, m: { born: boolean; week: number; month: number }): number {
  if (!m.born || !tr.born) return Math.max(0, Math.min(tr.prenatalEnd, (m.week - tr.firstWeek) * WEEK_S));
  return Math.min(tr.total, tr.birthEnd + m.month * MONTH_S);
}

/** The movement in the body at this moment of the clock. */
function motionAt(st: { born: boolean; week: number; month: number }, clock: number): Motion {
  const env = (period: number, offset: number, len: number) => {
    const ph = (clock + offset) % period;
    return ph < len ? Math.sin((Math.PI * ph) / len) : 0;
  };
  if (!st.born) {
    // From about week 18 the kicks begin; a stretch now and then.
    if (st.week < 18) return {};
    const k = Math.min(1, (st.week - 18) / 6);
    return { kick: env(2.6, 0, 0.6) * k, stretch: env(4.4, 1.3, 0.9) * k * 0.85 };
  }
  if (st.month < 6) return { kick: env(1.6, 0, 0.6) * 0.7, stretch: env(2.3, 0.5, 0.8) * 0.5 };
  if (st.month >= 13) return { walk: Math.sin(clock * 5.2) };
  return {};
}

/** Lines of text that fit a width, for the words drawn into a video. */
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number, max: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > width && line) {
      lines.push(line);
      line = w;
      if (lines.length === max) break;
    } else line = t;
  }
  if (lines.length < max && line) lines.push(line);
  return lines;
}

/** The heading, the words and the mark, drawn into the frame — for the video. */
function drawCaption(ctx: CanvasRenderingContext2D, W: number, H: number, heading: string, size: string, sub: string, serif: string) {
  const g = ctx.createLinearGradient(0, H * 0.55, 0, H);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.6)");
  ctx.fillStyle = g;
  ctx.fillRect(0, H * 0.55, W, H * 0.45);
  ctx.fillStyle = "#fff";
  ctx.font = `30px ${serif}`;
  ctx.fillText(heading, 20, H - 98);
  if (size) {
    ctx.font = "11px ui-monospace, monospace";
    ctx.fillStyle = "rgba(255,240,220,0.85)";
    ctx.fillText(size.toUpperCase(), 20, H - 78);
  }
  ctx.font = `14px ${serif}`;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  wrap(ctx, sub, W - 40, 3).forEach((l, i) => ctx.fillText(l, 20, H - 56 + i * 18));
  ctx.font = "10px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,240,220,0.7)";
  ctx.textAlign = "right";
  ctx.fillText("Made with Oyun", W - 14, 22);
  ctx.textAlign = "left";
}

function grad(ctx: CanvasRenderingContext2D, g: CanvasGradient, stops: [string, string][]) {
  for (const [o, c] of stops) g.addColorStop(Number(o), c);
  return g;
}

/**
 * The heartbeat: lub-dub, about eighty a minute — slower than a baby's real
 * heart, because a real one is a flicker, and this should feel calm.
 * 0–1, peaking on each beat. The sound (when on) keeps to the same clock.
 */
export const BEAT_PERIOD = 0.75;
function beatAt(time: number): number {
  const ph = time % BEAT_PERIOD;
  const pulse = (x: number, w: number) => (x >= 0 && x < w ? Math.sin((Math.PI * x) / w) : 0);
  return Math.min(1, pulse(ph, 0.14) + 0.6 * pulse(ph - 0.19, 0.12));
}

function drawScene(ctx: CanvasRenderingContext2D, s: Scene, time: number, still: boolean, alpha: number) {
  const { width: w, height: h } = s;
  ctx.save();
  ctx.globalAlpha = alpha;
  const beat = still ? 0 : beatAt(time);
  const breathe = still ? 1 : 1 + Math.sin(time * 1.6) * 0.012;

  if (s.kind === "womb") {
    ctx.fillStyle = grad(ctx, ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.75), PALETTE.womb.stops);
  } else {
    ctx.fillStyle = grad(ctx, ctx.createLinearGradient(0, 0, 0, h), PALETTE.sky);
  }
  ctx.fillRect(0, 0, w, h);

  if (s.kind === "world") {
    const o = s.orb;
    ctx.fillStyle = grad(ctx, ctx.createRadialGradient(o.cx, o.cy, 0, o.cx, o.cy, o.r * (1 + (still ? 0 : Math.sin(time * 0.7) * 0.04))), PALETTE.sun);
    ctx.beginPath(); ctx.arc(o.cx, o.cy, o.r * 1.04, 0, Math.PI * 2); ctx.fill();
  }

  // Light strands, drifting.
  ctx.strokeStyle = PALETTE.light;
  ctx.lineCap = "round";
  s.strands.forEach((st, i) => {
    ctx.save();
    ctx.translate(still ? 0 : Math.sin(time * 0.35 + i) * 6, still ? 0 : Math.cos(time * 0.3 + i * 1.7) * 3);
    ctx.globalAlpha = alpha * st.opacity * (still ? 1 : 0.8 + 0.2 * Math.sin(time * 0.8 + i));
    ctx.lineWidth = st.width;
    ctx.stroke(new Path2D(st.d));
    ctx.restore();
  });

  if (s.kind === "womb") {
    const o = s.orb;
    ctx.fillStyle = grad(ctx, ctx.createRadialGradient(o.cx, o.cy, 0, o.cx, o.cy, o.r), PALETTE.sacFill);
    ctx.beginPath(); ctx.arc(o.cx, o.cy, o.r, 0, Math.PI * 2); ctx.fill();
    ctx.save();
    ctx.globalAlpha = alpha * 0.2;
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(o.cx, o.cy, o.r * 0.985, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    // The glow around the baby, with a heartbeat in it.
    ctx.save();
    ctx.globalAlpha = alpha * (0.85 + beat * 0.35);
    ctx.fillStyle = grad(ctx, ctx.createRadialGradient(o.cx, o.cy, 0, o.cx, o.cy, o.r * (0.78 + beat * 0.05)), PALETTE.glow);
    ctx.beginPath(); ctx.arc(o.cx, o.cy, o.r * 0.84, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  } else {
    ctx.fillStyle = PALETTE.hillBack;
    ctx.save(); ctx.globalAlpha = alpha * 0.7; ctx.fill(new Path2D(s.hills[0])); ctx.restore();
    ctx.fillStyle = grad(ctx, ctx.createLinearGradient(0, s.groundY - h * 0.08, 0, h), PALETTE.hillFront);
    ctx.fill(new Path2D(s.hills[1]));
    if (s.shadow) {
      ctx.save();
      ctx.globalAlpha = alpha * 0.18;
      ctx.fillStyle = "#5b2f12";
      ctx.beginPath(); ctx.ellipse(s.shadow.cx, s.shadow.cy, s.shadow.rx, s.shadow.ry, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    const f0 = s.figures[0];
    if (f0) {
      const gx = s.shadow?.cx ?? w / 2, gy = s.groundY - f0.scale * 40, gr = f0.scale * 60;
      ctx.save();
      ctx.globalAlpha = alpha * 0.55;
      ctx.fillStyle = grad(ctx, ctx.createRadialGradient(gx, gy, 0, gx, gy, gr), PALETTE.glow);
      ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  // The seed curl of the first weeks, unfolding into the baby.
  if (s.seed) {
    const sd = s.seed;
    ctx.save();
    ctx.globalAlpha = alpha * sd.alpha;
    ctx.translate(sd.tx, sd.ty);
    ctx.scale(sd.scale * breathe, sd.scale * breathe);
    ctx.translate(1.5, 10); ctx.rotate(sd.rot); ctx.translate(-1.5, -10);
    const seed = new Path2D(SEED_PATH);
    ctx.fillStyle = grad(ctx, ctx.createLinearGradient(sd.light[0], sd.light[1], sd.light[2], sd.light[3]), s.tone.skin);
    ctx.strokeStyle = s.tone.outline; ctx.lineWidth = 1.5; ctx.lineJoin = "round";
    ctx.stroke(seed); ctx.fill(seed);
    ctx.restore();
  }

  for (const fig of s.figures) {
    const p = fig.paths;
    ctx.save();
    ctx.globalAlpha = alpha * fig.alpha;
    // Breathe around the middle of the body, not the corner of the frame.
    const b = fig.bounds;
    const mx = (b.x0 + b.x1) / 2, my = s.kind === "womb" ? (b.y0 + b.y1) / 2 : 50;
    ctx.translate(fig.tx + mx * fig.scale, fig.ty + my * fig.scale);
    ctx.scale((fig.flip ? -fig.scale : fig.scale) * breathe, fig.scale * breathe);
    ctx.translate(-mx, -my);
    if (fig.rot) {
      ctx.translate(fig.pivot[0], fig.pivot[1]);
      ctx.rotate(fig.rot);
      ctx.translate(-fig.pivot[0], -fig.pivot[1]);
    }
    if (p.cord) {
      ctx.save();
      ctx.globalAlpha = alpha * fig.alpha * p.cordOpacity;
      ctx.strokeStyle = PALETTE.cord; ctx.lineWidth = 2.6; ctx.lineCap = "round";
      ctx.stroke(new Path2D(p.cord));
      ctx.restore();
    }
    const tone = s.tone;
    const skin = grad(ctx, ctx.createLinearGradient(fig.light[0], fig.light[1], fig.light[2], fig.light[3]), tone.skin);
    ctx.lineJoin = "round";
    for (const l of p.layers) {
      const shapes = l.paths.map((d) => new Path2D(d));
      // Outline first, fill over it — see FigureLayer. A near limb's outline
      // is left open where it joins the body (`strokes`).
      ctx.strokeStyle = tone.outline; ctx.lineWidth = 1.7; ctx.lineCap = "round";
      for (const d of l.strokes ?? l.paths) ctx.stroke(new Path2D(d));
      ctx.fillStyle = l.tone === "far" ? tone.far : skin;
      for (const sh of shapes) ctx.fill(sh);
    }
    if (p.blush) {
      ctx.save(); ctx.globalAlpha = alpha * fig.alpha * p.faceOpacity;
      ctx.fillStyle = tone.blush;
      ctx.beginPath(); ctx.arc(p.blush[0], p.blush[1], p.blush[2], 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    if (p.eye) {
      // The open eye — the same dot the still pictures draw (WeekMark).
      ctx.save(); ctx.globalAlpha = alpha * fig.alpha * 0.9 * p.faceOpacity;
      ctx.fillStyle = tone.faceLine;
      ctx.beginPath(); ctx.arc(p.eye[0], p.eye[1], p.eye[2], 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    if (p.face.length) {
      ctx.save(); ctx.globalAlpha = alpha * fig.alpha * 0.75 * p.faceOpacity;
      ctx.strokeStyle = tone.faceLine; ctx.lineWidth = 0.9; ctx.lineCap = "round";
      for (const d of p.face) ctx.stroke(new Path2D(d));
      ctx.restore();
    }
    ctx.restore();
  }

  ctx.fillStyle = PALETTE.light;
  for (const sp of s.specks) {
    const x = still ? sp.x : (sp.x + Math.cos(time * 0.4 + sp.phase) * 6 + time * 4) % (w + 10);
    const y = still ? sp.y : sp.y + Math.sin(time * 0.6 + sp.phase) * 5 - ((time * 3 + sp.phase * 20) % 12);
    ctx.save();
    ctx.globalAlpha = alpha * sp.opacity * (still ? 1 : 0.6 + 0.4 * Math.sin(time * 1.3 + sp.phase * 3));
    ctx.beginPath(); ctx.arc(x, y, sp.r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

const SOUND_KEY = "oyun-player-sound";

export function JourneyPlayer({
  entries,
  count = 1,
  tone,
  name,
  moments = [],
  onClose,
}: {
  entries: PlayEntry[];
  count?: number;
  tone?: string;
  /** "Ebun", "Ebun and Tobi", or null when they have no name yet. */
  name?: string | null;
  moments?: PlayMoment[];
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const track = useMemo(() => buildTrack(entries), [entries]);
  const reduced = useMemo(() => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches, []);
  const [t, setT] = useState(reduced ? track.total : 0);
  const [playing, setPlaying] = useState(!reduced);
  const tRef = useRef(t);
  tRef.current = t;
  const clock = useRef(0);

  // Moments on the track, in order. Each pauses the playing briefly.
  const marks = useMemo(
    () => moments.map((m) => ({ ...m, at: timeOf(track, m) })).filter((m) => m.at <= track.total).sort((a, b) => a.at - b.at),
    [moments, track],
  );
  const [moment, setMoment] = useState<(typeof marks)[number] | null>(null);
  const momentRef = useRef(moment);
  momentRef.current = moment;
  const holdUntil = useRef(0);

  const [sound, setSound] = useState(false);
  useEffect(() => {
    try {
      setSound(localStorage.getItem(SOUND_KEY) === "1");
    } catch {
      /* private mode: stays off */
    }
  }, []);
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const audio = useRef<AudioContext | null>(null);

  const [recording, setRecording] = useState<null | { progress: number }>(null);
  const recordingRef = useRef(false);
  const [notice, setNotice] = useState<string | null>(null);

  const now = stageAt(track, t);
  const atEnd = t >= track.total - 0.001;
  const entry = useMemo(() => {
    const target = now.born ? Math.floor(now.month + 1e-6) : Math.floor(now.week + 1e-6);
    const list = entries.filter((e) => e.born === now.born);
    let best = list[0];
    for (const e of list) if ((now.born ? e.month : e.week) <= target) best = e;
    return best ?? entries[entries.length - 1];
  }, [entries, now.born, now.week, now.month]);

  const plural = count > 1;
  const inBirth = now.birth > 0.3 && now.birth < 1;
  const heading = inBirth ? "Born" : entry?.label ?? "";
  const sub = inBirth ? `Welcome to the world, ${name?.trim() || (plural ? "little ones" : "little one")}.` : entry?.text ?? "";
  const sizeWord = !now.born && !inBirth ? babySizeFor(Math.floor(now.week)) : null;
  const sizeLine = sizeWord ? `${plural ? "Each about" : "About"} the size of ${sizeWord}` : "";
  const today = entries[entries.length - 1];

  // What the video frame needs to draw, kept current without restarting the loop.
  const words = useRef({ heading, sub, sizeLine });
  words.current = { heading, sub, sizeLine };

  /** A soft thump (and a buzz on phones that can), or a chime after birth. */
  const playBeat = useCallback((born: boolean) => {
    const ctx = audio.current;
    if (!ctx) return;
    const at = ctx.currentTime;
    const thump = (when: number, gain: number, freq: number, len: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, when);
      o.frequency.exponentialRampToValueAtTime(freq * 0.6, when + len);
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(gain, when + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, when + len);
      o.connect(g).connect(ctx.destination);
      o.start(when);
      o.stop(when + len + 0.02);
    };
    if (!born) {
      thump(at, 0.5, 62, 0.16);
      thump(at + 0.19, 0.3, 55, 0.13);
      try {
        navigator.vibrate?.([22, 150, 14]);
      } catch {
        /* not on this phone */
      }
    } else {
      thump(at, 0.12, 880, 0.9);
      thump(at + 0.12, 0.08, 1320, 0.8);
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSound((on) => {
      const next = !on;
      try {
        localStorage.setItem(SOUND_KEY, next ? "1" : "0");
      } catch {
        /* fine */
      }
      if (next && !audio.current) {
        try {
          const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audio.current = new Ctx();
        } catch {
          /* no sound on this device */
        }
      }
      void audio.current?.resume?.();
      return next;
    });
  }, []);

  // Draw loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();
    let shown = 0;
    let lastBeat = -1;
    let lastMonth = -1;
    const W = 360, H = 440;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
    const serif = (() => {
      try {
        const el = document.querySelector(".font-serif");
        return el ? getComputedStyle(el).fontFamily : "Georgia, serif";
      } catch {
        return "Georgia, serif";
      }
    })();
    const frame = (ts: number) => {
      const dt = Math.min(0.1, (ts - last) / 1000);
      last = ts;
      clock.current += dt;
      const holding = clock.current < holdUntil.current;
      if (playing && !holding && tRef.current < track.total) {
        const prev = tRef.current;
        const nt = Math.min(track.total, prev + dt);
        tRef.current = nt;
        // A moment the family logged: stop on it for a breath.
        const hit = marks.find((m) => m.at > prev && m.at <= nt);
        if (hit) {
          holdUntil.current = clock.current + 1.8;
          setMoment(hit);
          setT(nt);
        }
        // The words and the slider follow at about ten a second; the
        // picture itself is drawn every frame.
        if (ts - shown > 100 || nt >= track.total) { shown = ts; setT(nt); }
        if (nt >= track.total) setPlaying(false);
      }
      if (!holding && momentRef.current && clock.current > holdUntil.current + 0.2) setMoment(null);
      const st = stageAt(track, tRef.current);
      const still = reduced && !recordingRef.current;

      // Sound, kept to the picture's own heartbeat.
      if (soundRef.current && audio.current && (playing || recordingRef.current)) {
        if (!st.born && st.birth === 0) {
          const n = Math.floor(clock.current / BEAT_PERIOD);
          if (n !== lastBeat) { lastBeat = n; playBeat(false); }
        } else if (st.born) {
          const m = Math.floor(st.month + 1e-6);
          if (m !== lastMonth) { lastMonth = m; playBeat(true); }
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const motion = still ? undefined : motionAt(st, clock.current);
      const opts = { tone, motion, morph: true };
      if (st.birth > 0 && st.birth < 1) {
        // Birth: the womb's light opens into morning.
        const k = Math.min(1, Math.max(0, (st.birth - 0.25) / 0.55));
        // The womb's picture gives way in the first half, so the newborn
        // comes out of the light rather than appearing over the curl.
        drawScene(ctx, growthScene({ born: false, week: 40, month: 0, count }, W, H, "full", 11, true, H * 0.3, { tone, morph: true }), clock.current, still, Math.max(0, 1 - 2 * k));
        if (k > 0) drawScene(ctx, growthScene({ born: true, week: 40, month: 0, count }, W, H, "full", 11, true, H * 0.3, { tone, morph: true }), clock.current, still, Math.min(1, k * 1.6));
        const flash = Math.max(0, 1 - Math.abs(st.birth - 0.42) / 0.22);
        if (flash > 0) {
          const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.8);
          g.addColorStop(0, `rgba(255,250,236,${0.95 * flash})`);
          g.addColorStop(1, `rgba(255,236,200,${0.25 * flash})`);
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        }
      } else {
        drawScene(ctx, growthScene({ ...st, count }, W, H, "full", 11, true, H * 0.3, opts), clock.current, still, 1);
      }
      if (recordingRef.current) {
        const wds = words.current;
        drawCaption(ctx, W, H, wds.heading, wds.sizeLine, wds.sub, serif);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [playing, track, count, reduced, tone, marks, playBeat]);

  // Escape closes; focus the close button; no page scroll underneath.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !recordingRef.current) onClose();
      if (e.key === " " && document.activeElement?.tagName !== "INPUT" && !recordingRef.current) { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      void audio.current?.close?.();
    };
  }, [onClose]);

  const restart = () => { setT(0); tRef.current = 0; holdUntil.current = 0; setMoment(null); };
  const toggle = useCallback(() => {
    if (atEnd) { restart(); setPlaying(true); return; }
    setPlaying((p) => !p);
  }, [atEnd]);

  /** Hand a file to the phone's share sheet, or save it where sharing files is not offered. */
  const shareFile = useCallback(async (file: File) => {
    const title = name?.trim() ? `${name.trim()}'s journey so far` : "Our journey so far";
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title });
        return;
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    setNotice("Saved to your downloads.");
  }, [name]);

  /** A picture of this moment, with its words — where video is not possible. */
  const sharePicture = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    recordingRef.current = true;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/png"));
    recordingRef.current = false;
    if (blob) await shareFile(new File([blob], "oyun-journey.png", { type: "image/png" }));
  }, [shareFile]);

  /**
   * Record the journey as a short video, words and all, from the start to
   * today — it plays as it records — then offer it to the share sheet.
   */
  const shareVideo = useCallback(async () => {
    const canvas = canvasRef.current as (HTMLCanvasElement & { captureStream?: (fps?: number) => MediaStream }) | null;
    if (!canvas) return;
    if (typeof MediaRecorder === "undefined" || !canvas.captureStream) {
      setNotice("This phone can't make videos here, so here is a picture instead.");
      await sharePicture();
      return;
    }
    const type = ["video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm"].find((m) => MediaRecorder.isTypeSupported?.(m));
    if (!type) {
      setNotice("This phone can't make videos here, so here is a picture instead.");
      await sharePicture();
      return;
    }
    const stream = canvas.captureStream(30);
    let rec: MediaRecorder;
    try {
      rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 2_500_000 });
    } catch {
      setNotice("This phone can't make videos here, so here is a picture instead.");
      await sharePicture();
      return;
    }
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const done = new Promise<void>((r) => (rec.onstop = () => r()));
    restart();
    recordingRef.current = true;
    setRecording({ progress: 0 });
    setPlaying(true);
    rec.start(250);
    const started = performance.now();
    const total = (track.total + marks.length * 1.8 + 1.4) * 1000;
    await new Promise<void>((resolve) => {
      const tick = () => {
        if (!recordingRef.current) return resolve();
        const p = (performance.now() - started) / total;
        setRecording({ progress: Math.min(1, p) });
        if (p >= 1) return resolve();
        setTimeout(tick, 200);
      };
      tick();
    });
    const cancelled = !recordingRef.current;
    rec.stop();
    stream.getTracks().forEach((tr) => tr.stop());
    await done;
    recordingRef.current = false;
    setRecording(null);
    if (cancelled) return;
    const ext = type.startsWith("video/mp4") ? "mp4" : "webm";
    await shareFile(new File(chunks, `oyun-journey.${ext}`, { type: type.split(";")[0] }));
  }, [marks.length, shareFile, sharePicture, track.total]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Play the journey" className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#1c120a]/95 px-4 py-6 backdrop-blur-sm">
      <div className="flex w-full max-w-[400px] items-center justify-between gap-2 pb-3">
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[#f3d9b5]/70">The whole journey · up to today</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={sound ? "Turn the heartbeat sound off" : "Turn the heartbeat sound on"}
            className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-[#f3d9b5] hover:bg-white/10"
          >
            {sound ? "🔊" : "🔈"}
          </button>
          <button ref={closeRef} type="button" onClick={() => { recordingRef.current = false; onClose(); }} className="min-h-11 rounded-full px-3 font-mono text-xs text-[#f3d9b5] hover:bg-white/10" aria-label="Close">
            Close ✕
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-[400px] overflow-hidden rounded-[1.6rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]" style={{ aspectRatio: "360 / 440", maxHeight: "60vh" }}>
        <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
        {moment && !recording && (
          <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center px-4">
            <p className="animate-fade-up rounded-full bg-black/45 px-4 py-2 text-center font-serif text-base text-white shadow-lg backdrop-blur-sm">
              ★ {moment.title} <span className="font-mono text-[0.6rem] uppercase tracking-widest text-white/75">· {moment.date}</span>
            </p>
          </div>
        )}
        {!recording && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-5 pb-4 pt-16">
            <p className="font-serif text-3xl leading-none text-white drop-shadow">
              {heading}
              {atEnd && <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 align-middle font-mono text-[0.6rem] uppercase tracking-widest">Today</span>}
            </p>
            {sizeLine && <p className="mt-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-[#ffe9c9]/90">{sizeLine}</p>}
            <p className="mt-1.5 line-clamp-3 min-h-[3.6em] prose-serif-xs text-white/90 drop-shadow">{sub}</p>
          </div>
        )}
        {recording && (
          <div className="absolute inset-x-0 top-0 h-1 bg-white/15">
            <div className="h-full bg-[#efb35c] transition-[width]" style={{ width: `${Math.round(recording.progress * 100)}%` }} />
          </div>
        )}
      </div>

      <div className="mt-4 flex w-full max-w-[400px] items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          disabled={!!recording}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#efb35c] text-lg text-[#3b230d] shadow-lg disabled:opacity-50"
          aria-label={atEnd ? "Play again from the start" : playing ? "Pause" : "Play"}
        >
          {atEnd ? "↺" : playing ? "❚❚" : "▶"}
        </button>
        <div className="relative flex-1">
          {/* The family's own firsts, where they fall on the journey. */}
          {marks.map((m, i) => (
            <span
              key={i}
              aria-hidden
              title={`${m.title} · ${m.date}`}
              className="pointer-events-none absolute -top-2.5 h-2 w-2 -translate-x-1/2 rounded-full bg-[#ffe3b0] shadow-[0_0_6px_rgba(255,220,170,0.9)]"
              style={{ left: `${(m.at / track.total) * 100}%` }}
            />
          ))}
          <input
            type="range"
            min={0}
            max={track.total}
            step={0.01}
            value={t}
            disabled={!!recording}
            onChange={(e) => { const v = Number(e.target.value); setT(v); tRef.current = v; holdUntil.current = 0; setMoment(null); setPlaying(false); }}
            aria-label="Move through the journey"
            aria-valuetext={heading}
            className="h-2 w-full cursor-pointer accent-[#efb35c]"
          />
        </div>
      </div>

      <div className="mt-3 flex w-full max-w-[400px] flex-wrap items-center justify-center gap-2">
        {recording ? (
          <>
            <p className="font-mono text-xs text-[#f3d9b5]">Making your video… {Math.round(recording.progress * 100)}%</p>
            <button type="button" onClick={() => { recordingRef.current = false; }} className="min-h-10 rounded-full border border-white/20 px-3 font-mono text-xs text-[#f3d9b5]">
              Stop
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={shareVideo} className="min-h-10 rounded-full border border-[#efb35c]/60 px-4 font-mono text-xs text-[#ffd99a] hover:bg-white/5">
              Share as a video
            </button>
            <button type="button" onClick={sharePicture} className="min-h-10 rounded-full px-3 font-mono text-xs text-[#f3d9b5]/80 hover:bg-white/5">
              Share this picture
            </button>
          </>
        )}
      </div>
      {notice && <p role="status" className="mt-2 font-mono text-[0.62rem] text-[#ffd99a]">{notice}</p>}
      <p className="mt-2 max-w-[400px] text-center font-mono text-[0.6rem] text-[#f3d9b5]/55">
        {today ? `Up to ${today.label.toLowerCase()} — nothing ahead of you is shown.` : ""} Pictures are drawn to show growth, not to scale.
      </p>
    </div>
  );
}
