import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Landing from './components/Landing';
import Studio from './components/Studio';
import AuthModal from './components/AuthModal';

export default function App() {
  const { user } = useAuth();
  const [view, setView] = useState<'landing' | 'studio'>('landing');
  const [showAuth, setShowAuth] = useState(false);

  const handleGetStarted = () => {
    if (user) {
      setView('studio');
    } else {
      setShowAuth(true);
    }
  };

  if (view === 'studio' && user) {
    return <Studio />;
  }

  return (
    <>
      <Landing onGetStarted={handleGetStarted} />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
