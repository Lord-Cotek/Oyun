import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { ROLE_LABEL, isHousehold } from "@/lib/roles";
import { NUDGE_CAP } from "@/lib/nudges";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Verse } from "@/components/ui/Verse";

export const metadata: Metadata = {
  title: "How this works",
  description: "Where everything lives, and who can see what.",
  robots: { index: false },
};

/**
 * The in-app guide.
 *
 * Every number here is imported from the code that enforces it rather than
 * typed out — a help page that quietly drifts out of step with the app is
 * worse than none, because people believe it.
 */

/** One room, described the way somebody looking for it would describe it. */
function Room({
  name,
  href,
  children,
  aside,
}: {
  name: string;
  href: string;
  children: React.ReactNode;
  aside?: string;
}) {
  return (
    <div className="grid gap-1 border-t border-border py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-5">
      <Link
        href={href}
        className="font-mono text-sm text-accent underline underline-offset-4 hover:text-accent-deep"
      >
        {name}
      </Link>
      <p className="font-mono text-xs leading-relaxed text-muted">
        {aside && <span className="italic">{aside} </span>}
        {children}
      </p>
    </div>
  );
}

function Q({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="border-t border-border py-3.5">
      <summary className="cursor-pointer font-mono text-sm text-ink marker:text-muted">
        {q}
      </summary>
      <div className="mt-2.5 space-y-2.5 pl-1 font-mono text-xs leading-relaxed text-muted">
        {children}
      </div>
    </details>
  );
}

export default async function HelpPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/help");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const home = isHousehold(active.role);
  const isMother = active.role === "MOTHER";
  const inLoss = active.journey.status === "LOSS";

  return (
    <>
      <SiteHeader active="help" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <PageHero
          eyebrow={`How this works · ${ROLE_LABEL[active.role] ?? "You"}`}
          title="Where everything lives."
          lede="What each part is for, who can see what, and the answers to the things people ask most. Written for the place you actually stand in this journey."
        />

        {/* ── Where things are ─────────────────────────────────────── */}
        <Card className="mt-8 p-8">
          <Eyebrow className="mb-2">The rooms</Eyebrow>
          <p className="mb-5 max-w-prose font-mono text-xs leading-relaxed text-muted">
            On a phone the four you use daily sit along the bottom; the rest are
            behind <span className="text-ink">More</span>. On a computer they
            run along the top, with the same <span className="text-ink">More</span>{" "}
            at the end. Rooms that are not yours do not appear at all — a friend
            of the journey never sees a door they cannot open.
          </p>

          <div>
            <Room name="Journey" href="/journey">
              Home. Where you are today — the week, the size of the little one,
              the next dates coming up, and the newest few things the family has
              shared.
            </Room>
            <Room name="Life" href="/life">
              The family feed — a photo, a word, a small thing worth keeping.
              Everyone invited to the journey sees it.
            </Room>
            <Room name="Prayer" href="/prayer">
              The prayer wall. She names what she wants carried; the circle
              holds it. Nothing reaches it unless she puts it there.
            </Room>
            {home && !inLoss && (
              <Room name="Appointments" href="/appointments">
                Scans, checks, tests and clinics — with the questions you mean
                to ask written down before you walk in, and what came of it
                written down after. You are reminded the day before and on the
                morning.
              </Room>
            )}
            {home && !inLoss && (
              <Room name="Worship" href="/worship">
                The daily rhythm for the two of you — read, reflect, pray. The
                reflection journal is linked from here.
              </Room>
            )}
            {home && (
              <Room name="Letters" href="/letters">
                Letters to each other, and letters to the little one to be read
                years from now.
              </Room>
            )}
            {home && !inLoss && (
              <Room name="Nursery" href="/child">
                Each child&rsquo;s profile — their name, their birth day, a
                photo. Both parents keep it.
              </Room>
            )}
            {home && !inLoss && (
              <Room name="Firsts" href="/firsts">
                Every first, with a date, a note and a photo. Both parents write
                in it.
              </Room>
            )}
            {isMother && !inLoss && (
              <Room name="Care" href="/care" aside="Hers.">
                How her heart is today, and her own letters. He sees how she is
                on his home page when she shares a check-in; he does not write
                here.
              </Room>
            )}
            {isMother && (
              <Room name="Circle" href="/circle">
                Who walks with you, and inviting more. Only she invites.
              </Room>
            )}
            <Room name="Settings" href="/settings">
              Your name, your email, whether email reaches you, and installing
              the app to your phone.
            </Room>
          </div>
        </Card>

        {/* ── Who sees what ────────────────────────────────────────── */}
        <Card className="mt-6 p-8">
          <Eyebrow className="mb-2">Who sees what</Eyebrow>
          <p className="mb-5 max-w-prose font-mono text-xs leading-relaxed text-muted">
            There are two circles, and the difference is the whole design.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-5">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">
                The household
              </p>
              <p className="mt-1.5 font-serif text-lg text-ink">
                Her, and the one beside her
              </p>
              <ul className="mt-3 space-y-1.5 font-mono text-xs leading-relaxed text-muted">
                <li>The appointment book, and its reminders.</li>
                <li>Letters, family worship, the nursery, the firsts.</li>
                <li>
                  He is not a visitor to any of it. He adds a scan date, names a
                  child, writes down the first kick — and she sees it as the
                  same record.
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-bg/50 p-5">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                The circle
              </p>
              <p className="mt-1.5 font-serif text-lg text-ink">
                Accountability, family, friends
              </p>
              <ul className="mt-3 space-y-1.5 font-mono text-xs leading-relaxed text-muted">
                <li>
                  Life, the prayer wall, and a home page of their own about how
                  to stand with her.
                </li>
                <li>
                  Not one appointment, not one letter, not one page of her care
                  journal.
                </li>
                <li>
                  They see a date only if she names it herself on the prayer
                  wall — and then only the name and the day, never her note.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* ── Reminders ────────────────────────────────────────────── */}
        <Card className="mt-6 p-8">
          <Eyebrow className="mb-2">How you are reminded</Eyebrow>
          <p className="mb-5 max-w-prose font-mono text-xs leading-relaxed text-muted">
            The failure of a reminder system is not silence. It is pestering
            somebody until they turn it off — and then they get nothing at all,
            including the one that mattered. So there are three at most, and
            usually two.
          </p>
          <ul className="space-y-2 font-mono text-xs leading-relaxed text-muted">
            <li>
              <span className="text-ink">The day before</span>, for every
              appointment — the one that actually saves a morning. Notification
              and email.
            </li>
            <li>
              <span className="text-ink">On the morning</span>, only when the
              letter gave a time. Notification only: an email that morning
              arrives after you have left the house.
            </li>
            <li>
              <span className="text-ink">A week ahead</span>, only for scans,
              consultants and classes — the ones that may need time off, a lift,
              or somebody to sit with the children.
            </li>
            <li>
              Both of you are told, and nobody else. Move a date and its
              reminders start again from the new one. Mark it attended and it is
              never mentioned again.
            </li>
          </ul>
        </Card>

        {/* ── Questions ────────────────────────────────────────────── */}
        <Card className="mt-6 p-8">
          <Eyebrow className="mb-4">Questions families ask</Eyebrow>

          {home && !inLoss && (
            <>
          <Q q="How do I add an appointment?">
            Open <Link href="/appointments" className="text-accent underline underline-offset-4">Appointments</Link>{" "}
            and press <span className="text-ink">Add an appointment</span>.
            Choose what kind it is, put in the day, and the time only if the
            letter gave one — a hospital letter that says &ldquo;Tuesday the
            4th&rdquo; and nothing more should be left without a time, and the
            app will say so plainly rather than invent nine o&rsquo;clock.
            Write the questions you mean to ask while you remember them; they
            are shown back to you on the day.
          </Q>

          <Q q="Can my husband add one too?">
            Yes, and edit and attend them. The book is the household&rsquo;s,
            not hers with him reading over her shoulder. The same is true of the
            nursery and the firsts — he adds his own child and writes down the
            first kick himself.
          </Q>

          <Q q="Will anyone else see a scan date?">
            No. A scan date is health information. Everyone outside the two of
            you is redirected away from the page, sees nothing of it on their
            home page, and is not even offered it in the menu. If she wants the
            circle praying about one, there is an{" "}
            <span className="text-ink">Ask the circle to pray</span> on the
            appointment itself — that shares the name and the day, and never the
            private note.
          </Q>

          <Q q="What happens when the date changes?">
            Edit it and its reminders start again from the new day. Nothing that
            was already sent is sent twice, and nothing that is still to come is
            lost.
          </Q>
            </>
          )}

          <Q q="Can I set a reminder just for myself?">
            Yes — on your home page, under{" "}
            <span className="text-ink">Your reminders</span>. A line of text and
            today, tomorrow, in a week, or a day you pick. You are told once,
            that morning. Nobody else in the journey sees it or is told, which
            is the difference between one of these and an appointment. Up to{" "}
            {NUDGE_CAP} waiting at a time — it is a list, not a backlog.
          </Q>

          <Q q="How do I invite someone?">
            {isMother ? (
              <>
                From{" "}
                <Link href="/circle" className="text-accent underline underline-offset-4">
                  Circle
                </Link>
                . Choose the role honestly, because the role is what decides
                what they see: a husband or partner is in the household and
                sees everything here; an accountability partner, a relative or
                a friend is in the circle and sees life and the prayer wall.
                They get an email with a link — and if they have no account,
                the link makes one and takes them straight in, so they never
                have to find you again afterwards.
              </>
            ) : (
              <>
                Only the mother invites, so that who is in her circle is always
                her decision and nobody else&rsquo;s. Ask her, and she can send
                it in a moment from her Circle page.
              </>
            )}
          </Q>

          <Q q="Do we have to use email?">
            No. Turn email off in{" "}
            <Link href="/settings" className="text-accent underline underline-offset-4">Settings</Link>{" "}
            and you still get every notification in the app and on your phone.
            Nothing is lost, only the inbox is spared.
          </Q>

          <Q q="What if the worst happens?">
            The journey can be marked as loss, and the whole app changes. It
            stops counting weeks, stops reminding you about appointments
            entirely, and becomes a place to lament rather than to plan. Nothing
            you have written is deleted. Her partner gets a different page too —
            about how to sit with her, not how to prepare.
          </Q>

          <Q q="Is this medical advice?">
            No, and it never will be. Oyun and Agbebi offer spiritual
            companionship. Every health decision belongs with your doctor or
            midwife.
          </Q>

          <Q q="Is this a social network?">
            No. There are no strangers, no followers, no public profiles, no
            algorithm, no advertising, and no endless scroll. There are also no
            streaks and no badges — a habit kept for a score is a habit kept for
            the wrong reason, and a mother who misses a day should feel nothing
            at all about it.
          </Q>
        </Card>

        <div className="mt-8">
          <Verse
            text="For you formed my inward parts; you knitted me together in my mother's womb."
            reference="Psalm 139:13"
          />
        </div>

        <p className="mt-8 text-center font-mono text-xs leading-relaxed text-muted">
          Something here not answered?{" "}
          <Link
            href="/contact"
            className="text-accent underline underline-offset-4"
          >
            Tell us
          </Link>{" "}
          — the question is usually the app&rsquo;s fault, not yours.
        </p>
      </main>
    </>
  );
}
