import React, { useState } from 'react';
import { 
  Upload, Home, Library, Clock, Music, Settings, Wand2, Terminal, 
  Workflow, MessageSquare, ShieldCheck, ChevronLeft, ChevronRight, 
  Play, Database, FileText, Users, Share2, Sparkles, Film, Mic, Video
} from 'lucide-react';

export default function App() {
  const [page, setPage] = useState(1);
  const [showEnhancement, setShowEnhancement] = useState(false);

  // NAVIGATION SYSTEM (Persistent across all 21 Nodes)
  const Navigation = () => (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-6 z-[100]">
      <button onClick={() => setPage(Math.max(1, page - 1))} className="bg-black text-white px-10 py-4 rounded-full font-black uppercase text-[10px] border border-white/20 hover:bg-white hover:text-black transition-all">← BACK</button>
      <button onClick={() => setPage(Math.min(21, page + 1))} className="bg-black text-white px-10 py-4 rounded-full font-black uppercase text-[10px] border border-white/20 hover:bg-white hover:text-black transition-all">NEXT →</button>
    </div>
  );

  // --- NODE 1: BEACH SPLASH (Image 1) ---
  if (page === 1) return (
    <div className="h-screen bg-cover bg-center flex flex-col items-center justify-center relative font-black italic" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80')" }}>
      <div className="relative z-10 text-center">
        <h1 className="text-8xl text-black uppercase tracking-tighter mb-4 leading-none">MANDASTRONG'S STUDIO</h1>
        <p className="text-2xl text-black uppercase tracking-widest font-bold">Welcome To The All-In-One Make-A-Movie App!</p>
      </div>
      <div className="absolute bottom-10 flex gap-6 z-10">
        <button onClick={() => setPage(2)} className="bg-black text-white px-12 py-4 rounded-xl uppercase font-black">Next</button>
        <button onClick={() => setPage(3)} className="bg-black text-white px-12 py-4 rounded-xl uppercase font-black">Login</button>
        <button onClick={() => setPage(3)} className="bg-black text-white px-12 py-4 rounded-xl uppercase font-black">Register</button>
      </div>
    </div>
  );

  // --- NODE 2: PURPLE BRANDING (Image 2) ---
  if (page === 2) return (
    <div className="h-screen bg-[#1a0b2e] flex flex-col items-center justify-center relative font-black italic p-10">
      <Sparkles size={100} className="text-purple-500 mb-8 animate-pulse" />
      <h1 className="text-8xl text-white uppercase tracking-tighter text-center leading-none mb-6">MANDASTRONG'S STUDIO</h1>
      <p className="text-3xl text-purple-400 uppercase text-center max-w-4xl">Make Amazing Family Movies & Bring Dreams To Life!</p>
      <Navigation />
    </div>
  );

  // --- NODE 3: ACCESS & PLANS ($20, $40, $80) ---
  if (page === 3) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 p-10 flex flex-col items-center italic font-black relative overflow-y-auto pb-40">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl mb-12">
        <div className="bg-[#1a0b2e] p-10 rounded-[3rem] border-2 border-purple-500/30 text-white">
          <h2 className="text-3xl uppercase mb-8 text-center">Login</h2>
          <input type="email" placeholder="your@email.com" className="w-full bg-black p-5 rounded-xl border border-zinc-800 mb-4 outline-none focus:border-purple-500" />
          <input type="password" placeholder="........" className="w-full bg-black p-5 rounded-xl border border-zinc-800 mb-6 outline-none focus:border-purple-500" />
          <button onClick={() => setPage(11)} className="w-full bg-purple-600 py-5 rounded-xl uppercase shadow-lg">Login</button>
        </div>
        <div className="bg-[#1a0b2e] p-10 rounded-[3rem] border-2 border-purple-500/30 text-white">
          <h2 className="text-3xl uppercase mb-8 text-center">Register</h2>
          <input type="text" placeholder="Full Name" className="w-full bg-black p-5 rounded-xl border border-zinc-800 mb-4 outline-none" />
          <input type="email" placeholder="Email Address" className="w-full bg-black p-5 rounded-xl border border-zinc-800 mb-4 outline-none" />
          <button onClick={() => setPage(11)} className="w-full bg-purple-600 py-5 rounded-xl uppercase shadow-lg">Create Account</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 w-full max-w-6xl">
        {[{t:"Basic", p:"20"}, {t:"Pro", p:"40", s:true}, {t:"Studio", p:"80"}].map((plan, i) => (
          <div key={i} className={`bg-[#0d0517] p-8 rounded-[2rem] border-2 ${plan.s ? 'border-yellow-500 scale-105' : 'border-purple-500/20'} text-white text-center`}>
            <h3 className="text-2xl mb-2 uppercase tracking-tighter">{plan.t}</h3>
            <div className="text-6xl mb-6 font-black tracking-tighter">${plan.p}<span className="text-xl">/mo</span></div>
            <button className="w-full bg-purple-600 py-4 rounded-xl uppercase text-sm font-black tracking-widest">Select Plan</button>
          </div>
        ))}
      </div>
      <Navigation />
    </div>
  );

  // --- NODES 4-9: THE AI TOOL BOARD (600 Tools Logic) ---
  if (page >= 4 && page <= 9) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 flex flex-col p-10 italic font-black relative overflow-hidden">
      <h2 className="text-6xl text-purple-500 uppercase tracking-tighter mb-8">AI TOOL BOARD — NODE {page}</h2>
      <div className="grid grid-cols-4 gap-4 overflow-y-auto pr-4 pb-24">
        {Array.from({ length: 120 }).map((_, i) => (
          <button key={i} onClick={() => setPage(11)} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-left hover:border-purple-500 transition-all group">
            <Sparkles size={16} className="text-purple-500 mb-2 group-hover:scale-125 transition-transform" />
            <div className="text-white text-xs uppercase tracking-widest">AI Tool {(page - 4) * 120 + i + 1}</div>
            <div className="text-zinc-600 text-[8px] uppercase mt-1 italic">Click to generate asset</div>
          </button>
        ))}
      </div>
      <Navigation />
    </div>
  );

  // --- NODE 11: EDITOR SUITE / MEDIA LIBRARY ---
  if (page === 11) return (
    <div className="h-screen bg-[#050505] text-white flex flex-col italic font-black overflow-hidden border-[20px] border-zinc-900">
      <div className="bg-black p-4 flex gap-4 border-b border-zinc-800 overflow-x-auto">
        <span className="text-purple-500 mr-4 self-center uppercase tracking-tighter">Editor Suite</span>
        <button className="bg-zinc-900 px-6 py-2 rounded-lg flex items-center gap-2 text-[10px] uppercase border border-white/5"><Home size={12}/> Editor Home</button>
        <button className="bg-purple-600 px-6 py-2 rounded-lg flex items-center gap-2 text-[10px] uppercase border border-white/5"><Library size={12}/> Media Library</button>
        <button className="bg-zinc-900 px-6 py-2 rounded-lg flex items-center gap-2 text-[10px] uppercase border border-white/5"><Clock size={12}/> Timeline</button>
        <button className="bg-zinc-900 px-6 py-2 rounded-lg flex items-center gap-2 text-[10px] uppercase border border-white/5"><Music size={12}/> Audio Mixer</button>
      </div>
      <div className="flex-1 p-10 flex flex-col relative">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-5xl uppercase tracking-tighter">Media Library</h2>
          <div className="flex gap-4">
            <button className="bg-blue-600 px-8 py-3 rounded-xl uppercase text-xs flex items-center gap-2 font-black"><Play size={16}/> Open Video Studio</button>
            <button onClick={() => window.open('https://mandastrong-studio-global-enhancement.ai/engine-v2', '_blank')} className="bg-purple-600 px-8 py-3 rounded-xl uppercase text-xs flex items-center gap-2 shadow-2xl hover:scale-105 transition-all font-black border border-white/20"><Wand2 size={16}/> Open Enhancement Suite</button>
          </div>
        </div>
        <div className="flex-1 border-4 border-dashed border-zinc-900 rounded-[4rem] flex flex-col items-center justify-center text-center">
          <Upload size={80} className="text-zinc-900 mb-6" />
          <p className="text-3xl uppercase tracking-tighter text-zinc-800">Click to upload or drag & drop</p>
          <p className="text-zinc-900 uppercase mt-2 tracking-widest text-xs font-black italic">No assets yet. Generate tools in Nodes 4-9.</p>
        </div>
        <Navigation />
      </div>
    </div>
  );

  // --- NODE 19: AGENT GROK (Image 19) ---
  if (page === 19) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 p-12 flex flex-col relative italic font-black">
      <h2 className="text-5xl text-white uppercase flex items-center gap-4 mb-10 tracking-tighter"><MessageSquare className="text-purple-500" size={40} /> AGENT GROK - 24/7 HELP DESK</h2>
      <div className="flex gap-10 flex-1 mb-24 overflow-hidden">
        <div className="flex-1 bg-zinc-900/40 rounded-[3rem] p-10 border border-zinc-800 relative">
          <div className="bg-purple-600 p-6 rounded-2xl text-white mb-6 w-fit max-w-lg">Grok: Hello! I'm Agent Grok, your 24/7 AI assistant. How can I help you build your movie today?</div>
          <div className="absolute bottom-10 left-10 right-10 flex gap-4">
            <input type="text" placeholder="Type your technical query..." className="flex-1 bg-black p-6 rounded-2xl text-white border border-zinc-800 outline-none" />
            <button className="bg-purple-600 px-12 rounded-2xl text-white uppercase font-black">Ask</button>
          </div>
        </div>
        <div className="w-96 bg-zinc-900/20 p-8 rounded-[3rem] border border-zinc-800">
          <h3 className="text-purple-500 mb-6 uppercase text-sm tracking-[0.2em]">Quick Support FAQ</h3>
          <div className="flex flex-col gap-6 text-[10px] text-zinc-500 uppercase tracking-widest">
            <p className="hover:text-white cursor-pointer transition-colors">• How to export in 4K?</p>
            <p className="hover:text-white cursor-pointer transition-colors">• Recovering deleted assets</p>
            <p className="hover:text-white cursor-pointer transition-colors">• AI Voice cloning guide</p>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );

  // --- NODE 21: FINALE (Image 21) ---
  if (page === 21) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 flex flex-col items-center justify-center relative overflow-y-auto italic font-black p-20 text-center">
      <h1 className="text-[12rem] text-purple-500 uppercase tracking-tighter mb-12 leading-none">THAT'S ALL FOLKS!</h1>
      <div className="max-w-4xl bg-zinc-900/30 p-16 rounded-[5rem] border border-purple-500/20">
        <h2 className="text-4xl text-white uppercase mb-8">A Special Thank You</h2>
        <p className="text-zinc-500 mb-12 uppercase text-sm leading-relaxed tracking-widest">Your creativity and passion inspire positive change. Through your films, you bring awareness to critical issues like bullying prevention and social growth. Together, we build Kindness.</p>
        <button onClick={() => setPage(1)} className="bg-white text-black px-24 py-8 rounded-full uppercase text-2xl font-black hover:bg-purple-600 hover:text-white transition-all shadow-2xl">Restart Engine</button>
      </div>
      <div className="mt-16 text-zinc-700 text-[10px] uppercase tracking-[0.5em] font-bold italic">MandaStrong1 2025 ~ Author of Doxy The School Bully</div>
      <Navigation />
    </div>
  );

  // FALLBACK FOR ENGINE NODES (10, 12-18, 20)
  return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 flex flex-col items-center justify-center text-white italic font-black relative overflow-hidden">
      <div className="absolute text-[40rem] opacity-[0.02] uppercase tracking-tighter leading-none pointer-events-none">{page}</div>
      <Cpu size={120} className="text-purple-500/20 mb-8 animate-spin-slow" />
      <h2 className="text-5xl uppercase tracking-tighter z-10">Proprietary Engine Node {page}</h2>
      <p className="text-zinc-600 uppercase tracking-[0.4em] text-xs mt-4 z-10">Processing Creative Metadata...</p>
      <Navigation />
    </div>
  );
}