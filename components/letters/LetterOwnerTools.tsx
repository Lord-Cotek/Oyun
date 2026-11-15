"use client";

import { useRouter } from "next/navigation";
import { EditInPlace } from "@/components/ui/EditInPlace";
import { ConfirmButton } from "@/components/ui/Confirm";
import { deleteOwnLetter, editLetter } from "@/app/care/actions";

/** The writer's own controls on a letter: change the words, or take it back. */
export function LetterOwnerTools({ id, body }: { id: string; body: string }) {
  const router = useRouter();
  return (
    <div className="mt-3 flex flex-wrap items-start gap-4 border-t border-border pt-3">
      <EditInPlace
        describe="this letter"
        action={editLetter}
        hidden={{ id }}
        fields={[{ name: "body", label: "Your letter", kind: "textarea", value: body, max: 20000, required: true, rows: 10 }]}
      />
      <ConfirmButton
        press="none"
        describe="this letter"
        onConfirm={async () => {
          const fd = new FormData();
          fd.set("id", id);
          const r = await deleteOwnLetter(fd);
          if (r.ok) router.push("/letters");
          return r;
        }}
        className="font-mono text-[0.68rem] text-muted underline-offset-2 hover:text-negative hover:underline"
      />
    </div>
  );
}
