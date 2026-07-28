import { prisma } from "@/lib/prisma";

/**
 * Native push via Firebase Cloud Messaging — delivers to the installed
 * Capacitor apps (FCM on Android, APNs-via-Firebase on iOS). It stays a no-op
 * until FIREBASE_SERVICE_ACCOUNT is set, so nothing breaks before it's wired.
 *
 * FIREBASE_SERVICE_ACCOUNT is the full service-account JSON (as a string) from
 * the Firebase console → Project settings → Service accounts → Generate key.
 */
type AdminApp = import("firebase-admin/app").App;

let appPromise: Promise<AdminApp | null> | null = null;

function loadApp(): Promise<AdminApp | null> {
  if (appPromise) return appPromise;
  appPromise = (async () => {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!raw) return null;
    try {
      const { initializeApp, getApps, cert } = await import("firebase-admin/app");
      if (getApps().length) return getApps()[0];
      return initializeApp({ credential: cert(JSON.parse(raw)) });
    } catch {
      return null;
    }
  })();
  return appPromise;
}

export function fcmEnabled(): boolean {
  return !!process.env.FIREBASE_SERVICE_ACCOUNT;
}

export interface NativePayload {
  title: string;
  body?: string;
  href?: string;
}

/** Send a native push to all of a user's registered devices. Best-effort. */
export async function sendNativeToUser(
  userId: string,
  payload: NativePayload,
): Promise<void> {
  try {
    const app = await loadApp();
    if (!app) return;

    const tokens = await prisma.nativePushToken.findMany({
      where: { userId },
      select: { id: true, token: true },
    });
    if (tokens.length === 0) return;

    const { getMessaging } = await import("firebase-admin/messaging");
    const res = await getMessaging(app).sendEachForMulticast({
      tokens: tokens.map((t) => t.token),
      notification: { title: payload.title, body: payload.body ?? "" },
      data: payload.href ? { href: payload.href } : {},
      android: {
        priority: "high",
        notification: { channelId: "default", sound: "default" },
      },
      apns: { payload: { aps: { sound: "default" } } },
    });

    // Prune tokens the platform reports as dead.
    const dead: string[] = [];
    res.responses.forEach((r, i) => {
      if (!r.success) {
        const code = r.error?.code ?? "";
        if (
          code.includes("registration-token-not-registered") ||
          code.includes("invalid-registration-token") ||
          code.includes("invalid-argument")
        ) {
          dead.push(tokens[i].id);
        }
      }
    });
    if (dead.length) {
      await prisma.nativePushToken
        .deleteMany({ where: { id: { in: dead } } })
        .catch(() => {});
    }
  } catch {
    // Native push must never break the action that triggered it.
  }
}
