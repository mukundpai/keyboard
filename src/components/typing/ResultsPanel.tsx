'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { RotateCcw, Share2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ChallengeInvite } from '@/components/challenge/ChallengeInvite';
import { SpeedChart } from '@/components/charts/SpeedChart';
import type { TestResults } from '@/types/typing';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show:  { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 26 } },
};

interface ResultsPanelProps {
  results: TestResults;
  onRestart: () => void;
}

const STATS = (r: TestResults) => [
  { label: 'wpm',         value: r.wpm,           color: 'text-accent-light' },
  { label: 'raw',         value: r.rawWpm,         color: 'text-text-secondary' },
  { label: 'accuracy',    value: `${r.accuracy}%`, color: 'text-correct' },
  { label: 'consistency', value: `${r.consistency}%`, color: 'text-warning' },
  { label: 'time',        value: `${r.duration}s`, color: 'text-text-secondary' },
  { label: 'chars',
    value: `${r.correctChars}/${r.incorrectChars}`,
    color: 'text-text-secondary' },
];

export function ResultsPanel({ results, onRestart }: ResultsPanelProps) {
  const [showChallenge, setShowChallenge] = useState(false);

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full space-y-6"
      >
        {/* ── Stat grid ── */}
        <motion.div
          variants={item}
          className="grid grid-cols-3 sm:grid-cols-6 gap-3"
        >
          {STATS(results).map(({ label, value, color }) => (
            <div key={label} className="stat-pill">
              <span className={`stat-value ${color}`}>{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── WPM over time chart ── */}
        <motion.div variants={item}>
          <SpeedChart data={results.wpmHistory} />
        </motion.div>

        {/* ── Action buttons ── */}
        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            icon={<RotateCcw size={16} />}
            onClick={onRestart}
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            icon={<Zap size={16} />}
            onClick={() => setShowChallenge(true)}
          >
            Challenge Friend
          </Button>
          <Button
            variant="outline"
            size="lg"
            icon={<Share2 size={16} />}
            onClick={() => {
              const text = `I just typed ${results.wpm} WPM with ${results.accuracy}% accuracy on KeyMaster Pro! 🚀`;
              navigator.clipboard?.writeText(text).catch(() => {});
            }}
          >
            Share
          </Button>
        </motion.div>
      </motion.div>

      {/* Challenge invite modal */}
      <ChallengeInvite
        isOpen={showChallenge}
        onClose={() => setShowChallenge(false)}
      />
    </>
  );
}
