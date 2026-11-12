import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ActionItem, Status } from '@/types';
import { CHART_COLORS } from '@/lib/constants';

interface TimelineChartProps {
  items: ActionItem[];
  height?: number;
}

const STATUS_KEYS: { key: string; status: Status; color: string }[] = [
  { key: 'Completed', status: 'Completed', color: CHART_COLORS.completed },
  { key: 'In Progress', status: 'In Progress', color: CHART_COLORS.inProgress },
  { key: 'Blocked', status: 'Blocked', color: CHART_COLORS.blocked },
  { key: 'Overdue', status: 'Overdue', color: CHART_COLORS.overdue },
  { key: 'Not Started', status: 'Not Started', color: CHART_COLORS.notStarted },
];

interface MonthBucket {
  month: string;
  [status: string]: number | string;
}

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 text-sm">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      {payload
        .filter((p) => p.value > 0)
        .map((p, i) => (
          <p key={i} className="text-gray-600 flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: p.color }}
            />
            {p.name}: {p.value}
          </p>
        ))}
      <p className="text-gray-500 mt-1 pt-1 border-t border-gray-100 font-medium">
        Total: {total}
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

const TimelineChart: React.FC<TimelineChartProps> = ({ items, height = 300 }) => {
  const data = useMemo(() => {
    // Collect all month keys from monthlyTargets across all items
    const monthSet = new Set<string>();
    items.forEach((item) => {
      if (item.monthlyTargets) {
        Object.keys(item.monthlyTargets).forEach((m) => monthSet.add(m));
      }
    });

    if (monthSet.size === 0) return [];

    // Sort months chronologically (format: "Mon-YY" e.g. "Sep-26")
    const months = Array.from(monthSet).sort((a, b) => {
      const parse = (s: string) => {
        const [mon, yr] = s.split('-');
        const monthIdx = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ].indexOf(mon);
        return (parseInt(yr, 10) || 0) * 12 + (monthIdx >= 0 ? monthIdx : 0);
      };
      return parse(a) - parse(b);
    });

    // Build buckets
    const buckets: MonthBucket[] = months.map((month) => {
      const bucket: MonthBucket = { month };
      STATUS_KEYS.forEach(({ key }) => {
        bucket[key] = 0;
      });

      // Count items that have a target in this month, grouped by status
      items.forEach((item) => {
        if (item.monthlyTargets && item.monthlyTargets[month]) {
          bucket[item.status] = ((bucket[item.status] as number) || 0) + 1;
        }
      });

      return bucket;
    });

    return buckets;
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
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        <Legend content={renderLegend} />
        {STATUS_KEYS.map(({ key, color }) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="timeline"
            fill={color}
            radius={[2, 2, 0, 0]}
            maxBarSize={40}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TimelineChart;
