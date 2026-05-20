/**
 * Middleware — Edge runtime (no Prisma, no Node-only APIs).
 * Uses the lightweight authConfig so no database driver is imported.
 */
import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

const PROTECTED = ['/account', '/profile', '/admin'];
const AUTH_ONLY = ['/auth/sign-in', '/auth/sign-up'];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtected = PROTECTED.some((p) => nextUrl.pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY.some((p) => nextUrl.pathname.startsWith(p));

  if (isAuthOnly && isLoggedIn) {
    return Response.redirect(new URL('/', req.url));
  }

  if (isProtected && !isLoggedIn) {
    const url = new URL('/auth/sign-in', req.url);
    url.searchParams.set('callbackUrl', nextUrl.pathname);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ['/account/:path*', '/profile/:path*', '/admin/:path*', '/auth/sign-in', '/auth/sign-up'],
};
