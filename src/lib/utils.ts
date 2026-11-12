import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ActionItem, KpiMetrics } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function computeKpis(items: ActionItem[]): KpiMetrics {
  const totalItems = items.length;
  const completed = items.filter((i) => i.status === 'Completed').length;
  const inProgress = items.filter((i) => i.status === 'In Progress').length;
  const overdue = items.filter((i) => i.status === 'Overdue').length;
  const blocked = items.filter((i) => i.status === 'Blocked').length;
  const notStarted = items.filter((i) => i.status === 'Not Started').length;
  const completionPercent = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;
  const uniqueAssignees = new Set(items.map((i) => i.assignee).filter(Boolean)).size;
  const uniqueDepartments = new Set(items.map((i) => i.department).filter(Boolean)).size;

  return {
    totalItems,
    completed,
    completionPercent,
    inProgress,
    overdue,
    blocked,
    notStarted,
    uniqueAssignees,
    uniqueDepartments,
  };
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function excelSerialToDate(serial: number): Date {
  // Excel serial date → JS Date
  const utcDays = Math.floor(serial - 25569);
  return new Date(utcDays * 86400 * 1000);
}

export function excelSerialToISO(serial: number): string {
  const date = excelSerialToDate(serial);
  return date.toISOString().split('T')[0];
}

export function excelSerialToMonthLabel(serial: number): string {
  const date = excelSerialToDate(serial);
  return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

