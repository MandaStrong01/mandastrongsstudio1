import { useState } from 'react';
import Landing from './components/Landing';
import Studio from './components/Studio';

export default function App() {
  const [showStudio, setShowStudio] = useState(false);

  if (showStudio) {
    return <Studio />;
  }

  return <Landing onGetStarted={() => setShowStudio(true)} />;
}
