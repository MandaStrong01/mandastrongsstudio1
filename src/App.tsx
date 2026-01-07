import React, { useState, useEffect } from 'react';

// --- INDUSTRIAL BRANDING ---
const MandaLogo = () => (
  <div className="flex flex-col items-center select-none pointer-events-none">
    <span className="text-xl font-black uppercase italic tracking-tighter leading-none text-white">MandaStrong</span>
    <span className="text-[6px] font-black uppercase text-purple-500 tracking-[0.4em]">Global Production</span>
  </div>
);

export default function App() {
  const [page, setPage] = useState(0); 
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isPro, setIsPro] = useState(false);

  // System Boot
  useEffect(() => {
    if (page === 0) {
      const timer = setTimeout(() => setPage(1), 1000);
      return () => clearTimeout(timer);
    }
  }, [page]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.length > 2 && pass.length > 2) {
      // Logic: If user uses your CEO creds, auto-upgrade them to Pro
      if (email === 'ceo@gmail.com') setIsPro(true);
      setPage(11); 
    } else {
      alert("Please enter valid credentials to initialize session.");
    }
  };

  // --- PAGE 1: GATEWAY ---
  if (page === 1) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white border-[20px] border-zinc-900">
      <MandaLogo />
      <h1 className="text-[100px] font-black uppercase italic mt-10 mb-12 tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800">Global</h1>
      <button onClick={() => setPage(2)} className="bg-white text-black px-20 py-6 font-black uppercase text-sm rounded-full hover:bg-purple-600 hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">Login to Studio</button>
    </div>
  );

  // --- PAGE 2: AUTHENTICATION ---
  if (page === 2) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 border-2 border-purple-600/20 p-12 rounded-[3.5rem] shadow-2xl">
        <h2 className="text-3xl font-black uppercase italic mb-8 text-center text-white">Production Entry</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email Address" className="w-full bg-black border border-zinc-800 p-6 text-xs font-bold rounded-2xl text-white outline-none focus:border-purple-600" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full bg-black border border-zinc-800 p-6 text-xs font-bold rounded-2xl text-white mb-6 outline-none focus:border-purple-600" value={pass} onChange={(e) => setPass(e.target.value)} required />
          <button type="submit" className="w-full bg-purple-700 py-6 font-black uppercase text-xs rounded-2xl hover:bg-purple-600 text-white transition-all shadow-xl">Unlock Command Hub</button>
        </form>
      </div>
    </div>
  );

  // --- PAGE 11: GLOBAL STUDIO HUB ---
  if (page === 11) return (
    <div className="h-screen flex flex-col p-10 bg-black text-white animate-in fade-in duration-700">
      <div className="flex justify-between items-start mb-12">
        <div className="flex flex-col">
          <MandaLogo />
          <div className="flex items-center gap-2 mt-3">
             <span className={`text-[9px] font-black uppercase px-3 py-1 rounded border ${isPro ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' : 'text-zinc-500 border-zinc-800'}`}>
               {isPro ? 'PRO STATUS' : 'FREE ACCOUNT'}
             </span>
             {isPro && <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">$30 / MO</span>}
          </div>
        </div>
        <div className="flex gap-4">
          {!isPro && (
            <button onClick={() => setIsPro(true)} className="bg-green-600 px-8 py-4 rounded-xl text-[10px] font-black uppercase hover:bg-green-500 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)]">Upgrade to $30 Pro</button>
          )}
          <button onClick={() => setPage(12)} className="bg-zinc-800 border-2 border-zinc-700 px-8 py-4 rounded-xl text-[10px] font-black uppercase">Your Assets</button>
          <button onClick={() => setPage(13)} className="bg-purple-900 border-2 border-purple-600 px-10 py-5 rounded-xl text-[10px] font-black uppercase shadow-[0_0_50px_rgba(168,85,247,0.4)]">Open Global Editor</button>
        </div>
      </div>
      <div className="flex-1 bg-zinc-950 border-4 border-zinc-900 rounded-[5rem] flex flex-col items-center justify-center gap-6 relative">
        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
        <p className="text-zinc-800 text-[100px] font-black uppercase italic opacity-20 text-center select-none tracking-tighter leading-[0.85]">GLOBAL STUDIO<br/>LIVE ENGINE</p>
      </div>
    </div>
  );

  // Universal Fallback (Nodes 3-10, 12-21)
  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white border-[20px] border-zinc-900">
      <MandaLogo />
      <h2 className="text-[120px] font-black uppercase italic mt-12 mb-10 opacity-5 leading-none">NODE {page}</h2>
      <div className="flex gap-6">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} className="bg-zinc-900 border border-zinc-800 px-12 py-4 text-xs font-black uppercase rounded-full">← Back</button>
        <button onClick={() => setPage(p => Math.min(21, p + 1))} className="bg-purple-700 px-12 py-4 text-xs font-black uppercase rounded-full shadow-xl">Next Node →</button>
      </div>
    </div>
  );
}