import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from '@/context/DataContext';
import AppShell from '@/components/layout/AppShell';
import GlobalOverview from '@/pages/GlobalOverview';
import SheetView from '@/pages/SheetView';

export function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<GlobalOverview />} />
            <Route path="/sheet/:sheetKey" element={<SheetView />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
