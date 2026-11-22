import { figurePaths, rigAt, rigBounds, seeded, sizeAt, type FigurePaths, type GrowthStage, type Rig } from "@/lib/growth-figure";

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
}

const f = (n: number) => (Math.round(n * 10) / 10).toString();

function placeAll(rig: Rig, count: number, cx: number, cy: number, height: number, kind: "womb" | "world", groundY: number, alpha: number): PlacedFigure[] {
  const paths = figurePaths(rig);
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
    out.push({ tx, ty, scale, flip: false, paths, bounds: b, alpha });
  }
  return out;
}

/**
 * The scene for a stage, in a frame of `width` × `height`.
 * `seed` keeps the specks and strands the same picture to picture.
 */
export function growthScene(stage: GrowthStage & { count?: number }, width: number, height: number, detail: SceneDetail = "full", seed = 7, stableSeed = false, padBottom = 0): Scene {
  const thumb = detail === "thumb";
  // The part of the frame the picture is composed in; below it (the player's
  // words) the background simply carries on.
  const ch = Math.max(40, height - padBottom);
  // Still pictures vary a little week to week; the player keeps one seed so
  // the specks drift rather than jump.
  const rand = seeded(seed * 9973 + (stableSeed ? 0 : stage.born ? 500 + Math.round(stage.month) : Math.round(stage.week)));
  const { rig, next, blend } = rigAt(stage);
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
    const figH = size * r * 2 * 0.86;
    const figures = placeAll(rig, count, orb.cx, orb.cy, figH, "womb", 0, 1);
    return { kind: "womb", width, height, orb, strands, specks, hills: [], groundY: 0, figures, shadow: null };
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
  const figures = placeAll(rig, count, cx, 0, figH, "world", groundY, 1 - blend);
  if (next && blend > 0) figures.push(...placeAll(next, count, cx, 0, figH, "world", groundY, blend));
  const fb = figures[0];
  const spanX = (fb.bounds.x1 - fb.bounds.x0) * fb.scale * Math.max(1, count * 0.8);
  const shadow = { cx, cy: groundY + ch * 0.015, rx: Math.max(10, spanX * 0.55), ry: ch * 0.03 };
  // Outside, the specks are dust in the light, mostly in the sky.
  for (const s of specks) s.y = s.y * 0.8;
  return { kind: "world", width, height, orb, strands, specks, hills, groundY, figures, shadow };
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
  skin: [["0", "#fffaf3"], ["0.55", "#f9e4cd"], ["1", "#eec39b"]] as [string, string][],
  far: "#e0b088",
  faceLine: "#a8744d",
  blush: "rgba(240,150,125,0.38)",
  glow: [["0", "rgba(255,232,196,0.75)"], ["0.5", "rgba(255,226,186,0.28)"], ["1", "rgba(255,220,180,0)"]] as [string, string][],
  cord: "rgba(255,240,222,0.45)",
};
