import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './components/Landing';
import Studio from './components/Studio';
import AuthModal from './components/AuthModal';

function AppContent() {
  const [showStudio, setShowStudio] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  if (showStudio) {
    return <Studio />;
  }

  return (
    <>
      <Landing onGetStarted={handleGetStarted} />
      <button
        onClick={() => setShowStudio(true)}
        className="fixed bottom-6 right-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        Enter Studio
      </button>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
