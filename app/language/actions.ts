"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LANG_COOKIE } from "@/lib/i18n";

/**
 * Remember the reader's language on this device, for a year. A cookie rather
 * than the account, so the way in (before anyone has signed in) can speak it
 * too. Shared with the sibling app and drift-checked.
 */
export async function setLanguage(lang: string) {
  cookies().set(LANG_COOKIE, lang === "yo" ? "yo" : "en", {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath("/", "layout");
}
