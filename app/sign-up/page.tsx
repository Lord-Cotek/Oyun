import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";
import { SignUpForm } from "@/components/SignUpForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Begin your journey with Oyun.",
  robots: { index: false },
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const session = await auth();
  if (session?.user) redirect("/journey");

  return (
    <main className="mx-auto flex min-h-[86dvh] max-w-shell items-center justify-center px-6 py-16">
      <ThemeToggle className="fixed right-5 top-5 z-30" />
      <div className="w-full max-w-md animate-fade-up">
        <Link href="/" className="mb-8 inline-flex items-center gap-3">
          <OyunMark size={40} className="text-ink" />
          <span className="font-serif text-xl text-ink">Oyun</span>
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-8">
          <Eyebrow className="mb-4">Begin the journey</Eyebrow>
          <h1 className="font-serif text-3xl leading-snug text-ink">
            Create your account.
          </h1>
          <p className="mt-3 font-mono text-sm leading-relaxed text-muted">
            We&rsquo;ll send you a warm welcome, then set you where you are on the
            journey. No account is ever a promise of outcome — only a companion
            for the road.
          </p>
          <SignUpForm callbackUrl={searchParams.callbackUrl} />
        </div>

        <p className="mt-6 max-w-md font-mono text-[0.68rem] leading-relaxed text-muted">
          Oyun and Agbebi offer spiritual companionship — not medical advice.
          Always consult your doctor or midwife for health decisions.
        </p>
      </div>
    </main>
  );
}
