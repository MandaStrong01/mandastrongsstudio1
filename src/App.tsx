import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, Sparkles, Zap, Wand2, 
  Monitor, ShieldCheck, ListFilter, Film, CreditCard, 
  Activity, Settings, User, Play, Save, Share2
} from 'lucide-react';

const App = () => {
  const [page, setPage] = useState(1);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // --- NAVIGATION ENGINE ---
  const handleNext = () => setPage((p) => Math.min(p + 1, 21));
  const handleBack = () => setPage((p) => Math.max(p - 1, 1));
  const jumpToPage = (pageNum: number) => {
    setPage(pageNum);
    setShowQuickMenu(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-purple-500/30">
      
      {/* GLOBAL HEADER */}
      <header className="p-4 border-b border-purple-900/50 bg-black/90 backdrop-blur-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center font-black italic shadow-lg shadow-purple-500/20">M</div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">MandaStrong</h1>
            <span className="text-[10px] font-bold text-purple-400 tracking-[0.3em] uppercase">Studio 2025</span>
          </div>
        </div>
        <button 
          onClick={() => setShowQuickMenu(!showQuickMenu)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-900/20 border border-purple-500/50 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 transition-all shadow-xl"
        >
          <ListFilter size={14} /> Quick Access Menu
        </button>
      </header>

      {/* QUICK ACCESS OVERLAY */}
      {showQuickMenu && (
        <div className="fixed top-24 right-6 w-80 bg-zinc-950 border-2 border-purple-600 rounded-[2.5rem] p-8 z-50 shadow-[0_0_60px_rgba(147,51,234,0.4)] animate-in fade-in slide-in-from-top-6">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-400 mb-6 border-b border-purple-900 pb-4 italic">Jump To Top Pages</h4>
          <div className="grid gap-3">
            {[
              { label: "Studio Landing (P1)", target: 1, icon: <Film size={14}/> },
              { label: "Pricing Plans (P3)", target: 3, icon: <CreditCard size={14}/> },
              { label: "AI Tool Board (P6)", target: 6, icon: <Wand2 size={14}/> },
              { label: "Enhancement (P13)", target: 13, icon: <Sparkles size={14}/> },
              { label: "Export & Render (P18)", target: 18, icon: <Activity size={14}/> },
              { label: "My Profile (P20)", target: 20, icon: <User size={14}/> }
            ].map(item => (
              <button 
                key={item.label} 
                onClick={() => jumpToPage(item.target)}
                className="w-full text-left text-xs font-bold p-4 hover:bg-purple-900/40 rounded-2xl transition-all flex items-center gap-4 group border border-transparent hover:border-purple-500/30"
              >
                <span className="text-purple-500 group-hover:text-white transition-colors">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DYNAMIC CONTENT ENGINE (1-21) */}
      <main className="flex-grow flex flex-col items-center justify-center p-8 max-w-7xl mx-auto w-full relative">
        
        {/* PAGE 1: LANDING */}
        {page === 1 && (
          <div className="text-center space-y-12 animate-in zoom-in duration-1000">
             <div className="relative inline-block">
               <h2 className="text-9xl md:text-[12rem] font-black italic uppercase leading-none tracking-tighter text-white">
                MANDA<span className="text-purple-600">STRONG</span>
              </h2>
               <div className="absolute -bottom-4 right-0 bg-white text-black px-4 py-1 font-black italic uppercase text-xl transform skew-x-12 shadow-2xl">STUDIO 2025</div>
             </div>
            <div className="space-y-6">
              <h3 className="text-5xl font-black italic text-zinc-400 uppercase tracking-tighter">The Ultimate Movie Making Experience</h3>
              <p className="text-xl opacity-50 italic max-w-2xl mx-auto font-medium">Professional 8K Rendering | 720+ AI Tools | Family Movie Magic</p>
            </div>
            <button onClick={handleNext} className="group relative px-16 py-6 bg-purple-600 rounded-full font-black text-2xl shadow-[0_0_40px_rgba(147,51,234,0.5)] hover:scale-105 active:scale-95 transition-all overflow-hidden">
              <span className="relative z-10">ENTER THE STUDIO</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        )}

        {/* PAGE 3: THE $20, $30, $50 PLANS */}
        {page === 3 && (
          <div className="w-full space-y-16 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
              <h3 className="text-6xl font-black italic uppercase">Choose Your Tier</h3>
              <p className="text-purple-400 font-bold italic uppercase tracking-[0.4em] text-sm">Monthly Production Subscriptions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { name: 'Basic', price: 20, tools: '100 AI Tools', color: 'border-zinc-800' },
                { name: 'Pro', price: 30, tools: '300 AI Tools', color: 'border-purple-600 shadow-2xl shadow-purple-500/20' },
                { name: 'Studio', price: 50, tools: 'All 720 AI Tools', color: 'border-indigo-600' }
              ].map((plan) => (
                <div key={plan.name} className={`p-12 border-2 ${plan.color} rounded-[4rem] bg-zinc-950 flex flex-col group hover:-translate-y-4 transition-all duration-500`}>
                  <h4 className="text-3xl font-black mb-2 uppercase italic">{plan.name}</h4>
                  <div className="text-7xl font-black mb-10 tracking-tighter">${plan.price}<span className="text-lg opacity-30 font-normal">/mo</span></div>
                  <ul className="space-y-5 mb-12 text-sm opacity-60 flex-grow font-bold uppercase tracking-widest">
                    <li className="flex items-center gap-4"><Zap size={18} className="text-purple-500" /> {plan.tools}</li>
                    <li className="flex items-center gap-4"><Monitor size={18} className="text-purple-500" /> 8K Ultra-HD Export</li>
                    <li className="flex items-center gap-4"><ShieldCheck size={18} className="text-purple-500" /> Full Studio Rights</li>
                  </ul>
                  <button className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] group-hover:bg-purple-600 group-hover:text-white transition-all">Get Started</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 13: THE 600+ TOOLS ENGINE */}
        {page === 13 && (
          <div className="w-full space-y-12 animate-in slide-in-from-bottom-12 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-purple-900/40 pb-12 gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-6xl font-black italic uppercase">Enhancement Studio</h3>
                <p className="text-purple-400 text-xl font-bold italic uppercase tracking-widest">Accessing 720+ Professional Cinematic Tools</p>
              </div>
              <div className="flex gap-4">
                <button className="p-5 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-all"><Save size={24}/></button>
                <button className="px-12 py-5 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-3xl font-black uppercase shadow-2xl shadow-purple-500/30">Launch All Tools</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 overflow-y-auto max-h-[50vh] pr-4 custom-scrollbar">
              {["4K Upscaler", "Color Match", "Noise Filter", "Frame Boost", "Voice Fix", "HDR Mapper", "Lighting", "Style Gen", "Depth FX", "Face Fix", "Motion Blur", "Auto Script", "Scene Cutter", "VFX Burn", "Sky Swap", "Sound Pad", "Direct AI", "Final Cut"].map((tool, i) => (
                <button key={i} className="aspect-square border border-purple-900/30 bg-zinc-950 rounded-[2.5rem] hover:border-purple-500 group transition-all flex flex-col items-center justify-center gap-4 p-4">
                  <Wand2 size={28} className="text-purple-900 group-hover:text-purple-400 transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{tool}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* PERSISTENT MASTER FOOTER */}
      <footer className="p-10 border-t border-purple-900/50 bg-black flex flex-col items-center gap-10">
        <div className="flex gap-8 w-full max-w-2xl">
          <button onClick={handleBack} className="flex-1 py-6 border-2 border-zinc-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-zinc-900 transition-all flex items-center justify-center gap-3">
            <ChevronLeft size={18}/> BACK
          </button>
          <button onClick={handleNext} className="flex-1 py-6 bg-purple-600 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-purple-900/50 hover:bg-purple-500 transition-all flex items-center justify-center gap-3">
            NEXT <ChevronRight size={18}/>
          </button>
        </div>
        <div className="text-center space-y-4 max-w-4xl opacity-50">
          <p className="text-[11px] font-black uppercase tracking-[0.6em] leading-loose">
            MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Official Studio App ~ MandaStrong1.Etsy.com
          </p>
          <div className="flex justify-center gap-8 text-[10px] font-bold uppercase tracking-widest">
            <span>© 2026 MANDASTRONG MEDIA</span>
            <span>PROUDLY SUPPORTING VETERANS</span>
            <span>MADE WITH FAMILY IN MIND</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;