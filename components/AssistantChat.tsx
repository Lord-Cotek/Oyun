"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OyunMark } from "@/components/ui/OyunMark";
import { detectCrisis, type CrisisKind } from "@/lib/crisis";
import { isGuestRoute } from "@/lib/assistant-routes";

type Msg = { role: "user" | "assistant"; content: string };

type Ctx = {
  authenticated: boolean;
  name?: string | null;
  role?: string | null;
  stageTitle?: string | null;
};

/**
 * Keep the launcher out of the way of the words.
 *
 * It is a fixed circle at the bottom right, so whatever sits there scrolls
 * underneath it — on the Oyun home page it covered the link in "No
 * appointments in the book. Put the next one in →", which is the whole point
 * of an empty state. Reserving a gutter cannot fix that, because the button
 * stays put while the page moves past it.
 *
 * So it gets out of the way while somebody is reading downwards, and comes
 * back the moment they stop or turn back. It never hides while it is open,
 * and never hides at the top of a page, where there is nothing to cover.
 */
function useHideOnScroll(open: boolean) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setHidden(false);
      return;
    }
    function onScroll() {
      const y = window.scrollY;
      const down = y > lastY.current;
      lastY.current = y;
      setHidden(down && y > 120);
      if (idle.current) clearTimeout(idle.current);
      // Reading stopped — hand it back.
      idle.current = setTimeout(() => setHidden(false), 700);
    }
    lastY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idle.current) clearTimeout(idle.current);
    };
  }, [open]);

  return hidden;
}

/**
 * Agbebi, everywhere she belongs and nowhere else.
 *
 * ── Two gates, and only one of them is this file ─────────────────────────
 * She is mounted in the root layout, so she used to float over the guest
 * pages too — a registry link sent to a grandmother, a single shared post,
 * an invitation. Those are pages held by people with no account, and the
 * endpoint behind the button answered anybody who asked. The stop that
 * matters is the session check on /api/agbebi; this one is manners. See
 * lib/assistant-routes.
 *
 * ── And why she still appears when nobody is signed in ───────────────────
 * On the pages that are not guest doors — the page that sells Oyun, the
 * privacy and terms — she opens and says what she is and who she walks
 * with. That is worth more than a button that is not there, and it cannot
 * cost a token: the composer is not rendered until the server has said
 * there is a session behind this browser.
 */
export function AssistantChat() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const hidden = useHideOnScroll(open);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [ctx, setCtx] = useState<Ctx | null>(null);
  const [crisis, setCrisis] = useState<CrisisKind>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && ctx === null) {
      fetch("/api/agbebi/context")
        .then((r) => r.json())
        .then((c: Ctx) => setCtx(c))
        .catch(() => setCtx({ authenticated: false }));
    }
  }, [open, ctx]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming]);

  /** Known to be signed out — not merely "not yet asked". */
  const signedOut = ctx !== null && !ctx.authenticated;

  const greeting = ctx?.name
    ? `Peace to you, ${ctx.name}.`
    : "Peace to you.";
  const subgreeting = ctx?.stageTitle
    ? ctx.stageTitle
    : "I'm Agbebi. I'll walk with you.";

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming || signedOut) return;

    const detected = detectCrisis(text);
    if (detected) setCrisis(detected);

    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/agbebi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        appendToLast(setMessages, err.error ?? "Agbebi is unavailable right now.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        appendToLast(setMessages, decoder.decode(value, { stream: true }));
      }
    } catch {
      appendToLast(setMessages, "\n\n[Connection lost. Please try again.]");
    } finally {
      setStreaming(false);
    }
  }, [input, streaming, messages, signedOut]);

  // Below every hook, never above one: a guest door gets no companion at all.
  if (isGuestRoute(pathname)) return null;

  return (
    <>
      {/* Floating trigger — the quiet mark, not loud decoration. */}
      <button
        type="button"
        aria-label={open ? "Close Agbebi" : "Open Agbebi"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`fab-bottom fixed right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-ink shadow-lg transition-all duration-300 hover:border-accent ${
          hidden
            ? "pointer-events-none translate-y-4 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <OyunMark size={30} title="Agbebi" className={open ? "opacity-70" : "animate-breathe"} />
      </button>

      {open && (
        <section
          role="dialog"
          aria-label="Agbebi, your companion"
          className="fab-panel-bottom fixed right-5 z-40 flex h-[min(32rem,70dvh)] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-fade-up"
        >
          <header className="flex items-center gap-3 border-b border-border px-4 py-3">
            <OyunMark size={26} title="Agbebi" />
            <div className="min-w-0">
              <p className="font-serif text-lg leading-tight text-ink">{greeting}</p>
              <p className="truncate font-mono text-[0.7rem] text-muted">{subgreeting}</p>
            </div>
          </header>

          {crisis && <CrisisBanner kind={crisis} onDismiss={() => setCrisis(null)} />}

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {signedOut && <SignedOut />}
            {!signedOut && messages.length === 0 && (
              <div className="space-y-3 pt-2">
                <p className="font-serif text-lg text-ink">{greeting}</p>
                <p className="prose-serif-xs text-muted">
                  Ask for a prayer, a word of Scripture, or just tell me how you
                  are. I'm here for the whole journey — but I'm not a doctor. For
                  anything medical, always turn to your care provider.
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <Bubble key={i} msg={m} streaming={streaming && i === messages.length - 1} />
            ))}
          </div>

          {signedOut ? (
            <div className="border-t border-border p-3">
              <Link
                href="/sign-in"
                className="flex min-h-11 items-center justify-center rounded-lg bg-accent px-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep"
              >
                Sign in
              </Link>
              <p className="mt-2 text-center font-mono text-[0.62rem] text-muted">
                No account yet?{" "}
                <Link href="/sign-up" className="text-accent hover:underline">
                  Start a journey
                </Link>
              </p>
            </div>
          ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="border-t border-border p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                rows={1}
                placeholder="Speak to Agbebi…"
                className="prose-serif-sm max-h-28 flex-1 resize-none rounded-lg border border-border bg-bg px-3 py-2 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={streaming || input.trim().length === 0}
                className="rounded-lg bg-accent px-3 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-40"
              >
                {streaming ? "…" : "Send"}
              </button>
            </div>
          </form>
          )}
        </section>
      )}
    </>
  );
}

/**
 * What she says to somebody who has not signed in.
 *
 * Not an error, and not a wall. Somebody reading the page that sells Oyun
 * has done nothing wrong by opening this; they are owed a straight answer
 * about who Agbebi is for, and a door.
 */
function SignedOut() {
  return (
    <div className="space-y-3 pt-2">
      <p className="font-serif text-lg text-ink">Peace to you.</p>
      <p className="prose-serif-xs text-muted">
        I'm Agbebi. I walk with families inside Oyun — Scripture, prayer and a
        word for whatever week you are in. Sign in and I'll know where you are
        in the journey, and we can talk properly.
      </p>
      <p className="prose-serif-xs text-muted">
        I'm not a doctor. For anything medical, always turn to your midwife or
        care provider.
      </p>
    </div>
  );
}

function Bubble({ msg, streaming }: { msg: Msg; streaming: boolean }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-accent/15 px-3.5 py-2 prose-serif-sm text-ink">
          {msg.content}
        </div>
      </div>
    );
  }

  const empty = msg.content.trim().length === 0;
  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-accent2/[0.08] px-4 py-2.5 text-[0.92rem] leading-relaxed text-ink">
        {empty && streaming ? <TypingDots /> : <AgbebiText text={msg.content} />}
      </div>
    </div>
  );
}

/** Renders Agbebi's words warmly: soft paragraphs, tidy bullets, gentle bold —
 *  and quietly cleans up any stray markdown so it never reads as "AI output". */
function AgbebiText({ text }: { text: string }) {
  const blocks = text
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-2.5">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim());
        const isList = lines.every((l) => /^([-*•]|\d+[.)])\s+/.test(l));
        if (isList && lines.length > 1) {
          return (
            <ul key={i} className="space-y-1">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span>{renderInline(l.replace(/^([-*•]|\d+[.)])\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {block.split("\n").map((l, j) => (
              <span key={j}>
                {renderInline(l.replace(/^([-*•]|\d+[.)])\s+/, "• "))}
                {j < block.split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/** Turns **bold** into real bold and drops stray emphasis markers. */
function renderInline(s: string) {
  const parts = s.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-medium text-ink">
        {p}
      </strong>
    ) : (
      <span key={i}>{p.replace(/\*/g, "")}</span>
    ),
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" aria-label="Agbebi is writing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent2"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

function CrisisBanner({
  kind,
  onDismiss,
}: {
  kind: CrisisKind;
  onDismiss: () => void;
}) {
  const isLoss = kind === "loss";
  return (
    <div className="border-b border-accent2/40 bg-accent2/10 px-4 py-3">
      <p className="eyebrow mb-1 text-accent2">
        {isLoss ? "You are not alone" : "Please reach for care"}
      </p>
      <p className="font-mono text-[0.72rem] leading-relaxed text-ink">
        {isLoss ? (
          <>
            I am so sorry. God is near to the brokenhearted (Psalm 34:18). Please
            reach out to your doctor or midwife, and lean on your church family.
            I can sit with you and pray, but you should not carry this alone.
          </>
        ) : (
          <>
            What you're describing may need care right away. Please contact your
            doctor, midwife, or emergency services now — don't wait. I'm here to
            pray with you, but I can't take the place of your care provider.
          </>
        )}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-2 font-mono text-[0.68rem] text-muted underline underline-offset-2 hover:text-ink"
      >
        Dismiss
      </button>
    </div>
  );
}

function appendToLast(
  setMessages: React.Dispatch<React.SetStateAction<Msg[]>>,
  chunk: string,
) {
  setMessages((m) => {
    const copy = [...m];
    const last = copy[copy.length - 1];
    if (last && last.role === "assistant") {
      copy[copy.length - 1] = { ...last, content: last.content + chunk };
    }
    return copy;
  });
}
