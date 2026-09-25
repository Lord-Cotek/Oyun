"use client";

import Link from "next/link";
import {
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { tap } from "@/lib/haptics";

/**
 * Anything you can put a thumb on.
 *
 * This app looked composed and did not respond. Every control had a hover
 * state — which does not exist on a phone — and underneath that, nothing: you
 * pressed a tile and the screen sat perfectly still until the server came back
 * a few hundred milliseconds later. That gap is where "it feels like a website"
 * comes from. It is not a matter of prettiness. A button that does not move
 * under the finger reads as a picture of a button.
 *
 * So this is the one place that knows how a press behaves, and everything
 * tappable is built on it. Callers bring layout and colour; this brings the
 * response.
 *
 * ── Why pointer events and not `:active` ─────────────────────────────────
 * The obvious implementation is `active:scale-95` and no JavaScript at all,
 * and it is the wrong one on the device this is for. Mobile Safari withholds
 * `:active` for a beat while it works out whether the finger is starting a tap
 * or a scroll, so the very thing meant to feel instant arrives late — and on
 * elements it does not consider interactive it never arrives at all. Pointer
 * events fire immediately and tell us, through `pointercancel`, the moment the
 * browser decides the gesture was a scroll after all. That is also the correct
 * behaviour rather than a workaround: iOS highlights a row the instant you
 * touch it and drops the highlight when you start to drag, and that brief
 * flash is what makes a list feel like it is made of objects.
 *
 * ── Why the press is faster than the release ─────────────────────────────
 * Going down is quick and coming back is slower. Real things behave this way —
 * a key gives way immediately and returns on a spring — and the asymmetry is
 * most of the difference between "animated" and "physical". Equal timings in
 * both directions read as a slideshow.
 *
 * ── One thing that will defeat this ──────────────────────────────────────
 * A CSS *animation* on the pressable element itself. Every entrance animation
 * in this app is declared `both`, which means the element keeps the last
 * keyframe forever — and a property an animation is holding outranks the same
 * property set normally, whatever the specificity. So an element wearing
 * `animate-pop` (which ends at `scale(1)`, `opacity: 1`) will sit there
 * looking perfectly still no matter what is set here, and nothing about the
 * markup will suggest why. Put the entrance animation on a wrapper and the
 * press on the element, and both work.
 *
 * ── prefers-reduced-motion ───────────────────────────────────────────────
 * The scale is motion and goes away when asked. What must NOT go away is the
 * feedback: someone who turned motion off still needs to know the tap landed.
 * So the scale is replaced by a dip in opacity rather than removed, which is
 * what iOS itself falls back to, and what full-width rows use anyway.
 */

/**
 * How hard a thing presses.
 *
 * Not a style knob — a size correction. The eye reads the movement of an edge
 * in pixels, not in percent, so one ratio across every control means the big
 * ones look rubbery and the small ones look dead. A 360px card at 0.97 shifts
 * its edge five pixels; a 44px button at the same ratio shifts less than one,
 * which is to say not at all. Hence a scale per size of thing.
 *
 * `row` is the exception and is not a scale at all: a full-bleed list row that
 * shrinks looks like it is falling into the page. Rows dim, the way they do
 * everywhere else on a phone.
 */
export type Press = "none" | "row" | "card" | "tile" | "control";

/**
 * Written out in full rather than composed, because Tailwind finds classes by
 * reading this file as text. A class assembled from pieces at runtime is a
 * class that never reaches the stylesheet.
 */
const PRESSED: Record<Press, string> = {
  none: "",
  row: "opacity-60",
  card: "motion-safe:scale-[0.985] motion-reduce:opacity-70",
  tile: "motion-safe:scale-[0.97] motion-reduce:opacity-70",
  control: "motion-safe:scale-[0.94] motion-reduce:opacity-70",
};

/** Down fast, back slow. See the note above. */
const DOWN = "duration-[90ms]";
const UP = "duration-[260ms]";

type Common = {
  press?: Press;
  children: ReactNode;
  className?: string;
};

type AsButton = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

type AsLink = Common & {
  href: string;
  target?: string;
  rel?: string;
  id?: string;
  title?: string;
  style?: CSSProperties;
  prefetch?: boolean;
  scroll?: boolean;
  "aria-label"?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export function Pressable(props: AsButton | AsLink) {
  const { press = "control", children, className = "" } = props;
  const [down, setDown] = useState(false);

  // A disabled control is not a control. It does not move, and it does not
  // knock — a phone that answers a button it is refusing to run is lying.
  const disabled = !("href" in props) && props.disabled === true;
  const live = !disabled && press !== "none";

  const classes = [
    className,
    "transition ease-out",
    down ? DOWN : UP,
    down && live ? PRESSED[press] : "",
  ]
    .filter(Boolean)
    .join(" ");

  /**
   * The gesture, in four endings.
   *
   * `pointerup` is the tap. `pointercancel` is the browser taking the gesture
   * away to scroll with it. `pointerleave` is a mouse sliding off. The fourth
   * ending is the one people forget: a press that is still held when something
   * else steals focus. Letting go on every one of them means the only way to
   * stay stuck looking pressed is to still be pressed.
   */
  const release = () => setDown(false);
  const hold = () => {
    if (live) setDown(true);
  };

  if ("href" in props && props.href !== undefined) {
    const { href, target, rel, id, title, style, prefetch, scroll, onClick } =
      props;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        id={id}
        title={title}
        style={style}
        prefetch={prefetch}
        scroll={scroll}
        aria-label={props["aria-label"]}
        className={classes}
        onPointerDown={hold}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
        onBlur={release}
        // On the commit, never on the touch. Someone who presses a button and
        // then slides their thumb away has deliberately changed their mind,
        // and a phone that buzzes for the tap you took back is worse than one
        // that never buzzed at all. A finger landing on a list you are about
        // to scroll is the same mistake, fifty times a minute.
        onClick={(e) => {
          tap();
          onClick?.(e);
        }}
      >
        {children}
      </Link>
    );
  }

  const {
    press: _p,
    children: _c,
    className: _cn,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
    onBlur,
    ...rest
  } = props as AsButton;

  return (
    <button
      className={classes}
      onPointerDown={(e) => {
        hold();
        onPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        release();
        onPointerUp?.(e);
      }}
      onPointerCancel={(e) => {
        release();
        onPointerCancel?.(e);
      }}
      onPointerLeave={(e) => {
        release();
        onPointerLeave?.(e);
      }}
      onBlur={(e) => {
        release();
        onBlur?.(e);
      }}
      onClick={(e) => {
        if (!disabled) tap();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
