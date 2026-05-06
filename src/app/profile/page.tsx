import type { Metadata } from 'next';
import { User, Zap, Award, Clock } from 'lucide-react';
import { AdSlot } from '@/components/ui/AdSlot';

export const metadata: Metadata = { title: 'Profile' };

export default function ProfilePage() {
  /* In production, fetch real user data from your API / DB here */
  const mockStats = [
    { icon: Zap,   label: 'Best WPM',    value: '—' },
    { icon: Award, label: 'Avg Accuracy', value: '—' },
    { icon: Clock, label: 'Tests taken',  value: '0'  },
    { icon: User,  label: 'Level',        value: '1'  },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">

      {/* Profile header */}
      <div className="glass-card p-6 mb-6 flex items-center gap-5 animate-slide-up">
        <div className="w-16 h-16 rounded-2xl bg-accent-muted border border-accent/20
                        flex items-center justify-center shrink-0">
          <User size={28} className="text-accent-light" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Guest</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Sign in to track your stats and compete on the leaderboard.
          </p>
        </div>
      </div>

      {/* ── Main + sidebar layout ── */}
      <div className="flex gap-6 items-start">
        <div className="flex-1 space-y-6">

          {/* Stat grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mockStats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="stat-pill">
                <Icon size={14} className="text-text-muted mb-1" />
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>

          {/* Recent tests placeholder */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              Recent Tests
            </h2>
            <p className="text-sm text-text-muted text-center py-8">
              No tests recorded yet. Start typing to build your history!
            </p>
          </div>

          {/* Badges placeholder */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-text-secondary mb-4">
              Badges
            </h2>
            <p className="text-sm text-text-muted text-center py-8">
              Earn badges by reaching milestones.
            </p>
          </div>

        </div>

        {/* Sidebar ad slot */}
        <aside className="hidden lg:flex flex-col gap-4 shrink-0">
          <AdSlot variant="rectangle" slotId="profile-rect" />
        </aside>
      </div>

    </section>
  );
}
