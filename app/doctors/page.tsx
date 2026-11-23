import type { Metadata } from "next";
import Link from "next/link";
import { OyunMark } from "@/components/ui/OyunMark";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Oyun for doctors and midwives",
  description:
    "Your patients keep their blood pressure, readings, medicines, tests and scans in Oyun. With their consent, you see it all in one place — no monitoring promised, no alerts, nothing they did not choose to share.",
  alternates: { canonical: "/doctors" },
};

const SEES = [
  "Home readings — blood pressure, glucose, weight, temperature — with her targets and anything flagged",
  "Symptoms and notes she logged, in her own words",
  "Medicines and the doses she marked taken",
  "Tests and vaccines, done and not yet",
  "Appointments and scans, with what came of them (if she includes them)",
  "Photographs on readings and tests — a home test strip, a result letter (if she includes them)",
  "Single diary posts she chooses to share, one at a time",
];

const NEVER = [
  "Her diary, letters, moods or journal",
  "Her family and friends, or anything they write",
  "Anything after she stops sharing",
];

/**
 * The page a clinician reads before deciding whether to suggest Oyun. Plain
 * about what they will see, what they will not, and what Oyun is not: a
 * monitoring service. See lib/clinician.ts.
 */
export default function ForClinicians() {
  return (
    <main className="mx-auto max-w-shell px-6 pb-20">
      <ThemeToggle className="fixed right-5 top-5 z-30" />
      <section className="py-14">
        <Link href="/" className="mb-10 inline-flex items-center gap-3">
          <OyunMark size={44} className="text-ink" />
          <span className="font-serif text-xl text-ink">Oyun</span>
        </Link>
        <p className="eyebrow text-accent">For doctors and midwives</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.1] text-ink md:text-5xl">
          What your patient logs at home, ready when you see her.
        </h1>
        <p className="mt-5 max-w-prose prose-serif-sm text-muted">
          Oyun is a free companion for pregnancy and a baby&rsquo;s first two years. Patients keep their readings,
          medicines, tests and appointments in it — and, if they choose, share them with you. You get one clear
          record instead of a phone held across the desk.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/doctor/join" className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-mono text-sm font-medium text-on-accent hover:bg-accent-deep">
            Create a clinician account
          </Link>
          <Link href="/sign-in?callbackUrl=/doctor" className="inline-flex min-h-11 items-center rounded-lg border border-border px-5 font-mono text-sm text-ink hover:border-accent">
            Sign in
          </Link>
        </div>
      </section>

      <section className="grid gap-5 border-t border-border py-14 md:grid-cols-3">
        <div>
          <p className="eyebrow text-muted">1</p>
          <h2 className="mt-1 font-serif text-2xl text-ink">You get a clinic code</h2>
          <p className="mt-2 prose-serif-xs text-muted">Six letters and numbers, a link and a QR code for your wall or leaflets.</p>
        </div>
        <div>
          <p className="eyebrow text-muted">2</p>
          <h2 className="mt-1 font-serif text-2xl text-ink">She chooses to share</h2>
          <p className="mt-2 prose-serif-xs text-muted">
            She enters your code, sees your name and exactly what you will see, and agrees. Only she can — you cannot
            look anybody up.
          </p>
        </div>
        <div>
          <p className="eyebrow text-muted">3</p>
          <h2 className="mt-1 font-serif text-2xl text-ink">You open it when you need it</h2>
          <p className="mt-2 prose-serif-xs text-muted">
            Your patient list shows each one&rsquo;s week and anything her log flagged since you last looked. Open her
            report for any period, and print it for her notes.
          </p>
        </div>
      </section>

      <section className="grid gap-5 border-t border-border py-14 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-serif text-2xl text-ink">Invited by a patient?</h2>
          <p className="mt-2 prose-serif-xs text-muted">
            A patient can invite you by email from her own Oyun. Open the link in that email: you create your account
            there (or sign in) and her records open straight away — no code needed. The invitation is for the address
            it was sent to. If you already have an Oyun account with that address, it is also waiting in the app, on
            your patients page. Afterwards you still get a clinic code of your own to give other patients.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-serif text-2xl text-ink">Use Oyun yourself, too?</h2>
          <p className="mt-2 prose-serif-xs text-muted">
            One sign-in holds both: your clinician account and your own journey, kept completely apart. If you already
            use Oyun, sign in and set up a clinician account from Settings; switch between &ldquo;My patients&rdquo; and
            &ldquo;My journey&rdquo; at any time. Patients never see anything of yours.
          </p>
        </div>
      </section>

      <section className="grid gap-8 border-t border-border py-14 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl text-ink">What you see</h2>
          <ul className="mt-4 space-y-2">
            {SEES.map((s) => (
              <li key={s} className="flex gap-2.5 prose-serif-xs text-ink/90">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-positive" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-ink">What you never see</h2>
          <ul className="mt-4 space-y-2">
            {NEVER.map((s) => (
              <li key={s} className="flex gap-2.5 prose-serif-xs text-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-border" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
          <h2 className="mt-8 font-serif text-2xl text-ink">What Oyun is not</h2>
          <p className="mt-3 prose-serif-xs text-muted">
            Not a monitoring service. Nothing alerts you, and patients are told so. When a reading is out of range, Oyun
            tells her — on her own screen — to contact her maternity unit or emergency services. Every time you open her
            records she can see it, and she can stop sharing at any moment.
          </p>
          <p className="mt-3 prose-serif-xs text-muted">
            Patients choose how Oyun speaks to them — with Christian faith, or without religious content — so it suits
            everyone you care for. Your own view carries none of it.
          </p>
        </div>
      </section>
    </main>
  );
}
