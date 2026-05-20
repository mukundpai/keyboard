/**
 * Edge-compatible auth config — no Prisma, no Node-only imports.
 * Used by middleware (Edge runtime) and merged into the full auth config.
 */
import type { NextAuthConfig, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

export const authConfig = {
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  session: { strategy: 'jwt' as const },
  callbacks: {
    jwt({ token, user }: { token: JWT; user?: { id?: string } }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (token.id && session.user) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
  providers: [], // real providers added in auth.ts
} satisfies NextAuthConfig;
