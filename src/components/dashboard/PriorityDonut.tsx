import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { ActionItem, Priority } from '@/types';

interface PriorityDonutProps {
  items: ActionItem[];
  height?: number;
}

const PRIORITY_COLOR_MAP: Record<Priority, string> = {
  High: '#812B4A',
  Medium: '#C7984F',
  Low: '#024944',
};

interface ChartEntry {
  name: string;
  value: number;
  color: string;
}

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: { payload: ChartEntry }[];
  total: number;
}> = ({ active, payload, total }) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;
  const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0';
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 text-sm">
      <p className="font-semibold text-gray-800">{entry.name} Priority</p>
      <p className="text-gray-600">
        {entry.value} item{entry.value !== 1 ? 's' : ''} ({pct}%)
      </p>
    </div>
  );
};

const renderLegend = (props: any) => {
  const { payload } = props;
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry: any, i: number) => (
        <span key={i} className="inline-flex items-center gap-1.5 text-xs text-gray-600">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </span>
      ))}
    </div>
  );
};

const PriorityDonut: React.FC<PriorityDonutProps> = ({ items, height = 300 }) => {
  const { data, total } = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.priority] = (counts[item.priority] || 0) + 1;
    });

    // Order: High → Medium → Low
    const order: Priority[] = ['High', 'Medium', 'Low'];
    const chartData: ChartEntry[] = order
      .filter((p) => (counts[p] || 0) > 0)
      .map((priority) => ({
        name: priority,
        value: counts[priority],
        color: PRIORITY_COLOR_MAP[priority],
      }));

    return { data: chartData, total: items.length };
  }, [items]);

  if (data.length === 0) {
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
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {/* Center text */}
        <text
          x="50%"
          y="42%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: '1.5rem', fontWeight: 700, fill: '#1f2937' }}
        >
          {total}
        </text>
        <text
          x="50%"
          y="52%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: '0.7rem', fill: '#9ca3af' }}
        >
          Total Items
        </text>
        <Tooltip content={<CustomTooltip total={total} />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PriorityDonut;
