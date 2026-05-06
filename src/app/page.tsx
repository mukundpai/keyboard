import type { Metadata } from 'next';
import { Activity, Flame, Swords, Zap } from 'lucide-react';
import { TypingEngine } from '@/components/typing/TypingEngine';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'KeyMaster Pro — Elite Typing Test',
};

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100dvh-11rem)] px-4 py-10">
      {/* Hero caption */}
      <div className="text-center mb-8 animate-slide-up">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-muted px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-accent-light">
          <Flame size={13} />
          Coffee House Edition
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mb-2 font-display">
          Type <span className="text-gradient">faster</span>.{' '}
          Race <span className="text-gradient">smarter</span>.
        </h1>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          The premium typing test with detailed analytics, perfect form feedback,
          and a satisfying caret that moves like butter.
        </p>
      </div>

      <div className="mb-8 grid w-full max-w-5xl gap-3 md:grid-cols-3">
        <FeatureCard
          icon={<Activity size={16} />}
          eyebrow="Telemetry"
          title="Live metrics with less clutter"
          body="Switch between focused and data-rich runs without leaving the main surface."
        />
        <FeatureCard
          icon={<Flame size={16} />}
          eyebrow="Feel"
          title="A warmer, more intentional atmosphere"
          body="Espresso blacks, amber highlights, noise texture, and stronger card hierarchy."
        />
        <FeatureCard
          icon={<Swords size={16} />}
          eyebrow="Next Up"
          title="Arena-ready rhythm"
          body="The home surface now feels like the lobby for a competitive typing game, not a bare test page."
        />
      </div>

      {/* Challenge invitation CTA */}
      <div className="mb-10 w-full max-w-5xl">
        <div className="glass-card p-6 sm:p-8 space-y-4 border-2 border-accent/40">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-accent" />
                <h3 className="text-lg font-semibold text-text-primary font-serif">
                  Challenge a Friend
                </h3>
              </div>
              <p className="text-sm text-text-secondary max-w-sm">
                Create record-based typing challenges. Share a link with friends. They submit their best WPM and accuracy. Compare scores.
              </p>
            </div>
            <Link
              href="/challenge"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent-dark transition-colors whitespace-nowrap text-sm"
            >
              <Zap size={14} />
              Start Challenge
            </Link>
          </div>
        </div>
      </div>

      {/* Core typing component */}
      <TypingEngine />
    </section>
  );
}

function FeatureCard({
  icon,
  eyebrow,
  title,
  body,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="glass-card p-4 sm:p-5 animate-slide-up">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-accent-muted text-accent-light">
        {icon}
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-text-muted">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-base font-semibold text-text-primary">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-text-secondary">{body}</p>
    </div>
  );
}
