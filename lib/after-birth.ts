/**
 * After the birth: her recovery, and the baby's log for the first weeks.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * Everything written for a pregnant woman stops on the day of the birth,
 * which is the day her own body has the most to recover from and the day
 * the questions change. Is this much bleeding normal? Is the baby getting
 * enough? This page is the plain answers a good midwife gives on the home
 * visit, for the days when the midwife is not there.
 *
 * ── The two halves ───────────────────────────────────────────────────────
 * • Her recovery: what is usual in the first days, the first fortnight and
 *   up to six weeks; feeding troubles; after a caesarean; what to ask at the
 *   postnatal check. It says what is usual and what helps. What is NOT usual
 *   is on "When to call" (lib/when-to-call.ts), and this page sends her
 *   there rather than keeping a second list that could fall out of step.
 * • The baby's log: a tap for a feed, a wet nappy, a dirty one. It counts
 *   them for the day and shows how long since the last feed. It says what
 *   health services generally expect, and nothing about this baby: a count
 *   on a phone is only what somebody remembered to tap.
 *
 * ── What it is careful about ─────────────────────────────────────────────
 * • No amounts of milk, no weights, no schedules. Babies are fed when they
 *   ask, and how much a bottle holds is on the tin and in her midwife's
 *   advice, not here.
 * • It does not rank breast against bottle. Both are in the log, in the
 *   order a hand reaches for them.
 * • After a loss there is no baby's log and no word about a baby: only her
 *   own recovery.
 * • The medical words are the same for every reader. One card follows the
 *   reader's choice (lib/voice.ts): giving thanks and a dedication with
 *   faith, a welcome or naming day without. scripts/verify-care.mjs holds
 *   that.
 *
 * No database and no imports that reach one.
 */
import { isGeneral } from "@/lib/voice";

export type AfterPhase = "before" | "after-birth" | "after-loss";
export type AfterReader = "MOTHER" | "PARTNER";

export const AFTER_UPDATED = "November 2026";
export const AFTER_SOURCE =
  "Written from the World Health Organization's guidance on care after birth and what national health services advise in common.";

export interface AfterSection {
  key: string;
  title: string;
  intro?: string;
  points: string[];
}

export interface AfterGuide {
  lede: string;
  /** Shown only on her partner's screen. */
  partner: AfterSection | null;
  sections: AfterSection[];
  /** What to ask at the postnatal check. */
  check: AfterSection;
  /** The one card that follows the reader's choice. Null after a loss. */
  welcome: { title: string; body: string; verse: { text: string; ref: string } | null; link: { href: string; label: string } } | null;
  closing: string;
}

const FIRST_DAYS: AfterSection = {
  key: "first-days",
  title: "The first days",
  points: [
    "Bleeding like a heavy period, bright red, with a few small clots. It is the womb clearing itself, and it happens after a caesarean too.",
    "Cramps as the womb tightens back down, often stronger while feeding and stronger with a second baby than a first.",
    "The first milk is thick and comes in teaspoons. For a newborn's stomach that is the right amount.",
    "Passing urine can sting. Pouring warm water over yourself as you go helps.",
    "Rest when the baby rests. Nothing else in the house is urgent.",
  ],
};

const FORTNIGHT: AfterSection = {
  key: "fortnight",
  title: "The first two weeks",
  points: [
    "Around the third to fifth day the breasts fill and can feel hard and hot. Feeding often is what eases it; a warm cloth before a feed and a cool one after help.",
    "In the same days many women find themselves in tears for no reason they can name. It is so common it has a nickname, and it passes within days. If it has not lifted after two weeks, that is worth telling your midwife; the Mood check is there for exactly this.",
    "The bleeding turns from red to pink or brown and lightens. Doing too much in a day can bring a little more of it: take that as the sign to slow down.",
    "Stitches are sore for the first week or so. Keep them clean and dry, and change pads often.",
    "The first trip to the toilet is feared more than it deserves. Water, fruit and not putting it off are what help.",
  ],
};

const SIX_WEEKS: AfterSection = {
  key: "six-weeks",
  title: "Up to six weeks",
  points: [
    "The bleeding fades and usually stops by about six weeks.",
    "Tiredness is the main thing, and it is real. Sleep counts whenever it is had, in whatever pieces.",
    "Pelvic floor squeezes can begin as soon as they are comfortable, a few at a time, several times a day. Leaking when you cough or laugh is common now and is worth mentioning at the check; it is treatable.",
    "Gentle walking is good for you. Leave harder exercise until after the check.",
    "A woman can conceive again before her first period returns. Ask about contraception at the check, before it is needed.",
  ],
};

const CAESAREAN: AfterSection = {
  key: "caesarean",
  title: "After a caesarean",
  points: [
    "It was an operation, and the first weeks are a recovery from one as well as from a birth.",
    "Keep the wound clean and dry, and let air reach it. Loose clothes and high-waisted underwear are kinder to it.",
    "Lift nothing heavier than the baby until you have been checked. Let other people carry.",
    "Hold a pillow against the wound to cough, laugh or get up.",
    "Take the pain relief you were given, as you were told to. Moving a little, often, helps healing.",
  ],
};

const FEEDING: AfterSection = {
  key: "feeding",
  title: "Feeding",
  intro: "However you are feeding, the first weeks are a skill being learned by two people, one of whom is new to everything.",
  points: [
    "A newborn feeds often: at least eight times in a day and a night is usual, and sometimes in a cluster. Feed when the baby asks, not by the clock.",
    "At the breast, pain that lasts through a feed usually means the baby is not on deeply enough. It can be put right. Ask your midwife or a breastfeeding helper early; it is the commonest reason women stop before they wanted to.",
    "Wet and dirty nappies are how you know milk is going in. From about the fifth day, at least six wet nappies a day is what health services generally expect.",
    "With a bottle, make up each feed exactly as the tin says, with safe water, and hold the baby close to feed. A bottle is never propped.",
    "If feeding is not going as you hoped, that is not a failure of yours. Say so to your midwife; there is help for it either way.",
  ],
};

const LOSS_BODY: AfterSection = {
  key: "loss-body",
  title: "Your body, in the weeks after",
  intro: "Your body recovers as it would after any birth, and nobody may have told you what to expect.",
  points: [
    "Bleeding like a heavy period that lightens over days and weeks.",
    "Cramps as the womb tightens back down.",
    "Milk may come in, around the third to fifth day. Nobody warns of this, and it is hard. Ask your midwife or doctor how to ease it; it settles.",
    "Tiredness that sleep does not mend straight away. Rest, and let people do things for you.",
    "A follow-up appointment is usual. It is a good place for every question, including the ones about why.",
  ],
};

const CHECK: AfterSection = {
  key: "check",
  title: "At the postnatal check",
  intro: "Usually about six weeks after the birth. Write your questions in the appointment beforehand; these are the ones worth asking.",
  points: [
    "Has the bleeding stopped as it should, and is the wound or the stitches healed?",
    "My mood, honestly: how I have been sleeping, and how I have been feeling.",
    "Contraception, and when it is needed from.",
    "Leaking, or any heaviness or pain down below.",
    "Feeding: anything that still hurts or worries me.",
    "If my blood pressure or blood sugar was raised in pregnancy, what needs checking now.",
    "When I can go back to exercise, and to everything else.",
  ],
};

const CHECK_LOSS: AfterSection = {
  key: "check",
  title: "At the follow-up appointment",
  intro: "Write your questions in the appointment beforehand, so they are not lost on the day.",
  points: [
    "Has my body recovered as it should?",
    "My mood, honestly: how I have been sleeping, and how I have been feeling.",
    "Is there anything known about why, and are there tests that could say more?",
    "What it means for another pregnancy, and when it would be safe to try.",
    "Who I can talk to, and what support there is.",
  ],
};

function partnerSection(name: string, phase: AfterPhase): AfterSection {
  return phase === "after-loss"
    ? {
        key: "partner",
        title: `What helps ${name} now`,
        points: [
          "Her body is recovering from a birth while both of you grieve. Make sure she rests and eats.",
          "Go with her to the follow-up appointment, and write the answers down.",
          "Know the signs on When to call. You may be the one who notices.",
          "You have lost something too. You are allowed to need help as well.",
        ],
      }
    : {
        key: "partner",
        title: `What helps ${name} most`,
        points: [
          "Guard her sleep. Take the baby after a feed, and take the nappies at night.",
          "Feed her, and keep water within her reach wherever she feeds.",
          "Stand at the door for her: visitors when she wants them, and for as long as she wants.",
          "Know the signs on When to call. Everybody is watching the baby; you watch her.",
          "Ask how she is, more than once, and wait for the second answer.",
        ],
      };
}

/**
 * The page, for one reader.
 *
 * @param voice only decides the words of the welcome card.
 */
export function afterGuide(
  phase: AfterPhase,
  reader: AfterReader,
  voice: string | null | undefined,
  motherName: string,
): AfterGuide {
  const her = reader === "PARTNER";
  const name = motherName.trim().split(/\s+/)[0] || "her";
  const general = isGeneral(voice);

  if (phase === "after-loss") {
    return {
      lede: her ? `${name}'s body is still recovering. This is what is usual, and what helps.` : "Your body is still recovering. This is what is usual, and what helps.",
      partner: her ? partnerSection(name, phase) : null,
      sections: [LOSS_BODY],
      check: CHECK_LOSS,
      welcome: null,
      closing: "What is not usual is on When to call. If something worries you and it is not there, call anyway.",
    };
  }

  return {
    lede:
      phase === "before"
        ? her
          ? `What the first weeks after the birth are like for ${name}, to read before they arrive.`
          : "What the first weeks after the birth are like, to read before they arrive."
        : her
          ? `What is usual for ${name} in these weeks, what helps, and a log for the baby's feeds and nappies.`
          : "What is usual in these weeks, what helps, and a log for the baby's feeds and nappies.",
    partner: her ? partnerSection(name, phase) : null,
    sections: [FIRST_DAYS, FORTNIGHT, SIX_WEEKS, FEEDING, CAESAREAN],
    check: CHECK,
    welcome: general
      ? {
          title: "Welcoming the baby",
          body: "A naming day or a gathering to welcome the baby can wait until you are ready for it. When you are, the day can be planned and its invitations sent from Appointments.",
          verse: null,
          link: { href: "/appointments", label: "Plan the day" },
        }
      : {
          title: "Giving thanks",
          body: "A thanksgiving or a dedication can wait until you are ready for it. When you are, the day can be planned and its invitations sent from Appointments.",
          verse: { text: "Behold, children are a heritage of the LORD. The fruit of the womb is his reward.", ref: "Psalm 127:3" },
          link: { href: "/appointments", label: "Plan the day" },
        },
    closing: "What is not usual is on When to call. If something worries you and it is not there, call anyway.",
  };
}

// ── The baby's log ──────────────────────────────────────────────────────────

export const LOG_KINDS = ["FEED", "WET", "DIRTY"] as const;
export type LogKind = (typeof LOG_KINDS)[number];
export const FEED_HOWS = ["LEFT", "RIGHT", "BOTH", "BOTTLE"] as const;
export type FeedHow = (typeof FEED_HOWS)[number];

export const HOW_LABEL: Record<FeedHow, string> = { LEFT: "Left breast", RIGHT: "Right breast", BOTH: "Both breasts", BOTTLE: "Bottle" };
export const KIND_LABEL: Record<LogKind, string> = { FEED: "Feed", WET: "Wet nappy", DIRTY: "Dirty nappy" };

export const isLogKind = (v: unknown): v is LogKind => typeof v === "string" && (LOG_KINDS as readonly string[]).includes(v);
export const isFeedHow = (v: unknown): v is FeedHow => typeof v === "string" && (FEED_HOWS as readonly string[]).includes(v);

/** More than anybody taps in the first months; past it, old lines are cleared first. */
export const LOG_MAX = 4000;

/** Said under the log, always. General, and about no baby in particular. */
export const LOG_EXPECT =
  "From about the fifth day, health services generally expect at least eight feeds and at least six wet nappies in a day and a night. Far fewer than that is a reason to ring your midwife today, not to wait.";

export interface LogEntry {
  id: string;
  kind: string;
  how: string | null;
  childId: string | null;
  /** ISO time. */
  at: string;
}

/**
 * A time sent by the phone, made safe: not in the future, and not more than
 * two days back (a line for "this morning" is fine; a made-up date is not).
 */
export function cleanLogTime(at: string | null | undefined, now: Date): Date {
  if (!at) return now;
  const t = new Date(at).getTime();
  if (!Number.isFinite(t)) return now;
  if (t > now.getTime() + 60_000 || t < now.getTime() - 48 * 3600_000) return now;
  return new Date(t);
}

export interface DayCount {
  feeds: number;
  wet: number;
  dirty: number;
}

/** How many of each between two moments (the reader's own day). */
export function countBetween(entries: LogEntry[], fromMs: number, toMs: number): DayCount {
  const c: DayCount = { feeds: 0, wet: 0, dirty: 0 };
  for (const e of entries) {
    const t = new Date(e.at).getTime();
    if (t < fromMs || t >= toMs) continue;
    if (e.kind === "FEED") c.feeds++;
    else if (e.kind === "WET") c.wet++;
    else if (e.kind === "DIRTY") c.dirty++;
  }
  return c;
}

/** The latest feed, if any: when, and from which side. */
export function lastFeed(entries: LogEntry[]): LogEntry | null {
  let best: LogEntry | null = null;
  for (const e of entries) if (e.kind === "FEED" && (!best || e.at > best.at)) best = e;
  return best;
}

/** 7 800 000 ms → "2 h 10 min"; under an hour → "35 min"; under a minute → "just now". */
export function ago(ms: number): string {
  const m = Math.max(0, Math.floor(ms / 60_000));
  if (m < 1) return "just now";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h} h ${m % 60} min` : `${h} h`;
}
