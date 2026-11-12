import { useRef } from 'react';
import { Menu, Upload, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { SHEET_CONFIG, GLOBAL_OVERVIEW } from '@/lib/constants';
import { useData } from '@/context/DataContext';

interface HeaderProps {
  onOpenMobile: () => void;
}

export function Header({ onOpenMobile }: HeaderProps) {
  const location = useLocation();
  const { workbook, loadWorkbook, loadDefaultWorkbook, clearData, isLoading } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive current title
  let title = GLOBAL_OVERVIEW.displayName;
  const currentSheet = SHEET_CONFIG.find((s) => `/sheet/${s.key}` === location.pathname);
  if (currentSheet) {
    title = currentSheet.displayName;
  }

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

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/80 backdrop-blur-md border-b border-[#e5e2db]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="p-2 -ml-2 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 border border-[#e5e2db] shadow-xs flex items-center justify-center flex-shrink-0 lg:hidden">
            <img src="/company-logo.png" alt="Hindalco" className="w-full h-full object-contain" />
          </div>
          <div>
            <nav className="flex items-center text-xs text-muted-foreground gap-1">
              <span>Hindalco Action Hub</span>
              <span>/</span>
              <span className="text-[#293C7C] font-semibold">{title}</span>
            </nav>
            <h1 className="text-base sm:text-lg font-bold text-[#1e2a4a] leading-none mt-0.5">
              {title}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />

        {workbook?.fileName ? (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#024944]/10 text-[#024944] text-xs font-medium border border-[#024944]/20">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="max-w-[140px] truncate">{workbook.fileName}</span>
            <button
              onClick={clearData}
              title="Clear loaded workbook"
              className="ml-1 text-[#024944]/60 hover:text-[#812B4A]"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
            <span>No Excel Loaded</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => loadDefaultWorkbook()}
          disabled={isLoading}
          title="Reload bundled Action Plan"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-all disabled:opacity-50"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#293C7C]" />
          <span>Sync Default</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#AD7C4B] hover:bg-[#C7984F] rounded-lg shadow-sm transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">Upload New Workbook</span>
          <span className="sm:hidden">Upload</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
