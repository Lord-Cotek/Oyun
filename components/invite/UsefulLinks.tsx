"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/ui/Confirm";
import {
  addInviteLink,
  moveInviteLink,
  removeInviteLink,
  saveThankYou,
} from "@/app/appointments/event-actions";
import {
  LINKS_MAX,
  LINK_KINDS,
  LINK_LABEL_MAX,
  LINK_META,
  THANK_YOU_MAX,
  linkHost,
  linkLabel,
  toLinkKind,
  type LinkKind,
} from "@/lib/invite-links";

/**
 * The host's side of the useful links: directions, the registry, what to
 * bring — and the word a guest sees the moment they say yes.
 *
 * ── Why these are not just part of the message ───────────────────────────
 * They were. Guests read the date, tapped "I'll be there", and closed the
 * page, and the links were in a paragraph nobody reached. As their own
 * things they are shown where people look: beside the date, on the thank-
 * you after replying, in the message the host sends to the people who said
 * yes, and in the reminder the evening before. This says so under the
 * heading, so a host knows what adding one actually does.
 *
 * The registry is one tap when this family already has one, because the app
 * knows the link and a host should not have to go and copy it.
 */
export function UsefulLinks({
  eventId,
  links,
  thankYou,
  registryUrl,
}: {
  eventId: string;
  links: { id: string; kind: string; label: string; url: string }[];
  thankYou: string | null;
  registryUrl: string | null;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [kind, setKind] = useState<LinkKind>("DIRECTIONS");
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState(thankYou ?? "");
  const [noteSaved, setNoteSaved] = useState<"idle" | "saving" | "saved">("idle");
  const [busy, start] = useTransition();

  const full = links.length >= LINKS_MAX;
  const hasRegistry = links.some((l) => l.kind === "REGISTRY");
  const meta = LINK_META[kind];

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      const res = await fn();
      setError(res.ok ? null : (res.error ?? "That didn’t save."));
      if (res.ok) {
        setAdding(false);
        router.refresh();
      }
    });

  return (
    <div className="mt-4 border-t border-border/70 pt-4">
      <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
        Useful links for guests
      </p>
      <p className="mt-1 prose-serif-xs leading-relaxed text-muted">
        Shown beside the date, on the thank-you a guest sees the moment they
        reply, and in the reminder the evening before — so nobody has to ask
        where it is or what to bring.
      </p>

      {links.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {links.map((l, i) => {
            const m = LINK_META[toLinkKind(l.kind)];
            return (
              <li
                key={l.id}
                className="flex items-center gap-2 rounded-lg bg-bg/60 px-3 py-2"
              >
                <span aria-hidden="true">{m.mark}</span>
                <span className="min-w-0 flex-1">
                  <span className="block break-words font-serif text-base leading-snug text-ink">
                    {linkLabel(l.kind, l.label)}
                  </span>
                  <span className="block truncate font-mono text-[0.6rem] text-muted">
                    {linkHost(l.url)}
                  </span>
                </span>
                <span className="flex shrink-0 items-center">
                  <button
                    type="button"
                    disabled={busy || i === 0}
                    onClick={() => run(() => moveInviteLink(l.id, "up"))}
                    aria-label={`Move ${linkLabel(l.kind, l.label)} up`}
                    className="h-8 w-7 rounded-md font-mono text-xs text-muted hover:text-ink disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={busy || i === links.length - 1}
                    onClick={() => run(() => moveInviteLink(l.id, "down"))}
                    aria-label={`Move ${linkLabel(l.kind, l.label)} down`}
                    className="h-8 w-7 rounded-md font-mono text-xs text-muted hover:text-ink disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <ConfirmButton
                    press="none"
                    disabled={busy}
                    describe={linkLabel(l.kind, l.label)}
                    onConfirm={async () => {
                      const res = await removeInviteLink(l.id);
                      if (res.ok) router.refresh();
                      return res;
                    }}
                    className="ml-1 font-mono text-[0.58rem] uppercase tracking-widest text-muted hover:text-negative"
                  />
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {!adding && !full && (
        <div className="mt-3 flex flex-wrap gap-2">
          {registryUrl && !hasRegistry && (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                const fd = new FormData();
                fd.set("kind", "REGISTRY");
                fd.set("label", "Our registry");
                fd.set("url", registryUrl);
                run(() => addInviteLink(eventId, fd));
              }}
              className="rounded-lg border border-accent/50 px-3 py-2 font-mono text-xs text-accent transition-colors hover:bg-accent/[0.06] disabled:opacity-60"
            >
              🎁 Add our registry
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setAdding(true);
              setError(null);
              setKind(links.some((l) => l.kind === "DIRECTIONS") ? "BRING" : "DIRECTIONS");
            }}
            className="rounded-lg border border-border px-3 py-2 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
          >
            + Add a link
          </button>
        </div>
      )}

      {adding && (
        <form
          action={(fd) => {
            fd.set("kind", kind);
            run(() => addInviteLink(eventId, fd));
          }}
          className="mt-3 space-y-3 rounded-xl border border-border bg-bg/40 p-3"
        >
          {/* The kind first, as choices rather than a dropdown: four things,
              each with its own mark, read faster than a select. */}
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="What kind of link">
            {LINK_KINDS.map((k) => {
              const km = LINK_META[k];
              const on = k === kind;
              return (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setKind(k)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[0.68rem] transition-colors ${
                    on
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted hover:text-ink"
                  }`}
                >
                  {km.mark} {km.label || "Something else"}
                </button>
              );
            })}
          </div>
          <p className="prose-serif-xs text-muted">{meta.hint}</p>

          <input
            key={`url-${kind}`}
            name="url"
            inputMode="url"
            autoComplete="off"
            required
            placeholder={meta.placeholder}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <input
            key={`label-${kind}`}
            name="label"
            maxLength={LINK_LABEL_MAX}
            required={kind === "OTHER"}
            placeholder={
              kind === "OTHER"
                ? "What is it? e.g. Parking"
                : `Call it something else (optional) — “${meta.label}”`
            }
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-accent px-4 py-2 font-mono text-xs font-medium text-on-accent hover:bg-accent-deep disabled:opacity-60"
            >
              {busy ? "Adding…" : "Add it"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setError(null);
              }}
              className="rounded-lg px-3 py-2 font-mono text-xs text-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && (
        <p className="mt-2 font-mono text-xs leading-relaxed text-negative">{error}</p>
      )}

      {/* ── The word a guest sees the moment they say yes ────────────────── */}
      <div className="mt-4">
        <label className="block">
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
            Your thank-you, after somebody replies
          </span>
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setNoteSaved("idle");
            }}
            maxLength={THANK_YOU_MAX}
            rows={2}
            placeholder="e.g. Thank you so much — we can’t wait to celebrate with you!"
            className="mt-1.5 w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </label>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <button
            type="button"
            disabled={noteSaved === "saving" || note.trim() === (thankYou ?? "").trim()}
            onClick={() => {
              setNoteSaved("saving");
              start(async () => {
                const res = await saveThankYou(eventId, note);
                setNoteSaved(res.ok ? "saved" : "idle");
                if (!res.ok) setError(res.error ?? "That didn’t save.");
                else router.refresh();
              });
            }}
            className="shrink-0 whitespace-nowrap font-mono text-[0.68rem] text-accent underline underline-offset-4 disabled:text-muted disabled:no-underline"
          >
            {noteSaved === "saving" ? "Saving…" : noteSaved === "saved" ? "Saved" : "Save the thank-you"}
          </button>
          <span className="prose-serif-xs text-muted">
            Left empty, guests get a plain thank-you in the app’s own words.
          </span>
        </div>
      </div>
    </div>
  );
}
