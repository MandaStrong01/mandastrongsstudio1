import { useState } from 'react';
import Header from './Header';
import StudioNav from './StudioNav';
import ProjectsDashboard from './ProjectsDashboard';
import AIToolsView from './AIToolsView';
import VideoEditor from './VideoEditor';
import AssetLibrary from './AssetLibrary';
import AuthModal from './AuthModal';
import AdminModal from './AdminModal';
import { useAuth } from '../contexts/AuthContext';

export default function Studio() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'projects' | 'ai-tools' | 'editor' | 'assets'>('projects');
  const [currentProjectId, setCurrentProjectId] = useState<string | undefined>();
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleEditProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    setActiveView('editor');
  };

  const renderView = () => {
    switch (activeView) {
      case 'projects':
        return <ProjectsDashboard onEditProject={handleEditProject} />;
      case 'ai-tools':
        return <AIToolsView />;
      case 'editor':
        return <VideoEditor projectId={currentProjectId} />;
      case 'assets':
        return <AssetLibrary />;
      default:
        return <ProjectsDashboard onEditProject={handleEditProject} />;
    }
  };

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Sign in to access Studio</h2>
            <p className="text-white/60 mb-6">Create an account to start making movies</p>
            <button
              onClick={() => setShowAuth(true)}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
            >
              Sign In / Register
            </button>
          </div>
        </div>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header
        onShowAuth={() => setShowAuth(true)}
        onShowAdmin={() => setShowAdmin(true)}
      />
      {activeView !== 'editor' && (
        <StudioNav activeView={activeView} onViewChange={setActiveView} />
      )}
      <div className={activeView === 'editor' ? 'h-[calc(100vh-64px)]' : ''}>
        {renderView()}
      </div>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
