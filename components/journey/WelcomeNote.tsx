"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * The first hello, once.
 *
 * Onboarding has always sent people to /journey?welcome=1 and nothing ever
 * read it, so somebody who had just started — or just been let in — landed on
 * a full home page with no word at all. The two arrivals are told apart by
 * the address itself: starting a journey adds `j=`, accepting an invitation
 * does not.
 *
 * It takes the words out of the address as soon as it shows, so a refresh or
 * a bookmark does not say hello a second time.
 */
export function WelcomeNote() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [kind, setKind] = useState<"started" | "joined" | null>(null);

  useEffect(() => {
    if (pathname !== "/journey" || params.get("welcome") !== "1") return;
    setKind(params.get("j") ? "started" : "joined");
    router.replace("/journey", { scroll: false });
  }, [params, pathname, router]);

  if (!kind) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[45] mx-auto max-w-md animate-fade-up rounded-2xl border border-accent/40 bg-surface p-5 shadow-2xl lg:bottom-8"
    >
      <p className="eyebrow mb-2 text-accent">
        {kind === "started" ? "Welcome to Oyun" : "Welcome — you’re in"}
      </p>
      <p className="prose-serif-sm text-ink">
        {kind === "started"
          ? "This is the home of your journey. Each week it shows where your baby is, and keeps how you are, your letters and your dates in one quiet place. Nobody else is here until you invite them."
          : "This is where you’ll follow the journey, see how to stand with them, and keep up with the family’s news. A short note comes each week, so nothing important passes you by."}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {kind === "started" && (
          <Link
            href="/circle"
            className="rounded-lg bg-accent px-4 py-2 font-mono text-xs font-medium text-on-accent transition-colors hover:bg-accent-deep"
          >
            Invite someone to walk with you
          </Link>
        )}
        <button
          type="button"
          onClick={() => setKind(null)}
          className="font-mono text-xs text-muted underline underline-offset-4 hover:text-accent"
        >
          {kind === "started" ? "Look around first" : "Look around"}
        </button>
      </div>
    </div>
  );
}
