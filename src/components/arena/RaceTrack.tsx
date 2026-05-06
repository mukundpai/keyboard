'use client';

import { motion } from 'framer-motion';
import { Crown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArenaPlayer } from '@/types/arena';

interface RaceTrackProps {
  players: ArenaPlayer[];
  localPlayerId: string | null;
}

export function RaceTrack({ players, localPlayerId }: RaceTrackProps) {
  const sorted = [...players].sort((a, b) => b.progress - a.progress);

  return (
    <div className="glass-card p-5 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
        Race
      </h3>

      <div className="space-y-3">
        {sorted.map((player, rank) => {
          const isLocal = player.id === localPlayerId;

          return (
            <motion.div
              key={player.id}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className={cn(
                'space-y-1.5 rounded-xl p-3 border transition-colors',
                isLocal
                  ? 'bg-accent-muted border-accent/25'
                  : 'bg-surface/40 border-border-active/20',
              )}
            >
              {/* Player row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {rank === 0 && (
                    <Crown size={13} className="text-warning shrink-0" />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isLocal ? 'text-accent-light' : 'text-text-secondary',
                    )}
                  >
                    {player.username}
                    {isLocal && (
                      <span className="ml-1.5 text-xs text-text-muted">(you)</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs tabular font-mono">
                  <span className="flex items-center gap-1 text-text-muted">
                    <Zap size={11} />
                    {player.wpm} wpm
                  </span>
                  {player.isFinished && (
                    <span className="text-success font-semibold">
                      #{player.rank ?? rank + 1}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="progress-track">
                <motion.div
                  className="progress-fill"
                  animate={{ width: `${player.progress}%` }}
                  transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                />
              </div>

              {/* Percentage label */}
              <div className="text-right text-[10px] text-text-muted tabular">
                {Math.round(player.progress)}%
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
