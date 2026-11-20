"use client";

import { useState, useTransition } from "react";
import { checkPhotoStorage, type StorageCheck } from "./storage-actions";

/** One button: can this app save a photo right now? See storage-actions.ts. */
export function StorageCheckButton() {
  const [r, setR] = useState<StorageCheck | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="px-4 py-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => setR(await checkPhotoStorage().catch((e) => ({ ok: false, said: "The check itself failed.", detail: String(e), ms: 0 }))))}
        className="rounded border border-white/20 px-3 py-1.5 font-mono text-xs text-white hover:bg-white/5 disabled:opacity-50"
      >
        {pending ? "Checking…" : "Test photo storage"}
      </button>
      {r && (
        <div className="mt-3">
          <p className={`font-mono text-xs ${r.ok ? "text-emerald-300" : "text-red-300"}`}>{r.said}</p>
          {r.detail && <p className="mt-1 break-words font-mono text-[0.62rem] text-white/60">Storage said: {r.detail}</p>}
          {r.ms > 0 && <p className="mt-1 font-mono text-[0.58rem] text-white/30">{r.ms} ms</p>}
        </div>
      )}
    </div>
  );
}
