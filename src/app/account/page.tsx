import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { User, Mail, Calendar, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Account — KeyMaster Pro' };

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/sign-in?callbackUrl=/account');

  const { name, email, image } = session.user;

  return (
    <section className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      {/* Header card */}
      <div className="glass-card p-6 flex items-center gap-5 animate-slide-up">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name ?? 'Avatar'} className="w-16 h-16 rounded-2xl object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <User size={28} className="text-indigo-400" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-text-primary">{name ?? 'Anonymous'}</h1>
          <p className="text-sm text-muted">{email}</p>
        </div>
      </div>

      {/* Account info */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Account Details</h2>
        <dl className="space-y-3">
          <div className="flex items-center gap-3">
            <User size={16} className="text-muted shrink-0" />
            <dt className="w-28 text-xs text-muted">Display name</dt>
            <dd className="text-sm text-text-primary">{name ?? '—'}</dd>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-muted shrink-0" />
            <dt className="w-28 text-xs text-muted">Email</dt>
            <dd className="text-sm text-text-primary">{email}</dd>
          </div>
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-muted shrink-0" />
            <dt className="w-28 text-xs text-muted">Provider</dt>
            <dd className="text-sm text-text-primary">Email / Password</dd>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-muted shrink-0" />
            <dt className="w-28 text-xs text-muted">Member since</dt>
            <dd className="text-sm text-text-primary">{formatDate(new Date())}</dd>
          </div>
        </dl>
      </div>

      {/* Actions */}
      <div className="glass-card p-6 space-y-3">
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Actions</h2>
        <Link
          href="/profile"
          className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-lg text-sm font-medium
                     bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors"
        >
          <User size={15} />
          View typing stats
        </Link>
        <Link
          href="/auth/sign-out"
          className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-lg text-sm font-medium
                     bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </Link>
      </div>
    </section>
  );
}
