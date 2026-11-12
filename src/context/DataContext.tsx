import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { WorkbookData, SheetData, KpiMetrics, ActionItem } from '@/types';
import { parseWorkbook } from '@/lib/excel-parser';
import { computeKpis } from '@/lib/utils';
import { STORAGE_KEY } from '@/lib/constants';

interface DataState {
  workbook: WorkbookData | null;
  isLoading: boolean;
  error: string | null;
}

type DataAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: { sheets: SheetData[]; fileName: string } }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'CLEAR_DATA' };

function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_SUCCESS':
      return {
        isLoading: false,
        error: null,
        workbook: {
          sheets: action.payload.sheets,
          fileName: action.payload.fileName,
          uploadedAt: new Date().toISOString(),
        },
      };
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'CLEAR_DATA':
      return { workbook: null, isLoading: false, error: null };
    default:
      return state;
  }
}

interface DataContextType {
  workbook: WorkbookData | null;
  isLoading: boolean;
  error: string | null;
  loadWorkbook: (buffer: ArrayBuffer, fileName: string) => void;
  loadDefaultWorkbook: () => Promise<void>;
  clearData: () => void;
  getSheetByKey: (key: string) => SheetData | undefined;
  getSheetKpis: (key: string) => KpiMetrics | null;
  getGlobalKpis: () => KpiMetrics;
  getAllItems: () => ActionItem[];
  hasAnyData: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, {
    workbook: null,
    isLoading: false,
    error: null,
  });

  const loadWorkbook = useCallback((buffer: ArrayBuffer, fileName: string) => {
    dispatch({ type: 'LOAD_START' });
    try {
      const sheets = parseWorkbook(buffer);
      dispatch({ type: 'LOAD_SUCCESS', payload: { sheets, fileName } });
    } catch (err) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to parse Excel file',
      });
    }
  }, []);

  const loadDefaultWorkbook = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const response = await fetch('/default_action_plan.xlsx?t=' + Date.now());
      if (!response.ok) {
        throw new Error('Default workbook not found');
      }
      const buffer = await response.arrayBuffer();
      const sheets = parseWorkbook(buffer);
      dispatch({
        type: 'LOAD_SUCCESS',
        payload: { sheets, fileName: 'Action Plan 2026.xlsx' },
      });
    } catch (err) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to load default workbook',
      });
    }
  }, []);

  // Load from localStorage on mount, or fetch default workbook if none saved
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as WorkbookData;
        if (parsed.sheets && parsed.sheets.length > 0) {
          dispatch({
            type: 'LOAD_SUCCESS',
            payload: { sheets: parsed.sheets, fileName: parsed.fileName || 'Action Plan 2026.xlsx' },
          });
          return;
        }
      }
    } catch {
      // Ignore parse errors from localStorage
    }

    // If no stored workbook, automatically load the bundled Action Plan 2026.xlsx
    loadDefaultWorkbook();
  }, [loadDefaultWorkbook]);

  // Persist to localStorage on change
  useEffect(() => {
    if (state.workbook) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.workbook));
      } catch {
        // localStorage might be full
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state.workbook]);

  const clearData = useCallback(() => {
    dispatch({ type: 'CLEAR_DATA' });
  }, []);

  const getSheetByKey = useCallback(
    (key: string): SheetData | undefined => {
      return state.workbook?.sheets.find((s) => s.key === key);
    },
    [state.workbook]
  );

  const getSheetKpis = useCallback(
    (key: string): KpiMetrics | null => {
      const sheet = state.workbook?.sheets.find((s) => s.key === key);
      if (!sheet || sheet.items.length === 0) return null;
      return computeKpis(sheet.items);
    },
    [state.workbook]
  );

  const getAllItems = useCallback((): ActionItem[] => {
    if (!state.workbook) return [];
    return state.workbook.sheets.flatMap((s) => s.items);
  }, [state.workbook]);

  const getGlobalKpis = useCallback((): KpiMetrics => {
    const allItems = getAllItems();
    return computeKpis(allItems);
  }, [getAllItems]);

  const hasAnyData = state.workbook != null && state.workbook.sheets.some((s) => s.items.length > 0);

  return (
    <DataContext.Provider
      value={{
        workbook: state.workbook,
        isLoading: state.isLoading,
        error: state.error,
        loadWorkbook,
        loadDefaultWorkbook,
        clearData,
        getSheetByKey,
        getSheetKpis,
        getGlobalKpis,
        getAllItems,
        hasAnyData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
