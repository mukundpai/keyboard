'use client';

import { motion } from 'framer-motion';
import { useStatsStore } from '@/store/statsStore';
import { cn } from '@/lib/utils';

const QWERTY_ROWS: string[][] = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

/** Map a normalized heat value (0–1) to a Tailwind-friendly rgba color. */
function heatColor(heat: number): string {
  if (heat === 0) return 'rgba(255,255,255,0.06)';
  // low: blue → mid: amber → high: red
  const r = Math.round(heat * 239);
  const g = Math.round((1 - heat) * 120);
  const b = Math.round((1 - heat) * 40);
  return `rgba(${r},${g},${b},${0.3 + heat * 0.55})`;
}

interface HeatKeyProps {
  label: string;
  heat: number; // 0–1
  count: number;
}

function HeatKey({ label, heat, count }: HeatKeyProps) {
  return (
    <motion.div
      className={cn(
        'relative flex items-center justify-center rounded-[4px] select-none cursor-default',
        'text-[9px] font-mono font-semibold uppercase tracking-wide',
        heat > 0 ? 'text-white' : 'text-white/30',
      )}
      title={count > 0 ? `${label}: ${count} error${count !== 1 ? 's' : ''}` : undefined}
      style={{
        width: 22,
        height: 20,
        background: heatColor(heat),
        border: `1px solid rgba(255,255,255,${heat > 0 ? 0.15 : 0.06})`,
        boxShadow: heat > 0.5 ? `0 0 6px 1px ${heatColor(heat)}` : undefined,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {label}
    </motion.div>
  );
}

export default function KeyHeatmap() {
  const keyErrors = useStatsStore((s) => s.keyErrors);
  const counts = Object.values(keyErrors);
  const maxCount = counts.length ? Math.max(...counts) : 1;

  function getHeat(key: string): { heat: number; count: number } {
    const count = keyErrors[key] ?? 0;
    return { heat: maxCount > 0 ? count / maxCount : 0, count };
  }

  const hasData = counts.some((c) => c > 0);

  return (
    <div className="space-y-2">
      {!hasData && (
        <p className="text-xs text-muted text-center py-2">
          Complete some tests to reveal your weak keys.
        </p>
      )}

      <div className="flex flex-col items-center gap-[5px]">
        <div className="flex gap-[3px]">
          {QWERTY_ROWS[0].map((k) => {
            const { heat, count } = getHeat(k);
            return <HeatKey key={k} label={k} heat={heat} count={count} />;
          })}
        </div>
        <div className="flex gap-[3px]" style={{ marginLeft: 11 }}>
          {QWERTY_ROWS[1].map((k) => {
            const { heat, count } = getHeat(k);
            return <HeatKey key={k} label={k} heat={heat} count={count} />;
          })}
        </div>
        <div className="flex gap-[3px]" style={{ marginLeft: 22 }}>
          {QWERTY_ROWS[2].map((k) => {
            const { heat, count } = getHeat(k);
            return <HeatKey key={k} label={k} heat={heat} count={count} />;
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <span className="text-[10px] text-muted">fewer errors</span>
        <div
          className="h-2 w-28 rounded-full"
          style={{
            background:
              'linear-gradient(to right, rgba(255,255,255,0.06), rgba(120,80,40,0.5), rgba(239,60,40,0.8))',
          }}
        />
        <span className="text-[10px] text-muted">more errors</span>
      </div>
    </div>
  );
}
