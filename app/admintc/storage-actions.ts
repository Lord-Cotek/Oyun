"use server";

import { del, put } from "@vercel/blob";
import { audit, requireUnlockedAdmin } from "@/lib/admin";

export type StorageCheck = {
  ok: boolean;
  /** One plain line for whoever is looking. */
  said: string;
  /** Storage's own words, when it refused. */
  detail: string | null;
  ms: number;
};

const words = (e: unknown) => (e instanceof Error ? `${e.name !== "Error" ? `${e.name}: ` : ""}${e.message}` : String(e)).replace(/\s+/g, " ").slice(0, 300);

/**
 * Can this app save a photo right now?
 *
 * ── Why this is asked from the server ────────────────────────────────────
 * When storage refuses an upload from a phone — a store that is full or
 * over its plan, a store of the wrong kind, a key that no longer works —
 * the browser is not allowed to read why. It sees a dropped connection, and
 * so does the family. Asked from here, storage answers in words. So this
 * saves a tiny file exactly the way family photos are saved (public), then
 * deletes it, and shows whatever storage said.
 *
 * If a public save is refused it tries a private one, because the commonest
 * cause is a store that was created (or reconnected) as private: family
 * photos need a public store.
 */
export async function checkPhotoStorage(): Promise<StorageCheck> {
  const admin = await requireUnlockedAdmin();
  const t0 = Date.now();
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return { ok: false, said: "There is no storage key in this deployment (BLOB_READ_WRITE_TOKEN is missing).", detail: null, ms: 0 };
  const name = `health-check/${Date.now()}.txt`;
  try {
    const b = await put(name, "storage check — safe to delete", { access: "public", token, addRandomSuffix: true, contentType: "text/plain" });
    await del(b.url, { token }).catch(() => {});
    await audit(admin.email, "checked photo storage", null, "ok");
    return { ok: true, said: "Photo storage is working: a test file was saved the way family photos are, and deleted.", detail: null, ms: Date.now() - t0 };
  } catch (e) {
    const publicError = words(e);
    let privateWorks = false;
    try {
      const b = await put(name, "storage check — safe to delete", { access: "private", token, addRandomSuffix: true, contentType: "text/plain" } as Parameters<typeof put>[2]);
      await del(b.url, { token }).catch(() => {});
      privateWorks = true;
    } catch {
      // Refused both ways: the message above is the one that matters.
    }
    await audit(admin.email, "checked photo storage", null, `refused: ${publicError.slice(0, 120)}`);
    return {
      ok: false,
      said: privateWorks
        ? "Storage refused a public save but accepted a private one: this deployment is connected to a PRIVATE store. Family photos need a public store — reconnect the public one to this project in Vercel (Storage), or create a public store and connect it."
        : "Storage refused the test save. This is why photos stop at 0% on phones — the reason storage gave is below.",
      detail: publicError,
      ms: Date.now() - t0,
    };
  }
}
