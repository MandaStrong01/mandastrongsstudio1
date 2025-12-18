import { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(0);

  const handleNavigate = (page: number) => {
    setCurrentPage(page);
  };

  const pages = [
    <Page1 onNavigate={handleNavigate} />,
    <Page2 onNavigate={handleNavigate} />,
    <Page3 onNavigate={handleNavigate} />,
    <Page4 onNavigate={handleNavigate} />,
    <Page5 onNavigate={handleNavigate} />,
    <Page6 onNavigate={handleNavigate} />,
    <Page7 onNavigate={handleNavigate} />,
    <Page8 onNavigate={handleNavigate} />,
    <Page9 onNavigate={handleNavigate} />,
    <Page10 onNavigate={handleNavigate} />,
    <Page11 onNavigate={handleNavigate} />,
    <Page12 onNavigate={handleNavigate} />,
    <Page13 onNavigate={handleNavigate} />,
    <Page14 onNavigate={handleNavigate} />,
    <Page15 onNavigate={handleNavigate} />,
    <Page16 onNavigate={handleNavigate} />,
    <Page17 onNavigate={handleNavigate} />,
    <Page18 onNavigate={handleNavigate} />,
    <Page19 onNavigate={handleNavigate} />,
    <Page20 onNavigate={handleNavigate} />,
    <Page21 onNavigate={handleNavigate} />,
    <Page22 onNavigate={handleNavigate} />,
    <Page23 onNavigate={handleNavigate} />,
  ];

  return <>{pages[currentPage]}</>;
}
