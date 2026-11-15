import type { Metadata } from "next";
import Link from "next/link";
import { checkUnsubToken, isUnsubKind } from "@/lib/unsubscribe";
import { UnsubscribeButton } from "./UnsubscribeButton";

export const metadata: Metadata = {
  title: "Stop these emails",
  robots: { index: false, follow: false },
};

const WHAT: Record<string, { name: string; after: string }> = {
  weekly: {
    name: "the weekly email",
    after: "You will not get the Monday email any more. Everything else stays as it is.",
  },
  email: {
    name: "notification emails",
    after: "You will not get notification emails any more. You will still see everything in the app, and emails about your account itself (sign-in codes, password resets) still come.",
  },
};

/**
 * The page the link in an email opens. It asks before it acts: link
 * scanners in mail systems open every link they see, and somebody's
 * emails should not stop because a scanner looked.
 */
export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: { u?: string; k?: string; t?: string };
}) {
  const { u = "", k, t = "" } = searchParams;
  const genuine = !!u && isUnsubKind(k) && checkUnsubToken(u, k, t);
  const what = genuine ? WHAT[k!] : null;

  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center px-6 py-16">
      <p className="eyebrow mb-3 text-accent">Emails</p>
      {what ? (
        <>
          <h1 className="font-serif text-3xl text-ink">Stop {what.name}?</h1>
          <p className="prose-serif-sm mt-3 text-muted">{what.after}</p>
          <UnsubscribeButton u={u} k={k!} t={t} />
          <p className="mt-6 font-mono text-xs text-muted">
            You can turn it back on any time in{" "}
            <Link href="/settings" className="text-accent underline underline-offset-4">
              Settings
            </Link>
            .
          </p>
        </>
      ) : (
        <>
          <h1 className="font-serif text-3xl text-ink">This link does not work.</h1>
          <p className="prose-serif-sm mt-3 text-muted">
            It may have been cut short when it was copied. You can choose which emails you get
            in{" "}
            <Link href="/settings" className="text-accent underline underline-offset-4">
              Settings
            </Link>
            .
          </p>
        </>
      )}
    </main>
  );
}
