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
        {Array.from({