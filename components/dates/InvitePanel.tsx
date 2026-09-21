"use client";

import { useState } from "react";
import {
  saveInvitation,
  setInvitationClosed,
  revokeInvitation,
  restoreInvitation,
  removeReply,
  emailInvitation,
} from "@/app/appointments/event-actions";
import {
  HOST_NAME_MAX,
  MESSAGE_MAX,
  answerLabel,
  countSentence,
  headCount,
} from "@/lib/invitations";
import { ShareInvite } from "@/components/invite/ShareInvite";
import { PollPanel, type PollOption } from "@/components/dates/PollPanel";
import { ConfirmButton } from "@/components/ui/Confirm";

export type InviteRow = {
  slug: string;
  url: string;
  hostName: string;
  message: string | null;
  showGuestList: boolean;
  allowPlusOnes: boolean;
  capacity: number | null;
  repliesByISO: string | null;
  closed: boolean;
  revoked: boolean;
  /** Empty on an ordinary invitation; the days offered on a "which day suits". */
  options: PollOption[];
  settled: boolean;
  /** How many invitation emails have already gone from this link. */
  emailsSent: number;
  replies: {
    id: string;
    name: string;
    answer: string;
    partySize: number;
    note: string | null;
  }[];
};

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

/**
 * The host's side of an invitation: make it, share it, watch it fill.
 *
 * It opens as a summary — a head count and a share button, which is what a
 * host wants ninety-nine times out of a hundred — and the settings are behind
 * one more tap. Nobody editing the wording of an invitation is in a hurry;
 * everybody checking how many are coming is.
 */
export function InvitePanel({
  eventId,
  title,
  when,
  where,
  invite,
}: {
  eventId: string;
  title: string;
  when: string;
  where: string | null;
  invite: InviteRow | null;
}) {
  const [open, setOpen] = useState(!invite);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuests, setShowGuests] = useState(false);
  const [asking, setAsking] = useState(false);

  const count = invite ? headCount(invite.replies) : null;
  /**
   * While the day is still a question, the head count and the guest list are
   * answers to a different one. Four people said yes — to what? Hidden until
   * there is a day for them to have said yes to.
   */
  const isAsking = !!invite && invite.options.length > 0 && !invite.settled;

  async function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setBusy(true);
    setError(null);
    const res = await fn();
    setBusy(false);
    if (!res.ok) setError(res.error ?? "That didn't save.");
    return res.ok;
  }

  return (
    <div className="mt-3 rounded-xl border border-accent/25 bg-accent/[0.04] p-4">
      {invite && invite.options.length > 0 && (
        <PollPanel
          eventId={eventId}
          options={invite.options}
          replied={invite.replies.length}
          settled={invite.settled}
        />
      )}

      {invite && isAsking && !invite.revoked && (
        <div className="mt-3">
          <ShareInvite
            url={invite.url}
            title={title}
            when="The day is still being decided"
            where={where}
            eventId={eventId}
            onEmail={emailInvitation}
            sentCount={invite.emailsSent}
          />
        </div>
      )}

      {invite && !isAsking && (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="font-serif text-lg text-ink">
              {invite.revoked
                ? "The link is switched off"
                : invite.closed
                  ? "Replies are closed"
                  : "Invitation is open"}
            </p>
            <p className="font-mono text-xs text-muted">
              {count ? countSentence(count) : ""}
            </p>
          </div>

          {invite.capacity != null && count && (
            <p className="mt-0.5 font-mono text-[0.66rem] text-muted">
              Room for {invite.capacity} · {Math.max(0, invite.capacity - count.coming)}{" "}
              still free
            </p>
          )}

          {!invite.revoked && (
            <div className="mt-3">
              <ShareInvite
                url={invite.url}
                title={title}
                when={isAsking ? "The day is still being decided" : when}
                where={where}
                eventId={eventId}
                onEmail={emailInvitation}
                sentCount={invite.emailsSent}
              />
            </div>
          )}

          {invite.replies.length > 0 && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowGuests((s) => !s)}
                aria-expanded={showGuests}
                className="font-mono text-[0.68rem] text-accent underline underline-offset-4"
              >
                {showGuests
                  ? "Hide who has replied"
                  : `Who has replied (${invite.replies.length})`}
              </button>
              {showGuests && (
                <ul className="mt-2 space-y-1.5">
                  {invite.replies.map((r) => (
                    <li
                      key={r.id}
                      className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 rounded-lg bg-bg/60 px-3 py-2"
                    >
                      <span className="font-serif text-base text-ink">
                        {r.name}
                      </span>
                      <span className="font-mono text-[0.66rem] text-muted">
                        {answerLabel(r.answer)}
                        {r.partySize > 1 ? ` · ${r.partySize} of them` : ""}
                      </span>
                      {r.note && (
                        <span className="w-full prose-serif-xs text-muted">
                          “{r.note}”
                        </span>
                      )}
                      <ConfirmButton
                        press="none"
                        disabled={busy}
                        describe={`${r.name}'s reply`}
                        onConfirm={async () => {
                          await run(() => removeReply(r.id));
                        }}
                        className="ml-auto font-mono text-[0.6rem] uppercase tracking-widest text-muted hover:text-negative"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {invite.options.length === 0 && (
            <button
              type="button"
              onClick={() => setAsking(true)}
              className="mt-3 block font-mono text-[0.68rem] text-accent underline underline-offset-4"
            >
              Not sure of the day? Ask them which suits
            </button>
          )}

          {asking && invite.options.length === 0 && (
            <PollPanel eventId={eventId} options={[]} replied={0} settled={false} />
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="font-mono text-[0.68rem] text-accent underline underline-offset-4"
            >
              {open ? "Done" : "Change the invitation"}
            </button>
            {!invite.revoked && (
              <button
                type="button"
                disabled={busy}
                onClick={() => run(() => setInvitationClosed(eventId, !invite.closed))}
                className="font-mono text-[0.68rem] text-muted underline underline-offset-4 hover:text-ink"
              >
                {invite.closed ? "Take replies again" : "Stop taking replies"}
              </button>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                run(() =>
                  invite.revoked
                    ? restoreInvitation(eventId)
                    : revokeInvitation(eventId),
                )
              }
              className={`font-mono text-[0.68rem] underline underline-offset-4 ${
                invite.revoked
                  ? "text-accent"
                  : "text-muted hover:text-negative"
              }`}
            >
              {invite.revoked ? "Switch the link back on" : "Switch the link off"}
            </button>
          </div>

          {invite.revoked && (
            <p className="mt-2 prose-serif-xs text-muted">
              Anyone opening it now sees nothing at all. The replies are still
              here, and switching it back on brings back the same link — nothing
              needs sending again.
            </p>
          )}
        </>
      )}

      {open && (
        <form
          action={async (fd) => {
            setBusy(true);
            setError(null);
            const res = await saveInvitation(fd);
            setBusy(false);
            if (res.ok) setOpen(false);
            else setError(res.error);
          }}
          className={`space-y-3 ${invite ? "mt-4 border-t border-border pt-4" : ""}`}
        >
          <input type="hidden" name="eventId" value={eventId} />

          {!invite && (
            <p className="prose-serif-xs text-muted">
              This makes one link, to this day only. Send it to whoever you
              like — the other mothers, the friends coming round; they need no
              account. Nothing else about your journey is reachable from it,
              and you can switch it off whenever you want. Anyone who leaves an
              address is reminded the evening before and on the morning, and
              told straight away if you move the day.
            </p>
          )}

          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
              From
            </span>
            <input
              name="hostName"
              required
              maxLength={HOST_NAME_MAX}
              defaultValue={invite?.hostName ?? ""}
              placeholder="Amara and Chidi"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
              A word to whoever opens it
            </span>
            <textarea
              name="message"
              rows={3}
              maxLength={MESSAGE_MAX}
              defaultValue={invite?.message ?? ""}
              placeholder="Come and eat with us. Bring nothing but yourselves."
              className={inputClass}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                Room for (leave blank for no limit)
              </span>
              <input
                type="number"
                name="capacity"
                min={1}
                defaultValue={invite?.capacity ?? ""}
                placeholder="30"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                Reply by (optional)
              </span>
              <input
                type="date"
                name="repliesBy"
                defaultValue={invite?.repliesByISO?.slice(0, 10) ?? ""}
                className={inputClass}
              />
            </label>
          </div>

          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              name="allowPlusOnes"
              defaultChecked={invite?.allowPlusOnes ?? true}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
            />
            <span className="prose-serif-xs text-muted">
              They can say how many they are bringing
            </span>
          </label>

          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              name="showGuestList"
              defaultChecked={invite?.showGuestList ?? true}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
            />
            <span className="prose-serif-xs text-muted">
              Guests can see who else is coming
              <span className="block text-[0.66rem] text-muted/80">
                At a shower that is half the reason to come. At a quiet supper
                it is nobody&rsquo;s business — turn it off and only you see
                the list.
              </span>
            </span>
          </label>

          {error && <p className="font-mono text-xs text-negative">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
            >
              {busy ? "Saving…" : invite ? "Save the invitation" : "Make the link"}
            </button>
            {invite && (
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-mono text-xs text-muted hover:text-ink"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
