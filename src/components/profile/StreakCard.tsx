'use client';

import { motion } from 'framer-motion';
import { Flame, CalendarDays } from 'lucide-react';
import { useStatsStore } from '@/store/statsStore';

/** Returns last N calendar day labels (Mon, Tue …) ending today. */
function lastNDays(n: number): string[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    result.push(days[d.getDay()]);
  }
  return result;
}

/** Returns a Set of YYYY-MM-DD strings for days the user practiced (from history). */
function activeDaySet(history: { timestamp: number }[]): Set<string> {
  const set = new Set<string>();
  for (const h of history) {
    const d = new Date(h.timestamp);
    set.add(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    );
  }
  return set;
}

export default function StreakCard() {
  const streak = useStatsStore((s) => s.streak);
  const history = useStatsStore((s) => s.history);

  const dayLabels = lastNDays(7);
  const activeSet = activeDaySet(history);

  const now = new Date();
  const dayKeys = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  return (
    <div className="glass-card p-4 rounded-xl space-y-4">
      {/* Streak counter */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <Flame className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <p className="text-2xl font-bold text-text-primary">
            {streak}
            <span className="text-base font-normal text-muted ml-1">
              day{streak !== 1 ? 's' : ''}
            </span>
          </p>
          <p className="text-xs text-muted">current streak</p>
        </div>
      </div>

      {/* 7-day mini calendar */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <CalendarDays className="w-3.5 h-3.5 text-muted" />
          <span className="text-xs text-muted">Last 7 days</span>
        </div>
        <div className="flex gap-1.5">
          {dayLabels.map((label, i) => {
            const active = activeSet.has(dayKeys[i]);
            return (
              <div key={dayKeys[i]} className="flex flex-col items-center gap-1">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                    active
                      ? 'bg-indigo-500/30 border border-indigo-500/40 text-indigo-300'
                      : 'bg-white/5 border border-white/5 text-muted'
                  }`}
                >
                  {active ? '✓' : '·'}
                </motion.div>
                <span className="text-[10px] text-muted">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
