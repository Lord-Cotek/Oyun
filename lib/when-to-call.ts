/**
 * "When to call" — the signs that should not wait, for pregnancy and for the
 * weeks after a birth.
 *
 * ── Why this page exists ─────────────────────────────────────────────────
 * The health log already flags a reading that cannot wait. But most warning
 * signs are never a reading: a headache that will not lift, a leg that has
 * gone hot, a baby who is quiet today. And after the birth, when everybody's
 * eyes are on the baby, the mother's own signs are the ones that get missed.
 * This is one page, one tap from anywhere in Health, that says plainly which
 * things mean "call now" and which mean "call today".
 *
 * ── What it is careful about ─────────────────────────────────────────────
 * • It never diagnoses and never names what a sign "is". It says what to do.
 * • It gives no telephone number of its own. Oyun is used in many countries;
 *   the only numbers on the page are the ones the family typed on her health
 *   card, and "your local emergency number".
 * • The only figures are the ones health services everywhere agree on: a
 *   temperature of 38°C (100.4°F), a pad soaked in an hour.
 * • It reads the same whoever opens it. These are medical facts, so nothing
 *   here follows the reader's faith choice (lib/voice.ts), and there is no
 *   verse and no encouragement on it for anybody: nothing should stand
 *   between a frightened person and the line that says "call".
 *   scripts/verify-care.mjs holds it to that.
 * • Her partner reads the same signs, told that he may be the first to see
 *   them. Only the sentences around the lists change.
 *
 * ── Where the lists come from ────────────────────────────────────────────
 * The danger signs the World Health Organization asks every pregnant woman
 * and new mother to be taught, and the urgent warning signs national
 * maternity services publish. They agree with each other; where one service
 * says something the others do not, it is not here.
 *
 * No database and no imports: plain words in, plain words out.
 */

export type CallPhase = "pregnancy" | "after-birth" | "after-loss";
export type CallReader = "MOTHER" | "PARTNER";

/** How fast: an ambulance, a call today, or a conversation this week. */
export type CallTone = "now" | "today" | "soon";

export interface CallGroup {
  key: string;
  tone: CallTone;
  /** A short label above the heading: "Her body", "Feelings", "The baby". */
  about: string;
  title: string;
  intro?: string;
  signs: string[];
  /** Said under the list. */
  after?: string;
}

export interface CallPage {
  lede: string;
  groups: CallGroup[];
  closing: string[];
}

/** When the words were last gone through. Shown on the page. */
export const CALL_UPDATED = "November 2026";

export const CALL_SOURCE =
  "Written from the danger signs the World Health Organization asks every pregnant woman and new mother to know, and the urgent warning signs national maternity services publish.";

/** A directory of crisis lines by country. An address only: nothing is sent to it. */
export const HELPLINE_DIRECTORY = { label: "findahelpline.com", href: "https://findahelpline.com" };

const NOW_AFTER = "Do not drive yourself. If no ambulance can come, get to the nearest hospital however you can.";

export function whenToCall(phase: CallPhase, reader: CallReader, motherName: string): CallPage {
  const her = reader === "PARTNER";
  const name = motherName.trim().split(/\s+/)[0] || "her";
  // "you" on her screen; her name on his.
  const body = her ? `${name}'s body` : "Your body";

  const groups: CallGroup[] = [];

  if (phase === "pregnancy") {
    groups.push({
      key: "preg-now",
      tone: "now",
      about: body,
      title: "Call your local emergency number now",
      signs: [
        "Heavy bleeding from the vagina",
        "A fit (seizure), or fainting and not coming round quickly",
        "Trouble breathing, or pain in the chest",
        "Severe pain in the belly that does not ease",
        "The waters breaking with something felt in the vagina, or a cord seen",
      ],
      after: NOW_AFTER,
    });
    groups.push({
      key: "preg-today",
      tone: "today",
      about: body,
      title: "Call the maternity unit or doctor today",
      intro: her
        ? `Day or night. Do not let ${name} wait until tomorrow or until the next appointment to mention any of these.`
        : "Day or night. Do not wait until tomorrow, or until your next appointment, to mention any of these.",
      signs: [
        "Any bleeding from the vagina",
        "Fluid leaking or trickling from the vagina",
        "The baby moving less than usual, or the usual pattern changing",
        "A headache that will not go away, or keeps getting worse",
        "Changes in vision: blurring, flashing lights, spots",
        "Sudden swelling of the face, hands or feet",
        "Pain just under the ribs",
        "A temperature of 38°C (100.4°F) or higher, or shivering and chills",
        "Regular tightenings or contractions before 37 weeks",
        "Vomiting that will not stop, with nothing staying down",
        "Pain or burning when passing urine",
        "One leg swollen, red, hot or painful",
        "Itching all over, worst on the palms and soles, with no rash",
        "Dizziness or fainting",
        "A fall, a blow to the belly, or a road accident, even if all seems well",
      ],
      after: "If you cannot reach them, call your local emergency number.",
    });
  } else {
    const loss = phase === "after-loss";
    groups.push({
      key: "after-now",
      tone: "now",
      about: body,
      title: "Call your local emergency number now",
      signs: [
        "Bleeding that soaks a pad in an hour, or passing large clots",
        "Trouble breathing, or pain in the chest",
        "A fit (seizure), or fainting and not coming round quickly",
        "Coughing up blood",
      ],
      after: NOW_AFTER,
    });
    groups.push({
      key: "after-today",
      tone: "today",
      about: body,
      title: loss ? "Call the doctor or the hospital today" : "Call the maternity unit or doctor today",
      intro: loss
        ? her
          ? `In the six weeks after, ${name}'s body is still recovering. These signs matter as much now as they would after any birth.`
          : "In the six weeks after, your body is still recovering. These signs matter as much now as they would after any birth."
        : her
          ? `For the six weeks after the birth, and sometimes longer. Everybody is watching the baby; you may be the one who notices ${name}.`
          : "For the six weeks after the birth, and sometimes longer. Everybody is watching the baby; these are about you.",
      signs: [
        "A temperature of 38°C (100.4°F) or higher, or shivering and chills",
        "Bleeding that gets heavier instead of lighter, or smells bad",
        "A headache that will not go away, or keeps getting worse",
        "Changes in vision: blurring, flashing lights, spots",
        "One leg swollen, red, hot or painful",
        "Severe pain in the belly",
        "A wound or stitches turning red, swelling, opening, oozing or hurting more",
        "A red, hot, hard and painful area in a breast, with a fever or feeling as if flu is coming",
        "Pain or burning when passing urine, or not being able to pass urine",
        "Being too weak or too tired to look after herself",
      ].map((s) => (her ? s : s.replace("look after herself", "look after yourself"))),
      after: "If you cannot reach them, call your local emergency number.",
    });
  }

  // ── Feelings: the same in every phase, with grief said as grief ─────────
  groups.push({
    key: "mind-now",
    tone: "now",
    about: "Feelings",
    title: "Get help now",
    signs: her
      ? [
          `${name} speaks of harming herself${phase === "after-birth" ? " or the baby" : ""}, or of not wanting to be here`,
          "She sees or hears things that others do not, or believes things that are plainly not so",
          "She is very confused, or has not slept for days and seems wired, not tired",
        ]
      : [
          `Thoughts of harming yourself${phase === "after-birth" ? " or the baby" : ""}, or of not wanting to be here`,
          "Seeing or hearing things that others do not",
          "Feeling very confused, or not sleeping for days and feeling wired, not tired",
        ],
    after: her
      ? "Stay with her. Call your local emergency number or take her to the nearest hospital. This is an illness, it comes on fast, and it is treatable."
      : "Tell somebody near you now, and call your local emergency number or go to the nearest hospital. This is an illness, not a failing, and it is treatable.",
  });
  groups.push({
    key: "mind-soon",
    tone: "soon",
    about: "Feelings",
    title: her ? "Ask her, and help her tell the doctor or midwife this week" : "Tell your doctor or midwife this week",
    intro:
      phase === "after-loss"
        ? her
          ? "Grief is not an illness, and it has no timetable. These are the signs that she should not be carrying it without help."
          : "Grief is not an illness, and it has no timetable. These are the signs that you should not be carrying it without help."
        : her
          ? "She may not say it. Many mothers feel like this during pregnancy or in the year after a birth."
          : "Many mothers feel like this during pregnancy or in the year after a birth. It is common, and it is treatable.",
    signs: [
      "Feeling low, tearful or numb for most of the day, for two weeks or more",
      "Worry or panic that will not settle",
      "Not being able to sleep even when there is the chance",
      phase === "after-loss"
        ? "Not eating, or not being able to do the ordinary things of a day"
        : "Frightening thoughts that keep coming back",
      ...(phase === "after-birth" ? ["Feeling nothing for the baby, or feeling the baby would be better off without her"] : []),
    ].map((s) => (her ? s : s.replace("without her", "without you"))),
    after: "This is not weakness and nobody has failed. It is worth saying out loud to somebody who can help.",
  });

  // ── The baby, in the first weeks ─────────────────────────────────────────
  if (phase === "after-birth") {
    groups.push({
      key: "baby-now",
      tone: "now",
      about: "The baby",
      title: "Call your local emergency number now",
      signs: [
        "Lips or tongue turning blue or grey",
        "Struggling to breathe, grunting with each breath, or long pauses in breathing",
        "A fit (seizure)",
        "Floppy, or cannot be woken",
      ],
    });
    groups.push({
      key: "baby-today",
      tone: "today",
      about: "The baby",
      title: "Call the doctor or midwife today",
      intro: "In the first weeks a baby can become unwell quickly. None of these should wait for a routine visit.",
      signs: [
        "Not feeding well, or refusing feeds",
        "A temperature of 38°C (100.4°F) or higher, or a baby who feels cold to the touch",
        "Yellow skin or eyes in the first day of life",
        "Yellowness that spreads or deepens, or comes with a very sleepy baby",
        "Far fewer wet nappies than usual",
        "Green vomit, or vomiting that shoots out again and again",
        "The cord stump red, swollen, oozing or smelling",
        "A cry that is weak, high-pitched or not like their own",
        "Much sleepier than usual and hard to wake for feeds",
      ],
      after: "If you cannot reach them, call your local emergency number.",
    });
  }

  const lede =
    phase === "pregnancy"
      ? her
        ? `The signs in pregnancy that should not wait. You may be the first to notice one in ${name}.`
        : "The signs in pregnancy that should not wait until the next appointment."
      : phase === "after-birth"
        ? her
          ? `The signs in the weeks after a birth that should not wait: in ${name}, and in the baby.`
          : "The signs in the weeks after a birth that should not wait: in you, and in the baby."
        : her
          ? `The signs in the weeks after that should not wait. ${name}'s own health still matters.`
          : "The signs in the weeks after that should not wait. Your own health still matters.";

  const closing = [
    "If you are worried and it is not on this page, call anyway. Nobody on a maternity ward minds being asked.",
    "This page is not a diagnosis and cannot see you. It lists the signs every maternity service asks families to act on.",
  ];

  return { lede, groups, closing };
}

/**
 * Split a line somebody typed ("St Mary's, Dr Bello 0803 555 0101") into text
 * and telephone numbers, so a number on the page can be tapped to call.
 *
 * Deliberately cautious: at least seven digits, so a house number or a year
 * is never turned into a call.
 */
export function phoneParts(text: string): { text: string; tel?: string }[] {
  const out: { text: string; tel?: string }[] = [];
  const re = /\+?\d[\d\s().-]{5,}\d/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    const digits = m[0].replace(/[^\d+]/g, "");
    if (digits.replace("+", "").length < 7 || digits.replace("+", "").length > 15) continue;
    const at = m.index ?? 0;
    if (at > last) out.push({ text: text.slice(last, at) });
    out.push({ text: m[0], tel: digits });
    last = at + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}
