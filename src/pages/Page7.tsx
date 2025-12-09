import { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page7({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const [characterRole, setCharacterRole] = useState('');
  const [personality, setPersonality] = useState('');
  const [backstory, setBackstory] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!user) {
      alert('Please sign in to use AI tools');
      return;
    }

    setLoading(true);
    const generatedProfile = `
CHARACTER PROFILE - ${characterRole.toUpperCase()}

Personality: ${personality}
Backstory: ${backstory}

Character Arc:
Starting Point: Character begins with limiting beliefs shaped by their past
Catalyst: An event forces them to confront their fears or assumptions
Journey: Through challenges, they discover inner strength and new perspectives
Transformation: Emerges changed, having grown beyond their original limitations

Physical Traits:
- Appearance should reflect their journey and personality
- Distinctive features that make them memorable
- Body language that conveys their emotional state
- Style choices that reveal character

Dialogue Style:
- Speech patterns reflect background and education
- Emotional state affects communication
- Unique phrases or verbal tics
- Subtext beneath surface dialogue

Relationships:
- Connections drive character growth
- Conflicts reveal true nature
- Alliances test loyalties
- Dynamics evolve throughout story

Motivations:
- External goal: What they want
- Internal need: What they truly require
- Obstacles: What stands in their way
- Stakes: What they stand to lose
    `.trim();

    setOutput(generatedProfile);

    try {
      await supabase.from('ai_tool_outputs').insert({
        user_id: user.id,
        tool_page: 7,
        tool_name: 'Character Developer',
        input_data: { characterRole, personality, backstory },
        output_data: { profile: generatedProfile }
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
            <Users className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              CHARACTER DEVELOPER AI
            </h1>
          </div>
          <p className="text-lg text-slate-400">
            Create compelling, multi-dimensional characters
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Character Role</label>
              <input
                type="text"
                value={characterRole}
                onChange={(e) => setCharacterRole(e.target.value)}
                placeholder="e.g., Protagonist, Antagonist, Mentor"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Personality Traits</label>
              <input
                type="text"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="e.g., Brave but impulsive, Reserved and analytical"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Backstory</label>
              <textarea
                value={backstory}
                onChange={(e) => setBackstory(e.target.value)}
                placeholder="Brief background that shapes who they are..."
                rows={3}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40 resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!characterRole || !personality || !backstory || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Generating...' : 'Generate Character Profile'}
            </button>
          </div>

          {output && (
            <div className="mt-6 p-6 bg-black/50 border border-blue-500/30 rounded-lg">
              <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Character Profile
              </h3>
              <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {output}
              </pre>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(6)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => onNavigate(8)}
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
