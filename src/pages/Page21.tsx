import { Home, ArrowLeft, BookOpen } from 'lucide-react';
import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';

interface PageProps {
  onNavigate: (page: number) => void;
}

const EXTERNAL_URLS = {
  guide: import.meta.env.VITE_ETSY_GUIDE_URL || 'https://mandastrong.etsy.com/guide',
  store: import.meta.env.VITE_ETSY_STORE_URL || 'https://mandastrong.etsy.com',
};

const VIDEO_PATH = import.meta.env.VITE_OUTRO_VIDEO_PATH || '/static/video/thatsallfolks.mp4';

export default function Page21({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full text-center">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 mb-8">
            <div className="aspect-video bg-black rounded-lg overflow-hidden border border-purple-500/30 mb-6">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={VIDEO_PATH} type="video/mp4" />
              </video>
            </div>

            <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tight text-purple-400">
              THAT'S ALL FOLKS!
            </h1>

            <div className="max-w-4xl mx-auto mb-8 text-center bg-gradient-to-br from-purple-900/40 to-black/40 rounded-2xl p-12 border-2 border-purple-400/50 shadow-2xl">
              <p className="text-2xl text-white font-semibold mb-6 leading-relaxed">
                Thank you for exploring MandaStrong Studio!
              </p>
              <p className="text-xl text-white/90 leading-relaxed">
                This platform was created to empower storytellers like you to bring your visions to life.
                Every film you create, every story you tell, makes a difference in the world.
              </p>
            </div>

            <button
              onClick={() => window.open(EXTERNAL_URLS.guide, '_blank')}
              className="w-full max-w-2xl mx-auto mb-6 bg-black/50 hover:bg-purple-900/40 rounded-xl p-6 border border-purple-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <BookOpen className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                <h2 className="text-2xl font-bold text-purple-400">Full User Guide To MandaStrong Studio</h2>
              </div>
              <p className="text-sm text-white/60">Click to access the complete guide</p>
            </button>

            <div className="max-w-2xl mx-auto mb-8 bg-black/30 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-purple-400 mb-4">About MandaStrong</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                MandaStrong Studio is more than just a platform—it's part of a humanitarian mission to support
                creators and communities worldwide. A portion of all proceeds goes toward charitable initiatives
                helping those in need.
              </p>
              <p className="text-white/80 leading-relaxed">
                Learn more about our mission and find exclusive creative tools at{' '}
                <a
                  href={EXTERNAL_URLS.store}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-200 underline font-semibold transition-colors"
                >
                  {EXTERNAL_URLS.store}
                </a>
              </p>
            </div>

            <div className="bg-black/50 rounded-2xl p-8 border border-purple-500/30 mb-6 hidden">
              <div className="flex items-center justify-center gap-3 mb-6">
                <BookOpen className="w-8 h-8 text-purple-400" />
                <h2 className="text-3xl font-bold text-purple-400">Full User Guide To MandaStrong Studio</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <h3 className="font-bold text-purple-400 mb-2">Navigation</h3>
                  <p className="text-white/80 text-sm">• Use Back and Next buttons to navigate between pages</p>
                  <p className="text-white/80 text-sm">• Pages 1-3: Welcome, Story & Concept, Login/Register</p>
                  <p className="text-white/80 text-sm">• Pages 4-9: AI Tool Board with 720 creative tools</p>
                  <p className="text-white/80 text-sm">• Page 10: Upload your existing movie</p>
                  <p className="text-white/80 text-sm">• Page 11: Media Box with all generated assets</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-purple-400 mb-2">Editing & Export</h3>
                  <p className="text-white/80 text-sm">• Pages 12-16: Professional editing tools with timeline</p>
                  <p className="text-white/80 text-sm">• Page 17: Full screen preview of your finished film</p>
                  <p className="text-white/80 text-sm">• Page 18: Terms of Service and Disclaimer</p>
                  <p className="text-white/80 text-sm">• Page 19: Agent Grok 24/7 Help Desk</p>
                  <p className="text-white/80 text-sm">• Page 20: Community Hub to share your work</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-purple-400 mb-2">Tools & Features</h3>
                  <p className="text-white/80 text-sm">• Search Bar: Find specific AI tools quickly</p>
                  <p className="text-white/80 text-sm">• Upload/Create buttons: Generate or import assets</p>
                  <p className="text-white/80 text-sm">• Timeline: 4 tracks (SRT, VIDEO, AUDIO, TEXT)</p>
                  <p className="text-white/80 text-sm">• Maximum duration: 180 minutes (3 hours)</p>
                  <p className="text-white/80 text-sm">• All assets auto-save to Media Box on Page 11</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-purple-400 mb-2">Subscription Plans</h3>
                  <p className="text-white/80 text-sm">• BASIC ($10/mo): 30-minute films</p>
                  <p className="text-white/80 text-sm">• PRO ($20/mo): 1-hour films</p>
                  <p className="text-white/80 text-sm">• STUDIO ($30/mo): 2.5-hour films</p>
                  <p className="text-white/80 text-sm">• All plans include access to 720 AI tools</p>
                  <p className="text-white/80 text-sm">• Cancel anytime with 30-day refund policy</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate(20)}
              className="flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-900 transition-all border border-purple-500"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => onNavigate(1)}
              className="flex items-center gap-2 bg-purple-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-500 transition-all"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
          </div>
        </div>
      </div>
      <QuickAccess onNavigate={onNavigate} />
      <Footer />
    </div>
  );
}
