import type { Metadata } from 'next';
import { Activity, Flame, Swords, Zap } from 'lucide-react';
import { TypingEngine } from '@/components/typing/TypingEngine';
import { HomeBackground } from '@/components/HomeBackground';
import { TiltCard } from '@/components/ui/TiltCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'KeyMaster Pro — Elite Typing Test',
};

export default function HomePage() {
  return (
    <>
      <HomeBackground />
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-11rem)] px-4 py-10">
      {/* Hero caption */}
      <div className="text-center mb-8 animate-slide-up">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/50 px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-accent-light shadow-glow-sm">
          <Flame size={13} />
          Stealth Obsidian
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

      <div className="mb-8 grid w-full max-w-5xl gap-4 md:grid-cols-3 perspective-1000">
        <FeatureCard
          icon={<Activity size={16} />}
          eyebrow="Telemetry"
          title="Live metrics with less clutter"
          body="Switch between focused and data-rich runs without leaving the main surface."
        />
        <FeatureCard
          icon={<Flame size={16} />}
          eyebrow="Feel"
          title="A colder, stealthier atmosphere"
          body="Deep blacks, metallic grays, glassmorphism, and magnetic interactions."
        />
        <FeatureCard
          icon={<Swords size={16} />}
          eyebrow="Next Up"
          title="Arena-ready rhythm"
          body="The home surface now feels like the lobby for a competitive typing game, not a bare test page."
        />
      </div>

      {/* Challenge invitation CTA */}
      <div className="mb-10 w-full max-w-5xl perspective-1000">
        <TiltCard className="p-6 sm:p-8 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-accent-light" />
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors whitespace-nowrap text-sm border border-white/5"
            >
              <Zap size={14} />
              Start Challenge
            </Link>
          </div>
        </TiltCard>
      </div>

      {/* Core typing component */}
      <TypingEngine />
    </section>
    </>
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
    <TiltCard className="p-5 sm:p-6 h-full flex flex-col">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent-light shadow-glow-sm">
        {icon}
      </div>
      <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-text-muted">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-base font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary flex-grow">{body}</p>
    </TiltCard>
  );
}
