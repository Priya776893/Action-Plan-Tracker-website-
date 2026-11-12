import { FileSpreadsheet, UploadCloud, Info } from 'lucide-react';
import { FileUploadZone } from '@/components/upload/FileUploadZone';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showUpload?: boolean;
  showExpectedColumns?: boolean;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No Data Available',
  description = 'Upload an Excel workbook with action plan data to populate this dashboard.',
  showUpload = true,
  showExpectedColumns = false,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#293C7C]/10 mb-6">
        {icon || <FileSpreadsheet className="w-10 h-10 text-[#293C7C]/60" />}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>

      {showUpload && (
        <div className="w-full max-w-md mb-6">
          <FileUploadZone />
        </div>
      )}

      {showExpectedColumns && (
        <div className="w-full max-w-lg">
          <div className="flex items-start gap-2 p-4 rounded-lg bg-[#293C7C]/5 text-left">
            <Info className="w-4 h-4 text-[#293C7C] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-[#293C7C] mb-2">
                For full dashboard features, include these columns:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Sr. No.',
                  'Topic',
                  'Action Description',
                  'Status',
                  'Priority',
                  'Assignee',
                  'Department',
                  'Due Date',
                  'Completion %',
                ].map((col) => (
                  <span
                    key={col}
                    className="inline-flex px-2 py-0.5 rounded text-xs bg-[#293C7C]/10 text-[#293C7C] font-mono"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function WelcomeState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-md border border-[#e5e2db] flex items-center justify-center mb-6">
        <img
          src="/company-logo.png"
          alt="Aditya Birla Hindalco"
          className="w-full h-full object-contain"
        />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">
        Welcome to Aditya Birla Hindalco Action Plan Hub
      </h2>
      <p className="text-base text-muted-foreground max-w-lg mb-8">
        Upload your Action Plan Excel workbook to get started. The dashboard will automatically
        parse and visualize your data across all sheets.
      </p>
      <div className="w-full max-w-lg mb-8">
        <FileUploadZone />
      </div>
      <div className="flex items-start gap-2 p-4 rounded-lg bg-[#293C7C]/5 text-left max-w-lg">
        <Info className="w-4 h-4 text-[#293C7C] mt-0.5 flex-shrink-0" />
        <div className="text-xs text-[#293C7C]">
          <p className="font-medium mb-1">Expected workbook structure:</p>
          <p>
            8 sheets: Shillim Action Plan, Vibes Action Plan, LCG Action Plan, Manthan Action Plan,
            Townhall Action Plan, Canteen Communication, Contractors Meet, Township Review
          </p>
        </div>
      </div>
    </div>
  );
}

