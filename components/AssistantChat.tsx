"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OyunMark } from "@/components/ui/OyunMark";
import { detectCrisis, type CrisisKind } from "@/lib/crisis";

type Msg = { role: "user" | "assistant"; content: string };

type Ctx = {
  authenticated: boolean;
  name?: string | null;
  role?: string | null;
  stageTitle?: string | null;
};

export function AssistantChat() {
  const [open, setOpen] = useState(false);
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

  const greeting = ctx?.name
    ? `Peace to you, ${ctx.name}.`
    : "Peace to you.";
  const subgreeting = ctx?.stageTitle
    ? ctx.stageTitle
    : "I'm Agbebi. I'll walk with you.";

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

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
  }, [input, streaming, messages]);

  return (
    <>
      {/* Floating trigger — the quiet mark, not loud decoration. */}
      <button
        type="button"
        aria-label={open ? "Close Agbebi" : "Open Agbebi"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-ink shadow-lg transition-colors hover:border-accent"
      >
        <OyunMark size={30} title="Agbebi" className={open ? "opacity-70" : "animate-breathe"} />
      </button>

      {open && (
        <section
          role="dialog"
          aria-label="Agbebi, your companion"
          className="fixed bottom-24 right-5 z-40 flex h-[min(32rem,75dvh)] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-fade-up"
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
            {messages.length === 0 && (
              <div className="space-y-3 pt-2">
                <p className="font-serif text-lg text-ink">{greeting}</p>
                <p className="font-mono text-xs leading-relaxed text-muted">
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
                className="max-h-28 flex-1 resize-none rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
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
        </section>
      )}
    </>
  );
}

function Bubble({ msg, streaming }: { msg: Msg; streaming: boolean }) {
  const isUser = msg.role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl rounded-br-sm bg-accent/15 px-3.5 py-2 font-mono text-sm text-ink"
            : "max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-bg px-3.5 py-2 font-mono text-sm leading-relaxed text-ink"
        }
      >
        {msg.content}
        {streaming && !isUser && (
          <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-accent align-middle" />
        )}
      </div>
    </div>
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
