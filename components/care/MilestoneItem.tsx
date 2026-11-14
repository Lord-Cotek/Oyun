"use client";

import { useRef, useState } from "react";
import { mediaAlt } from "@/lib/alt";
import { useFormStatus } from "react-dom";
import { updateMilestone, deleteMilestone, shareMilestone } from "@/app/care/actions";
import Link from "next/link";
import { postPath } from "@/lib/open-item";
import { MilestoneFields, milestoneTitle } from "@/components/care/MilestoneFields";
import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { sendPhotos } from "@/components/care/send-photos";
import { ConfirmDialog } from "@/components/ui/Confirm";

export type MilestoneData = {
  id: string;
  kind: string;
  title: string | null;
  note: string | null;
  occurredAt: string; // ISO
  photoUrls: string[];
  childId: string | null;
  childName: string | null;
  /** The Life post this was shared as, if it was and the post still exists. */
  postId: string | null;
};

export function MilestoneItem({
  m,
  children,
}: {
  m: MilestoneData;
  children: { id: string; name: string }[];
}) {
  const [editing, setEditing] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [going, setGoing] = useState(false);
  const [sharing, setSharing] = useState<"no" | "asking" | "going">("no");
  const [sharedId, setSharedId] = useState<string | null>(m.postId);
  const [shareError, setShareError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const occurred = new Date(m.occurredAt);
  const childId = m.childId ?? "";

  if (editing) {
    return (
      <li id={`milestone-${m.id}`} className="notif-target relative">
        <span className="absolute -left-[1.4rem] top-1.5 h-2 w-2 rounded-full bg-accent ring-4 ring-bg" />
        <form
          ref={formRef}
          action={async (fd) => {
            setMsg(null);
            try {
              const lost = await sendPhotos(formRef.current, fd, setMsg);
              await updateMilestone(fd);
              if (lost === 0) {
                setEditing(false);
              } else {
                // Kept open, because the ones that failed are still sitting in
                // the picker and closing the form would take them with it.
                setMsg({
                  ok: false,
                  text: `Saved, but ${lost} ${lost === 1 ? "photo" : "photos"} wouldn’t upload. Try ${lost === 1 ? "it" : "them"} again.`,
                });
              }
            } catch (err) {
              setMsg({
                ok: false,
                text: err instanceof Error ? err.message : "Couldn’t save.",
              });
            }
          }}
          className="space-y-3 rounded-lg border border-border bg-bg p-4"
        >
          <input type="hidden" name="id" value={m.id} />
          <MilestoneFields
            children={children}
            existingPhotoUrls={m.photoUrls}
            defaults={{
              kind: m.kind,
              title: m.title,
              note: m.note,
              occurredAt: occurred.toISOString().slice(0, 10),
              childId,
            }}
          />
          {msg && (
            <p
              role="status"
              className={`prose-serif-xs ${msg.ok ? "text-muted" : "text-negative"}`}
            >
              {msg.text}
            </p>
          )}
          <div className="flex items-center gap-3">
            <SaveBtn />
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="font-mono text-xs text-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li id={`milestone-${m.id}`} className="notif-target relative">
      <span className="absolute -left-[1.4rem] top-1.5 h-2 w-2 rounded-full bg-accent ring-4 ring-bg" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-sm text-ink">
            {milestoneTitle(m.kind, m.title)}
            {m.childName && (
              <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[0.6rem] text-accent">
                {m.childName}
              </span>
            )}
          </p>
          {m.note && (
            <p className="mt-0.5 prose-serif-xs text-muted">{m.note}</p>
          )}
          <p className="mt-0.5 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
            {occurred.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <PhotoGallery
            urls={m.photoUrls}
            alt={mediaAlt({
              said: m.note ?? milestoneTitle(m.kind, m.title),
              kind: "milestone",
            })}
          />
          {/* ── Telling the circle ───────────────────────────────────────
              A first is the household's until a parent chooses otherwise —
              so it is a button, it asks first, and it says what will be
              seen. Afterwards the card says so, and links to the post. */}
          <div className="mt-2">
            {sharedId ? (
              <p className="font-mono text-[0.66rem] text-muted">
                Shared with the circle ·{" "}
                <Link href={postPath(sharedId)} className="text-accent underline underline-offset-4">
                  See it in Life
                </Link>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShareError(null);
                  setSharing("asking");
                }}
                className="font-mono text-[0.66rem] text-accent underline underline-offset-4"
              >
                Tell the circle
              </button>
            )}
            {shareError && (
              <p className="mt-1 font-mono text-[0.66rem] text-negative">{shareError}</p>
            )}
          </div>
          <ConfirmDialog
            open={sharing !== "no"}
            title={`Share “${milestoneTitle(m.kind, m.title)}” with the circle?`}
            body={[
              "Everyone in your circle will see it in Life and be told about it",
              m.note ? ", with your note" : "",
              m.photoUrls.length > 0
                ? ` and ${m.photoUrls.length === 1 ? "the photograph" : `the ${m.photoUrls.length} photographs`}`
                : "",
              ". It stays on your Firsts page as well.",
            ].join("")}
            confirmWord="Share it"
            busy={sharing === "going"}
            onCancel={() => setSharing("no")}
            onConfirm={async () => {
              setSharing("going");
              const res = await shareMilestone(m.id);
              setSharing("no");
              if (res.ok) setSharedId(res.postId);
              else setShareError(res.error);
            }}
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Edit"
            className="font-mono text-[0.68rem] text-muted hover:text-accent"
          >
            Edit
          </button>
          {/* Was a bare submit inside a form: one tap and a memory, with
              whatever photographs were on it, was gone for good. */}
          <button
            type="button"
            onClick={() => setRemoving(true)}
            className="font-mono text-[0.68rem] text-muted hover:text-negative"
          >
            Delete
          </button>
          <ConfirmDialog
            open={removing}
            title={`Delete “${milestoneTitle(m.kind, m.title)}”?`}
            body={
              m.photoUrls.length > 0
                ? `The ${m.photoUrls.length === 1 ? "photograph" : "photographs"} on it go too, and this cannot be undone.`
                : "This cannot be undone."
            }
            confirmWord="Delete it"
            busy={going}
            onCancel={() => setRemoving(false)}
            onConfirm={() => {
              setGoing(true);
              const fd = new FormData();
              fd.set("id", m.id);
              void deleteMilestone(fd);
            }}
          />
        </div>
      </div>
    </li>
  );
}

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}
