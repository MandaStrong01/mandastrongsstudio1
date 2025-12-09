import { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, Clapperboard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page6({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const [sceneDescription, setSceneDescription] = useState('');
  const [mood, setMood] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!user) {
      alert('Please sign in to use AI tools');
      return;
    }

    setLoading(true);
    const generatedPlan = `
PRODUCTION PLAN - ${mood.toUpperCase()} SCENE

Scene Description: ${sceneDescription}
Target Mood: ${mood}

Camera Setup:
- Primary: Wide establishing shot to set location
- Medium: Character close-ups for emotional beats
- Detail: Insert shots of key props and actions
- Movement: ${mood === 'tense' ? 'Handheld for energy' : mood === 'dramatic' ? 'Slow dolly moves' : 'Smooth tracking shots'}

Lighting Plan:
- Key Light: ${mood === 'dark' ? 'Low-key, dramatic shadows' : mood === 'bright' ? 'Soft, even illumination' : 'Natural, motivated lighting'}
- Fill: Subtle to maintain depth
- Practical: Use environment lights for authenticity
- Color Temperature: ${mood === 'warm' ? '3200K warm tones' : mood === 'cold' ? '5600K cool tones' : '4500K balanced'}

Shot List:
1. Wide establishing - Set the scene and geography
2. Over-shoulder - Character interactions
3. Close-ups - Emotional reactions
4. Cutaways - Environmental details
5. Master - Coverage for editing flexibility

Sound Considerations:
- Ambient sound capture
- Room tone recording
- Dialogue clarity
- Effects recording
    `.trim();

    setOutput(generatedPlan);

    try {
      await supabase.from('ai_tool_outputs').insert({
        user_id: user.id,
        tool_page: 6,
        tool_name: 'Production Planner',
        input_data: { sceneDescription, mood },
        output_data: { plan: generatedPlan }
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
            <Clapperboard className="w-10 h-10 text-green-400" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              PRODUCTION PLANNER AI
            </h1>
          </div>
          <p className="text-lg text-slate-400">
            Phase 3: Plan camera, lighting, and shot execution
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Scene Description</label>
              <textarea
                value={sceneDescription}
                onChange={(e) => setSceneDescription(e.target.value)}
                placeholder="Describe the scene you want to shoot..."
                rows={4}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Scene Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40"
              >
                <option value="">Select mood...</option>
                <option value="dramatic">Dramatic</option>
                <option value="tense">Tense</option>
                <option value="bright">Bright & Cheerful</option>
                <option value="dark">Dark & Moody</option>
                <option value="warm">Warm & Intimate</option>
                <option value="cold">Cold & Clinical</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!sceneDescription || !mood || loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Generating...' : 'Generate Production Plan'}
            </button>
          </div>

          {output && (
            <div className="mt-6 p-6 bg-black/50 border border-green-500/30 rounded-lg">
              <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Production Plan
              </h3>
              <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {output}
              </pre>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(5)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => onNavigate(7)}
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
