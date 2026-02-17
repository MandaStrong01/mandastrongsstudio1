import { useState } from 'react';
import { ArrowLeft, ArrowRight, Users, Share2, Star, Heart, ThumbsUp } from 'lucide-react';
import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';
import GrokChat from '../components/GrokChat';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page20({ onNavigate }: PageProps) {
  const [likes, setLikes] = useState<Record<number, { liked: boolean; loved: boolean }>>({});

  const toggleLike = (id: number) => {
    setLikes(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        liked: !prev[id]?.liked
      }
    }));
  };

  const toggleLove = (id: number) => {
    setLikes(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        loved: !prev[id]?.loved
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d1554]/20 via-black to-[#2d1554]/20 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-12">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-5xl font-black text-[#7c3aed] mb-4 text-center">Community Hub</h1>
          <p className="text-xl text-white/70 text-center mb-8">Connect, Share, and Inspire</p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-[#2d1554]/30 p-6 text-center hover:border-[#7c3aed] transition-all cursor-pointer">
              <Users className="w-12 h-12 mx-auto mb-4 text-[#7c3aed]" />
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-white/70">Join thousands of creators</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-[#2d1554]/30 p-6 text-center hover:border-[#7c3aed] transition-all cursor-pointer">
              <Share2 className="w-12 h-12 mx-auto mb-4 text-[#7c3aed]" />
              <h3 className="text-xl font-bold mb-2">Showcase</h3>
              <p className="text-white/70">Share your projects</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-[#2d1554]/30 p-6 text-center hover:border-[#7c3aed] transition-all cursor-pointer">
              <Star className="w-12 h-12 mx-auto mb-4 text-[#7c3aed]" />
              <h3 className="text-xl font-bold mb-2">Featured</h3>
              <p className="text-white/70">Get recognized</p>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-[#2d1554]/30 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-[#7c3aed]">Featured Projects</h2>
            <p className="text-white/70 mb-6 text-center">A welcoming space for creators to share their artwork. Show your appreciation!</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-black/50 rounded-lg border border-[#2d1554]/30 p-4 hover:border-[#7c3aed] transition-all">
                  <div className="aspect-video bg-[#2d1554]/20 rounded-lg mb-3 flex items-center justify-center">
                    <Star className="w-8 h-8 text-[#7c3aed]" />
                  </div>
                  <h4 className="font-semibold mb-1">Creator Project #{i}</h4>
                  <p className="text-xs text-white/60 mb-3">By MandaStrong Creator</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => toggleLike(i)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                        likes[i]?.liked
                          ? 'bg-[#2d1554] text-white'
                          : 'bg-[#2d1554]/30 text-white/70 hover:bg-[#2d1554]/50'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">Like</span>
                    </button>
                    <button
                      onClick={() => toggleLove(i)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                        likes[i]?.loved
                          ? 'bg-[#2d1554] text-white'
                          : 'bg-[#2d1554]/30 text-white/70 hover:bg-[#2d1554]/50'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">Love</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate(19)}
              className="flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#2d1554] transition-all border border-[#2d1554]"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => onNavigate(21)}
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
