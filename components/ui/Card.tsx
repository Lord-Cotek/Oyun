import { type ReactNode } from "react";

/** Hairline-bordered surface panel. */
export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag
      className={`relative rounded-xl border border-border bg-surface p-6 ${className}`}
    >
      {children}
    </Tag>
  );
}
