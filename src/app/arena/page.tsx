import type { Metadata } from 'next';
import { Swords, Users, Trophy, Zap } from 'lucide-react';
import { LobbyRoom } from '@/components/arena/LobbyRoom';
import { ArenaHero } from './ArenaHero';

export const metadata: Metadata = { title: 'Arena — Race Friends' };

const FEATURES = [
  {
    icon: Zap,
    eyebrow: 'Instant',
    title: 'One-click lobby',
    body: 'Create a room and get a shareable link in seconds. No account required for guests.',
  },
  {
    icon: Users,
    eyebrow: 'Multiplayer',
    title: 'Up to 5 players',
    body: 'Race side-by-side with friends in real-time. Watch every keystroke live.',
  },
  {
    icon: Trophy,
    eyebrow: 'Ranked',
    title: 'First to finish wins',
    body: 'Accuracy matters. Blow through the text the fastest with the fewest errors.',
  },
];

export default function ArenaPage() {
  return (
    <section className="relative min-h-[calc(100dvh-11rem)] overflow-hidden px-4 py-10 sm:px-6">
      <ArenaHero />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-10">
        {/* ── Header ── */}
        <div className="text-center animate-slide-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-active/30 bg-surface/50 px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-accent-light shadow-glow-sm">
            <Swords size={13} />
            Live Multiplayer
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mb-3 font-display">
            Typing <span className="text-gradient">Arena</span>
          </h1>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Create a lobby, share the link, and race your friends in real-time.
          </p>
        </div>

        {/* ── Feature cards ── */}
        <div className="grid w-full gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, eyebrow, title, body }) => (
            <div key={title} className="glass-card p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Icon size={15} className="text-accent-light" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-muted">
                  {eyebrow}
                </span>
              </div>
              <p className="text-sm font-semibold text-text-primary">{title}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* ── Lobby card (create flow — no roomId prop) ── */}
        <div className="w-full max-w-md">
          <LobbyRoom />
        </div>
      </div>
    </section>
  );
}

