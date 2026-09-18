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
 *     ago behind it as a dashed hairline, so the growth is visible rather
 *     than asserted. A week of growth is a hairline on top of a hairline.
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
  form: {
    cx: number;
    cy: number;
    /** This week's shape. */
    d: string;
    /** A month ago, dashed, so the growth is the picture. */
    ghost: string;
    /** A hairline inside the edge, to stop the fill reading as a sticker. */
    inner: string;
    ribs: string[];
  };
}

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

/** One growing form. Irregular on purpose: nothing in a womb is a circle. */
function pod(seed: number, size: number): string {
  const r = rng(seed);
  const N = 40;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    // Fuller at the base than the top, and a small seeded wobble so no two
    // weeks are the same shape.
    const stretch = 1 + 0.2 * Math.sin(a - Math.PI / 2);
    const wob = 1 + (r() - 0.5) * 0.035;
    const rad = size * stretch * wob;
    pts.push([Math.cos(a) * rad, Math.sin(a) * rad * 1.1]);
  }
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 1; i <= N; i++) {
    const a = pts[i % N];
    const b = pts[(i + 1) % N];
    d += ` Q${r1(a[0])} ${r1(a[1])} ${r1((a[0] + b[0]) / 2)} ${r1((a[1] + b[1]) / 2)}`;
  }
  return `${d}Z`;
}

export function weekMark(
  stage: MarkStage,
  width = 366,
  height = 128,
): WeekMark {
  const { p, mp, key } = progress(stage);
  const c = clearing(p, mp, width, height);

  // ── The ground ──────────────────────────────────────────────────────────
  const tr = rng(1000 + key * 977);
  const count = Math.round(8 + p * 30 + mp * 8);
  const threads: MarkThread[] = [];
  for (let i = 0; i < count; i++) {
    const baseY =
      height * 0.06 +
      (i / (count - 1 || 1)) * (height * 0.88) +
      (tr() - 0.5) * (height * 0.03);
    const amp = height * 0.03 + tr() * (height * 0.12) * (0.4 + p);
    const wave = width * 0.35 + tr() * width * 0.55;
    const phase = tr() * Math.PI * 2;
    let d = "";
    for (let x = -12; x <= width + 12; x += 6) {
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
  const rayCount = stage.born || stage.week >= 16 ? Math.round(5 + p * 11) : 0;
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

  // ── The form ────────────────────────────────────────────────────────────
  const size = Math.min(c.ry, c.rx) * (0.44 + p * 0.2);
  // A month back, not a week: one week of growth is a hairline on top of a
  // hairline, which defeats the point of drawing growth rather than stating
  // it. Four weeks is the smallest step you can actually see.
  const back = Math.max(4, key - 4);
  const backP = clamp((Math.min(back, 40) - 4) / 36, 0, 1);
  const backMp = back > 40 ? clamp((back - 40) / 24, 0, 1) : 0;
  const backC = clearing(backP, backMp, width, height);
  const backSize = Math.min(backC.ry, backC.rx) * (0.44 + backP * 0.2);

  const ribCount = Math.round(p * 5);
  const ribs: string[] = [];
  for (let i = 1; i <= ribCount; i++) {
    const x = (i / (ribCount + 1) - 0.5) * 2 * size * 0.8;
    const h = Math.sqrt(Math.max(0, 1 - (x / (size * 1.02)) ** 2)) * size;
    ribs.push(`M${r1(x)} ${r1(-h)} Q${r1(x * 1.12)} 0 ${r1(x)} ${r1(h)}`);
  }

  return {
    width,
    height,
    threads,
    halo: {
      cx: r1(c.cx),
      cy: r1(c.cy),
      rx: r1(c.rx * 1.7),
      ry: r1(c.ry * 1.7),
    },
    rays,
    form: {
      cx: r1(c.cx),
      cy: r1(c.cy),
      d: pod(3000 + key * 31, size),
      ghost: pod(3000 + back * 31, backSize),
      inner: pod(3000 + key * 31, size * 0.97),
      ribs,
    },
  };
}
