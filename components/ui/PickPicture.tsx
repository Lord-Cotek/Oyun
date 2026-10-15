"use client";

import { useRef, useState } from "react";
import { uploadOneToBlob } from "@/lib/blob-client";
import { Pressable } from "@/components/ui/Pressable";

/**
 * Choosing a picture from the phone, for a field that holds one address.
 *
 * ── Why this exists next to a box you can paste into ─────────────────────
 * The registry grew up around shop links: paste an address, and the title,
 * price and photograph are read off the page. That is the right first move
 * and it covers most of a list. It covers none of the rest — the cot being
 * handed down, the money towards the baby's room, anything a shop never
 * listed — and for those the only way to get a picture was to find one
 * already published somewhere on the internet and paste its address, which
 * is not something anybody is going to do while adding a nappy bin.
 *
 * So the field stays, and this sits beside it. Paste an address or choose a
 * photograph; both end up in the same place.
 *
 * ── Why it uploads here rather than on save ──────────────────────────────
 * Because the form that uses it keeps its value in React state, and because
 * waiting until save would mean a photograph travelling inside a server
 * action. Straight from the phone to storage, shrunk on the way — the same
 * path the feed, the cover and a child's photograph already use.
 */
export function PickPicture({
  onPicked,
  folder,
  label = "Choose a picture",
  className = "",
}: {
  /** Called with the stored address once the upload has finished. */
  onPicked: (url: string) => void;
  /** Where it lands in storage: "registry", "children", and so on. */
  folder: string;
  label?: string;
  className?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [trouble, setTrouble] = useState<string | null>(null);

  async function take(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setTrouble(null);
    try {
      const url = await uploadOneToBlob([file], folder);
      if (url) onPicked(url);
      else setTrouble("That didn’t upload. Try again?");
    } catch (err) {
      setTrouble(
        err instanceof Error ? err.message : "That didn’t upload. Try again?",
      );
    } finally {
      setBusy(false);
      // Cleared so that choosing the same file twice still counts as a
      // change — otherwise a failed upload cannot simply be retried.
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className={className}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void take(e.target.files?.[0])}
      />
      <Pressable
        press="none"
        type="button"
        disabled={busy}
        onClick={() => fileRef.current?.click()}
        className="font-mono text-[0.62rem] uppercase tracking-widest text-accent underline underline-offset-4 disabled:opacity-50"
      >
        {busy ? "Uploading…" : label}
      </Pressable>
      {trouble && (
        <p className="mt-1 font-mono text-[0.62rem] leading-relaxed text-negative">
          {trouble}
        </p>
      )}
    </div>
  );
}
