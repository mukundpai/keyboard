'use client';

import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Search, ChevronUp, ChevronDown, Users } from 'lucide-react';
import type { UserStats } from '@/types/analytics';

type SortKey = 'bestWpm' | 'averageWpm' | 'averageAccuracy' | 'totalSessions' | 'totalTypingTime' | 'lastLoginAt';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'bestWpm',         label: 'Best WPM'   },
  { key: 'averageWpm',      label: 'Avg WPM'    },
  { key: 'averageAccuracy', label: 'Accuracy'   },
  { key: 'totalSessions',   label: 'Sessions'   },
  { key: 'totalTypingTime', label: 'Time Typed' },
  { key: 'lastLoginAt',     label: 'Last Active'},
];

function SortIcon({ col, sortBy, asc }: { col: string; sortBy: string; asc: boolean }) {
  if (col !== sortBy) return <span className="opacity-20">↕</span>;
  return asc ? <ChevronUp className="h-3 w-3 inline-block ml-0.5" /> : <ChevronDown className="h-3 w-3 inline-block ml-0.5" />;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserStats[]>([]);
  const [total, setTotal]  = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [sortBy, setSortBy]   = useState<SortKey>('bestWpm');
  const [asc, setAsc]         = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy,
        order:  asc ? 'asc' : 'desc',
        search,
        limit:  '200',
      });
      const res = await fetch(`/api/analytics/users?${params}`);
      const data = await res.json();
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [sortBy, asc, search]);

  useEffect(() => { load(); }, [load]);

  function toggleSort(col: SortKey) {
    if (sortBy === col) setAsc(a => !a);
    else { setSortBy(col); setAsc(false); }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[hsl(var(--accent))]" />
          <h1 className="text-2xl font-bold text-[hsl(var(--text-primary))]">Users</h1>
          <span className="ml-1 text-sm text-[hsl(var(--text-muted))]">({total})</span>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[hsl(var(--text-muted))]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search username…"
          className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none focus:border-[hsl(var(--accent))]"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface-raised))]/50">
                <th className="py-3 px-4 text-left text-xs font-medium text-[hsl(var(--text-muted))] uppercase tracking-wide w-10">#</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-[hsl(var(--text-muted))] uppercase tracking-wide">User</th>
                {COLUMNS.map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                    className="py-3 px-4 text-right text-xs font-medium text-[hsl(var(--text-muted))] uppercase tracking-wide cursor-pointer select-none hover:text-[hsl(var(--text-primary))] transition-colors"
                  >
                    {label} <SortIcon col={key} sortBy={sortBy} asc={asc} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]/50">
              {loading && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[hsl(var(--text-muted))]">
                    <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[hsl(var(--text-muted))] text-sm">
                    No users found.
                  </td>
                </tr>
              )}
              {!loading && users.map((u, i) => (
                <tr key={u.userId} className="hover:bg-[hsl(var(--surface-raised))]/40 transition-colors">
                  <td className="py-3 px-4 text-[hsl(var(--text-muted))] text-xs">{i + 1}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-[hsl(var(--text-primary))]">{u.username}</div>
                    <div className="text-[10px] text-[hsl(var(--text-muted))] font-mono mt-0.5">{u.userId}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[hsl(var(--accent))] tabular-nums">{u.bestWpm}</td>
                  <td className="py-3 px-4 text-right text-[hsl(var(--text-secondary))] tabular-nums">{u.averageWpm}</td>
                  <td className="py-3 px-4 text-right text-[hsl(var(--text-secondary))] tabular-nums">
                    <span className={u.averageAccuracy >= 95 ? 'text-emerald-500 font-medium' : u.averageAccuracy >= 85 ? '' : 'text-rose-500'}>
                      {u.averageAccuracy.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-[hsl(var(--text-secondary))] tabular-nums">{u.totalSessions}</td>
                  <td className="py-3 px-4 text-right text-[hsl(var(--text-secondary))] tabular-nums">
                    {u.totalTypingTime >= 3600
                      ? `${(u.totalTypingTime / 3600).toFixed(1)}h`
                      : `${Math.round(u.totalTypingTime / 60)}m`}
                  </td>
                  <td className="py-3 px-4 text-right text-[hsl(var(--text-muted))] text-xs whitespace-nowrap">
                    {new Date(u.lastLoginAt).toLocaleDateString()} {new Date(u.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
