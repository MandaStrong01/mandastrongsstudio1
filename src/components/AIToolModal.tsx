import { X, Upload, Sparkles } from 'lucide-react';

interface AIToolModalProps {
  toolName: string;
  onClose: () => void;
  onOpenAssetPage: (mode: 'upload' | 'create') => void;
}

export default function AIToolModal({ toolName, onClose, onOpenAssetPage }: AIToolModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-purple-900/30 to-black/50 backdrop-blur-xl border-2 border-purple-500/60 rounded-2xl max-w-2xl w-full my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-xl border-b border-purple-500/30 p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-3xl font-bold text-purple-400 break-words pr-4">{toolName}</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <button
              onClick={() => onOpenAssetPage('upload')}
              className="bg-gradient-to-br from-purple-900/40 to-black/60 border-2 border-purple-500/50 hover:border-purple-400 active:border-purple-300 rounded-xl p-6 sm:p-8 transition-all group touch-manipulation"
            >
              <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl sm:text-2xl font-bold text-white">Upload</h4>
            </button>

            <button
              onClick={() => onOpenAssetPage('create')}
              className="bg-gradient-to-br from-purple-900/40 to-black/60 border-2 border-purple-500/50 hover:border-purple-400 active:border-purple-300 rounded-xl p-6 sm:p-8 transition-all group touch-manipulation"
            >
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl sm:text-2xl font-bold text-white">Create</h4>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
