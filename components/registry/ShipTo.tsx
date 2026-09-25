"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Pressable } from "@/components/ui/Pressable";
import { setShipping } from "@/app/registry/actions";
import {
  SHIP_ADDRESS_MAX,
  SHIP_NAME_MAX,
  SHIP_NOTE_MAX,
  SHIP_PHONE_MAX,
  type ShipReach,
} from "@/lib/registry";

const field =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";
const label =
  "mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted";

/**
 * Where a parcel goes.
 *
 * ── Why the choice of who can see it comes first ─────────────────────────
 * Because it is the decision, and the four boxes underneath are only typing.
 * A form that asks for a home address and mentions who will read it at the
 * bottom has already had the address typed by somebody who never scrolled.
 *
 * So the two options are the top of the form, one is chosen before anything
 * is typed, and the narrow one is chosen for them.
 *
 * ── The warning is not decoration ────────────────────────────────────────
 * Same as the transfer details, and more so. This is where they sleep. The
 * page does not print it — somebody taps and it is fetched then, which keeps
 * it out of the first paint, out of a screenshot and out of any preview card
 * — but with the reach opened to the link, that is friction and not a wall,
 * and saying otherwise would be the app lying to a pregnant woman about her
 * own front door. So it says exactly that, next to the switch that does it.
 */
export function ShipTo({
  shipName,
  shipAddress,
  shipPhone,
  shipNote,
  shipReach,
}: {
  shipName: string | null;
  shipAddress: string | null;
  shipPhone: string | null;
  shipNote: string | null;
  shipReach: ShipReach;
}) {
  const [open, setOpen] = useState(false);
  const [reach, setReach] = useState<ShipReach>(shipReach);
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const has = (shipAddress ?? "").trim().length > 0;

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
          Where to send things{" "}
          {has && (
            <span className="text-accent">
              · {shipReach === "LINK" ? "anyone with the link" : "your circle"}
            </span>
          )}
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
            const res = await setShipping(fd);
            if (res.ok) {
              setSaid(
                String(fd.get("shipAddress") ?? "").trim()
                  ? "Saved."
                  : "Removed. Nobody will be shown an address.",
              );
            } else setError(res.error);
          }}
          className="mt-4 space-y-4"
        >
          <p className="prose-serif-xs text-muted">
            So somebody buying a cot can have it delivered to you instead of
            carrying it across the city. It is never printed on the page —
            people tap to ask for it.
          </p>

          <fieldset className="space-y-2">
            <legend className={label}>Who is allowed to see it</legend>
            <Choice
              name="shipReach"
              value="CIRCLE"
              checked={reach === "CIRCLE"}
              onChange={setReach}
              title="Your circle only"
              blurb="The people signed in to your journey. Anybody else is told to ask you for it, and told nothing more."
            />
            <Choice
              name="shipReach"
              value="LINK"
              checked={reach === "LINK"}
              onChange={setReach}
              title="Anybody with the link"
              blurb="Anybody who opens the registry can tap and read it — including whoever the link gets forwarded to."
            />
          </fieldset>

          {reach === "LINK" && (
            <div className="space-y-2 rounded-xl border border-accent/30 bg-accent/[0.05] p-3">
              <p className="prose-serif-xs text-ink">
                This is your home address on a link that gets forwarded.
              </p>
              <p className="prose-serif-xs text-muted">
                Somebody has to tap to ask for it, so it stays out of a
                screenshot and out of the preview card — but anybody holding
                the link can tap, and links travel further than the people you
                sent them to. If you are not sure, leave it on your circle:
                they are the ones who post things anyway.
              </p>
              <p className="prose-serif-xs text-muted">
                A pick-up point, a work address or a relative&rsquo;s house is
                a good answer here.
              </p>
            </div>
          )}

          <div>
            <label htmlFor="ship-address" className={label}>
              The address
            </label>
            <textarea
              id="ship-address"
              name="shipAddress"
              defaultValue={shipAddress ?? ""}
              rows={4}
              maxLength={SHIP_ADDRESS_MAX}
              placeholder={"Flat 12, Marina Heights\nAl Sufouh Road\nDubai"}
              className={`${field} resize-none`}
            />
            <p className="mt-1.5 prose-serif-xs text-muted">
              Written the way a courier needs it. Leave it empty to take the
              whole thing down.
            </p>
          </div>

          <div>
            <label htmlFor="ship-name" className={label}>
              Who it is addressed to{" "}
              <span className="normal-case">(optional)</span>
            </label>
            <input
              id="ship-name"
              name="shipName"
              defaultValue={shipName ?? ""}
              maxLength={SHIP_NAME_MAX}
              placeholder="Amara Adeyemi"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="ship-phone" className={label}>
              A number for the courier{" "}
              <span className="normal-case">(optional)</span>
            </label>
            <input
              id="ship-phone"
              name="shipPhone"
              type="tel"
              defaultValue={shipPhone ?? ""}
              maxLength={SHIP_PHONE_MAX}
              placeholder="+971 50 000 0000"
              className={field}
            />
            <p className="mt-1.5 prose-serif-xs text-muted">
              Most shops ask for one at checkout, and the delivery fails
              without it.
            </p>
          </div>

          <div>
            <label htmlFor="ship-note" className={label}>
              Anything they should know{" "}
              <span className="normal-case">(optional)</span>
            </label>
            <input
              id="ship-note"
              name="shipNote"
              defaultValue={shipNote ?? ""}
              maxLength={SHIP_NOTE_MAX}
              placeholder="Leave it with security if we are out."
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

function Choice({
  name,
  value,
  checked,
  onChange,
  title,
  blurb,
}: {
  name: string;
  value: ShipReach;
  checked: boolean;
  onChange: (v: ShipReach) => void;
  title: string;
  blurb: string;
}) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors ${
        checked ? "border-accent/50 bg-accent/[0.05]" : "border-border"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
      />
      <span className="min-w-0">
        <span className="block prose-serif-sm text-ink">{title}</span>
        <span className="mt-0.5 block prose-serif-xs text-muted">{blurb}</span>
      </span>
    </label>
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
