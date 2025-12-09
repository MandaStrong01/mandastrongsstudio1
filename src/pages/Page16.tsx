import { useState } from 'react';
import { ArrowLeft, ArrowRight, Palette, Download, Save } from 'lucide-react';
import Timeline from '../components/Timeline';
import Footer from '../components/Footer';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page16({ onNavigate }: PageProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-6">
        <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
          <h1 className="text-3xl font-black text-purple-400 mb-4 text-center">DOXY THE SCHOOL BULLY - Color Grade / Visual FX</h1>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-4 mb-4 flex-1">
            <div className="aspect-video bg-black rounded-lg border border-purple-500/30 mb-4 flex items-center justify-center">
              <div className="text-center">
                <Palette className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <p className="text-white/70">Apply LUTs, Filters, Transitions, and Effects</p>
                <div className="flex gap-4 justify-center mt-6">
                  <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-semibold transition-all">
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-semibold transition-all">
                    <Save className="w-5 h-5" />
                    Export
                  </button>
                  <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-semibold transition-all">
                    <Save className="w-5 h-5" />
                    Save
                  </button>
                </div>
              </div>
            </div>

            <Timeline
              duration={duration}
              currentTime={currentTime}
              onSeek={setCurrentTime}
            />
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate(15)}
              className="flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-900 transition-all border border-purple-500"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => onNavigate(17)}
              className="flex items-center gap-2 bg-purple-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-500 transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
