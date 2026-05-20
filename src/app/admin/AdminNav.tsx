'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, ChevronRight, Shield } from 'lucide-react';

const NAV = [
  { href: '/admin/dashboard', label: 'Overview',  icon: LayoutDashboard },
  { href: '/admin/users',     label: 'Users',      icon: Users           },
  { href: '/admin/events',    label: 'Event Log',  icon: Activity        },
];

export function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-[hsl(var(--border))] bg-[hsl(var(--surface))] flex flex-col">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-[hsl(var(--border))]">
        <Shield className="h-5 w-5 text-[hsl(var(--accent))]" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-[hsl(var(--text-primary))] uppercase tracking-wider">Admin</p>
          <p className="text-[10px] text-[hsl(var(--text-muted))] truncate">{adminEmail}</p>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                active
                  ? 'bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/20'
                  : 'text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--surface-raised))] hover:text-[hsl(var(--text-primary))]',
              ].join(' ')}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-3 w-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-[hsl(var(--border))]">
        <Link
          href="/"
          className="text-xs text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-primary))] transition-colors"
        >
          ← Back to app
        </Link>
      </div>
    </aside>
  );
}

export function AdminTopBar() {
  const pathname = usePathname();
  const current = NAV.find(({ href }) => pathname === href || pathname.startsWith(href + '/'));

  return (
    <header className="h-12 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]/80 backdrop-blur flex items-center px-6 gap-2 shrink-0">
      {current && (
        <span className="text-sm font-semibold text-[hsl(var(--text-primary))]">{current.label}</span>
      )}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-[hsl(var(--text-muted))]">Live data · auto-refresh 30s</span>
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      </div>
    </header>
  );
}
