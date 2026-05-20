'use client';

import { motion } from 'framer-motion';
import { Ghost } from 'lucide-react';

interface GhostRacerProps {
  /** 0–1: how far the ghost has progressed through the text */
  progress: number;
  /** 0–1: how far the user has progressed */
  userProgress: number;
  enabled: boolean;
}

export default function GhostRacer({
  progress,
  userProgress,
  enabled,
}: GhostRacerProps) {
  if (!enabled || progress === 0) return null;

  const diff = userProgress - progress; // +ve = user ahead, -ve = behind

  return (
    <div className="relative w-full h-6 mb-2 select-none" aria-hidden="true">
      {/* Track */}
      <div className="absolute inset-y-0 inset-x-0 flex items-center">
        <div className="w-full h-[2px] bg-white/10 rounded-full" />
      </div>

      {/* Ghost position */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1"
        style={{ left: `${Math.min(99, progress * 100)}%` }}
        animate={{ left: `${Math.min(99, progress * 100)}%` }}
        transition={{ type: 'tween', duration: 0.8, ease: 'linear' }}
      >
        <Ghost className="w-4 h-4 text-indigo-400/70" />
      </motion.div>

      {/* User position */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: `${Math.min(99, userProgress * 100)}%` }}
        animate={{ left: `${Math.min(99, userProgress * 100)}%` }}
        transition={{ type: 'tween', duration: 0.12, ease: 'easeOut' }}
      >
        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_2px_rgba(251,191,36,0.5)]" />
      </motion.div>

      {/* Delta label */}
      <div
        className={`absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold ${
          diff >= 0 ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        {diff >= 0 ? '+' : ''}
        {Math.round(diff * 100)}%
      </div>
    </div>
  );
}
