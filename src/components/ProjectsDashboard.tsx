import { useState, useEffect } from 'react';
import { Plus, Film, Clock, Trash2, Play, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  duration: number;
  updated_at: string;
  thumbnail_url?: string;
}

interface ProjectsDashboardProps {
  onEditProject: (projectId: string) => void;
}

export default function ProjectsDashboard({ onEditProject }: ProjectsDashboardProps) {
  const { user, subscription } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(30);

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('movie_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading projects:', error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const createProject = async () => {
    if (!user || !newProjectName.trim()) return;

    const maxAllowed = subscription?.maxDuration || 30;
    const finalDuration = Math.min(selectedDuration, maxAllowed);

    const { data, error } = await supabase
      .from('movie_projects')
      .insert({
        user_id: user.id,
        title: newProjectName.trim(),
        description: '',
        duration: finalDuration,
        settings: { resolution: '1080p', fps: 30 },
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
    } else if (data) {
      setProjects([data, ...projects]);
      setNewProjectName('');
      setSelectedDuration(30);
      setShowNewProject(false);
      onEditProject(data.id);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const { error } = await supabase
      .from('movie_projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
    } else {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white/60">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">My Projects</h2>
          <p className="text-white/60">Create and manage your movie projects</p>
        </div>
        <button
          onClick={() => setShowNewProject(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {showNewProject && (
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Create New Project</h3>
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createProject()}
            placeholder="Enter project name..."
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 mb-6"
            autoFocus
          />

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-white font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Movie Duration: {formatDuration(selectedDuration)}
              </label>
              {!subscription && (
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Crown className="w-3 h-3" />
                  Subscribe for up to 180 min
                </div>
              )}
            </div>

            <input
              type="range"
              min="0"
              max={subscription?.maxDuration || 180}
              step="5"
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              style={{
                background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${(selectedDuration / (subscription?.maxDuration || 180)) * 100}%, rgb(51, 65, 85) ${(selectedDuration / (subscription?.maxDuration || 180)) * 100}%, rgb(51, 65, 85) 100%)`
              }}
            />

            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>0 min</span>
              <span className="text-white/70">
                {subscription ? `Max: ${subscription.maxDuration} min` : 'Max: 180 min (Subscribe)'}
              </span>
            </div>

            {!subscription && selectedDuration > 30 && (
              <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-amber-400 text-sm flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Subscribe to create movies longer than 30 minutes
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={createProject}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewProject(false);
                setNewProjectName('');
                setSelectedDuration(30);
              }}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <Film className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-white/60 text-lg mb-2">No projects yet</h3>
          <p className="text-white/40 mb-6">Create your first movie project to get started</p>
          <button
            onClick={() => setShowNewProject(true)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-800/30 border border-white/10 rounded-xl overflow-hidden hover:border-blue-400/50 transition-all group"
            >
              <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative">
                <Film className="w-12 h-12 text-white/20" />
                <button
                  onClick={() => onEditProject(project.id)}
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1 truncate">{project.title}</h3>
                <div className="flex items-center gap-4 text-sm text-white/50 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(project.duration)}
                  </div>
                  <span>{formatDate(project.updated_at)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditProject(project.id)}
                    className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors font-medium"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
