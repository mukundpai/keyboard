'use client';

import { motion } from 'framer-motion';
import { formatTime } from '@/lib/utils';

interface StatsBarProps {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  timeLeft: number | null;
  timeElapsed: number;
  showLiveWpm: boolean;
  mode: string;
}

export function StatsBar({
  wpm,
  rawWpm,
  accuracy,
  errors,
  timeLeft,
  timeElapsed,
  showLiveWpm,
  mode,
}: StatsBarProps) {
  return (
    <div className="flex items-center justify-between text-sm font-mono tabular">
      {/* Left — live WPM */}
      {showLiveWpm && (
        <motion.div
          className="flex items-baseline gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-2xl font-semibold text-accent-light">{wpm}</span>
          <span className="text-xs text-text-muted">wpm</span>
        </motion.div>
      )}

      {/* Center — timer or elapsed */}
      <div className="flex items-baseline gap-1 mx-auto">
        {mode === 'time' && timeLeft !== null ? (
          <>
            <span
              className={`text-3xl font-semibold transition-colors duration-300 ${
                timeLeft <= 10 ? 'text-danger' : 'text-text-primary'
              }`}
            >
              {timeLeft}
            </span>
            <span className="text-xs text-text-muted">s</span>
          </>
        ) : mode !== 'zen' ? (
          <span className="text-xl font-medium text-text-secondary">
            {formatTime(timeElapsed)}
          </span>
        ) : (
          <span className="text-xl font-medium text-text-secondary">
            {formatTime(timeElapsed)}
          </span>
        )}
      </div>

      {/* Right — accuracy + errors */}
      <div className="flex items-center gap-4">
        <div className="flex items-baseline gap-1">
          <span className="text-base font-semibold text-correct">{accuracy}</span>
          <span className="text-xs text-text-muted">%</span>
        </div>
        {errors > 0 && (
          <div className="flex items-baseline gap-1">
            <span className="text-base font-semibold text-wrong">{errors}</span>
            <span className="text-xs text-text-muted">err</span>
          </div>
        )}
      </div>
    </div>
  );
}
