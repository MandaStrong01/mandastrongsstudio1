import { useState, useEffect } from 'react';
import { MovieProject, supabase } from '../lib/supabase';
import { X, Save, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface ProjectEditorProps {
  project: MovieProject;
  onClose: () => void;
}

const phases = [
  {
    number: 1,
    title: 'Story & Concept',
    fields: [
      { key: 'concept', label: 'Movie Concept', type: 'textarea', placeholder: 'Describe your movie concept...' },
      { key: 'genre', label: 'Genre', type: 'text', placeholder: 'Action, Drama, Comedy, etc.' },
      { key: 'characters', label: 'Main Characters', type: 'textarea', placeholder: 'Describe your main characters...' },
      { key: 'theme', label: 'Theme', type: 'text', placeholder: 'What is the central theme?' },
    ],
  },
  {
    number: 2,
    title: 'Development',
    fields: [
      { key: 'script', label: 'Script Outline', type: 'textarea', placeholder: 'Write your script outline...' },
      { key: 'scenes', label: 'Key Scenes', type: 'textarea', placeholder: 'List and describe key scenes...' },
      { key: 'locations', label: 'Filming Locations', type: 'text', placeholder: 'Where will you film?' },
      { key: 'schedule', label: 'Production Schedule', type: 'text', placeholder: 'Timeline for production...' },
    ],
  },
  {
    number: 3,
    title: 'Production',
    fields: [
      { key: 'footage', label: 'Footage Notes', type: 'textarea', placeholder: 'Track your filmed footage...' },
      { key: 'editing', label: 'Editing Notes', type: 'textarea', placeholder: 'Editing decisions and notes...' },
      { key: 'music', label: 'Music & Sound', type: 'text', placeholder: 'Music and sound design notes...' },
      { key: 'effects', label: 'Visual Effects', type: 'text', placeholder: 'Special effects and post-production...' },
    ],
  },
];

export function ProjectEditor({ project, onClose }: ProjectEditorProps) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [duration, setDuration] = useState(project.duration);
  const [currentPhase, setCurrentPhase] = useState(project.current_phase - 1);
  const [phaseData, setPhaseData] = useState<Record<string, any>>({
    1: project.phase_1_data,
    2: project.phase_2_data,
    3: project.phase_3_data,
  });
  const [saving, setSaving] = useState(false);

  const currentPhaseConfig = phases[currentPhase];

  const updatePhaseField = (key: string, value: string) => {
    setPhaseData({
      ...phaseData,
      [currentPhaseConfig.number]: {
        ...phaseData[currentPhaseConfig.number],
        [key]: value,
      },
    });
  };

  const saveProject = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('movie_projects')
        .update({
          title,
          description,
          duration,
          current_phase: currentPhase + 1,
          phase_1_data: phaseData[1],
          phase_2_data: phaseData[2],
          phase_3_data: phaseData[3],
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const markAsComplete = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('movie_projects')
        .update({
          completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id);

      if (error) throw error;
      onClose();
    } catch (error) {
      console.error('Error marking as complete:', error);
      alert('Failed to mark project as complete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Target Duration (minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 120)}
                min="1"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="flex items-center justify-center gap-2 mb-6">
              {phases.map((phase, index) => (
                <button
                  key={phase.number}
                  onClick={() => setCurrentPhase(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    index === currentPhase
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Phase {phase.number}
                </button>
              ))}
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {currentPhaseConfig.title}
            </h3>

            <div className="space-y-4">
              {currentPhaseConfig.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={phaseData[currentPhaseConfig.number]?.[field.key] || ''}
                      onChange={(e) => updatePhaseField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={phaseData[currentPhaseConfig.number]?.[field.key] || ''}
                      onChange={(e) => updatePhaseField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
              disabled={currentPhase === 0}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous Phase
            </button>
            <button
              onClick={() => setCurrentPhase(Math.min(2, currentPhase + 1))}
              disabled={currentPhase === 2}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Phase
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2">
            {currentPhase === 2 && !project.completed && (
              <button
                onClick={markAsComplete}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" />
                Mark Complete
              </button>
            )}
            <button
              onClick={saveProject}
              disabled={saving}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
