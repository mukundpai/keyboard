'use client';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { BADGE_DEFS, RARITY_COLORS, type BadgeDef } from '@/data/badges';
import { useStatsStore } from '@/store/statsStore';
import { cn } from '@/lib/utils';

function BadgeTile({
  badge,
  unlocked,
}: {
  badge: BadgeDef;
  unlocked: boolean;
}) {
  const rarityClass = RARITY_COLORS[badge.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'relative flex flex-col items-center gap-2 p-3 rounded-xl border text-center',
        unlocked
          ? 'glass-card border-white/10 hover:border-white/20 transition-colors'
          : 'bg-surface-raised/40 border-white/5 opacity-50 grayscale',
      )}
      title={badge.description}
    >
      {/* Rarity glow ring */}
      {unlocked && (
        <div
          className={cn(
            'absolute inset-0 rounded-xl opacity-10',
            rarityClass,
          )}
          style={{ background: 'currentColor' }}
        />
      )}

      <span className="text-2xl leading-none">{badge.icon}</span>

      <div className="space-y-0.5">
        <p
          className={cn(
            'text-xs font-semibold',
            unlocked ? rarityClass : 'text-muted',
          )}
        >
          {badge.name}
        </p>
        <p className="text-[10px] text-muted leading-tight">
          {badge.description}
        </p>
      </div>

      {!unlocked && (
        <Lock className="absolute top-2 right-2 w-3 h-3 text-muted" />
      )}
    </motion.div>
  );
}

export default function BadgeGrid() {
  const awardedIds = useStatsStore((s) => s.awardedBadgeIds);
  const awardedSet = new Set(awardedIds);

  // Split into earned / locked
  const earned = BADGE_DEFS.filter((b) => awardedSet.has(b.id));
  const locked = BADGE_DEFS.filter((b) => !awardedSet.has(b.id));

  return (
    <div className="space-y-4">
      {earned.length > 0 && (
        <div>
          <p className="text-xs text-muted mb-2">
            Earned ({earned.length}/{BADGE_DEFS.length})
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {earned.map((b) => (
              <BadgeTile key={b.id} badge={b} unlocked />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs text-muted mb-2">
          {earned.length === 0
            ? 'Complete tests to earn badges'
            : `Locked (${locked.length})`}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {locked.map((b) => (
            <BadgeTile key={b.id} badge={b} unlocked={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
