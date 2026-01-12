import { useState } from 'react';
import AIToolsHub from './AIToolsHub';
import AIToolModal from './AIToolModal';

export default function AIToolsView() {
  const [selectedTool, setSelectedTool] = useState<any>(null);

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">AI Tools Hub</h2>
          <p className="text-white/60">Generate videos, images, audio, and more with AI</p>
        </div>

        <AIToolsHub onSelectTool={setSelectedTool} />
      </div>

      {selectedTool && (
        <AIToolModal
          tool={selectedTool}
          isOpen={!!selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </>
  );
}
