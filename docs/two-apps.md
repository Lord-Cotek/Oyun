# Two apps, one set of parts

Oyun and Ìdílé are siblings. They serve different seasons of the same life —
one walks a family from conception to a child's second birthday, the other
disciples a whole household for as long as it stands — and they are built from
the same parts: the same diary, the same photo lightbox, the same draft-keeping
box, the same icon set, the same share helpers.

They live in two repositories and deploy separately. That is not going to
change casually: a monorepo would mean reworking two deploy pipelines, and the
apps are in families' hands.

## The actual risk

Forty-seven files are meant to say the same thing in both apps. Nothing stopped
that from quietly ceasing to be true. A bug gets fixed in one and not the other.
A component grows a prop on one side. A comment explaining *why* something is
the way it is survives in one copy and is lost from the other. Six months later
nobody can tell which version is the considered one, and the difference between
them looks deliberate because it has been there a while.

That is the failure this guards against — not the duplication itself, which is
tolerable, but the silent divergence, which is not.

## `npm run drift`

Runs in either repo, finds its sibling at `../idile` or `../Oyun`, and fails if
any file on the list has moved without its twin.

```
npm run drift
npm run drift -- --other ../wherever
```

If the sibling is not checked out it says so and exits zero — working on one
app alone is an ordinary thing to do, not an error.

### How "the same" is judged

Not byte equality; the two apps have different names and nouns. Each entry in
`shared-files.json` is compared after applying substitutions — `household ↔
journey`, `Ìdílé ↔ Oyun` — so a deliberate difference is written down once
rather than rediscovered on every read of the diff.

An entry marked `"code": true` is compared with its comments stripped. Most
shared files are marked this way, on purpose: these files are heavily commented
and the comments are written for each app's own reader. Oyun's draft-keeping
talks about a letter to the baby; Ìdílé's talks about a letter to a child. Both
are right. Stripping the comments protects what a file **does** while leaving
how it explains itself alone.

An entry with `"pair"` names a file that exists under a different name in each
app — the reminder rules are `lib/nudges.ts` here and `lib/reminders.ts` there,
each named for what its own app calls the thing.

The checker and the manifest are themselves on the list. A rule only one side
enforces is not a rule, and the two manifests are byte-identical for that
reason.

### When it fails

Two honest answers, and the script says both:

1. **Put the fix in both apps.** This is almost always the right one.
2. **Declare the difference.** Add a substitution so the reason is recorded.

There is no third option where you silence it, which is the point.

## What has not been done

This is not a shared package and does not pretend to be. Extracting one is a
real piece of work — a workspace, a build step, two deploy pipelines — and it
should happen when there is a reason beyond tidiness.

What this does is make that extraction easy when it comes, and stop the drift
getting worse in the meantime. The forty-seven files are already identical
modulo a declared word list; moving them into a package is mechanical rather
than archaeological.
