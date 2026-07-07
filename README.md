# Oyun

> Walk the whole journey — together — with Scripture at the center.

**Oyun** (Yoruba: *pregnancy / the womb*) is a Christian companion for the whole
journey — **conception through a child's first 24 months** — for an expectant
mother **and** her husband or accountability partner. Each stage pairs what's
unfolding physically/developmentally with a scripture, a short reflection, and
one concrete thing to *do*. Its guide is an AI midwife named **Agbebi** (Yoruba:
*midwife* — "one who receives the child").

The signature that sets Oyun apart: an **accountability layer**. The mother is
not the only user — a husband or accountability partner gets their own view of
how to support and pray for her, right where she is this week.

A COTEK product, built to COTEK conventions (alongside PExP, ProMan, SCI, Oluko).

> Oyun and Agbebi offer spiritual companionship and encouragement — **not
> medical advice**. Always consult your doctor or midwife for health decisions.

## Stack

- **Next.js 14 (App Router)** · **TypeScript** · **Tailwind CSS**
- **Neon Postgres + Prisma** — single client via `lib/prisma.ts` (pooled URL at runtime)
- **NextAuth** — email magic-link over SMTP; redirects unauthenticated users to `/`
- **@anthropic-ai/sdk** — streaming Agbebi assistant, server-only
- **Recharts** — mood check-ins over time
- **PWA** — installable (manifest + icons)

## Design system — "Evangelical clarity"

Purposeful, non-decorative craft; restraint is the point. **Playfair Display**
for display headings and scripture; **DM Mono** for body, labels, UI. A single
warm maternal amber accent. Tokens live in `app/globals.css` — re-theme there,
never in JS. UI kit in `components/ui/` (`Eyebrow`, `Card`, `StatCard`,
`Button`, `OyunMark`, `Verse`).

## Getting started

```bash
npm install
cp .env.example .env      # then fill it in
npm run db:push           # push the Prisma schema to Neon
npm run dev
```

Open http://localhost:3000. The landing page renders without a database
connected; sign-in, onboarding, `/journey`, and `/care` require the DB and env.

### Environment

See `.env.example`. You'll need a Neon **pooled** `DATABASE_URL`, a
`NEXTAUTH_SECRET`, SMTP settings for magic-link email (`EMAIL_SERVER`,
`EMAIL_FROM`), and an `ANTHROPIC_API_KEY`. `ANTHROPIC_MODEL` defaults to
`claude-sonnet-4-6`; Agbebi drops to Haiku for routine calls and reserves Opus
for hard reasoning.

## Structure

```
app/
  page.tsx                 Landing (renders without a DB)
  sign-in/                 Magic-link sign-in
  onboarding/              Set role, due/birth date; accept an invite
  journey/                 Role-aware dashboard (mother + partner views)
  care/                    Mood check-ins (charted), letters, milestone timeline
  api/agbebi/              Streaming Agbebi route + live context
  api/auth/[...nextauth]/  NextAuth handler
  opengraph-image · icon · apple-icon · manifest · robots · sitemap
components/
  ui/                      The COTEK UI kit + OyunMark
  AssistantChat.tsx        Floating, streaming, context-aware Agbebi + crisis banner
  care/                    Check-in / letter / milestone forms + MoodChart
lib/
  journey.ts               40 pregnancy weeks + months 0–24 — the content source of truth
  stage.ts                 Current-stage computation from the due/birth date
  agbebi.ts                Agbebi system prompt + live-context builder
  crisis.ts                Emergency / loss keyword tripwires (UI safety net)
  prisma.ts · auth.ts · anthropic.ts · data.ts · moods.ts · mail.ts
prisma/schema.prisma       NextAuth models + Journey, Membership, Invite,
                           CheckIn, Letter, Milestone, Nudge
brand-assets/              Supplied marks + icons (copied into /public)
```

## Agbebi

Agbebi is a warm, steady, Reformed Baptist companion — grounded in Scripture,
never teaching prosperity doctrine, honest about suffering, and pastoral about
loss. A **hard safety boundary**: Agbebi is not a doctor and never gives medical
advice. A keyword tripwire (`lib/crisis.ts`) surfaces a calm banner pointing to
the user's care provider for anything that could be an emergency or a loss —
the model is never the only safety net.

## Deploy

Target: **oyun.cotek.app** (Vercel). Set the same environment variables in the
project, scope the Vercel domain to this single project, and use the Neon pooled
connection string at runtime.
