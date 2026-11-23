import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { clinicianLine, liveLinksForJourney, normaliseCode } from "@/lib/clinician";
import { motherTimeZone } from "@/lib/medication-db";
import { KIND_LABEL, PLAIN_KIND_LABEL } from "@/lib/feed";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HealthTabs } from "@/components/health/HealthTabs";
import { ShareChooser, SharedDoctor, PostForDoctor, PendingInvite } from "@/components/health/doctor/DoctorSharing";
import { inviteState } from "@/lib/clinician-invite";

export const metadata: Metadata = { title: "Your doctor", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * Sharing her records with her own doctor or midwife — see lib/clinician.ts.
 *
 * The mother's page. Her partner can see who she shares with, so nothing
 * about her care is a secret kept from him in his own home, but only she
 * can share, change or stop it.
 */
export default async function YourDoctor({ searchParams }: { searchParams: { code?: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/health/doctor${searchParams.code ? `?code=${searchParams.code}` : ""}`)}`);
  const active = await getActiveMembership(session.user.id);
  // No journey yet (a new patient who came from her doctor's code): set one
  // up first, then straight back here with the code still in hand.
  if (!active) redirect(`/onboarding?next=${encodeURIComponent(`/health/doctor${searchParams.code ? `?code=${normaliseCode(searchParams.code) ?? ""}` : ""}`)}`);
  if (!isHousehold(active.role)) redirect("/journey");
  const isMother = active.role === "MOTHER";
  const journeyId = active.journey.id;
  const tz = await motherTimeZone(journeyId);
  const general = session.user.voice === "GENERAL";
  const day = (d: Date, time = false) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: tz, ...(time ? { hour: "2-digit", minute: "2-digit" } : {}) });

  const links = await liveLinksForJourney(journeyId);
  const views = await prisma.clinicianView.findMany({
    where: { linkId: { in: links.map((l) => l.id) } },
    orderBy: { at: "desc" },
    take: 60,
    select: { linkId: true, at: true },
  });
  const viewsFor = (id: string) => views.filter((v) => v.linkId === id).slice(0, 8).map((v) => day(v.at, true));

  // Her own recent posts and her partner's — the only ones she may hand over.
  const household = await prisma.membership.findMany({
    where: { journeyId, role: { in: ["MOTHER", "PARTNER"] } },
    select: { userId: true },
  });
  const posts = isMother && links.length
    ? await prisma.post.findMany({
        where: { journeyId, authorId: { in: household.map((h) => h.userId) } },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { id: true, kind: true, body: true, createdAt: true, forDoctorAt: true, mediaUrls: true, author: { select: { name: true } } },
      })
    : [];
  const initialCode = normaliseCode(searchParams.code ?? "") ?? "";

  // Invitations she sent by email that nobody has accepted yet — the open
  // ones, and ones that lapsed in the last month so she knows to send again.
  const monthAgo = new Date(Date.now() - 30 * 86_400_000);
  const waiting = (
    await prisma.clinicianInvite.findMany({
      where: { journeyId, acceptedAt: null, cancelledAt: null, expiresAt: { gt: monthAgo } },
      orderBy: { sentAt: "desc" },
      take: 10,
      select: { id: true, email: true, doctorName: true, sentAt: true, expiresAt: true, acceptedAt: true, cancelledAt: true },
    })
  ).map((i) => ({ ...i, expired: inviteState(i) === "expired" }));

  return (
    <>
      <SiteHeader active="health" />
      <main className="mx-auto max-w-3xl px-6 pb-14">
        <PageHero
          eyebrow="Health"
          title="Your doctor."
          lede="Share your health log, medicines, tests and appointments with your own doctor or midwife — and only them, only until you stop."
        />
        <HealthTabs active="doctor" />

        {!isMother && (
          <p className="mt-8 rounded-lg border border-border bg-surface p-4 prose-serif-sm text-muted">
            Only {active.journey.owner.name?.trim() || "she"} can share her records with her doctor. You can see who she
            shares with here.
          </p>
        )}

        {links.length > 0 && (
          <section className="mt-8 space-y-4" aria-labelledby="shared-h">
            <h2 id="shared-h" className="font-serif text-2xl text-ink">Sharing with</h2>
            {links.map((l) =>
              isMother ? (
                <SharedDoctor
                  key={l.id}
                  linkId={l.id}
                  line={clinicianLine(l.clinician)}
                  displayName={l.clinician.displayName}
                  since={day(l.createdAt)}
                  photos={l.withPhotos}
                  appointments={l.withAppointments}
                  views={viewsFor(l.id)}
                />
              ) : (
                <Card key={l.id} className="p-6">
                  <p className="font-serif text-xl text-ink">{clinicianLine(l.clinician)}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted">Sharing since {day(l.createdAt)}</p>
                </Card>
              ),
            )}
          </section>
        )}

        {waiting.length > 0 && (
          <section className="mt-8 space-y-3" aria-labelledby="waiting-h">
            <h2 id="waiting-h" className="font-serif text-2xl text-ink">Invited, waiting</h2>
            {waiting.map((i) => (
              <PendingInvite
                key={i.id}
                inviteId={i.id}
                email={i.email}
                doctorName={i.doctorName}
                sent={day(i.sentAt)}
                until={day(i.expiresAt)}
                expired={i.expired}
                canManage={isMother}
              />
            ))}
          </section>
        )}

        {isMother && (
          <Card className="mt-8 p-6">
            <Eyebrow className="mb-4">{links.length ? "Share with another doctor" : "Share with your doctor"}</Eyebrow>
            <ShareChooser initialCode={initialCode} />
          </Card>
        )}

        {isMother && links.length > 0 && (
          <section className="mt-8" aria-labelledby="posts-h">
            <h2 id="posts-h" className="font-serif text-2xl text-ink">Posts for your doctor</h2>
            <p className="mt-1 mb-4 prose-serif-xs text-muted">
              Your diary stays private. If a post would help at an appointment — a photo of a rash, a note about how
              you&rsquo;ve felt — share just that one. You can take it back at any time.
            </p>
            {posts.length === 0 ? (
              <p className="prose-serif-xs text-muted">No posts from you or your partner yet.</p>
            ) : (
              <ul className="space-y-2">
                {posts.map((p) => (
                  <li key={p.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface p-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[0.66rem] uppercase tracking-widest text-muted">
                        {(general ? PLAIN_KIND_LABEL : KIND_LABEL)[p.kind] ?? "Update"} · {p.author.name ?? "You"} · {day(p.createdAt)}
                        {p.mediaUrls.length ? ` · ${p.mediaUrls.length} photo${p.mediaUrls.length === 1 ? "" : "s"}` : ""}
                      </p>
                      <p className="mt-1 line-clamp-2 prose-serif-xs text-ink">{p.body?.trim() || "(photos only)"}</p>
                    </div>
                    <PostForDoctor postId={p.id} on={!!p.forDoctorAt} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <p className="mt-10 prose-serif-xs text-muted">
          Oyun does not watch your readings or alert your doctor. If something worries you, or a reading tells you to,
          contact your maternity unit or emergency services yourself.
        </p>
      </main>
    </>
  );
}
