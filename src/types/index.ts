export type Status = 'Completed' | 'In Progress' | 'Blocked' | 'Overdue' | 'Not Started';
export type Priority = 'High' | 'Medium' | 'Low';

export interface ActionItem {
  id: string;
  srNo: number;
  topic: string;
  actionDescription: string;
  status: Status;
  priority: Priority;
  assignee: string;
  department: string;
  startDate: string;
  dueDate: string;
  completionDate?: string;
  completionPercent: number;
  remarks?: string;
  monthlyTargets?: Record<string, string>;
}

export interface SheetData {
  sheetName: string;
  displayName: string;
  key: string;
  items: ActionItem[];
  rawHeaders?: string[];
  rawData?: Record<string, unknown>[];
}

export interface WorkbookData {
  sheets: SheetData[];
  uploadedAt?: string;
  fileName?: string;
}

export interface KpiMetrics {
  totalItems: number;
  completed: number;
  completionPercent: number;
  inProgress: number;
  overdue: number;
  blocked: number;
  notStarted: number;
  uniqueAssignees: number;
  uniqueDepartments: number;
}

