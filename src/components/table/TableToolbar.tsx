import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableToolbarProps {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (values: string[]) => void;
  priorityFilter: string[];
  onPriorityFilterChange: (values: string[]) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const STATUS_OPTIONS = ['Completed', 'In Progress', 'Blocked', 'Overdue', 'Not Started'];
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function MultiSelectDropdown({ label, options, selected, onChange }: MultiSelectDropdownProps) {
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

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border bg-white shadow-sm transition-colors',
          'hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-royal-blue/20',
          selected.length > 0
            ? 'border-royal-blue/40 text-royal-blue'
            : 'border-slate-300 text-slate-600'
        )}
      >
        <Filter className="w-3.5 h-3.5" />
        {label}
        {selected.length > 0 && (
          <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-royal-blue text-white text-[10px] font-bold">
            {selected.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg py-1 animate-in fade-in-0 zoom-in-95">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
                className="w-4 h-4 rounded border-slate-300 text-royal-blue focus:ring-royal-blue/30"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TableToolbar({
  globalFilter,
  onGlobalFilterChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onClearFilters,
  hasActiveFilters,
}: TableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => onGlobalFilterChange(e.target.value)}
          placeholder="Search action items..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white shadow-sm
                     placeholder:text-slate-400
                     focus:outline-none focus:ring-2 focus:ring-royal-blue/20 focus:border-royal-blue/40
                     transition-colors"
        />
      </div>

      {/* Status Filter */}
      <MultiSelectDropdown
        label="Status"
        options={STATUS_OPTIONS}
        selected={statusFilter}
        onChange={onStatusFilterChange}
      />

      {/* Priority Filter */}
      <MultiSelectDropdown
        label="Priority"
        options={PRIORITY_OPTIONS}
        selected={priorityFilter}
        onChange={onPriorityFilterChange}
      />

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm text-rose-600 hover:text-rose-700
                     hover:bg-rose-50 rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear filters
        </button>
      )}
    </div>
  );
}
