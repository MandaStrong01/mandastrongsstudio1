import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import MediaLibrary from './pages/MediaLibrary';
import Export from './pages/Export';
import VideoManager from './pages/VideoManager';
import Page11 from './pages/Page11';
import VideoStudio from './pages/VideoStudio';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
            <Route path="/media-library" element={<ProtectedRoute><MediaLibrary /></ProtectedRoute>} />
            <Route path="/video-studio" element={<ProtectedRoute><VideoStudio /></ProtectedRoute>} />
            <Route path="/export" element={<ProtectedRoute><Export /></ProtectedRoute>} />
            <Route path="/video-manager" element={<AdminRoute><VideoManager /></AdminRoute>} />
            <Route path="/page11" element={<ProtectedRoute><Page11 /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;