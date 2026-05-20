/**
 * Admin layout — server component.
 * Checks session + ADMIN_EMAILS allow-list before rendering anything.
 */
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminSidebar, AdminTopBar } from './AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/sign-in?callbackUrl=/admin/dashboard');
  }

  const allowed = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (allowed.length > 0 && !allowed.includes(session.user.email.toLowerCase())) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-[hsl(var(--bg))]">
      <AdminSidebar adminEmail={session.user.email} />
      <main className="flex-1 flex flex-col min-w-0">
        <AdminTopBar />
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
