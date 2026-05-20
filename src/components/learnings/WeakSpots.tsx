'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { useStatsStore } from '@/store/statsStore';
import { DRILLS, type DrillDef } from '@/data/drills';

/** Keys that can be linked to targeted drills by group. */
const KEY_TO_GROUP: Record<string, string> = {
  q: 'finger-isolation', w: 'finger-isolation', e: 'finger-isolation',
  r: 'finger-isolation', t: 'finger-isolation', y: 'finger-isolation',
  u: 'finger-isolation', i: 'finger-isolation', o: 'finger-isolation',
  p: 'finger-isolation', a: 'foundation', s: 'foundation',
  d: 'foundation', f: 'foundation', g: 'finger-isolation',
  h: 'finger-isolation', j: 'foundation', k: 'foundation',
  l: 'foundation', z: 'finger-isolation', x: 'finger-isolation',
  c: 'finger-isolation', v: 'finger-isolation', b: 'finger-isolation',
  n: 'finger-isolation', m: 'finger-isolation',
};

export default function WeakSpots() {
  const keyErrors = useStatsStore((s) => s.keyErrors);
  const topErrors = useMemo(
    () =>
      Object.entries(keyErrors)
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    [keyErrors],
  );

  if (topErrors.length === 0 || topErrors[0].count === 0) return null;

  // Suggest drills whose group matches the weakest keys
  const groups = [...new Set(topErrors.map((e) => KEY_TO_GROUP[e.key]).filter(Boolean))];
  const suggestedDrills = Object.values(DRILLS).filter((d: DrillDef) => groups.includes(d.group)).slice(0, 3);

  return (
    <section className="mt-16 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-400" />
        <h2 className="text-base font-semibold text-text-primary">Your Weak Spots</h2>
      </div>

      {/* Error key badges */}
      <div className="flex flex-wrap gap-2">
        {topErrors.map(({ key, count }) => (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-xs font-mono font-semibold text-orange-300"
          >
            <kbd className="uppercase">{key}</kbd>
            <span className="text-orange-400/60">·</span>
            <span className="text-orange-400">{count} error{count !== 1 ? 's' : ''}</span>
          </span>
        ))}
      </div>

      {/* Suggested drills */}
      {suggestedDrills.length > 0 && (
        <div>
          <p className="text-xs text-muted mb-2">Targeted drills to fix these:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedDrills.map((d) => (
              <Link
                key={d.id}
                href={`/learnings/drill/${d.id}`}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-text-primary transition-colors"
              >
                {d.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
