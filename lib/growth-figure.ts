/**
 * The baby, drawn — one soft figure that grows from the first curl to a
 * toddler walking.
 *
 * ── How it is built ──────────────────────────────────────────────────────
 * A tiny rig: a head, a body, two arms and two legs, each a rounded shape
 * between two joints. A handful of poses are written down by hand at the
 * weeks and months where the body changes most (the curl, the first limb
 * buds, the fetal tuck, lying, sitting, crawling, standing, walking), and
 * every week in between is worked out by easing from one to the next. So
 * every week of forty and every month of twenty-four has its own picture,
 * and the "play" animation is the same figure moving through all of them.
 *
 * Gentle on purpose: a silhouette in warm light, never a medical diagram or
 * a cartoon. The home screen is not shown at all on a journey marked as loss
 * (see app/journey/page.tsx), and the weeks page redirects; nothing here is
 * drawn for a journey that has ended.
 *
 * Pure geometry, no DOM: the still pictures (components/journey/WeekMark)
 * render it as SVG on the server, and the player (JourneyPlayer) draws the
 * same path strings on a canvas with Path2D.
 */

export type Joint = [x: number, y: number, r: number];

export interface Rig {
  head: Joint;
  chest: Joint;
  hip: Joint;
  tail: Joint;
  shoulder: Joint;
  elbow: Joint;
  hand: Joint;
  knee: Joint;
  ankle: Joint;
  toe: Joint;
  /** Where the far arm and leg sit, relative to the near ones — depth. */
  farArm: [number, number];
  farLeg: [number, number];
  /** 0–1: a closed eye and a warm cheek, once there is a face to have them. */
  face: number;
  /** 0–1: the cord, while carrying. */
  cord: number;
}

type Key = { at: number; group: string; rig: Rig };

const J = (x: number, y: number, r: number): Joint => [x, y, r];

/** Facing right, in units where a full-term curl is about 85 tall. */
const PRENATAL: Key[] = [
  { at: 4, group: "womb", rig: { head: J(9, -12, 15), chest: J(2, 2, 13), hip: J(-5, 15, 9.5), tail: J(3, 27, 3.5), shoulder: J(5, 0, 0), elbow: J(8, 4, 0), hand: J(10, 6, 0), knee: J(0, 16, 0), ankle: J(3, 20, 0), toe: J(4, 21, 0), farArm: [-2, -1], farLeg: [-2, -1], face: 0, cord: 0.4 } },
  { at: 6, group: "womb", rig: { head: J(10, -14, 17), chest: J(1, 3, 13.5), hip: J(-6, 18, 10), tail: J(3, 30, 3), shoulder: J(6, 1, 3.5), elbow: J(10, 6, 2.8), hand: J(12, 8, 2.2), knee: J(1, 21, 3), ankle: J(4, 25, 2.2), toe: J(5, 26, 1.6), farArm: [-2, -1], farLeg: [-2, -1], face: 0, cord: 0.7 } },
  { at: 8, group: "womb", rig: { head: J(12, -16, 18.5), chest: J(-1, 4, 14), hip: J(-7, 21, 11), tail: J(0, 31, 2), shoulder: J(6, 0, 5), elbow: J(12, 8, 4), hand: J(16, 5, 3), knee: J(5, 26, 5), ankle: J(11, 29, 3.5), toe: J(14, 29, 2.5), farArm: [-2, -1], farLeg: [-2, -1], face: 0.3, cord: 1 } },
  { at: 12, group: "womb", rig: { head: J(14, -18, 19), chest: J(-2, 4, 15), hip: J(-8, 24, 13), tail: J(-7, 30, 0), shoulder: J(6, -2, 5.5), elbow: J(14, 8, 4.5), hand: J(20, 0, 3.5), knee: J(11, 22, 7), ankle: J(16, 34, 5), toe: J(22, 36, 3.5), farArm: [-3, -1], farLeg: [-3, -2], face: 0.8, cord: 1 } },
  { at: 20, group: "womb", rig: { head: J(15, -22, 18), chest: J(-3, 0, 17), hip: J(-8, 24, 16), tail: J(-8, 28, 0), shoulder: J(6, -6, 6.5), elbow: J(16, 6, 5), hand: J(24, -10, 4), knee: J(20, 10, 8.5), ankle: J(14, 34, 6), toe: J(24, 38, 4.5), farArm: [-3, -1], farLeg: [-3, -2], face: 1, cord: 1 } },
  { at: 28, group: "womb", rig: { head: J(15, -24, 17.5), chest: J(-3, -2, 19), hip: J(-8, 24, 18.5), tail: J(-8, 28, 0), shoulder: J(6, -8, 7), elbow: J(17, 6, 6), hand: J(25, -12, 4.5), knee: J(22, 8, 10), ankle: J(16, 34, 7), toe: J(26, 38, 5), farArm: [-3, -1], farLeg: [-3, -2], face: 1, cord: 1 } },
  { at: 40, group: "womb", rig: { head: J(14, -25, 17.5), chest: J(-4, -3, 21), hip: J(-9, 23, 21), tail: J(-9, 27, 0), shoulder: J(6, -9, 8), elbow: J(18, 5, 6.5), hand: J(26, -14, 5), knee: J(24, 8, 11.5), ankle: J(18, 35, 7.5), toe: J(28, 38, 5.5), farArm: [-3, -1], farLeg: [-3, -2], face: 1, cord: 1 } },
];

/** Mirror a pose written facing left so every pose faces right. */
function faceRight(r: Rig): Rig {
  const m = (j: Joint): Joint => [-j[0], j[1], j[2]];
  return { ...r, head: m(r.head), chest: m(r.chest), hip: m(r.hip), tail: m(r.tail), shoulder: m(r.shoulder), elbow: m(r.elbow), hand: m(r.hand), knee: m(r.knee), ankle: m(r.ankle), toe: m(r.toe), farArm: [-r.farArm[0], r.farArm[1]], farLeg: [-r.farLeg[0], r.farLeg[1]] };
}

const NO_TAIL = J(0, 0, 0);
/** After the birth: the ground is y = 50. */
const POSTNATAL: Key[] = [
  // Newborn, on their back, arms and legs up.
  { at: 0, group: "back", rig: { head: J(-26, 36, 12), chest: J(-10, 38, 12), hip: J(6, 39, 12), tail: NO_TAIL, shoulder: J(-12, 34, 5), elbow: J(-6, 24, 4), hand: J(-13, 19, 3.5), knee: J(16, 26, 6.5), ankle: J(25, 33, 5), toe: J(29, 30, 3.5), farArm: [3, 2], farLeg: [-3, 2], face: 1, cord: 0 } },
  { at: 2, group: "back", rig: { head: J(-27, 36, 12.2), chest: J(-10, 38, 12.5), hip: J(7, 39, 12.5), tail: NO_TAIL, shoulder: J(-12, 34, 5.2), elbow: J(-4, 23, 4.2), hand: J(-10, 16, 3.6), knee: J(18, 25, 6.8), ankle: J(27, 31, 5.2), toe: J(31, 27, 3.6), farArm: [3, 2], farLeg: [-3, 2], face: 1, cord: 0 } },
  // Tummy time: head up, propped on forearms.
  { at: 3, group: "tummy", rig: faceRight({ head: J(-16, 22, 12.5), chest: J(-3, 36, 12.5), hip: J(15, 39, 12.5), tail: NO_TAIL, shoulder: J(-7, 33, 5), elbow: J(-11, 45, 4), hand: J(-18, 46, 3.5), knee: J(28, 43, 6), ankle: J(38, 41, 5), toe: J(42, 38, 3.5), farArm: [3, 0], farLeg: [-2, -2], face: 1, cord: 0 }) },
  { at: 5, group: "tummy", rig: faceRight({ head: J(-17, 18, 12.8), chest: J(-4, 34, 13), hip: J(15, 39, 12.8), tail: NO_TAIL, shoulder: J(-8, 30, 5.2), elbow: J(-10, 43, 4.2), hand: J(-16, 47, 3.6), knee: J(29, 43, 6.2), ankle: J(39, 40, 5.1), toe: J(43, 36, 3.6), farArm: [3, 0], farLeg: [-2, -2], face: 1, cord: 0 }) },
  // Sitting.
  { at: 6, group: "sit", rig: { head: J(2, -2, 13), chest: J(0, 20, 13), hip: J(-1, 37, 13), tail: NO_TAIL, shoulder: J(2, 13, 5), elbow: J(8, 25, 4), hand: J(15, 31, 3.5), knee: J(15, 41, 6.5), ankle: J(27, 44, 5), toe: J(31, 39, 3.6), farArm: [-3, 0], farLeg: [-2, -1], face: 1, cord: 0 } },
  { at: 8, group: "sit", rig: { head: J(3, -4, 13.2), chest: J(0, 19, 13.4), hip: J(-1, 37, 13.4), tail: NO_TAIL, shoulder: J(2, 12, 5.2), elbow: J(11, 20, 4.1), hand: J(19, 14, 3.6), knee: J(16, 41, 6.8), ankle: J(29, 44, 5.1), toe: J(33, 39, 3.7), farArm: [-3, 0], farLeg: [-2, -1], face: 1, cord: 0 } },
  // Crawling.
  { at: 9, group: "crawl", rig: faceRight({ head: J(-25, 13, 12.5), chest: J(-12, 22, 12.6), hip: J(10, 22, 12.6), tail: NO_TAIL, shoulder: J(-14, 22, 5.5), elbow: J(-16, 34, 4.5), hand: J(-18, 46, 3.6), knee: J(12, 46, 6.2), ankle: J(26, 46, 5), toe: J(31, 45, 3.5), farArm: [6, -1], farLeg: [-6, -1], face: 1, cord: 0 }) },
  { at: 11, group: "crawl", rig: faceRight({ head: J(-26, 11, 12.6), chest: J(-12, 21, 12.8), hip: J(11, 21, 12.8), tail: NO_TAIL, shoulder: J(-15, 21, 5.6), elbow: J(-18, 34, 4.6), hand: J(-21, 46, 3.7), knee: J(14, 46, 6.4), ankle: J(28, 46, 5.1), toe: J(33, 45, 3.6), farArm: [8, -1], farLeg: [-8, -1], face: 1, cord: 0 }) },
  // Standing, arms out for balance.
  { at: 12, group: "stand", rig: { head: J(2, -26, 12.5), chest: J(0, -6, 12), hip: J(-1, 14, 11.5), tail: NO_TAIL, shoulder: J(0, -12, 5), elbow: J(8, -2, 4), hand: J(14, -8, 3.5), knee: J(1, 31, 6), ankle: J(0, 46, 4.6), toe: J(6, 49, 3.5), farArm: [-6, 0], farLeg: [5, 0], face: 1, cord: 0 } },
  // Walking.
  { at: 15, group: "stand", rig: { head: J(3, -29, 12.3), chest: J(0, -9, 12), hip: J(-1, 12, 11.5), tail: NO_TAIL, shoulder: J(0, -15, 5), elbow: J(7, -3, 4), hand: J(12, 3, 3.5), knee: J(5, 30, 6), ankle: J(8, 46, 4.6), toe: J(14, 49, 3.5), farArm: [-10, 0], farLeg: [-13, 0], face: 1, cord: 0 } },
  { at: 24, group: "stand", rig: { head: J(3, -35, 11.6), chest: J(0, -13, 12), hip: J(-1, 9, 11.4), tail: NO_TAIL, shoulder: J(0, -19, 5), elbow: J(5, -5, 4), hand: J(9, 3, 3.5), knee: J(4, 29, 6), ankle: J(8, 46, 4.6), toe: J(14, 49, 3.5), farArm: [-10, 0], farLeg: [-14, 0], face: 1, cord: 0 } },
];

export interface GrowthStage {
  born: boolean;
  /** 4–40 while carrying; may be fractional in the player. */
  week: number;
  /** 0–24 once born; may be fractional in the player. */
  month: number;
}

const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpJ = (a: Joint, b: Joint, t: number): Joint => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

function lerpRig(a: Rig, b: Rig, t: number): Rig {
  return {
    head: lerpJ(a.head, b.head, t), chest: lerpJ(a.chest, b.chest, t), hip: lerpJ(a.hip, b.hip, t), tail: lerpJ(a.tail, b.tail, t),
    shoulder: lerpJ(a.shoulder, b.shoulder, t), elbow: lerpJ(a.elbow, b.elbow, t), hand: lerpJ(a.hand, b.hand, t),
    knee: lerpJ(a.knee, b.knee, t), ankle: lerpJ(a.ankle, b.ankle, t), toe: lerpJ(a.toe, b.toe, t),
    farArm: [lerp(a.farArm[0], b.farArm[0], t), lerp(a.farArm[1], b.farArm[1], t)],
    farLeg: [lerp(a.farLeg[0], b.farLeg[0], t), lerp(a.farLeg[1], b.farLeg[1], t)],
    face: lerp(a.face, b.face, t), cord: lerp(a.cord, b.cord, t),
  };
}

/**
 * The pose at a stage. Between two poses of the same kind it eases; across a
 * change of kind (lying → sitting) it holds the earlier pose until the next
 * begins, because a halfway point between lying and sitting is nobody.
 * `blend` says how far into a change of kind we are — the player uses it to
 * cross-fade; still pictures ignore it.
 */
export function rigAt(s: GrowthStage): { rig: Rig; next: Rig | null; blend: number } {
  const keys = s.born ? POSTNATAL : PRENATAL;
  const at = s.born ? Math.max(0, Math.min(24, s.month)) : Math.max(4, Math.min(40, s.week));
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].at <= at) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  if (a === b || at <= a.at) return { rig: a.rig, next: null, blend: 0 };
  const t = (at - a.at) / (b.at - a.at);
  if (a.group === b.group) return { rig: lerpRig(a.rig, b.rig, ease(t)), next: null, blend: 0 };
  // A change of pose kind: the last stretch before the next key cross-fades.
  const fadeFrom = Math.max(0, 1 - 0.6 / (b.at - a.at));
  return { rig: a.rig, next: b.rig, blend: t <= fadeFrom ? 0 : ease((t - fadeFrom) / (1 - fadeFrom)) };
}

/**
 * How big the figure is drawn, as a share of the frame's height. Not to scale
 * — a week-4 curl at true scale would be a dot — but always growing, and
 * fastest where the real growth is.
 */
export function sizeAt(s: GrowthStage): number {
  if (s.born) {
    const m = Math.max(0, Math.min(24, s.month));
    return lerp(0.74, 0.95, Math.sqrt(m / 24));
  }
  const w = Math.max(4, Math.min(40, s.week));
  const table: [number, number][] = [[4, 0.3], [8, 0.42], [12, 0.52], [20, 0.66], [28, 0.76], [40, 0.88]];
  let k = 0;
  while (k < table.length - 2 && table[k + 1][0] <= w) k++;
  const [w0, v0] = table[k], [w1, v1] = table[k + 1];
  return lerp(v0, v1, Math.min(1, (w - w0) / (w1 - w0)));
}

const f = (n: number) => (Math.round(n * 100) / 100).toString();

function circle([x, y, r]: Joint): string {
  if (r <= 0.05) return "";
  return `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
}

/** A rounded limb between two joints, tapering from one radius to the other. */
function capsule(a: Joint, b: Joint, ra = a[2], rb = b[2]): string {
  if (ra <= 0.05 && rb <= 0.05) return "";
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  if (len < 0.01) return circle([a[0], a[1], Math.max(ra, rb)]);
  const nx = -dy / len, ny = dx / len;
  const A1 = [a[0] + nx * ra, a[1] + ny * ra], A2 = [b[0] + nx * rb, b[1] + ny * rb];
  const B2 = [b[0] - nx * rb, b[1] - ny * rb], B1 = [a[0] - nx * ra, a[1] - ny * ra];
  return `M${f(A1[0])} ${f(A1[1])}L${f(A2[0])} ${f(A2[1])}A${f(rb)} ${f(rb)} 0 0 0 ${f(B2[0])} ${f(B2[1])}L${f(B1[0])} ${f(B1[1])}A${f(ra)} ${f(ra)} 0 0 0 ${f(A1[0])} ${f(A1[1])}Z`;
}

const shift = (j: Joint, d: [number, number]): Joint => [j[0] + d[0], j[1] + d[1], j[2] * 0.94];

export interface FigurePaths {
  /** The near side: filled with the light. Each is its own shape; drawn with
   *  one shared gradient they read as one smooth body. */
  front: string[];
  /** The far arm and leg, a little darker, behind. */
  back: string[];
  /** A closed eye, as a hairline. Empty before there is a face. */
  face: string[];
  faceOpacity: number;
  /** A soft warm cheek: centre and radius, or null before there is a face. */
  blush: [number, number, number] | null;
  /** The cord, from the belly out of the frame. Empty once born. */
  cord: string;
  cordOpacity: number;
}

export function figurePaths(r: Rig): FigurePaths {
  const neckR = Math.min(r.head[2], r.chest[2]) * 0.62;
  const front = [
    // The early curl's tail; gone (not a cone to nowhere) once it has shrunk away.
    r.tail[2] > 0.6 ? capsule(r.hip, r.tail) : "",
    capsule(r.chest, r.hip),
    capsule([r.head[0], r.head[1], neckR], r.chest, neckR, r.chest[2] * 0.85),
    circle(r.head),
    capsule(r.hip, r.knee, Math.min(r.hip[2] * 0.62, r.knee[2] * 1.5), r.knee[2]),
    capsule(r.knee, r.ankle),
    capsule(r.ankle, r.toe),
    capsule(r.shoulder, r.elbow),
    capsule(r.elbow, r.hand),
    circle(r.hand),
  ].filter(Boolean);
  const fl = r.farLeg, fa = r.farArm;
  const back = [
    capsule(shift(r.hip, fl), shift(r.knee, fl), Math.min(r.hip[2] * 0.58, r.knee[2] * 1.4), r.knee[2] * 0.94),
    capsule(shift(r.knee, fl), shift(r.ankle, fl)),
    capsule(shift(r.ankle, fl), shift(r.toe, fl)),
    capsule(shift(r.shoulder, fa), shift(r.elbow, fa)),
    capsule(shift(r.elbow, fa), shift(r.hand, fa)),
    circle(shift(r.hand, fa)),
  ].filter(Boolean);

  // The face looks the way the head is turned: away from the body.
  const [hx, hy, hr] = r.head;
  const dir = Math.sign(hx - r.chest[0]) || 1;
  const face: string[] = [];
  if (r.face > 0.02 && hr > 1) {
    const ex = hx + dir * hr * 0.42, ey = hy + hr * 0.05, ew = hr * 0.26;
    face.push(`M${f(ex - ew)} ${f(ey)}Q${f(ex)} ${f(ey + ew * 0.7)} ${f(ex + ew)} ${f(ey)}`);
  }
  // A warm cheek, just below and behind the eye.
  const blush: [number, number, number] | null =
    r.face > 0.02 && hr > 1 ? [hx + dir * hr * 0.3, hy + hr * 0.42, hr * 0.2] : null;

  let cord = "";
  if (r.cord > 0.02) {
    const [cx, cy] = [lerp(r.chest[0], r.hip[0], 0.6) + r.chest[2] * 0.6, lerp(r.chest[1], r.hip[1], 0.6)];
    cord = `M${f(cx)} ${f(cy)}C${f(cx + 14)} ${f(cy + 10)} ${f(cx + 4)} ${f(cy + 28)} ${f(cx + 22)} ${f(cy + 40)}S${f(cx + 30)} ${f(cy + 70)} ${f(cx + 46)} ${f(cy + 90)}`;
  }
  return { front, back, face, faceOpacity: Math.min(1, r.face), blush, cord, cordOpacity: Math.min(1, r.cord) };
}

/** Bounding box of a rig, for fitting it in a frame. */
export function rigBounds(r: Rig): { x0: number; y0: number; x1: number; y1: number } {
  const js = [r.head, r.chest, r.hip, r.tail, r.shoulder, r.elbow, r.hand, r.knee, r.ankle, r.toe];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y, rr] of js) {
    if (rr <= 0.05) continue;
    x0 = Math.min(x0, x - rr); y0 = Math.min(y0, y - rr); x1 = Math.max(x1, x + rr); y1 = Math.max(y1, y + rr);
  }
  return { x0, y0, x1, y1 };
}

/** A small seeded random, so the specks of light are the same every time. */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export const PRENATAL_UNITS = 100;
export const POSTNATAL_UNITS = 100;
