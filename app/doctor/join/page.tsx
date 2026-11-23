import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { clinicianOf } from "@/lib/clinician";
import { ClinicianJoinForm, BecomeClinicianForm } from "@/components/doctor/ClinicianForms";

export const metadata: Metadata = { title: "Create a clinician account" };

export default async function DoctorJoin() {
  const session = await auth();
  if (session?.user?.id && (await clinicianOf(session.user.id))) redirect("/doctor");
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-2xl border border-border bg-surface p-8">
        <p className="eyebrow text-accent">For doctors and midwives</p>
        <h1 className="mt-2 font-serif text-3xl leading-snug text-ink">
          {session?.user?.id ? "Set up your clinician account." : "Create your clinician account."}
        </h1>
        <p className="mt-3 prose-serif-sm text-muted">
          You get a short clinic code to give your patients. A patient who enters it — and agrees — shares her health
          log, medicines, tests and appointments with you. Nothing else, and only until she stops.
        </p>
        {session?.user?.id ? <BecomeClinicianForm name={session.user.name ?? ""} /> : <ClinicianJoinForm />}
        {!session?.user?.id && (
          <p className="mt-4 text-center prose-serif-xs text-muted">
            Already use Oyun?{" "}
            <Link href="/sign-in?callbackUrl=/doctor/join" className="text-accent underline underline-offset-4">
              Sign in first
            </Link>
          </p>
        )}
      </div>
      <p className="mt-4 text-center prose-serif-xs text-muted">
        <Link href="/doctors" className="underline underline-offset-4">How Oyun works for clinicians</Link>
      </p>
    </main>
  );
}
