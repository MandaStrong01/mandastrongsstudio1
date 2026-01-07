import React, { useState, useEffect } from 'react';

const MandaLogo = () => (
  <div className="flex flex-col items-center select-none pointer-events-none">
    <span className="text-xl font-black uppercase italic tracking-tighter leading-none text-white">MandaStrong</span>
    <span className="text-[6px] font-black uppercase text-purple-500 tracking-[0.4em]">CEO COMMAND</span>
  </div>
);

export default function App() {
  const [page, setPage] = useState(0); 
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    if (page === 0) {
      const timer = setTimeout(() => setPage(1), 1000);
      return () => clearTimeout(timer);
    }
  }, [page]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'ceo@gmail.com' && pass === 'theboss') {
      setPage(11); 
    } else {
      alert("ACCESS DENIED: Credentials must be exact.");
    }
  };

  const next = () => setPage(p => Math.min(p + 1, 21));
  const back = () => setPage(p => Math.max(p - 1, 0));

  // --- PAGE 1: GLOBAL GATEWAY ---
  if (page === 1) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white border-[20px] border-zinc-900">
      <MandaLogo />
      <h1 className="text-[100px] font-black uppercase italic mt-10 mb-12 tracking-tighter leading-none">Global</h1>
      <button onClick={() => setPage(2)} className="bg-white text-black px-16 py-5 font-black uppercase text-sm rounded-full hover:bg-purple-600 hover:text-white transition-all">Login to Studio</button>
    </div>
  );

  // --- PAGE 2: CEO LOGIN ---
  if (page === 2) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 border-2 border-purple-600/30 p-12 rounded-[3.5rem] shadow-2xl">
        <h2 className="text-3xl font-black uppercase italic mb-8 text-center text-white">CEO Access</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" placeholder="ceo@gmail.com" className="w-full bg-black border border-zinc-800 p-6 text-xs font-bold rounded-2xl text-white outline-none focus:border-purple-600" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="theboss" className="w-full bg-black border border-zinc-800 p-6 text-xs font-bold rounded-2xl text-white mb-6 outline-none focus:border-purple-600" value={pass} onChange={(e) => setPass(e.target.value)} />
          <button type="submit" className="w-full bg-purple-700 py-6 font-black uppercase text-xs rounded-2xl hover:bg-purple-600 text-white transition-all shadow-xl">Unlock Command Hub</button>
        </form>
      </div>
    </div>
  );

  // --- PAGE 11: GLOBAL STUDIO COMMAND HUB ---
  if (page === 11) return (
    <div className="h-screen flex flex-col p-10 bg-black text-white animate-in fade-in duration-500">
      <div className="flex justify-between items-start mb-12">
        <div className="flex flex-col">
          <MandaLogo />
          <div className="flex items-center gap-2 mt-3">
             <span className="text-[8px] font-black uppercase text-purple-400 bg-purple-500/10 px-3 py-1 rounded border border-purple-500/30">CEO PRO PLAN</span>
             <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">$30 / MONTHLY</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setPage(12)} className="bg-zinc-800 border-2 border-zinc-700 px-8 py-4 rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">Manage Assets</button>
          <button 
            onClick={() => setPage(13)} 
            className="bg-purple-900 border-2 border-purple-600 px-10 py-5 rounded-xl text-[12px] font-black uppercase shadow-[0_0_50px_rgba(168,85,247,0.5)] hover:bg-purple-600 transition-all"
          >
            Open Global Video Editor
          </button>
        </div>
      </div>
      <div className="flex-1 bg-zinc-950 border-4 border-zinc-900 rounded-[5rem] flex flex-col items-center justify-center gap-6">
        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
        <p className="text-zinc-800 text-[100px] font-black uppercase italic opacity-20 text-center select-none tracking-tighter leading-[0.85]">GLOBAL STUDIO<br/>HUB LIVE</p>
        <p className="text-zinc-900 font-black uppercase text-[10px] tracking-[1em]">SYSTEM STABLE // NO ERRORS</p>
      </div>
    </div>
  );

  // --- UNIVERSAL NAVIGATION ---
  if (page === 0) return null;
  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white border-[20px] border-zinc-900">
      <MandaLogo />
      <h2 className="text-[120px] font-black uppercase italic mt-12 mb-10 opacity-5 leading-none">NODE {page}</h2>
      <div className="flex gap-6">
        <button onClick={back} className="bg-zinc-900 border border-zinc-800 px-12 py-4 text-xs font-black uppercase rounded-full">← Back</button>
        <button onClick={next} className="bg-purple-700 px-12 py-4 text-xs font-black uppercase rounded-full shadow-xl">Next Node →</button>
      </div>
    </div>
  );
}