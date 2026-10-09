# The language of the app

Oyun speaks British English. The Bible it quotes does not. Both of those are
deliberate, and the line between them is the whole of this document.

## The rule

**Our words are British. Quoted words are left exactly as they were given.**

| | Spelling |
| --- | --- |
| Every reflection, prayer, question, button, heading, error and email we wrote | British — *colour*, *honour*, *centre*, *towards*, *fulfil*, *recognise*, *grey* |
| Anything quoted from the World English Bible | American, untouched — *color*, *honor*, *gray*, *fulfill*, *toward* |
| Code | American, untouched — CSS `color`, Tailwind `gray-500`, DOM `textAlign: "center"` |

## What counts as a quotation

Three things, and they are never rewritten:

1. **`read.text`** in `lib/worship.ts`, and `verse.text` in `lib/journey.ts` and
   `lib/daily.ts` — plus any `lyrics` or `line` field. These are printed to the
   family as Scripture. They are the WEB's words.
2. **`data/bible/web/*.json`** — the shipped text itself.
3. **Anything inside quotation marks** in our own prose. If a comment or a
   reflection puts `"Confess your offenses to one another"` in quotes, the
   quotation marks are a promise that those are somebody else's words.

There is a fourth, subtler case. A reflection usually opens by restating the
verse printed directly above it:

```ts
read: { text: "Even to old age I am he, and even to gray hairs I will carry you…" },
reflection:
  "Even to old age I am he, and even to gray hairs I will carry you. I have made,
   and I will bear. God commits to carrying us in old age — the season when we
   are least able to carry ourselves.",
```

The opening sentence is an unmarked echo of the verse, and it stays American
too. A family reading that screen would otherwise see *gray hairs* in the
reading and *grey hairs* four lines below it, and wonder which one was the
mistake. Where the echo ends and our commentary begins, British resumes — as it
does at *"God commits to carrying us"* above.

## Vocabulary, not just spelling

Spelling is the easy half. A British family notices *diaper*, *stroller* and
*pacifier* faster than they notice *color*. Write *nappy*, *pushchair*, *dummy*,
*torch*, *cot*. The same applies to *mom*, *closet*, *vacation* and *math*.

Again, not in a quotation: Genesis 4:1 has Eve say *"I have gotten a man with
the LORD's help"*, and that stays exactly as it is.

## Words we deliberately did not change

- **license / licence** — the noun is *licence* but the verb is *license* in
  British English too, and *MIT License* is a proper noun.
- **practice** — same split (*practice* the noun, *practise* the verb). The apps
  use both correctly already.
- **judgement** — both spellings are standard British; we are consistent on
  *judgement*.
- **dialog** — the HTML element. Our prose says *conversation* anyway.
