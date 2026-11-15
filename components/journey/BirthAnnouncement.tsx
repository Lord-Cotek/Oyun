"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { announceBirth } from "@/app/journey/birth-actions";
import { uploadOneToBlob, filesFromForm } from "@/lib/blob-client";

/**
 * Tell people, warmly, in your own words. Shown on the home page for a few
 * weeks after the birth until the announcement is made. It posts to Life;
 * from there "Share outside" makes a private link for anyone not in the app.
 */
export function BirthAnnouncement({
  names,
  verses,
}: {
  names: string;
  verses: { ref: string; text: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const input =
    "w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink focus:border-accent focus:outline-none";
  return (
    <section className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6">
      <p className="eyebrow mb-2 text-accent">Tell people</p>
      <h2 className="font-serif text-2xl text-ink">Announce the birth</h2>
      <p className="mt-1 prose-serif-sm text-muted">
        A card with the name, the day, a verse and a photograph if you like — shared with your
        circle in Life, and from there by a private link to anyone else.
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          setError(null);
          start(async () => {
            try {
              const fd = new FormData(form);
              const files = filesFromForm(form, "photo");
              fd.delete("photo");
              if (files.length) {
                const url = await uploadOneToBlob(files, "announcements");
                if (url) fd.set("photoUrl", url);
              }
              const r = await announceBirth(fd);
              if (r.ok) router.push(`/life/${r.postId}`);
              else setError(r.error);
            } catch {
              setError("That did not post. Try again in a moment.");
            }
          });
        }}
      >
        <label className="block" htmlFor="ann-names">
          <span className="eyebrow mb-1 block text-muted">Name</span>
          <input id="ann-names" name="names" defaultValue={names} maxLength={120} className={input} />
        </label>
        <label className="block" htmlFor="ann-verse">
          <span className="eyebrow mb-1 block text-muted">A verse</span>
          <select id="ann-verse" name="verse" className={input} defaultValue={verses[0]?.ref}>
            {verses.map((v) => (
              <option key={v.ref} value={v.ref}>
                {v.ref} — {v.text.slice(0, 50)}…
              </option>
            ))}
            <option value="">No verse</option>
          </select>
        </label>
        <label className="block" htmlFor="ann-message">
          <span className="eyebrow mb-1 block text-muted">A few words (optional)</span>
          <textarea id="ann-message" name="message" rows={3} maxLength={1000} className={`${input} resize-y`} />
        </label>
        <label className="block" htmlFor="ann-photo">
          <span className="eyebrow mb-1 block text-muted">A photograph (optional)</span>
          <input id="ann-photo" name="photo" type="file" accept="image/*" className="font-mono text-xs text-muted" />
        </label>
        {error && <p className="font-mono text-xs text-negative" role="alert">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-5 py-2.5 font-mono text-sm font-medium text-on-accent hover:bg-accent-deep disabled:opacity-50"
        >
          {pending ? "Posting…" : "Share the news"}
        </button>
      </form>
    </section>
  );
}
