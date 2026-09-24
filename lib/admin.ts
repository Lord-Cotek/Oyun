import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * Who may open the admin centre, and what it is allowed to see.
 *
 * ── The one rule this whole area is built on ─────────────────────────────
 * An admin never reads a family's content. Not a diary entry, not a letter,
 * not a confession, not an address, not what is on a registry. The app tells
 * a mother that a post marked "Just us" is seen by her and the person beside
 * her and nobody else, and that sentence has to be true of the people who run
 * the app as well, or it is not a promise — it is marketing.
 *
 * So the admin centre answers questions about accounts, not about lives: who
 * exists, when they joined, which journeys they are in and in what role,
 * whether an email is getting through. Support is done by ACTING on an
 * account — sending a reset, resending an invitation — never by reading it.
 *
 * lib/admin-db.ts is where that is enforced rather than promised: every query
 * there selects its fields one by one and there is a check that fails the
 * build if a content column is ever named. If a real legal or safety demand
 * arrives one day, the honest answer is to build a separate, logged, two-key
 * path for it and tell the family — not to quietly widen a select here.
 *
 * ── How somebody gets in ─────────────────────────────────────────────────
 * Two ways, and the first cannot be granted from inside the app:
 *
 *   1. OYUN_SUPER_ADMINS, a comma-separated list of emails in the
 *      environment. These are the super admins. They cannot be removed by
 *      the admin centre, because the thing that lets you in should not be
 *      editable by somebody who is already in.
 *   2. A row in AdminUser, added by a super admin. Ordinary admins.
 *
 * There is deliberately no "make me an admin" path anywhere. The first admin
 * exists because somebody with access to the deployment put their address in
 * an environment variable.
 *
 * ── Why 404 and not "you are not allowed" ────────────────────────────────
 * Because a page that says "forbidden" has told a stranger that there is
 * something here. The admin centre is in no navigation, linked from nowhere
 * and disallowed in robots.txt; to anybody who is not an admin — signed in or
 * not — it simply does not exist.
 */

export interface Admin {
  email: string;
  /** From the environment. May manage other admins; cannot be removed here. */
  isSuper: boolean;
}

/** The addresses named in the environment, lower-cased and de-duplicated. */
export function superAdminEmails(): string[] {
  return Array.from(
    new Set(
      (process.env.OYUN_SUPER_ADMINS ?? "")
        .split(/[,\s]+/)
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

/**
 * The admin reading this request, or null.
 *
 * Reads the signed-in session and nothing else — there is no separate admin
 * password or cookie, so an admin who signs out of the app is out of here too,
 * and revoking their account revokes this with it.
 */
export async function currentAdmin(): Promise<Admin | null> {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) return null;

  if (superAdminEmails().includes(email)) return { email, isSuper: true };

  const row = await prisma.adminUser.findUnique({
    where: { email },
    select: { id: true },
  });
  return row ? { email, isSuper: false } : null;
}

/** Every admin page and action begins with this. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await currentAdmin();
  if (!admin) notFound();
  return admin;
}

/** Managing other admins is the super admins' alone. */
export async function requireSuperAdmin(): Promise<Admin> {
  const admin = await requireAdmin();
  if (!admin.isSuper) notFound();
  return admin;
}

/**
 * Write down what an admin did.
 *
 * Never throws: a failure to record must not also fail the thing being
 * recorded, or an operator learns to work around the audit log. It is logged
 * to the server instead, which is where a missing line would be noticed.
 */
export async function audit(
  actorEmail: string,
  action: string,
  subject?: string | null,
  detail?: string | null,
): Promise<void> {
  try {
    await prisma.adminAudit.create({
      data: {
        actorEmail,
        action: action.slice(0, 120),
        subject: subject?.slice(0, 200) ?? null,
        detail: detail?.slice(0, 500) ?? null,
      },
    });
  } catch (e) {
    console.error("admin audit failed to write", { action, subject }, e);
  }
}
