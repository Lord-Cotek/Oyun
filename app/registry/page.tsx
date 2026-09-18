import type { Metadata } from "next";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import {
  canKeepRegistry,
  canTakeMoney,
  claimsVisibleToHost,
  type ItemKind,
} from "@/lib/registry";
import { registryUrl } from "@/lib/registry-db";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FirstStep } from "@/components/ui/FirstStep";
import { StartRegistry } from "@/components/registry/StartRegistry";
import { AddItem } from "@/components/registry/AddItem";
import { ItemList, type HostItem } from "@/components/registry/ItemList";
import { ShareRegistry } from "@/components/registry/ShareRegistry";
import { RegistrySettings } from "@/components/registry/RegistrySettings";
import { PayDetails } from "@/components/registry/PayDetails";
import { ThankYous, ThankAll, type ThankYou } from "@/components/registry/ThankYous";

export const metadata: Metadata = {
  title: "Registry",
  description: "What you actually need, in one list anybody can open.",
  robots: { index: false },
};

const when = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default async function RegistryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/registry");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  // The registry belongs to the two at the centre. The circle is who it is
  // for — they get the public link like everybody else.
  if (!canKeepRegistry(active.role)) redirect("/journey");

  const { journey } = active;
  const registry = await prisma.registry.findUnique({
    where: { journeyId: journey.id },
    select: {
      slug: true,
      title: true,
      hostName: true,
      message: true,
      showClaims: true,
      closedAt: true,
      payLabel: true,
      payDetails: true,
      payNote: true,
      items: {
        orderBy: [{ mostNeeded: "desc" }, { position: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          kind: true,
          title: true,
          note: true,
          url: true,
          imageUrl: true,
          price: true,
          quantity: true,
          mostNeeded: true,
          claims: {
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              name: true,
              note: true,
              quantity: true,
              createdAt: true,
              thankedAt: true,
            },
          },
        },
      },
    },
  });

  if (!registry) {
    const babyName = journey.babyName?.trim();
    const motherName = journey.owner.name?.trim()?.split(/\s+/)[0];
    return (
      <>
        <SiteHeader active="registry" />
        <main className="mx-auto max-w-3xl px-6 pb-10">
          <PageHero
            eyebrow="Registry"
            title="What you actually need."
            lede="One list, made of links from any shop — and of the things no shop sells. Share it as a single address, or a square anybody can point a phone at."
          />
          <div className="mt-8 space-y-6">
            <Card className="p-8">
              <Eyebrow className="mb-4">Before you start</Eyebrow>
              <div className="space-y-3 prose-serif-sm text-muted">
                <p>
                  Anything with a link can go on it — Amazon, Noon, Mumzworld,
                  a shop nobody has heard of — and a whole wishlist you already
                  keep somewhere else can go on as one card.
                </p>
                <p>
                  So can the things that are not in a shop at all: a week of
                  meals, an evening of cooking, a lift to the 34-week
                  appointment, somebody to hold the baby while you sleep. Those
                  are usually the ones people remember.
                </p>
                <p>
                  Nobody needs an account to give. Nobody pays through this app
                  — every link goes to the shop itself, and no money passes
                  through Oyun.
                </p>
              </div>
            </Card>
            <Card className="p-8">
              <Eyebrow className="mb-4">Start one</Eyebrow>
              <StartRegistry
                suggestedTitle={babyName ? `For baby ${babyName}` : "For our baby"}
                suggestedHost={motherName ? `${motherName} and family` : "Our family"}
              />
            </Card>
          </div>
        </main>
      </>
    );
  }

  const url = registryUrl(registry.slug);
  // Drawn here, on the server, from our own address — nothing a person typed
  // reaches it, which is why the component may render it as markup.
  const qrSvg = await QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#1b1714", light: "#ffffff" },
  });

  const closed = registry.closedAt !== null;
  const showClaims = claimsVisibleToHost(registry);
  const takesMoney = canTakeMoney(registry);

  const items: HostItem[] = registry.items.map((i) => ({
    id: i.id,
    kind: i.kind as ItemKind,
    title: i.title,
    note: i.note,
    url: i.url,
    imageUrl: i.imageUrl,
    price: i.price,
    quantity: i.quantity,
    mostNeeded: i.mostNeeded,
    claimed: i.claims.reduce((n, c) => n + c.quantity, 0),
    // Null, not an empty array, while she has asked to be surprised: the
    // names never leave the server in that case rather than being hidden by
    // the component, because a thing sent to a browser has been sent.
    takers: showClaims
      ? i.claims.map((c) => ({ id: c.id, name: c.name, note: c.note }))
      : null,
  }));

  const thanks: ThankYou[] = showClaims
    ? registry.items.flatMap((i) =>
        i.claims.map((c) => ({
          id: c.id,
          name: c.name,
          note: c.note,
          item: i.title,
          when: when(c.createdAt),
          thanked: c.thankedAt !== null,
        })),
      )
    : [];
  const unthanked = thanks.filter((t) => !t.thanked).map((t) => t.id);

  const taken = items.reduce((n, i) => n + i.claimed, 0);
  const wanted = items.reduce(
    (n, i) => n + (i.kind === "LIST" ? 0 : i.quantity),
    0,
  );

  return (
    <>
      <SiteHeader active="registry" />
      <main className="mx-auto max-w-3xl px-6 pb-10">
        <PageHero
          eyebrow="Registry"
          title={registry.title}
          lede={
            closed
              ? "Finished. The link still opens — it simply stops asking."
              : "One list, one link. Add anything with an address, and the things no shop sells."
          }
          aside={
            <div className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
              <p>
                {items.length} {items.length === 1 ? "thing" : "things"} on the
                list
              </p>
              {wanted > 0 && (
                <p className="mt-1 text-accent">
                  {taken} of {wanted} spoken for
                </p>
              )}
            </div>
          }
        />

        <div className="mt-8 space-y-6">
          <Card className="p-6 md:p-8">
            <Eyebrow className="mb-4">Share it</Eyebrow>
            <ShareRegistry url={url} title={registry.title} qrSvg={qrSvg} />
            <div className="mt-4">
              <RegistrySettings
                title={registry.title}
                hostName={registry.hostName}
                message={registry.message}
                showClaims={registry.showClaims}
                closed={closed}
              />
            </div>
            <div className="mt-3">
              <PayDetails
                payLabel={registry.payLabel}
                payDetails={registry.payDetails}
                payNote={registry.payNote}
              />
            </div>
          </Card>

          {!closed && (
            <div>
              <Eyebrow className="mb-4">Add something</Eyebrow>
              <AddItem takesMoney={takesMoney} />
            </div>
          )}

          <div>
            <Eyebrow className="mb-4">The list</Eyebrow>
            {items.length === 0 ? (
              <Card className="p-8">
                <FirstStep>
                  Nothing on it yet. Paste a link from whichever shop you were
                  looking at — or write down one thing that is not in a shop at
                  all, like a week of meals.
                </FirstStep>
              </Card>
            ) : (
              <ItemList items={items} showClaims={showClaims} closed={closed} />
            )}
          </div>

          {thanks.length > 0 && (
            <div>
              <Eyebrow className="mb-4">Thank-yous</Eyebrow>
              <Card className="p-6 md:p-8">
                <ThankYous rows={thanks} />
                <ThankAll ids={unthanked} />
              </Card>
            </div>
          )}

          {!showClaims && (
            <Card className="p-6">
              <p className="prose-serif-sm text-muted">
                You have asked to be surprised, so who has taken what is kept
                back. It appears — all of it, for thank-yous — when you finish
                the registry.
              </p>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
