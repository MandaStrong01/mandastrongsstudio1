import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Page5 from './pages/Page5';
import Page6 from './pages/Page6';
import Page7 from './pages/Page7';
import Page8 from './pages/Page8';
import Page9 from './pages/Page9';
import Page10 from './pages/Page10';
import Page11 from './pages/Page11';
import Page12 from './pages/Page12';
import Page13 from './pages/Page13';
import Page14 from './pages/Page14';
import Page15 from './pages/Page15';
import Page16 from './pages/Page16';
import Page17 from './pages/Page17';
import Page18 from './pages/Page18';
import Page19 from './pages/Page19';
import Page20 from './pages/Page20';
import Page21 from './pages/Page21';

function AppContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (currentPage >= 4 && !user) {
      setCurrentPage(3);
    }
  }, [currentPage, user]);

  const navigate = (page: number) => {
    if (page >= 4 && !user) {
      setCurrentPage(3);
    } else {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const pages = [
    <Page1 key={1} onNavigate={navigate} />,
    <Page2 key={2} onNavigate={navigate} />,
    <Page3 key={3} onNavigate={navigate} />,
    <Page4 key={4} onNavigate={navigate} />,
    <Page5 key={5} onNavigate={navigate} />,
    <Page6 key={6} onNavigate={navigate} />,
    <Page7 key={7} onNavigate={navigate} />,
    <Page8 key={8} onNavigate={navigate} />,
    <Page9 key={9} onNavigate={navigate} />,
    <Page10 key={10} onNavigate={navigate} />,
    <Page11 key={11} onNavigate={navigate} />,
    <Page12 key={12} onNavigate={navigate} />,
    <Page13 key={13} onNavigate={navigate} />,
    <Page14 key={14} onNavigate={navigate} />,
    <Page15 key={15} onNavigate={navigate} />,
    <Page16 key={16} onNavigate={navigate} />,
    <Page17 key={17} onNavigate={navigate} />,
    <Page18 key={18} onNavigate={navigate} />,
    <Page19 key={19} onNavigate={navigate} />,
    <Page20 key={20} onNavigate={navigate} />,
    <Page21 key={21} onNavigate={navigate} />,
  ];

  return <>{pages[currentPage - 1]}</>;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
