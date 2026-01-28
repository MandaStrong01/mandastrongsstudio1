import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
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
import Page22 from './pages/Page22';

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1: return <Page1 onNavigate={navigate} />;
      case 2: return <Page2 onNavigate={navigate} />;
      case 3: return <Page3 onNavigate={navigate} />;
      case 4: return <Page4 onNavigate={navigate} />;
      case 5: return <Page5 onNavigate={navigate} />;
      case 6: return <Page6 onNavigate={navigate} />;
      case 7: return <Page7 onNavigate={navigate} />;
      case 8: return <Page8 onNavigate={navigate} />;
      case 9: return <Page9 onNavigate={navigate} />;
      case 10: return <Page10 onNavigate={navigate} />;
      case 11: return <Page11 onNavigate={navigate} />;
      case 12: return <Page12 onNavigate={navigate} />;
      case 13: return <Page13 onNavigate={navigate} />;
      case 14: return <Page14 onNavigate={navigate} />;
      case 15: return <Page15 onNavigate={navigate} />;
      case 16: return <Page16 onNavigate={navigate} />;
      case 17: return <Page17 onNavigate={navigate} />;
      case 18: return <Page18 onNavigate={navigate} />;
      case 19: return <Page19 onNavigate={navigate} />;
      case 20: return <Page20 onNavigate={navigate} />;
      case 21: return <Page21 onNavigate={navigate} />;
      case 22: return <Page22 onNavigate={navigate} />;
      default: return <Page1 onNavigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black">
        {renderPage()}
      </div>
    </AuthProvider>
  );
}