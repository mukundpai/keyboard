import type { Metadata } from 'next';
import { Trophy } from 'lucide-react';
import { AdSlot } from '@/components/ui/AdSlot';
import type { LeaderboardEntry } from '@/app/api/leaderboard/route';

export const metadata: Metadata = { title: 'Leaderboard' };
export const dynamic = 'force-dynamic';

const rankMedal: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/leaderboard`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function LeaderboardPage() {
  const entries = await getLeaderboard();

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
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
          {entries.length === 0 ? (
            <p className="px-4 py-8 text-center text-text-muted text-sm">
              No results yet — be the first on the board!
            </p>
          ) : (
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
                {entries.map((entry) => (
                  <tr
                    key={entry.userId}
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
          )}
        </div>

        {/* ── Sidebar ad slot ── */}
        <aside className="hidden lg:flex flex-col gap-4 shrink-0">
          <AdSlot variant="sidebar" slotId="lb-sidebar" />
        </aside>

      </div>
    </section>
  );
}

