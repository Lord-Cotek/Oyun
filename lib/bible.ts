/**
 * The Scripture text behind the reading plans — the World English Bible (WEB),
 * a complete, modern, public-domain translation. The full text lives as compact
 * per-book JSON under `data/bible/web/` and is read on the server, one book at a
 * time, so only the passage in view is ever sent to the client.
 *
 * The divine name is rendered "the LORD" (a sanctioned WEB reading) to match the
 * app's other Scripture and the convention most families know.
 *
 * Books are loaded through a dynamic import of the JSON, so the bundler traces
 * the data into the server build automatically and none of it reaches the
 * client — only the resolved chapter is passed down as props.
 */
export type Testament = "OT" | "NT";

export interface BookMeta {
  name: string;
  slug: string;
  testament: Testament;
  chapters: number;
}

/** All 66 books in canonical order, with chapter counts. */
export const BOOKS: BookMeta[] = [
  { name: "Genesis", slug: "genesis", testament: "OT", chapters: 50 },
  { name: "Exodus", slug: "exodus", testament: "OT", chapters: 40 },
  { name: "Leviticus", slug: "leviticus", testament: "OT", chapters: 27 },
  { name: "Numbers", slug: "numbers", testament: "OT", chapters: 36 },
  { name: "Deuteronomy", slug: "deuteronomy", testament: "OT", chapters: 34 },
  { name: "Joshua", slug: "joshua", testament: "OT", chapters: 24 },
  { name: "Judges", slug: "judges", testament: "OT", chapters: 21 },
  { name: "Ruth", slug: "ruth", testament: "OT", chapters: 4 },
  { name: "1 Samuel", slug: "1samuel", testament: "OT", chapters: 31 },
  { name: "2 Samuel", slug: "2samuel", testament: "OT", chapters: 24 },
  { name: "1 Kings", slug: "1kings", testament: "OT", chapters: 22 },
  { name: "2 Kings", slug: "2kings", testament: "OT", chapters: 25 },
  { name: "1 Chronicles", slug: "1chronicles", testament: "OT", chapters: 29 },
  { name: "2 Chronicles", slug: "2chronicles", testament: "OT", chapters: 36 },
  { name: "Ezra", slug: "ezra", testament: "OT", chapters: 10 },
  { name: "Nehemiah", slug: "nehemiah", testament: "OT", chapters: 13 },
  { name: "Esther", slug: "esther", testament: "OT", chapters: 10 },
  { name: "Job", slug: "job", testament: "OT", chapters: 42 },
  { name: "Psalms", slug: "psalms", testament: "OT", chapters: 150 },
  { name: "Proverbs", slug: "proverbs", testament: "OT", chapters: 31 },
  { name: "Ecclesiastes", slug: "ecclesiastes", testament: "OT", chapters: 12 },
  { name: "Song of Solomon", slug: "songofsolomon", testament: "OT", chapters: 8 },
  { name: "Isaiah", slug: "isaiah", testament: "OT", chapters: 66 },
  { name: "Jeremiah", slug: "jeremiah", testament: "OT", chapters: 52 },
  { name: "Lamentations", slug: "lamentations", testament: "OT", chapters: 5 },
  { name: "Ezekiel", slug: "ezekiel", testament: "OT", chapters: 48 },
  { name: "Daniel", slug: "daniel", testament: "OT", chapters: 12 },
  { name: "Hosea", slug: "hosea", testament: "OT", chapters: 14 },
  { name: "Joel", slug: "joel", testament: "OT", chapters: 3 },
  { name: "Amos", slug: "amos", testament: "OT", chapters: 9 },
  { name: "Obadiah", slug: "obadiah", testament: "OT", chapters: 1 },
  { name: "Jonah", slug: "jonah", testament: "OT", chapters: 4 },
  { name: "Micah", slug: "micah", testament: "OT", chapters: 7 },
  { name: "Nahum", slug: "nahum", testament: "OT", chapters: 3 },
  { name: "Habakkuk", slug: "habakkuk", testament: "OT", chapters: 3 },
  { name: "Zephaniah", slug: "zephaniah", testament: "OT", chapters: 3 },
  { name: "Haggai", slug: "haggai", testament: "OT", chapters: 2 },
  { name: "Zechariah", slug: "zechariah", testament: "OT", chapters: 14 },
  { name: "Malachi", slug: "malachi", testament: "OT", chapters: 4 },
  { name: "Matthew", slug: "matthew", testament: "NT", chapters: 28 },
  { name: "Mark", slug: "mark", testament: "NT", chapters: 16 },
  { name: "Luke", slug: "luke", testament: "NT", chapters: 24 },
  { name: "John", slug: "john", testament: "NT", chapters: 21 },
  { name: "Acts", slug: "acts", testament: "NT", chapters: 28 },
  { name: "Romans", slug: "romans", testament: "NT", chapters: 16 },
  { name: "1 Corinthians", slug: "1corinthians", testament: "NT", chapters: 16 },
  { name: "2 Corinthians", slug: "2corinthians", testament: "NT", chapters: 13 },
  { name: "Galatians", slug: "galatians", testament: "NT", chapters: 6 },
  { name: "Ephesians", slug: "ephesians", testament: "NT", chapters: 6 },
  { name: "Philippians", slug: "philippians", testament: "NT", chapters: 4 },
  { name: "Colossians", slug: "colossians", testament: "NT", chapters: 4 },
  { name: "1 Thessalonians", slug: "1thessalonians", testament: "NT", chapters: 5 },
  { name: "2 Thessalonians", slug: "2thessalonians", testament: "NT", chapters: 3 },
  { name: "1 Timothy", slug: "1timothy", testament: "NT", chapters: 6 },
  { name: "2 Timothy", slug: "2timothy", testament: "NT", chapters: 4 },
  { name: "Titus", slug: "titus", testament: "NT", chapters: 3 },
  { name: "Philemon", slug: "philemon", testament: "NT", chapters: 1 },
  { name: "Hebrews", slug: "hebrews", testament: "NT", chapters: 13 },
  { name: "James", slug: "james", testament: "NT", chapters: 5 },
  { name: "1 Peter", slug: "1peter", testament: "NT", chapters: 5 },
  { name: "2 Peter", slug: "2peter", testament: "NT", chapters: 3 },
  { name: "1 John", slug: "1john", testament: "NT", chapters: 5 },
  { name: "2 John", slug: "2john", testament: "NT", chapters: 1 },
  { name: "3 John", slug: "3john", testament: "NT", chapters: 1 },
  { name: "Jude", slug: "jude", testament: "NT", chapters: 1 },
  { name: "Revelation", slug: "revelation", testament: "NT", chapters: 22 },
];

const BY_SLUG = new Map(BOOKS.map((b) => [b.slug, b]));

export function bookBySlug(slug: string): BookMeta | undefined {
  return BY_SLUG.get(slug);
}

/** A human reference like "John 3" or "Genesis 1". */
export function chapterRef(slug: string, chapter: number): string {
  return `${bookBySlug(slug)?.name ?? slug} ${chapter}`;
}

export interface ChapterText {
  book: string;
  slug: string;
  chapter: number;
  /** verses[i] is verse (i + 1); may contain \n for poetry line breaks. */
  verses: string[];
}

type BookFile = { name: string; slug: string; testament: Testament; chapters: string[][] };

const cache = new Map<string, BookFile>();

async function loadBook(slug: string): Promise<BookFile | null> {
  if (!BY_SLUG.has(slug)) return null;
  const hit = cache.get(slug);
  if (hit) return hit;
  try {
    // Template-literal dynamic import: webpack bundles every book JSON into the
    // server build (traced automatically) and hands back just the one requested.
    const mod = (await import(`../data/bible/web/${slug}.json`)) as {
      default: BookFile;
    };
    const parsed = mod.default;
    cache.set(slug, parsed);
    return parsed;
  } catch {
    return null;
  }
}

/** Load a single chapter's verses (World English Bible). */
export async function getChapter(
  slug: string,
  chapter: number,
): Promise<ChapterText | null> {
  const book = await loadBook(slug);
  if (!book) return null;
  const verses = book.chapters[chapter - 1];
  if (!verses) return null;
  return { book: book.name, slug: book.slug, chapter, verses };
}
