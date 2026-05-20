'use client';

import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';

interface PaceGraphProps {
  wpmHistory: Array<{ second: number; wpm: number }>;
}

export default function PaceGraph({ wpmHistory }: PaceGraphProps) {
  if (wpmHistory.length < 2) return null;

  return (
    <div
      className="w-full h-10 opacity-60 hover:opacity-100 transition-opacity"
      aria-hidden="true"
      title="Live WPM pace"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={wpmHistory} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="paceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={['auto', 'auto']} hide />
          <Area
            type="monotone"
            dataKey="wpm"
            stroke="#6366f1"
            strokeWidth={1.5}
            fill="url(#paceGrad)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
