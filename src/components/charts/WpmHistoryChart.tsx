'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useStatsStore } from '@/store/statsStore';
import type { HistoryEntry } from '@/store/statsStore';

function formatLabel(entry: HistoryEntry): string {
  const d = new Date(entry.timestamp);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function WpmHistoryChart() {
  const history = useStatsStore((s) => s.history);

  if (history.length < 2) {
    return (
      <div className="flex items-center justify-center h-40 text-muted text-sm">
        Complete at least 2 tests to see your progress chart.
      </div>
    );
  }

  // Show last 50 tests in chronological order
  const data = [...history]
    .reverse()
    .slice(-50)
    .map((h, i) => ({
      label: formatLabel(h),
      wpm: h.wpm,
      raw: h.rawWpm,
      acc: Math.round(h.accuracy),
      i,
    }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="rawGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />

        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
          tickLine={false}
          axisLine={false}
        />

        <Tooltip
          contentStyle={{
            background: 'rgba(15,15,20,0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
        />

        <Area
          type="monotone"
          dataKey="raw"
          stroke="#8b5cf6"
          strokeWidth={1}
          fill="url(#rawGrad)"
          dot={false}
          name="Raw WPM"
        />
        <Area
          type="monotone"
          dataKey="wpm"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#wpmGrad)"
          dot={false}
          name="WPM"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
