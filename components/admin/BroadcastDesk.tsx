"use client";

import { useState, useTransition } from "react";
import {
  beginSending,
  discardBroadcast,
  saveBroadcast,
  sendNextBatch,
  sendTest,
} from "@/app/admintc/broadcast-actions";

type Res = { ok: true; said: string } | { ok: false; error: string };

export interface Row {
  id: string;
  subject: string;
  body: string;
  audience: string;
  createdBy: string;
  created: string;
  started: string | null;
  finished: string | null;
  sentCount: number;
  failedCount: number;
}

const field =
  "w-full rounded border border-white/15 bg-[#141416] px-3 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none";
const btn =
  "rounded border border-white/20 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-white/80 transition-colors hover:border-white/50 hover:text-white disabled:opacity-40";
const go =
  "rounded border border-amber-400/50 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-amber-300 transition-colors hover:border-amber-400 disabled:opacity-40";

/**
 * Write it, read it in your own inbox, then type the number of people.
 *
 * The order is the safety. The mistake this guards against is not malice —
 * it is somebody finishing a draft at the end of a long day and pressing the
 * thing next to it, into three thousand inboxes that cannot be emptied.
 */
export function BroadcastDesk({
  rows,
  optedIn,
  all,
}: {
  rows: Row[];
  optedIn: number;
  all: number;
}) {
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, start] = useTransition();
  const [audience, setAudience] = useState<"OPTED_IN" | "ALL">("OPTED_IN");
  const [confirmFor, setConfirmFor] = useState<string | null>(null);
  const [typed, setTyped] = useState("");

  function run(fn: () => Promise<Res>) {
    setSaid(null);
    setError(null);
    start(async () => {
      const r = await fn();
      if (r.ok) {
        setSaid(r.said);
        setConfirmFor(null);
        setTyped("");
      } else setError(r.error);
    });
  }

  const reach = (a: string) => (a === "ALL" ? all : optedIn);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
          Write one
        </h2>
        <form
          action={(fd) => run(() => saveBroadcast(fd))}
          className="mt-3 space-y-4 rounded border border-white/10 bg-[#141416] p-4"
        >
          <div>
            <span className="mb-1.5 block font-mono text-[0.58rem] uppercase tracking-widest text-white/35">
              Who it is for
            </span>
            <div className="space-y-2">
              <label className="flex gap-3 rounded border border-white/10 p-3">
                <input
                  type="radio"
                  name="audience"
                  value="OPTED_IN"
                  checked={audience === "OPTED_IN"}
                  onChange={() => setAudience("OPTED_IN")}
                  className="mt-1 h-4 w-4 shrink-0"
                />
                <span>
                  <span className="block font-mono text-xs text-white">
                    Everyone who accepts email — {optedIn.toLocaleString("en-GB")}
                  </span>
                  <span className="mt-0.5 block font-mono text-[0.58rem] text-white/40">
                    News, a new thing in the app, a word before Christmas.
                  </span>
                </span>
              </label>
              <label className="flex gap-3 rounded border border-white/10 p-3">
                <input
                  type="radio"
                  name="audience"
                  value="ALL"
                  checked={audience === "ALL"}
                  onChange={() => setAudience("ALL")}
                  className="mt-1 h-4 w-4 shrink-0"
                />
                <span>
                  <span className="block font-mono text-xs text-white">
                    Every account — {all.toLocaleString("en-GB")}
                  </span>
                  <span className="mt-0.5 block font-mono text-[0.58rem] text-white/40">
                    Only for what a person is entitled to be told whether they
                    want our emails or not: a change to the privacy policy, a
                    security notice, the app closing.
                  </span>
                </span>
              </label>
            </div>
          </div>

          <input name="subject" placeholder="Subject" className={field} required />
          <textarea
            name="body"
            rows={10}
            placeholder={"Plain words. A blank line starts a new paragraph.\n\nNothing here is HTML — it is escaped, so a stray character can only ever look like a stray character."}
            className={`${field} resize-y`}
            required
          />
          <button type="submit" disabled={busy} className={btn}>
            Save it as a draft
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
          Drafts and what has gone
        </h2>
        {rows.length === 0 ? (
          <p className="mt-2 font-mono text-xs text-white/40">Nothing yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {rows.map((r) => {
              const n = reach(r.audience);
              return (
                <li key={r.id} className="rounded border border-white/10 bg-[#141416] p-4">
                  <p className="font-mono text-xs text-white">{r.subject}</p>
                  <p className="mt-0.5 font-mono text-[0.58rem] text-white/35">
                    {r.audience === "ALL" ? "every account" : "those who accept email"}
                    {" · "}written {r.created} by {r.createdBy}
                    {r.started && ` · started ${r.started}`}
                    {r.finished && ` · finished ${r.finished}`}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap font-mono text-[0.62rem] leading-relaxed text-white/50">
                    {r.body.length > 400 ? `${r.body.slice(0, 400)}…` : r.body}
                  </p>

                  {r.started && (
                    <p className="mt-2 font-mono text-[0.62rem] text-emerald-300/80">
                      {r.sentCount.toLocaleString("en-GB")} sent
                      {r.failedCount > 0 && ` · ${r.failedCount} refused`}
                      {!r.finished && " · not finished"}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {!r.started && (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => run(() => sendTest(r.id))}
                          className={btn}
                        >
                          Send it to me first
                        </button>
                        {confirmFor === r.id ? (
                          <>
                            <input
                              value={typed}
                              onChange={(e) => setTyped(e.target.value)}
                              placeholder={`type ${n} to send`}
                              className={`${field} w-44`}
                            />
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => run(() => beginSending(r.id, typed))}
                              className={go}
                            >
                              Send to {n.toLocaleString("en-GB")}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmFor(null)}
                              className={btn}
                            >
                              Not yet
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmFor(r.id);
                                setTyped("");
                              }}
                              className={go}
                            >
                              Send it to everybody
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => run(() => discardBroadcast(r.id))}
                              className={btn}
                            >
                              Throw it away
                            </button>
                          </>
                        )}
                      </>
                    )}

                    {r.started && !r.finished && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => run(() => sendNextBatch(r.id))}
                        className={go}
                      >
                        {busy ? "Sending…" : "Send the next batch"}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {said && <p className="font-mono text-xs text-emerald-300">{said}</p>}
      {error && <p className="font-mono text-xs text-red-300">{error}</p>}

      <p className="font-mono text-[0.58rem] leading-relaxed text-white/30">
        A broadcast cannot be unsent. It goes out in batches of fifty and
        remembers where it got to, so it can be pressed on again if it does
        not finish. Suspended accounts are never written to. Every draft, test
        and batch is written down under &ldquo;What was done&rdquo;.
      </p>
    </div>
  );
}
