import { useState } from 'react';
import Landing from './components/Landing';
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
import Page23 from './pages/Page23';

export default function App() {
  const [page, setPage] = useState(0);

  const handleNavigate = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (page === 0) {
    return <Landing onGetStarted={() => setPage(1)} />;
  }

  if (page === 1) {
    return <Page2 onNavigate={handleNavigate} />;
  }

  if (page === 2) {
    return <Page3 onNavigate={handleNavigate} />;
  }

  if (page === 3) {
    return <Page4 onNavigate={handleNavigate} />;
  }

  if (page === 4) {
    return <Page5 onNavigate={handleNavigate} />;
  }

  if (page === 5) {
    return <Page6 onNavigate={handleNavigate} />;
  }

  if (page === 6) {
    return <Page7 onNavigate={handleNavigate} />;
  }

  if (page === 7) {
    return <Page8 onNavigate={handleNavigate} />;
  }

  if (page === 8) {
    return <Page9 onNavigate={handleNavigate} />;
  }

  if (page === 9) {
    return <Page10 onNavigate={handleNavigate} />;
  }

  if (page === 10) {
    return <Page11 onNavigate={handleNavigate} />;
  }

  if (page === 11) {
    return <Page12 onNavigate={handleNavigate} />;
  }

  if (page === 12) {
    return <Page13 onNavigate={handleNavigate} />;
  }

  if (page === 13) {
    return <Page14 onNavigate={handleNavigate} />;
  }

  if (page === 14) {
    return <Page15 onNavigate={handleNavigate} />;
  }

  if (page === 15) {
    return <Page16 onNavigate={handleNavigate} />;
  }

  if (page === 16) {
    return <Page17 onNavigate={handleNavigate} />;
  }

  if (page === 17) {
    return <Page18 onNavigate={handleNavigate} />;
  }

  if (page === 18) {
    return <Page19 onNavigate={handleNavigate} />;
  }

  if (page === 19) {
    return <Page20 onNavigate={handleNavigate} />;
  }

  if (page === 20) {
    return <Page21 onNavigate={handleNavigate} />;
  }

  if (page === 21) {
    return <Page22 onNavigate={handleNavigate} />;
  }

  if (page === 22) {
    return <Page23 onNavigate={handleNavigate} />;
  }

  return <Landing onGetStarted={() => setPage(1)} />;
}
