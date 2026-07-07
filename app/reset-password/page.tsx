import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Set a new password for your Oyun account.",
  robots: { index: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token?.trim();
  const record = token
    ? await prisma.passwordResetToken.findUnique({ where: { token } })
    : null;
  const valid = !!record && record.expires >= new Date();

  return (
    <main className="mx-auto flex min-h-[86dvh] max-w-shell items-center justify-center px-6 py-16">
      <ThemeToggle className="fixed right-5 top-5 z-30" />
      <div className="w-full max-w-md animate-fade-up">
        <Link href="/" className="mb-8 inline-flex items-center gap-3">
          <OyunMark size={40} className="text-ink" />
          <span className="font-serif text-xl text-ink">Oyun</span>
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-8">
          {valid && token ? (
            <>
              <Eyebrow className="mb-4">Almost there</Eyebrow>
              <h1 className="font-serif text-3xl leading-snug text-ink">
                Choose a new password.
              </h1>
              <p className="mt-3 font-mono text-sm leading-relaxed text-muted">
                Pick something you&rsquo;ll remember. You&rsquo;ll use it to sign
                in from now on.
              </p>
              <ResetPasswordForm token={token} />
            </>
          ) : (
            <>
              <Eyebrow className="mb-4">Link expired</Eyebrow>
              <h1 className="font-serif text-3xl leading-snug text-ink">
                This reset link is no longer valid.
              </h1>
              <p className="mt-3 font-mono text-sm leading-relaxed text-muted">
                Reset links last one hour and can be used once. Request a fresh
                one and we&rsquo;ll send it right over.
              </p>
              <Link
                href="/forgot-password"
                className="mt-6 inline-block rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep"
              >
                Request a new link
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
