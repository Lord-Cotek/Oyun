"use server";

import { applyUnsubscribe, isUnsubKind } from "@/lib/unsubscribe";

export async function confirmUnsubscribe(formData: FormData): Promise<{ ok: boolean }> {
  const u = String(formData.get("u") ?? "");
  const k = formData.get("k");
  const t = String(formData.get("t") ?? "");
  if (!u || !isUnsubKind(k)) return { ok: false };
  return { ok: await applyUnsubscribe(u, k, t) };
}
