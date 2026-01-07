import React, { useState, useEffect } from 'react';
import { Upload, Home, Library, Clock, Music, Settings, Wand2, Terminal, Workflow, MessageSquare, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState(1); // Node 1 Start
  const [showEnhancement, setShowEnhancement] = useState(false);

  // NAVIGATION COMPONENT - RESTORED TO NODES 1-21
  const Navigation = () => (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-6 z-[100]">
      <button onClick={() => setPage(Math.max(1, page - 1))} className="bg-zinc-800 px-10 py-4 rounded-full font-black uppercase text-[10px] border border-white/10 hover:bg-white hover:text-black">← BACK</button>
      <button onClick={() => setPage(Math.min(21, page + 1))} className="bg-purple-600 px-10 py-4 rounded-full font-black uppercase text-[10px] border border-white/10 hover:bg-purple-500">NEXT →</button>
    </div>
  );

  // --- NODES 1-2: VIDEO PERSISTENCE ---
  if (page === 1 || page === 2) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 flex flex-col items-center justify-center relative overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
        <source src="background.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 text-center italic font-black">
        {page === 1 ? (
          <>
            <h1 className="text-7xl text-white uppercase tracking-tighter mb-4">MANDASTRONG'S STUDIO</h1>
            <p className="text-xl text-white uppercase">Welcome To The All-In-One Make-A-Movie App!</p>
          </>
        ) : (
          <>
            <h2 className="text-5xl text-white uppercase mb-12">Gateway Portal</h2>
            <div className="flex gap-6">
              <button onClick={() => setPage(3)} className="bg-purple-600 px-12 py-5 rounded-xl uppercase">Login / Register</button>
              <button onClick={() => setPage(3)} className="bg-blue-600 px-12 py-5 rounded-xl uppercase">Browse Guest</button>
            </div>
          </>
        )}
      </div>
      <Navigation />
    </div>
  );

  // --- NODE 3: FORMS TOP / PLANS BOTTOM ---
  if (page === 3) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 p-10 flex flex-col items-center italic font-black relative overflow-y-auto">
      <div className="w-full max-w-4xl bg-zinc-900/80 p-10 rounded-[3rem] border-2 border-purple-500/30 mb-12 text-center">
        <h2 className="text-3xl text-white uppercase mb-8">Login / Register</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <input type="email" placeholder="Email" className="bg-black p-5 rounded-xl text-white border border-zinc-800" />
          <input type="password" placeholder="Password" className="bg-black p-5 rounded-xl text-white border border-zinc-800" />
        </div>
        <button onClick={() => setPage(11)} className="bg-purple-600 px-20 py-5 rounded-xl text-white uppercase">Enter Studio</button>
      </div>
      <div className="grid grid-cols-3 gap-6 w-full max-w-5xl pb-24 text-center">
        {["Basic — $20", "Pro — $40", "Studio — $80"].map((p, i) => (
          <div key={i} className={`bg-zinc-900 p-6 rounded-2xl border-2 ${i === 1 ? 'border-yellow-500 scale-105' : 'border-zinc-800'}`}>
            <span className="text-white uppercase">{p}</span>
          </div>
        ))}
      </div>
      <Navigation />
    </div>
  );

  // --- NODE 11: EDITOR SUITE / MEDIA LIBRARY WITH ATTACHMENT ---
  if (page === 11) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 flex relative italic font-black">
      {/* Sidebar Suite */}
      <div className="w-72 border-r border-zinc-800 p-8 flex flex-col gap-4 text-[10px] uppercase">
        <div className="text-white text-xl mb-12 tracking-tighter">EDITOR SUITE</div>
        <button className="flex items-center gap-4 p-4 text-zinc-500 hover:bg-zinc-900 rounded-xl"><Home size={18}/> Editor Home</button>
        <button className="flex items-center gap-4 p-4 bg-zinc-900 text-white rounded-xl shadow-lg"><Library size={18}/> Media Library</button>
        <button className="flex items-center gap-4 p-4 text-zinc-500 hover:bg-zinc-900 rounded-xl"><Clock size={18}/> Timeline</button>
        <button className="flex items-center gap-4 p-4 text-zinc-500 hover:bg-zinc-900 rounded-xl"><Music size={18}/> Audio Mixer</button>
        <button className="flex items-center gap-4 p-4 text-zinc-500 hover:bg-zinc-900 rounded-xl"><Settings size={18}/> Settings</button>
      </div>

      {/* Media Library Main */}
      <div className="flex-1 p-12 flex flex-col relative">
        <header className="flex justify-between items-center mb-12">
          <h2 className="text-5xl text-white uppercase tracking-tighter">MEDIA LIBRARY</h2>
          {/* THE ENHANCEMENT STUDIO BUTTON */}
          <button onClick={() => setShowEnhancement(true)} className="bg-purple-600 px-10 py-5 rounded-xl uppercase text-xs text-white flex items-center gap-3 shadow-2xl hover:bg-white hover:text-black transition-all">
            <Wand2 size={18}/> Enhancement Studio Attachment
          </button>
        </header>
        <div className="flex-1 bg-zinc-950 border-4 border-dashed border-zinc-900 rounded-[5rem] flex flex-col items-center justify-center text-center">
          <Upload size={64} className="text-zinc-800 mb-6" />
          <p className="text-white uppercase text-xl mb-2">Upload or Drag Assets</p>
          <p className="text-zinc-700 uppercase text-[10px]">Vault Currently Empty</p>
        </div>
        <Navigation />
      </div>

      {/* GLOBAL ENHANCEMENT OVERLAY */}
      {showEnhancement && (
        <div className="fixed inset-0 z-[200] bg-black p-10 animate-in slide-in-from-right duration-500 flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-5xl text-purple-500 uppercase flex items-center gap-4"><Terminal size={40}/> Global Enhancement Studio</h2>
            <button onClick={() => setShowEnhancement(false)} className="bg-purple-600 px-10 py-4 rounded-full uppercase text-white font-black">Close Studio</button>
          </div>
          <div className="flex-1 bg-zinc-900/20 border-4 border-zinc-800 rounded-[5rem] flex items-center justify-center">
            <Workflow size={100} className="text-zinc-800 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );

  // --- NODES 19-21: HELP DESK & THANK YOU ---
  if (page === 19) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 p-20 flex flex-col items-center italic font-black relative">
      <MessageSquare size={64} className="text-purple-500 mb-8" />
      <h2 className="text-5xl text-white uppercase mb-12 tracking-tighter">Grok Help Desk</h2>
      <div className="w-full max-w-4xl bg-zinc-900 border-2 border-zinc-800 p-10 rounded-[3rem]">
        <div className="p-6 bg-zinc-950 text-white rounded-2xl border border-purple-600/30 mb-8">Grok: Analyzing engine status... All MandaStrong parameters are synchronized for correct answers only.</div>
        <div className="flex gap-4">
          <input type="text" placeholder="Query the Agent..." className="flex-1 bg-black p-5 rounded-2xl text-white border border-zinc-800" />
          <button className="bg-purple-600 px-10 rounded-2xl text-white uppercase">Ask</button>
        </div>
      </div>
      <Navigation />
    </div>
  );

  if (page === 21) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 flex flex-col items-center justify-center relative overflow-hidden italic font-black">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80">
        <source src="thatsallfolk.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 text-center animate-in fade-in duration-1000">
        <h2 className="text-8xl text-white uppercase tracking-tighter mb-12">THANK YOU</h2>
        <button onClick={() => setPage(1)} className="bg-white text-black px-16 py-6 rounded-full uppercase text-xl hover:bg-purple-600 hover:text-white transition-all">RESTART ENGINE</button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 flex flex-col items-center justify-center italic font-black relative">
      <h2 className="text-9xl text-white opacity-10">NODE {page}</h2>
      <Navigation />
    </div>
  );
}