import { growthScene, PALETTE, type SceneDetail, type PlacedFigure } from "@/lib/growth-scene";
import type { GrowthStage } from "@/lib/growth-figure";

export type MarkStage = GrowthStage & { count?: number };

/**
 * The week, drawn: the baby, softly lit, growing week by week — inside, in a
 * warm womb; after the birth, on a dawn-lit hill. See lib/growth-figure.ts
 * for the figure and lib/growth-scene.ts for the scene.
 *
 * A server component with no client JavaScript: the picture arrives as part
 * of the page. The moving version is the player (JourneyPlayer), which only
 * runs when somebody asks it to.
 *
 * `aria-hidden` on purpose: the week, the count and the size are all said in
 * words next to it.
 */
export function WeekMark({
  stage,
  /** Unique per instance, because the gradients are referenced by id. */
  id = "mark",
  className = "",
  detail = "full",
}: {
  stage: MarkStage;
  id?: string;
  className?: string;
  detail?: SceneDetail;
}) {
  const [w, h] = detail === "thumb" ? [120, 120] : [366, 176];
  const s = growthScene(stage, w, h, detail);
  const g = (name: string) => `gm-${name}-${id}`;
  const box = detail === "thumb" ? "" : "h-44 w-full";
  const bg = s.kind === "womb" ? "#7a4518" : "#e3994f";

  return (
    <div className={`relative overflow-hidden ${box} ${className}`} style={{ background: bg }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
        <defs>
          {s.kind === "womb" ? (
            <radialGradient id={g("bg")} cx="50%" cy="50%" r="75%">
              {PALETTE.womb.stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
            </radialGradient>
          ) : (
            <linearGradient id={g("bg")} x1="0" y1="0" x2="0" y2="1">
              {PALETTE.sky.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
            </linearGradient>
          )}
          <radialGradient id={g("orb")}>
            {(s.kind === "womb" ? PALETTE.sacFill : PALETTE.sun).map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
          </radialGradient>
          <radialGradient id={g("glow")}>
            {PALETTE.glow.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
          </radialGradient>
          <linearGradient id={g("hill")} x1="0" y1="0" x2="0" y2="1">
            {PALETTE.hillFront.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
          </linearGradient>
          {s.figures[0] && (
            <linearGradient
              id={g("skin")}
              gradientUnits="userSpaceOnUse"
              x1={s.figures[0].bounds.x0}
              y1={s.figures[0].bounds.y0}
              x2={s.figures[0].bounds.x1}
              y2={s.figures[0].bounds.y1}
            >
              {PALETTE.skin.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
            </linearGradient>
          )}
        </defs>

        <rect width={w} height={h} fill={`url(#${g("bg")})`} />

        {s.kind === "world" && <circle cx={s.orb.cx} cy={s.orb.cy} r={s.orb.r} fill={`url(#${g("orb")})`} />}

        {s.strands.map((t, i) => (
          <path key={i} d={t.d} fill="none" stroke={PALETTE.light} strokeWidth={t.width} strokeLinecap="round" opacity={t.opacity} />
        ))}

        {s.kind === "womb" && (
          <>
            <circle cx={s.orb.cx} cy={s.orb.cy} r={s.orb.r} fill={`url(#${g("orb")})`} />
            <circle cx={s.orb.cx} cy={s.orb.cy} r={s.orb.r * 0.985} fill="none" stroke={PALETTE.light} strokeWidth={1} opacity={0.18} />
            <ellipse cx={s.orb.cx} cy={s.orb.cy} rx={s.orb.r * 0.78} ry={s.orb.r * 0.78} fill={`url(#${g("glow")})`} />
          </>
        )}

        {s.kind === "world" && (
          <>
            <path d={s.hills[0]} fill={PALETTE.hillBack} opacity={0.7} />
            <path d={s.hills[1]} fill={`url(#${g("hill")})`} />
            {s.shadow && <ellipse cx={s.shadow.cx} cy={s.shadow.cy} rx={s.shadow.rx} ry={s.shadow.ry} fill="#5b2f12" opacity={0.18} />}
            {s.figures[0] && (
              <ellipse
                cx={s.shadow?.cx ?? w / 2}
                cy={s.groundY - (s.figures[0].scale * 40)}
                rx={s.figures[0].scale * 60}
                ry={s.figures[0].scale * 60}
                fill={`url(#${g("glow")})`}
                opacity={0.55}
              />
            )}
          </>
        )}

        {s.figures.map((fig, i) => (
          <Figure key={i} fig={fig} skin={`url(#${g("skin")})`} thumb={detail === "thumb"} />
        ))}

        {s.specks.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={PALETTE.light} opacity={p.opacity} />
        ))}
      </svg>
    </div>
  );
}

function Figure({ fig, skin, thumb }: { fig: PlacedFigure; skin: string; thumb: boolean }) {
  const p = fig.paths;
  const sx = fig.flip ? -fig.scale : fig.scale;
  return (
    <g transform={`translate(${fig.tx.toFixed(2)} ${fig.ty.toFixed(2)}) scale(${sx.toFixed(4)} ${fig.scale.toFixed(4)})`} opacity={fig.alpha}>
      {p.cord && <path d={p.cord} fill="none" stroke={PALETTE.cord} strokeWidth={2.6} strokeLinecap="round" opacity={p.cordOpacity} />}
      {p.layers.map((l, li) => (
        <g key={`l${li}`}>
          {/* The outline first, then the fill over it: only the layer's own
              outer edge shows, so a limb reads clearly over the body. */}
          {l.paths.map((d, i) => (
            <path key={`o${i}`} d={d} fill="none" stroke={PALETTE.outline} strokeWidth={thumb ? 2.6 : 1.7} strokeLinejoin="round" />
          ))}
          {l.paths.map((d, i) => (
            <path key={`f${i}`} d={d} fill={l.tone === "far" ? PALETTE.far : skin} />
          ))}
        </g>
      ))}
      {p.blush && <circle cx={p.blush[0]} cy={p.blush[1]} r={p.blush[2]} fill={PALETTE.blush} opacity={p.faceOpacity} />}
      {!thumb && p.face.map((d, i) => (
        <path key={`e${i}`} d={d} fill="none" stroke={PALETTE.faceLine} strokeWidth={0.9} strokeLinecap="round" opacity={0.75 * p.faceOpacity} />
      ))}
    </g>
  );
}
