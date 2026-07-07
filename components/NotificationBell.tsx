"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Item = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  href: string | null;
  read: boolean;
  createdAt: string;
};

export function NotificationBell({ initialUnread }: { initialUnread: number }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[] | null>(null);
  const [unread, setUnread] = useState(initialUnread);
  const ref = useRef<HTMLDivElement>(null);

  // Refresh the unread count periodically while the tab is open.
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (alive) setUnread(data.unread ?? 0);
      } catch {
        /* ignore */
      }
    };
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        setItems(data.items ?? []);
        setUnread(data.unread ?? 0);
        if ((data.unread ?? 0) > 0) {
          await fetch("/api/notifications/read", { method: "POST" });
          setUnread(0);
        }
      } catch {
        setItems([]);
      }
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Notifications"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent"
      >
        <BellIcon />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[0.6rem] font-medium text-on-accent">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
          <div className="border-b border-border px-4 py-3">
            <p className="eyebrow">Notifications</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items === null ? (
              <p className="px-4 py-6 font-mono text-xs text-muted">Loading…</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 font-mono text-xs leading-relaxed text-muted">
                Nothing yet. When someone prays for you or sends a word, it will
                appear here.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((n) => (
                  <li key={n.id}>
                    <Row item={n} onNavigate={() => setOpen(false)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ item, onNavigate }: { item: Item; onNavigate: () => void }) {
  const inner = (
    <div className={`px-4 py-3 ${item.read ? "" : "bg-accent/[0.05]"}`}>
      <p className="font-mono text-xs leading-relaxed text-ink">{item.title}</p>
      {item.body && (
        <p className="mt-1 font-mono text-[0.7rem] leading-relaxed text-muted">
          {item.body}
        </p>
      )}
      <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
        {new Date(item.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
  return item.href ? (
    <Link href={item.href} onClick={onNavigate} className="block hover:bg-bg">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
