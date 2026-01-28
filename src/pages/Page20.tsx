import { ArrowLeft, ArrowRight, Users, Share2, Star, Play } from 'lucide-react';
import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page20({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white flex flex-col">
      <button className="fixed top-6 right-6 z-50 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 transition-all hover:scale-110">
        <Play className="w-6 h-6 text-white" />
      </button>
      <div className="flex-1 flex flex-col px-4 py-12">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-5xl font-black text-purple-400 mb-4 text-center">Community Hub</h1>
          <p className="text-xl text-white/70 text-center mb-8">Connect, Share, and Inspire</p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 text-center hover:border-purple-400 transition-all cursor-pointer">
              <Users className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-white/70">Join thousands of creators</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 text-center hover:border-purple-400 transition-all cursor-pointer">
              <Share2 className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-2">Showcase</h3>
              <p className="text-white/70">Share your projects</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 text-center hover:border-purple-400 transition-all cursor-pointer">
              <Star className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-2">Featured</h3>
              <p className="text-white/70">Get recognized</p>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Featured Projects</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-black/50 rounded-lg border border-purple-500/30 p-4 hover:border-purple-400 transition-all cursor-pointer">
                  <div className="aspect-video bg-purple-900/20 rounded-lg mb-3 flex items-center justify-center">
                    <Star className="w-8 h-8 text-purple-400" />
                  </div>
                  <h4 className="font-semibold mb-1">Creator Project #{i}</h4>
                  <p className="text-xs text-white/60">By MandaStrong Creator</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate(18)}
              className="flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-900 transition-all border border-purple-500"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => onNavigate(20)}
              className="flex items-center gap-2 bg-purple-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-500 transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <QuickAccess onNavigate={onNavigate} />
      <Footer />
    </div>
  );
}
