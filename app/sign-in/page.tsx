import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";
import { SignInForm } from "@/components/SignInForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Enter Oyun.",
  robots: { index: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; reset?: string };
}) {
  const session = await auth();
  if (session?.user) redirect("/journey");

  const justReset = searchParams.reset === "1";

  return (
    <main className="mx-auto flex min-h-[86dvh] max-w-shell items-center justify-center px-6 py-16">
      <ThemeToggle className="fixed right-5 top-5 z-30" />
      <div className="w-full max-w-md animate-fade-up">
        <Link href="/" className="mb-8 inline-flex items-center gap-3">
          <OyunMark size={40} className="text-ink" />
          <span className="font-serif text-xl text-ink">Oyun</span>
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-8">
          <Eyebrow className="mb-4">Enter Oyun</Eyebrow>
          <h1 className="font-serif text-3xl leading-snug text-ink">
            Welcome back.
          </h1>
          <p className="mt-3 font-mono text-sm leading-relaxed text-muted">
            Sign in with your email and password to continue your journey.
          </p>
          {justReset && (
            <p className="mt-4 rounded-lg border border-positive/40 bg-positive/10 px-3 py-2 font-mono text-xs text-positive">
              Your password has been reset. Sign in with your new password.
            </p>
          )}
          <SignInForm callbackUrl={searchParams.callbackUrl} />
        </div>

        <p className="mt-6 max-w-md font-mono text-[0.68rem] leading-relaxed text-muted">
          Oyun and Agbebi offer spiritual companionship — not medical advice.
          Always consult your doctor or midwife for health decisions.
        </p>
      </div>
    </main>
  );
}
