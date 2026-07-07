"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { addChild, updateChild } from "@/app/child/actions";

type Child = {
  id: string;
  name: string;
  sex: string | null;
  birthDate: string | null;
  note: string | null;
};

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

export function ChildForm({
  child,
  onDone,
}: {
  child?: Child;
  onDone?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const editing = !!child;

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        if (editing) await updateChild(fd);
        else await addChild(fd);
        formRef.current?.reset();
        onDone?.();
      }}
      className="space-y-3"
    >
      {editing && <input type="hidden" name="id" value={child.id} />}
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="eyebrow mb-1.5 block text-muted">Name</span>
          <input name="name" required defaultValue={child?.name ?? ""} placeholder="Their name" className={inputClass} />
        </label>
        <label className="block">
          <span className="eyebrow mb-1.5 block text-muted">Boy or girl</span>
          <select name="sex" defaultValue={child?.sex ?? ""} className={inputClass}>
            <option value="">Prefer not to say</option>
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="eyebrow mb-1.5 block text-muted">Birth date</span>
        <input name="birthDate" type="date" defaultValue={child?.birthDate ?? ""} className={inputClass} />
      </label>
      <label className="block">
        <span className="eyebrow mb-1.5 block text-muted">A note (optional)</span>
        <input name="note" defaultValue={child?.note ?? ""} placeholder="A blessing, a hope, a detail to remember" className={inputClass} />
      </label>
      <label className="block">
        <span className="eyebrow mb-1.5 block text-muted">Photo (optional)</span>
        <input
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          className="w-full font-mono text-xs text-muted file:mr-3 file:rounded-md file:border file:border-border file:bg-bg file:px-3 file:py-1.5 file:font-mono file:text-xs file:text-ink hover:file:border-accent hover:file:text-accent"
        />
      </label>
      <div className="flex items-center gap-3">
        <Submit editing={editing} />
        {editing && onDone && (
          <button type="button" onClick={onDone} className="font-mono text-xs text-muted hover:text-ink">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Submit({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
    >
      {pending ? "Saving…" : editing ? "Save changes" : "Add child"}
    </button>
  );
}
