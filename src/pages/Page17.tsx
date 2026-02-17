import { ArrowLeft, ArrowRight, Maximize } from 'lucide-react';
import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';
import GrokChat from '../components/GrokChat';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page17({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d1554]/20 via-black to-[#2d1554]/20 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-6">
        <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
          <h1 className="text-3xl font-black text-[#7c3aed] mb-4 text-center">DOXY THE SCHOOL BULLY - Full Screen Preview</h1>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-[#2d1554]/30 p-4 mb-4 flex-1">
            <div className="w-full h-full bg-black rounded-lg border border-[#2d1554]/30 flex items-center justify-center">
              <div className="text-center">
                <Maximize className="w-20 h-20 mx-auto mb-4 text-[#7c3aed]" />
                <p className="text-xl text-white/90 font-semibold mb-2">Your Film Result</p>
                <p className="text-white/70">Full screen viewer for your completed film</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate(16)}
              className="flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#2d1554] transition-all border border-[#2d1554]"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => onNavigate(18)}
              className="flex items-center gap-2 bg-[#2d1554] text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#2d1554] transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <QuickAccess onNavigate={onNavigate} />
      <GrokChat onNavigate={onNavigate} />
      <Footer />
    </div>
  );
}
