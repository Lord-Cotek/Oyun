import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/email";

export type NotificationType =
  | "prayer"
  | "reached_out"
  | "encouragement"
  | "invite_accepted"
  | "checkin";

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
 * Create an in-app notification and, when requested, an email — respecting the
 * user's `notifyByEmail` preference. Best-effort: never throws into the caller.
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

    if (input.email) {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        select: { email: true, name: true, notifyByEmail: true },
      });
      if (user?.email && user.notifyByEmail) {
        await sendNotificationEmail({
          to: user.email,
          name: user.name,
          title: input.title,
          body: input.body ?? "",
          href: input.href,
        }).catch(() => {});
      }
    }
  } catch {
    // Notifications must never break the action that triggered them.
  }
}
