"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { addMilestone } from "@/app/care/actions";
import { MilestoneFields } from "@/components/care/MilestoneFields";

export function MilestoneForm({
  children = [],
}: {
  children?: { id: string; name: string }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await addMilestone(fd);
        formRef.current?.reset();
      }}
      className="space-y-3"
    >
      <MilestoneFields children={children} />
      <Submit />
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
