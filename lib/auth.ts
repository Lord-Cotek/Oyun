import { type NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
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
        const live = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { suspendedAt: true },
        });
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
