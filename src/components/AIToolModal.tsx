import { X } from 'lucide-react';

interface AIToolModalProps {
  toolName: string;
  onClose: () => void;
}

export default function AIToolModal({ toolName, onClose }: AIToolModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{toolName}</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-black/50 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">About {toolName}</h3>
            <p className="text-slate-300 leading-relaxed">
              {toolName} is an advanced AI tool designed to enhance your creative workflow.
              This tool provides powerful capabilities for content generation, analysis, and automation.
            </p>
          </div>

          <div className="bg-black/50 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Advanced AI-powered generation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Real-time processing and analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Seamless integration with your workflow</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>High-quality output generation</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-center">
            <p className="text-white font-semibold mb-3">
              Tool integration coming soon!
            </p>
            <p className="text-white/80 text-sm">
              We're working on bringing you the best AI tools experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
