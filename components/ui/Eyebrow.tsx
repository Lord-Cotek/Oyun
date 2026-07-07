import { type ReactNode } from "react";

/** Uppercase-mono accent section marker — the signature COTEK marker. */
export function Eyebrow({
  children,
  className = "",
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return <Tag className={`eyebrow ${className}`}>{children}</Tag>;
}
