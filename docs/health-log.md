# The health log

The health log lives in the Health room as five tabs: **Cards**, **Log**, **Medicines**, **Tests** and **Report**. It is Oyun-only. Ìdílé has no health log, so none of these files is shared between the two apps; `lib/shell.ts` is the one shared file it touches.

## Who sees it

| Who | Sees | Can |
| --- | --- | --- |
| Mum (MOTHER) | Everything, always | Everything, including the things only she can do: choose who sees the log, the weekly email, export, delete-all. She is told when her partner makes a report link, and can close any link |
| Her partner (PARTNER) | Everything, unless she chose **Only me** | Add and edit their own readings and doses, mark tests, print the report, download CSVs, make and close report links |
| The circle (friends, family, Agbebi the assistant) | Nothing | Nothing |

- The rule is `logAccess()` in `lib/health-log-db.ts`. Every page, action and route asks it first. A file is checked against the journey it belongs to, not whichever journey the viewer has open.
- **Agbebi never reads health data.** `npm run verify:health` fails the build if the assistant's code imports anything from the health log.
- `keptToMother()` tells the partner, kindly, that she has chosen to keep the log to herself.

## What is stored

| Table | What |
| --- | --- |
| `HealthLogSettings` | One per journey: audience, units, targets, the conditions she switched on, reading reminder times, `weeklyEmail`. `template` is no longer read; it is kept so no column is ever dropped. |
| `HealthReading` | Glucose, BP, weight, temperature, movements, symptoms, urine. Stored in mg/dL, kg and °C; shown in her units. |
| `MedicationPlan`, `MedicationDose` | Medicines and every dose (taken, skipped, late, injection site). Doses are made ahead by `ensureDoses()` in her time zone. |
| `PrenatalCheck` | Her rows on the tests checklist. A template item gets a row the first time it is touched. |
| `HealthFile` | Photos and PDFs. Only the storage address is kept; it never reaches a page. |
| `HealthCheckSent` | Once-only records for reading reminders and the weekly email. |
| `HealthReportLink`, `HealthReportView` | Doctor links (the token's sha-256 hash only) and each time one was opened. |

Every table cascades from `Journey`. Every schema change here was additive, proved with `prisma migrate diff`.

## Time

Days, doses and reminders follow **her** time zone (`User.timeZone`, set automatically by `KnowTheHour`), whoever is looking. `zonedInstant()` and `localDay()` in `lib/medication.ts` handle DST.

## Readings and urgent signs

`lib/health-log.ts` holds the rules, with no database. `evaluate()` flags readings as high, low or urgent, including combinations of signs: raised BP together with a headache, vision changes or upper-belly pain the same day is urgent (possible pre-eclampsia). Default targets are labelled as defaults until she enters her doctor's. There are no kick-count targets.

## Medicines and reminders

- `app/api/cron/health` runs every 15 minutes (`vercel.json`), behind the `health-reminders` flag. It is Oyun's own job; the shared morning job is not touched.
- A dose is reminded within a few minutes of the time she chose (at most ten minutes early; a late or failed run is caught by the next, and a dose is never told twice). **The notification never names the medicine.**
- Reading reminders keep quiet between 22:00 and 06:00, and are skipped if she has just taken a reading.
- **Weekly email**, off until she turns it on: Sunday 18:00–18:59 her time, once, only while the journey is active and she has email notifications on. The email is a link to `/health/report?p=week`. Nothing from the log is ever put in an email.

## Tests and vaccines

`data/prenatal-schedule.ts` is one complete list of what is commonly offered anywhere, with no country to pick. Region-specific items say where they apply in their note (malaria prevention, Td, deworming, group B strep and others).

- She chooses her own list. **Choose your list** opens by itself on her first visit; any item can also be marked **Not doing this** and put back later. Unticking never loses a date or result.
- Health-card facts add items: rhesus negative adds anti-D; both parents carrying a sickle cell gene adds a genotype talk. Conditions she switches on add theirs.
- Keys are stored in the database: **never rename a key; retire it** (`retired: "<the key it was folded into>"`). A retired item is never offered again, but a row already marked done under it still shows.

## Photos and files

- Images are re-encoded on the device before upload, which strips EXIF data, location included. PDFs are kept as they are.
- Uploads go to `health/{journeyId}/` in Vercel Blob behind an unguessable address (a random name plus the store's random suffix). Files are only ever served through `/api/health/file/[id]` (signed in, `logAccess` checked) or `/api/health/report-file/[token]/[id]`; the storage address never reaches a page. Private storage is used only for a private store, set with `NEXT_PUBLIC_HEALTH_BLOB_ACCESS=private` — a public store does not refuse a private upload cleanly (the browser sees a dropped connection and the SDK keeps retrying), which is why photos once sat at "Uploading". Every upload has deadlines, a stall check that counts only new bytes, one retry, and can be removed or retried by hand.
- On iOS the photo picker offers only the photo library. Opening the camera straight from the app is not allowed there yet.
- The daily cron sweeps files that were uploaded but never attached to an entry.

## The doctor's report

- `/health/report` is built by `buildReport()` in `lib/health-report.ts` and drawn by `ReportDocument`. It shows exactly what will print.
- Out-of-range values carry a symbol as well as a colour (▲ high, ▼ low, ‼ urgent), so a black-and-white copy loses nothing.
- **Print, or save as PDF** uses the browser's print dialog. Readings and doses download as CSV via `/api/health/csv`. Cells are formula-safe (`lib/csv-cell.ts`) and files are named by period, never by person.
- **View-only link (Mum, or her partner while she shares the log).** `createReportLink()` makes 24 random bytes as a base64url token and stores only the hash. A link lasts 3 to 30 days.
  - Both see every link, who made it and how often it was opened; either can close one. A link her partner makes notifies her (`health_shared`, Housekeeping).
  - Switching the log to **Only me** closes every live link her partner made (`setLogAudience`), and `logAccess` stops new ones.
  - `/dr/[token]` needs no login and says noindex. `/dr` is disallowed in robots and listed in `GUEST_ROUTES`, so Agbebi does not appear there.
  - The page shows that period and nothing else, plus its CSVs (`/api/health/report-csv/[token]`).
  - Each opening is recorded. **Close it** stops the link at once.
  - Photos are included only if she ticked the photo appendix, and only those attached to entries inside the period (`fileInReport()`).
- **The installed apps.** WKWebView and Android's WebView give a page no print, download or share sheet, and the phone's browser is not signed in.
  - In the app, **Save as PDF or print ↗** makes a two-hour link labelled "To print or save on this phone" and opens it in the phone's browser, where printing, Save to Files and the CSVs all work. It is listed with the others.
  - Shell detection is `isNativeShell()` in `lib/shell.ts`.

## Her data

- **Download everything (ZIP)** (Mum only): `/api/health/export` returns readings, doses, medicines and tests as CSV, every photo and PDF under `files/`, and a README. It is capped at 300 files or 150 MB; the README says if anything was left out.
- **Delete my whole health log** (Mum only, two taps) deletes, in one transaction:
  - readings, medicines and doses
  - the tests checklist
  - report links and their views
  - reminder records and settings
  - every file, removed from storage as well
- Health cards are separate and stay.
- Deleting the journey or the account removes everything through the cascades.

## Checks

- `npm run verify` includes `verify:health` (`scripts/verify-health-log.mjs`). It covers:
  - urgent rules, units and gestation
  - dose schedules across DST
  - the tests list (one full list, no duplicates, no country labels, retired keys still pointing somewhere)
  - CSV escaping
  - report-link open/closed/expired and token shape
  - the weekly email hour in several time zones
  - that the assistant never reads health records
- The browser tests used during the build live outside the repository; this list is what they covered.
