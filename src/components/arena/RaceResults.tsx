'use client';

import { motion } from 'framer-motion';
import { Crown, Medal, Trophy, Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { ArenaPlayer } from '@/types/arena';

interface RaceResultsProps {
  players: ArenaPlayer[];
  localPlayerId: string | null;
  onPlayAgain?: () => void;
}

const RANK_ICONS = [
  <Crown key={1} size={18} className="text-yellow-400" />,
  <Medal key={2} size={16} className="text-slate-400" />,
  <Medal key={3} size={16} className="text-amber-600" />,
];

const RANK_LABELS = ['1st', '2nd', '3rd', '4th', '5th'];

const RANK_STYLES = [
  'bg-yellow-400/10 border-yellow-400/30',
  'bg-slate-400/10 border-slate-400/20',
  'bg-amber-600/10 border-amber-600/20',
  'bg-surface-raised border-border-active/20',
  'bg-surface-raised border-border-active/20',
];

export function RaceResults({ players, localPlayerId, onPlayAgain }: RaceResultsProps) {
  const sorted = [...players].sort((a, b) => {
    // Finished players sorted by rank, unfinished sorted by progress
    if (a.isFinished && b.isFinished) return (a.rank ?? 99) - (b.rank ?? 99);
    if (a.isFinished) return -1;
    if (b.isFinished) return 1;
    return b.progress - a.progress;
  });

  const localPlayer = players.find((p) => p.id === localPlayerId);
  const localRank = localPlayer?.rank;

  const podiumMessage =
    localRank === 1 ? '🏆 You won!' :
    localRank === 2 ? '🥈 Second place!' :
    localRank === 3 ? '🥉 Third place!' :
    localPlayer?.isFinished ? `Finished #${localRank}` :
    'Race finished';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-6"
    >
      {/* ── Header ── */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Trophy size={20} className="text-warning" />
          <h2 className="text-xl font-bold text-text-primary font-display">Results</h2>
        </div>
        {localPlayer && (
          <p className="text-sm text-text-secondary">{podiumMessage}</p>
        )}
      </div>

      {/* ── Podium rows ── */}
      <div className="space-y-2.5">
        {sorted.map((player, idx) => {
          const isLocal = player.id === localPlayerId;
          const styleIdx = Math.min(idx, RANK_STYLES.length - 1);

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07 }}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl border',
                RANK_STYLES[styleIdx],
                isLocal && 'ring-1 ring-accent/30',
              )}
            >
              {/* Rank */}
              <div className="w-8 flex items-center justify-center shrink-0">
                {RANK_ICONS[idx] ?? (
                  <span className="text-xs font-bold text-text-muted">{RANK_LABELS[idx] ?? `${idx + 1}`}</span>
                )}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-semibold truncate',
                  isLocal ? 'text-text-primary' : 'text-text-secondary',
                )}>
                  {player.username}
                  {isLocal && <span className="ml-1.5 text-xs font-normal text-text-muted">(you)</span>}
                </p>
                {!player.isFinished && (
                  <p className="text-xs text-text-muted">{Math.round(player.progress)}% completed</p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs tabular-nums font-mono shrink-0">
                <div className="flex items-center gap-1 text-text-secondary">
                  <Zap size={11} className="text-accent-light" />
                  <span className="font-semibold text-text-primary">{player.wpm}</span>
                  <span className="text-text-muted">wpm</span>
                </div>
                <div className="text-text-muted hidden sm:block">
                  {player.accuracy.toFixed(1)}%
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Play again ── */}
      {onPlayAgain && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            size="md"
            className="w-full"
            icon={<RotateCcw size={14} />}
            onClick={onPlayAgain}
          >
            Play Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
