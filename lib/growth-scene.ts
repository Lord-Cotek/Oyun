import { figurePaths, rigAt, rigBounds, seeded, seedMix, sizeAt, turnAt, withMotion, SEED_BOUNDS, type FigurePaths, type GrowthStage, type Motion, type Rig } from "@/lib/growth-figure";

/**
 * Where the figure lives: inside, a warm womb glowing around a soft sac;
 * outside, a dawn-lit hill to grow up on. Described as data so the still
 * pictures (SVG, rendered on the server) and the player (canvas) draw the
 * same scene from the same numbers.
 *
 * ── Why no blur filters ──────────────────────────────────────────────────
 * The softness is all gradients — glows are radial gradients, light is wide
 * low-opacity strokes. A wall of thirty thumbnails with SVG blur filters is
 * what makes a cheap Android phone stutter; this keeps every edge smooth
 * without asking the GPU for anything.
 */

export type SceneDetail = "full" | "thumb";

export interface PlacedFigure {
  tx: number;
  ty: number;
  scale: number;
  /** Mirrored. Kept for callers; the scenes never mirror today. */
  flip: boolean;
  paths: FigurePaths;
  /** For the shared light across the body, in figure units. */
  bounds: { x0: number; y0: number; x1: number; y1: number };
  alpha: number;
  /** The turn head-down, radians, about `pivot` (figure units). */
  rot: number;
  pivot: [number, number];
  /** Where the light falls from and to, in figure units — kept coming from
   *  above-left in the frame however the body is turned. */
  light: [number, number, number, number];
}

/** The seed curl of the first weeks, placed. */
export interface PlacedSeed {
  tx: number;
  ty: number;
  scale: number;
  rot: number;
  alpha: number;
  light: [number, number, number, number];
}

export interface Speck {
  x: number;
  y: number;
  r: number;
  opacity: number;
  /** For the player: how it drifts. */
  phase: number;
}

export interface Strand {
  d: string;
  width: number;
  opacity: number;
}

export interface Scene {
  kind: "womb" | "world";
  width: number;
  height: number;
  /** Womb: the sac. World: the sun. */
  orb: { cx: number; cy: number; r: number };
  strands: Strand[];
  specks: Speck[];
  /** World only: the hills, back then front, and where the ground is. */
  hills: string[];
  groundY: number;
  figures: PlacedFigure[];
  /** Under the figure(s) outside; null inside. */
  shadow: { cx: number; cy: number; rx: number; ry: number } | null;
  /** The first weeks' seed curl, while it shows. */
  seed: PlacedSeed | null;
  tone: SkinTone;
}

export type ToneKey = "fair" | "tan" | "honey" | "brown" | "cocoa";
export interface SkinTone {
  label: string;
  skin: [string, string][];
  far: string;
  outline: string;
  faceLine: string;
  blush: string;
}

/**
 * Five warm skin tones. Each is a whole little palette — the light across
 * the body, the far limbs, the line around them, the eye and the cheek — so
 * a deep tone is lit and drawn as carefully as a fair one, not tinted.
 */
export const SKIN_TONES: Record<ToneKey, SkinTone> = {
  fair: { label: "Fair", skin: [["0", "#fffaf3"], ["0.55", "#f9e4cd"], ["1", "#eec39b"]], far: "#efcfae", outline: "rgba(150,92,52,0.55)", faceLine: "#a8744d", blush: "rgba(240,150,125,0.38)" },
  tan: { label: "Tan", skin: [["0", "#fde8cc"], ["0.55", "#f0c79b"], ["1", "#dca472"]], far: "#e3b385", outline: "rgba(128,72,34,0.6)", faceLine: "#87532e", blush: "rgba(226,118,92,0.36)" },
  honey: { label: "Honey", skin: [["0", "#f3cfa2"], ["0.55", "#dca56c"], ["1", "#c0834b"]], far: "#cc935c", outline: "rgba(104,54,22,0.62)", faceLine: "#6b3c1b", blush: "rgba(206,94,70,0.36)" },
  brown: { label: "Brown", skin: [["0", "#dcab7c"], ["0.55", "#b9804c"], ["1", "#935d31"]], far: "#a66e3e", outline: "rgba(70,34,12,0.66)", faceLine: "#462510", blush: "rgba(190,78,58,0.38)" },
  cocoa: { label: "Deep brown", skin: [["0", "#b98657"], ["0.55", "#8f5b33"], ["1", "#69401f"]], far: "#7a4a29", outline: "rgba(44,20,6,0.72)", faceLine: "#2b1606", blush: "rgba(176,64,48,0.36)" },
};
export const TONE_KEYS = Object.keys(SKIN_TONES) as ToneKey[];
export const DEFAULT_TONE: ToneKey = "honey";
export const toneOf = (k: string | null | undefined): ToneKey => (k && k in SKIN_TONES ? (k as ToneKey) : DEFAULT_TONE);

export interface SceneOptions {
  tone?: string | null;
  /** The player's movement; still pictures pass none. */
  motion?: Motion;
  /** The player moves between poses; still pictures hold one. */
  morph?: boolean;
}

/** A light line across a box, turned so it still falls from the frame's top-left. */
function lightFor(b: { x0: number; y0: number; x1: number; y1: number }, rot: number): [number, number, number, number] {
  const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
  const R = Math.hypot(b.x1 - b.x0, b.y1 - b.y0) / 2;
  const dx = Math.cos(Math.PI / 4 - rot), dy = Math.sin(Math.PI / 4 - rot);
  return [cx - dx * R, cy - dy * R, cx + dx * R, cy + dy * R];
}

const f = (n: number) => (Math.round(n * 10) / 10).toString();

function placeAll(rig: Rig, count: number, cx: number, cy: number, height: number, kind: "womb" | "world", groundY: number, alpha: number, hair = 0, rot = 0): PlacedFigure[] {
  const paths = figurePaths(rig, hair);
  const b = rigBounds(rig);
  const n = Math.max(1, Math.min(4, count));
  const each = n === 1 ? 1 : n === 2 ? 0.66 : 0.52;
  // Inside: fit the figure's own height. Outside: the ground is always y=50
  // in figure units, and a standing two-year-old is about 100 tall.
  const unitH = kind === "womb" ? Math.max(40, b.y1 - b.y0) : 100;
  const scale = (height / unitH) * each;
  const w = (b.x1 - b.x0) * scale, hgt = (b.y1 - b.y0) * scale;
  const out: PlacedFigure[] = [];
  for (let i = 0; i < n; i++) {
    const k = i - (n - 1) / 2;
    // Inside, twins nest on a diagonal, the way they actually lie; outside
    // they sit side by side. Never mirrored head to head — that read as one
    // shape with two faces.
    const ox = kind === "womb" ? k * w * 0.62 : k * w * 1.12;
    const oy = kind === "womb" ? k * hgt * 0.42 : 0;
    const midX = (b.x0 + b.x1) / 2;
    const tx = cx + ox - midX * scale;
    const ty = kind === "womb" ? cy + oy - ((b.y0 + b.y1) / 2) * scale : groundY - 50 * scale;
    // Twins: only the first turns head-down — the other often stays as it
    // is, and two turned bodies on one diagonal read as a tangle.
    const r = i === 0 ? rot : 0;
    out.push({ tx, ty, scale, flip: false, paths, bounds: b, alpha, rot: r, pivot: [midX, (b.y0 + b.y1) / 2], light: lightFor(b, r) });
  }
  return out;
}

/**
 * The scene for a stage, in a frame of `width` × `height`.
 * `seed` keeps the specks and strands the same picture to picture.
 */
export function growthScene(stage: GrowthStage & { count?: number }, width: number, height: number, detail: SceneDetail = "full", seed = 7, stableSeed = false, padBottom = 0, opts: SceneOptions = {}): Scene {
  const tone = SKIN_TONES[toneOf(opts.tone)];
  const thumb = detail === "thumb";
  // The part of the frame the picture is composed in; below it (the player's
  // words) the background simply carries on.
  const ch = Math.max(40, height - padBottom);
  // Still pictures vary a little week to week; the player keeps one seed so
  // the specks drift rather than jump.
  const rand = seeded(seed * 9973 + (stableSeed ? 0 : stage.born ? 500 + Math.round(stage.month) : Math.round(stage.week)));
  const at = rigAt(stage, !!opts.morph);
  const rig = opts.motion ? withMotion(at.rig, opts.motion) : at.rig;
  const next = at.next, blend = at.blend;
  const size = sizeAt(stage);
  const count = stage.count ?? 1;

  const specks: Speck[] = [];
  const nSpecks = thumb ? 7 : 26;
  for (let i = 0; i < nSpecks; i++) {
    specks.push({ x: rand() * width, y: rand() * height, r: (thumb ? 0.6 : 0.5) + rand() * (thumb ? 1.4 : 1.6), opacity: 0.18 + rand() * 0.5, phase: rand() * Math.PI * 2 });
  }

  if (!stage.born) {
    const r = Math.min(ch * 0.47, width * 0.42);
    const orb = { cx: width / 2, cy: ch / 2, r };
    // Soft light across the womb: the weave, remembered as light.
    const strands: Strand[] = [];
    const nStrands = thumb ? 3 : 7;
    for (let i = 0; i < nStrands; i++) {
      const y = height * (0.12 + 0.76 * (i / Math.max(1, nStrands - 1))) + (rand() - 0.5) * height * 0.1;
      const amp = height * (0.08 + rand() * 0.12);
      const k = 1.5 + rand();
      const pts = 5;
      let d = "";
      for (let p = 0; p <= pts; p++) {
        const x = -width * 0.05 + (width * 1.1 * p) / pts;
        // Bow away from the sac, as the threads used to bend around the clearing.
        const near = Math.max(0, 1 - Math.abs(x - orb.cx) / (r * 1.6));
        const push = (y < orb.cy ? -1 : 1) * near * near * r * 0.32;
        const yy = y + Math.sin((p / pts) * Math.PI * k + i) * amp * 0.22 + push;
        d += p === 0 ? `M${f(x)} ${f(yy)}` : ` T${f(x)} ${f(yy)}`;
      }
      strands.push({ d, width: thumb ? 1.4 : 1.2 + rand() * 1.8, opacity: 0.07 + rand() * 0.13 });
    }
    const rot = turnAt(stage);
    // A turning body is wider than it is tall for a while; keep it in the sac.
    const figH = size * r * 2 * 0.86 * (1 - 0.13 * Math.abs(Math.sin(rot)));
    // The player cross-fades the seed into the baby; a still picture shows
    // one or the other, never both at once.
    const mix = seedMix(stage);
    const seedAlpha = opts.morph ? mix.seedAlpha : stage.week < 8 ? 1 : 0;
    const figureAlpha = opts.morph ? mix.figureAlpha : stage.week < 8 ? 0 : 1;
    const figures = figureAlpha > 0.01 ? placeAll(rig, count, orb.cx, orb.cy, figH, "womb", 0, figureAlpha, 0, rot) : [];
    let seedPlaced: PlacedSeed | null = null;
    if (seedAlpha > 0.01) {
      // The seed grows and slowly turns as it unfolds.
      const sh = SEED_BOUNDS.y1 - SEED_BOUNDS.y0;
      const scale = (figH * 1.12) / sh;
      const srot = -0.35 + 0.35 * Math.min(1, (stage.week - 4) / 4);
      const mx = (SEED_BOUNDS.x0 + SEED_BOUNDS.x1) / 2, my = (SEED_BOUNDS.y0 + SEED_BOUNDS.y1) / 2;
      seedPlaced = { tx: orb.cx - mx * scale, ty: orb.cy - my * scale, scale, rot: srot, alpha: seedAlpha, light: lightFor(SEED_BOUNDS, srot) };
    }
    return { kind: "womb", width, height, orb, strands, specks, hills: [], groundY: 0, figures, shadow: null, seed: seedPlaced, tone };
  }

  const groundY = ch * 0.84;
  const orb = { cx: width * 0.8, cy: ch * 0.3, r: Math.min(ch, width * 0.6) * 0.3 };
  const hills = [
    `M0 ${f(groundY - ch * 0.1)} C${f(width * 0.25)} ${f(groundY - ch * 0.24)} ${f(width * 0.55)} ${f(groundY - ch * 0.02)} ${f(width)} ${f(groundY - ch * 0.16)} L${f(width)} ${f(height)} L0 ${f(height)}Z`,
    `M0 ${f(groundY + ch * 0.02)} C${f(width * 0.3)} ${f(groundY - ch * 0.05)} ${f(width * 0.65)} ${f(groundY + ch * 0.04)} ${f(width)} ${f(groundY - ch * 0.03)} L${f(width)} ${f(height)} L0 ${f(height)}Z`,
  ];
  const strands: Strand[] = thumb ? [] : [0, 1, 2].map((i) => {
    const y = height * (0.18 + i * 0.11);
    return { d: `M${f(-width * 0.05)} ${f(y)} C${f(width * 0.3)} ${f(y - height * 0.06)} ${f(width * 0.6)} ${f(y + height * 0.05)} ${f(width * 1.05)} ${f(y - height * 0.02)}`, width: 2.4, opacity: 0.12 };
  });
  // Fit the height of the scene, but never wider than the frame allows: a
  // crawling baby in a tall frame would otherwise fill it edge to edge.
  const figH = size * Math.min(groundY - ch * 0.04, width * 0.62);
  const cx = width * 0.46;
  const hair = Math.min(1, Math.max(0, (stage.month - 2) / 5));
  const figures = placeAll(rig, count, cx, 0, figH, "world", groundY, 1 - blend, hair);
  if (next && blend > 0) figures.push(...placeAll(next, count, cx, 0, figH, "world", groundY, blend, hair));
  const fb = figures[0];
  const spanX = (fb.bounds.x1 - fb.bounds.x0) * fb.scale * Math.max(1, count * 0.8);
  const shadow = { cx, cy: groundY + ch * 0.015, rx: Math.max(10, spanX * 0.55), ry: ch * 0.03 };
  // Outside, the specks are dust in the light, mostly in the sky.
  for (const s of specks) s.y = s.y * 0.8;
  return { kind: "world", width, height, orb, strands, specks, hills, groundY, figures, shadow, seed: null, tone };
}

/** The colours, shared by the SVG and the canvas. */
export const PALETTE = {
  womb: { stops: [["0", "#f8cf8c"], ["0.38", "#d9914a"], ["0.72", "#9c5a22"], ["1", "#5b2f12"]] as [string, string][] },
  sacFill: [["0", "rgba(255,240,222,0.16)"], ["0.78", "rgba(255,240,222,0.07)"], ["0.95", "rgba(255,236,214,0.32)"], ["1", "rgba(255,236,214,0)"]] as [string, string][],
  sky: [["0", "#f6cf8f"], ["0.55", "#eaa55c"], ["1", "#d07f3a"]] as [string, string][],
  sun: [["0", "rgba(255,250,235,0.95)"], ["0.35", "rgba(255,236,190,0.55)"], ["1", "rgba(255,226,170,0)"]] as [string, string][],
  hillBack: "#c47c3a",
  hillFront: [["0", "#a3602a"], ["1", "#6f3b16"]] as [string, string][],
  light: "#fff4e3",
  glow: [["0", "rgba(255,232,196,0.75)"], ["0.5", "rgba(255,226,186,0.28)"], ["1", "rgba(255,220,180,0)"]] as [string, string][],
  cord: "rgba(255,240,222,0.45)",
};
