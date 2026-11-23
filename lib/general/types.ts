/**
 * The shapes of Oyun's words for people who chose "without religious
 * content" at sign-up — see lib/voice.ts.
 *
 * Each mirrors a faith-voiced original, field for field, so a page can ask
 * for "this stage, in this person's voice" and get back something it renders
 * the same way. The developmental facts are never rewritten here: a stage's
 * general `body` says everything the original body says about the baby and
 * the mother's body, and only the faith language is replaced.
 */

/** One week or month of the journey, written without religious language. */
export interface GeneralStage {
  /** Only set when the original title carries faith language. */
  title?: string;
  /** The stage's description — same facts as the original, faith lines replaced. */
  body: string;
  /** Shown where the verse sits: a short line of encouragement in the app's own words. */
  thought: string;
  reflection: string;
  /** Only set when the original's line carried faith language. */
  newThisStage?: string;
  action: string;
  partnerFocus: string;
  /** Stands in for the prayer point: a hope the family and circle can hold this stage. */
  hope: string;
}

/** A daily word, standing in for the day's verse. */
export interface GeneralWord {
  text: string;
  /** A two-to-four word theme, shown where a verse reference would be ("On rest"). */
  theme: string;
  reflection: string;
}

/** A morning word for the days after a loss, standing in for the day's lament. */
export interface GeneralGrief {
  text: string;
  theme: string;
  reflection: string;
}

/** One practice for the circle, standing in for a practice and its verse. */
export interface GeneralPractice {
  text: string;
  /** One sentence on why it helps, shown where the verse would be. */
  why: string;
}
