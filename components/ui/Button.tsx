import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Pressable } from "@/components/ui/Pressable";

type Variant = "primary" | "ghost";

/**
 * `min-h-11` is 44px — the smallest target a thumb hits reliably, and the
 * figure both Apple and Google have published for a decade. The padding here
 * came to 40, which is near enough to look right in a screenshot and far
 * enough to be missed on a moving bus.
 */
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-mono text-sm tracking-wide disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  // The hover lift moved here from `.btn-primary` so it composes with the
  // press instead of outranking it: as a utility it goes through the same
  // Tailwind transform variables the scale uses, so a pressed button that is
  // also hovered ends up lifted AND scaled rather than one cancelling out the
  // other. Desktop keeps exactly the lift it had.
  primary: "btn-primary text-on-accent font-medium hover:-translate-y-px",
  ghost:
    "border border-border bg-transparent text-ink hover:border-accent hover:text-accent",
};

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

/**
 * `primary` (accent) and `ghost` variants; renders a link when given `href`.
 *
 * The press, the knock and the timing belong to Pressable — this file is only
 * the look of a button. Before that split `.btn-primary` carried a hover lift
 * and an `:active` reset of its own, which is why the primary action was the
 * one control in the app that stayed perfectly still under a thumb: a rule
 * carrying a pseudo-class outranks a plain utility class, so that `:active`
 * reset quietly beat any transform a component tried to apply.
 */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", children, className = "" } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href !== undefined) {
    const { href, target, rel } = props;
    return (
      <Pressable href={href} target={target} rel={rel} className={classes}>
        {children}
      </Pressable>
    );
  }

  const { variant: _v, children: _c, className: _cn, ...rest } = props;
  return (
    <Pressable className={classes} {...rest}>
      {children}
    </Pressable>
  );
}
