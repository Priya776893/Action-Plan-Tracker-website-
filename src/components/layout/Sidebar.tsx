import { useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SHEET_CONFIG, GLOBAL_OVERVIEW } from '@/lib/constants';
import { useData } from '@/context/DataContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { workbook, loadWorkbook, isLoading, getSheetKpis } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const buffer = event.target?.result as ArrayBuffer;
        loadWorkbook(buffer, file.name);
      };
      reader.readAsArrayBuffer(file);
    }
    e.target.value = '';
  };

  const navItems = [
    {
      to: '/overview',
      key: GLOBAL_OVERVIEW.key,
      displayName: GLOBAL_OVERVIEW.displayName,
      icon: GLOBAL_OVERVIEW.icon,
      color: GLOBAL_OVERVIEW.color,
      badgeText: null,
    },
    ...SHEET_CONFIG.map((sheet) => {
      const kpis = getSheetKpis(sheet.key);
      const sheetData = workbook?.sheets.find((s) => s.key === sheet.key);
      let badge = '—';
      if (kpis && kpis.totalItems > 0) {
        badge = `${kpis.completed}/${kpis.totalItems}`;
      } else if (sheetData && sheetData.items.length > 0) {
        badge = `${sheetData.items.length}`;
      }
      return {
        to: `/sheet/${sheet.key}`,
        key: sheet.key,
        displayName: sheet.displayName,
        icon: sheet.icon,
        color: sheet.color,
        badgeText: badge,
      };
    }),
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#293C7C] text-white transition-all duration-300 ease-in-out shadow-xl',
          collapsed ? 'w-20' : 'w-72',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header / Brand Logo */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-white/10">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                <img
                  src="/company-logo.png"
                  alt="Aditya Birla Hindalco"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-wider text-[#C7984F] uppercase">
                  Hindalco
                </span>
                <span className="text-sm font-semibold tracking-tight text-white leading-tight">
                  Action Plan Hub
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shadow-sm overflow-hidden">
                <img
                  src="/company-logo.png"
                  alt="Hindalco"
                  className="w-full h-full object-contain"
                  title="Aditya Birla Hindalco Action Plan Hub"
                />
              </div>
            </div>
          )}

          {/* Toggle Button for desktop */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Upload Action Button */}
        <div className="p-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={cn(
              'w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl font-medium text-xs transition-all shadow-md',
              'bg-[#AD7C4B] hover:bg-[#C7984F] text-white',
              'active:scale-[0.98] disabled:opacity-50'
            )}
            title={collapsed ? 'Upload Excel' : undefined}
          >
            <Upload className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Upload Excel Workbook</span>}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 pb-1">
            {!collapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Navigation
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <NavLink
                key={item.key}
                to={item.to}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                  isActive
                    ? 'bg-[#AD7C4B] text-white shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
                title={collapsed ? item.displayName : undefined}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110',
                    isActive ? 'text-white' : 'text-white/70'
                  )}
                />
                {!collapsed && (
                  <span className="flex-1 truncate text-xs">{item.displayName}</span>
                )}
                {!collapsed && item.badgeText !== null && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-white/60 group-hover:text-white'
                    )}
                  >
                    {item.badgeText}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer info in sidebar */}
        {!collapsed && (
          <div className="p-4 border-t border-white/10 bg-black/10">
            <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C7984F]" />
              <span className="font-medium text-white/90">Executive Dashboard</span>
            </div>
            <p className="text-[11px] text-white/50 leading-tight">
              {workbook?.fileName ? `Loaded: ${workbook.fileName}` : 'No workbook loaded'}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
