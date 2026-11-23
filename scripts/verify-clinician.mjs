/**
 * The clinician's room — its promises, checked on every deploy.
 *
 * ── Why a script ─────────────────────────────────────────────────────────
 * A doctor sees what a patient chose to share and nothing else (see
 * lib/clinician.ts). The way that breaks is not dramatic: somebody adds a
 * "how is she feeling" line to the patient page next year, and a mother's
 * moods are in front of her consultant without her ever having been asked.
 * So the rooms a clinician can open are read here, and the build stops if
 * one of them reaches for something that is not clinical — or for any
 * record without first asking clinicianAccess whether this doctor may.
 *
 * Run with `npm run verify:clinician`.
 */
import createJiti from "jiti";
import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, { alias: { "@": root }, interopDefault: true });
let failed = 0;
const check = (ok, what) => {
  if (!ok) failed++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${what}`);
};

console.log("Clinic codes");
const C = jiti(path.join(root, "lib/clinician.ts"));
check(C.normaliseCode("k7q3pm") === "K7Q-3PM", "typed in lower case without the dash");
check(C.normaliseCode(" K7Q - 3PM ") === "K7Q-3PM", "spaces and a dash");
check(C.normaliseCode("K7Q3P") === null && C.normaliseCode("K7Q3PMX") === null, "too short or too long is refused");
check(C.normaliseCode("O0I1L5") === null, "letters that are never in a code are refused, not guessed");
check(C.normaliseCode("") === null, "empty is refused");

console.log("What a clinician's pages may read");
// Every file a clinician can reach: the /doctor room and its file route.
const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = path.join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(f)) files.push(p);
  }
};
walk(path.join(root, "app/doctor"));
walk(path.join(root, "app/api/doctor"));
files.push(path.join(root, "lib/clinician-db.ts"));
// Never clinical, never theirs: a family's words, moods, prayers and circle.
const FORBIDDEN = /prisma\.(letter|letterReply|checkIn|prayerRequest|prayerPray|encouragement|remembrance|nudge|supportDay|postComment|readingNote|worshipDay|personalWorshipDay|registry|journeyEvent|invite)\b/;
for (const f of files) {
  const rel = path.relative(root, f);
  const src = readFileSync(f, "utf8");
  check(!FORBIDDEN.test(src), `${rel} reads nothing that is not clinical`);
}
for (const rel of ["app/doctor/p/[link]/page.tsx", "app/api/doctor/file/[link]/[id]/route.ts"]) {
  const src = readFileSync(path.join(root, rel), "utf8");
  check(/clinicianAccess\(/.test(src), `${rel} asks clinicianAccess before reading anything`);
}
const page = readFileSync(path.join(root, "app/doctor/p/[link]/page.tsx"), "utf8");
check(/forDoctorAt: \{ not: null \}/.test(page), "the patient page shows only posts she chose for her doctor");
check(/withAppointments/.test(page) && /shared=\{link\.withAppointments\}/.test(page), "appointments only when she left them on");
check(/clinicianView\.create/.test(page), "every opening is recorded for her to see");
const access = readFileSync(path.join(root, "lib/clinician.ts"), "utf8");
check(/link\.endedAt/.test(access) && /clinician\.userId !== userId/.test(access), "an ended link, or another clinician's, grants nothing");
const fileRoute = readFileSync(path.join(root, "app/api/doctor/file/[link]/[id]/route.ts"), "utf8");
check(/withPhotos/.test(fileRoute) && /file\.journeyId !== link\.journeyId/.test(fileRoute), "photographs only when she allowed them, and only her own");

console.log("Only the mother shares");
const actions = readFileSync(path.join(root, "app/health/doctor/actions.ts"), "utf8");
check(/active\.role !== "MOTHER"/.test(actions), "sharing, changing and stopping are hers alone");
check(/if \(!input\.agreed\)/.test(actions), "nothing is shared without her ticking the agreement");

console.log("Invitations by email");
const I = jiti(path.join(root, "lib/clinician-invite.ts"));
const soon = new Date(Date.now() + 86_400_000);
const past = new Date(Date.now() - 1000);
check(I.inviteState({ acceptedAt: null, cancelledAt: null, expiresAt: soon }) === "open", "an invitation in date is open");
check(I.inviteState({ acceptedAt: null, cancelledAt: null, expiresAt: past }) === "expired", "past its date it has expired");
check(I.inviteState({ acceptedAt: null, cancelledAt: new Date(), expiresAt: soon }) === "cancelled", "cancelled by her, it is closed");
check(I.inviteState({ acceptedAt: new Date(), cancelledAt: null, expiresAt: soon }) === "accepted", "accepted once, it cannot be used again");
check(I.cleanEmail(" Doctor@Clinic.ORG ") === "doctor@clinic.org" && I.cleanEmail("not-an-email") === null, "addresses are lower-cased, and nonsense refused");
const t = I.newInviteToken();
check(t.raw.length >= 30 && t.hash === I.hashInviteToken(t.raw) && t.hash !== t.raw, "only the hash of a link is kept");
const inviteLib = readFileSync(path.join(root, "lib/clinician-invite.ts"), "utf8");
check(/user\.email\.toLowerCase\(\) !== invite\.email/.test(inviteLib), "only the invited address may accept");
check(/inviteState\(invite\) !== "open"/.test(inviteLib), "accepting checks the invitation is still open, inside the transaction");
check(/if \(!input\.agreed\)/.test(actions.split("inviteClinicianByEmail")[1] ?? ""), "she agrees to what is shared before an invitation is sent");
check(/clinic-invite:/.test(actions), "invitations are limited, so the app cannot be used to pester anybody");
check(/via === "app" && !user\.emailVerified/.test(inviteLib), "accepting inside the app needs a confirmed address");
check(/emailVerified: \{ not: null \}/.test(inviteLib) && /!u\.emailVerified\) return \[\]/.test(inviteLib), "an invitation is shown in the app only to a confirmed account");
check(/href: "\/doctor\/invitations"/.test(actions) && !/href: `[^`]*\$\{raw/.test(actions), "the in-app notice never carries the emailed link");
const invitePage = readFileSync(path.join(root, "app/doctor/invite/[token]/page.tsx"), "utf8");
check(/ownerId === me\.id/.test(invitePage) && /toLowerCase\(\) !== invite\.email/.test(invitePage), "the page never attaches an invitation to her own account or a different address");

console.log("What she shared is all there");
// The other half of the promise: when she shares a post, or leaves her
// attachments on, her doctor must be able to see every part of it. A video
// silently left out, or a PDF that opens to "Not found", is a thing she
// believes her doctor has seen and they have not.
const PM = jiti(path.join(root, "lib/post-media.ts"));
const mixed = PM.mediaOfPost({ mediaUrls: ["https://x/a.jpg", "https://x/scan.MP4", "https://x/b.mov?download=1", "https://x/c.webp"], posterUrls: ["", "https://x/scan-poster.jpg", "", ""] });
check(mixed.length === 4 && mixed.map((m) => m.type).join() === "image,video,video,image", "a shared post keeps its videos as well as its photographs, in order");
check(mixed[1].poster === "https://x/scan-poster.jpg" && !("poster" in mixed[0]) && !("poster" in mixed[2]), "a video carries its still when it has one");
const legacy = PM.mediaOfPost({ mediaUrls: [], imageUrl: "https://x/old.jpg" });
check(legacy.length === 1 && legacy[0].type === "image" && legacy[0].url === "https://x/old.jpg", "an older post's single picture is shown too");
check(PM.mediaOfPost({ mediaUrls: [], imageUrl: null }).length === 0, "a post with nothing attached shows nothing");
check(PM.mediaSummary(mixed) === "2 photos · 2 videos" && PM.mediaSummary(legacy) === "1 photo" && PM.mediaSummary([]) === "", "she is told how many photos and videos go with a post");
check(/<SharedMedia media=\{mediaOfPost\(p\)\}/.test(page) && /posterUrls: true, imageUrl: true/.test(page) && !/=== "image"/.test(page), "the clinician's page shows all of a shared post's media, not photographs only");
const herPage = readFileSync(path.join(root, "app/health/doctor/page.tsx"), "utf8");
check(/mediaSummary\(/.test(herPage), "her own list counts the same media her doctor will see");
check(/application\/pdf/.test(fileRoute) && /startsWith\("image\/"\)/.test(fileRoute), "a PDF she attached to a test opens for her doctor, like a photograph");
const linkFileRoute = readFileSync(path.join(root, "app/api/health/report-file/[token]/[id]/route.ts"), "utf8");
check(/application\/pdf/.test(linkFileRoute) && /fileInReport\(file, link\)/.test(linkFileRoute), "and through a report link, still only for files inside that report");

if (failed) {
  console.error(`\n${failed} check(s) failed — a clinician could see more than a patient chose.`);
  process.exit(1);
}
console.log("\n  ok — a clinician sees only what a patient chose.");
