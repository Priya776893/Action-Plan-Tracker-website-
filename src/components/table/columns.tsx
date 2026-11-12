import { ColumnDef } from '@tanstack/react-table';
import { ActionItem } from '@/types';
import { STATUS_STYLES, PRIORITY_STYLES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export function getColumns(): ColumnDef<ActionItem>[] {
  return [
    {
      accessorKey: 'srNo',
      header: 'Sr. No.',
      size: 60,
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="flex justify-center font-medium text-slate-600">
          {getValue<number>()}
        </span>
      ),
    },
    {
      accessorKey: 'topic',
      header: 'Topic',
      size: 150,
      enableSorting: true,
      cell: ({ getValue }) => (
        <span
          className="block font-semibold text-slate-800 truncate max-w-[150px]"
          title={getValue<string>()}
        >
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: 'actionDescription',
      header: 'Action Description',
      size: 280,
      enableSorting: false,
      cell: ({ getValue }) => {
        const text = getValue<string>();
        return (
          <span
            className="block text-sm text-slate-700 line-clamp-2"
            title={text}
          >
            {text}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      enableSorting: false,
      filterFn: (row, columnId, filterValue: string[]) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue<string>(columnId));
      },
      cell: ({ getValue }) => {
        const status = getValue<string>();
        const style = STATUS_STYLES[status] ?? {
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          dot: 'bg-slate-400',
        };
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      size: 100,
      enableSorting: false,
      filterFn: (row, columnId, filterValue: string[]) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue<string>(columnId));
      },
      cell: ({ getValue }) => {
        const priority = getValue<string>();
        const style = PRIORITY_STYLES[priority] ?? {
          bg: 'bg-slate-100',
          text: 'text-slate-600',
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
          >
            {priority}
          </span>
        );
      },
    },
    {
      accessorKey: 'assignee',
      header: 'Assignee',
      size: 130,
      enableSorting: true,
      cell: ({ getValue }) => {
        const val = getValue<string>();
        return (
          <span className="text-sm text-slate-700">
            {val || '—'}
          </span>
        );
      },
    },
    {
      accessorKey: 'department',
      header: 'Department',
      size: 120,
      enableSorting: true,
      cell: ({ getValue }) => {
        const val = getValue<string>();
        return (
          <span className="text-sm text-slate-700">
            {val || '—'}
          </span>
        );
      },
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      size: 100,
      enableSorting: true,
      cell: ({ getValue }) => {
        const val = getValue<string>();
        return (
          <span className="text-sm text-slate-700 whitespace-nowrap">
            {val ? formatDate(val) : '—'}
          </span>
        );
      },
    },
    {
      accessorKey: 'completionPercent',
      header: 'Completion',
      size: 100,
      enableSorting: true,
      cell: ({ getValue }) => {
        const pct = getValue<number>() ?? 0;
        const barColor =
          pct >= 100
            ? 'bg-teal-500'
            : pct >= 60
              ? 'bg-amber-500'
              : pct >= 30
                ? 'bg-orange-400'
                : 'bg-rose-400';
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden min-w-[48px]">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-600 w-9 text-right">
              {pct}%
            </span>
          </div>
        );
      },
    },
  ];
}
