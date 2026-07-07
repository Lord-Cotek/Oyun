import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createJourney, acceptInvite } from "./actions";

export const metadata: Metadata = {
  title: "Begin",
  description: "Set up your journey.",
  robots: { index: false },
};

const ROLE_LABEL: Record<string, string> = {
  MOTHER: "Mother",
  PARTNER: "Husband / Partner",
  ACCOUNTABILITY: "Accountability partner",
};

export default async function Onboarding({
  searchParams,
}: {
  searchParams: { invite?: string };
}) {
  const inviteToken = searchParams.invite?.trim();

  const session = await auth();
  if (!session?.user?.id) {
    // Preserve the invite token through the sign-in / sign-up round-trip.
    const dest = inviteToken ? `/onboarding?invite=${inviteToken}` : "/onboarding";
    if (inviteToken) {
      const pending = await prisma.invite.findUnique({
        where: { token: inviteToken },
      });
      if (pending && !pending.acceptedAt) {
        // Route a brand-new invitee to sign-up (existing accounts to sign-in),
        // with their invited email prefilled either way.
        const existing = await prisma.user.findUnique({
          where: { email: pending.email },
        });
        const base = existing?.passwordHash ? "/sign-in" : "/sign-up";
        redirect(
          `${base}?callbackUrl=${encodeURIComponent(dest)}&email=${encodeURIComponent(pending.email)}`,
        );
      }
    }
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(dest)}`);
  }

  const invite = inviteToken
    ? await prisma.invite.findUnique({
        where: { token: inviteToken },
        include: {
          journey: {
            include: { owner: { select: { name: true, email: true } } },
          },
        },
      })
    : null;

  // A pending invite takes precedence — let them accept it even if they already
  // belong to another journey. Otherwise, if they're already set up, move on.
  const active = await getActiveMembership(session.user.id);
  const hasPendingInvite = !!invite && !invite.acceptedAt;
  if (!hasPendingInvite && active) redirect("/journey");

  // A token was supplied but doesn't match any invite.
  const inviteNotFound = !!inviteToken && !invite;

  return (
    <main className="mx-auto flex min-h-[86dvh] max-w-shell items-center justify-center px-6 py-16">
      <ThemeToggle className="fixed right-5 top-5 z-30" />
      <div className="w-full max-w-lg animate-fade-up">
        <div className="mb-8 flex items-center gap-3">
          <OyunMark size={40} className="text-ink" />
          <span className="font-serif text-xl text-ink">Oyun</span>
        </div>

        {invite && !invite.acceptedAt ? (
          <div className="rounded-2xl border border-border bg-surface p-8">
            <Eyebrow className="mb-4">You&rsquo;ve been invited</Eyebrow>
            <h1 className="font-serif text-3xl leading-snug text-ink">
              Walk with{" "}
              {invite.journey.owner.name ?? invite.journey.owner.email ?? "her"}.
            </h1>
            <p className="mt-3 font-mono text-sm leading-relaxed text-muted">
              You&rsquo;re joining as{" "}
              <span className="text-accent">{ROLE_LABEL[invite.role]}</span>. Your
              part is to support and pray — Oyun will show you how, right where
              she is each week.
            </p>
            <form action={acceptInvite} className="mt-6 space-y-4">
              <input type="hidden" name="token" value={invite.token} />
              <Field
                label="Your name"
                name="name"
                placeholder="How she knows you"
                defaultValue={session.user.name ?? ""}
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep"
              >
                Accept &amp; begin
              </button>
            </form>
          </div>
        ) : invite && invite.acceptedAt ? (
          <div className="rounded-2xl border border-border bg-surface p-8">
            <Eyebrow className="mb-4">Already accepted</Eyebrow>
            <h1 className="font-serif text-2xl text-ink">
              This invite has already been used.
            </h1>
            <p className="mt-3 font-mono text-sm text-muted">
              If that was you, just sign in to reach the journey.
            </p>
          </div>
        ) : inviteNotFound ? (
          <div className="rounded-2xl border border-border bg-surface p-8">
            <Eyebrow className="mb-4">Invite not found</Eyebrow>
            <h1 className="font-serif text-2xl text-ink">
              We couldn&rsquo;t find that invite.
            </h1>
            <p className="mt-3 font-mono text-sm leading-relaxed text-muted">
              The link may be mistyped or expired. Ask whoever invited you to send
              a fresh one — or begin your own journey below.
            </p>
            <Link
              href="/onboarding"
              className="mt-6 inline-block font-mono text-xs text-accent underline underline-offset-4"
            >
              Start my own journey
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-8">
            <Eyebrow className="mb-4">Begin your journey</Eyebrow>
            <h1 className="font-serif text-3xl leading-snug text-ink">
              Tell Agbebi where you are.
            </h1>
            <p className="mt-3 font-mono text-sm leading-relaxed text-muted">
              Set your due date — or, if your little one has already arrived,
              their birth date. Oyun will meet you at the right stage.
            </p>

            <form action={createJourney} className="mt-6 space-y-4">
              <Field
                label="Your name"
                name="name"
                placeholder="What Agbebi should call you"
                defaultValue={session.user.name ?? ""}
              />
              <Field
                label="Due date or birth date"
                name="dueDate"
                type="date"
                required
              />
              <label className="block">
                <span className="eyebrow mb-2 block text-muted">
                  How many babies?
                </span>
                <select
                  name="babyCount"
                  defaultValue="1"
                  className="w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-sm text-ink focus:border-accent focus:outline-none"
                >
                  <option value="1">One</option>
                  <option value="2">Twins</option>
                  <option value="3">Triplets</option>
                  <option value="4">More than three</option>
                </select>
              </label>
              <Field
                label="Baby's name (optional)"
                name="babyName"
                placeholder="If you've chosen one — or add each after birth"
              />

              <label className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 accent-[color:var(--accent)]"
                />
                <span className="font-mono text-[0.7rem] leading-relaxed text-muted">
                  I understand Oyun and Agbebi offer spiritual companionship and
                  encouragement — not medical advice — and I&rsquo;ll consult my
                  doctor or midwife for health decisions.
                </span>
              </label>

              <button
                type="submit"
                className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep"
              >
                Start the journey
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block text-muted">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />
    </label>
  );
}
