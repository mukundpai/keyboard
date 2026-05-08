'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Users, Activity, TrendingUp, Clock, Target, Zap, RefreshCw } from 'lucide-react';
import type { AnalyticsDashboard } from '@/types/analytics';

const CHART_COLORS = ['#8B6F47', '#C4A57B', '#6B5535', '#D4A574', '#A0785A'];

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 },
};

function MetricCard({
  label, value, sub, icon: Icon, color = 'text-[hsl(var(--accent))]', delay = 0,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color?: string; delay?: number;
}) {
  return (
    <motion.div
      variants={CARD_VARIANTS}
      transition={{ delay }}
      className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-5 flex items-start justify-between gap-4"
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-[hsl(var(--text-muted))] uppercase tracking-wider">{label}</p>
        <p className="mt-1 text-3xl font-bold text-[hsl(var(--text-primary))] tabular-nums">{value}</p>
        {sub && <p className="mt-1 text-xs text-[hsl(var(--text-secondary))]">{sub}</p>}
      </div>
      <Icon className={`h-7 w-7 shrink-0 ${color}`} />
    </motion.div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-5">
      <h3 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-4">{title}</h3>
      {children}
    </div>
  );
}

const TOOLTIP_STYLE = {
  backgroundColor: 'hsl(var(--surface-raised))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  color: 'hsl(var(--text-primary))',
  fontSize: 12,
};

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/stats');
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      setMetrics(data);
      setLastRefresh(new Date());
    } catch {
      // keep previous data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <RefreshCw className="h-6 w-6 animate-spin text-[hsl(var(--accent))]" />
      </div>
    );
  }
  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-80 text-[hsl(var(--text-secondary))]">
        Failed to load analytics.
      </div>
    );
  }

  const totalTypingMin = Math.round(metrics.totalSessions * metrics.averageSessionDuration / 60);

  return (
    <motion.div
      initial="hidden" animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--text-primary))]">Overview</h1>
          <p className="text-sm text-[hsl(var(--text-muted))] mt-0.5">
            {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString()}` : ''}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors"
        >
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricCard label="Total Users"    value={metrics.totalUsers}            sub={`${metrics.uniqueUsersThisMonth} this month`} icon={Users}      color="text-[hsl(var(--accent))]"  delay={0}    />
        <MetricCard label="Active Today"   value={metrics.uniqueUsersToday}      sub={`${metrics.sessionsToday} sessions`}           icon={Activity}   color="text-emerald-500"           delay={0.04} />
        <MetricCard label="This Week"      value={metrics.uniqueUsersThisWeek}   sub="unique users"                                   icon={TrendingUp} color="text-sky-500"               delay={0.08} />
        <MetricCard label="Total Sessions" value={metrics.totalSessions}         sub={`${totalTypingMin} min typed`}                  icon={Clock}      color="text-violet-500"            delay={0.12} />
        <MetricCard label="Avg WPM"        value={metrics.averageWpm}            sub={`${metrics.averageAccuracy}% accuracy`}         icon={Zap}        color="text-amber-500"             delay={0.16} />
        <MetricCard label="Avg Session"    value={`${metrics.averageSessionDuration}s`} sub="per typing run"                         icon={Target}     color="text-rose-500"              delay={0.20} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Daily Logins — last 7 days">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={metrics.loginTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--text-muted))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--text-muted))' }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="logins" stroke="hsl(var(--accent))" strokeWidth={2.5}
                dot={{ fill: 'hsl(var(--accent))', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily Sessions — last 7 days">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={metrics.sessionTrend} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--text-muted))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--text-muted))' }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="sessions" fill="hsl(var(--accent-light))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {metrics.modeDistribution.length > 0 && (
          <ChartCard title="Typing Mode Distribution">
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={metrics.modeDistribution} dataKey="count" nameKey="mode"
                    cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {metrics.modeDistribution.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="space-y-2 text-xs">
                {metrics.modeDistribution.map((d, i) => (
                  <li key={d.mode} className="flex items-center gap-2 capitalize">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-[hsl(var(--text-secondary))]">{d.mode}</span>
                    <span className="ml-auto font-semibold text-[hsl(var(--text-primary))]">{d.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ChartCard>
        )}

        {metrics.topUsers.length > 0 && (
          <ChartCard title="Top Performers">
            <ul className="space-y-2">
              {metrics.topUsers.slice(0, 5).map((u, i) => (
                <li key={u.userId} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-center text-xs font-bold text-[hsl(var(--text-muted))]">#{i + 1}</span>
                  <span className="flex-1 font-medium text-[hsl(var(--text-primary))] truncate">{u.username}</span>
                  <span className="font-semibold text-[hsl(var(--accent))] tabular-nums">{u.bestWpm} <span className="text-[10px] text-[hsl(var(--text-muted))] font-normal">wpm</span></span>
                  <span className="text-xs text-[hsl(var(--text-secondary))] tabular-nums w-12 text-right">{u.bestAccuracy.toFixed(0)}%</span>
                </li>
              ))}
            </ul>
          </ChartCard>
        )}
      </div>

      {metrics.topUsers.length > 0 && (
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] overflow-hidden">
          <div className="px-5 py-4 border-b border-[hsl(var(--border))]">
            <h3 className="text-sm font-semibold text-[hsl(var(--text-primary))]">All Tracked Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface-raised))]/50">
                  {['#','User','Best WPM','Avg WPM','Accuracy','Sessions','Typing Time','Last Active'].map(h => (
                    <th key={h} className={`py-2.5 px-4 text-xs font-medium text-[hsl(var(--text-muted))] uppercase tracking-wide ${h === '#' || h === 'User' ? 'text-left' : 'text-right'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))]/50">
                {metrics.topUsers.map((u, i) => (
                  <tr key={u.userId} className="hover:bg-[hsl(var(--surface-raised))]/40 transition-colors">
                    <td className="py-3 px-4 text-[hsl(var(--text-muted))] text-xs">#{i + 1}</td>
                    <td className="py-3 px-4 font-medium text-[hsl(var(--text-primary))]">{u.username}</td>
                    <td className="py-3 px-4 text-right font-bold text-[hsl(var(--accent))] tabular-nums">{u.bestWpm}</td>
                    <td className="py-3 px-4 text-right text-[hsl(var(--text-secondary))] tabular-nums">{u.averageWpm}</td>
                    <td className="py-3 px-4 text-right text-[hsl(var(--text-secondary))] tabular-nums">{u.averageAccuracy.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right text-[hsl(var(--text-secondary))] tabular-nums">{u.totalSessions}</td>
                    <td className="py-3 px-4 text-right text-[hsl(var(--text-secondary))] tabular-nums">{Math.round(u.totalTypingTime / 60)}m</td>
                    <td className="py-3 px-4 text-right text-[hsl(var(--text-muted))] text-xs">{new Date(u.lastLoginAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
