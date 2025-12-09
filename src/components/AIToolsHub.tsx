import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import AIToolModal from './AIToolModal';

interface AIToolsHubProps {
  tools: string[];
  pageNumber: number;
  onNavigate: (page: number) => void;
}

export default function AIToolsHub({ tools, pageNumber, onNavigate }: AIToolsHubProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              AI TOOLS HUB
            </h1>
          </div>
          <p className="text-xl text-slate-400">
            Page {pageNumber - 3} of 6 • {tools.length} AI Tools Available
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto pr-2">
            {tools.map((tool, index) => (
              <button
                key={index}
                onClick={() => setSelectedTool(tool)}
                className="bg-black/50 border border-white/20 hover:border-cyan-400 hover:bg-cyan-900/20 rounded-lg p-4 text-left transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-slate-400">#{(pageNumber - 4) * 120 + index + 1}</span>
                </div>
                <h3 className="font-semibold text-white text-sm leading-tight">
                  {tool}
                </h3>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(pageNumber - 1)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => onNavigate(pageNumber + 1)}
            className="flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-slate-200 transition-all"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {selectedTool && (
        <AIToolModal
          toolName={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
}
