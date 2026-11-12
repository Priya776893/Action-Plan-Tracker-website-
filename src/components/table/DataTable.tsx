import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import type { ActionItem } from '@/types';
import { getColumns } from './columns';
import TableToolbar from './TableToolbar';
import ExportButton from './ExportButton';

interface DataTableProps {
  data: ActionItem[];
  sheetName?: string;
}

export function DataTable({ data, sheetName = 'Action Plan' }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

  const columns = useMemo(() => getColumns(), []);

  // Sync multi-select filters into TanStack columnFilters
  const handleStatusChange = (values: string[]) => {
    setStatusFilter(values);
    setColumnFilters((prev) => {
      const next = prev.filter((f) => f.id !== 'status');
      return values.length > 0 ? [...next, { id: 'status', value: values }] : next;
    });
  };

  const handlePriorityChange = (values: string[]) => {
    setPriorityFilter(values);
    setColumnFilters((prev) => {
      const next = prev.filter((f) => f.id !== 'priority');
      return values.length > 0 ? [...next, { id: 'priority', value: values }] : next;
    });
  };

  const handleClearFilters = () => {
    setGlobalFilter('');
    setStatusFilter([]);
    setPriorityFilter([]);
    setColumnFilters([]);
  };

  const hasActiveFilters =
    Boolean(globalFilter) || statusFilter.length > 0 || priorityFilter.length > 0;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const filteredRows = table.getFilteredRowModel().rows.map((r) => r.original);

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-[#e5e2db] shadow-sm">
        <TableToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusChange}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={handlePriorityChange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ExportButton data={filteredRows} sheetName={sheetName} />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-[#e5e2db] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-[#293C7C] text-white text-xs font-semibold uppercase tracking-wider">
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDirection = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                        className="py-3 px-4 select-none whitespace-nowrap"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className={`flex items-center gap-1.5 ${canSort ? 'cursor-pointer hover:text-white/80' : ''}`}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="text-white/60">
                              {sortDirection === 'asc' ? (
                                <ChevronUp className="w-3.5 h-3.5 text-[#C7984F]" />
                              ) : sortDirection === 'desc' ? (
                                <ChevronDown className="w-3.5 h-3.5 text-[#C7984F]" />
                              ) : (
                                <ChevronsUpDown className="w-3 h-3 opacity-40" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-[#e5e2db] text-sm">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-[#AD7C4B]/5 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#faf9f7]'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-4 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-12 text-center text-slate-400 text-sm"
                  >
                    No action items match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#faf9f7] border-t border-[#e5e2db] text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>
              Showing{' '}
              <strong className="text-slate-800">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + (table.getFilteredRowModel().rows.length > 0 ? 1 : 0)}
              </strong>{' '}
              to{' '}
              <strong className="text-slate-800">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </strong>{' '}
              of <strong className="text-slate-800">{table.getFilteredRowModel().rows.length}</strong> entries
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="px-2 py-1 bg-white border border-[#e5e2db] rounded text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#293C7C]"
              >
                {[10, 20, 30, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount() || 1}
              </span>
              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
