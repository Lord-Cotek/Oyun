import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { OyunMark } from "@/components/ui/OyunMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Get a secure link to reset your Oyun password.",
  robots: { index: false },
};

export default async function ForgotPasswordPage() {
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
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}
