import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/email";
import { sendPushToUser } from "@/lib/push";
import { sendNativeToUser } from "@/lib/fcm";
import { shouldInterrupt, CATEGORY_FIELDS } from "@/lib/notify-prefs";

export type NotificationType =
  | "prayer"
  | "reached_out"
  | "encouragement"
  | "invite_accepted"
  | "checkin"
  | "post"
  | "comment"
  | "reaction"
  | "letter_reply"
  | "registry"
  | "appointment"
  | "appointment_reminder"
  | "nudge";

interface NotifyInput {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  href?: string;
  /** Also send an email if the user has transactional email enabled. */
  email?: boolean;
}

/**
 * Create an in-app notification and — when this is a kind of thing they have
 * asked to be told about — push it to their devices and email them.
 * Best-effort: never throws into the caller.
 *
 * The record is always written, whatever the preferences say, and is written
 * before any preference is read. A switch in settings governs what taps
 * somebody on the shoulder, not what is kept: a notification somebody might
 * come looking for is not ours to throw away on the strength of a preference.
 * See lib/notify-prefs.ts.
 */
export async function notify(input: NotifyInput): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
        href: input.href,
      },
    });
  } catch {
    // The record failing must never break the action that triggered it.
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      select: {
        email: true,
        name: true,
        notifyByEmail: true,
        ...Object.fromEntries(CATEGORY_FIELDS.map((f) => [f, true])),
      },
    });

    // Could not read them, or this group is switched off: in the first case
    // tell them anyway, in the second stay quiet.
    if (!shouldInterrupt(input.type, user as never)) return;

    // Push to the user's devices (best-effort). Web push (VAPID, in the
    // browser/PWA) and native push (FCM/APNs, in the installed apps) each
    // no-op until their keys are set.
    const pushPayload = {
      title: input.title,
      body: input.body,
      href: input.href,
    };
    await Promise.all([
      sendPushToUser(input.userId, pushPayload).catch(() => {}),
      sendNativeToUser(input.userId, pushPayload).catch(() => {}),
    ]);

    if (input.email && user?.email && user.notifyByEmail) {
      await sendNotificationEmail({
        to: user.email,
        name: user.name,
        title: input.title,
        body: input.body ?? "",
        href: input.href,
      }).catch(() => {});
    }
  } catch {
    // Notifications must never break the action that triggered them.
  }
}
