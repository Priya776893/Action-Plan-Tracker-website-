import React from 'react';
import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: { value: number; isPositive: boolean };
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#293C7C',
  trend,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-100 p-5',
        'flex items-center gap-4 transition-all duration-300',
        'hover:shadow-md hover:-translate-y-0.5 cursor-default'
      )}
    >
      {/* Icon circle */}
      <div
        className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 leading-tight mt-0.5">
          {value}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {subtitle && (
            <p className="text-xs text-gray-400 truncate">{subtitle}</p>
          )}
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-medium',
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
