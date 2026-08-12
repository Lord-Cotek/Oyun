"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type MoodPoint = { date: string; value: number; label: string };

export function MoodChart({ data }: { data: MoodPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border text-center">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent2"
          aria-hidden="true"
        >
          <path d="M3 12h4l2-6 4 12 2-6h6" />
        </svg>
        <p className="max-w-[16rem] font-mono text-xs leading-relaxed text-muted">
          Your heart, charted gently over time — the line begins with your first
          check-in.
        </p>
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
          <defs>
            <linearGradient id="mood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--muted)", fontSize: 11, fontFamily: "var(--font-dm-mono)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fill: "var(--muted)", fontSize: 11, fontFamily: "var(--font-dm-mono)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontFamily: "var(--font-dm-mono)",
              fontSize: 12,
              color: "var(--ink)",
            }}
            labelStyle={{ color: "var(--muted)" }}
            formatter={(value) => {
              const v = Number(value);
              const label =
                ["", "Heavy", "Low", "Steady", "Bright", "Radiant"][v] ?? String(value);
              return [label, "How I was"];
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--accent)"
            strokeWidth={2}
            fill="url(#mood)"
            dot={{ fill: "var(--accent)", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
