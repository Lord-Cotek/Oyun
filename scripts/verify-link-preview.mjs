/**
 * What we can read out of a shop's page, checked against the shapes real
 * shops publish.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * The half of lib/link-preview.ts that parses is deliberately free of the
 * network, so it can be run against a shop's real markup directly. That is
 * the half that breaks — silently, months later, when a retailer changes
 * its template — and a registry whose links stop reading is a registry that
 * stops being worth keeping.
 *
 * Run it with `npm run verify:links`. When a shop stops reading, paste the
 * head of its page in as a new case rather than guessing at a fix.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jiti = require("jiti")(root, { alias: { "@": root } });
const { previewFromHtml, looksLikeWholeList, nameFromUrl } = jiti(
  path.join(root, "lib/link-preview.ts"),
);

const base = new URL("https://www.centrepointstores.com/uae/en/p/stroller-123");

const cases = [
  {
    name: "Open Graph only (the case that already worked)",
    html: `<html><head>
      <meta property="og:title" content="Baby Cot"/>
      <meta property="og:image" content="https://cdn.shop/cot.jpg"/>
      <meta property="product:price:amount" content="1200"/>
      <meta property="product:price:currency" content="AED"/>
    </head><body></body></html>`,
    want: { title: "Baby Cot", imageUrl: "https://cdn.shop/cot.jpg", price: "AED 1200" },
  },
  {
    name: "JSON-LD in the BODY, no Open Graph — the Gulf retailer case",
    html: `<html><head><title>Juniors Twin Stroller | Centrepoint UAE</title></head><body>
      <div id="app"></div>
      <script type="application/ld+json">
      {"@context":"https://schema.org","@type":"Product",
       "name":"Juniors Twin Stroller",
       "image":["https://cdn.centrepoint.com/stroller-1.jpg","https://cdn.centrepoint.com/stroller-2.jpg"],
       "offers":{"@type":"Offer","price":"499.00","priceCurrency":"AED"}}
      </script></body></html>`,
    want: {
      title: "Juniors Twin Stroller",
      imageUrl: "https://cdn.centrepoint.com/stroller-1.jpg",
      price: "AED 499.00",
    },
  },
  {
    name: "JSON-LD @graph, image as an object, offers as an array",
    html: `<html><head></head><body><script type="application/ld+json">
      {"@context":"https://schema.org","@graph":[
        {"@type":"WebSite","name":"Noon"},
        {"@type":"Product","name":"Mothercare Journey Pram",
         "image":{"@type":"ImageObject","url":"//cdn.noon.com/pram.png"},
         "offers":[{"@type":"Offer","price":899,"priceCurrency":"SAR"}]}
      ]}</script></body></html>`,
    want: {
      title: "Mothercare Journey Pram",
      imageUrl: "https://cdn.noon.com/pram.png",
      price: "SAR 899",
    },
  },
  {
    name: "An array of JSON-LD blocks, the product in the second",
    html: `<html><body>
      <script type="application/ld+json">{"@type":"BreadcrumbList","itemListElement":[]}</script>
      <script type="application/ld+json">[{"@type":"Product","name":"Sleepsuit 0-3m","image":"https://cdn.x/s.jpg"}]</script>
      </body></html>`,
    want: { title: "Sleepsuit 0-3m", imageUrl: "https://cdn.x/s.jpg", price: null },
  },
  {
    name: "Broken JSON in one block must not lose the good one",
    html: `<html><body>
      <script type="application/ld+json">{ this is not json }</script>
      <script type="application/ld+json">{"@type":"Product","name":"Steriliser","image":"https://cdn.x/st.jpg"}</script>
      </body></html>`,
    want: { title: "Steriliser", imageUrl: "https://cdn.x/st.jpg", price: null },
  },
  {
    name: "Microdata and link rel=image_src, no OG and no JSON-LD",
    html: `<html><head>
      <link rel="image_src" href="/img/mat.jpg"/>
      <title>Changing Mat - Mumzworld</title></head>
      <body><span itemprop="price" content="120"></span>
      <span itemprop="priceCurrency" content="AED"></span></body></html>`,
    want: {
      title: "Changing Mat",
      imageUrl: "https://www.centrepointstores.com/img/mat.jpg",
      price: "AED 120",
    },
  },
  {
    name: "Shop name trimmed off a long title",
    html: `<html><head><title>Juniors Baby Cot With Drop Side | Centrepoint UAE</title></head><body></body></html>`,
    want: { title: "Juniors Baby Cot With Drop Side", imageUrl: null, price: null },
  },
  {
    name: "A short title keeps its suffix rather than becoming a fragment",
    html: `<html><head><title>Cot | Centrepoint</title></head><body></body></html>`,
    want: { title: "Cot | Centrepoint", imageUrl: null, price: null },
  },
  {
    name: "Attributes in the other order, single quotes",
    html: `<html><head><meta content='https://cdn.x/a.jpg' property='og:image'/>
      <meta content='Muslin Squares' property='og:title'/></head></html>`,
    want: { title: "Muslin Squares", imageUrl: "https://cdn.x/a.jpg", price: null },
  },
  {
    name: "A javascript: image is refused",
    html: `<html><head><meta property="og:image" content="javascript:alert(1)"/>
      <meta property="og:title" content="Nope"/></head></html>`,
    want: { title: "Nope", imageUrl: null, price: null },
  },
  {
    name: "Nothing readable at all",
    html: `<html><head></head><body><p>hello</p></body></html>`,
    want: { title: null, imageUrl: null, price: null },
  },
];

let pass = 0;
for (const c of cases) {
  const got = previewFromHtml(c.html, base);
  const bad = Object.entries(c.want).filter(([k, v]) => got[k] !== v);
  if (bad.length === 0) {
    pass++;
    console.log(`  ok   ${c.name}`);
  } else {
    console.log(`  FAIL ${c.name}`);
    for (const [k, v] of bad) console.log(`         ${k}: want ${JSON.stringify(v)} got ${JSON.stringify(got[k])}`);
  }
}
console.log(`\n  ${pass}/${cases.length} passed`);
if (pass !== cases.length) process.exitCode = 1;

console.log("\n  a name guessed from the address, for shops that will not open:");
for (const [u, want] of [
  ["https://www.centrepointstores.com/ae/en/juniors-twin-stroller/p/MDAxNTc4NDQ", "Juniors Twin Stroller"],
  // Short words stay lowercase: "Next to me" reads like a name somebody
  // wrote, "Next To Me" reads like a machine capitalised it.
  ["https://www.mumzworld.com/ae-en/chicco-next-to-me-bedside-crib", "Chicco Next to me Bedside Crib"],
  ["https://www.noon.com/uae-en/baby-changing-mat-grey/N53379982A/p/", "Baby Changing Mat Grey"],
  ["https://shop.example.com/p/12345", null],
  ["https://shop.example.com/", null],
  ["https://www.amazon.ae/dp/B07XYZ1234", null],
  ["https://shop.example.com/products/cot-bed.html", "Cot Bed"],
  ["not a url", null],
]) {
  const got = nameFromUrl(u);
  const ok = got === want;
  if (!ok) process.exitCode = 1;
  console.log(`   ${ok ? "ok  " : "FAIL"} ${u}\n          -> ${JSON.stringify(got)}${ok ? "" : ` (wanted ${JSON.stringify(want)})`}`);
}

console.log("\n  whole-list detection:");
for (const [u, want] of [
  ["https://www.amazon.ae/hz/wishlist/ls/ABC", true],
  ["https://www.amazon.ae/dp/B01", false],
  ["https://www.babylist.com/baby-x", true],
  ["https://www.centrepointstores.com/uae/en/p/x", false],
]) {
  const got = looksLikeWholeList(u);
  console.log(`   ${got === want ? "ok  " : "FAIL"} ${u} -> ${got}`);
}
