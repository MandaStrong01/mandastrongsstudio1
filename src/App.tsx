import { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';

const Page1 = lazy(() => import('./pages/Page1'));
const Page2 = lazy(() => import('./pages/Page2'));
const Page3 = lazy(() => import('./pages/Page3'));
const Page4 = lazy(() => import('./pages/Page4'));
const Page5 = lazy(() => import('./pages/Page5'));
const Page6 = lazy(() => import('./pages/Page6'));
const Page7 = lazy(() => import('./pages/Page7'));
const Page8 = lazy(() => import('./pages/Page8'));
const Page9 = lazy(() => import('./pages/Page9'));
const Page10 = lazy(() => import('./pages/Page10'));
const Page11 = lazy(() => import('./pages/Page11'));
const Page12 = lazy(() => import('./pages/Page12'));
const Page13 = lazy(() => import('./pages/Page13'));
const Page14 = lazy(() => import('./pages/Page14'));
const Page15 = lazy(() => import('./pages/Page15'));
const Page16 = lazy(() => import('./pages/Page16'));
const Page17 = lazy(() => import('./pages/Page17'));
const Page18 = lazy(() => import('./pages/Page18'));
const Page19 = lazy(() => import('./pages/Page19'));
const Page20 = lazy(() => import('./pages/Page20'));
const Page21 = lazy(() => import('./pages/Page21'));
const Page22 = lazy(() => import('./pages/Page22'));
const Page23 = lazy(() => import('./pages/Page23'));

function AppContent() {
  const [currentPage, setCurrentPage] = useState(0);
  const [assetPageData, setAssetPageData] = useState<{ toolName: string; mode: 'upload' | 'create' } | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (currentPage >= 3 && !user) {
      setCurrentPage(2);
    }
  }, [currentPage, user]);

  const navigate = (page: number) => {
    if (page >= 3 && !user) {
      setCurrentPage(2);
    } else {
      setAssetPageData(null);
      setCurrentPage(page);
    }
  };

  const openAssetPage = (toolName: string, mode: 'upload' | 'create') => {
    setAssetPageData({ toolName, mode });
    setCurrentPage(21);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const pages = [
    <Page1 key={0} onNavigate={navigate} />,
    <Page2 key={1} onNavigate={navigate} />,
    <Page3 key={2} onNavigate={navigate} />,
    <Page4 key={3} onNavigate={navigate} onOpenAssetPage={openAssetPage} />,
    <Page5 key={4} onNavigate={navigate} onOpenAssetPage={openAssetPage} />,
    <Page6 key={5} onNavigate={navigate} onOpenAssetPage={openAssetPage} />,
    <Page7 key={6} onNavigate={navigate} onOpenAssetPage={openAssetPage} />,
    <Page8 key={7} onNavigate={navigate} onOpenAssetPage={openAssetPage} />,
    <Page9 key={8} onNavigate={navigate} onOpenAssetPage={openAssetPage} />,
    <Page10 key={9} onNavigate={navigate} />,
    <Page11 key={10} onNavigate={navigate} />,
    <Page12 key={11} onNavigate={navigate} />,
    <Page13 key={12} onNavigate={navigate} />,
    <Page14 key={13} onNavigate={navigate} />,
    <Page15 key={14} onNavigate={navigate} />,
    <Page16 key={15} onNavigate={navigate} />,
    <Page17 key={16} onNavigate={navigate} />,
    <Page18 key={17} onNavigate={navigate} />,
    <Page19 key={18} onNavigate={navigate} />,
    <Page20 key={19} onNavigate={navigate} />,
    <Page21 key={20} onNavigate={navigate} />,
    <Page22 key={21} onNavigate={navigate} toolName={assetPageData?.toolName} mode={assetPageData?.mode} />,
    <Page23 key={22} onNavigate={navigate} />,
  ];

  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="text-white text-xl font-bold">Loading...</div>
        </div>
      }>
        {pages[currentPage]}
      </Suspense>
    </>
  );
}

export default function App() {
  return <AppContent />;
}
