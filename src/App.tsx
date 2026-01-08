import React, { useState } from 'react';
import { 
  Upload, Home, Library, Clock, Music, Settings, Wand2, 
  Terminal, Play, Database, FileText, Users, Share2 
} from 'lucide-react';

export default function App() {
  const [page, setPage] = useState(1);

  // NAVIGATION COMPONENT
  const Navigation = () => (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-6 z-[100]">
      <button onClick={() => setPage(Math.max(1, page - 1))} className="bg-black text-white px-10 py-4 rounded-full font-black uppercase text-[10px] border border-white/20 hover:bg-white hover:text-black transition-all">← BACK</button>
      <button onClick={() => setPage(Math.min(21, page + 1))} className="bg-black text-white px-10 py-4 rounded-full font-black uppercase text-[10px] border border-white/20 hover:bg-white hover:text-black transition-all">NEXT →</button>
    </div>
  );

  // --- NODE 1: BEACH SPLASH ---
  if (page === 1) return (
    <div className="h-screen bg-cover bg-center flex flex-col items-center justify-center relative font-black italic" style={{ backgroundImage: "url('beach-image.jpg')" }}>
      <div className="relative z-10 text-center">
        <h1 className="text-8xl text-black uppercase tracking-tighter mb-4 leading-none">MANDASTRONG'S STUDIO</h1>
        <p className="text-2xl text-black uppercase tracking-widest">Welcome To The All-In-One Make-A-Movie App!</p>
      </div>
      <div className="absolute bottom-10 flex gap-6 z-10">
        <button onClick={() => setPage(2)} className="bg-black text-white px-12 py-4 rounded-xl uppercase">Next</button>
        <button onClick={() => setPage(3)} className="bg-black text-white px-12 py-4 rounded-xl uppercase">Login</button>
        <button onClick={() => setPage(3)} className="bg-black text-white px-12 py-4 rounded-xl uppercase">Register</button>
      </div>
    </div>
  );

  // --- NODE 2: PURPLE LANDING ---
  if (page === 2) return (
    <div className="h-screen bg-[#1a0b2e] flex flex-col items-center justify-center relative font-black italic p-10">
      <h1 className="text-8xl text-white uppercase tracking-tighter text-center leading-none mb-6">MANDASTRONG'S STUDIO</h1>
      <p className="text-3xl text-purple-400 uppercase text-center max-w-4xl">Make Amazing Family Movies & Bring Dreams To Life!</p>
      <Navigation />
    </div>
  );

  // --- NODE 3: LOGIN / REGISTER / PLANS ($20, $40, $80) ---
  if (page === 3) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 p-10 flex flex-col items-center italic font-black relative overflow-y-auto pb-40">
      <div className="grid grid-cols-2 gap-8 w-full max-w-6xl mb-12">
        <div className="bg-[#1a0b2e] p-10 rounded-[3rem] border-2 border-purple-500/30 text-center text-white">
          <h2 className="text-3xl uppercase mb-8">Login</h2>
          <input type="email" placeholder="your@email.com" className="w-full bg-black p-5 rounded-xl border border-zinc-800 mb-4" />
          <input type="password" placeholder="........" className="w-full bg-black p-5 rounded-xl border border-zinc-800 mb-6" />
          <button onClick={() => setPage(11)} className="w-full bg-purple-600 py-5 rounded-xl uppercase">Login</button>
        </div>
        <div className="bg-[#1a0b2e] p-10 rounded-[3rem] border-2 border-purple-500/30 text-center text-white">
          <h2 className="text-3xl uppercase mb-8">Register</h2>
          <input type="text" placeholder="Name" className="w-full bg-black p-5 rounded-xl border border-zinc-800 mb-4" />
          <input type="email" placeholder="Email" className="w-full bg-black p-5 rounded-xl border border-zinc-800 mb-4" />
          <button onClick={() => setPage(11)} className="w-full bg-purple-600 py-5 rounded-xl uppercase">Create Account</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 w-full max-w-6xl">
        {[{t:"Basic", p:"20"}, {t:"Pro", p:"40"}, {t:"Studio", p:"80"}].map((plan, i) => (
          <div key={i} className="bg-[#0d0517] p-8 rounded-[2rem] border-2 border-purple-500/20 text-white text-center">
            <h3 className="text-2xl mb-2 uppercase">{plan.t}</h3>
            <div className="text-5xl mb-6 font-black tracking-tighter">${plan.p}<span className="text-lg">/mo</span></div>
            <button className="w-full bg-purple-600 py-3 rounded-xl uppercase text-sm font-black">Select {plan.t}</button>
          </div>
        ))}
      </div>
      <Navigation />
    </div>
  );

  // --- NODE 11: EDITOR SUITE / MEDIA LIBRARY ---
  if (page === 11) return (
    <div className="h-screen bg-[#050505] text-white flex flex-col italic font-black">
      <div className="bg-black p-4 flex gap-4 border-b border-zinc-800 overflow-x-auto">
        <span className="text-purple-500 mr-4 self-center uppercase">Editor Suite</span>
        <button className="bg-zinc-900 px-6 py-2 rounded-lg flex items-center gap-2 text-xs uppercase"><Home size={14}/> Editor Home</button>
        <button className="bg-purple-600 px-6 py-2 rounded-lg flex items-center gap-2 text-xs uppercase"><Library size={14}/> Media Library</button>
        <button className="bg-zinc-900 px-6 py-2 rounded-lg flex items-center gap-2 text-xs uppercase"><Clock size={14}/> Timeline</button>
        <button className="bg-zinc-900 px-6 py-2 rounded-lg flex items-center gap-2 text-xs uppercase"><Music size={14}/> Audio Mixer</button>
        <button className="bg-zinc-900 px-6 py-2 rounded-lg flex items-center gap-2 text-xs uppercase"><Settings size={14}/> Settings</button>
      </div>

      <div className="flex-1 p-10 flex flex-col">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-5xl uppercase tracking-tighter">Media Library</h2>
          <div className="flex gap-4">
            <button className="bg-blue-600 px-8 py-3 rounded-xl uppercase text-xs flex items-center gap-2">
              <Play size={16}/> Open Video Studio
            </button>
            <button 
              onClick={() => window.open('https://mandastrong-studio-global-enhancement.ai/engine-v2', '_blank')}
              className="bg-purple-600 px-8 py-3 rounded-xl uppercase text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
            >
              <Wand2 size={16}/> Open Enhancement Suite
            </button>
          </div>
        </div>

        <div className="flex-1 border-4 border-dashed border-zinc-900 rounded-[4rem] flex flex-col items-center justify-center text-center">
          <Upload size={60} className="text-zinc-800 mb-4" />
          <p className="text-2xl uppercase tracking-tighter">Click to upload or drag & drop</p>
          <p className="text-zinc-700 uppercase mt-2">No assets yet.</p>
        </div>
      </div>
      <Navigation />
    </div>
  );

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white italic font-black">
      <h2 className="text-9xl opacity-10">NODE {page}</h2>
      <Navigation />
    </div>
  );
}