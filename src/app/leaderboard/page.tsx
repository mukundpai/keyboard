import type { Metadata } from 'next';
import { Trophy, TrendingUp } from 'lucide-react';
import { AdSlot } from '@/components/ui/AdSlot';

export const metadata: Metadata = { title: 'Leaderboard' };

/* Placeholder data — replace with real DB query */
const TOP_TYPISTS = [
  { rank: 1, username: 'SpeedDemon99', wpm: 224, accuracy: 98.4, level: 42 },
  { rank: 2, username: 'NightOwl',     wpm: 198, accuracy: 97.1, level: 38 },
  { rank: 3, username: 'Clarice_K',    wpm: 187, accuracy: 99.0, level: 35 },
  { rank: 4, username: 'ByteRacer',    wpm: 176, accuracy: 96.5, level: 31 },
  { rank: 5, username: 'TypeLord',     wpm: 169, accuracy: 97.8, level: 29 },
  { rank: 6, username: 'Azrael404',    wpm: 165, accuracy: 95.2, level: 27 },
  { rank: 7, username: 'SilentKeys',   wpm: 161, accuracy: 98.1, level: 25 },
  { rank: 8, username: 'Phantom_dev',  wpm: 155, accuracy: 96.8, level: 23 },
  { rank: 9, username: 'Inkbound',     wpm: 150, accuracy: 97.5, level: 21 },
  { rank: 10, username: 'ChronoType', wpm: 148, accuracy: 96.0, level: 20 },
];

const rankMedal: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center gap-3 mb-8 animate-slide-up">
        <Trophy className="text-warning" size={24} />
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Global Leaderboard</h1>
          <p className="text-sm text-text-secondary">Top typists this month</p>
        </div>
      </div>

      {/* ── Main content + sidebar ad layout ── */}
      <div className="flex gap-6 items-start">

        {/* Table */}
        <div className="flex-1 glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-active/30 text-left">
                {['#', 'Player', 'WPM', 'Accuracy', 'Level'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-widest
                               text-text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_TYPISTS.map((entry) => (
                <tr
                  key={entry.rank}
                  className="border-b border-border-active/10 hover:bg-surface-raised/50
                             transition-colors"
                >
                  <td className="px-4 py-3 font-mono tabular text-text-muted">
                    {rankMedal[entry.rank] ?? entry.rank}
                  </td>
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {entry.username}
                  </td>
                  <td className="px-4 py-3 font-mono tabular font-semibold text-accent-light">
                    {entry.wpm}
                  </td>
                  <td className="px-4 py-3 font-mono tabular text-correct">
                    {entry.accuracy}%
                  </td>
                  <td className="px-4 py-3">
                    <span className="level-badge">{entry.level}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Sidebar ad slot ── */}
        <aside className="hidden lg:flex flex-col gap-4 shrink-0">
          <AdSlot variant="sidebar" slotId="lb-sidebar" />
        </aside>

      </div>
    </section>
  );
}
