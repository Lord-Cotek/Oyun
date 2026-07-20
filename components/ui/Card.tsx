import { type ReactNode } from "react";

/** Hairline-bordered surface panel. */
export function Card({
  children,
  className = "",
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={`relative rounded-xl border border-border bg-surface p-6 ${className}`}
    >
      {children}
    </Tag>
  );
}
