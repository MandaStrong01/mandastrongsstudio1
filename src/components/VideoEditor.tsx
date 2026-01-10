import React, { useState } from 'react';

export default function VideoEditor({ onClose }: { onClose: () => void }) {
  const [duration, setDuration] = useState(0);

  return (
    <div className="fixed inset-0 bg-black z-[999] flex flex-col font-cinematic text-white border-2 border-purple-600 animate-in fade-in">
      {/* Cinecraft Master Header */}
      <div className="h-12 bg-zinc-950 flex justify-between items-center px-6 border-b border-purple-500">
        <span className="text-purple-400 font-bold uppercase tracking-widest text-xs italic">Cinecraft Master Studio</span>
        <button onClick={onClose} className="text-white hover:text-purple-400 font-bold text-xl transition-colors">✕</button>
      </div>

      <div className="flex-1 flex p-8 gap-8 bg-black">
        {/* Monitor View */}
        <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded shadow-inner flex items-center justify-center relative">
           <div className="absolute top-4 left-4 text-[10px] text-purple-500 uppercase font-bold tracking-widest bg-black/50 px-2 py-1">Monitor 01 // Master Render</div>
           <p className="text-zinc-800 italic uppercase text-[10px] tracking-[0.2em]">Ready for Cinematic Processing</p>
        </div>

        {/* Side Controls Panel */}
        <div className="w-80 bg-zinc-900 p-6 border border-purple-900 flex flex-col gap-6 shadow-[0_0_40px_rgba(88,28,135,0.15)]">
          <h3 className="text-xs font-black border-b border-purple-900 pb-2 uppercase tracking-widest text-purple-400">Enhancement Suite</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
               <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Timeline Duration</label>
               <span className="text-2xl font-black text-white">{duration}<small className="text-[10px] ml-1">M</small></span>
            </div>
            
            {/* The 0-180 Slider */}
            <input 
              type="range" min="0" max="180" value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 accent-purple-600 cursor-pointer appearance-none rounded-full"
            />
            <div className="flex justify-between text-[9px] text-zinc-600 font-bold tracking-tighter">
              <span>0 MIN</span>
              <span>90 MIN</span>
              <span>180 MIN</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button className="text-[9px] p-3 border border-zinc-800 hover:border-purple-500 bg-black font-bold uppercase tracking-widest transition-all hover:bg-zinc-950">✨ Cinematic Auto-Fix</button>
            <button className="text-[9px] p-3 border border-zinc-800 hover:border-purple-500 bg-black font-bold uppercase tracking-widest transition-all hover:bg-zinc-950">🎨 Color Grade LUT</button>
            <button className="text-[9px] p-3 border border-zinc-800 hover:border-purple-500 bg-black font-bold uppercase tracking-widest transition-all hover:bg-zinc-950">🔊 Vocal Isolation</button>
          </div>

          {/* AI Generate Action */}
          <button 
            className="mt-auto bg-purple-700 hover:bg-purple-600 py-4 font-black uppercase text-[11px] border border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all active:scale-95"
            onClick={() => alert(`AI Rendering ${duration} minute cinematic asset...`)}
          >
            AI Generate Asset
          </button>
        </div>
      </div>
    </div>
  );
}
