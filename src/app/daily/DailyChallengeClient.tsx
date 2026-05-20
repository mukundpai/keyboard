'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Trophy, CheckCircle2, RotateCcw } from 'lucide-react';
import { getDailyQuote } from '@/data/quotes';
import { useStatsStore } from '@/store/statsStore';
import { DrillEngine } from '@/components/typing/DrillEngine';
import type { DrillDef } from '@/data/drills';

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function DailyChallengeClient() {
  const quote = useMemo(() => getDailyQuote(), []);
  const lastDate = useStatsStore((s) => s.lastDailyChallengeDate ?? '');
  const recordDailyChallenge = useStatsStore((s) => s.recordDailyChallenge);

  const alreadyDone = lastDate === todayKey();
  const [showRetry, setShowRetry] = useState(false);

  const dailyDrill: DrillDef = useMemo(() => ({
    id: `daily-${todayKey()}`,
    title: 'Daily Challenge',
    description: `Quote by ${quote.author}`,
    category: 'task',
    group: 'endurance',
    difficulty: 'intermediate',
    content: quote.text,
  }), [quote]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      {/* Hero */}
      <div className="glass-card p-6 space-y-2 animate-slide-up">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            Daily Challenge
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary leading-tight">
          Today&apos;s Quote
        </h1>
        <blockquote className="text-sm text-muted italic border-l-2 border-indigo-500/30 pl-3 leading-relaxed">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <p className="text-xs text-muted">— {quote.author}</p>
        <p className="text-xs text-muted pt-1">
          {alreadyDone
            ? 'You already completed today\'s challenge. Come back tomorrow!'
            : 'One attempt per day. Type this quote as fast and accurately as you can.'}
        </p>
      </div>

      {/* Already done banner */}
      <AnimatePresence>
        {alreadyDone && !showRetry && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="glass-card p-5 flex items-center gap-4"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-text-primary">Challenge completed!</p>
              <p className="text-xs text-muted mt-0.5">
                You already submitted today&apos;s attempt. Great job!
              </p>
            </div>
            <button
              onClick={() => setShowRetry(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Practice anyway
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typing engine */}
      {(!alreadyDone || showRetry) && (
        <div className="glass-card p-4 rounded-2xl">
          <DrillEngine drill={dailyDrill} />
        </div>
      )}

    </section>
  );
}
