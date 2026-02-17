import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Search } from 'lucide-react';
import AIToolModal from './AIToolModal';
import Footer from './Footer';
import QuickAccess from './QuickAccess';
import GrokChat from './GrokChat';

interface AIToolsHubProps {
  tools: string[];
  pageNumber: number;
  onNavigate: (page: number) => void;
  onOpenAssetPage: (toolName: string, mode: 'upload' | 'create') => void;
}

export default function AIToolsHub({ tools, pageNumber, onNavigate, onOpenAssetPage }: AIToolsHubProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toolInputs, setToolInputs] = useState<{ [key: number]: string }>({});

  const filteredTools = tools.filter(tool =>
    tool.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (index: number, value: string) => {
    setToolInputs(prev => ({ ...prev, [index]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d1554]/20 via-black to-[#2d1554]/20 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-6">
        <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="w-full md:flex-1 md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7c3aed]" />
                <input
                  type="text"
                  placeholder="Search For Tools"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-[#2d1554]/50 rounded-lg text-[#7c3aed] placeholder-[#7c3aed]/60 focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
            </div>

            <div className="hidden md:block md:w-48"></div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-[#2d1554]/30 mb-6 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map((tool, index) => (
                <div
                  key={index}
                  className="bg-[#2d1554]/20 border border-[#2d1554]/30 hover:border-[#7c3aed] rounded-lg p-4 transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[#7c3aed] text-xs leading-tight flex-1">
                      {tool}
                    </h3>
                    <span className="text-[#7c3aed]/60 text-xs font-bold shrink-0">#{index + 1}</span>
                  </div>
                  <input
                    type="text"
                    placeholder="What to create..."
                    value={toolInputs[index] || ''}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-3 py-2 bg-black/50 border border-[#2d1554]/50 rounded text-[#7c3aed] text-xs placeholder-[#7c3aed]/40 focus:outline-none focus:border-[#7c3aed]"
                  />
                  <button
                    onClick={() => setSelectedTool(tool)}
                    className="w-full bg-[#2d1554] hover:bg-[#2d1554]/80 text-[#7c3aed] font-bold py-2 rounded text-xs transition-all"
                  >
                    Open Tool
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate(pageNumber - 1)}
              className="flex items-center justify-center gap-2 bg-black text-white font-bold px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg hover:bg-[#2d1554] transition-all border border-[#2d1554]"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => onNavigate(pageNumber + 1)}
              className="flex items-center justify-center gap-2 bg-[#2d1554] text-white font-bold px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg hover:bg-[#2d1554] transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <Footer />

      <QuickAccess onNavigate={onNavigate} />
      <GrokChat onNavigate={onNavigate} />

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
