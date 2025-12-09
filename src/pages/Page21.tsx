import { Home, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

interface PageProps {
  onNavigate: (page: number) => void;
}

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
                <source src="/static/video/thatsallfolks.mp4" type="video/mp4" />
              </video>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-purple-400">
              THANK YOU CREATORS!
            </h1>

            <div className="max-w-3xl mx-auto mb-8 text-left bg-purple-900/20 rounded-lg p-6 border border-purple-500/30">
              <p className="text-lg text-white/90 mb-4 leading-relaxed">
                Thank you for being part of the MandaStrong Studio journey! Your creativity and passion
                bring stories to life. This platform was built to empower creators like you to make
                professional films without barriers.
              </p>
              <p className="text-lg text-white/90 mb-4 leading-relaxed">
                Every project you create, every story you tell, makes a difference. Keep creating,
                keep inspiring, and remember that your voice matters.
              </p>
              <p className="text-lg text-purple-400 font-semibold">
                Support our mission and find exclusive creator tools at{' '}
                <a
                  href="https://MandaStrong1.Etsy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-200 underline transition-colors"
                >
                  MandaStrong1.Etsy.com
                </a>
              </p>
            </div>

            <div className="bg-black/50 rounded-lg p-6 border border-purple-500/30 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">User Guide</h2>
              <ul className="text-left space-y-2 text-white/80">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Use the Back and Next buttons to navigate between pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Access Agent Grok on every page after login for live chat assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Pages 4-9 contain 720 AI tools to enhance your creative workflow</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Your generated assets are automatically saved to the Media Box</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Maximum film duration is 180 minutes depending on your plan</span>
                </li>
              </ul>
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
      <Footer />
    </div>
  );
}
