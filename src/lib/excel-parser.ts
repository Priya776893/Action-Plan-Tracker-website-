import * as XLSX from 'xlsx';
import type { ActionItem, SheetData } from '@/types';
import { SHEET_CONFIG, KNOWN_COLUMNS } from './constants';
import { generateId, excelSerialToISO, excelSerialToMonthLabel } from './utils';

/**
 * Parse an uploaded Excel workbook into SheetData[].
 * No mock data is generated — only actual Excel content is used.
 */
export function parseWorkbook(buffer: ArrayBuffer): SheetData[] {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });
  const results: SheetData[] = [];

  for (const config of SHEET_CONFIG) {
    // Find matching sheet (with flexible name matching)
    const sheetName = findSheetName(workbook.SheetNames, config.excelName);
    if (!sheetName) {
      results.push({
        sheetName: config.excelName,
        displayName: config.displayName,
        key: config.key,
        items: [],
        rawHeaders: [],
        rawData: [],
      });
      continue;
    }

    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet || !worksheet['!ref']) {
      results.push({
        sheetName,
        displayName: config.displayName,
        key: config.key,
        items: [],
        rawHeaders: [],
        rawData: [],
      });
      continue;
    }

    const rawRows: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: true,
      defval: null,
    });

    if (rawRows.length < 2) {
      results.push({
        sheetName,
        displayName: config.displayName,
        key: config.key,
        items: [],
        rawHeaders: [],
        rawData: [],
      });
      continue;
    }

    // Find the header row (first row with multiple non-null cells)
    const headerRowIndex = findHeaderRow(rawRows);
    if (headerRowIndex === -1) {
      results.push({
        sheetName,
        displayName: config.displayName,
        key: config.key,
        items: [],
        rawHeaders: [],
        rawData: [],
      });
      continue;
    }

    const headers = (rawRows[headerRowIndex] as unknown[]).map((h) =>
      h != null ? String(h).trim() : ''
    );
    const dataRows = rawRows.slice(headerRowIndex + 1);

    // Check if headers contain structured PM columns
    const columnMap = mapColumns(headers);
    const isStructured =
      columnMap.status !== -1 || columnMap.priority !== -1 || columnMap.assignee !== -1;

    if (isStructured) {
      const items = parseStructuredRows(dataRows, headers, columnMap);
      results.push({
        sheetName,
        displayName: config.displayName,
        key: config.key,
        items,
        rawHeaders: headers,
      });
    } else {
      // Topic/action format
      const items = parseTopicRows(dataRows, headers);
      const rawData = dataRows
        .filter((row) => row.some((cell) => cell != null && String(cell).trim() !== ''))
        .map((row) => {
          const obj: Record<string, unknown> = {};
          headers.forEach((h, i) => {
            if (h) obj[h] = row[i] ?? null;
          });
          return obj;
        });

      results.push({
        sheetName,
        displayName: config.displayName,
        key: config.key,
        items,
        rawHeaders: headers,
        rawData,
      });
    }
  }

  return results;
}

function findSheetName(sheetNames: string[], targetName: string): string | undefined {
  // Exact match first
  const exact = sheetNames.find((n) => n === targetName);
  if (exact) return exact;

  // Case-insensitive + normalized whitespace
  const normTarget = targetName.toLowerCase().replace(/\s+/g, ' ').trim();
  const found = sheetNames.find(
    (n) => n.toLowerCase().replace(/\s+/g, ' ').trim() === normTarget
  );
  if (found) return found;

  // Substring match
  return sheetNames.find((n) => {
    const normN = n.toLowerCase().replace(/\s+/g, ' ').trim();
    return normN.includes(normTarget) || normTarget.includes(normN);
  });
}

function findHeaderRow(rows: unknown[][]): number {
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const row = rows[i];
    if (!row) continue;
    const nonEmptyCells = row.filter((cell) => cell != null && String(cell).trim() !== '');
    if (nonEmptyCells.length >= 2) {
      const textCells = nonEmptyCells.filter((cell) => typeof cell === 'string');
      if (textCells.length >= 2) return i;
    }
  }
  return rows.length > 0 ? 0 : -1;
}

function mapColumns(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {};

  for (const [field, aliases] of Object.entries(KNOWN_COLUMNS)) {
    map[field] = headers.findIndex((h) =>
      aliases.some((alias) => h.toLowerCase().trim() === alias)
    );
  }

  return map;
}

function parseStructuredRows(
  rows: unknown[][],
  headers: string[],
  columnMap: Record<string, number>
): ActionItem[] {
  const items: ActionItem[] = [];

  for (const row of rows) {
    if (!row || row.every((cell) => cell == null || String(cell).trim() === '')) continue;

    const getVal = (field: string): string => {
      const idx = columnMap[field];
      if (idx === -1 || idx === undefined) return '';
      const val = row[idx];
      if (val == null) return '';
      if (
        typeof val === 'number' &&
        (field === 'startDate' || field === 'dueDate' || field === 'completionDate')
      ) {
        return excelSerialToISO(val);
      }
      return String(val).trim();
    };

    const getNum = (field: string): number => {
      const idx = columnMap[field];
      if (idx === -1 || idx === undefined) return 0;
      const val = row[idx];
      if (val == null) return 0;
      const n = Number(val);
      return isNaN(n) ? 0 : n;
    };

    const monthlyTargets: Record<string, string> = {};
    headers.forEach((h, i) => {
      if (Object.values(columnMap).includes(i)) return;
      const val = row[i];
      if (val != null && String(val).trim()) {
        const headerLabel = typeof headers[i] === 'string' ? headers[i] : '';
        if (headerLabel) {
          monthlyTargets[headerLabel] = String(val).trim();
        }
      }
    });

    items.push({
      id: generateId(),
      srNo: getNum('srNo') || items.length + 1,
      topic: getVal('topic'),
      actionDescription: getVal('action'),
      status: normalizeStatus(getVal('status')),
      priority: normalizePriority(getVal('priority')),
      assignee: getVal('assignee'),
      department: getVal('department'),
      startDate: getVal('startDate'),
      dueDate: getVal('dueDate'),
      completionDate: getVal('completionDate') || undefined,
      completionPercent: getNum('completionPercent'),
      remarks: getVal('remarks') || undefined,
      monthlyTargets: Object.keys(monthlyTargets).length > 0 ? monthlyTargets : undefined,
    });
  }

  return items;
}

function parseTopicRows(rows: unknown[][], headers: string[]): ActionItem[] {
  const items: ActionItem[] = [];
  const monthColumns: { index: number; label: string }[] = [];

  // Detect month columns from headers
  headers.forEach((h, i) => {
    if (i < 2) return; // Skip Sr. no. and Topic columns
    if (h) {
      const raw = (headers as unknown[])[i];
      if (typeof raw === 'number') {
        monthColumns.push({ index: i, label: excelSerialToMonthLabel(raw) });
      } else if (typeof h === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(h.trim())) {
        const d = new Date(h.trim());
        const label = !isNaN(d.getTime())
          ? d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
          : h.trim();
        monthColumns.push({ index: i, label });
      } else if (h) {
        monthColumns.push({ index: i, label: String(h).trim() });
      }
    }
  });

  interface PendingTopic {
    srNo: number;
    topic: string;
    monthlyTargets: Record<string, string>;
    hasDetails: boolean;
  }

  let pendingTopic: PendingTopic | null = null;

  const flushPendingTopic = () => {
    if (!pendingTopic) return;
    // If no bullet details followed this topic header, create an ActionItem for the topic itself
    if (!pendingTopic.hasDetails) {
      const isDate = /^\d{4}-\d{2}-\d{2}$/.test(pendingTopic.topic);
      const isPastDate = isDate && new Date(pendingTopic.topic) < new Date();

      items.push({
        id: generateId(),
        srNo: pendingTopic.srNo,
        topic: isDate ? 'Scheduled Milestone' : pendingTopic.topic,
        actionDescription: isDate
          ? `Review / Action Meeting (${pendingTopic.topic})`
          : pendingTopic.topic,
        status: isPastDate ? 'Completed' : 'In Progress',
        priority: 'Medium',
        assignee: 'HR Team',
        department: 'HR / Communication',
        startDate: '',
        dueDate: isDate ? pendingTopic.topic : '',
        completionPercent: isPastDate ? 100 : 50,
        remarks: undefined,
        monthlyTargets:
          Object.keys(pendingTopic.monthlyTargets).length > 0
            ? pendingTopic.monthlyTargets
            : undefined,
      });
    }
    pendingTopic = null;
  };

  for (const row of rows) {
    if (!row || row.every((cell) => cell == null || String(cell).trim() === '')) continue;

    const firstCell = row[0];
    const secondCell = row[1];

    // Non-empty numeric first cell indicates a topic header
    const isNumericSrNo =
      firstCell != null &&
      String(firstCell).trim() !== '' &&
      !isNaN(Number(firstCell));

    if (isNumericSrNo && secondCell != null) {
      const topicText = String(secondCell).trim();
      if (topicText.length < 200 && !topicText.startsWith('•')) {
        flushPendingTopic();

        const monthlyTargets: Record<string, string> = {};
        monthColumns.forEach(({ index, label }) => {
          const val = row[index];
          if (val != null && String(val).trim()) {
            monthlyTargets[label] = String(val).trim();
          }
        });

        pendingTopic = {
          srNo: Number(firstCell),
          topic: topicText,
          monthlyTargets,
          hasDetails: false,
        };
        continue;
      }
    }

    // Detail/action row (bullet points or sub-text under topic)
    if (secondCell != null && String(secondCell).trim()) {
      const description = String(secondCell).trim();
      if (pendingTopic) {
        pendingTopic.hasDetails = true;
      }

      const currentTopic = pendingTopic ? pendingTopic.topic : 'General';
      const srNo = pendingTopic ? pendingTopic.srNo : items.length + 1;

      const bullets = description
        .split(/(?=•)/)
        .map((b) => b.replace(/^•\s*/, '').trim())
        .filter(Boolean);

      const itemsToAdd = bullets.length > 0 ? bullets : [description];

      for (const bullet of itemsToAdd) {
        const monthlyTargets: Record<string, string> = {};
        monthColumns.forEach(({ index, label }) => {
          const val = row[index];
          if (val != null && String(val).trim()) {
            monthlyTargets[label] = String(val).trim();
          }
        });

        items.push({
          id: generateId(),
          srNo,
          topic: currentTopic,
          actionDescription: bullet,
          status: 'In Progress',
          priority: 'Medium',
          assignee: '',
          department: '',
          startDate: '',
          dueDate: '',
          completionPercent: 50,
          remarks: undefined,
          monthlyTargets:
            Object.keys(monthlyTargets).length > 0 ? monthlyTargets : undefined,
        });
      }
    }
  }

  flushPendingTopic();
  return items;
}

function normalizeStatus(raw: string): ActionItem['status'] {
  const lower = raw.toLowerCase().trim();
  if (lower.includes('complet') || lower === 'done' || lower === 'closed') return 'Completed';
  if (lower.includes('progress') || lower === 'wip' || lower === 'ongoing' || lower === 'active')
    return 'In Progress';
  if (lower.includes('block') || lower === 'stuck' || lower === 'on hold' || lower === 'hold')
    return 'Blocked';
  if (lower.includes('overdue') || lower === 'delayed' || lower === 'late') return 'Overdue';
  if (
    lower.includes('not started') ||
    lower === 'pending' ||
    lower === 'open' ||
    lower === 'new' ||
    lower === ''
  )
    return 'Not Started';
  return 'Not Started';
}

function normalizePriority(raw: string): ActionItem['priority'] {
  const lower = raw.toLowerCase().trim();
  if (lower === 'high' || lower === 'critical' || lower === 'urgent' || lower === 'h') return 'High';
  if (lower === 'medium' || lower === 'med' || lower === 'normal' || lower === 'm') return 'Medium';
  if (lower === 'low' || lower === 'l' || lower === 'minor') return 'Low';
  return 'Medium';
}
