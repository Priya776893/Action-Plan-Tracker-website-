import { useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { SHEET_CONFIG } from '@/lib/constants';
import KpiCard from '@/components/dashboard/KpiCard';
import StatusPieChart from '@/components/dashboard/StatusPieChart';
import PriorityDonut from '@/components/dashboard/PriorityDonut';
import ProgressBarChart from '@/components/dashboard/ProgressBarChart';
import TimelineChart from '@/components/dashboard/TimelineChart';
import { WelcomeState } from '@/components/shared/EmptyState';

export function GlobalOverview() {
  const { workbook, hasAnyData, getGlobalKpis, getAllItems } = useData();

  const allItems = useMemo(() => getAllItems(), [getAllItems]);
  const kpis = useMemo(() => getGlobalKpis(), [getGlobalKpis]);

  // Cross-sheet progress bar data
  const crossSheetData = useMemo(() => {
    if (!workbook?.sheets) return [];
    return SHEET_CONFIG.map((cfg) => {
      const sheet = workbook.sheets.find((s) => s.key === cfg.key);
      const items = sheet?.items || [];
      const total = items.length;
      const completed = items.filter((i) => i.status === 'Completed').length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        name: cfg.displayName.replace(' Action Plan', '').replace(' Review', ''),
        completed,
        total,
        percent,
      };
    });
  }, [workbook]);

  // If no workbook is loaded or no data exists across any sheet
  if (!workbook || !hasAnyData) {
    return <WelcomeState />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#293C7C] to-[#1e2d5e] p-6 rounded-2xl text-white shadow-lg">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#C7984F]">
            Executive Dashboard
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
            Hindalco Muri HR Communication
          </h2>
          <p className="text-sm text-white/70 mt-1 max-w-xl">
            Real-time status, timeline distribution, and progress metrics aggregated across all 8 strategic operational action plans.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 self-start sm:self-auto">
          <div className="text-center">
            <span className="block text-2xl font-bold text-[#C7984F]">
              {kpis.completionPercent}%
            </span>
            <span className="text-[11px] text-white/70">Overall Completed</span>
          </div>
          <div className="w-[1px] h-8 bg-white/20" />
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">
              {kpis.totalItems}
            </span>
            <span className="text-[11px] text-white/70">Total Tasks</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Action Items"
          value={kpis.totalItems}
          subtitle={`Across ${SHEET_CONFIG.length} program areas`}
          icon={ListTodo}
          color="#293C7C"
        />
        <KpiCard
          title="Completed"
          value={kpis.completed}
          subtitle={`${kpis.completionPercent}% execution rate`}
          icon={CheckCircle2}
          color="#024944"
        />
        <KpiCard
          title="In Progress"
          value={kpis.inProgress}
          subtitle="Currently ongoing"
          icon={Clock}
          color="#C7984F"
        />
        <KpiCard
          title="At Risk / Overdue"
          value={kpis.overdue + kpis.blocked}
          subtitle={`${kpis.blocked} blocked, ${kpis.overdue} overdue`}
          icon={AlertTriangle}
          color="#812B4A"
        />
      </div>

      {/* Charts Row 1: Cross-sheet progress & Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cross-sheet Completion Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#e5e2db] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#1e2a4a]">
                Program Area Progress
              </h3>
              <p className="text-xs text-muted-foreground">
                Task completion % compared across all 8 sheets
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#AD7C4B]" />
          </div>
          <ProgressBarChart data={crossSheetData} height={320} />
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5e2db] shadow-sm flex flex-col">
          <div className="mb-2">
            <h3 className="text-base font-bold text-[#1e2a4a]">
              Priority Breakdown
            </h3>
            <p className="text-xs text-muted-foreground">
              Action items categorized by priority level
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <PriorityDonut items={allItems} height={280} />
          </div>
        </div>
      </div>

      {/* Charts Row 2: Status Distribution & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5e2db] shadow-sm flex flex-col">
          <div className="mb-2">
            <h3 className="text-base font-bold text-[#1e2a4a]">
              Status Distribution
            </h3>
            <p className="text-xs text-muted-foreground">
              Overall status across all action plans
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <StatusPieChart items={allItems} height={280} />
          </div>
        </div>

        {/* Monthly Target Timeline */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#e5e2db] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#1e2a4a]">
                Monthly Execution Targets
              </h3>
              <p className="text-xs text-muted-foreground">
                Deliverables mapped across target timeline months (Sep 2026 - Dec 2026)
              </p>
            </div>
            <FileSpreadsheet className="w-5 h-5 text-[#293C7C]" />
          </div>
          <TimelineChart items={allItems} height={280} />
        </div>
      </div>
    </div>
  );
}

export default GlobalOverview;
