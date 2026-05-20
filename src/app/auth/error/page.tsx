'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const errorMessages: Record<string, string> = {
  OAuthSignin: 'Could not start the sign-in process. Please try again.',
  OAuthCallback: 'An error occurred during authentication. Please try again.',
  OAuthCreateAccount: 'Could not create your account. Please try again.',
  Callback: 'An error occurred during the sign-in callback.',
  CredentialsSignin: 'Invalid email or password.',
  SessionRequired: 'You must be signed in to view this page.',
  Default: 'An unexpected error occurred. Please try again.',
};

function ErrorContent() {
  const params = useSearchParams();
  const code = params.get('error') ?? 'Default';
  const message = errorMessages[code] ?? errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="text-5xl">⚠️</div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">Authentication Error</h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <Link
          href="/auth/sign-in"
          className="inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
