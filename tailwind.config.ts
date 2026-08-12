import type { Config } from "tailwindcss";

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
        bg: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-deep": "var(--accent-deep)",
        "on-accent": "var(--on-accent)",
        positive: "var(--positive)",
        negative: "var(--negative)",
        accent2: "var(--accent2)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
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
