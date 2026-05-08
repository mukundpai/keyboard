'use client';

import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Search, Activity, Filter } from 'lucide-react';
import type { AnalyticsEvent, EventType } from '@/types/analytics';

const EVENT_COLORS: Record<string, string> = {
  user_login:   'bg-sky-500/15 text-sky-600 border-sky-500/20',
  session_start:'bg-emerald-500/15 text-emerald-600 border-emerald-500/20',
  session_end:  'bg-violet-500/15 text-violet-600 border-violet-500/20',
  error:        'bg-rose-500/15 text-rose-600 border-rose-500/20',
};

const EVENT_TYPES: EventType[] = ['user_login', 'session_start', 'session_end'];

function Badge({ type }: { type: string }) {
  const cls = EVENT_COLORS[type] ?? 'bg-[hsl(var(--surface-raised))]/60 text-[hsl(var(--text-muted))] border-[hsl(var(--border))]';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${cls}`}>
      {type.replace('_', ' ')}
    </span>
  );
}

export default function AdminEventsPage() {
  const [events, setEvents]   = useState<AnalyticsEvent[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | ''>('');
  const [limit, setLimit]     = useState(100);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit) });
      if (typeFilter) params.set('type', typeFilter);
      const res  = await fetch(`/api/analytics/events?${params}`);
      const data = await res.json();
      setEvents(data.events ?? []);
      setTotal(data.total  ?? 0);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, limit]);

  useEffect(() => { load(); }, [load]);

  const visible = search
    ? events.filter(e => e.username.toLowerCase().includes(search.toLowerCase()) || e.userId.includes(search))
    : events;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[hsl(var(--accent))]" />
          <h1 className="text-2xl font-bold text-[hsl(var(--text-primary))]">Event Log</h1>
          <span className="ml-1 text-sm text-[hsl(var(--text-muted))]">({total} total, showing {visible.length})</span>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[hsl(var(--text-muted))]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search user…"
            className="pl-8 pr-3 py-2 text-sm rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none focus:border-[hsl(var(--accent))] w-48"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-[hsl(var(--text-muted))]" />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as EventType | '')}
            className="text-sm rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] px-2 py-2 focus:outline-none focus:border-[hsl(var(--accent))]"
          >
            <option value="">All types</option>
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <select
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
          className="text-sm rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] px-2 py-2 focus:outline-none focus:border-[hsl(var(--accent))]"
        >
          {[50, 100, 250, 500].map(n => <option key={n} value={n}>Last {n}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface-raised))]/50">
                {['Time', 'Event', 'User', 'Session', 'Metadata'].map(h => (
                  <th key={h} className={`py-3 px-4 text-xs font-medium text-[hsl(var(--text-muted))] uppercase tracking-wide ${h === 'Metadata' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]/50">
              {loading && (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <RefreshCw className="h-4 w-4 animate-spin mx-auto text-[hsl(var(--text-muted))]" />
                  </td>
                </tr>
              )}
              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[hsl(var(--text-muted))] text-sm">
                    No events found.
                  </td>
                </tr>
              )}
              {!loading && visible.map(e => {
                const meta = e.metadata;
                const hasMeta = Object.keys(meta).length > 0;
                return (
                  <tr key={e.id} className="hover:bg-[hsl(var(--surface-raised))]/40 transition-colors">
                    <td className="py-2.5 px-4 text-[hsl(var(--text-muted))] text-xs whitespace-nowrap font-mono">
                      {new Date(e.timestamp).toLocaleDateString()} {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-4">
                      <Badge type={e.eventType} />
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-[hsl(var(--text-primary))]">{e.username}</div>
                      <div className="text-[10px] text-[hsl(var(--text-muted))] font-mono">{e.userId}</div>
                    </td>
                    <td className="py-2.5 px-4 text-[10px] text-[hsl(var(--text-muted))] font-mono truncate max-w-[120px]">{e.sessionId}</td>
                    <td className="py-2.5 px-4 text-right text-xs text-[hsl(var(--text-secondary))]">
                      {hasMeta ? (
                        <span className="font-mono text-[10px]">
                          {meta.wpm != null && <span className="mr-2"><b>{meta.wpm}</b> wpm</span>}
                          {meta.accuracy != null && <span className="mr-2"><b>{meta.accuracy}</b>%</span>}
                          {meta.duration != null && <span className="mr-2"><b>{meta.duration}</b>s</span>}
                          {meta.mode != null && <span className="capitalize text-[hsl(var(--text-muted))]">{meta.mode}</span>}
                        </span>
                      ) : (
                        <span className="text-[hsl(var(--text-muted))]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
