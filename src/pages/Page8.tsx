import { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, Layout } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page8({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const [sceneAction, setSceneAction] = useState('');
  const [pacing, setPacing] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!user) {
      alert('Please sign in to use AI tools');
      return;
    }

    setLoading(true);
    const generatedStoryboard = `
STORYBOARD BREAKDOWN - ${pacing.toUpperCase()} PACING

Scene Action: ${sceneAction}

Panel 1: ESTABLISHING SHOT
Frame: Wide view setting the location and time
Action: ${sceneAction.split('.')[0]}
Camera: Static or slow push
Duration: ${pacing === 'fast' ? '2-3 seconds' : pacing === 'medium' ? '4-5 seconds' : '6-8 seconds'}

Panel 2: CHARACTER INTRODUCTION
Frame: Medium shot of main character(s)
Action: Character enters or reacts to situation
Camera: ${pacing === 'fast' ? 'Quick pan' : pacing === 'medium' ? 'Smooth tracking' : 'Slow dolly'}
Duration: ${pacing === 'fast' ? '3-4 seconds' : pacing === 'medium' ? '5-7 seconds' : '8-10 seconds'}

Panel 3: ACTION BEAT
Frame: Close-up of key action or reaction
Action: Critical moment of the scene
Camera: ${pacing === 'fast' ? 'Handheld, dynamic' : pacing === 'medium' ? 'Steady, focused' : 'Deliberate, composed'}
Duration: ${pacing === 'fast' ? '2-3 seconds' : pacing === 'medium' ? '4-6 seconds' : '7-9 seconds'}

Panel 4: DETAIL SHOT
Frame: Insert of important object or gesture
Action: Visual information crucial to story
Camera: Macro or extreme close-up
Duration: ${pacing === 'fast' ? '1-2 seconds' : pacing === 'medium' ? '3-4 seconds' : '5-6 seconds'}

Panel 5: REACTION SHOT
Frame: Character response to action
Action: Emotional beat
Camera: Close-up, steady
Duration: ${pacing === 'fast' ? '2-3 seconds' : pacing === 'medium' ? '4-5 seconds' : '6-8 seconds'}

Panel 6: RESOLUTION
Frame: Wide or medium establishing new status
Action: Scene concludes
Camera: Pull back or cut to new angle
Duration: ${pacing === 'fast' ? '2-3 seconds' : pacing === 'medium' ? '5-6 seconds' : '8-10 seconds'}

Transitions: ${pacing === 'fast' ? 'Quick cuts' : pacing === 'medium' ? 'Standard cuts with occasional dissolve' : 'Longer takes with smooth transitions'}
    `.trim();

    setOutput(generatedStoryboard);

    try {
      await supabase.from('ai_tool_outputs').insert({
        user_id: user.id,
        tool_page: 8,
        tool_name: 'Storyboard Generator',
        input_data: { sceneAction, pacing },
        output_data: { storyboard: generatedStoryboard }
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
            <Layout className="w-10 h-10 text-pink-400" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              STORYBOARD GENERATOR AI
            </h1>
          </div>
          <p className="text-lg text-slate-400">
            Visualize your scenes shot by shot
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Scene Action</label>
              <textarea
                value={sceneAction}
                onChange={(e) => setSceneAction(e.target.value)}
                placeholder="Describe what happens in this scene..."
                rows={4}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Pacing</label>
              <select
                value={pacing}
                onChange={(e) => setPacing(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40"
              >
                <option value="">Select pacing...</option>
                <option value="fast">Fast - Action/Thriller</option>
                <option value="medium">Medium - Balanced</option>
                <option value="slow">Slow - Drama/Suspense</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!sceneAction || !pacing || loading}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:from-pink-700 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Generating...' : 'Generate Storyboard'}
            </button>
          </div>

          {output && (
            <div className="mt-6 p-6 bg-black/50 border border-pink-500/30 rounded-lg">
              <h3 className="font-bold text-pink-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Storyboard Breakdown
              </h3>
              <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {output}
              </pre>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(7)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => onNavigate(9)}
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
