"use client";

import { useTransition } from "react";
import { prayForRequest, markAnswered, deletePrayerRequest } from "@/app/prayer/actions";
import { Card } from "@/components/ui/Card";

export type PrayerItem = {
  id: string;
  title: string;
  body: string | null;
  authorName: string | null;
  answered: boolean;
  answeredAt: string | null;
  createdAt: string;
  prayerCount: number;
  didIPray: boolean;
  canManage: boolean;
};

export function PrayerCard({ item }: { item: PrayerItem }) {
  const [pending, start] = useTransition();

  return (
    <Card
      id={`prayer-${item.id}`}
      className={`notif-target ${item.answered ? "border-positive/30 bg-positive/[0.05]" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {item.answered && (
            <p className="eyebrow mb-1 text-positive">Answered</p>
          )}
          <p className="font-serif text-lg leading-snug text-ink">{item.title}</p>
          {item.body && (
            <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted">
              {item.body}
            </p>
          )}
          <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
            {item.authorName ?? "A member"} ·{" "}
            {new Date(item.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
            {item.prayerCount > 0 && ` · ${item.prayerCount} praying`}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3">
        {!item.answered && (
          <button
            type="button"
            disabled={pending || item.didIPray}
            onClick={() => start(() => prayForRequest(item.id))}
            className={`rounded-lg border px-3.5 py-1.5 font-mono text-xs transition-colors ${
              item.didIPray
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-border text-ink hover:border-accent hover:text-accent disabled:opacity-50"
            }`}
          >
            {item.didIPray ? "You're praying 🙏" : "I'm praying"}
          </button>
        )}
        {item.canManage && !item.answered && (
          <form action={markAnswered}>
            <input type="hidden" name="requestId" value={item.id} />
            <button
              type="submit"
              className="font-mono text-xs text-muted hover:text-positive"
            >
              Mark answered
            </button>
          </form>
        )}
        {item.canManage && (
          <form action={deletePrayerRequest} className="ml-auto">
            <input type="hidden" name="requestId" value={item.id} />
            <button
              type="submit"
              className="font-mono text-[0.7rem] text-muted underline-offset-2 hover:text-negative hover:underline"
            >
              Remove
            </button>
          </form>
        )}
      </div>
    </Card>
  );
}
