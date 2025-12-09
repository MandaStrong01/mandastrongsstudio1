import { Film, Sparkles } from 'lucide-react';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page2({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative z-10 text-center max-w-5xl">
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-2xl">
            <Sparkles className="w-20 h-20 text-white" />
          </div>
        </div>

        <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tight">
          MANDASTRONG'S
          <br />
          <span className="bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent">
            STUDIO
          </span>
        </h1>

        <p className="text-2xl md:text-3xl font-bold italic mb-6 text-slate-300">
          Welcome!
        </p>

        <p className="text-xl md:text-2xl font-semibold mb-12 text-slate-400">
          Make Awesome Family Movies Or Put Your Dreams Into Film Reality! Enjoy!
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => onNavigate(1)}
            className="bg-black/50 backdrop-blur-sm text-white font-bold px-10 py-4 rounded-lg text-lg hover:bg-black/70 transition-all border border-white/30 shadow-xl"
          >
            Back
          </button>
          <button
            onClick={() => onNavigate(3)}
            className="bg-white text-black font-bold px-10 py-4 rounded-lg text-lg hover:bg-slate-200 transition-all transform hover:scale-105 shadow-xl"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
