# Native push (installed iOS + Android apps)

The web app's VAPID web-push works in browsers and the installed PWA, but **not
inside the native WebView**. The installed Capacitor apps use **Firebase Cloud
Messaging (FCM)** instead — FCM delivers to Android directly and to iOS via
APNs, so the server has a single send path.

Everything is wired and **inert until you add credentials** — the web app and
both native apps build and run fine without any of this. Turn it on by doing the
steps below.

## How it flows

1. The installed app registers with FCM and gets a **device token**
   (`components/NativePush.tsx`, via the `FirebaseMessaging` Capacitor plugin).
2. It POSTs the token to **`/api/push/native/register`**, stored in the
   **`NativePushToken`** table.
3. Whenever the server calls `notify(...)`, it also sends via FCM
   (`lib/fcm.ts` → `sendNativeToUser`) to every token for that user, with the
   same title/body and the deep-link `href` in the data payload.
4. Tapping the notification opens that deep link (same anchors as the bell).

## One-time setup

### 1. Firebase project

- Create a Firebase project (or reuse one). Add an **Android app** with package
  `app.cotek.oyun` and an **iOS app** with bundle id `app.cotek.oyun`.
- **Android:** download `google-services.json`.
- **iOS:** download `GoogleService-Info.plist`, and in **Project settings →
  Cloud Messaging → Apple app configuration**, upload your **APNs auth key**
  (`.p8` from the Apple Developer portal) — this is what lets FCM reach iOS.

### 2. Server (Vercel) — one env var

Firebase console → **Project settings → Service accounts → Generate new private
key**. Set the whole JSON as one environment variable on the Oyun Vercel
project:

```
FIREBASE_SERVICE_ACCOUNT = { ...the service-account JSON... }
```

Then run the database migration (Neon SQL editor) — the delta is in
`mobile/NATIVE_PUSH.sql`. Additive and safe to run before deploy.

### 3. Codemagic — two secrets

Add a variable group **`oyun_firebase`** (already referenced in
`codemagic.yaml`) with, base64-encoded:

```
GOOGLE_SERVICES_JSON        = base64 of google-services.json
GOOGLE_SERVICE_INFO_PLIST   = base64 of GoogleService-Info.plist
```

(`base64 -i google-services.json | pbcopy`). The build writes them into place
before compiling. Leave them unset and the apps still build — just without push.

### 4. iOS capability (one-time, on a Mac)

Android push works entirely from CI. **iOS needs the Push Notifications
capability**, which lives in the Xcode project. Once, on a Mac:

```bash
cd mobile
npm ci
npx cap add ios
npx cap sync ios
npx cap open ios
```

In Xcode → target **App** → **Signing & Capabilities** → **+ Capability** →
add **Push Notifications** and **Background Modes → Remote notifications**. Also
make sure the App ID in the Apple Developer portal has **Push Notifications**
enabled. Commit the resulting `ios/` project (remove it from `mobile/.gitignore`
first) so Codemagic builds it with the capability.

## Testing

1. Apply `NATIVE_PUSH.sql` in Neon and set `FIREBASE_SERVICE_ACCOUNT` on Vercel.
2. Build the app (Codemagic or Android Studio) with the Firebase config in place.
3. Install on a real device (push doesn't work on the iOS simulator), sign in,
   and accept the notification prompt.
4. From another account, do something that notifies you (send a word, pray,
   write a letter) — a notification should arrive on the lock screen and, when
   tapped, open the exact item.
