"use client";

import { useState, useTransition } from "react";
import { changeMemberRole } from "@/app/circle/actions";

/** What somebody is in the circle, changeable by the two who keep it. */
export function MemberRole({
  membershipId,
  name,
  role,
  options,
}: {
  membershipId: string;
  name: string;
  role: string;
  options: { value: string; label: string }[];
}) {
  const [value, setValue] = useState(role);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <span className="flex flex-col">
      <select
        id={`role-${membershipId}`}
        aria-label={`What ${name} is in the circle`}
        value={value}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          const before = value;
          setValue(next);
          setError(null);
          start(async () => {
            const r = await changeMemberRole(membershipId, next).catch(() => ({
              ok: false as const,
              error: "That didn't save. Try again.",
            }));
            if (!r.ok) {
              setValue(before);
              setError(r.error);
            }
          });
        }}
        className="w-fit rounded-md border border-border bg-bg px-2 py-0.5 font-mono text-[0.68rem] text-muted focus:border-accent focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 font-mono text-[0.62rem] text-negative">{error}</span>}
    </span>
  );
}
