/**
 * The week, drawn.
 *
 * ── What this is ─────────────────────────────────────────────────────────
 * A picture of where the journey has got to, generated from the week number
 * and nothing else. No illustrations, no stock art, no files: about sixty
 * paths worked out from one integer, so every week of forty and every month
 * of twenty-four has its own image and none of them has to be drawn by hand
 * or paid for.
 *
 * Three layers, each doing a different job, which is the whole reason they
 * sit together rather than fighting over the middle of the frame:
 *
 *   THE GROUND — threads across the frame, gathering as the weeks pass and
 *     bending around a clearing they never fill in. Psalm 139: *you knit me
 *     together*. It is the reason this composition exists.
 *
 *   THE AIR — warmth inside that clearing, with short rays from around the
 *     weeks the senses wake. Deliberately no concentric rings: the threads
 *     already carry that rhythm and two ring systems fought each other.
 *
 *   THE FORM — one growing shape at the centre, with the shape of a month
 *     ago drawn over it as a dashed hairline, so the growth is visible
 *     rather than asserted. A week of growth is a hairline on a hairline,
 *     which is why the comparison is four weeks and not one.
 *
 *     While carrying, that shape is the curl from inside the Oyun mark —
 *     a seed and a child drawn up, the same thing read two ways — opening
 *     a little further every week. Once the child has arrived it becomes a
 *     shoot out of the same ground, taller and leafier every month, because
 *     carrying a womb shape through to two years old would say the opposite
 *     of what those months are.
 *
 * ── Why nothing here is a baby ───────────────────────────────────────────
 * Every other pregnancy app draws a fetus, and each one is either a medical
 * diagram or a cartoon — the first cold, the second twee, and both wrong
 * under the words this card already carries: *fearfully and wonderfully
 * made*.
 *
 * The harder reason is that Oyun carries families through loss. A rendered
 * baby is the cruellest thing to meet on a home screen the morning after.
 * The clearing is a space the threads close around and never fill, which is
 * the idea itself and also what makes it safe: there is nothing here to take
 * away. In practice a journey marked as loss never reaches this card at all —
 * app/journey/page.tsx returns the lament view long before — but a picture
 * that would still hold if it did is the one worth having.
 *
 * ── Why it returns data rather than markup ───────────────────────────────
 * So the geometry can be checked without a browser, and so the component can
 * render real elements rather than injecting a string of SVG it assembled
 * itself. See components/journey/WeekMark.tsx.
 *
 * ── Why it never moves ───────────────────────────────────────────────────
 * It is computed on the server and sent as part of the page. Nothing animates
 * while somebody is reading; it changes when the week does. The last
 * full-screen effect on this home screen halved the frame rate on Android and
 * had to come out, so this one is built to be still and was measured before
 * it shipped.
 */

export interface MarkStage {
  born: boolean;
  /** 4–40 while carrying. Ignored once born. */
  week: number;
  /** 0–24 after the birth. */
  month: number;
  /**
   * How many. One unless she is carrying twins or more.
   *
   * A mother of twins opening a picture with one form in it is being told,
   * quietly and every morning, that the app was built for somebody else. So
   * the clearing holds as many forms as there are, nestled and each a little
   * smaller so the group occupies the space one would have.
   */
  count?: number;
}

export interface MarkThread {
  d: string;
  /** Most threads are cream; a few catch the amber. */
  amber: boolean;
  width: number;
  opacity: number;
}

export interface MarkRay {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

export interface WeekMark {
  width: number;
  height: number;
  threads: MarkThread[];
  halo: { cx: number; cy: number; rx: number; ry: number };
  rays: MarkRay[];
  /** One per baby, already placed. */
  forms: MarkForm[];
}

export interface MarkForm {
  cx: number;
  cy: number;
  /** This week's shape. */
  d: string;
  /**
   * A month ago, dashed, so the growth is the picture. Empty at thumbnail
   * detail — see `MarkDetail`.
   */
  ghost: string;
  /**
   * A hairline inside the edge, to stop the fill reading as a sticker. Empty
   * at thumbnail detail.
   */
  inner: string;
  ribs: string[];
}

/**
 * How much of the picture to draw.
 *
 * `full` is the card at the top of the home screen: one mark, large, and worth
 * every path in it.
 *
 * `thumb` is for the wall of weeks, where thirty of these are on one screen at
 * once and thirty full marks would be most of a megabyte. Three things give
 * almost all of it back, and each is a thing a thumbnail does not need:
 *
 *   — The threads are sampled every fourteen units instead of every six.
 *     They are about 95% of the markup. Twenty was tried first and was
 *     cheaper still, but on an 80px tile the straight runs between samples
 *     became visible and the weave started to look faceted, like a mistake
 *     rather than a texture. Fourteen is the coarsest that still reads as
 *     cloth.
 *   — A third as many threads, because at that size they read as texture
 *     rather than as a count of anything.
 *   — No ghost, no ribs, no inner hairline. The ghost exists to show growth
 *     against a month ago; on a wall the month ago is the tile four along, so
 *     drawing it inside each one is saying the same thing twice and muddying
 *     a small shape to do it.
 *
 * The clearing, the halo and the form are untouched, so a thumbnail is the
 * same picture at a glance — which is the only claim a thumbnail has to make.
 */
export type MarkDetail = "full" | "thumb";

/**
 * A small, stable random source.
 *
 * The same week must draw the same picture every time it is rendered — on the
 * server, on a reload, on somebody else's phone. `Math.random` would give a
 * family a different image every time they opened the app, which would read
 * as the app being unsure of itself.
 */
function rng(seed: number): () => number {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const r1 = (n: number) => Math.round(n * 10) / 10;
/**
 * Whole units for the threads.
 *
 * They are 95% of the markup — forty polylines of sixty points each — and at
 * this viewBox one unit is about nine tenths of a pixel. Rounding costs at
 * most half a unit of error on a line drawn at one pixel wide and 0.7 opacity,
 * which is not visible, and takes roughly a third off what every home screen
 * has to send. The form keeps its decimal: it is one small path where the
 * bytes are nothing and a tiny shape at week four would show the rounding.
 */
const r0 = (n: number) => Math.round(n);

/** How far along, 0–1, and the one number every layer is scaled by. */
function progress(s: MarkStage): { p: number; mp: number; key: number } {
  if (s.born) {
    const month = clamp(s.month, 0, 24);
    return { p: 1, mp: month / 24, key: 40 + month };
  }
  const week = clamp(s.week, 4, 40);
  return { p: (week - 4) / 36, mp: 0, key: week };
}

/** The space the threads close around, and never fill. */
function clearing(p: number, mp: number, w: number, h: number) {
  return {
    cx: w * 0.5,
    cy: h * 0.5,
    rx: w * 0.13 + p * (w * 0.16) + mp * (w * 0.03),
    ry: h * 0.16 + p * (h * 0.24) + mp * (h * 0.04),
  };
}

type Pt = [number, number];

/**
 * The form, in the logo's own coordinates.
 *
 * ── Why these numbers and not a circle ───────────────────────────────────
 * The amber shape inside the Oyun mark is a curl that reads two ways at
 * once: a seed, and a child drawn up with their back round and their head
 * tucked. That double reading is the whole idea of the app, and it was
 * already sitting in the logo — so the picture on the home screen draws the
 * same shape rather than an oval that means nothing in particular.
 *
 * `CURL` is lifted point for point from app/icon.tsx. If the mark is ever
 * redrawn, these numbers come from there and nowhere else.
 *
 * `SEED` is the same curl wound tighter: the sweep pulled in, the tail
 * tucked further towards the middle. Early weeks are drawn at `SEED`, the
 * last weeks at `CURL`, and every week between is the two interpolated —
 * which is why they share a structure exactly, four cubic segments and
 * thirteen points, and must keep sharing it. Interpolating a shape against
 * a shape of a different shape is not defined.
 */
const SEED: Pt[] = [
  [0, -20],
  [18, -19], [24, 2], [15, 21],
  [9, 32], [-7, 34], [-15, 25],
  [-22, 17], [-14, 2], [-2, 5],
  [4, 7], [3, -8], [0, -20],
];
const CURL: Pt[] = [
  [-3, -20],
  [22, -18], [30, 8], [18, 28],
  [11, 40], [-7, 43], [-17, 33],
  [-26, 24], [-22, 10], [-10, 10],
  [-3, 10], [-1, -4], [-3, -20],
];
/** The bounding box of those two, so both normalise to the same frame. */
const FORM_CX = 2;
const FORM_CY = 11.5;
const FORM_R = 31.5;

/**
 * One growing form: the curl, at `open` (0 = seed, 1 = the logo's curl).
 *
 * The seeded wobble is small on purpose — enough that no two weeks are quite
 * the same shape, not so much that the shape stops being the logo's.
 */
function curl(seed: number, size: number, open: number): string {
  const r = rng(seed);
  const k = clamp(open, 0, 1);
  const pts = SEED.map((s, i) => {
    const c = CURL[i];
    const wob = 1 + (r() - 0.5) * 0.05;
    return [
      ((s[0] + (c[0] - s[0]) * k - FORM_CX) / FORM_R) * size * 1.05 * wob,
      ((s[1] + (c[1] - s[1]) * k - FORM_CY) / FORM_R) * size * 1.05 * wob,
    ] as Pt;
  });
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 1; i < pts.length; i += 3) {
    const [a, b, e] = [pts[i], pts[i + 1], pts[i + 2]];
    d += ` C${r1(a[0])} ${r1(a[1])} ${r1(b[0])} ${r1(b[1])} ${r1(e[0])} ${r1(e[1])}`;
  }
  return `${d}Z`;
}

/**
 * Once they have arrived: a sprout out of the same ground.
 *
 * The curl is a thing held; a child in the world is a thing growing, and
 * carrying the womb shape through to two years old would say the opposite of
 * what those months are. So at birth the form becomes a shoot rising out of
 * the weave — one stem and a single pair of leaves in the newborn month,
 * taller and leafier every month after, which is the only claim this picture
 * needs to make about a toddler.
 *
 * Returned as one filled path (stem and leaves are separate subpaths of it)
 * so the renderer draws a sprout exactly the way it draws a curl.
 */
function sprout(seed: number, size: number, grown: number): {
  d: string;
  veins: string[];
} {
  const r = rng(seed);
  const g = clamp(grown, 0, 1);
  const base = size * 1.0;
  const height = size * (1.15 + g * 0.95);
  const lean = (r() - 0.5) * size * 0.22;
  const tipX = lean;
  const tipY = base - height;

  // A stem with a little thickness at the foot, tapering to nothing.
  const foot = size * 0.075;
  const midX = lean * 0.35;
  const midY = base - height * 0.5;
  let d =
    `M${r1(-foot)} ${r1(base)}` +
    ` Q${r1(midX - foot * 0.5)} ${r1(midY)} ${r1(tipX)} ${r1(tipY)}` +
    ` Q${r1(midX + foot * 0.5)} ${r1(midY)} ${r1(foot)} ${r1(base)}Z`;

  const veins: string[] = [];
  const pairs = 1 + Math.round(g * 3);
  for (let i = 0; i < pairs; i++) {
    // Up the stem, alternating sides, shorter the higher they sit.
    const at = 0.34 + (i / Math.max(1, pairs)) * 0.5;
    const sx = lean * at * 0.35;
    const sy = base - height * at;
    const side = i % 2 === 0 ? 1 : -1;
    const len = size * (0.62 - i * 0.09) * (0.75 + g * 0.35);
    const rise = len * 0.45;
    const tx = sx + side * len;
    const ty = sy - rise;
    const bulge = len * 0.36;
    // A leaf as two arcs between the stem and the tip, bowed either way.
    d +=
      ` M${r1(sx)} ${r1(sy)}` +
      ` Q${r1(sx + side * len * 0.45)} ${r1(sy - rise - bulge)} ${r1(tx)} ${r1(ty)}` +
      ` Q${r1(sx + side * len * 0.55)} ${r1(sy - rise + bulge * 0.35)} ${r1(sx)} ${r1(sy)}Z`;
    veins.push(`M${r1(sx)} ${r1(sy)} Q${r1(sx + side * len * 0.5)} ${r1(sy - rise * 0.8)} ${r1(tx)} ${r1(ty)}`);
  }

  return { d, veins };
}

export function weekMark(
  stage: MarkStage,
  width = 366,
  height = 128,
  detail: MarkDetail = "full",
): WeekMark {
  const thumb = detail === "thumb";
  const { p, mp, key } = progress(stage);
  const c = clearing(p, mp, width, height);

  // ── The ground ──────────────────────────────────────────────────────────
  const tr = rng(1000 + key * 977);
  const full = Math.round(8 + p * 30 + mp * 8);
  // Halved for a thumbnail, but never below four: two threads is a diagram,
  // not a ground.
  const threadCount = thumb ? Math.max(4, Math.round(full / 3)) : full;
  const step = thumb ? 14 : 6;
  const threads: MarkThread[] = [];
  for (let i = 0; i < threadCount; i++) {
    const baseY =
      height * 0.06 +
      (i / (threadCount - 1 || 1)) * (height * 0.88) +
      (tr() - 0.5) * (height * 0.03);
    const amp = height * 0.03 + tr() * (height * 0.12) * (0.4 + p);
    const wave = width * 0.35 + tr() * width * 0.55;
    const phase = tr() * Math.PI * 2;
    let d = "";
    for (let x = -12; x <= width + 12; x += step) {
      let y = baseY + Math.sin((x / wave) * Math.PI * 2 + phase) * amp;
      const dx = (x - c.cx) / c.rx;
      const dy = (y - c.cy) / c.ry;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
      if (dist < 2.1) {
        const ang = Math.atan2(y - c.cy, x - c.cx);
        // Eased twice. The radial falloff keeps the bend smooth — a linear
        // push leaves a visible kink exactly where the eye is looking. The
        // second term fades the push where threads run closest to the
        // vertical axis, which is where they would otherwise pile into a
        // cusp above and below the form; that spike reads as a mistake.
        const f = (1 - dist / 2.1) ** 2;
        const spread = 0.35 + 0.65 * Math.abs(Math.cos(ang));
        y += Math.sin(ang) * f * spread * c.ry * 0.95;
      }
      d += `${d ? " L" : "M"}${r0(x)} ${r0(y)}`;
    }
    threads.push({
      d,
      amber: i % 5 === 2,
      width: Math.round((0.6 + tr() * 1.3) * 100) / 100,
      opacity: Math.min(0.7, (0.1 + tr() * 0.32) * (0.55 + p * 0.6)),
    });
  }

  // ── The air ─────────────────────────────────────────────────────────────
  const lr = rng(2000 + key * 613);
  const rays: MarkRay[] = [];
  // The senses wake around the middle of the journey, and the rays with them.
  const rayFull = stage.born || stage.week >= 16 ? Math.round(5 + p * 11) : 0;
  // Sixteen hairlines around a 96px tile is static, not light.
  const rayCount = thumb ? Math.round(rayFull / 2) : rayFull;
  for (let i = 0; i < rayCount; i++) {
    const a = (i / rayCount) * Math.PI * 2 + lr() * 0.3;
    const near = 1.05 + lr() * 0.1;
    const far = near + 0.2 + lr() * 0.35;
    rays.push({
      x1: r1(c.cx + Math.cos(a) * c.rx * near),
      y1: r1(c.cy + Math.sin(a) * c.ry * near),
      x2: r1(c.cx + Math.cos(a) * c.rx * far),
      y2: r1(c.cy + Math.sin(a) * c.ry * far),
      opacity: Math.round((0.1 + lr() * 0.18) * 100) / 100,
    });
  }

  // ── The forms ───────────────────────────────────────────────────────────
  // Two babies are not one baby twice the size: each is its own, and together
  // they fill about the room a single one would. So the shapes shrink as the
  // count rises and sit side by side, overlapping a little, the way they do.
  const babies = Math.max(1, Math.min(4, Math.round(stage.count ?? 1)));
  const shrink =
    babies === 1 ? 1 : babies === 2 ? 0.74 : babies === 3 ? 0.6 : 0.52;
  const size = Math.min(c.ry, c.rx) * (0.44 + p * 0.2) * shrink;
  // A month back, not a week: one week of growth is a hairline on top of a
  // hairline, which defeats the point of drawing growth rather than stating
  // it. Four weeks is the smallest step you can actually see.
  const back = Math.max(4, key - 4);
  const backP = clamp((Math.min(back, 40) - 4) / 36, 0, 1);
  const backMp = back > 40 ? clamp((back - 40) / 24, 0, 1) : 0;
  const backC = clearing(backP, backMp, width, height);
  const backSize = Math.min(backC.ry, backC.rx) * (0.44 + backP * 0.2) * shrink;

  /**
   * How far from seed to curl, and from shoot to plant.
   *
   * While carrying, the curl opens across the forty weeks. Once born, the
   * curl is gone entirely and `mp` drives the sprout instead — which is why
   * `open` runs on `p` and the sprout runs on `mp`, and neither reads the
   * other's number.
   */
  const open = p;

  const fr = rng(4000 + key * 131 + babies * 7);
  const forms: MarkForm[] = [];
  // Spread across the clearing, and nudged off the centre line so a pair does
  // not read as one symmetrical ornament.
  const spread = babies === 1 ? 0 : size * (babies === 2 ? 1.02 : 1.18);
  for (let i = 0; i < babies; i++) {
    const at = babies === 1 ? 0 : i - (babies - 1) / 2;
    // A seed per baby, so no two of them are the same shape.
    const seed = 3000 + key * 31 + i * 617;
    const backSeed = 3000 + back * 31 + i * 617;

    let d: string;
    let ghost: string;
    let inner: string;
    let ribs: string[];

    if (stage.born) {
      const now = sprout(seed, size, mp);
      d = now.d;
      // A month ago it was this tall — the same claim the curl's ghost makes.
      // Not in the newborn month, where "a month ago" is before the birth and
      // the dashed shape would land almost exactly on this one.
      ghost = thumb || mp <= 0 ? "" : sprout(backSeed, backSize, backMp).d;
      // A shoot has veins, not an inset outline — an outline just inside a
      // stem two units wide is a smudge.
      inner = "";
      ribs = thumb ? [] : now.veins;
    } else {
      d = curl(seed, size, open);
      ghost = thumb ? "" : curl(backSeed, backSize, backP);
      inner = thumb ? "" : curl(seed, size * 0.94, open);
      // The curl's own line, drawn once more further in, so the later weeks
      // read as a shape with a turn inside it rather than a flat cut-out.
      // One line, not a set: three concentric curls stop looking like a child
      // curled up and start looking like a shell.
      ribs = thumb || p < 0.4 ? [] : [curl(seed, size * 0.55, open)];
    }

    forms.push({
      cx: r1(c.cx + at * spread),
      cy: r1(c.cy + (babies === 1 ? 0 : (fr() - 0.5) * size * 0.4)),
      d,
      ghost,
      inner,
      ribs,
    });
  }

  return {
    width,
    height,
    threads,
    halo: {
      cx: r1(c.cx),
      cy: r1(c.cy),
      // A pair needs a wider pool of light than one does.
      rx: r1(c.rx * (babies > 1 ? 1.9 : 1.7)),
      ry: r1(c.ry * 1.7),
    },
    rays,
    forms,
  };
}
