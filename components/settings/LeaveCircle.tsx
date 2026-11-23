"use client";

import { useState, useTransition } from "react";
import { ConfirmDialog } from "@/components/ui/Confirm";
import { leaveCircle } from "@/app/circle/actions";

/** Anyone but the mother may go, whenever they like, without asking. */
export function LeaveCircle({ motherName }: { motherName: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="space-y-2">
      <p className="prose-serif-xs text-muted">
        You can leave {motherName}&rsquo;s circle whenever you like. What you wrote stays with
        the journey.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-xs text-muted underline underline-offset-4 hover:text-negative"
      >
        Leave this circle
      </button>
      {error && <p className="font-mono text-xs text-negative">{error}</p>}
      <ConfirmDialog
        open={open}
        title={`Leave ${motherName}’s circle?`}
        body="You will stop seeing the updates, photographs and requests straight away, and stop being told about them. What you wrote stays where it is. To come back, they would invite you again."
        confirmWord="Leave"
        busy={pending}
        onCancel={() => setOpen(false)}
        onConfirm={() =>
          start(async () => {
            const r = await leaveCircle().catch(() => ({
              ok: false as const,
              error: "That didn't go through. Try again.",
            }));
            if (r.ok) {
              window.location.href = "/journey";
            } else {
              setOpen(false);
              setError(r.error);
            }
          })
        }
      />
    </div>
  );
}
