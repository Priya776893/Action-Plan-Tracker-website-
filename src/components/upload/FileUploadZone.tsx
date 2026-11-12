import { useCallback, useRef, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  compact?: boolean;
  onUploadComplete?: () => void;
}

export function FileUploadZone({ compact = false, onUploadComplete }: FileUploadZoneProps) {
  const { loadWorkbook, isLoading, error } = useData();
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        return;
      }
      setSuccess(false);
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        loadWorkbook(buffer, file.name);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        onUploadComplete?.();
      };
      reader.readAsArrayBuffer(file);
    },
    [loadWorkbook, onUploadComplete]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = '';
    },
    [handleFile]
  );

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={cn(
            'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all',
            'bg-[#AD7C4B] text-white hover:bg-[#C7984F]',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>Upload Excel</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'relative flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all',
          isDragging
            ? 'border-[#AD7C4B] bg-[#AD7C4B]/5 dropzone-active'
            : 'border-[#e5e2db] hover:border-[#AD7C4B]/50 hover:bg-[#AD7C4B]/5',
          isLoading && 'pointer-events-none opacity-60'
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-12 h-12 text-[#AD7C4B] animate-spin" />
            <p className="text-sm text-muted-foreground">Parsing workbook...</p>
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="w-12 h-12 text-[#024944]" />
            <p className="text-sm font-medium text-[#024944]">File uploaded successfully!</p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#293C7C]/10">
              <FileSpreadsheet className="w-8 h-8 text-[#293C7C]" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-foreground">
                Drag & drop your Excel file here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or <span className="text-[#AD7C4B] font-medium">click to browse</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Supports .xlsx and .xls files</p>
            </div>
          </>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-[#812B4A]/10 text-[#812B4A] text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}

