import { Trophy, ArrowLeft, Home } from 'lucide-react';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page21({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-4xl">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 rounded-full shadow-2xl">
            <Trophy className="w-20 h-20 text-white" />
          </div>
        </div>

        <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight">
          CONGRATULATIONS!
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 mb-12">
          You've completed the MandaStrong Studio tour!
          <br />
          Start creating your masterpiece today.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(20)}
            className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-black/70 transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => onNavigate(1)}
            className="flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-slate-200 transition-all"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
