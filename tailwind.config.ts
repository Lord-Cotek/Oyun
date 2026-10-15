import type { Config } from "tailwindcss";

/**
 * A theme colour that can take an opacity modifier.
 *
 * These were plain `"var(--accent)"` strings, and that quietly disabled the
 * slash syntax across the whole app: Tailwind can only add alpha to a colour
 * it can take apart, so `bg-accent/15`, `border-accent/40` and `bg-bg/60` were
 * never generated at all. Not a warning, not an error — the class simply did
 * not exist, the element got no colour from it, and the page looked almost
 * right. There were 270 of them in this repository.
 *
 * The function form lets Tailwind hand us the alpha and we compose it with
 * `color-mix`, which keeps the tokens as whole colours — so every plain
 * `var(--accent)` in globals.css and in any hand-written CSS keeps working
 * exactly as before. The alternative, storing channels as "217 122 82", would
 * have meant rewriting every one of those too.
 *
 * On Safari before 16.2 `color-mix` is unknown and the declaration is dropped,
 * which leaves those elements exactly as they render today — so this is an
 * improvement everywhere and a regression nowhere.
 */
const themed = (name: string) =>
  // Tailwind accepts a function here and has done for years; its published
  // types do not describe it, and say a colour must be a string. The cast is
  // to the type system only — what is emitted is the function, which is what
  // Tailwind actually wants.
  ((({ opacityValue }: { opacityValue?: string }) =>
    opacityValue === undefined
      ? `var(${name})`
      : `color-mix(in srgb, var(${name}) calc(${opacityValue} * 100%), transparent)`) as unknown) as string;

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Re-theme in app/globals.css via CSS variables — never hard-code here.
        bg: themed("--bg"),
        surface: themed("--surface"),
        border: themed("--border"),
        ink: themed("--ink"),
        muted: themed("--muted"),
        accent: themed("--accent"),
        "accent-deep": themed("--accent-deep"),
        "on-accent": themed("--on-accent"),
        positive: themed("--positive"),
        negative: themed("--negative"),
        accent2: themed("--accent2"),
      },
      fontFamily: {
        // `serif` is the DISPLAY face — headings, and the occasional short
        // line that wants to be looked at rather than read. For anything a
        // person reads a paragraph of, use `body` (or just leave it alone:
        // it is the page default).
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        body: ["var(--font-literata)", "Literata", "Georgia", "serif"],
        mono: ["var(--font-dm-mono)", "DM Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      maxWidth: {
        prose: "42rem",
        shell: "72rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.03)", opacity: "1" },
        },
        // Ambient, gentle drift for background glows behind heros.
        float: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(0, -12px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(8px, -16px) scale(1.05)" },
        },
        // Scale-in for nodes, badges, tiles.
        pop: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // A soft heartbeat for streak flames / living accents.
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(0.94)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.9s ease both",
        breathe: "breathe 6s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
        "float-slow": "float-slow 13s ease-in-out infinite",
        pop: "pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-soft": "pulse-soft 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
