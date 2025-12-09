import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Search } from 'lucide-react';
import AIToolModal from './AIToolModal';
import Footer from './Footer';

interface AIToolsHubProps {
  tools: string[];
  pageNumber: number;
  onNavigate: (page: number) => void;
}

export default function AIToolsHub({ tools, pageNumber, onNavigate }: AIToolsHubProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = tools.filter(tool =>
    tool.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-6">
        <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search For Tools"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <h1 className="text-4xl font-black text-purple-400 mx-auto">AI TOOL BOARD</h1>

            <button
              onClick={() => onNavigate(3)}
              className="ml-4 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-all"
            >
              Quick Access
            </button>
          </div>

          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 mb-6 flex-1 overflow-y-auto">
            <div className="grid grid-cols-4 gap-3">
              {filteredTools.map((tool, index) => (
                <div
                  key={index}
                  className="bg-purple-900/20 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/40 rounded-lg p-4 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-semibold text-white text-sm leading-tight mb-3">
                    {tool}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTool(tool)}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-1.5 px-2 rounded transition-all"
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => setSelectedTool(tool)}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-1.5 px-2 rounded transition-all"
                    >
                      Create
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate(pageNumber - 1)}
              className="flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-900 transition-all border border-purple-500"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => onNavigate(pageNumber + 1)}
              className="flex items-center gap-2 bg-purple-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-500 transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {selectedTool && (
        <AIToolModal
          toolName={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
}
