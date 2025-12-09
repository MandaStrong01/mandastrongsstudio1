import { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page4({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const [genre, setGenre] = useState('');
  const [theme, setTheme] = useState('');
  const [logline, setLogline] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!user) {
      alert('Please sign in to use AI tools');
      return;
    }

    setLoading(true);
    const generatedConcept = `
MOVIE CONCEPT - ${genre.toUpperCase()}

Theme: ${theme}
Logline: ${logline}

Story Concept:
Your ${genre} story explores ${theme} through compelling characters and dramatic situations.
This concept has strong potential for visual storytelling with clear conflict and resolution paths.

Key Elements:
- Strong central conflict driven by ${theme}
- Character arcs that resonate with audiences
- Visual opportunities for dynamic cinematography
- Emotional beats that create audience connection

Next Steps:
- Develop your protagonist and antagonist
- Outline the three-act structure
- Identify key plot points and turning moments
    `.trim();

    setOutput(generatedConcept);

    try {
      await supabase.from('ai_tool_outputs').insert({
        user_id: user.id,
        tool_page: 4,
        tool_name: 'Story & Concept Generator',
        input_data: { genre, theme, logline },
        output_data: { concept: generatedConcept }
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
            <Lightbulb className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              STORY & CONCEPT AI
            </h1>
          </div>
          <p className="text-lg text-slate-400">
            Phase 1: Develop your movie's core concept with AI assistance
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g., Drama, Action, Thriller, Comedy"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Theme</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., Redemption, Coming of age, Justice"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Logline</label>
              <textarea
                value={logline}
                onChange={(e) => setLogline(e.target.value)}
                placeholder="A one-sentence description of your story..."
                rows={3}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40 resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!genre || !theme || !logline || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Generating...' : 'Generate Concept'}
            </button>
          </div>

          {output && (
            <div className="mt-6 p-6 bg-black/50 border border-green-500/30 rounded-lg">
              <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generated Concept
              </h3>
              <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {output}
              </pre>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(3)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => onNavigate(5)}
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
