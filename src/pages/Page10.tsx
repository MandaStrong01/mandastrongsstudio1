import { Film, ArrowLeft, ArrowRight } from 'lucide-react';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page10({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-12 h-12" />
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              DOXY: THE SCHOOL BULLY
            </h1>
          </div>
          <p className="text-xl text-slate-400 italic">
            Your completed film is now live!
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-8">
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center border border-white/20">
            <div className="text-center">
              <Film className="w-20 h-20 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-500 text-lg">
                Video player placeholder
              </p>
              <p className="text-slate-600 text-sm mt-2">
                Upload your completed movie to view it here
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(9)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => onNavigate(11)}
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
