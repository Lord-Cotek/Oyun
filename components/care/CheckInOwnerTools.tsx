"use client";

import { useRouter } from "next/navigation";
import { EditInPlace } from "@/components/ui/EditInPlace";
import { ConfirmButton } from "@/components/ui/Confirm";
import { deleteCheckIn, editCheckIn } from "@/app/care/actions";
import { MOOD_META, MOOD_ORDER } from "@/lib/moods";

/** Hers alone: change how she said she was, or take it away. */
export function CheckInOwnerTools({ id, mood, note }: { id: string; mood: string; note: string | null }) {
  const router = useRouter();
  return (
    <div className="mt-4 flex flex-wrap items-start gap-4">
      <EditInPlace
        describe="this check-in"
        action={editCheckIn}
        hidden={{ id }}
        fields={[
          {
            name: "mood",
            label: "How you were",
            kind: "select",
            value: mood,
            options: MOOD_ORDER.map((m) => ({ value: m, label: MOOD_META[m].label })),
          },
          { name: "note", label: "Your note", kind: "textarea", value: note ?? "", max: 4000, rows: 4 },
        ]}
      />
      <ConfirmButton
        press="none"
        describe="this check-in"
        onConfirm={async () => {
          const fd = new FormData();
          fd.set("id", id);
          const r = await deleteCheckIn(fd);
          if (r.ok) router.push("/care");
          return r;
        }}
        className="font-mono text-[0.68rem] text-muted underline-offset-2 hover:text-negative hover:underline"
      />
    </div>
  );
}
