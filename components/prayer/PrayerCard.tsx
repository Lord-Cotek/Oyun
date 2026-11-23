"use client";

import { prayForRequest, markAnswered, deletePrayerRequest, editPrayerRequest } from "@/app/prayer/actions";
import { EditInPlace } from "@/components/ui/EditInPlace";
import { Card } from "@/components/ui/Card";
import { HoldToPray } from "@/components/ui/HoldToPray";
import { Reactions } from "@/components/Reactions";
import { type ReactionData } from "@/lib/reaction-emojis";
import { ConfirmButton } from "@/components/ui/Confirm";

export type PrayerItem = {
  id: string;
  title: string;
  body: string | null;
  authorName: string | null;
  answered: boolean;
  answeredAt: string | null;
  createdAt: string;
  prayerCount: number;
  /** Of prayerCount, those who chose Oyun without religious content. */
  heldCount?: number;
  didIPray: boolean;
  canManage: boolean;
  /** The viewer asked it — the only one who may change its words. */
  mine?: boolean;
  reactions: ReactionData;
};

/** The same request in plain words — for a reader who chose Oyun without
 *  religious content (lib/voice.ts). The request itself is shown as written. */
const PLAIN_HOLD = {
  hold: "Hold to send love",
  holding: "Sending…",
  done: "Thinking of you",
  doneAria: "You are holding this in mind",
};

/**
 * Who is carrying it, said truthfully for this reader. Somebody who chose
 * Oyun without religious content held it rather than prayed it; a reader in
 * that voice sees everybody as "thinking of you", a reader in the faith voice
 * sees the two apart.
 */
function countLine(item: PrayerItem, general: boolean): string {
  const total = item.prayerCount;
  if (total <= 0) return "";
  if (general) return ` · ${total} thinking of you`;
  const held = Math.min(total, item.heldCount ?? 0);
  const praying = total - held;
  return [praying > 0 ? ` · ${praying} praying` : "", held > 0 ? ` · ${held} thinking of you` : ""].join("");
}

export function PrayerCard({ item, general = false }: { item: PrayerItem; general?: boolean }) {
  const what = general ? "this request" : "this prayer request";
  return (
    <Card
      id={`prayer-${item.id}`}
      className={`notif-target ${item.answered ? "border-positive/30 bg-positive/[0.05]" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {item.answered && (
            <p className="eyebrow mb-1 text-positive">{general ? "Resolved" : "Answered"}</p>
          )}
          <p className="font-serif text-lg leading-snug text-ink">{item.title}</p>
          {item.body && (
            <p className="mt-1.5 prose-serif-xs text-muted">
              {item.body}
            </p>
          )}
          <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
            {item.authorName ?? "A member"} ·{" "}
            {new Date(item.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
            {countLine(item, general)}
          </p>
        </div>
      </div>

      {/* Its own line, above the controls: this is a reply to what was
          written, not another button to press. It stays on an answered
          request too — a 🙌 on an answer is the point of keeping them. */}
      <div className="mt-3">
        <Reactions targetType="PRAYER" targetId={item.id} initial={item.reactions} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3">
        {!item.answered && (
          <HoldToPray
            prayed={item.didIPray}
            count={item.prayerCount}
            action={() => prayForRequest(item.id)}
            words={general ? PLAIN_HOLD : undefined}
          />
        )}
        {item.canManage && !item.answered && (
          <form action={markAnswered}>
            <input type="hidden" name="requestId" value={item.id} />
            <button
              type="submit"
              className="font-mono text-xs text-muted hover:text-positive"
            >
              {general ? "Mark resolved" : "Mark answered"}
            </button>
          </form>
        )}
        {item.mine && !item.answered && (
          <EditInPlace
            describe={`${what}: ${item.title}`}
            action={editPrayerRequest}
            hidden={{ id: item.id }}
            fields={[
              { name: "title", label: "The request", kind: "text", value: item.title, max: 200, required: true },
              { name: "body", label: "More, if you want to say it", kind: "textarea", value: item.body ?? "", max: 4000, rows: 3 },
            ]}
          />
        )}
        {item.canManage && (
          <div className="ml-auto">
            {/* Was a bare submit: one tap and the request was gone. */}
            <ConfirmButton
              describe={`${what}: ${item.title}`}
              press="none"
              onConfirm={async () => {
                const fd = new FormData();
                fd.set("requestId", item.id);
                await deletePrayerRequest(fd);
              }}
              className="font-mono text-[0.7rem] text-muted underline-offset-2 hover:text-negative hover:underline"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
