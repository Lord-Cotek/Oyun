# Oyun — iOS release with Codemagic

Bundle id **`app.cotek.oyun`** · App name **Oyun** · Owner **cotek app FZ-LLC**.
The `ios` workflow in `codemagic.yaml` builds a signed `.ipa` and uploads it to
TestFlight. Do the one-time Apple + Codemagic setup below, then every run
produces a submittable build.

## 0. Apple Developer Program (one-time)

Enrol cotek app FZ-LLC in the Apple Developer Program. As a company, enrol as an
**Organization** — this needs a **D-U-N-S number** for cotek app FZ-LLC (free
from Dun & Bradstreet; can take a few days). Individual enrolment also works but
lists a person as the seller.

## 1. Register the App ID

Apple Developer → **Certificates, Identifiers & Profiles → Identifiers → +** →
**App IDs → App** → explicit Bundle ID **`app.cotek.oyun`**. (Codemagic can also
create this automatically during signing — either is fine.)

## 2. Create the app in App Store Connect

**App Store Connect → Apps → + → New App**

- Platform: **iOS**
- Name: **Oyun**
- Primary language, and a **SKU** (e.g. `oyun-ios`)
- Bundle ID: **app.cotek.oyun**

Then complete the listing (can be after the first build):

- **Privacy Policy URL:** `https://oyun.cotek.app/privacy`
- **Support URL:** `https://oyun.cotek.app/contact`
- Category, **age rating**, and the **App Privacy** data questionnaire
  (account/email, health-adjacent and user content, diagnostics — you do not
  sell data)
- Description, keywords, and **screenshots** (at minimum a 6.7" iPhone set)

## 3. App Store Connect API key (for Codemagic)

**App Store Connect → Users and Access → Integrations → App Store Connect API →
Team Keys** → generate a key with the **App Manager** role. Note the **Issuer
ID** and **Key ID**, and download the **.p8** (only downloadable once).

## 4. Connect Codemagic

- **Codemagic → Teams → Integrations → Developer Portal / App Store Connect** →
  add the key (Issuer ID, Key ID, .p8). Name the integration exactly
  **`oyun_asc`** — this matches `codemagic.yaml`.
- Signing is automatic: the `ios_signing` block fetches/creates the distribution
  certificate and provisioning profile for `app.cotek.oyun`.

## 5. Build

- Add this repository in Codemagic (if not already).
- Start the **“Oyun · iOS”** workflow (or push to `main`).
- On success it uploads to **TestFlight** and emails you.

## 6. TestFlight → App Store

- The build appears in **App Store Connect → TestFlight** after processing
  (~10–30 min). Add it to internal testing to try on your own device.
- When ready: **App Store** tab → attach the build to a version → finish all
  metadata → **Submit for Review**.

## Notes

- **Push is not required for a first submission.** The workflow builds and
  submits without Firebase. Add native push later (see `NATIVE_PUSH.md`) after
  the one-time Push capability step on a Mac.
- **Export compliance** is auto-declared (`ITSAppUsesNonExemptEncryption=false`)
  since the app uses only standard HTTPS — no per-build prompt.
- **Guideline 4.2 (minimum functionality):** because the app wraps a website,
  present it as the companion to an account-based service (sign-in, private
  journey data). If Apple pushes back, add one genuinely native touch.
- Marketing version is **1.0**; the build number is set automatically from
  Codemagic's `$BUILD_NUMBER`. Bump the version in Xcode / `Info.plist` for
  later releases.
