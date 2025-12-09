import { ArrowLeft, Upload, Sparkles, File, Image, Video, Music, FileText } from 'lucide-react';
import { useState } from 'react';
import Footer from '../components/Footer';

interface Page22Props {
  onNavigate: (page: number) => void;
  toolName?: string;
  mode?: 'upload' | 'create';
}

export default function Page22({ onNavigate, toolName = "AI Tool", mode = "upload" }: Page22Props) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      alert(`File uploaded: ${e.dataTransfer.files[0].name}`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      alert(`File uploaded: ${e.target.files[0].name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-6">
        <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => onNavigate(4)}
              className="flex items-center gap-2 px-6 py-3 bg-black border border-purple-500/50 hover:bg-purple-900/50 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Tools
            </button>
            <h1 className="text-4xl font-black text-purple-400">{toolName}</h1>
            <div className="w-32"></div>
          </div>

          <div className="flex-1 bg-black/30 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl p-8">
            {mode === 'upload' ? (
              <div className="h-full flex flex-col">
                <div className="text-center mb-8">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                  <h2 className="text-3xl font-bold mb-2">Upload Your Asset</h2>
                  <p className="text-white/70">Drag and drop your file here or click to browse</p>
                </div>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`flex-1 border-2 border-dashed rounded-xl flex items-center justify-center transition-all ${
                    dragActive
                      ? 'border-purple-400 bg-purple-900/20'
                      : 'border-purple-500/50 hover:border-purple-400'
                  }`}
                >
                  <label className="cursor-pointer text-center">
                    <div className="grid grid-cols-5 gap-4 mb-6">
                      <div className="p-4 bg-purple-900/20 rounded-lg">
                        <Video className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                        <p className="text-xs text-white/70">Video</p>
                      </div>
                      <div className="p-4 bg-purple-900/20 rounded-lg">
                        <Image className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                        <p className="text-xs text-white/70">Image</p>
                      </div>
                      <div className="p-4 bg-purple-900/20 rounded-lg">
                        <Music className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                        <p className="text-xs text-white/70">Audio</p>
                      </div>
                      <div className="p-4 bg-purple-900/20 rounded-lg">
                        <FileText className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                        <p className="text-xs text-white/70">Document</p>
                      </div>
                      <div className="p-4 bg-purple-900/20 rounded-lg">
                        <File className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                        <p className="text-xs text-white/70">Other</p>
                      </div>
                    </div>
                    <p className="text-lg text-white/90 mb-2">Click to select files</p>
                    <p className="text-sm text-white/60">or drag and drop them here</p>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      multiple
                    />
                  </label>
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    onClick={() => onNavigate(11)}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-all"
                  >
                    Save to Media Box
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="text-center mb-8">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                  <h2 className="text-3xl font-bold mb-2">Create with AI</h2>
                  <p className="text-white/70">Generate a new asset using AI</p>
                </div>

                <div className="flex-1 bg-purple-900/10 border border-purple-500/30 rounded-xl p-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Asset Description</label>
                      <textarea
                        placeholder="Describe what you want to create..."
                        className="w-full h-32 bg-black/50 border border-purple-500/50 rounded-lg p-4 text-white placeholder-white/60 focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Style</label>
                        <select className="w-full bg-black/50 border border-purple-500/50 rounded-lg p-3 text-white focus:outline-none focus:border-purple-400">
                          <option>Cinematic</option>
                          <option>Realistic</option>
                          <option>Artistic</option>
                          <option>Abstract</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Quality</label>
                        <select className="w-full bg-black/50 border border-purple-500/50 rounded-lg p-3 text-white focus:outline-none focus:border-purple-400">
                          <option>Standard</option>
                          <option>High</option>
                          <option>Ultra</option>
                        </select>
                      </div>
                    </div>

                    <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-lg font-bold text-lg transition-all">
                      Generate Asset
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    onClick={() => onNavigate(11)}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-all"
                  >
                    Save to Media Box
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
