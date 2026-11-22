"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { growthScene, PALETTE, type Scene } from "@/lib/growth-scene";

export type PlayEntry = { label: string; text: string; born: boolean; week: number; month: number };

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

function grad(ctx: CanvasRenderingContext2D, g: CanvasGradient, stops: [string, string][]) {
  for (const [o, c] of stops) g.addColorStop(Number(o), c);
  return g;
}

function drawScene(ctx: CanvasRenderingContext2D, s: Scene, time: number, still: boolean, alpha: number) {
  const { width: w, height: h } = s;
  ctx.save();
  ctx.globalAlpha = alpha;
  const beat = still ? 0 : Math.pow(Math.max(0, Math.sin(time * 4.2)), 12);
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
    if (p.cord) {
      ctx.save();
      ctx.globalAlpha = alpha * fig.alpha * p.cordOpacity;
      ctx.strokeStyle = PALETTE.cord; ctx.lineWidth = 2.6; ctx.lineCap = "round";
      ctx.stroke(new Path2D(p.cord));
      ctx.restore();
    }
    const skin = grad(ctx, ctx.createLinearGradient(b.x0, b.y0, b.x1, b.y1), PALETTE.skin);
    ctx.lineJoin = "round";
    for (const l of p.layers) {
      const shapes = l.paths.map((d) => new Path2D(d));
      // Outline first, fill over it — see FigureLayer.
      ctx.strokeStyle = PALETTE.outline; ctx.lineWidth = 1.7;
      for (const sh of shapes) ctx.stroke(sh);
      ctx.fillStyle = l.tone === "far" ? PALETTE.far : skin;
      for (const sh of shapes) ctx.fill(sh);
    }
    if (p.blush) {
      ctx.save(); ctx.globalAlpha = alpha * fig.alpha * p.faceOpacity;
      ctx.fillStyle = PALETTE.blush;
      ctx.beginPath(); ctx.arc(p.blush[0], p.blush[1], p.blush[2], 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    if (p.face.length) {
      ctx.save(); ctx.globalAlpha = alpha * fig.alpha * 0.75 * p.faceOpacity;
      ctx.strokeStyle = PALETTE.faceLine; ctx.lineWidth = 0.9; ctx.lineCap = "round";
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

export function JourneyPlayer({ entries, count = 1, onClose }: { entries: PlayEntry[]; count?: number; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const track = useMemo(() => buildTrack(entries), [entries]);
  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches, []);
  const [t, setT] = useState(reduced ? track.total : 0);
  const [playing, setPlaying] = useState(!reduced);
  const tRef = useRef(t);
  tRef.current = t;
  const clock = useRef(0);

  const now = stageAt(track, t);
  const atEnd = t >= track.total - 0.001;
  const entry = useMemo(() => {
    const target = now.born ? Math.floor(now.month + 1e-6) : Math.floor(now.week + 1e-6);
    const list = entries.filter((e) => e.born === now.born);
    let best = list[0];
    for (const e of list) if ((now.born ? e.month : e.week) <= target) best = e;
    return best ?? entries[entries.length - 1];
  }, [entries, now.born, now.week, now.month]);

  // Draw loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();
    let shown = 0;
    const W = 360, H = 440;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
    const frame = (ts: number) => {
      const dt = Math.min(0.1, (ts - last) / 1000);
      last = ts;
      clock.current += dt;
      if (playing && tRef.current < track.total) {
        const nt = Math.min(track.total, tRef.current + dt);
        tRef.current = nt;
        // The words and the slider follow at about ten a second; the
        // picture itself is drawn every frame.
        if (ts - shown > 100 || nt >= track.total) { shown = ts; setT(nt); }
        if (nt >= track.total) setPlaying(false);
      }
      const st = stageAt(track, tRef.current);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const still = !!reduced;
      if (st.birth > 0 && st.birth < 1) {
        // Birth: the womb's light opens into morning.
        const k = Math.min(1, Math.max(0, (st.birth - 0.25) / 0.55));
        drawScene(ctx, growthScene({ born: false, week: 40, month: 0, count }, W, H, "full", 11, true, H * 0.3), clock.current, still, 1);
        if (k > 0) drawScene(ctx, growthScene({ born: true, week: 40, month: 0, count }, W, H, "full", 11, true, H * 0.3), clock.current, still, k);
        const flash = Math.max(0, 1 - Math.abs(st.birth - 0.42) / 0.22);
        if (flash > 0) {
          const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.8);
          g.addColorStop(0, `rgba(255,250,236,${0.95 * flash})`);
          g.addColorStop(1, `rgba(255,236,200,${0.25 * flash})`);
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        }
      } else {
        drawScene(ctx, growthScene({ ...st, count }, W, H, "full", 11, true, H * 0.3), clock.current, still, 1);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [playing, track, count, reduced]);

  // Escape closes; focus the close button; no page scroll underneath.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const toggle = useCallback(() => {
    if (atEnd) { setT(0); tRef.current = 0; setPlaying(true); return; }
    setPlaying((p) => !p);
  }, [atEnd]);

  const heading = now.birth > 0.3 && now.birth < 1 ? "Born" : entry?.label ?? "";
  const sub = now.birth > 0.3 && now.birth < 1 ? "Welcome to the world." : entry?.text ?? "";
  const today = entries[entries.length - 1];

  return (
    <div role="dialog" aria-modal="true" aria-label="Play the journey" className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#1c120a]/95 px-4 py-6 backdrop-blur-sm">
      <div className="flex w-full max-w-[400px] items-center justify-between pb-3">
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[#f3d9b5]/70">The whole journey · up to today</p>
        <button ref={closeRef} type="button" onClick={onClose} className="min-h-11 rounded-full px-3 font-mono text-xs text-[#f3d9b5] hover:bg-white/10" aria-label="Close">
          Close ✕
        </button>
      </div>

      <div className="relative w-full max-w-[400px] overflow-hidden rounded-[1.6rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]" style={{ aspectRatio: "360 / 440", maxHeight: "62vh" }}>
        <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-5 pb-4 pt-16">
          <p className="font-serif text-3xl leading-none text-white drop-shadow">
            {heading}
            {atEnd && <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 align-middle font-mono text-[0.6rem] uppercase tracking-widest">Today</span>}
          </p>
          <p className="mt-2 line-clamp-3 min-h-[3.6em] prose-serif-xs text-white/90 drop-shadow">{sub}</p>
        </div>
      </div>

      <div className="mt-4 flex w-full max-w-[400px] items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#efb35c] text-lg text-[#3b230d] shadow-lg"
          aria-label={atEnd ? "Play again from the start" : playing ? "Pause" : "Play"}
        >
          {atEnd ? "↺" : playing ? "❚❚" : "▶"}
        </button>
        <input
          type="range"
          min={0}
          max={track.total}
          step={0.01}
          value={t}
          onChange={(e) => { const v = Number(e.target.value); setT(v); tRef.current = v; setPlaying(false); }}
          aria-label="Move through the journey"
          aria-valuetext={heading}
          className="h-2 flex-1 cursor-pointer accent-[#efb35c]"
        />
      </div>
      <p className="mt-3 max-w-[400px] text-center font-mono text-[0.6rem] text-[#f3d9b5]/55">
        {today ? `Up to ${today.label.toLowerCase()} — nothing ahead of you is shown.` : ""} Pictures are drawn to show growth, not to scale.
      </p>
    </div>
  );
}
