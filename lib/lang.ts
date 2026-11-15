import { cookies } from "next/headers";
import { isOn } from "@/lib/flags";
import { LANG_COOKIE, type Lang } from "@/lib/i18n";

/**
 * The reader's language: their choice, kept on this device — but only while
 * the "yoruba" switch is on. Turning the switch off puts everyone back in
 * English at once, whatever they chose. Nobody who never chose pays for a
 * lookup: the switch is only asked about when the choice is Yorùbá.
 *
 * Shared with the sibling app and drift-checked.
 */
export async function getLang(): Promise<Lang> {
  if (cookies().get(LANG_COOKIE)?.value !== "yo") return "en";
  return (await isOn("yoruba")) ? "yo" : "en";
}

/** Whether to offer the choice at all. */
export async function yorubaOffered(): Promise<boolean> {
  return isOn("yoruba");
}
