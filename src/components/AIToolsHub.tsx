import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Search } from 'lucide-react';
import AIToolModal from './AIToolModal';
import Footer from './Footer';
import QuickAccess from './QuickAccess';
import { getToolsForPage } from '../data/aiTools';

interface AIToolsHubProps {
  tools: string[];
  pageNumber: number;
  onNavigate: (page: number) => void;
  onOpenAssetPage: (toolName: string, mode: 'upload' | 'create') => void;
}

export default function AIToolsHub({ tools, pageNumber, onNavigate, onOpenAssetPage }: AIToolsHubProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Search across all pages if there's a query, otherwise show current page
  const getFilteredTools = () => {
    if (!searchQuery.trim()) {
      return tools;
    }

    // Search across all tool pages
    const allTools: string[] = [];
    for (let page = 4; page <= 9; page++) {
      const pageTools = getToolsForPage(page);
      allTools.push(...pageTools);
    }

    return allTools.filter(tool =>
      tool.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredTools = getFilteredTools();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-6">
        <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="w-full md:w-80">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Search For Tool"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  />
                </div>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-purple-400 text-center md:text-right flex-1">AI TOOL BOARD</h1>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-purple-500/30 mb-6 flex-1 overflow-y-auto max-h-[600px]">
            {searchQuery.trim() && (
              <div className="mb-4 text-purple-300 text-sm">
                Found {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </div>
            )}

            {filteredTools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="w-16 h-16 text-purple-400/50 mb-4" />
                <h3 className="text-xl font-semibold text-purple-300 mb-2">No tools found</h3>
                <p className="text-purple-400/70">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTools.map((tool, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTool(tool)}
                    className="bg-purple-900/20 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/40 rounded-lg p-5 transition-all cursor-pointer text-left h-24 flex items-center justify-center"
                  >
                    <h3 className="font-semibold text-white text-base leading-tight text-center">
                      {tool}
                    </h3>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate(pageNumber - 1)}
              className="flex items-center justify-center gap-2 bg-black text-white font-bold px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg hover:bg-purple-900 transition-all border border-purple-500"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => onNavigate(pageNumber + 1)}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white font-bold px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg hover:bg-purple-500 transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <Footer />

      <QuickAccess onNavigate={onNavigate} />

      {selectedTool && (
        <AIToolModal
          toolName={selectedTool}
          onClose={() => setSelectedTool(null)}
          onOpenAssetPage={(mode) => {
            onOpenAssetPage(selectedTool, mode);
            setSelectedTool(null);
          }}
        />
      )}
    </div>
  );
}
