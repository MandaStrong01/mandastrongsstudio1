import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './components/Landing';
import Studio from './components/Studio';
import ProjectsDashboard from './components/ProjectsDashboard';
import MyMovies from './components/MyMovies';
import MediaLibrary from './pages/MediaLibrary';
import AIToolsView from './components/AIToolsView';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/projects" element={<ProjectsDashboard />} />
          <Route path="/my-movies" element={<MyMovies />} />
          <Route path="/media-library" element={<MediaLibrary />} />
          <Route path="/ai-tools" element={<AIToolsView />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
