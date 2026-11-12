import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { ActionItem } from '@/types';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  data: ActionItem[];
  sheetName?: string;
}

export default function ExportButton({ data, sheetName = 'Action_Plan' }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = ['Sr. No.', 'Topic', 'Action Description', 'Status', 'Priority', 'Assignee', 'Department', 'Due Date', 'Completion %'];
    const rows = data.map((item) => [
      item.srNo,
      `"${(item.topic || '').replace(/"/g, '""')}"`,
      `"${(item.actionDescription || '').replace(/"/g, '""')}"`,
      item.status,
      item.priority,
      `"${(item.assignee || '').replace(/"/g, '""')}"`,
      `"${(item.department || '').replace(/"/g, '""')}"`,
      item.dueDate || '',
      item.completionPercent ?? 0,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sheetName.replace(/\s+/g, '_')}_export.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const exportExcel = () => {
    if (data.length === 0) return;
    const worksheetData = data.map((item) => ({
      'Sr. No.': item.srNo,
      'Topic': item.topic,
      'Action Description': item.actionDescription,
      'Status': item.status,
      'Priority': item.priority,
      'Assignee': item.assignee || '—',
      'Department': item.department || '—',
      'Due Date': item.dueDate || '—',
      'Completion %': item.completionPercent ?? 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Action Plan');
    XLSX.writeFile(workbook, `${sheetName.replace(/\s+/g, '_')}_export.xlsx`);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={data.length === 0}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-white shadow-sm transition-all',
          'bg-[#293C7C] hover:bg-[#1e2d5e] focus:outline-none focus:ring-2 focus:ring-[#293C7C]/30',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
        <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 rounded-lg border border-slate-200 bg-white shadow-lg py-1 animate-in fade-in-0 zoom-in-95">
          <button
            type="button"
            onClick={exportExcel}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export to Excel (.xlsx)</span>
          </button>
          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
          >
            <FileText className="w-4 h-4 text-[#293C7C]" />
            <span>Export to CSV (.csv)</span>
          </button>
        </div>
      )}
    </div>
  );
}
