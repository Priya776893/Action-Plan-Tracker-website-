import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CHART_COLORS } from '@/lib/constants';

interface ProgressBarChartProps {
  data: { name: string; completed: number; total: number; percent: number }[];
  height?: number;
}

interface TooltipPayloadEntry {
  payload: { name: string; completed: number; total: number; percent: number };
}

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 text-sm">
      <p className="font-semibold text-gray-800 mb-1">{d.name}</p>
      <p className="text-gray-600">
        {d.completed} of {d.total} completed ({d.percent}%)
      </p>
    </div>
  );
};

const ProgressBarChart: React.FC<ProgressBarChartProps> = ({ data, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-gray-400 text-sm"
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          dataKey="name"
          type="category"
          width={120}
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        {/* Background track bar */}
        <Bar
          dataKey={() => 100}
          fill={`${CHART_COLORS.secondary}20`}
          radius={[4, 4, 4, 4]}
          barSize={18}
          isAnimationActive={false}
        />
        {/* Actual progress bar */}
        <Bar dataKey="percent" radius={[4, 4, 4, 4]} barSize={18}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS.primary} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProgressBarChart;
