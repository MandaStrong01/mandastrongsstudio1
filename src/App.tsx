import React, { useState, useEffect } from 'react';

// --- INDUSTRIAL 2025 BRANDING ---
const MandaLogo = () => (
  <div className="flex flex-col items-center select-none pointer-events-none">
    <span className="text-xl font-black uppercase italic tracking-tighter leading-none text-white">MandaStrong</span>
    <span className="text-[6px] font-black uppercase text-purple-500 tracking-[0.4em]">2025 Official Build</span>
  </div>
);

export default function App() {
  const [page, setPage] = useState(0); 
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  // PAGE 0 SPLASH: 2025 INITIALIZATION
  useEffect(() => {
    if (page === 0) {
      const timer = setTimeout(() => setPage(1), 1500);
      return () => clearTimeout(timer);
    }
  }, [page]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin' && pass === 'admin123manda') {
      setPage(11); 
    } else {
      alert("Unauthorized: Check Admin Credentials for 2025 Build");
    }
  };

  const next = () => setPage(p => Math.min(p + 1, 21));
  const back = () => setPage(p => Math.max(p - 1, 0));

  // --- PAGE 0: 2025 BOOT ---
  if (page === 0) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white font-mono uppercase tracking-[1em] animate-pulse text-[10px]">
      MandaStrong 2025 Initializing
    </div>
  );

  // --- PAGE 1: GLOBAL GATEWAY ---
  if (page === 1) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white border-[25px] border-zinc-900">
      <MandaLogo />
      <h1 className="text-9xl font-black uppercase italic mt-10 mb-12 tracking-tighter leading-none">Global</h1>
      <button 
        onClick={() => setPage(2)} 
        className="bg-white text-black px-16 py-5 font-black uppercase text-sm rounded-full hover:bg-purple-600 hover:text-white transition-all shadow-2xl"
      >
        Enter 2025 Engine
      </button>
    </div>
  );

  // --- PAGE 2: SECURITY TERMINAL ---
  if (page === 2) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 border-2 border-purple-600/30 p-12 rounded-[3.5rem] shadow-2xl">
        <h2 className="text-3xl font-black uppercase italic mb-8 text-center text-white tracking-tighter">2025 Entry</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="admin" 
            className="w-full bg-black border border-zinc-800 p-6 text-xs font-bold rounded-2xl text-white outline-none focus:border-purple-600" 
            value={email} onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="admin123manda" 
            className="w-full bg-black border border-zinc-800 p-6 text-xs font-bold rounded-2xl text-white mb-6 outline-none focus:border-purple-600" 
            value={pass} onChange={(e) => setPass(e.target.value)} 
          />
          <button type="submit" className="w-full bg-purple-700 py-6 font-black uppercase text-xs rounded-2xl hover:bg-purple-600 text-white transition-all shadow-xl">
            Unlock 2025 Hub
          </button>
        </form>
      </div>
    </div>
  );

  // --- PAGE 11: INTEGRATED 2025 HUB ---
  if (page === 11) return (
    <div className="h-screen flex flex-col p-10 bg-black text-white animate-in fade-in duration-1000">
      <div className="flex justify-between items-start mb-12">
        <div className="flex flex-col">
          <MandaLogo />
          <div className="flex items-center gap-2 mt-3">
             <span className="text-[8px] font-black uppercase text-purple-400 bg-purple-500/10 px-3 py-1 rounded border border-purple-500/30">PRO STATUS</span>
             <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">$30 / MO</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setPage(12)} className="bg-zinc-800 border-2 border-zinc-700 px-8 py-4 rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">YOUR STUFF</button>
          <button 
            onClick={() => setPage(13)} 
            className="bg-purple-900 border-2 border-purple-600 px-10 py-5 rounded-xl text-[12px] font-black uppercase shadow-[0_0_50px_rgba(168,85,247,0.5)] hover:scale-105 transition-all"
          >
            Open Global Video Editor
          </button>
        </div>
      </div>
      <div className="flex-1 bg-zinc-950 border-4 border-zinc-900 rounded-[5rem] flex flex-col items-center justify-center gap-8">
        <div className="w-5 h-5 bg-green-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
        <p className="text-zinc-800 text-[100px] font-black uppercase italic opacity-20 text-center select-none tracking-tighter leading-[0.8]">2025 ENGINE<br/>HUB LIVE</p>
      </div>
    </div>
  );

  // --- PAGE 21: 2025 FINALE ---
  if (page === 21) return (
    <div className="h-screen bg-black flex flex-col items-center p-12 text-white">
      <div className="w-full max-w-6xl aspect-video bg-zinc-900 border-[15px] border-zinc-800 mb-12 rounded-[3rem] flex items-center justify-center shadow-2xl">
        <p className="text-zinc-700 font-black italic uppercase text-3xl tracking-widest animate-pulse">2025 Synchronized</p>
      </div>
      <div className="max-w-4xl text-center space-y-12">
        <h2 className="text-7xl font-black uppercase italic text-purple-600 tracking-tighter">Master Finale</h2>
        <div className="bg-zinc-900/40 p-12 rounded-[2.5rem] border border-zinc-800 text-left">
          <p className="text-xs text-zinc-400 font-bold uppercase italic tracking-widest leading-loose">
            "My mission is to empower creators to reach the pinnacle of visual excellence." - MandaStrong1
          </p>
        </div>
        <button onClick={() => setPage(11)} className="text-zinc-700 font-black uppercase text-[10px] tracking-[2em] hover:text-white transition-all underline">Return to 2025 Hub</button>
      </div>
    </div>
  );

  // --- UNIVERSAL 0-21 FALLBACK ---
  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white border-[20px] border-zinc-900">
      <MandaLogo />
      <h2 className="text-[140px] font-black uppercase italic mt-12 mb-10 opacity-5 leading-none select-none">NODE {page}</h2>
      <div className="flex gap-6">
        <button onClick={back} className="bg-zinc-900 border border-zinc-800 px-12 py-4 text-xs font-black uppercase rounded-full hover:bg-white hover:text-black transition-all">← Back</button>
        <button onClick={next} className="bg-purple-700 px-12 py-4 text-xs font-black uppercase rounded-full shadow-xl">Next Node →</button>
      </div>
    </div>
  );
}
