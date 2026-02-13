import { useState, useEffect } from 'react';
import { 
  Film, Play, Save, User, Plus, ChevronLeft, ChevronRight, Search,
  Upload, Wand2, Settings, Shield, Star, Video, Music, Monitor,
  Database, Share2, Download, Layers, Palette, Layout,
  Scissors, Mic, HelpCircle, BookOpen, TrendingUp, ThumbsUp, Heart, X, Send
} from 'lucide-react';

// Title Case Helper for Professional Branding
const toTitleCase = (str: string) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

export default function App() {
  // MASTER BYPASS: Starts at Station 11 (Editor) with Studio Master Privileges
  const [currentPage, setCurrentPage] = useState(11); 
  const [duration, setDuration] = useState(180);
  const [activeEnhancement, setActiveEnhancement] = useState<string | null>(null);

  const navigate = (page: number) => {
    setActiveEnhancement(null);
    setCurrentPage(page);
  };

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, 22));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const enhancementTools = [
    "AI 8K Upscaling", "Cinematic Grain", "Motion Stabilization", "Deep HDR Boost", "Face Retouch Pro",
    "Neural Noise Reduction", "Auto Color Balance", "Dynamic Range Expansion", "Lens Flare Synth", "Shadow Recovery",
    "Highlight Rolloff", "Skin Tone Uniformity", "Optical Flow Smooth", "Atmospheric Haze", "Sharpen Intelligence",
    "De-Banding Pro", "Moire Removal", "Color Space Transform", "Anamorphic Stretch", "Flicker Reduction",
    "Low Light Clarity", "Texture Enhancement", "Micro-Contrast Adjust", "Vignette Pro", "Film Stock Emulation",
    "Glow Synthesis", "Edge Refinement", "Smart Saturation", "Tone Mapping Pro", "Gamma Correction",
    "Black Point Calibration", "White Balance AI", "Color Match Pro", "Temporal Denoise", "Digital Intermediate",
    "Master Color Grade", "Speed Ramp Pro", "Frame Interpolation", "Depth Map Gen", "Light Leak Synth"
  ];

  const renderPage = () => {
    switch(currentPage) {
      case 1: // Welcome - Deep Purple
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-[#7e22ce]">
            <h1 className="text-8xl font-black mb-4 italic uppercase tracking-tighter">MANDASTRONG STUDIO</h1>
            <p className="text-2xl mb-12 font-bold uppercase">Make Amazing Family Movies & Bring Dreams To Life!</p>
            <button onClick={() => navigate(2)} className="px-20 py-5 bg-[#7e22ce] text-white rounded-full font-black text-2xl hover:scale-105 transition shadow-2xl">NEXT</button>
          </div>
        );

      case 3: // Pricing - Stripe Linked
        return (
          <div className="pt-5 max-w-7xl mx-auto">
            <h2 className="text-5xl font-black text-center mb-16 uppercase italic text-[#7e22ce]">Subscription Plans</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-10 bg-zinc-950 border-2 border-zinc-800 rounded-[3rem] text-center">
                <h3 className="text-2xl font-black mb-4 text-white">BASIC</h3>
                <p className="text-5xl font-black text-[#7e22ce] mb-8">$20<span className="text-lg opacity-50">/MO</span></p>
                <button className="w-full py-4 bg-zinc-800 rounded-xl font-black">ACTIVATE VIA STRIPE</button>
              </div>
              <div className="p-10 bg-zinc-950 border-2 border-zinc-800 rounded-[3rem] text-center">
                <h3 className="text-2xl font-black mb-4 text-white">PRO</h3>
                <p className="text-5xl font-black text-[#7e22ce] mb-8">$30<span className="text-lg opacity-50">/MO</span></p>
                <button className="w-full py-4 bg-zinc-800 rounded-xl font-black">ACTIVATE VIA STRIPE</button>
              </div>
              <div className="p-10 bg-zinc-950 border-4 border-[#7e22ce] rounded-[3rem] text-center shadow-2xl">
                <h3 className="text-2xl font-black mb-4 text-white">STUDIO MASTER</h3>
                <p className="text-5xl font-black text-[#7e22ce] mb-8">$50<span className="text-lg opacity-50">/MO</span></p>
                <button className="w-full py-4 bg-[#7e22ce] text-white rounded-xl font-black">ACTIVATE VIA STRIPE</button>
              </div>
            </div>
          </div>
        );

      case 11: // Editor Suite Full Depth
        return (
          <div className="pt-5">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-6xl font-black uppercase italic text-[#7e22ce]">Editor Suite Master</h2>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#7e22ce] text-white rounded-full font-black uppercase"><Search size={20}/> Search For Tools</button>
            </div>
            <div className="aspect-video bg-black border-4 border-zinc-900 rounded-[3rem] flex items-center justify-center shadow-2xl relative">
               <Play size={100} className="text-[#7e22ce] opacity-20" />
               <div className="absolute top-6 left-6 bg-[#7e22ce] px-4 py-1 rounded text-[10px] font-black">LIVE 8K PREVIEW</div>
            </div>
          </div>
        );

      case 13: // Enhancement Studio (40 Active Boxes)
        return (
          <div className="pt-5 relative">
            <h2 className="text-5xl font-black uppercase italic text-[#7e22ce] mb-12">Enhancement Studio</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {enhancementTools.map((tool, i) => (
                <div key={i} onClick={() => setActiveEnhancement(tool)} className="p-6 bg-zinc-900 border-2 border-zinc-800 rounded-2xl hover:border-[#7e22ce] transition cursor-pointer group text-center">
                  <Wand2 className="text-[#7e22ce] mx-auto mb-4 group-hover:scale-110 transition" size={32}/>
                  <h3 className="font-black uppercase text-white text-[10px]">{toTitleCase(tool)}</h3>
                </div>
              ))}
            </div>
            {activeEnhancement && (
              <div className="fixed inset-0 z-[500] bg-black p-10 flex flex-col pt-32">
                <div className="flex justify-between items-center mb-8 text-white">
                  <h3 className="text-4xl font-black text-[#7e22ce] uppercase">{activeEnhancement} Active</h3>
                  <button onClick={() => setActiveEnhancement(null)}><X size={40}/></button>
                </div>
                <div className="flex-1 flex gap-10">
                  <div className="flex-1 bg-zinc-900 border-4 border-[#7e22ce] rounded-3xl flex items-center justify-center italic text-zinc-700">PROJECT PREVIEW</div>
                  <div className="w-80 space-y-10 p-8 bg-zinc-950 border border-zinc-800 rounded-3xl">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase"><span>Intensity</span><span>85%</span></div>
                       <input type="range" className="w-full accent-[#7e22ce]" />
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex gap-6 justify-center">
                   <button onClick={() => setActiveEnhancement(null)} className="px-16 py-4 bg-zinc-800 text-white rounded-xl font-black uppercase">CONTINUE</button>
                   <button onClick={() => setActiveEnhancement(null)} className="px-16 py-4 bg-[#7e22ce] text-white rounded-xl font-black uppercase">NEXT ENHANCEMENT</button>
                </div>
              </div>
            )}
          </div>
        );

      case 21: // Community Hub
        return (
          <div className="pt-5 max-w-7xl mx-auto">
            <h2 className="text-5xl font-black uppercase italic text-[#7e22ce] mb-12 text-center">Community Art Hub</h2>
            <div className="grid md:grid-cols-2 gap-10 mb-20">
               {[1, 2].map(i => (
                 <div key={i} className="bg-zinc-900 border-2 border-zinc-800 rounded-[3rem] p-8">
                    <div className="aspect-video bg-black rounded-2xl mb-6 flex items-center justify-center italic text-zinc-800">Artwork Slot</div>
                    <div className="flex gap-4 mb-4"><ThumbsUp className="text-[#7e22ce]"/> <Heart className="text-red-500"/></div>
                    <textarea className="w-full p-4 bg-black border border-zinc-700 rounded-xl mb-4 text-white text-xs" placeholder="ADD COMMENT..."></textarea>
                    <button className="bg-[#7e22ce] px-8 py-2 rounded-lg font-black uppercase text-xs">POST</button>
                 </div>
               ))}
            </div>
            <div className="bg-zinc-950 border-4 border-[#7e22ce] rounded-[3rem] p-12 text-center">
               <BookOpen size={64} className="mx-auto text-[#7e22ce] mb-6"/><h3 className="text-4xl font-black text-white uppercase mb-4">How To Use Mandastrong Studio Guide</h3>
               <button className="px-12 py-4 bg-[#7e22ce] text-white rounded-full font-black uppercase">Download Guide</button>
            </div>
          </div>
        );

      case 22: // Finale
        return (
          <div className="flex flex-col items-center justify-center min-h-[90vh] text-center max-w-5xl mx-auto py-20">
             <div className="w-full aspect-video bg-black border-4 border-[#7e22ce] rounded-3xl overflow-hidden mb-12 flex items-center justify-center text-[#7e22ce] font-black italic text-4xl">THATSALLFOLKS.MP4</div>
             <h2 className="text-8xl font-black mb-8 italic uppercase text-[#7e22ce]">THANK YOU</h2>
             <div className="bg-zinc-950 border-2 border-[#7e22ce]/30 p-12 rounded-[3rem] text-white text-xl text-left mb-12">
                <p className="mb-6 uppercase italic text-[#7e22ce] text-3xl font-black">Mission Statement</p>
                <p className="mb-8 italic">Our mission is to end bullying and foster social growth through cinema.</p>
                <p className="text-[#7e22ce] font-black italic text-2xl uppercase underline">STORE: MANDASTRONG1.ETSY.COM</p>
             </div>
             <div className="flex gap-8">
                <button onClick={() => navigate(1)} className="px-16 py-5 bg-white text-black rounded-full font-black uppercase">HOME</button>
                <button className="px-16 py-5 bg-red-600 text-white rounded-full font-black uppercase">CLOSE APP</button>
             </div>
          </div>
        );

      default:
        return <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#7e22ce] font-black text-4xl italic">STATION {currentPage} ACTIVE</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#7e22ce]">
      <nav className="fixed top-0 w-full z-[1000] p-6 bg-black/95 border-b-2 border-[#7e22ce]/30 flex justify-between items-center px-16">
        <div className="flex items-center gap-4"><Film className="text-[#7e22ce]" size={40} /><span className="font-black text-3xl italic">MandaStrong</span></div>
        <div className="flex items-center gap-10">
          <button onClick={prevPage} className="p-3 border-2 border-zinc-800 rounded-xl text-[#7e22ce]"><ChevronLeft size={32}/></button>
          <div className="bg-[#7e22ce] px-8 py-2 rounded-full font-black text-xl text-white shadow-[0_0_20px_rgba(126,34,206,0.5)]">STATION {currentPage}</div>
          <button onClick={nextPage} className="p-3 border-2 border-zinc-800 rounded-xl text-[#7e22ce]"><ChevronRight size={32}/></button>
        </div>
      </nav>
      <main className="pt-40 pb-32 px-16">{renderPage()}</main>
      <footer className="fixed bottom-0 w-full p-6 bg-black border-t border-zinc-900 text-center z-50">
        <p className="text-xs text-zinc-600 uppercase tracking-widest font-black italic">MandaStrong Studio 2026 • {toTitleCase("Author Of Doxy The School Bully")} • MandaStrong1.Etsy.com</p>
      </footer>
    </div>
  );
}