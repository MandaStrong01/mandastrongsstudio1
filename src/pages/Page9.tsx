import { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, ScrollText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page9({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const [sceneSetup, setSceneSetup] = useState('');
  const [characters, setCharacters] = useState('');
  const [dialogue, setDialogue] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!user) {
      alert('Please sign in to use AI tools');
      return;
    }

    setLoading(true);
    const generatedScript = `
INT. LOCATION - TIME

${sceneSetup}

CHARACTERS: ${characters}

${dialogue ? `
DIALOGUE:

${dialogue.split('\n').map(line => {
  const parts = line.split(':');
  if (parts.length >= 2) {
    const char = parts[0].trim();
    const dialog = parts.slice(1).join(':').trim();
    return `${char.toUpperCase()}\n${dialog}`;
  }
  return line;
}).join('\n\n')}
` : ''}

ACTION:

The scene unfolds with careful attention to visual storytelling.
Each moment builds on the last, creating tension and momentum.
Characters reveal themselves through action and dialogue.
The camera captures both the grand and the intimate.

BEAT.

A moment of realization crosses their face.

The energy shifts, driving toward the scene's resolution.

CUT TO:

---

Script Notes:
- Use action lines to describe what we SEE and HEAR
- Keep dialogue natural and character-specific
- Include beats and pauses for dramatic effect
- Indicate camera moves only when essential
- Format properly for production use
    `.trim();

    setOutput(generatedScript);

    try {
      await supabase.from('ai_tool_outputs').insert({
        user_id: user.id,
        tool_page: 9,
        tool_name: 'Script Writer',
        input_data: { sceneSetup, characters, dialogue },
        output_data: { script: generatedScript }
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
            <ScrollText className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              SCRIPT WRITER AI
            </h1>
          </div>
          <p className="text-lg text-slate-400">
            Write professional screenplay format scripts
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Scene Setup</label>
              <textarea
                value={sceneSetup}
                onChange={(e) => setSceneSetup(e.target.value)}
                placeholder="Describe the location and initial setup..."
                rows={3}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Characters in Scene</label>
              <input
                type="text"
                value={characters}
                onChange={(e) => setCharacters(e.target.value)}
                placeholder="e.g., JOHN, SARAH, DETECTIVE WILLIAMS"
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Key Dialogue (Optional)</label>
              <textarea
                value={dialogue}
                onChange={(e) => setDialogue(e.target.value)}
                placeholder="Character: What they say&#10;Character2: Their response"
                rows={4}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-white/40 resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!sceneSetup || !characters || loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Generating...' : 'Generate Script'}
            </button>
          </div>

          {output && (
            <div className="mt-6 p-6 bg-black/50 border border-cyan-500/30 rounded-lg">
              <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generated Script
              </h3>
              <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {output}
              </pre>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(8)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => onNavigate(10)}
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
