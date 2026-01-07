import React, { useState, useEffect } from 'react';

export default function App() {
  const [activePage, setActivePage] = useState(0); 
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // Auto-boot sequence
  useEffect(() => {
    if (activePage === 0) {
      const timer = setTimeout(() => setActivePage(1), 1500);
      return () => clearTimeout(timer);
    }
  }, [activePage]);

  // NEW LOGIN LOGIC - HARD LINKED TO PAGE 11
  const triggerNewStudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'mandadmin@gmail.com' && adminPass === 'MandaStrong2026!') {
      setActivePage(11); // FORCES ENTRY TO NEW HUB
    } else {
      alert("Invalid Security Key for 2026 Engine");
    }
  };

  // --- PAGE 1: NEW GATEWAY ---
  if (activePage === 1) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white border-[20px] border-zinc-900">
      <div className="mb-4 text-purple-500 font-black uppercase tracking-widest text-[10px]">v2026 Active Build</div>
      <h1 className="text-8xl font-black uppercase italic tracking-tighter mb-12">Global Studio</h1>
      <button onClick={() => setActivePage(2)} className="bg-white text-black px-16 py-5 font-black uppercase text-sm rounded-full hover:bg-purple-600 hover:text-white transition-all">Login to Hub</button>
    </div>
  );

  // --- PAGE 2: SECURITY TERMINAL ---
  if (activePage === 2) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 border-2 border-purple-600 p-12 rounded-[3rem] shadow-2xl">
        <h2 className="text-2xl font-black uppercase italic mb-8 text-center text-white">Security Entry</h2>
        <form onSubmit={triggerNewStudio} className="space-y-4">
          <input 
            type="email" 
            placeholder="mandadmin@gmail.com" 
            className="w-full bg-black border border-zinc-800 p-5 text-xs font-bold rounded-xl text-white outline-none focus:border-purple-600" 
            value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="MandaStrong2026!" 
            className="w-full bg-black border border-zinc-800 p-5 text-xs font-bold rounded-xl text-white outline-none focus:border-purple-600" 
            value={adminPass} onChange={(e) => setAdminPass(e.target.value)} 
          />
          <button type="submit" className="w-full bg-purple-700 py-5 font-black uppercase text-xs rounded-xl hover:bg-purple-600 text-white transition-all shadow-xl">
            Unlock New Studio Hub
          </button>
        </form>
      </div>
    </div>
  );

  // --- PAGE 11: THE NEW HUB (LATEST UPDATE) ---
  if (activePage === 11) return (
    <div className="h-screen flex flex-col p-10 bg-black text-white animate-in fade-in duration-700">
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xl font-black uppercase italic tracking-tighter text-white leading-none">MandaStrong</span>
            <span className="text-[6px] font-black uppercase text-purple-500 tracking-[0.4em]">2026 HUB</span>
          </div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">Editor Suite</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setActivePage(12)} className="bg-zinc-800 border border-zinc-700 px-8 py-4 rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">Access Your Stuff</button>
          <button onClick={() => setActivePage(13)} className="bg-purple-900 border-2 border-purple-600 px-8 py-4 rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-purple-600 transition-all">Open Studio Suite</button>
        </div>
      </div>
      <div className="flex-1 bg-zinc-950 border-2 border-zinc-900 rounded-[4rem] flex flex-col items-center justify-center gap-4">
        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
        <p className="text-zinc-800 text-6xl font-black uppercase italic opacity-20 text-center select-none">New Engine Synced</p>
      </div>
    </div>
  );

  // --- FALLBACK NAVIGATION ---
  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white">
      <h2 className="text-4xl font-black uppercase italic mb-10 opacity-10">2026 Node: Page {activePage}</h2>
      <div className="flex gap-4">
        <button onClick={() => setActivePage(activePage - 1)} className="bg-zinc-800 px-10 py-4 text-xs font-black uppercase rounded-full">Back</button>
        <button onClick={() => setActivePage(activePage + 1)} className="bg-purple-700 px-10 py-4 text-xs font-black uppercase rounded-full">Next</button>
      </div>
    </div>
  );
