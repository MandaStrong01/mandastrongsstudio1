import { X, Upload, Sparkles } from 'lucide-react';

interface AIToolModalProps {
  toolName: string;
  onClose: () => void;
}

export default function AIToolModal({ toolName, onClose }: AIToolModalProps) {
  const handleUpload = () => {
    alert(`Upload your asset for ${toolName}`);
  };

  const handleCreate = () => {
    alert(`Create new asset with ${toolName}`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900/30 to-black/50 backdrop-blur-xl border-2 border-purple-500/60 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-xl border-b border-purple-500/30 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-purple-400">{toolName}</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-400 mb-3">Choose Your Option</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              You can either upload your own asset or let AI create one for you using {toolName}.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={handleUpload}
                className="bg-gradient-to-br from-purple-900/40 to-black/60 border-2 border-purple-500/50 hover:border-purple-400 rounded-xl p-6 transition-all group"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-bold text-white mb-2">Upload Asset</h4>
                <p className="text-white/70 text-sm">
                  Upload your own video, audio, image, or file to use with this tool
                </p>
              </button>

              <button
                onClick={handleCreate}
                className="bg-gradient-to-br from-purple-900/40 to-black/60 border-2 border-purple-500/50 hover:border-purple-400 rounded-xl p-6 transition-all group"
              >
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-bold text-white mb-2">Create with AI</h4>
                <p className="text-white/70 text-sm">
                  Let AI generate a new asset for you using advanced algorithms
                </p>
              </button>
            </div>
          </div>

          <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-3">About {toolName}</h3>
            <p className="text-white/80 leading-relaxed mb-4">
              {toolName} is a professional movie-making tool designed to streamline your creative workflow
              and help you achieve studio-quality results.
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">✓</span>
                <span>Professional-grade processing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">✓</span>
                <span>Real-time preview and editing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">✓</span>
                <span>Seamless integration with timeline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">✓</span>
                <span>Auto-save to Media Box on Page 11</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
