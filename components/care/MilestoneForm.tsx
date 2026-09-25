"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { addMilestone } from "@/app/care/actions";
import { MilestoneFields } from "@/components/care/MilestoneFields";
import { sendPhotos } from "@/components/care/send-photos";

export function MilestoneForm({
  children = [],
}: {
  children?: { id: string; name: string }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <form
      ref={formRef}
      action={async (fd) => {
        setMsg(null);
        try {
          const lost = await sendPhotos(formRef.current, fd, setMsg);
          await addMilestone(fd);
          formRef.current?.reset();
          setMsg(
            lost === 0
              ? null
              : {
                  ok: false,
                  text: `Remembered, but ${lost} ${lost === 1 ? "photo" : "photos"} wouldn’t upload. You can add ${lost === 1 ? "it" : "them"} again.`,
                },
          );
        } catch (err) {
          setMsg({
            ok: false,
            text: err instanceof Error ? err.message : "Couldn’t save.",
          });
        }
      }}
      className="space-y-3"
    >
      <MilestoneFields children={children} />
      <Submit />
      {msg && (
        <p
          role="status"
          className={`prose-serif-xs ${msg.ok ? "text-muted" : "text-negative"}`}
        >
          {msg.text}
        </p>
      )}
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
    >
      {pending ? "Remembering…" : "Remember this first"}
    </button>
  );
}
