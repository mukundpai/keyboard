'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { WpmSnapshot } from '@/types/typing';

interface SpeedChartProps {
  data: WpmSnapshot[];
}

export function SpeedChart({ data }: SpeedChartProps) {
  if (!data.length) return null;

  return (
    <div className="w-full h-48 glass-card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#D97706" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#D97706" stopOpacity={0}   />
            </linearGradient>
            <linearGradient id="rawGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#78716C" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#78716C" stopOpacity={0}   />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#292524" strokeDasharray="4 4" vertical={false} />

          <XAxis
            dataKey="second"
            tick={{ fill: '#78716C', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}s`}
          />
          <YAxis
            tick={{ fill: '#78716C', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#1C1917',
              border: '1px solid #57534E',
              borderRadius: '10px',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#A8A29E', marginBottom: 4 }}
            labelFormatter={(v) => `${v}s`}
            itemStyle={{ color: '#FAFAF9' }}
          />

          <Area
            type="monotone"
            dataKey="raw"
            name="raw"
            stroke="#78716C"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            fill="url(#rawGrad)"
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="wpm"
            name="wpm"
            stroke="#D97706"
            strokeWidth={2}
            fill="url(#wpmGrad)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: '#FBBF24' }}
          />

          <Legend
            wrapperStyle={{ fontSize: 11, color: '#A8A29E', paddingTop: 4 }}
            iconType="plainline"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
