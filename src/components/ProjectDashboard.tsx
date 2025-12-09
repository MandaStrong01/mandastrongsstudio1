import { useState } from 'react';
import { MovieProject, supabase } from '../lib/supabase';
import { Film, Trash2, Edit2, Clock, CheckCircle } from 'lucide-react';
import { ProjectEditor } from './ProjectEditor';

interface ProjectDashboardProps {
  projects: MovieProject[];
  onUpdate: () => void;
}

export function ProjectDashboard({ projects, onUpdate }: ProjectDashboardProps) {
  const [selectedProject, setSelectedProject] = useState<MovieProject | null>(null);

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('movie_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (selectedProject) {
    return (
      <ProjectEditor
        project={selectedProject}
        onClose={() => {
          setSelectedProject(null);
          onUpdate();
        }}
      />
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <Film className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          No projects yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Create your first movie project to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {project.description || 'No description'}
                </p>
              </div>
              {project.completed && (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{project.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Phase {project.current_phase}/3</span>
              </div>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(project.current_phase / 3) * 100}%` }}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedProject(project)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
