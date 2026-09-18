# The browsers this has to work in

Oyun is opened on whatever phone a family already owns. That is the whole
design constraint: an iPhone 8 still on iOS 15, a five-year-old Android, a
hospital waiting room with one bar. "Works in my Chrome" is not the bar.

## The floor, and why it is where it is

`package.json` sets it explicitly rather than taking the default:

```json
"browserslist": [
  "defaults", "Safari >= 15.4", "iOS >= 15.4",
  "Firefox ESR", "Chrome >= 109", "not dead"
]
```

- **Safari / iOS 15.4** (March 2022) is the oldest release that has the `dvh`
  viewport units the layout already depends on. Below that a `100dvh` hero
  collapses to nothing, so there is no point claiming support.
- **Chrome 109** is the last version for Windows 7 and 8 and for Android 6–7.
  Leaving it in costs a handful of prefixes.
- **Firefox ESR** is what institutions and older Linux installs actually run.

Without the explicit list, the browserslist default resolves to **Safari 26 and
iOS 18.5 upward and nothing else** — about a year of devices. That is not a
theoretical difference: autoprefixer reads it, decided no prefixes were needed,
and shipped a frosted header that was not frosted on any iPhone before iOS 18
(see below).

**Changing this list changes the CSS.** After editing it, delete `.next`
entirely before rebuilding — the CSS transform is cached, and a plain rebuild
will hand you the old output and make you think nothing happened.

## What was found when this floor was set

### `-webkit-backdrop-filter` was missing everywhere

The header and the tab bar are frosted glass — `backdrop-blur` over a
translucent tint. Safari needed `-webkit-backdrop-filter` until version 18, and
autoprefixer was emitting no prefix at all because the default target list
started above that. Every iPhone before iOS 18 was showing a flat, unfrosted
bar with the page visible through it.

Fixed by the floor above. The built CSS now carries the prefixed declaration;
`grep -c -- '-webkit-backdrop-filter' .next/static/css/*.css` is the check.

### `color-mix()` had no fallback

`--glass-tint` and `--glass-hairline` are built with `color-mix()`, which lands
in Safari 16.2 and Firefox 113. An engine that cannot parse a declaration drops
it, so on anything older `--glass-tint` resolved to nothing at all and the
sticky header became transparent — the page scrolling under its own navigation,
text over text.

Both now declare a plain `rgba()` first and the `color-mix()` second. An engine
that understands the second uses it; one that does not keeps the first. Same
colours either way.

### `crypto.randomUUID` is not always there

It is defined only in a secure context — https or localhost — and not before
Safari 15.4. It was called in the photo picker, so over plain http on a LAN
address (which is exactly how somebody tests on their own phone) choosing a
picture threw and the whole compose flow died silently.

`lib/rand.ts` now falls back to `getRandomValues` and then to `Math.random`.
These ids key a React list and name an uploaded file; they are never
security-bearing, and the file says so.

## What was checked and was already right

- `navigator.share` and `navigator.canShare` are feature-detected at both call
  sites with a copy-to-clipboard fallback. Firefox on the desktop has never had
  the Web Share API, so this matters.
- Every `new Date("…")` on a string is full ISO-8601 with a `Z`, and is
  validated by a regex before and an `isNaN` check after. Safari is strict
  where V8 is lenient; these would pass in both.
- No `:has()`, no `@container`, no `Object.groupBy`, no `Promise.withResolvers`,
  no regex lookbehind — the last of which would be a parse-time `SyntaxError`
  on older Safari, taking down the whole bundle rather than one feature.

## What has not been done

**The apps have not been run in WebKit or Firefox.** Playwright's builds of both
cannot be installed in the environment this work was done in — the download
hosts are refused by the network policy and there is no system Firefox — so
everything above is a static audit against the real code, not a live run.

That audit catches the class of bug that is invisible in Chromium (missing
prefixes, unsupported properties, absent APIs). It cannot catch layout and
rendering differences: how Safari sizes flex items, where Firefox puts a form
control's baseline, whether a sticky header jumps on iOS rubber-band scroll.

Somebody with a Mac and an iPhone should walk the app once. Worth their time
first: the sticky header and tab bar while scrolling, the photo lightbox and its
pinch-zoom, `input[type="date"]` in the appointment book, and the
`dvh`-sized panels on a phone with the address bar showing and hidden.
