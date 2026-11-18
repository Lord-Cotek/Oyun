import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { ROLE_LABEL, isHousehold } from "@/lib/roles";
import { NUDGE_CAP } from "@/lib/nudges";
import { HANDOVER_TTL_DAYS } from "@/lib/handover-bundle";
import { yorubaOffered } from "@/lib/lang";
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
      <p className="prose-serif-xs text-muted">
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
      <div className="mt-2.5 space-y-2.5 pl-1 prose-serif-xs text-muted">
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
  const offersYoruba = await yorubaOffered();

  return (
    <>
      <SiteHeader active="help" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <PageHero
          eyebrow={`How this works · ${ROLE_LABEL[active.role] ?? "You"}`}
          title="Where everything lives."
          lede="What each part is for, who can see what, and the answers to the things people ask most. Written for the place you actually stand in this journey."
        />

        {/* ── Where things are ─────────────────────────────────────── */}
        <Card className="mt-8 p-8">
          <Eyebrow className="mb-2">The rooms</Eyebrow>
          <p className="mb-5 max-w-prose prose-serif-xs text-muted">
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
                A page for each child — their exact age, their firsts with
                photos, and the letters you may read. Both parents keep it.
              </Room>
            )}
            {home && !inLoss && (
              <Room name="Firsts" href="/firsts">
                Every first, with a date, a note and a photo. Both parents write
                in it.
              </Room>
            )}
            {home && (
              <Room name="Health" href="/health">
                A health card each — hers, her partner&rsquo;s and the
                children&rsquo;s: blood group, genotype, allergies, medicines,
                hospital or clinic, and who to call. A card to print for the
                hospital bag or whoever minds the baby. Just the two of you.
              </Room>
            )}
            {isMother && !inLoss && (
              <Room name="Care" href="/care" aside="Hers.">
                How her heart is today, and her own letters. She chooses who
                sees how she is: her partner (the usual), the circle too, or
                nobody. He does not write here.
              </Room>
            )}
            {isMother && (
              <Room name="Circle" href="/circle">
                Who walks with you, and inviting more. Only she invites.
              </Room>
            )}
            <Room name="Settings" href="/settings">
              Your name, your email, whether email reaches you, installing
              the app to your phone{offersYoruba ? ", and English or Yorùbá" : ""}.
            </Room>
          </div>
        </Card>

        {/* ── Who sees what ────────────────────────────────────────── */}
        <Card className="mt-6 p-8">
          <Eyebrow className="mb-2">Who sees what</Eyebrow>
          <p className="mb-5 max-w-prose prose-serif-xs text-muted">
            There are two circles, and the difference is the whole design.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-5">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">
                The household
              </p>
              <p className="mt-1.5 font-serif text-lg text-ink">
                Her, and the one beside her
              </p>
              <ul className="mt-3 space-y-1.5 prose-serif-xs text-muted">
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
              <ul className="mt-3 space-y-1.5 prose-serif-xs text-muted">
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
          <p className="mb-5 max-w-prose prose-serif-xs text-muted">
            The failure of a reminder system is not silence. It is pestering
            somebody until they turn it off — and then they get nothing at all,
            including the one that mattered. So there are three at most, and
            usually two.
          </p>
          <ul className="space-y-2 prose-serif-xs text-muted">
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
            Nothing is lost, only the inbox is spared. Every email also has an{" "}
            <span className="text-ink">Unsubscribe</span> link at the bottom
            that works in one tap.
          </Q>

          <Q q="Can I sign in without my password?">
            Yes. On the sign-in page, press{" "}
            <span className="text-ink">Email me a code instead</span>, and type
            the six numbers that arrive. The code works for ten minutes. Your
            password still works as it always has.
          </Q>

          <Q q="Can I change something I have written?">
            Yes. Press <span className="text-ink">Edit</span> beside your own
            letter, prayer request, check-in or reminder, change the words and
            save. The date, the photos and every reply stay as they were. Only
            the person who wrote something can change its words.
          </Q>

          <Q q="Can we pray for someone by name — even outside the family?">
            Yes. On{" "}
            <Link href="/worship#praying-for" className="text-accent underline underline-offset-4">Worship</Link>
            , under <span className="text-ink">People we&rsquo;re praying for</span>,
            add anyone — a grandmother, a neighbour, a colleague, a missionary —
            with what to pray for. A few are named in worship each day, and
            everyone comes round in turn, so a long list is never a roll-call.
            Mark a prayer answered and it is given thanks for in worship for a
            week. The list is kept by the two of you; a name reaches the circle only if
            you tick <span className="text-ink">Share this name with the circle</span>.
          </Q>

          <Q q="Can I tag someone in a post?">
            Yes. When you write in Life, press{" "}
            <span className="text-ink">Tag someone</span> and tick
            your children and anyone in the journey. Anyone with their own account is told they were tagged —
            once, and only if they can see the post: a &ldquo;just us&rdquo;
            post greys out the people it is hidden from. Each child&rsquo;s page in the Nursery gathers every post they are in. You can change
            who is in a post you wrote, and anyone tagged can press{" "}
            <span className="text-ink">Remove my tag</span>.
          </Q>

          {home && (
            <Q q="What goes on a health card, and who sees it?">
              Open{" "}
              <Link href="/health" className="text-accent underline underline-offset-4">Health</Link>{" "}
              (under More). There is a card for each of you — blood group,
              genotype, allergies, conditions, medicines and supplements,
              hospital, midwife or doctor, and who to call — and one for each
              child once the birth is recorded. Either of you can fill in or
              change any of them, and each card shows who last changed it.
              Nobody in the circle sees any of it, and it is never sent in an
              email or a notification. If you are rhesus negative, or you both
              carry a sickle cell gene, the page says what to ask your midwife.
              Press <span className="text-ink">Card to print</span> for a
              hospital-bag card with how many weeks you are and your due date,
              or <span className="text-ink">Emergency card</span> for a
              child&rsquo;s card to leave with whoever is minding them —
              printed, or saved as a PDF and sent.
            </Q>
          )}

          {home && (
            <Q q="How does the health log work?">
              Open{" "}
              <Link href="/health/log" className="text-accent underline underline-offset-4">Health &rarr; Log</Link>
              , or tap <span className="text-ink">+ Log a reading</span> on
              your home page. Record glucose, blood pressure, weight, baby&rsquo;s
              movements, temperature, symptoms or a urine dipstick in a few
              seconds — the time-of-day slot is chosen for you, and you can
              add a photo of the meter or a PDF of a result. Put your
              doctor&rsquo;s numbers in <span className="text-ink">Targets</span>{" "}
              (until then each one says it is a default). A reading outside
              its target is marked quietly with ▲ or ▼; the few signs that
              cannot wait — very high blood pressure, bleeding, fluid leaking,
              regular contractions, a baby moving less, a severe headache or
              vision changes, a fever — show a banner telling you to contact
              your maternity unit now. The app never diagnoses. Both of you
              can record; each reading shows who did, and only whoever wrote
              it, or Mum, can change it. Mum can keep the log to herself in{" "}
              <span className="text-ink">Units and privacy</span>. The circle
              never sees it, and neither does Agbebi. Photos are kept
              privately and shown only to you.
            </Q>
          )}

          {home && (
            <Q q="How do medicines and reminders work?">
              Open{" "}
              <Link href="/health/medicines" className="text-accent underline underline-offset-4">Health &rarr; Medicines</Link>{" "}
              and press <span className="text-ink">+ Add a medicine</span>:
              the name, form, strength and dose, and when — every day at set
              times, every few days, or as needed — with the start and end
              dates and a photo of the box or prescription if you like. Each
              dose then appears on the day: one tap for{" "}
              <span className="text-ink">Taken</span>, or{" "}
              <span className="text-ink">Details</span> to give the time,
              mark it skipped with a reason, choose the injection site (the
              next one is suggested, rotating), or enter insulin units. Taken
              more than an hour late is marked late. Each medicine shows how
              the week has gone. Reminders come at each dose — within a few
              minutes of its time — and never name the medicine, because a
              lock screen is read by whoever is nearby; tick &ldquo;remind my
              partner too&rdquo; if your partner should hear as well. In the Log,{" "}
              <span className="text-ink">Reading reminders</span> sets times to
              be reminded to take a reading (never between 22:00 and 06:00).
              Times are always in Mum&rsquo;s own time zone. Never change or
              stop a medicine without speaking to your doctor.
            </Q>
          )}

          {home && (
            <Q q="What is the tests and vaccines checklist?">
              <Link href="/health/tests" className="text-accent underline underline-offset-4">Health &rarr; Tests</Link>{" "}
              lists what is usually checked in pregnancy and when — booking
              bloods, scans, the glucose test, vaccines, swabs and the
              postnatal check — grouped as due around now, coming up and
              done. It is one full list of what is commonly offered
              anywhere in the world, so there is no country to choose; each
              test says if it is only offered in some places. Your
              clinic&rsquo;s schedule may differ: open{" "}
              <span className="text-ink">Choose your list</span> and tick what
              is part of your care, untick what is not — or mark a single test{" "}
              <span className="text-ink">Not doing this</span>. Anything you
              untick keeps what you recorded and can be put back at any time.
              Mark a check done with its date and result, link the
              appointment, and keep a photo or PDF
              of the report. Add anything your clinic does that is missing,
              and switch on the checks that apply to you (cervical
              length, diabetes follow-up, blood pressure monitoring, a fetal
              heart scan, extra growth scans). If your health card says you
              are rhesus negative, anti-D is added; if you both carry a sickle
              cell gene, a talk about the baby&rsquo;s genotype is added.
            </Q>
          )}

          {home && (
            <Q q="How do I show my readings to my doctor?">
              <Link href="/health/report" className="text-accent underline underline-offset-4">Health &rarr; Report</Link>{" "}
              puts the period you choose — this week, the last two or four
              weeks, since a date, or your own dates — on one clean page:
              a summary, your readings day by day, trend charts, medicines
              and doses, tests done and due, and symptoms and notes. Anything
              out of range carries a symbol as well as a colour, so it reads
              on a black-and-white printout. Tap{" "}
              <span className="text-ink">Print, or save as PDF</span>, or
              download the readings and doses as a spreadsheet (CSV). Mum can
              also make a view-only link for her doctor: it shows that report
              and nothing else, needs no login, is never listed by search
              engines, works for the days she chooses (3 to 30) and stops the
              moment she closes it. She can see each time it was opened, and
              a QR code for it prints at the top of the report. Photos are
              included only if she ticks the photo appendix. Only she can
              make a link; her partner can print the report while she shares
              the log. In the installed app, which cannot print, Mum&rsquo;s{" "}
              <span className="text-ink">Save as PDF or print</span> opens the
              report in your phone&rsquo;s browser through a private link that
              lasts two hours.
            </Q>
          )}

          {home && (
            <Q q="Can I download or delete my health log?">
              Yes — it is yours. In{" "}
              <Link href="/health/log" className="text-accent underline underline-offset-4">Health &rarr; Log</Link>,
              open <span className="text-ink">Units and privacy</span>.{" "}
              <span className="text-ink">Download everything</span> gives you
              one ZIP with your readings, doses, medicines and tests as
              spreadsheets, and every photo and PDF you kept.{" "}
              <span className="text-ink">Delete my whole health log</span>{" "}
              removes all of it for good — from storage too — and closes any
              report links; your health card stays. You can also ask for a
              short email on Sunday evenings when your week&rsquo;s report is
              ready: it is off unless you turn it on, and it is only a link —
              no reading is ever put in an email. These are Mum&rsquo;s alone.
            </Q>
          )}

          <Q q="Can I download our photos?">
            Yes. Open{" "}
            <Link href="/life?view=photos" className="text-accent underline underline-offset-4">Life &rarr; Photos</Link>
            , choose a year at the top, and press{" "}
            <span className="text-ink">Download</span>. You get one file with
            every photo of that year you can see, each named by the day it was
            shared. A big year comes in a few parts.
          </Q>

          {isMother && !inLoss && (
            <Q q="Who sees how I am?">
              You decide, on{" "}
              <Link href="/care" className="text-accent underline underline-offset-4">Care</Link>
              : your partner only (the usual), your partner and the circle, or
              nobody but you. The weekly email follows the same choice, and
              only ever mentions this week&rsquo;s check-in.
            </Q>
          )}

          {home && !inLoss && (
            <>
              <Q q="How do we record the birth?">
                From three weeks before the due date, your journey page asks
                whether the little one has arrived. Either of you can answer,
                once: the day and their names. The date you were first given
                is kept, so each child&rsquo;s page can say how early or late
                they came. Then the page offers to make the announcement: a card
                with their names and what each one means, the day, your
                photographs, a verse and your own words — in Life for your
                circle, and a private link for everyone else, where they can
                send a word of welcome and ask to join your circle.
              </Q>

              <Q q="Can we make a book of the year?">
                Yes. In <Link href="/life" className="text-accent underline underline-offset-4">Life</Link>,
                choose a year and press{" "}
                <span className="text-ink">Make it into a book to keep</span>{" "}
                (it names the year):
                a cover, each month in order with its photos, the year&rsquo;s
                firsts, and a closing verse. Press{" "}
                <span className="text-ink">Print, or save as PDF</span> to
                print it at home or send it to a photo printer.
              </Q>

              <Q q="What happens at the second birthday?">
                Oyun walks with you to the second birthday. On the day, the two
                of you get one word of celebration and the journey is marked
                complete: the morning note and the weekly email stop, and
                everything you wrote stays here to read, always.
              </Q>
            </>
          )}

          {isMother && !inLoss && (
            <Q q="How do we carry on in Ìdílé?">
              Once the little one has arrived, your journey page offers{" "}
              <span className="text-ink">Bring the family to Ìdílé</span>.
              Choose what comes with you — the children with their real
              birthdays, an invitation for your partner, the firsts with their
              photos, your own letters (a sealed one stays sealed until its
              day), your health card and the children&rsquo;s, and anyone
              from the circle you want to invite — then sign
              in to Ìdílé with the email you chose. The link works once, for{" "}
              {HANDOVER_TTL_DAYS} days. Letters others wrote stay here, where
              they can always be read. Nothing in Oyun is changed or removed.
            </Q>
          )}

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

          <Q q="Can I take everything out?">
            Yes, whenever you like, and without asking us.{" "}
            <Link href="/settings" className="text-accent underline underline-offset-4">
              Settings
            </Link>{" "}
            &rarr; <span className="text-ink">Take everything with you</span>{" "}
            builds one file holding the lot: a page you can open, read and print
            in any browser with no app at all, and the same records again as
            data if you ever want them somewhere else. Photographs are linked
            rather than packed in — a family&rsquo;s pictures run to hundreds of
            megabytes — so download them a year at a time from Life &rarr; Photos
            if you want them for good.
            What comes out is exactly what you can see in the app: a husband or
            partner gets the letters, the care journal and the appointments;
            someone in the circle gets life and prayer and what they themselves
            wrote, and none of the private rooms.
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
            text="For you formed my inmost being. You knit me together in my mother’s womb."
            reference="Psalm 139:13"
          />
        </div>

        <p className="mt-8 text-center prose-serif-xs text-muted">
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
