'use client';

import { User, Zap, Award, Clock, TrendingUp, Keyboard, Trophy } from 'lucide-react';
import { AdSlot } from '@/components/ui/AdSlot';
import WpmHistoryChart from '@/components/charts/WpmHistoryChart';
import KeyHeatmap from '@/components/charts/KeyHeatmap';
import BadgeGrid from '@/components/profile/BadgeGrid';
import StreakCard from '@/components/profile/StreakCard';
import {
  useStatsStore,
  selectBestWpm,
  selectAvgWpm,
  selectAvgAccuracy,
} from '@/store/statsStore';

function formatDuration(s: number): string {
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function modeLabel(mode: string): string {
  const m: Record<string, string> = {
    time: 'Time', words: 'Words', code: 'Code',
    zen: 'Zen', quote: 'Quote', custom: 'Custom',
  };
  return m[mode] ?? mode;
}

export default function ProfileClient({ userName, userEmail }: { userName?: string | null; userEmail?: string | null }) {
  const history = useStatsStore((s) => s.history);
  const totalTests = history.length;
  const bestWpm = useStatsStore(selectBestWpm);
  const avgWpm = useStatsStore(selectAvgWpm);
  const avgAcc = useStatsStore(selectAvgAccuracy);
  const totalSeconds = history.reduce((s, h) => s + h.duration, 0);
  const recentTests = history.slice(0, 10);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">

      {/* Header */}
      <div className="glass-card p-6 mb-6 flex items-center gap-5 animate-slide-up">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20
                        flex items-center justify-center shrink-0">
          <User size={28} className="text-indigo-400" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-text-primary">{userName ?? 'Your Profile'}</h1>
          {userEmail && <p className="text-xs text-muted">{userEmail}</p>}
          <p className="text-sm text-muted mt-0.5">
            {totalTests > 0
              ? `${totalTests} test${totalTests !== 1 ? 's' : ''} completed · ${formatDuration(totalSeconds)} total practice`
              : 'Start typing to build your stats!'}
          </p>
        </div>
      </div>

      {/* Main + sidebar */}
      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0 space-y-6">

          {/* Stat grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Zap,        label: 'Best WPM',    value: bestWpm || '—' },
              { icon: TrendingUp, label: 'Avg WPM',     value: avgWpm || '—' },
              { icon: Award,      label: 'Avg Accuracy',value: avgAcc ? `${avgAcc}%` : '—' },
              { icon: Clock,      label: 'Tests Taken', value: totalTests },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="stat-pill">
                <Icon size={14} className="text-muted mb-1" />
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>

          {/* WPM history chart */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-text-primary">Speed Over Time</h2>
            </div>
            <WpmHistoryChart />
          </div>

          {/* Key heatmap */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-text-primary">Error Heatmap</h2>
              <span className="text-xs text-muted ml-auto">hover a key to see count</span>
            </div>
            <KeyHeatmap />
          </div>

          {/* Recent tests */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-text-primary">Recent Tests</h2>
            </div>
            {recentTests.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">
                No tests yet. Start typing to build your history!
              </p>
            ) : (
              <div className="space-y-2">
                {recentTests.map((h) => (
                  <div
                    key={h.timestamp}
                    className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2 text-xs"
                  >
                    <span className="text-muted w-20 shrink-0">
                      {new Date(h.timestamp).toLocaleDateString()}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 text-[10px]">
                      {modeLabel(h.mode)}
                    </span>
                    <span className="font-bold text-text-primary tabular-nums w-16 text-right">
                      {h.wpm} WPM
                    </span>
                    <span className="text-muted w-16 text-right tabular-nums">
                      {h.accuracy}% acc
                    </span>
                    <span className="text-muted w-12 text-right tabular-nums">
                      {formatDuration(h.duration)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-text-primary">Badges</h2>
            </div>
            <BadgeGrid />
          </div>

        </div>

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 w-64 shrink-0">
          <StreakCard />
          <AdSlot variant="rectangle" slotId="profile-rect" />
        </aside>
      </div>

    </section>
  );
}
