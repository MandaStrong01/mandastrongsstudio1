import React, { useState, useEffect, useRef } from 'react';
import { Upload, Library, Wand2, Play, Sparkles, LayoutGrid } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Smooth persistence: Video plays for p1/p2, pauses for p3+
  useEffect(() => {
    if (videoRef.current) {
      if (page <= 2) {
        videoRef.current.play().catch(() => {}); 
      } else {
        videoRef.current.pause();
      }
    }
  }, [page]);

  const Navigation = () => (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-[100]">
      <button onClick={() => setPage(Math.max(1, page - 1))} className="bg-black text-white px-8 py-3 rounded-full font-black uppercase text-[10px] border border-white/20 hover:bg-white hover:text-black transition-all">← BACK</button>
      <button onClick={() => setPage(Math.min(21, page + 1))} className="bg-black text-white px-8 py-3 rounded-full font-black uppercase text-[10px] border border-white/20 hover:bg-white hover:text-black transition-all">NEXT →</button>
    </div>
  );

  return (
    <div className="h-screen bg-black overflow-hidden relative font-black italic">
      
      {/* PERSISTENT VIDEO LAYER (Prevents restart/loop errors between p1 and p2) */}
      <video 
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${page <= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        src="background.mp4"
        loop 
        muted={false}
        playsInline
      />

      {/* NODE 1: BEACH SPLASH (Image 1) */}
      {page === 1 && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
          <h1 className="text-8xl md:text-9xl text-black uppercase tracking-tighter mb-4 leading-none font-black">MANDASTRONG'S STUDIO</h1>
          <p className="text-2xl text-black uppercase font-bold tracking-tight">Welcome To The All-In-One Make-A-Movie App!</p>
          <div className="absolute bottom-20 flex gap-6">
            <button onClick={() => setPage(2)} className="bg-black text-white px-12 py-4 rounded-xl uppercase font-black tracking-widest hover:scale-105 transition-transform">Next</button>
          </div>
        </div>
      )}

      {/* NODE 2: STUDIO ENTRY (Image 2) */}
      {page === 2 && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
          <h1 className="text-8xl md:text-9xl text-black uppercase tracking-tighter mb-4 leading-none font-black">MANDASTRONG'S STUDIO</h1>
          <p className="text-3xl text-black uppercase max-w-4xl font-black px-10">Welcome! Make Awesome Family Movies Or Make Your Movie Dreams A Reality</p>
          <div className="absolute bottom-20 flex gap-6">
            <button onClick={() => setPage(1)} className="bg-black text-white px-12 py-4 rounded-xl uppercase font-black tracking-widest hover:scale-105 transition-transform">Back</button>
            <button onClick={() => setPage(3)} className="bg-black text-white px-12 py-4 rounded-xl uppercase font-black tracking-widest hover:scale-105 transition-transform">Next</button>
          </div>
        </div>
      )}

      {/* NODE 3: CONSOLIDATED ACCESS & PLANS ($20, $40, $80) */}
      {page === 3 && (
        <div className="h-full bg-black flex flex-col items-center p-8 border-[15px] border-zinc-900 overflow-y-auto pb-32 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl mt-8 mb-10">
            <div className="bg-[#1a0b2e] p-8 rounded-[3rem] border-2 border-purple-500/30 text-white text-center">
              <h2 className="text-4xl uppercase mb-6">Login</h2>
              <input type="email" placeholder="your@email.com" className="w-full bg-black p-4 rounded-xl border border-zinc-800 mb-4 outline-none focus:border-purple-500" />
              <button onClick={() => setPage(4)} className="w-full bg-purple-600 py-5 rounded-xl uppercase font-black tracking-widest shadow-xl active:scale-95 transition-transform">Login</button>
            </div>
            <div className="bg-[#1a0b2e] p-8 rounded-[3rem] border-2 border-purple-500/30 text-white text-center">
              <h2 className="text-4xl uppercase mb-6">Register</h2>
              <input type="text" placeholder="Your Name" className="w-full bg-black p-4 rounded-xl border border-zinc-800 mb-4 outline-none" />
              <button onClick={() => setPage(4)} className="w-full bg-purple-600 py-5 rounded-xl uppercase font-black tracking-widest shadow-xl active:scale-95 transition-transform">Create Account</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {[{t:"Basic", p:"20"}, {t:"Pro", p:"40"}, {t:"Studio", p:"80"}].map((plan, i) => (
              <div key={i} className="bg-[#0d0517] p-8 rounded-[2rem] border-2 border-purple-500/10 text-white text-center hover:border-purple-500/40 transition-colors">
                <h3 className="text-2xl mb-2 uppercase tracking-tighter">{plan.t}</h3>
                <div className="text-6xl mb-8 font-black tracking-tighter">${plan.p}</div>
                <button onClick={() => setPage(4)} className="w-full bg-purple-600 py-4 rounded-xl uppercase font-black shadow-lg">Select</button>
              </div>
            ))}
          </div>
          <Navigation />
        </div>
      )}

      {/* NODES 4+ FALLBACK */}
      {page >= 4 && (
        <div className="h-full bg-black border-[20px] border-zinc-900 flex flex-col items-center justify-center text-white italic font-black text-6xl opacity-20 uppercase">
          Node {page}
          <Navigation />
        </div>
      )}
    </div>
  );
}