"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Pressable } from "@/components/ui/Pressable";
import { setPayDetails } from "@/app/registry/actions";
import {
  PAY_DETAILS_MAX,
  PAY_LABEL_MAX,
  PAY_NOTE_MAX,
} from "@/lib/registry";

const field =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";
const label =
  "mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted";

/**
 * How somebody sends her money.
 *
 * ── What this is, said plainly, because it is her bank account ───────────
 * Three lines she types. A guest who taps to give is shown them and sends the
 * money the way they always would. Nothing is paid through the app: it does
 * not talk to a bank, take a card, hold a balance or take a cut, and the
 * public page says so to the guest as well.
 *
 * ── The warning is not decoration ────────────────────────────────────────
 * Whatever goes in here can be read by anybody holding the registry link, and
 * links get forwarded. The page does not print the details — a guest asks and
 * they are fetched then, which keeps them out of the first paint, out of a
 * screenshot of the page and out of any preview card — but that is friction,
 * not a wall, and saying otherwise would be the app lying to her about her own
 * bank account. So it says exactly that, at the point where she decides.
 *
 * The advice to prefer the account that is already public — the one on her
 * invoices, the mobile-money number everybody already has — is the practical
 * half. Most people have one account they are happy for a hundred relatives
 * to see and one they are not.
 */
export function PayDetails({
  payLabel,
  payDetails,
  payNote,
}: {
  payLabel: string | null;
  payDetails: string | null;
  payNote: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const has = (payDetails ?? "").trim().length > 0;

  return (
    <div className="rounded-2xl border border-border bg-bg p-4">
      <Pressable
        press="none"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-1 text-left"
      >
        <span className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          Money towards something{" "}
          {has && <span className="text-accent">· on</span>}
        </span>
        <span aria-hidden className="font-mono text-xs text-muted">
          {open ? "−" : "+"}
        </span>
      </Pressable>

      {open && (
        <form
          action={async (fd) => {
            setError(null);
            setSaid(null);
            const res = await setPayDetails(fd);
            if (res.ok) {
              setSaid(
                String(fd.get("payDetails") ?? "").trim()
                  ? "Saved. You can add a “money towards it” card now."
                  : "Removed. Nobody will be shown anything.",
              );
            } else setError(res.error);
          }}
          className="mt-4 space-y-4"
        >
          <div className="space-y-2 rounded-xl border border-accent/30 bg-accent/[0.05] p-3">
            <p className="prose-serif-xs text-ink">
              Whatever you put here can be read by anybody who has the
              registry link — and links get forwarded.
            </p>
            <p className="prose-serif-xs text-muted">
              It is not printed on the page: somebody has to tap to ask for
              it, so it stays out of a screenshot and out of the preview card.
              But anybody with the link can tap. Use the account you would be
              comfortable putting on an invoice, not the one you would not.
            </p>
            <p className="prose-serif-xs text-muted">
              No money passes through Oyun. People send it to you directly,
              and nobody here takes a cut or sees a penny of it.
            </p>
          </div>

          <div>
            <label htmlFor="pay-label" className={label}>
              What sort of transfer
            </label>
            <input
              id="pay-label"
              name="payLabel"
              defaultValue={payLabel ?? ""}
              maxLength={PAY_LABEL_MAX}
              placeholder="Bank transfer · Mobile money · Wise"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="pay-details" className={label}>
              The details themselves
            </label>
            <textarea
              id="pay-details"
              name="payDetails"
              defaultValue={payDetails ?? ""}
              rows={4}
              maxLength={PAY_DETAILS_MAX}
              placeholder={"Amara Adeyemi\nEmirates NBD\nAE00 0000 0000 0000 000"}
              className={`${field} resize-none font-mono text-xs`}
            />
            <p className="mt-1.5 prose-serif-xs text-muted">
              Written exactly as you would text it to somebody. Leave it empty
              to take the whole thing down.
            </p>
          </div>

          <div>
            <label htmlFor="pay-note" className={label}>
              Anything to say with it{" "}
              <span className="normal-case">(optional)</span>
            </label>
            <input
              id="pay-note"
              name="payNote"
              defaultValue={payNote ?? ""}
              maxLength={PAY_NOTE_MAX}
              placeholder="Please put your name as the reference."
              className={field}
            />
          </div>

          <Save />
          {said && <p className="prose-serif-xs text-muted">{said}</p>}
          {error && <p className="prose-serif-xs text-negative">{error}</p>}
        </form>
      )}
    </div>
  );
}

function Save() {
  const { pending } = useFormStatus();
  return (
    <Pressable
      type="submit"
      disabled={pending}
      className="btn-primary rounded-lg px-4 py-2 font-mono text-xs font-medium text-on-accent disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save"}
    </Pressable>
  );
}
