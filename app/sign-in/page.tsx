import type { Metadata } from "next";
import { PROMISE_SHORT } from "@/lib/promise";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";
import { SignInForm } from "@/components/SignInForm";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { getLang, yorubaOffered } from "@/lib/lang";
import { sayIn, wordsFor } from "@/lib/i18n";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Enter Oyun.",
  robots: { index: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; reset?: string; email?: string };
}) {
  // A clinician's door — see lib/clinician.ts. The same account and the same
  // form; the words say where it leads, and it leads to their patients (or
  // to the invitation they came to accept) rather than to a journey.
  const cb = searchParams.callbackUrl ?? "";
  const forClinician = /^\/doctor(\/[A-Za-z0-9/_-]*)?$/.test(cb);
  const forInvite = forClinician && cb.startsWith("/doctor/invite/");

  const session = await auth();
  if (session?.user) redirect(forClinician ? cb : "/journey");

  const justReset = searchParams.reset === "1";
  const invited = !!searchParams.callbackUrl?.includes("invite=");
  const [lang, offered] = await Promise.all([getLang(), yorubaOffered()]);
  const words = wordsFor(lang);
  const w = (en: string) => sayIn(words, en);

  return (
    <main className="md:grid md:min-h-[100dvh] md:grid-cols-2">
      <ThemeToggle className="fixed right-5 top-5 z-30" />

      {/* Brand & Scripture — desktop */}
      <aside className="relative hidden overflow-hidden bg-surface p-12 md:flex md:flex-col md:justify-between">
        <Link href="/" className="inline-flex items-center gap-3">
          <OyunMark size={44} className="animate-breathe text-ink" />
          <span className="font-serif text-xl text-ink">Oyun</span>
        </Link>
        <div className="max-w-sm">
          {/* Neutral: before signing in, we do not know how this person
              chose to be spoken to. See lib/voice.ts. */}
          <p className="font-serif text-3xl leading-snug text-ink">
            Every week of it, with the people who love you close by.
          </p>
        </div>
        <p className="prose-serif-xs max-w-xs text-muted">
          {PROMISE_SHORT}
        </p>
      </aside>

      {/* Form */}
      <div className="flex min-h-[100dvh] items-center justify-center px-6 py-16 md:min-h-0">
        <div className="w-full max-w-md animate-fade-up">
          <Link href="/" className="mb-8 inline-flex items-center gap-3 md:hidden">
            <OyunMark size={40} className="text-ink" />
            <span className="font-serif text-xl text-ink">Oyun</span>
          </Link>

          <div className="rounded-2xl border border-border bg-surface p-8" lang={lang === "yo" ? "yo" : undefined}>
            <Eyebrow className="mb-4">{forClinician ? "For doctors and midwives" : w("Enter Oyun")}</Eyebrow>
            <h1 className="font-serif text-3xl leading-snug text-ink">
              {forInvite
                ? "Sign in to accept."
                : forClinician
                  ? "Sign in to your patients."
                  : invited
                    ? w("Sign in to join.")
                    : w("Welcome back.")}
            </h1>
            <p className="mt-3 prose-serif-sm text-muted">
              {forInvite
                ? "Sign in with the address the invitation was sent to, and your patient’s records are one tap away."
                : forClinician
                  ? "Sign in with your email and password to see the patients who share their records with you."
                  : invited
                    ? w("You already have an account with this email — sign in, and you'll accept the invitation next.")
                    : w("Sign in with your email and password to continue your journey.")}
            </p>
            {justReset && (
              <p className="prose-serif-xs mt-4 rounded-lg border border-positive/40 bg-positive/10 px-3 py-2 text-positive">
                Your password has been reset. Sign in with your new password.
              </p>
            )}
            <SignInForm
              callbackUrl={searchParams.callbackUrl}
              initialEmail={searchParams.email}
              words={words}
              // A clinician without an account makes a clinician one — or,
              // from an invitation, goes back to it, where that is offered.
              createHref={forInvite ? cb : forClinician ? "/doctor/join" : undefined}
            />
          </div>
          {/* The other door, said plainly, whichever one they came in by. */}
          <p className="mt-5 text-center prose-serif-xs text-muted">
            {forClinician ? (
              <>
                Not here as a clinician?{" "}
                <Link href="/sign-in" className="text-accent underline underline-offset-4">
                  Sign in to your own journey
                </Link>
              </>
            ) : (
              <>
                Doctor or midwife?{" "}
                <Link href="/sign-in?callbackUrl=/doctor" className="text-accent underline underline-offset-4">
                  Clinician sign in
                </Link>
              </>
            )}
          </p>
          {offered && <LanguageSwitch current={lang} className="mt-5 justify-center" />}

          <p className="prose-serif-xs mt-6 text-muted md:hidden">
            {PROMISE_SHORT}
          </p>
        </div>
      </div>
    </main>
  );
}
