/**
 * Paper.
 *
 * One tileable noise layer over the whole app at about five per cent. It is
 * the cheapest thing on this list and it does more than any of the others:
 * flat colour on a screen reads as a slide, and the same colour with a grain
 * over it reads as a material. Everything else here — the bands, the gloss on
 * the fills — is sitting on this.
 *
 * Fixed rather than scrolling, so it behaves like the grain of the page rather
 * than a texture printed onto the content. Multiply on light, overlay on dark:
 * multiplying into a near-black ground does nothing at all, which is how this
 * kind of thing usually ends up invisible in half the app.
 *
 * The whole implementation is in `.grain` in globals.css; this is a component
 * only so the layout has something to render, and so it is obvious on sight
 * that there is exactly one of them.
 */
export function Grain() {
  return <div aria-hidden className="grain" />;
}
