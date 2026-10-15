import { type NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

/**
 * How long somebody stays signed in without having to think about it.
 *
 * ── Why a year, and not the default thirty days ──────────────────────────
 * This is a family's own diary on their own phone, not a bank. Nobody opens
 * it every week: a father checks in around a scan, a grandmother at a
 * birthday, somebody comes back in March to read what was written in
 * January. Thirty days of quiet is an ordinary gap here, and being asked for
 * a password because of it is the app forgetting you, not protecting you.
 *
 * It rolls: every visit pushes the year out again, so an account that is
 * used at all is never signed out by time. Signing out is a thing a person
 * does on purpose, from the menu.
 */
const A_YEAR = 365 * 24 * 60 * 60;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: A_YEAR,
    // Re-sign at most daily. The cookie's expiry moves out with it, which is
    // what makes the year rolling rather than fixed from the first sign-in.
    updateAge: 24 * 60 * 60,
  },
  jwt: { maxAge: A_YEAR },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;
        // A suspended account is refused here and, for anybody already
        // signed in, in the session callback below.
        if (user.suspendedAt) return null;

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // ── Why a query on every session read ─────────────────────────────
        // The session is a JWT, so a suspended account would otherwise stay
        // signed in until the token expired — which can be days, and the
        // reason to suspend an account is almost always something happening
        // now. One lookup by primary key is cheap beside the several queries
        // every page already makes, and correctness here is worth more than
        // the microseconds.
        //
        // Leaving the id off is deliberate: every guard in the app asks for
        // session?.user?.id, so a suspended account lands wherever a signed
        // out one would, with no new code path to get wrong.
        // ── And why it must FAIL OPEN ─────────────────────────────────────
        // If this lookup throws, the account has told us nothing about
        // itself — the database is simply not answering. Treating silence as
        // "suspended" signs out every family in the app for as long as the
        // blip lasts, and what they see is the sign-in page, and signing in
        // fails too because that needs the database as well. The app does
        // not look poorly; it looks like it threw them out and locked the
        // door. Some would reset a password they never needed to change.
        //
        // Measured, not assumed: before this, stopping the database bounced
        // a signed-in user straight to /sign-in.
        //
        // So a throw keeps the session. The cost of being wrong that way is
        // that a suspended person keeps reading for another few seconds
        // until the database answers again; the cost of the other way is
        // everybody losing their place. A row that comes back NULL is a
        // different thing — that account is genuinely gone — and still ends
        // the session.
        let live: { suspendedAt: Date | null } | null = null;
        try {
          live = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { suspendedAt: true },
          });
        } catch (err) {
          console.error("[auth] could not check the account; keeping the session", err);
          session.user.id = token.id as string;
          return session;
        }
        if (!live || live.suspendedAt) {
          // Removed rather than blanked: NextAuth types `user` as always
          // present, and a user object with an empty id is a thing a future
          // guard could mistake for somebody.
          delete (session as { user?: unknown }).user;
          return session;
        }
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

/** Convenience wrapper — the canonical way to read the session server-side. */
export function auth() {
  return getServerSession(authOptions);
}
