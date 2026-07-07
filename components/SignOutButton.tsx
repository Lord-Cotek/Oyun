"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-md px-3 py-1.5 tracking-wide text-muted transition-colors hover:text-ink"
    >
      Sign out
    </button>
  );
}
