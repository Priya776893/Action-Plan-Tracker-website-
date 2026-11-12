import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  Users,
  Building,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { SHEET_CONFIG } from '@/lib/constants';
import KpiCard from '@/components/dashboard/KpiCard';
import StatusPieChart from '@/components/dashboard/StatusPieChart';
import PriorityDonut from '@/components/dashboard/PriorityDonut';
import ProgressBarChart from '@/components/dashboard/ProgressBarChart';
import TimelineChart from '@/components/dashboard/TimelineChart';
import DataTable from '@/components/table/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';

export function SheetView() {
  const { sheetKey } = useParams<{ sheetKey: string }>();
  const { workbook, getSheetByKey, getSheetKpis } = useData();

  const config = SHEET_CONFIG.find((s) => s.key === sheetKey);
  const sheetData = sheetKey ? getSheetByKey(sheetKey) : undefined;
  const kpis = sheetKey ? getSheetKpis(sheetKey) : null;

  const items = sheetData?.items || [];
  const hasData = items.length > 0;

  // Chart data: Tasks by Department / Assignee
  const departmentChartData = useMemo(() => {
    if (items.length === 0) return [];
    const deptMap: Record<string, { total: number; completed: number }> = {};

    items.forEach((item) => {
      const dept = item.department || item.assignee || 'General';
      if (!deptMap[dept]) {
        deptMap[dept] = { total: 0, completed: 0 };
      }
      deptMap[dept].total += 1;
      if (item.status === 'Completed') {
        deptMap[dept].completed += 1;
      }
    });

    return Object.entries(deptMap).map(([name, stat]) => ({
      name,
      total: stat.total,
      completed: stat.completed,
      percent: stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0,
    }));
  }, [items]);

  if (!config) {
    return (
      <EmptyState
        title="Sheet Not Found"
        description="The requested action plan sheet does not exist."
        showUpload={false}
      />
    );
  }

  const Icon = config.icon;

  return (
    <div className="space-y-6">
      {/* Sheet Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e5e2db] shadow-sm">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0"
            style={{ backgroundColor: config.color }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Action Plan
              </span>
              {hasData ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {items.length} Tasks Loaded
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  No Data
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1e2a4a] mt-0.5">
              {config.displayName}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Excel Source Sheet: <code className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{sheetData?.sheetName || config.excelName}</code>
            </p>
          </div>
        </div>

        {hasData && kpis && (
          <div className="flex items-center gap-3 bg-[#faf9f7] px-4 py-2.5 rounded-xl border border-[#e5e2db] self-start sm:self-auto">
            <div className="text-center">
              <span className="block text-xl font-bold text-[#293C7C]">
                {kpis.completionPercent}%
              </span>
              <span className="text-[10px] text-muted-foreground">Completed</span>
            </div>
            <div className="w-[1px] h-7 bg-[#e5e2db]" />
            <div className="text-center">
              <span className="block text-xl font-bold text-[#1e2a4a]">
                {kpis.totalItems}
              </span>
              <span className="text-[10px] text-muted-foreground">Total</span>
            </div>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="bg-white rounded-2xl border border-[#e5e2db] p-8 shadow-sm">
          <EmptyState
            title={`No Data in ${config.displayName}`}
            description={`The sheet "${sheetData?.sheetName || config.excelName}" is currently empty or unpopulated in the Excel workbook. Once updated with tasks, its KPIs and visual charts will appear here.`}
            showUpload={true}
            showExpectedColumns={true}
          />
        </div>
      ) : (
        <>
          {/* KPI Header (3-4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Total Action Items"
              value={kpis?.totalItems ?? items.length}
              subtitle="Planned activities"
              icon={ListTodo}
              color="#293C7C"
            />
            <KpiCard
              title="Completed Tasks"
              value={kpis?.completed ?? 0}
              subtitle={`${kpis?.completionPercent ?? 0}% completed`}
              icon={CheckCircle2}
              color="#024944"
            />
            <KpiCard
              title="Overdue / Blocked"
              value={(kpis?.overdue ?? 0) + (kpis?.blocked ?? 0)}
              subtitle={`${kpis?.overdue ?? 0} overdue, ${kpis?.blocked ?? 0} blocked`}
              icon={AlertTriangle}
              color="#812B4A"
            />
            <KpiCard
              title="Owners & Teams"
              value={kpis?.uniqueAssignees || kpis?.uniqueDepartments || (items.length > 0 ? 'Active' : 0)}
              subtitle={`${kpis?.uniqueDepartments ?? 0} depts involved`}
              icon={Users}
              color="#AD7C4B"
            />
          </div>

          {/* Visual Dashboard Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status distribution */}
            <div className="bg-white p-5 rounded-2xl border border-[#e5e2db] shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-base font-bold text-[#1e2a4a]">
                    Status Breakdown
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Completion & progress state
                  </p>
                </div>
                <PieChartIcon className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <StatusPieChart items={items} height={260} />
              </div>
            </div>

            {/* Department / Assignee Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-[#e5e2db] shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-base font-bold text-[#1e2a4a]">
                    Team & Department Progress
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Completion rate by division
                  </p>
                </div>
                <BarChart3 className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1">
                <ProgressBarChart data={departmentChartData} height={260} />
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-[#e5e2db] shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-base font-bold text-[#1e2a4a]">
                    Priority Mix
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    High vs Medium vs Low
                  </p>
                </div>
                <PieChartIcon className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <PriorityDonut items={items} height={260} />
              </div>
            </div>
          </div>

          {/* Monthly Targets Timeline Chart */}
          <div className="bg-white p-5 rounded-2xl border border-[#e5e2db] shadow-sm">
            <h3 className="text-base font-bold text-[#1e2a4a] mb-1">
              Monthly Timeline & Milestones
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Schedule breakdown across monthly tracking periods
            </p>
            <TimelineChart items={items} height={240} />
          </div>

          {/* Interactive Data Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1e2a4a]">
                  Action Plan Records
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sort, search, filter, and export the action items for this sheet
                </p>
              </div>
            </div>
            <DataTable data={items} sheetName={config.displayName} />
          </div>
        </>
      )}
    </div>
  );
}

export default SheetView;
