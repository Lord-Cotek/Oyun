/**
 * The mood check — eleven questions about the last two weeks.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * Low mood and anxiety are among the most common complications of pregnancy
 * and the year after a birth, and the ones least often spoken of. A woman
 * who would never ring a doctor to say "I am not all right" will sometimes
 * answer eleven questions on her own phone at midnight. This gives her the
 * questions health services themselves use, an honest reading of her
 * answers, and a plain next step.
 *
 * ── Which questions, and why these ───────────────────────────────────────
 * The PHQ-9 (nine questions on low mood) and the first two questions of the
 * GAD-7 (worry). They were developed by Drs Robert L. Spitzer, Janet B. W.
 * Williams, Kurt Kroenke and colleagues, are used in maternity care around
 * the world, and may be reproduced, translated, displayed and distributed
 * without permission. The questionnaire most often named for new mothers,
 * the Edinburgh scale, may not be put into an app without the written
 * permission of its copyright holder, so it is not used here. The wording of
 * every question below is the published wording, unchanged: a screening
 * questionnaire is only what it was tested as if its words are left alone.
 *
 * ── What it is careful about ─────────────────────────────────────────────
 * • It is hers alone. Only the mother can take it. Her circle and the
 *   assistant never see anything of it. Her doctor, and her partner, each
 *   see a result only if she switches that on for that one result. Her
 *   partner is then shown what it comes to and what helps her, in words
 *   written to him — never her answers one by one.
 * • Keeping a result is her choice each time. One she does not keep is
 *   worked out on her phone by the functions in this file and never reaches
 *   the server. That is why this file has no database in it.
 * • It is a screening questionnaire, not a diagnosis. No result names an
 *   illness. Each says what her answers are in the range of, and what to do.
 * • Any answer but "not at all" to the question about thoughts of self-harm
 *   comes first on the result, above everything else, with what to do today.
 * • It is offered, never pushed: no reminder and no notification asks her to
 *   take it.
 * • The two kinds of reader (lib/voice.ts). The questions, the scoring and
 *   what to do are the same for everybody. A reader who chose Oyun with
 *   faith is also told, plainly, that asking for help is not a lack of
 *   faith — low mood is sometimes read as a spiritual failing, and that
 *   belief keeps women from care. Prayer is never offered in place of help:
 *   the line about her doctor always comes first. scripts/verify-care.mjs
 *   holds all of this.
 */
import { isGeneral } from "@/lib/voice";

export const MOOD_STEM = "Over the last two weeks, how often have you been bothered by any of the following problems?";

export const MOOD_OPTIONS = ["Not at all", "Several days", "More than half the days", "Nearly every day"] as const;

/** The published wording, unchanged. The first nine are the PHQ-9; the last two are the GAD-2. */
export const MOOD_QUESTIONS: string[] = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way",
  "Feeling nervous, anxious or on edge",
  "Not being able to stop or control worrying",
];

/** Which question (counting from 0) asks about thoughts of self-harm. */
export const SELF_HARM_AT = 8;
const LOW_COUNT = 9;

export const MOOD_ATTRIBUTION =
  "The questions are the PHQ-9 and the first two of the GAD-7, developed by Drs Robert L. Spitzer, Janet B. W. Williams, Kurt Kroenke and colleagues. They are a screening questionnaire used by health services, not a diagnosis.";

/** How many kept results one mother can have; the oldest go first. */
export const MOOD_KEPT_MAX = 24;

export interface MoodScore {
  /** 0 to 27. */
  low: number;
  /** 0 to 6. */
  worry: number;
  /** Her answer to the self-harm question, 0 to 3. */
  selfHarm: number;
}

/** Eleven answers, each 0 to 3 — or null if that is not what was sent. */
export function cleanAnswers(raw: unknown): number[] | null {
  if (!Array.isArray(raw) || raw.length !== MOOD_QUESTIONS.length) return null;
  const out: number[] = [];
  for (const x of raw) {
    if (typeof x !== "number" || !Number.isInteger(x) || x < 0 || x > 3) return null;
    out.push(x);
  }
  return out;
}

export function scoreMood(answers: number[]): MoodScore {
  const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  return {
    low: sum(answers.slice(0, LOW_COUNT)),
    worry: sum(answers.slice(LOW_COUNT)),
    selfHarm: answers[SELF_HARM_AT] ?? 0,
  };
}

export type MoodPhase = "pregnancy" | "after-birth" | "after-loss";
export type MoodLevel = "clear" | "watch" | "talk" | "soon";

/** The published bands of the PHQ-9, by what to do rather than by a name. */
export function moodLevel(low: number): MoodLevel {
  return low >= 15 ? "soon" : low >= 10 ? "talk" : low >= 5 ? "watch" : "clear";
}

/** The published cut-off of the GAD-2. */
export const worryRaised = (worry: number) => worry >= 3;

export interface MoodResult {
  level: MoodLevel;
  /** Set when she answered anything but "not at all" about self-harm. Shown first. */
  urgent: { title: string; body: string[] } | null;
  title: string;
  body: string[];
  /** Small print under it: the two numbers, as a doctor would read them. */
  figures: string;
  /** With faith only, and never before the line about her doctor. */
  faithLine: string | null;
  /** The room where she can ask her circle for support, under its name for this reader. */
  room: { href: string; label: string };
}

const TITLE: Record<MoodLevel, string> = {
  clear: "Nothing in your answers points to low mood just now.",
  watch: "Some low days in the last two weeks.",
  talk: "Worth a conversation with your midwife or doctor.",
  soon: "Please talk to your midwife or doctor this week.",
};

/**
 * What her answers come to, in words.
 *
 * @param voice only adds the line about faith, and names the support room.
 */
export function moodResult(score: MoodScore, phase: MoodPhase, voice: string | null | undefined): MoodResult {
  const level = moodLevel(score.low);
  const general = isGeneral(voice);
  const body: string[] = [];

  if (level === "clear") {
    body.push("This is a picture of two weeks, not a verdict on you. If things change, come back to it.");
  } else if (level === "watch") {
    body.push(
      "That is common, and it often lifts. Look after the plain things: sleep where you can get it, food, a walk, somebody to talk to. Take this again in two weeks.",
      "If it is no better then, or it gets worse sooner, tell your midwife or doctor.",
    );
  } else if (level === "talk") {
    body.push(
      "Your answers are in the range where health services ask to hear about it. It does not mean something is wrong with you. It means you should not be carrying this by yourself.",
      "Tell your midwife or doctor at your next appointment, or sooner. Showing them this result is an easy way to begin.",
    );
  } else {
    body.push(
      "Your answers say the last two weeks have been heavy. This is common in pregnancy and after a birth. It is not a failing, and it is treatable.",
      "Ring your midwife or doctor rather than waiting for the next appointment. Showing them this result is an easy way to begin.",
    );
  }

  if (worryRaised(score.worry)) {
    body.push(
      level === "clear"
        ? "Your answers about worry, though, are in the range worth mentioning to your midwife or doctor."
        : "Your answers about worry are in that range too. Say so when you speak to them.",
    );
  }

  if (level !== "clear") {
    body.push(
      phase === "after-loss"
        ? "After a loss, feeling like this is not an illness in itself; grief looks like this. This check cannot tell the two apart. What matters is that you are not left to carry it alone."
        : phase === "after-birth"
          ? "Sleep, tiredness and appetite are upended by a new baby anyway, and that can raise the number. It is still worth saying out loud."
          : "Sleep, tiredness and appetite change in pregnancy anyway, and that can raise the number. It is still worth saying out loud.",
    );
  }

  const urgent =
    score.selfHarm > 0
      ? {
          title: "You said you have had thoughts of being better off dead, or of hurting yourself.",
          body: [
            "Please tell somebody today: your partner, somebody you trust, your midwife or your doctor. Saying it once, out loud, is the hardest part.",
            "If you might act on these thoughts, call your local emergency number or go to the nearest hospital now.",
            "These thoughts are a symptom. They are more common than anybody says, and they pass with help.",
          ],
        }
      : null;

  return {
    level,
    urgent,
    title: TITLE[level],
    body,
    figures: `Low mood ${score.low} of 27 · Worry ${score.worry} of 6`,
    // Only when there is something to act on, and always after the words about her doctor.
    faithLine:
      !general && (level !== "clear" || urgent !== null || worryRaised(score.worry))
        ? "Asking for help is not a lack of faith. Seeing a doctor for your mind is no different from seeing one for your body, and you can pray and be treated at once."
        : null,
    room: general ? { href: "/prayer", label: "Ask your circle for support" } : { href: "/prayer", label: "Ask your circle to pray" },
  };
}

/** What the page says before the questions, for this point in her journey. */
export function moodIntro(phase: MoodPhase): string[] {
  return [
    phase === "after-loss"
      ? "Eleven questions about the last two weeks. After a loss, there is no right way to feel; this is only a way of seeing how heavy it is."
      : phase === "after-birth"
        ? "Eleven questions about the last two weeks. Many mothers feel low or anxious in the year after a birth. It is common, and it is treatable."
        : "Eleven questions about the last two weeks. Many women feel low or anxious in pregnancy. It is common, and it is treatable.",
    "It takes about two minutes. Nobody is sent your answers. Nobody in your circle can ever see them, and your partner sees a result only if you choose to show him that one.",
  ];
}

/**
 * One result she chose to show her partner, in words written to him.
 *
 * The same reading of the same numbers, and the same order: anything urgent
 * first, then what her answers come to, then what helps. It is about what he
 * can do, because that is the reason she showed him. It never lists her
 * answers, and it never asks him to fix her.
 *
 * @param voice his own choice. With faith he is told that praying with her
 *   and getting her to a doctor are not rivals — the doctor first.
 */
export function moodResultForPartner(
  score: MoodScore,
  phase: MoodPhase,
  voice: string | null | undefined,
  motherName: string,
): MoodResult {
  const level = moodLevel(score.low);
  const name = motherName.trim().split(/\s+/)[0] || "She";
  const body: string[] = [];
  let title: string;

  if (level === "clear") {
    title = `Nothing in ${name}'s answers points to low mood just now.`;
    body.push("She chose to show you this. That is worth a thank-you by itself.");
  } else if (level === "watch") {
    title = `${name} has had some low days in the last two weeks.`;
    body.push(
      "That is common, and it often lifts. What helps is plain: guard her sleep, take something off her hands, ask how she is and listen to the answer.",
      "If it is no better in two weeks, help her tell her midwife or doctor.",
    );
  } else if (level === "talk") {
    title = `${name}'s answers are in the range worth a conversation with her midwife or doctor.`;
    body.push(
      "Showing you this was not easy. Do not try to fix it or talk her out of it. Ask what would help, and offer to go with her to the appointment.",
      "It does not mean something is wrong with her, or between the two of you.",
    );
  } else {
    title = `${name}'s answers say the last two weeks have been heavy.`;
    body.push(
      "This is common in pregnancy and after a birth. It is not a failing, and it is treatable.",
      "Help her ring her midwife or doctor this week rather than waiting, and go with her if she will let you.",
    );
  }

  if (worryRaised(score.worry)) {
    body.push(level === "clear" ? "Her answers about worry, though, are in the range worth mentioning to her midwife or doctor." : "Her answers about worry are in that range too.");
  }
  if (level !== "clear" && phase === "after-loss") {
    body.push("After a loss, feeling like this is not an illness in itself; grief looks like this. You are grieving too. Neither of you should carry it alone.");
  }

  const urgent =
    score.selfHarm > 0
      ? {
          title: `${name} said she has had thoughts of being better off dead, or of hurting herself.`,
          body: [
            "She has told you. Take it seriously, stay calm, and thank her for saying it.",
            "Help her tell her midwife or doctor today. If she might act on these thoughts, stay with her, and call your local emergency number or take her to the nearest hospital now.",
            "These thoughts are a symptom. They pass with help.",
          ],
        }
      : null;

  return {
    level,
    urgent,
    title,
    body,
    figures: `Low mood ${score.low} of 27 · Worry ${score.worry} of 6`,
    faithLine:
      !isGeneral(voice) && (level !== "clear" || urgent !== null || worryRaised(score.worry))
        ? "Praying with her and getting her to a doctor are not rivals. Do both, and the doctor first."
        : null,
    room: { href: "/health/when-to-call", label: "What to look for, and who to call" },
  };
}
