import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";
import { SignInForm } from "@/components/SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Enter Oyun with a secure email link.",
  robots: { index: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { sent?: string; callbackUrl?: string };
}) {
  const session = await auth();
  if (session?.user) redirect("/journey");

  const sent = searchParams.sent === "1";

  return (
    <main className="mx-auto flex min-h-[86dvh] max-w-shell items-center justify-center px-6 py-16">
      <div className="w-full max-w-md animate-fade-up">
        <Link href="/" className="mb-8 inline-flex items-center gap-3">
          <OyunMark size={40} className="text-ink" />
          <span className="font-serif text-xl text-ink">Oyun</span>
        </Link>

        {sent ? (
          <div className="rounded-2xl border border-border bg-surface p-8">
            <Eyebrow className="mb-4">Check your inbox</Eyebrow>
            <h1 className="font-serif text-3xl leading-snug text-ink">
              A link is on its way.
            </h1>
            <p className="mt-4 font-mono text-sm leading-relaxed text-muted">
              We&rsquo;ve sent a secure sign-in link to your email. Open it on
              this device to enter Oyun. The link expires in 30 minutes.
            </p>
            <Link
              href="/sign-in"
              className="mt-6 inline-block font-mono text-xs text-accent underline underline-offset-4"
            >
              Use a different email
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-8">
            <Eyebrow className="mb-4">Enter Oyun</Eyebrow>
            <h1 className="font-serif text-3xl leading-snug text-ink">
              Sign in with your email.
            </h1>
            <p className="mt-3 font-mono text-sm leading-relaxed text-muted">
              No password. We&rsquo;ll email you a secure link to enter — for a
              new journey or to accept an invite.
            </p>
            <SignInForm callbackUrl={searchParams.callbackUrl} />
          </div>
        )}

        <p className="mt-6 max-w-md font-mono text-[0.68rem] leading-relaxed text-muted">
          Oyun and Agbebi offer spiritual companionship — not medical advice.
          Always consult your doctor or midwife for health decisions.
        </p>
      </div>
    </main>
  );
}
