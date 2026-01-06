import React, { useState, useEffect } from 'react';

// --- 1. THE MEDIA ENGINE (Tier-Aware Rendering) ---
const VideoStudio = ({ onClose, duration, setDuration, tier }: any) => {
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const systemCommands = [
    `> INITIALIZING ${tier.toUpperCase()} CORE...`,
    "> MAPPING 4K TEXTURE BUFFERS...",
    "> SYNCING AUDIO MASTER 7.1...",
    "> APPLYING CINE-COLOR LUT: NOIR_PREMIUM",
    "> UPSCALE ENGINE: 100% QUALITY LOCK",
    "> INJECTING AI FRAME INTERPOLATION...",
    "> FINALIZING MASTER RENDER PIPELINE..."
  ];

  const startRender = () => {
    setIsRendering(true);
    let i = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        if (i < systemCommands.length && prev % 12 === 0) {
          setLogs(prevLogs => [...prevLogs, systemCommands[i]]);
          i++;
        }
        return prev + 2.5; 
      });
    }, 150);
  };

  return (
    <div className="fixed inset-0 bg-black z-[2000] flex flex-col font-sans text-white border-2 border-purple-600 animate-in fade-in zoom-in duration-300">
      <div className="h-14 bg-zinc-900 flex justify-between items-center px-6 border-b border-purple-500 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,1)]" />
          <span className="text-purple-400 font-black uppercase tracking-[0.4em] text-[10px] italic">Engine Core // {tier}</span>
        </div>
        <button onClick={onClose} className="text-white hover:text-purple-400 font-bold text-2xl transition-all">✕</button>
      </div>

      <div className="flex-1 flex p-8 gap-8 bg-black overflow-hidden relative">
        <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 p-6 font-mono text-[9px] text-purple-900/40 pointer-events-none">
             {logs.map((log, index) => <div key={index}>{log}</div>)}
           </div>
           {isRendering ? (
             <div className="z-10 text-center">
                <div className="w-64 h-1 bg-zinc-900 rounded-full overflow-hidden mb-4 mx-auto">
                  <div className="h-full bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,1)]" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-400 animate-pulse">Encoding {tier} Movie: {Math.floor(progress)}%</p>
             </div>
           ) : (
             <p className="text-zinc-800 italic uppercase text-[10px] tracking-[0.6em]">Engine Ready // High Standard Mode</p>
           )}
        </div>

        <div className="w-80 bg-zinc-900/50 p-6 border border-purple-900/50 backdrop-blur-xl flex flex-col gap-8 shadow-2xl">
          <div className="border-b border-purple-900 pb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-1 italic underline">Master Build Suite</h3>
            <p className="text-[9px] text-zinc-500 uppercase font-bold">{tier} Level Enabled</p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
               <label className="text-[10px] uppercase text-zinc-500 font-black tracking-widest">Duration Control</label>
               <span className="text-2xl font-black text-white">{duration}<small className="text-[10px] ml-1 text-purple-500">M</small></span>
            </div>
            <input type="range" min="0" max="180" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full h-1 bg-zinc-800 accent-purple-600 cursor-pointer appearance-none rounded-full" />
          </div>
          <button onClick={startRender} disabled={isRendering} className="mt-auto bg-purple-700 hover:bg-purple-600 py-6 font-black uppercase text-[12px] border border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all">
            {isRendering ? "PROCESSING..." : "INITIATE MOVIE BUILD"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState(1); // Page 1 Landing
  const [showStudio, setShowStudio] = useState(false);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [duration, setDuration] = useState(90);
  const [loginData, setLoginData] = useState({ email: '', pass: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [userTier, setUserTier] = useState("");

  useEffect(() => {
    const savedAuth = localStorage.getItem('manda_auth');
    const savedTier = localStorage.getItem('manda_tier');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      setUserTier(savedTier || "$20 Starter");
      setPage(11); // Skip landing if remembered
    }
  }, []);

  const handleLogin = (e: any) => {
    e.preventDefault();
    const email = loginData.email.toLowerCase();
    let selectedTier = "";

    if (email === 'manda@gmail.com' && loginData.pass === 'manda30') {
      selectedTier = "$80 Enterprise";
    } else if (email === 'admin@gmail.com' && loginData.pass === 'test30') {
      selectedTier = "$40 Professional";
    } else if (email === 'test@gmail.com' && loginData.pass === 'test20') {
      selectedTier = "$20 Starter";
    } else {
      alert("Unauthorized Access. Check credentials.");
      return;
    }

    setUserTier(selectedTier);
    setIsAuthenticated(true);
    setPage(11); // Move to Editor
    if (rememberMe) {
      localStorage.setItem('manda_auth', 'true');
      localStorage.setItem('manda_tier', selectedTier);
    }
  };

  // --- PAGE 1: LANDING ---
  if (page === 1) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center font-sans text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.15)_0,transparent_70%)]" />
        <div className="text-center z-10 max-w-2xl animate-in fade-in zoom-in duration-1000">
          <h1 className="text-7xl font-black uppercase italic tracking-tighter mb-4 leading-none">MandaStrong Studio</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.5em] mb-12 font-bold italic">Industry Leading Video Generation Engine</p>
          
          <button 
            onClick={() => setPage(2)} 
            className="bg-white text-black px-16 py-5 font-black uppercase text-sm tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-2xl rounded-full"
          >
            Login / Register
          </button>
        </div>
        <footer className="absolute bottom-10 text-[10px] text-zinc-700 font-bold uppercase tracking-widest text-center">
           MandaStrong1 2025 ~ Author of Doxy The School Bully
        </footer>
      </div>
    );
  }

  // --- PAGE 2: LOGIN GATEWAY ---
  if (page === 2 && !isAuthenticated) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center font-sans text-white p-6 relative">
        <div className="w-full max-w-md bg-zinc-900 border border-purple-900/50 p-10 rounded-3xl shadow-2xl backdrop-blur-md text-center z-10 animate-in slide-in-from-bottom-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-1 italic">Security Terminal</h2>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] mb-10 font-bold">Authorized Personnel Only</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="ACCESS EMAIL" className="w-full bg-black/50 border border-zinc-800 p-5 text-xs font-bold uppercase tracking-widest outline-none rounded-xl text-white" onChange={(e) => setLoginData({...loginData, email: e.target.value})} />
            <input type="password" placeholder="SECURITY KEY" className="w-full bg-black/50 border border-zinc-800 p-5 text-xs font-bold uppercase tracking-widest outline-none rounded-xl text-white" onChange={(e) => setLoginData({...loginData, pass: e.target.value})} />
            <div className="flex items-center gap-2 px-1 text-left">
              <input type="checkbox" id="rem" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-purple-600 w-4 h-4" />
              <label htmlFor="rem" className="text-[10px] uppercase font-black text-zinc-500 cursor-pointer">Remember Access</label>
            </div>
            <button type="submit" className="w-full bg-purple-700 py-5 font-black uppercase text-xs tracking-[0.3em] shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:bg-purple-600 transition-all rounded-xl">Enter Hub</button>
          </form>
          <button onClick={() => setPage(1)} className="mt-6 text-[9px] uppercase font-bold text-zinc-700 hover:text-white transition-colors">← Back to Home</button>
        </div>
      </div>
    );
  }

  // --- PAGE 11: EDITOR HUB ---
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500">
      {page === 11 && (
        <div className="h-screen flex flex-col p-8 relative animate-in fade-in duration-700">
          <div className="flex justify-between items-start mb-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">Editor Hub</h1>
                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black uppercase text-green-500 tracking-widest">Stuff Synced</span>
                </div>
              </div>
              <span className="text-purple-500 text-[9px] font-black uppercase tracking-[0.4em] italic underline decoration-purple-900/50">{userTier} Membership</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAdvancedTools(true)} className="w-24 h-24 border-2 border-purple-600 bg-purple-950/20 rounded-xl flex items-center justify-center text-[9px] font-black uppercase text-purple-400 hover:text-white hover:bg-purple-600 transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]">Media Library</button>
            </div>
          </div>

          <div className="flex-1 bg-zinc-900/10 border border-zinc-800 rounded-3xl flex items-center justify-center relative overflow-hidden group">
            <span className="text-zinc-800 font-black text-8xl uppercase tracking-tighter opacity-10 italic font-black">Core Engine Hub</span>
            {showAdvancedTools && (
              <div className="absolute inset-4 bg-zinc-950/95 z-[50] p-12 animate-in slide-in-from-right duration-500 rounded-2xl border border-purple-900/40 backdrop-blur-2xl">
                <div className="flex justify-between items-center border-b-2 border-purple-900 pb-8 mb-12">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">Advanced Viewer Suite</h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em]">90M Feature Build Enabled</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setShowStudio(true)} className="bg-purple-700 hover:bg-purple-600 text-white px-12 py-5 font-black uppercase text-xs border border-purple-400">Open Video Studio</button>
                    <button onClick={() => setShowAdvancedTools(false)} className="bg-zinc-800 px-8 py-5 font-black text-xs uppercase hover:bg-white hover:text-black transition-all">Close</button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-video bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center hover:border-purple-500 cursor-pointer text-zinc-600 italic text-[10px] font-black uppercase transition-all">Clip_Asset_0{i}.mp4</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex justify-between items-center pt-8 border-t border-zinc-900">
            <button onClick={() => {localStorage.removeItem('manda_auth'); setIsAuthenticated(false); setPage(1);}} className="text-zinc-700 hover:text-white uppercase text-[10px] font-black tracking-widest italic underline decoration-zinc-900 transition-all">Logout Terminal</button>
            <button onClick={() => setPage(21)} className="bg-white text-black px-20 py-5 font-black uppercase text-[11px] hover:bg-purple-600 hover:text-white transition-all shadow-2xl italic">Watch Movie Finale →</button>
          </div>

          {showStudio && <VideoStudio onClose={() => setShowStudio(false)} duration={duration} setDuration={setDuration} tier={userTier} />}
        </div>
      )}

      {page === 21 && (
        <div className="h-screen bg-black flex flex-col items-center justify-center relative animate-in zoom-in duration-1000 p-12">
           <div className="w-full max-w-6xl aspect-video bg-zinc-950 border-8 border-zinc-900 shadow-[0_0_150px_rgba(168,85,247,0.1)] relative rounded-xl overflow-hidden">
             <video autoPlay controls className="w-full h-full object-cover">
               <source src="/video/thatsallfolks.mp4" type="video/mp4" />
             </video>
           </div>
           <div className="mt-16 text-center">
             <h3 className="text-purple-500 text-4xl font-black uppercase italic tracking-[0.3em] mb-4">Final Master Render</h3>
             <button onClick={() => setPage(11)} className="text-zinc-600 hover:text-white uppercase text-[10px] font-black tracking-[0.6em] transition-all underline decoration-purple-900/50 underline-offset-8">Return to Hub</button>
           </div>
        </div>
      )}
    </div>
  );
}