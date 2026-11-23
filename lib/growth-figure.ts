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
 * Every pose faces the same way, and the face has a direction of its own
 * (`look`) and eyes that open (`awake`): asleep in the womb and as a
 * newborn looking up at the sky, awake and looking ahead from two months.
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
  /**
   * Which way the face points, in radians: 0 is along the ground to the
   * right, -π/2 is straight up at the sky. The face used to point wherever
   * the head lay relative to the chest, which for a newborn on their back
   * meant out of the top of the head, along the ground. Now it is said.
   */
  look: number;
  /** 0–1: eyes open. Asleep in the womb and as a newborn; awake after. */
  awake: number;
}

type Key = { at: number; group: string; rig: Rig };

const J = (x: number, y: number, r: number): Joint => [x, y, r];

/** Facing right, in units where a full-term curl is about 85 tall. */
const PRENATAL: Key[] = [
  { at: 4, group: "womb", rig: { head: J(9, -12, 15), chest: J(2, 2, 13), hip: J(-5, 15, 9.5), tail: J(3, 27, 3.5), shoulder: J(5, 0, 0), elbow: J(8, 4, 0), hand: J(10, 6, 0), knee: J(0, 16, 0), ankle: J(3, 20, 0), toe: J(4, 21, 0), farArm: [-2, -1], farLeg: [-2, -1], face: 0, cord: 0.4, look: 0, awake: 0 } },
  { at: 6, group: "womb", rig: { head: J(10, -14, 17), chest: J(1, 3, 13.5), hip: J(-6, 18, 10), tail: J(3, 30, 3), shoulder: J(6, 1, 3.5), elbow: J(10, 6, 2.8), hand: J(12, 8, 2.2), knee: J(1, 21, 3), ankle: J(4, 25, 2.2), toe: J(5, 26, 1.6), farArm: [-2, -1], farLeg: [-2, -1], face: 0, cord: 0.7, look: 0, awake: 0 } },
  { at: 8, group: "womb", rig: { head: J(12, -16, 18.5), chest: J(-1, 4, 14), hip: J(-7, 21, 11), tail: J(0, 31, 2), shoulder: J(6, 0, 5), elbow: J(12, 8, 4), hand: J(16, 5, 3), knee: J(5, 26, 5), ankle: J(11, 29, 3.5), toe: J(14, 29, 2.5), farArm: [-2, -1], farLeg: [-2, -1], face: 0.3, cord: 1, look: 0, awake: 0 } },
  { at: 12, group: "womb", rig: { head: J(14, -18, 19), chest: J(-2, 4, 15), hip: J(-8, 24, 13), tail: J(-7, 30, 0), shoulder: J(6, -2, 5.5), elbow: J(14, 8, 4.5), hand: J(20, 0, 3.5), knee: J(11, 22, 7), ankle: J(16, 34, 5), toe: J(22, 36, 3.5), farArm: [-3, -1], farLeg: [-3, -2], face: 0.8, cord: 1, look: 0, awake: 0 } },
  { at: 20, group: "womb", rig: { head: J(15, -22, 18), chest: J(-3, 0, 17), hip: J(-8, 24, 16), tail: J(-8, 28, 0), shoulder: J(6, -6, 6.5), elbow: J(16, 6, 5), hand: J(24, -10, 4), knee: J(20, 10, 8.5), ankle: J(14, 34, 6), toe: J(24, 38, 4.5), farArm: [-3, -1], farLeg: [-3, -2], face: 1, cord: 1, look: 0, awake: 0 } },
  { at: 28, group: "womb", rig: { head: J(15, -24, 17.5), chest: J(-3, -2, 19), hip: J(-8, 24, 18.5), tail: J(-8, 28, 0), shoulder: J(6, -8, 7), elbow: J(17, 6, 6), hand: J(25, -12, 4.5), knee: J(22, 8, 10), ankle: J(16, 34, 7), toe: J(26, 38, 5), farArm: [-3, -1], farLeg: [-3, -2], face: 1, cord: 1, look: 0, awake: 0 } },
  { at: 40, group: "womb", rig: { head: J(14, -25, 17.5), chest: J(-4, -3, 21), hip: J(-9, 23, 21), tail: J(-9, 27, 0), shoulder: J(6, -9, 8), elbow: J(18, 5, 6.5), hand: J(26, -14, 5), knee: J(24, 8, 11.5), ankle: J(18, 35, 7.5), toe: J(28, 38, 5.5), farArm: [-3, -1], farLeg: [-3, -2], face: 1, cord: 1, look: 0, awake: 0 } },
];

/** Mirror a pose written facing left so every pose faces right. */
function faceRight(r: Rig): Rig {
  const m = (j: Joint): Joint => [-j[0], j[1], j[2]];
  return { ...r, head: m(r.head), chest: m(r.chest), hip: m(r.hip), tail: m(r.tail), shoulder: m(r.shoulder), elbow: m(r.elbow), hand: m(r.hand), knee: m(r.knee), ankle: m(r.ankle), toe: m(r.toe), farArm: [-r.farArm[0], r.farArm[1]], farLeg: [-r.farLeg[0], r.farLeg[1]] };
}

const NO_TAIL = J(0, 0, 0);
/**
 * After the birth: the ground is y = 50.
 *
 * ── One direction, all the way through ──────────────────────────────────
 * Every pose faces right, towards the sun in the scene, and the head is at
 * the same end in all of them. The newborn used to lie with their head at
 * the other end, so at three months the picture flipped end for end — and
 * in the player a baby rolling over seemed to swap head and feet. A baby
 * rolls onto their tummy with their head where it was; so does this one.
 *
 * `look` turns the face: up at the sky on their back, a little up on their
 * tummy, level once sitting. `awake` opens the eyes: a newborn sleeps, and
 * by two months they are looking about.
 */
const UP = -Math.PI / 2;
const POSTNATAL: Key[] = [
  // Newborn, on their back, arms and legs up, asleep, face to the sky.
  { at: 0, group: "back", rig: faceRight({ head: J(-26, 36, 12), chest: J(-10, 38, 12), hip: J(6, 39, 12), tail: NO_TAIL, shoulder: J(-12, 34, 5), elbow: J(-6, 24, 4), hand: J(-13, 19, 3.5), knee: J(16, 26, 6.5), ankle: J(25, 33, 5), toe: J(29, 30, 3.5), farArm: [5, 2], farLeg: [-6, 3], face: 1, cord: 0, look: UP, awake: 0 }) },
  { at: 1, group: "back", rig: faceRight({ head: J(-26.5, 36, 12.1), chest: J(-10, 38, 12.2), hip: J(6.5, 39, 12.2), tail: NO_TAIL, shoulder: J(-12, 34, 5.1), elbow: J(-5, 23.5, 4.1), hand: J(-11.5, 17.5, 3.5), knee: J(17, 25.5, 6.6), ankle: J(26, 32, 5.1), toe: J(30, 28.5, 3.5), farArm: [5, 2], farLeg: [-6, 3], face: 1, cord: 0, look: UP, awake: 0.2 }) },
  // Two months: awake, looking up, reaching.
  { at: 2, group: "back", rig: faceRight({ head: J(-27, 36, 12.2), chest: J(-10, 38, 12.5), hip: J(7, 39, 12.5), tail: NO_TAIL, shoulder: J(-12, 34, 5.2), elbow: J(-4, 23, 4.2), hand: J(-10, 16, 3.6), knee: J(18, 25, 6.8), ankle: J(27, 31, 5.2), toe: J(31, 27, 3.6), farArm: [6, 2], farLeg: [-7, 3], face: 1, cord: 0, look: UP + 0.12, awake: 1 }) },
  // Tummy time: head up, propped on forearms, looking ahead.
  { at: 3, group: "tummy", rig: faceRight({ head: J(-16, 22, 12.5), chest: J(-3, 36, 12.5), hip: J(15, 39, 12.5), tail: NO_TAIL, shoulder: J(-7, 33, 5), elbow: J(-11, 45, 4), hand: J(-18, 46, 3.5), knee: J(28, 43, 6), ankle: J(38, 41, 5), toe: J(42, 38, 3.5), farArm: [-5, 0], farLeg: [3, -5], face: 1, cord: 0, look: -0.16, awake: 1 }) },
  { at: 5, group: "tummy", rig: faceRight({ head: J(-17, 18, 12.8), chest: J(-4, 34, 13), hip: J(15, 39, 12.8), tail: NO_TAIL, shoulder: J(-8, 30, 5.2), elbow: J(-10, 43, 4.2), hand: J(-16, 47, 3.6), knee: J(29, 43, 6.2), ankle: J(39, 40, 5.1), toe: J(43, 36, 3.6), farArm: [-5, 0], farLeg: [3, -6], face: 1, cord: 0, look: -0.2, awake: 1 }) },
  // Sitting, a hand out for balance.
  { at: 6, group: "sit", rig: { head: J(2, -2, 13), chest: J(0, 20, 13), hip: J(-1, 37, 13), tail: NO_TAIL, shoulder: J(2, 13, 5), elbow: J(8, 25, 4), hand: J(15, 31, 3.5), knee: J(15, 41, 6.5), ankle: J(27, 44, 5), toe: J(31, 39, 3.6), farArm: [-6, 2], farLeg: [-5, -3], face: 1, cord: 0, look: 0, awake: 1 } },
  { at: 8, group: "sit", rig: { head: J(3, -4, 13.2), chest: J(0, 19, 13.4), hip: J(-1, 37, 13.4), tail: NO_TAIL, shoulder: J(2, 12, 5.2), elbow: J(11, 20, 4.1), hand: J(19, 14, 3.6), knee: J(16, 41, 6.8), ankle: J(29, 44, 5.1), toe: J(33, 39, 3.7), farArm: [-7, 3], farLeg: [-5, -3], face: 1, cord: 0, look: -0.06, awake: 1 } },
  // Crawling, head up to see where they are going.
  { at: 9, group: "crawl", rig: faceRight({ head: J(-26, 11, 12.5), chest: J(-12, 22, 12.6), hip: J(10, 22, 12.6), tail: NO_TAIL, shoulder: J(-14, 22, 5.5), elbow: J(-17, 34, 4.5), hand: J(-21, 46, 3.6), knee: J(8, 45, 6.2), ankle: J(24, 46, 5), toe: J(29, 45, 3.5), farArm: [9, 0], farLeg: [12, 0], face: 1, cord: 0, look: -0.1, awake: 1 }) },
  { at: 11, group: "crawl", rig: faceRight({ head: J(-27, 10, 12.6), chest: J(-12, 21, 12.8), hip: J(11, 21, 12.8), tail: NO_TAIL, shoulder: J(-15, 21, 5.6), elbow: J(-20, 33, 4.6), hand: J(-25, 46, 3.7), knee: J(14, 45, 6.4), ankle: J(29, 46, 5.1), toe: J(34, 45, 3.6), farArm: [12, 0], farLeg: [-9, 0], face: 1, cord: 0, look: -0.1, awake: 1 }) },
  // Standing, arms out for balance.
  { at: 12, group: "stand", rig: { head: J(2, -26, 12.5), chest: J(0, -6, 12), hip: J(-1, 14, 11.5), tail: NO_TAIL, shoulder: J(0, -12, 5), elbow: J(8, -4, 4), hand: J(15, -8, 3.5), knee: J(0, 31, 6), ankle: J(1, 46, 4.6), toe: J(7, 49, 3.5), farArm: [-9, 2], farLeg: [-6, 0], face: 1, cord: 0, look: 0, awake: 1 } },
  // Walking: the near leg steps forward, the far one pushes off behind.
  { at: 15, group: "stand", rig: { head: J(3, -29, 12.3), chest: J(1, -9, 12), hip: J(0, 12, 11.5), tail: NO_TAIL, shoulder: J(1, -15, 5), elbow: J(7, -4, 4), hand: J(13, 1, 3.5), knee: J(4, 30, 6), ankle: J(7, 46, 4.6), toe: J(13, 49, 3.5), farArm: [-14, 1], farLeg: [-13, 0], face: 1, cord: 0, look: 0, awake: 1 } },
  { at: 24, group: "stand", rig: { head: J(3, -35, 11.8), chest: J(1, -13, 12), hip: J(0, 9, 11.4), tail: NO_TAIL, shoulder: J(1, -19, 5), elbow: J(6, -6, 4), hand: J(11, 3, 3.5), knee: J(4, 29, 6), ankle: J(8, 46, 4.6), toe: J(14, 49, 3.5), farArm: [-14, 1], farLeg: [-15, 0], face: 1, cord: 0, look: 0, awake: 1 } },
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
    look: lerp(a.look, b.look, t), awake: lerp(a.awake, b.awake, t),
  };
}

/**
 * The pose at a stage. Between two poses of the same kind it eases; across a
 * change of kind (lying → sitting) it holds the earlier pose until the next
 * begins, because a halfway point between lying and sitting is nobody.
 * `blend` says how far into a change of kind we are — the player uses it to
 * cross-fade; still pictures ignore it.
 */
export function rigAt(s: GrowthStage, morph = false): { rig: Rig; next: Rig | null; blend: number } {
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
  const blend = t <= fadeFrom ? 0 : ease((t - fadeFrom) / (1 - fadeFrom));
  // The player moves the body from one pose to the next instead of fading:
  // a baby going from lying to sitting should be seen to sit up.
  if (morph) return { rig: lerpRig(a.rig, b.rig, blend), next: null, blend: 0 };
  return { rig: a.rig, next: b.rig, blend };
}

/** Life in the player: a kick, a stretch, a step. Each 0–1 (walk is -1–1). */
export interface Motion {
  kick?: number;
  stretch?: number;
  walk?: number;
}

const towards = (j: Joint, from: Joint, k: number): Joint => [j[0] + (j[0] - from[0]) * k, j[1] + (j[1] - from[1]) * k, j[2]];

/** The rig with a little movement in it. Still pictures never call this. */
export function withMotion(r: Rig, m: Motion): Rig {
  let out = r;
  if (m.kick) {
    const k = m.kick;
    // The leg straightens out from the hip, the foot pointing.
    out = { ...out, knee: towards(out.knee, out.hip, 0.16 * k), ankle: towards(out.ankle, out.hip, 0.5 * k), toe: towards(out.toe, out.hip, 0.58 * k) };
  }
  if (m.stretch) {
    const k = m.stretch;
    out = { ...out, elbow: towards(out.elbow, out.shoulder, 0.2 * k), hand: towards(out.hand, out.shoulder, 0.5 * k) };
  }
  if (m.walk) {
    const w = m.walk;
    out = {
      ...out,
      ankle: [out.ankle[0] + w * 4, out.ankle[1] - Math.max(0, w) * 2, out.ankle[2]],
      toe: [out.toe[0] + w * 4, out.toe[1] - Math.max(0, w) * 2, out.toe[2]],
      knee: [out.knee[0] + w * 2, out.knee[1], out.knee[2]],
      farLeg: [out.farLeg[0] - w * 5, out.farLeg[1] - Math.max(0, -w) * 2],
      hand: [out.hand[0] - w * 3, out.hand[1], out.hand[2]],
      farArm: [out.farArm[0] + w * 4, out.farArm[1]],
    };
  }
  return out;
}

/**
 * The turn head-down, in radians: none before week 32, easing round to
 * nearly upside down by week 36, where most babies settle for the birth.
 */
export function turnAt(s: GrowthStage): number {
  if (s.born) return 0;
  const t = Math.max(0, Math.min(1, (s.week - 32) / 4));
  return ease(t) * (Math.PI * 0.92);
}

/**
 * The seed: the curl from inside the Oyun mark. It is the first weeks'
 * picture and unfolds into the baby — `seedAlpha` and `figureAlpha` say how
 * much of each to draw. Both 0/1 by week 9.
 */
export const SEED_PATH = "M -3 -20 C 22 -18 30 8 18 28 C 11 40 -7 43 -17 33 C -26 24 -22 10 -10 10 C -3 10 -1 -4 -3 -20 Z";
export const SEED_BOUNDS = { x0: -24, y0: -21, x1: 27, y1: 41 };
export function seedMix(s: GrowthStage): { seedAlpha: number; figureAlpha: number } {
  if (s.born) return { seedAlpha: 0, figureAlpha: 1 };
  const w = s.week;
  const sm = (a: number, b: number) => ease(Math.max(0, Math.min(1, (w - a) / (b - a))));
  return { seedAlpha: 1 - sm(7, 8.6), figureAlpha: sm(7, 9) };
}

/**
 * How big the figure is drawn, as a share of the frame's height. Not to scale
 * — a week-4 curl at true scale would be a dot — but always growing, and
 * fastest where the real growth is.
 */
export function sizeAt(s: GrowthStage): number {
  if (s.born) {
    const m = Math.max(0, Math.min(24, s.month));
    // A baby lying down is a quarter the height of one standing, and at the
    // same scale the newborn was a speck on the hill. So the early months
    // are drawn closer, easing back to true by the time they stand.
    const closer = lerp(1.5, 1, ease(Math.min(1, m / 12)));
    return lerp(0.74, 0.95, Math.sqrt(m / 24)) * closer;
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

/**
 * A joint of the far arm or leg: the near one, moved by a share `k` of the
 * offset. The share grows down the limb — little at the shoulder and hip,
 * all of it at the hand and foot — so the far limb hangs from the same body
 * and swings the other way. Moved whole, as it used to be, a walking child's
 * two legs were parallel and the child seemed to lean.
 */
const shift = (j: Joint, d: [number, number], k = 1): Joint => [j[0] + d[0] * k, j[1] + d[1] * k, j[2] * 0.94];

/** An ellipse turned by `rot` radians, as a closed path. */
function ellipse(cx: number, cy: number, rx: number, ry: number, rot = 0): string {
  if (rx <= 0.05 || ry <= 0.05) return "";
  const c = Math.cos(rot), s = Math.sin(rot);
  const p0 = [cx - rx * c, cy - rx * s], p1 = [cx + rx * c, cy + rx * s];
  const deg = (rot * 180) / Math.PI;
  return `M${f(p0[0])} ${f(p0[1])}A${f(rx)} ${f(ry)} ${f(deg)} 1 0 ${f(p1[0])} ${f(p1[1])}A${f(rx)} ${f(ry)} ${f(deg)} 1 0 ${f(p0[0])} ${f(p0[1])}Z`;
}

/**
 * One layer of the body. Drawn in order, each layer is outlined and then
 * filled: the outline shows only around the layer's own edge, so an arm
 * reads as an arm lying over the body rather than melting into it — which
 * is what made the first version a blob.
 */
export interface FigureLayer {
  tone: "far" | "skin";
  paths: string[];
  /**
   * What to outline, when it is not simply `paths`. A near arm or leg is
   * outlined along its sides and round its far end but left open where it
   * joins the body: a closed outline there drew a round cap inside the
   * torso, and every limb looked like a separate piece pinned on.
   */
  strokes?: string[];
}

export interface FigurePaths {
  /** Back to front: the far arm and leg, the body and head, the near leg, the near arm. */
  layers: FigureLayer[];
  /** Hairlines over the top: the closed eye, the ear, a curl of hair. */
  face: string[];
  faceOpacity: number;
  /** A soft warm cheek: centre and radius, or null before there is a face. */
  blush: [number, number, number] | null;
  /** The open eye, filled: centre and radius. Null while asleep. */
  eye: [number, number, number] | null;
  /** The cord, from the belly out of the frame. Empty once born. */
  cord: string;
  cordOpacity: number;
}

/**
 * The outline of a capsule left open at its `a` end: both sides and the
 * round end at `b`. For a limb where it leaves the body — see FigureLayer.
 */
function capsuleOpen(a: Joint, b: Joint, ra = a[2], rb = b[2]): string {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  if (len < 0.01 || (ra <= 0.05 && rb <= 0.05)) return "";
  const nx = -dy / len, ny = dx / len;
  const A1 = [a[0] + nx * ra, a[1] + ny * ra], A2 = [b[0] + nx * rb, b[1] + ny * rb];
  const B2 = [b[0] - nx * rb, b[1] - ny * rb], B1 = [a[0] - nx * ra, a[1] - ny * ra];
  return `M${f(A1[0])} ${f(A1[1])}L${f(A2[0])} ${f(A2[1])}A${f(rb)} ${f(rb)} 0 0 0 ${f(B2[0])} ${f(B2[1])}L${f(B1[0])} ${f(B1[1])}`;
}

/**
 * A foot: a round heel under the ankle and a sole that narrows to the toes,
 * with the big toe as a small bump at the end. It was one oval, which read
 * as a flipper lying down and a shoe standing up.
 */
function foot(ankle: Joint, toe: Joint): string[] {
  const len = Math.hypot(toe[0] - ankle[0], toe[1] - ankle[1]);
  if (len < 0.01) return [circle(ankle)];
  const ux = (toe[0] - ankle[0]) / len, uy = (toe[1] - ankle[1]) / len;
  const heelR = ankle[2] * 0.96, toeR = toe[2] * 0.82;
  const tip: Joint = [toe[0] + ux * toe[2] * 0.55, toe[1] + uy * toe[2] * 0.55, toeR];
  return [circle([ankle[0], ankle[1], heelR]), capsule([ankle[0], ankle[1], heelR], tip, heelR * 0.9, toeR)];
}

/**
 * A hand: a round palm and a thumb. The thumb sits on the upper side of the
 * hand, a little way along from the wrist.
 */
function hand(el: Joint, ha: Joint): string[] {
  const r = ha[2];
  const len = Math.hypot(ha[0] - el[0], ha[1] - el[1]) || 1;
  const ux = (ha[0] - el[0]) / len, uy = (ha[1] - el[1]) / len;
  // The side of the forearm that faces up.
  let nx = -uy, ny = ux;
  if (ny > 0) { nx = -nx; ny = -ny; }
  const palm: Joint = [ha[0] + ux * r * 0.25, ha[1] + uy * r * 0.25, r * 1.18];
  const thumb: Joint = [ha[0] + ux * r * 0.3 + nx * r * 1.05, ha[1] + uy * r * 0.3 + ny * r * 1.05, r * 0.5];
  return [circle(palm), capsule([ha[0], ha[1], r * 0.6], thumb, r * 0.6, r * 0.5)];
}

/**
 * An arm and a leg. `open` leaves their outlines open at the shoulder and
 * the hip, for the near pair drawn over the body.
 */
function limbs(sh: Joint, el: Joint, ha: Joint, hip: Joint, kn: Joint, an: Joint, to: Joint, open = false) {
  const thighR = Math.min(hip[2] * 0.6, kn[2] * 1.45);
  const thigh = capsule(hip, kn, thighR, kn[2]);
  const shin = capsule(kn, an, kn[2] * 0.92, an[2]);
  const feet = an[2] > 0.3 ? foot(an, to) : [capsule(an, to)];
  const leg = [thigh, shin, ...feet].filter(Boolean);
  const upper = capsule(sh, el, sh[2], el[2] * 0.95);
  const fore = capsule(el, ha, el[2] * 0.9, ha[2] * 0.85);
  const hands = ha[2] > 0.3 ? hand(el, ha) : [];
  const arm = [upper, fore, ...hands].filter(Boolean);
  if (!open) return { leg, arm, legStrokes: undefined, armStrokes: undefined };
  return {
    leg, arm,
    legStrokes: [capsuleOpen(hip, kn, thighR, kn[2]), shin, ...feet].filter(Boolean),
    armStrokes: [capsuleOpen(sh, el, sh[2], el[2] * 0.95), fore, ...hands].filter(Boolean),
  };
}

/**
 * The figure's shapes. `hair` adds a curl on top once the child is a few
 * months old (0–1), and more of them towards two years (1–2).
 */
export function figurePaths(r: Rig, hair = 0): FigurePaths {
  const [hx, hy, hr] = r.head;
  const neckR = Math.min(hr, r.chest[2]) * 0.6;
  const faceK = Math.min(1, r.face);

  // The face has its own two directions: `f*` the way the nose points, and
  // `d*` from the brow down to the chin. The chin is always on the side the
  // chest is on — below the nose for a child standing, towards the body for
  // one lying on their back looking up.
  const fx = Math.cos(r.look), fy = Math.sin(r.look);
  let dx = -fy, dy = fx;
  if (dx * (r.chest[0] - hx) + dy * (r.chest[1] - hy) < 0) { dx = -dx; dy = -dy; }
  /** A point on the head: `a` head-radii forward, `b` head-radii down the face. */
  const at = (a: number, b: number): [number, number] => [hx + (fx * a + dx * b) * hr, hy + (fy * a + dy * b) * hr];
  const P = (a: number, b: number) => { const [x, y] = at(a, b); return `${f(x)} ${f(y)}`; };

  const cheek = at(0.36, 0.36), nose = at(0.93, 0.16);
  // The tummy: a baby's front is round, not the straight side of a tube.
  // The front is whichever side of the back the arms and legs are on.
  const sx = r.hip[0] - r.chest[0], sy = r.hip[1] - r.chest[1];
  const spine = Math.hypot(sx, sy) || 1;
  let side = 0;
  for (const j of [r.elbow, r.hand, r.knee, r.toe]) side += sx * (j[1] - r.chest[1]) - sy * (j[0] - r.chest[0]);
  const front = side >= 0 ? 1 : -1;
  const bellyR = (r.chest[2] + r.hip[2]) / 2;
  const limbed = Math.min(1, r.knee[2] / 5);
  const belly: Joint = [
    r.chest[0] + sx * 0.56 + (-sy / spine) * front * bellyR * 0.2 * limbed,
    r.chest[1] + sy * 0.56 + (sx / spine) * front * bellyR * 0.2 * limbed,
    bellyR * (0.9 + 0.08 * limbed),
  ];
  const body = [
    // The early curl's tail; gone (not a cone to nowhere) once it has shrunk away.
    r.tail[2] > 0.6 ? capsule(r.hip, r.tail) : "",
    capsule(r.chest, r.hip),
    limbed > 0.2 ? circle(belly) : "",
    capsule([hx, hy, neckR], r.chest, neckR, r.chest[2] * 0.85),
    circle(r.head),
    // A face in profile: the cheek and chin fuller than the skull, and a nose.
    faceK > 0.05 ? ellipse(cheek[0], cheek[1], hr * 0.62 * faceK + hr * 0.3 * (1 - faceK), hr * 0.56, r.look) : "",
    faceK > 0.3 ? circle([nose[0], nose[1], hr * 0.13 * faceK]) : "",
  ].filter(Boolean);

  const near = limbs(r.shoulder, r.elbow, r.hand, r.hip, r.knee, r.ankle, r.toe, true);
  const fl = r.farLeg, fa = r.farArm;
  const far = limbs(shift(r.shoulder, fa, 0.25), shift(r.elbow, fa, 0.6), shift(r.hand, fa), shift(r.hip, fl, 0.2), shift(r.knee, fl, 0.55), shift(r.ankle, fl), shift(r.toe, fl));

  const layers: FigureLayer[] = [
    { tone: "far", paths: [...far.leg, ...far.arm] },
    { tone: "skin", paths: body },
    { tone: "skin", paths: near.leg, strokes: near.legStrokes },
    { tone: "skin", paths: near.arm, strokes: near.armStrokes },
  ].filter((l) => l.paths.length > 0) as FigureLayer[];

  const face: string[] = [];
  const awake = r.awake > 0.5;
  let eye: [number, number, number] | null = null;
  if (faceK > 0.02 && hr > 1) {
    if (awake) {
      // Awake: a round dark eye, and a small brow over it.
      const [ex, ey] = at(0.52, 0.02);
      eye = [ex, ey, hr * 0.1];
      face.push(`M${P(0.36, -0.2)}Q${P(0.52, -0.3)} ${P(0.68, -0.2)}`);
    } else {
      // Asleep: the closed eye, a soft arc curving towards the chin.
      face.push(`M${P(0.28, 0.02)}Q${P(0.5, 0.185)} ${P(0.72, 0.02)}`);
    }
    // The ear, well back on the head so it never reads as glasses.
    face.push(`M${P(-0.146, 0.01)}C${P(-0.384, 0.01)} ${P(-0.384, 0.35)} ${P(-0.146, 0.35)}`);
    // The mouth under the nose: resting when asleep, a small smile when awake.
    face.push(awake ? `M${P(0.6, 0.47)}Q${P(0.76, 0.62)} ${P(0.88, 0.46)}` : `M${P(0.68, 0.5)}Q${P(0.78, 0.56)} ${P(0.84, 0.48)}`);
  }
  if (hair > 0.05 && hr > 1) {
    // A curl on top of the head — and, as the months go by (`hair` above 1),
    // more of them back along the crown.
    const curl = (a0: number, b0: number, k: number) =>
      `M${P(a0 - k, b0 + k * 0.2)}C${P(a0 - k * 0.2, b0 - k * 1.2)} ${P(a0 + k * 1.3, b0 - k * 0.6)} ${P(a0 + k * 0.5, b0 + k * 0.25)}`;
    face.push(curl(0.1, -0.98, 0.32 * Math.min(1, hair)));
    const more = Math.max(0, Math.min(1, hair - 1));
    if (more > 0.15) face.push(curl(-0.3, -0.93, 0.27 * Math.min(1, more * 2)));
    if (more > 0.6) face.push(curl(-0.62, -0.76, 0.24 * Math.min(1, (more - 0.5) * 2)));
  }
  const bl = at(0.42, 0.4);
  const blush: [number, number, number] | null = faceK > 0.02 && hr > 1 ? [bl[0], bl[1], hr * 0.18] : null;

  let cord = "";
  if (r.cord > 0.02) {
    const [cx, cy] = [lerp(r.chest[0], r.hip[0], 0.6) + r.chest[2] * 0.6, lerp(r.chest[1], r.hip[1], 0.6)];
    cord = `M${f(cx)} ${f(cy)}C${f(cx + 14)} ${f(cy + 10)} ${f(cx + 4)} ${f(cy + 28)} ${f(cx + 22)} ${f(cy + 40)}S${f(cx + 30)} ${f(cy + 70)} ${f(cx + 46)} ${f(cy + 90)}`;
  }
  return { layers, face, faceOpacity: faceK, blush, eye, cord, cordOpacity: Math.min(1, r.cord) };
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
