import { Film } from 'lucide-react';
import QuickAccess from '../components/QuickAccess';
import GrokChat from '../components/GrokChat';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page1({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-[#2d1554] text-white flex flex-col px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#2d1554] animate-pulse"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#2d1554_1px,_transparent_1px)] bg-[length:50px_50px]"></div>
        </div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2d1554]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2d1554]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      <div className="relative z-10 text-center flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="bg-[#2d1554]/30 backdrop-blur-sm p-6 rounded-2xl border border-[#7c3aed]/50 shadow-2xl">
            <Film className="w-20 h-20 text-white" />
          </div>
        </div>

        <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-[#7c3aed] via-[#7c3aed] to-[#7c3aed] bg-clip-text text-transparent">
            MANDASTRONG'S
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#7c3aed] via-[#7c3aed] to-[#7c3aed] bg-clip-text text-transparent">
            STUDIO
          </span>
        </h1>

        <p className="text-2xl md:text-3xl font-bold italic text-[#7c3aed]">
          Welcome To The All-In-One Make-A-Movie-With-Two-Hours-Duration App!
        </p>
      </div>

      <div className="relative z-10 pb-12 flex justify-center">
        <div className="flex gap-4 w-full max-w-2xl justify-center">
          <button
            onClick={() => onNavigate(2)}
            className="flex-1 bg-[#2d1554] text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#2d1554] transition-all transform hover:scale-105 shadow-xl"
          >
            Next
          </button>
          <button
            onClick={() => onNavigate(3)}
            className="flex-1 bg-[#2d1554] text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#2d1554] transition-all border-2 border-[#7c3aed] shadow-xl"
          >
            Login
          </button>
          <button
            onClick={() => onNavigate(3)}
            className="flex-1 bg-[#2d1554] text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#2d1554] transition-all border-2 border-[#7c3aed] shadow-xl"
          >
            Register
          </button>
        </div>
      </div>
      <QuickAccess onNavigate={onNavigate} />
      <GrokChat onNavigate={onNavigate} />
    </div>
  );
}
