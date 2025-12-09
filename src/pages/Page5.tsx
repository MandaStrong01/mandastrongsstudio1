import { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page5({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const [concept, setConcept] = useState('');
  const [acts, setActs] = useState('3');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!user) {
      alert('Please sign in to use AI tools');
      return;
    }

    setLoading(true);
    const generatedOutline = `
DEVELOPMENT OUTLINE - ${acts} ACT STRUCTURE

Story Concept: ${concept}

ACT I - SETUP:
- Introduce protagonist in their ordinary world
- Establish central conflict and stakes
- Inciting incident that disrupts the status quo
- Decision point: protagonist commits to journey

${acts === '3' ? `
ACT II - CONFRONTATION:
- Rising action and obstacles
- Midpoint: major revelation or turning point
- Protagonist faces setbacks and challenges
- Darkest moment: all seems lost
- Revelation or new approach emerges

ACT III - RESOLUTION:
- Climactic confrontation
- Protagonist uses lessons learned
- Resolution of central conflict
- New equilibrium established
- Character transformation complete
` : `
ACT II-A - RISING ACTION:
- Initial attempts to solve the problem
- Introduction of complications
- Midpoint: false victory or defeat
- Stakes increase dramatically

ACT II-B - FALLING ACTION:
- Major setback or revelation
- Darkest moment for protagonist
- Discovery of inner strength or solution
- Preparation for final confrontation

ACT III - RESOLUTION:
- Climactic sequence
- Resolution of all plot threads
- Character arc completion
- Denouement and new status quo
`}

Production Schedule:
Week 1-2: Pre-production planning
Week 3-4: Location scouting and casting
Week 5-8: Principal photography
Week 9-10: Post-production and editing
Week 11-12: Final revisions and delivery
    `.trim();

    setOutput(generatedOutline);

    try {
      await supabase.from('ai_tool_outputs').insert({
        user_id: user.id,
        tool_page: 5,
        tool_name: 'Development Planner',
        input_data: { concept, acts },
        output_data: { outline: generatedOutline }
      });
    } catch (error) {
      console.error('Error saving output:', error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-orange-400" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              DEVELOPMENT PLANNER AI
            </h1>
          </div>
          <p className="text-lg text-slate-400">
            Phase 2: Structure your story and plan production
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Story Concept</label>
              <textarea
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Describe your story concept..."
                rows={4}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Structure</label>
              <select
                value={acts}
                onChange={(e) => setActs(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40"
              >
                <option value="3">3-Act Structure</option>
                <option value="4">4-Act Structure</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!concept || loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Generating...' : 'Generate Outline'}
            </button>
          </div>

          {output && (
            <div className="mt-6 p-6 bg-black/50 border border-orange-500/30 rounded-lg">
              <h3 className="font-bold text-orange-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Development Outline
              </h3>
              <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {output}
              </pre>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(4)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => onNavigate(6)}
            className="flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-slate-200 transition-all"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
