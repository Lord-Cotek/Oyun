# Oyun — native apps (iOS + Android)

A thin, branded [Capacitor](https://capacitorjs.com) shell around the live web
app at **https://oyun.cotek.app**. The installed app loads the deployed site in
a native WebView, so it always reflects the current web app / PWA exactly —
there's no separate build of the UI to keep in sync. Native icons, splash
screen, colours and app name are wired from the Oyun brand mark, so there are
**no Codemagic / Capacitor placeholders**.

- **App name:** Oyun
- **Bundle / application id:** `app.cotek.oyun`
- **Loads:** `https://oyun.cotek.app`
- **Brand:** dark `#0B0E14`, cream `#ECE8DE`, gold `#E6A94E`

## Layout

```
mobile/
  capacitor.config.ts     # app id, name, the URL it loads, splash/status bar
  assets/                 # source icon + splash → generated per-platform
    icon-only.png         # 1024²  iOS icon (dark bg + mark)
    icon-foreground.png   # 1024²  Android adaptive foreground (transparent)
    icon-background.png   # 1024²  Android adaptive background (#0B0E14)
    splash.png            # 2732²  splash (light + dark are both brand-dark)
    splash-dark.png
  www/index.html          # offline fallback (shown only if the site is unreachable)
  android/                # committed — opens directly in Android Studio
  ios/                    # NOT committed — generated on a Mac / on Codemagic
```

## Regenerating icons & splash

Whenever you change anything in `assets/`:

```bash
cd mobile
npm ci
npx cap sync
npx capacitor-assets generate      # both platforms
```

The Android launcher/adaptive icons and splash are already generated and
committed. iOS assets are generated during the Codemagic build (or locally on a
Mac).

## Local development

### Android (Android Studio)

```bash
cd mobile
npm ci
npx cap sync android        # regenerates the git-ignored web assets + plugins
npx cap open android        # opens Android Studio
```

Run on a device/emulator from Android Studio. For a **local signed release**,
copy `android/keystore.properties.example` → `android/keystore.properties` and
point it at your keystore; `Build → Generate Signed Bundle/APK` (or
`./gradlew bundleRelease`).

### iOS (Mac only)

```bash
cd mobile
npm ci
npx cap add ios
npx cap sync ios
npx capacitor-assets generate --ios
cd ios/App && pod install
npx cap open ios            # opens Xcode
```

## Codemagic

`codemagic.yaml` (repo root) defines two workflows: **`Oyun · Android`** (Linux
→ signed `.aab` + `.apk`) and **`Oyun · iOS`** (macOS → signed `.ipa`, optional
TestFlight). Each build runs `cap sync` + `capacitor-assets generate` so the
icons/splash are always freshly wired.

One-time setup in the Codemagic UI:

1. **Android signing** — Team → *Code signing identities* → *Android keystores*
   → upload your upload keystore and name it **`oyun_upload_keystore`** (matches
   `codemagic.yaml`). Codemagic injects `CM_KEYSTORE_PATH`,
   `CM_KEYSTORE_PASSWORD`, `CM_KEY_ALIAS`, `CM_KEY_PASSWORD`, which the build
   writes into `keystore.properties` for Gradle.
2. **iOS signing** — Team → *Integrations* → connect an **App Store Connect API
   key** and name it **`oyun_asc`**. The `ios_signing` block fetches a matching
   distribution certificate + provisioning profile for `app.cotek.oyun`
   automatically (create the app record in App Store Connect first, with that
   bundle id).
3. Point Codemagic at this repository and start the **Android** or **iOS**
   workflow.

### Versioning

- **Android:** bump `versionCode` / `versionName` in `android/app/build.gradle`.
- **iOS:** the build number is set from Codemagic's `$BUILD_NUMBER`; set the
  marketing version in Xcode / `Info.plist` as needed.

## Notes

- **App Store review:** because this wraps a website, position it as the
  companion app for an account-based service (it has sign-in, private data, and
  installed-app behaviour). If Apple pushes back on "minimal functionality,"
  the usual next step is to add one or two genuinely native touches (native
  push, share, biometric lock).
- **Push notifications:** the web app's VAPID web-push works in browsers/PWA but
  not inside the native WebView. Native push (APNs/FCM via
  `@capacitor/push-notifications` + a small bridge in the web app) is a clean
  follow-up if you want lock-screen notifications on the installed app.
- The app sends a `OyunNative` marker in its User-Agent, so the web app can
  detect the shell (e.g. to hide the PWA "install" prompt) if we ever want to.
