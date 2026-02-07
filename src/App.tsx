import React, { useState } from 'react';
import { 
  Film, Play, Save, User, Plus, ChevronRight, ChevronLeft, 
  Upload, Wand2, Settings, Shield, Star, Video, Music
} from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const planPrice = "Studio Master $50";

  // Navigation Logic
  const next = () => setCurrentPage(p => Math.min(p + 1, 21));
  const back = () => setCurrentPage(p => Math.max(p - 1, 0));

  // Fix 8: Enhancement Studio Boxes (30 Titles)
  const enhancementBoxes = Array.from({ length: 30 }, (_, i) => `Enhancement Tool ${i + 1}`);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
      {/* Global Theme: Deep Purple (#7e22ce) */}
      <style>{`.bg-deep-purple { background-color: #7e22ce; } .text-deep-purple { color: #7e22ce; }`}</style>

      {/* Fix 4: Navigation Bar */}
      {currentPage > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center gap-4 bg-black/80 backdrop-blur-md">
          <button onClick={back} className="flex items-center px-6 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition">
            <ChevronLeft size={20} /> Back
          </button>
          <button onClick={next} className="flex items-center px-6 py-2 bg-deep-purple rounded-full hover:opacity-90 transition">
            Next <ChevronRight size={20} />
          </button>
        </div>
      )}

      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
        
        {/* Fix 1: Page 0 Splash Screen */}
        {currentPage === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-in fade-in duration-1000">
            <div className="p-4 bg-deep-purple rounded-3xl mb-8 shadow-2xl shadow-purple-500/20">
              <Film size={80} />
            </div>
            <h1 className="text-7xl font-black tracking-tighter mb-4">MANDASTRONG STUDIO</h1>
            <p className="text-zinc-400 text-2xl max-w-2xl">The Professional Cinema Production Platform.</p>
            <button onClick={next} className="mt-12 px-10 py-4 bg-deep-purple rounded-full text-xl font-bold hover:scale-105 transition">
              Launch Studio
            </button>
          </div>
        )}

        {/* Fix 2: Page 1 Control Hub */}
        {currentPage === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
            <button onClick={() => setCurrentPage(2)} className="h-64 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center hover:border-purple-500 transition">
              <User size={40} className="mb-4 text-deep-purple" />
              <span className="text-xl font-bold">Login</span>
            </button>
            <button className="h-64 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center hover:border-purple-500 transition">
              <Plus size={40} className="mb-4 text-deep-purple" />
              <span className="text-xl font-bold">Register</span>
            </button>
            <button onClick={next} className="h-64 bg-deep-purple rounded-2xl flex flex-col items-center justify-center hover:opacity-90 transition shadow-lg shadow-purple-900/40">
              <ChevronRight size={40} className="mb-4" />
              <span className="text-xl font-bold">Next</span>
            </button>
          </div>
        )}

        {/* Fix 5 & 6: Page 3 Plans (Free Removed) */}
        {currentPage === 3 && (
          <div className="space-y-10">
            <div className="flex justify-center gap-4 mb-10">
              <button className="px-8 py-2 bg-zinc-800 rounded-lg">Login</button>
              <button className="px-8 py-2 bg-zinc-800 rounded-lg">Register</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Basic $20', 'Pro $30', 'Studio Master $50'].map((tier) => (
                <div key={tier} className={`p-8 rounded-2xl border ${tier.includes('50') ? 'border-purple-500 bg-zinc-900/50' : 'border-zinc-800 bg-zinc-900'}`}>
                  <h3 className="text-2xl font-bold mb-4">{tier}</h3>
                  <ul className="text-zinc-400 space-y-3 mb-8">
                    <li>• Advanced Cinema Tools</li>
                    <li>• No Watermark Export</li>
                    <li>• Cloud Asset Storage</li>
                  </ul>
                  <button className="w-full py-3 bg-deep-purple rounded-xl font-bold">Select Plan</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fix 7: Page 12 Asset Manager */}
        {currentPage === 12 && (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-bold">Asset Manager</h2>
              <button className="flex items-center gap-2 px-6 py-3 bg-deep-purple rounded-lg font-bold">
                <Upload size={20} /> Upload Asset
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="aspect-video bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-700">Empty Slot</div>)}
            </div>
          </div>
        )}

        {/* Fix 8: Page 13 Enhancement Studio */}
        {currentPage === 13 && (
          <div>
            <h2 className="text-4xl font-bold mb-8">Enhancement Studio</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {enhancementBoxes.map((title, i) => (
                <div key={i} className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-purple-500 cursor-pointer transition text-center text-sm font-medium">
                  {title}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fix 9: Page 21 Finale */}
        {currentPage === 21 && (
          <div className="text-center py-10 max-w-3xl mx-auto">
            <h2 className="text-5xl font-black mb-8 text-deep-purple">FINALE</h2>
            <div className="aspect-video bg-zinc-900 rounded-3xl mb-10 flex items-center justify-center border-2 border-dashed border-zinc-700">
              <Play size={60} className="text-zinc-700" />
            </div>
            <div className="p-8 bg-zinc-900 rounded-2xl border border-purple-500/30">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-zinc-400 leading-relaxed">
                MandaStrong Studio is dedicated to empowering creators. A portion of every Studio Master subscription goes toward our local fundraiser initiatives and community arts programs.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 w-full p-6 bg-black border-t border-zinc-900 text-center text-xs text-zinc-500">
        <p>MandaStrong Studio 2026 • Dedicated to Community Arts • MandaStrong1.Etsy.com</p>
      </footer>
    </div>
  );
};

export default App;