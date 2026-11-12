import {
  Building2,
  Users,
  Briefcase,
  BookOpen,
  Mic2,
  UtensilsCrossed,
  Handshake,
  Home,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';

export interface SheetConfig {
  key: string;
  displayName: string;
  icon: LucideIcon;
  color: string;
  excelName: string;
}

export const SHEET_CONFIG: SheetConfig[] = [
  { key: 'shillim', displayName: 'Shillim Action Plan', icon: Building2, color: '#293C7C', excelName: 'Shillim Action Plan' },
  { key: 'vibes', displayName: 'Vibes Action Plan', icon: Users, color: '#AD7C4B', excelName: 'Vibes Action Plan' },
  { key: 'lcg', displayName: 'LCG Action Plan', icon: Briefcase, color: '#024944', excelName: 'LCG Action Plan' },
  { key: 'manthan', displayName: 'Manthan Action Plan', icon: BookOpen, color: '#C7984F', excelName: 'Manthan Action Plan' },
  { key: 'townhall', displayName: 'Townhall Action Plan', icon: Mic2, color: '#812B4A', excelName: 'Townhall Action Plan' },
  { key: 'canteen', displayName: 'Canteen Communication', icon: UtensilsCrossed, color: '#293C7C', excelName: 'Canteen Communication' },
  { key: 'contractors', displayName: 'Contractors Meet', icon: Handshake, color: '#024944', excelName: 'Contractors Meet' },
  { key: 'township', displayName: 'Township Review', icon: Home, color: '#AD7C4B', excelName: 'Township Review' },
];

export const GLOBAL_OVERVIEW = {
  key: 'overview',
  displayName: 'Hindalco Muri HR Communication',
  icon: LayoutDashboard,
  color: '#293C7C',
};

export const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'Completed': { bg: 'bg-teal-50', text: 'text-teal-800', dot: 'bg-teal-500' },
  'In Progress': { bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500' },
  'Blocked': { bg: 'bg-rose-50', text: 'text-rose-800', dot: 'bg-rose-500' },
  'Overdue': { bg: 'bg-red-50', text: 'text-red-800', dot: 'bg-red-500' },
  'Not Started': { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

export const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  'High': { bg: 'bg-red-50', text: 'text-red-700' },
  'Medium': { bg: 'bg-amber-50', text: 'text-amber-700' },
  'Low': { bg: 'bg-green-50', text: 'text-green-700' },
};

export const CHART_COLORS = {
  completed: '#024944',
  inProgress: '#C7984F',
  blocked: '#812B4A',
  overdue: '#a13355',
  notStarted: '#94a3b8',
  primary: '#293C7C',
  secondary: '#AD7C4B',
  teal: '#024944',
  gold: '#C7984F',
  burgundy: '#812B4A',
};

export const STORAGE_KEY = 'action-plan-workbook-v5';

// Known structured column names (case-insensitive matching)
export const KNOWN_COLUMNS = {
  srNo: ['sr. no.', 'sr.no.', 'sr no', 'sno', 's.no', 'serial', '#', 'no.', 'no'],
  topic: ['topic', 'category', 'pillar', 'area', 'theme'],
  action: ['action', 'description', 'action description', 'task', 'activity', 'action item', 'details'],
  status: ['status', 'state', 'progress status'],
  priority: ['priority', 'importance', 'urgency'],
  assignee: ['assignee', 'assigned to', 'owner', 'responsible', 'person', 'assigned'],
  department: ['department', 'dept', 'dept.', 'function', 'team', 'division'],
  startDate: ['start date', 'start', 'begin date', 'from'],
  dueDate: ['due date', 'due', 'deadline', 'end date', 'target date', 'end', 'to'],
  completionDate: ['completion date', 'completed on', 'completed date', 'done date'],
  completionPercent: ['completion %', 'completion', 'progress', 'progress %', '% complete', 'percent'],
  remarks: ['remarks', 'notes', 'comments', 'remark', 'note', 'comment'],
};

