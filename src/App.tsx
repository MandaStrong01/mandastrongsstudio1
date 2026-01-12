import React, { useState, useEffect, useRef } from 'react';
import { Scissors, Volume2, Clock, CheckCircle, X, Settings, Play, Wand2, FileVideo } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState(1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [duration, setDuration] = useState(10);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && page <= 2) {
      videoRef.current.play().catch(() => {});
    }
  }, [page]);

  const Navigation = () => (
    <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-[100] ${isEditorOpen ? 'hidden' : 'flex'}`}>
      <button onClick={() => setPage(Math.max(1, page - 1))} className="bg-black text-white px-8 py-2 rounded-full font-black uppercase text-[10px] border border-white/20">BACK</button>
      <button onClick={() => setPage(page + 1)} className="bg-black text-white px-8 py-2 rounded-full font-black uppercase text-[10px] border border-white/20">NEXT</button>
    </div>
  );

  return (
    <div className="h-screen bg-black overflow-hidden relative font-black italic text-white">
      <video ref={videoRef} className={`absolute inset-0 w-full h-full object-cover transition-opacity ${page <= 2 ? 'opacity-100' : 'opacity-0'}`} src="background.mp4" loop playsInline />
      
      {/* NODE 1: SPLASH */}
      {page === 1 && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-8xl text-black uppercase leading-none font-black tracking-tighter">MANDASTRONG'S STUDIO</h1>
          <button onClick={() => setPage(3)} className="bg-black text-white px-12 py-4 rounded-xl font-black mt-10 uppercase shadow-2xl">Enter Studio</button>
        </div>
      )}

      {/* NODE 3: PRICING ($20, $40, $80) */}
      {page === 3 && (
        <div className="h-full bg-black flex flex-col items-center p-8 border-[15px] border-zinc-900 overflow-y-auto pb-32">
          <h2 className="text-6xl uppercase font-black mb-12 mt-10">Select Plan</h2>
          <div className="grid grid-cols-3 gap-6 w-full max-w-6xl">
            {[{t:"BASIC", p:"20"}, {t:"PRO", p:"40"}, {t:"STUDIO", p:"80"}].map((plan, i) => (
              <div key={i} className="bg-zinc-900 p-10 rounded-3xl border-2 border-white/5 text-center">
                <h3 className="text-xl opacity-60 mb-2 uppercase tracking-widest">{plan.t}</h3>
                <div className="text-7xl font-black mb-6 tracking-tighter">${plan.p}</div>
                <button onClick={() => setPage(11)} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase hover:bg-cyan-500 transition-all">Select</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NODE 11: MEDIA LIBRARY + ATTACHMENT */}
      {page === 11 && (
        <div className="h-full bg-[#050505] flex flex-col border-[20px] border-zinc-900 relative">
          <div className="p-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10 text-left">
              <div>
                <h2 className="text-5xl uppercase font-black tracking-tighter leading-none">Media Library</h2>
                <p className="text-cyan-500 text-[10px] mt-2 tracking-[0.3em] uppercase font-black">Studio Assets 2026</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsEditorOpen(true)} className="bg-cyan-500 px-6 py-3 rounded-xl font-black text-black uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-white transition-all">
                  <Scissors size={18}/> Open Video Editor
                </button>
                <button className="bg-purple-600 px-6 py-3 rounded-xl font-black uppercase flex items-center gap-2 opacity-40">
                  <Wand2 size={18}/> Enhancement Suite
                </button>
              </div>
            </div>
            <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5 w-48 text-center opacity-40 italic">
              Raw_Footage_01.mp4
            </div>
          </div>

          {/* ATTACHMENT: ADVANCED ENHANCEMENT PANEL */}
          {isEditorOpen && (
            <div className="absolute inset-0 z-[200] bg-[#050505] flex flex-col p-12 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-start mb-10 text-left">
                <div>
                  <h2 className="text-7xl uppercase font-black text-cyan-400 tracking-tighter leading-none">Advanced Enhancer</h2>
                  <p className="text-zinc-500 text-xs mt-2 tracking-widest uppercase">Master Studio Quality Controls</p>
                </div>
                <button onClick={() => setIsEditorOpen(false)} className="bg-zinc-900 p-4 rounded-full border border-white/10 hover:bg-red-500 transition-all"><X size={32}/></button>
              </div>
              
              <div className="grid grid-cols-2 gap-12 flex-1 pb-20">
                <div className="space-y-12 bg-zinc-900/40 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl backdrop-blur-xl">
                  {/* SLIDERS */}
                  <div>
                    <div className="flex justify-between mb-4 uppercase text-zinc-400 tracking-widest"><span>Audio Gain</span><span className="text-cyan-400 text-3xl font-black">{volume}%</span></div>
                    <input type="range" min="0" max="200" value={volume} onChange={(e)=>setVolume(parseInt(e.target.value))} className="w-full accent-cyan-400 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-4 uppercase text-zinc-400 tracking-widest"><span>Duration (0-180m)</span><span className="text-cyan-400 text-3xl">{duration}m</span></div>
                    <input type="range" min="0" max="180" value={duration} onChange={(e)=>setDuration(parseInt(e.target.value))} className="w-full accent-cyan-400 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  {/* TOOLS */}
                  <div className="grid grid-cols-2 gap-4 pt-10 border-t border-white/5">
                    {['4K Upscale', 'AI Color', 'De-Noise', 'Frame Gen'].map(t => (
                      <button key={t} className="bg-black/50 p-6 rounded-2xl border border-white/5 text-[10px] uppercase font-black flex justify-between items-center group">{t} <Settings size={14} className="group-hover:rotate-90 transition-all"/></button>
                    ))}
                  </div>
                </div>

                <div className="bg-black rounded-[3.5rem] border-2 border-cyan-500/20 flex flex-col items-center justify-center relative shadow-inner overflow-hidden text-center">
                   <Play size={64} className="text-cyan-500 mb-6" />
                   <p className="uppercase text-[10px] opacity-30 mb-8 tracking-widest">Previewing Enhanced Output</p>
                   <button className="bg-white text-black px-12 py-4 rounded-full font-black uppercase text-xl flex items-center gap-3 shadow-2xl"><CheckCircle size={24}/> Export Movie</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FALLBACK FOR OTHER NODES */}
      {![1,3,11].includes(page) && (
        <div className="h-full bg-black border-[20px] border-zinc-900 flex flex-col items-center justify-center text-white italic font-black opacity-10 uppercase text-9xl">Node {page}</div>
      )}
      
      <Navigation />
    </div>
  );
}