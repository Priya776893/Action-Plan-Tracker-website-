import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { ActionItem, Status } from '@/types';
import { CHART_COLORS } from '@/lib/constants';

interface StatusPieChartProps {
  items: ActionItem[];
  height?: number;
}

const STATUS_COLOR_MAP: Record<Status, string> = {
  'Completed': CHART_COLORS.completed,
  'In Progress': CHART_COLORS.inProgress,
  'Blocked': CHART_COLORS.blocked,
  'Overdue': CHART_COLORS.overdue,
  'Not Started': CHART_COLORS.notStarted,
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
      <p className="font-semibold text-gray-800">{entry.name}</p>
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

const StatusPieChart: React.FC<StatusPieChartProps> = ({ items, height = 300 }) => {
  const { data, total } = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.status] = (counts[item.status] || 0) + 1;
    });

    const chartData: ChartEntry[] = Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([status, count]) => ({
        name: status,
        value: count,
        color: STATUS_COLOR_MAP[status as Status] || '#94a3b8',
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
          className="fill-gray-800 text-2xl font-bold"
          style={{ fontSize: '1.5rem', fontWeight: 700 }}
        >
          {total}
        </text>
        <text
          x="50%"
          y="52%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-gray-400 text-xs"
          style={{ fontSize: '0.7rem' }}
        >
          Total Items
        </text>
        <Tooltip content={<CustomTooltip total={total} />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StatusPieChart;
