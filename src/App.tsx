import React, { useState, useEffect } from 'react';
import {
  Upload, Home, Library, Clock, Music, Settings, Wand2, Terminal,
  Workflow, ShieldCheck, FileText, MessageSquare, Users, PlusCircle,
  X, Cpu, Layers, Maximize, Sparkles, Box, Zap, ChevronLeft,
  ChevronRight, Database, Download, Share2
} from 'lucide-react';
import BrowserAlert from './components/BrowserAlert';

export default function App() {
  const [page, setPage] = useState(1); // No Splash - Starts at Page 1
  const [userEmail, setUserEmail] = useState('');
  const [pass, setPass] = useState('');
  const [activeTool, setActiveTool] = useState(null);
  const [showEnhancementStudio, setShowEnhancementStudio] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const isAdmin = userEmail.toLowerCase() === 'woolleya129@gmail.com';

  // Universal Navigation Component
  const Navigation = () => (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-[60]">
      <button onClick={() => setPage(Math.max(1, page - 1))} className="bg-zinc-800/95 px-8 py-3 rounded-full font-black text-[10px] uppercase border border-white/10 hover:bg-white hover:text-black transition-all">← BACK</button>
      <button onClick={() => setPage(Math.min(21, page + 1))} className="bg-purple-700/95 px-8 py-3 rounded-full font-black text-[10px] uppercase border border-white/10 hover:bg-purple-500 transition-all">NEXT →</button>
    </div>
  );

  const MandaLogo = () => (
    <div className="flex flex-col items-center select-none pointer-events-none">
      <span className="text-xl font-black uppercase italic tracking-tighter leading-none text-white">MandaStrong</span>
      <span className="text-[6px] font-black uppercase text-purple-500 tracking-[0.4em]">Proprietary Engine</span>
    </div>
  );

  // --- NODES 1-2: 15s BACKGROUND PERSISTENCE ---
  if (page === 1 || page === 2) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden border-[20px] border-zinc-900">
      <BrowserAlert />
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
        <source src="background.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 text-center px-4">
        {page === 1 && (
          <div className="flex flex-col items-center animate-in fade-in duration-700">
            <MandaLogo />
            <h1 className="text-7xl font-black uppercase italic tracking-tighter text-white mt-6 mb-4 leading-none">MANDASTRONG'S STUDIO</h1>
            <p className="text-xl text-white font-bold italic mb-12">Welcome To The All-In-One Make-A-Movie App!</p>
          </div>
        )}
        {page === 2 && (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
             <h2 className="text-5xl font-black uppercase italic mb-12 tracking-tighter">Gateway Portal</h2>
             <div className="flex gap-6">
                <button onClick={() => setPage(3)} className="bg-purple-600 px-12 py-5 rounded-xl font-black uppercase text-sm shadow-2xl hover:scale-105 transition-transform">Login / Register</button>
                <button onClick={() => setPage(3)} className="bg-blue-600 px-12 py-5 rounded-xl font-black uppercase text-sm flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform"><ShieldCheck /> Browse Guest</button>
             </div>
          </div>
        )}
      </div>
      <Navigation />
    </div>
  );

  // --- NODE 3: FORMS AT TOP / PLANS AT BOTTOM ---
  if (page === 3) return (
    <div className="h-screen bg-black flex flex-col p-10 border-[20px] border-zinc-900 overflow-y-auto italic font-bold relative">
      <div className="w-full max-w-4xl mx-auto mb-12">
        <div className="bg-zinc-900/80 p-10 rounded-[3rem] border-2 border-purple-500/30 text-center shadow-2xl">
          <h2 className="text-3xl font-black uppercase mb-8 text-white tracking-tighter">Access Terminal</h2>
          <div className="grid grid-cols-2 gap-6 mb-8 text-left italic">
            <input type="email" placeholder="Email" className="bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-purple-500 transition-colors" value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-purple-500 transition-colors" value={pass} onChange={(e)=>setPass(e.target.value)} />
          </div>
          <button onClick={()=>setPage(11)} className="bg-purple-600 px-24 py-5 rounded-2xl font-black uppercase text-white shadow-xl hover:bg-white hover:text-black transition-all">Enter Studio</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8 w-full max-w-5xl mx-auto pb-24 text-center">
        {["Basic — $20", "Pro — $40", "Studio — $80"].map((p, i) => (
          <div key={i} className={`bg-zinc-900/50 p-8 rounded-3xl border-2 uppercase font-black tracking-tighter ${i===1 ? 'border-yellow-500 scale-105' : 'border-zinc-800 opacity-50'}`}>
            <h3 className="text-lg text-white">{p}</h3>
          </div>
        ))}
      </div>
      <Navigation />
    </div>
  );

  // --- NODES 4-9: AI TOOL BOARD (600 TOOLS) ---
  if (page >= 4 && page <= 9) return (
    <div className="h-screen bg-black flex flex-col p-10 border-[20px] border-zinc-900 relative italic">
      <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white mb-4">AI TOOL BOARD</h2>
      <p className="text-purple-500 font-black uppercase text-xs mb-10">600 Proprietary Modules Available</p>
      <div className="grid grid-cols-4 gap-6 flex-1 mb-20">
        {[{n:"Neural Sync",i:<Cpu/>},{n:"Flow Synth",i:<Layers/>},{n:"Depth Map",i:<Maximize/>},{n:"Logic Sculpt",i:<Sparkles/>},{n:"Meta Mesh",i:<Box/>},{n:"Stream AI",i:<Zap/>}].map((t, idx) => (
          <div key={idx} onClick={() => setActiveTool(t.n)} className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-purple-500 transition-all cursor-pointer group">
             <div className="text-zinc-700 group-hover:text-purple-400 scale-150 mb-6 transition-transform group-hover:rotate-12">{t.i}</div>
             <span className="font-black uppercase text-[10px] tracking-widest">{t.n}</span>
          </div>
        ))}
      </div>
      {activeTool && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-20 animate-in fade-in zoom-in-95">
          <div className="w-full max-w-4xl bg-zinc-900 border-4 border-purple-600 rounded-[4rem] p-16 text-center shadow-[0_0_100px_rgba(147,51,234,0.3)]">
            <h3 className="text-4xl font-black uppercase mb-12 text-white italic">{activeTool} WORKSPACE</h3>
            <div className="grid grid-cols-2 gap-8 font-black uppercase">
              <button onClick={() => {setSaveStatus(true); setTimeout(()=>setSaveStatus(false),1500); setActiveTool(null);}} className="bg-zinc-950 border-2 border-zinc-800 p-12 rounded-[3rem] hover:border-purple-500 transition-colors">Upload Asset</button>
              <button onClick={() => {setSaveStatus(true); setTimeout(()=>setSaveStatus(false),1500); setActiveTool(null);}} className="bg-purple-600 p-12 rounded-[3rem] hover:bg-white hover:text-black transition-all">Create With AI</button>
            </div>
            <button onClick={()=>setActiveTool(null)} className="mt-8 text-zinc-500 font-black uppercase text-xs">Cancel Process</button>
          </div>
        </div>
      )}
      <Navigation />
    </div>
  );

  // --- NODE 11: EDITOR SUITE / MEDIA LIBRARY WITH ATTACHMENT BUTTON ---
  if (page === 11) return (
    <div className="h-screen flex bg-black border-[20px] border-zinc-900 relative italic">
      <div className="w-72 border-r border-zinc-800 flex flex-col p-8 gap-4 font-black uppercase text-[10px]">
        <MandaLogo />
        <nav className="flex flex-col gap-2 mt-12">
          <button className="flex items-center gap-4 p-4 text-zinc-500 hover:bg-zinc-900 rounded-2xl transition-all"><Home size={18}/> Editor Home</button>
          <button className="flex items-center gap-4 p-4 bg-zinc-900 rounded-2xl text-white shadow-xl"><Library size={18}/> Media Library</button>
          <button className="flex items-center gap-4 p-4 text-zinc-500 hover:bg-zinc-900 rounded-2xl transition-all"><Clock size={18}/> Timeline</button>
          <button className="flex items-center gap-4 p-4 text-zinc-500 hover:bg-zinc-900 rounded-2xl transition-all"><Music size={18}/> Audio Mixer</button>
          <button className="flex items-center gap-4 p-4 text-zinc-500 hover:bg-zinc-900 rounded-2xl transition-all"><Settings size={18}/> Settings</button>
        </nav>
      </div>

      <div className="flex-1 p-12 flex flex-col relative">
        <header className="flex justify-between items-center mb-12">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-white">MEDIA LIBRARY</h2>
          {/* ENHANCEMENT STUDIO ATTACHMENT BUTTON */}
          <button onClick={() => setShowEnhancementStudio(true)} className="bg-purple-600 px-10 py-5 rounded-2xl font-black uppercase text-xs shadow-2xl flex items-center gap-3 hover:bg-white hover:text-black transition-all border border-white/10">
            <Wand2 size={16}/> Enhancement Studio Attachment
          </button>
        </header>

        <div className="flex-1 bg-zinc-950 border-4 border-dashed border-zinc-900 rounded-[5rem] flex flex-col items-center justify-center p-20 text-center relative overflow-hidden">
           <Upload size={64} className="text-zinc-800 mb-6" />
           <p className="text-white text-xl uppercase mb-2 font-black">Click to upload or drag & drop</p>
           <p className="text-zinc-700 font-black uppercase text-[10px]">No assets yet.</p>
           {saveStatus && <p className="absolute bottom-12 text-green-500 font-black uppercase animate-bounce text-xs flex items-center gap-2"><Database size={14}/> Asset Synced to Vault</p>}
        </div>
        <Navigation />
      </div>

      {/* GLOBAL ENHANCEMENT STUDIO ATTACHMENT OVERLAY */}
      {showEnhancementStudio && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col p-10 animate-in slide-in-from-right duration-500">
           <div className="flex justify-between items-center mb-10 text-purple-500 font-black italic">
             <h2 className="text-5xl uppercase tracking-tighter flex items-center gap-4"><Terminal size={40}/> GLOBAL ENHANCEMENT ENGINE</h2>
             <button onClick={() => setShowEnhancementStudio(false)} className="bg-purple-600 text-white px-10 py-4 rounded-full font-black uppercase hover:bg-white hover:text-black transition-all">Close Attachment</button>
           </div>
           <div className="flex-1 bg-zinc-900/20 border-4 border-zinc-800 rounded-[5rem] flex flex-col items-center justify-center p-10 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent pointer-events-none" />
             <Workflow size={120} className="text-zinc-800 mb-10 animate-spin-slow" />
             <div className="grid grid-cols-3 gap-10 w-full max-w-5xl relative z-10">
                {["Neural Re-Lighting", "Kinetic Flow", "Logic Sculpt"].map((mod) => (
                  <div key={mod} className="bg-zinc-900/80 p-10 rounded-3xl border border-zinc-800 text-center font-black uppercase italic hover:border-purple-500 transition-colors cursor-crosshair">{mod}</div>
                ))}
             </div>
             <p className="mt-16 text-zinc-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Neural Link Established with Media Vault</p>
           </div>
        </div>
      )}
    </div>
  );

  // --- NODE 17: FULL PAGE VIEWER ---
  if (page === 17) return (
    <div className="h-screen bg-black flex flex-col relative border-[20px] border-zinc-900 italic">
      <div className="absolute top-12 left-12 z-30 flex gap-4">
        <div className="bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex flex-col uppercase font-black text-[10px] tracking-widest text-green-500">
          <span>UNIQUE RENDERING COMPLETE</span>
          <span className="text-white opacity-50">4K Engine Output</span>
        </div>
      </div>
      <video autoPlay controls loop className="w-full h-full object-contain">
        <source src="background.mp4" type="video/mp4" />
      </video>
      <Navigation />
    </div>
  );

  // --- NODE 19: GROK HELP DESK ---
  if (page === 19) return (
    <div className="h-screen bg-black flex flex-col p-10 border-[20px] border-zinc-900 relative italic">
      <div className="p-20 flex flex-col items-center max-w-4xl mx-auto w-full">
        <MessageSquare size={64} className="text-purple-500 mb-8" />
        <h2 className="text-5xl font-black uppercase italic mb-8 tracking-tighter">GROK HELP DESK</h2>
        <div className="w-full bg-zinc-900 border-2 border-zinc-800 p-10 rounded-3xl font-black">
          <div className="mb-8 p-6 bg-zinc-950 rounded-2xl border border-purple-600/30 text-white italic">
            Grok: Terminal Secured. The MandaStrong Engine is currently processing at peak efficiency. All proprietary tools are synced to the Media Vault.
          </div>
          <div className="flex gap-4">
            <input type="text" placeholder="Query Grok for correct answers only..." className="flex-1 bg-black border border-zinc-700 p-5 rounded-2xl outline-none text-white font-bold" />
            <button className="bg-purple-600 px-10 rounded-2xl font-black uppercase hover:bg-white hover:text-black transition-all">Ask</button>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );

  // --- NODE 21: FINAL THANK YOU ---
  if (page === 21) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center border-[20px] border-zinc-900 relative overflow-hidden font-black">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80">
        <source src="thatsallfolk.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h2 className="text-7xl uppercase italic text-white tracking-tighter mb-10 drop-shadow-2xl">THANK YOU FOR CREATING</h2>
        <button onClick={() => setPage(1)} className="bg-white text-black px-16 py-6 rounded-full uppercase text-xl hover:bg-purple-600 hover:text-white transition-all shadow-2xl">RESTART ENGINE</button>
      </div>
    </div>
  );

  // Fallback for missing nodes (TOS, Community Hub, Finalize etc)
  return (
    <div className="h-screen bg-black text-white border-[20px] border-zinc-900 flex flex-col items-center justify-center relative font-black uppercase italic">
      <MandaLogo />
      <h2 className="text-9xl opacity-10 tracking-tighter">NODE {page}</h2>
      <Navigation />
    </div>
  );
}