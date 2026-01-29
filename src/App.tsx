import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Bot, Menu, Search, X, Send, ChevronRight, ChevronLeft, Sparkles, Check, MessageCircle, Film, Volume2, Palette, Layers, Scissors, Wand2
} from 'lucide-react';

// --- DATA LOCKED TO DESIGN SPECIFICATIONS ---
const TOOL_BOARDS = {
  Writing: ["Dialogue Writer", "Plot Generator", "Scene Writer", "Story Outliner", "Character Developer", "Dialogue Editor", "Plot Designer", "Story Planner", "Treatment Writer", "Script Formatter", "Plot Creator", "Three Act Builder", "Backstory Generator", "Motivation Builder", "Theme Generator", "Advanced Story Outliner", "Story Consultant", "Plot Twist Creator", "Scene Analyzer", "Conflict Generator"],
  Voice: ["Voice Maker", "Voice Cloner", "Voice Creator Tool", "Voice Recorder", "Speech Converter", "Voice Builder", "Advanced Voice Gener...", "Voice Studio Tool", "Premium Voice Gener...", "Voice Audio Tool", "Emotional Voice Gener...", "Advanced Speech Crea...", "Natural Voice Generator", "Voice Reader", "Speech Generator", "Narration Creator", "Voice Imitator", "Fast Speech Generator", "Live Voice Tool", "Streaming Voice Gener..."],
  Image: ["Image Creator", "Advanced Image Gene...", "Design Generator", "Image Tool", "Art Maker", "Art Mixer", "Image Stream Tool", "Art Library Tool", "Workflow Tool", "Auto Image Generator", "Image Studio Pro", "Easy Image Generator", "Text Inversion Tool", "Style Tool", "Model Trainer", "Style Transfer Tool", "Turnaround Generator", "Expression Grid Tool", "Depth Controller", "Edge Guide Tool"],
  Video: ["Motion Video Maker", "Video Creator", "Avatar Generator", "Video Synthesizer", "Video Studio", "Video Flow Generator", "Video Creator Studio", "Video Crafter", "Image to Motion Tool", "Video Style Tool", "Temporal Flow Tool", "Frame Blender", "Dynamic Pan Tool", "Tilt Shot Tool", "Tracking Shot Tool", "Crane Movement Tool", "Steadycam Tool", "Handheld Effect Tool", "Shot Transition Tool", "Establishing Shot Tool"],
  Motion: ["Motion Animator", "Motion Studio", "Auto Animator", "Motion Flow Tool", "Motion Capture Pro", "Webcam Motion Tool", "Skeleton Tracker", "Joint Tracker", "Character Rigger", "3D Character Studio", "Player Avatar Creator", "Avatar Generator", "Face Tracker", "Facial Motion Tool", "Audio to Face Tool", "Face Audio Syncer", "3D Shape Generator", "3D Model Tool", "Gaussian Splat Render", "3D From Image Tool"]
};

export default function App() {
  const [page, setPage] = useState(1);
  const [duration, setDuration] = useState(90);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const GlobalFooter = () => (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-black/95 border-t border-purple-900/30 py-4 text-center">
      <p className="text-[10px] font-black text-white uppercase tracking-widest">
        MandaStrong1 2026 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com
      </p>
    </div>
  );

  const NavButtons = () => (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 flex gap-6 z-50">
      {page > 1 && <button onClick={() => setPage(page - 1)} className="bg-zinc-900 border-2 border-purple-600 px-12 py-3 rounded-xl text-purple-400 font-black uppercase text-xl shadow-2xl flex items-center gap-3 transition hover:bg-purple-950"><ChevronLeft size={28}/> Back</button>}
      <button onClick={() => setPage(page + 1)} className="bg-purple-600 border-2 border-purple-400 px-14 py-3 rounded-2xl text-white font-black uppercase text-xl shadow-[0_0_50px_rgba(168,85,247,0.4)] flex items-center gap-3 transition hover:scale-105">Next <ChevronRight size={28}/></button>
    </div>
  );

  const renderPage = () => {
    switch (page) {
      case 1: // LANDING
        return (
          <div className="h-screen relative flex flex-col items-center justify-center overflow-hidden">
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src="background__2_.mp4" type="video/mp4" />
            </video>
            <div className="relative z-10 text-center px-4">
              <h1 className="text-7xl md:text-9xl font-black text-black italic tracking-tighter leading-none mb-4" style={{ fontFamily: 'Impact, sans-serif' }}>MANDASTRONG'S STUDIO</h1>
              <p className="text-2xl font-black text-black uppercase italic tracking-tight mb-32 underline underline-offset-8 decoration-4 decoration-black">Welcome To The All-In-One Make-A-Movie App!</p>
              <div className="flex gap-6 justify-center scale-110">
                <button onClick={() => setPage(2)} className="bg-black text-white px-16 py-5 rounded-2xl font-bold text-2xl shadow-2xl border-2 border-zinc-800 uppercase italic">Next</button>
                <button onClick={() => setPage(3)} className="bg-black text-white px-16 py-5 rounded-2xl font-bold text-2xl shadow-2xl border-2 border-zinc-800 uppercase italic">Login</button>
                <button onClick={() => setPage(3)} className="bg-black text-white px-16 py-5 rounded-2xl font-bold text-2xl shadow-2xl border-2 border-zinc-800 uppercase italic">Register</button>
              </div>
            </div>
          </div>
        );

      case 3: // UPDATED PLANS
        return (
          <div className="min-h-screen pt-20 pb-64 px-6 flex flex-col items-center bg-black">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
              {[
                {t:'Basic', p:'$20', d:['HD Export', '100 AI Tools', 'Basic Templates', '10GB Storage']},
                {t:'Pro', p:'$30', d:['4K Export', '300 AI Tools', 'Premium Templates', '100GB Storage'], s:true},
                {t:'Studio', p:'$50', d:['8K Export', 'All 600 AI Tools', 'Unlimited Templates', '1TB Storage']}
              ].map(plan => (
                <div key={plan.t} className={`p-10 rounded-[50px] border-2 transition-all flex flex-col ${plan.s ? 'border-yellow-500 scale-105 bg-zinc-900 shadow-2xl' : 'border-purple-900/30 bg-zinc-950'}`}>
                  {plan.s && <div className="bg-purple-600 text-white text-[10px] px-5 py-1.5 rounded-full font-black uppercase w-fit mb-6">Popular</div>}
                  <h3 className="text-4xl font-black text-white mb-2 uppercase italic">{plan.t}</h3>
                  <div className="text-6xl font-black text-purple-400 mb-10">{plan.p}<span className="text-xl text-white/40">/mo</span></div>
                  <ul className="space-y-4 mb-10 flex-grow text-white/80 font-bold uppercase italic">
                    {plan.d.map(item => <li key={item} className="text-xs flex gap-4"><Check size={20} className="text-purple-500"/> {item}</li>)}
                  </ul>
                  <button onClick={() => setPage(11)} className="w-full bg-purple-600 py-6 rounded-[30px] font-black text-2xl uppercase italic text-white shadow-xl">Select Plan</button>
                </div>
              ))}
            </div>
            <button onClick={() => setPage(11)} className="mt-20 bg-purple-600 text-white px-32 py-8 rounded-[40px] text-4xl font-black uppercase italic shadow-[0_0_80px_rgba(168,85,247,0.5)]">Continue to Payment</button>
          </div>
        );

      case 4: case 5: case 6: case 7: case 8: // TOOL BOARDS
        const boardKey = Object.keys(TOOL_BOARDS)[page-4];
        return (
          <div className="min-h-screen bg-black p-12 pt-24 pb-64">
            <div className="flex justify-between items-center mb-16 px-10">
              <h1 className="text-8xl font-black text-purple-600 uppercase italic tracking-tighter underline underline-offset-8 decoration-purple-900/30">
                {boardKey.toUpperCase()} BOARD
              </h1>
              <div className="relative w-96">
                <Search className="absolute left-6 top-6 text-purple-600" size={24} />
                <input placeholder="SEARCH TOOLS..." className="w-full bg-zinc-900 border-2 border-purple-900/40 p-6 pl-16 rounded-3xl font-black text-white text-lg focus:border-purple-500 outline-none uppercase italic" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10 max-h-[55vh] overflow-y-auto custom-scrollbar">
              {TOOL_BOARDS[boardKey as keyof typeof TOOL_BOARDS].map((tool, i) => (
                <button key={i} className="bg-zinc-950 border-2 border-purple-900/30 p-10 rounded-[35px] group hover:bg-purple-600 transition-all text-left flex items-center gap-8 relative overflow-hidden">
                  <div className="bg-purple-600/10 p-5 rounded-2xl group-hover:bg-white/20 transition"><Sparkles size={40} className="text-purple-500 group-hover:text-white" /></div>
                  <span className="text-3xl md:text-5xl font-black text-white group-hover:text-black uppercase italic tracking-tighter leading-none">{tool}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 14: // ENHANCEMENT STUDIO (3H SLIDER)
        return (
          <div className="min-h-screen bg-black p-12 pt-24 pb-64 flex flex-col">
            <h1 className="text-8xl font-black text-purple-600 uppercase italic mb-16 tracking-tighter underline underline-offset-8 decoration-purple-900/30 text-center uppercase italic">ENHANCEMENT STUDIO</h1>
            <div className="flex-1 grid md:grid-cols-2 gap-12 mb-10">
              <div className="bg-zinc-900 border-2 border-purple-600/30 rounded-[60px] flex items-center justify-center relative shadow-inner overflow-hidden"><Play size={120} className="text-purple-600 opacity-20" /></div>
              <div className="bg-zinc-950 p-16 rounded-[60px] border-2 border-purple-900/20 flex flex-col justify-center text-center">
                <label className="text-3xl font-black block mb-12 italic text-purple-500 uppercase tracking-widest underline underline-offset-8 decoration-purple-600">Movie Duration Slider</label>
                <div className="text-9xl font-black text-white mb-12 italic tracking-tighter">{duration}<span className="text-2xl text-gray-600 uppercase ml-6">MIN</span></div>
                <input type="range" min="0" max="180" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="w-full h-4 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                <div className="flex justify-between mt-8 text-xs font-black uppercase text-gray-700 tracking-[0.2em]"><span>0 min</span><span>180 min cap</span></div>
              </div>
            </div>
          </div>
        );

      case 21: // THE FINALE
        return (
          <div className="min-h-screen bg-black p-12 pt-24 flex flex-col items-center">
            <div className="max-w-[1400px] w-full bg-zinc-950 border-[6px] border-purple-600 rounded-[120px] p-24 text-center shadow-[0_0_150px_rgba(138,43,226,0.3)]">
              <h1 className="text-[10rem] font-black text-purple-600 mb-12 uppercase italic leading-none tracking-tighter underline underline-offset-[20px] decoration-purple-900/40">THAT'S ALL FOLKS!</h1>
              <div className="bg-purple-900/10 border-2 border-purple-600 p-16 rounded-[80px] mb-20 text-center">
                <h2 className="text-5xl font-black text-white mb-10 uppercase italic underline underline-offset-8">A Special Thank You</h2>
                <p className="text-2xl text-gray-300 italic mb-12 font-medium max-w-5xl mx-auto uppercase">Supporting Veterans Mental Health & School Safety Initiatives Through Your Creative Vision.</p>
                <button onClick={() => window.open('https://MandaStrong1.Etsy.com')} className="bg-purple-600 px-24 py-6 rounded-3xl font-black text-3xl uppercase italic shadow-2xl border-2 border-purple-400">Visit Etsy Store</button>
              </div>
              <button onClick={() => setPage(1)} className="bg-green-600 px-32 py-8 rounded-[40px] font-black text-4xl border-4 border-green-400 uppercase italic shadow-2xl">Return Home</button>
            </div>
          </div>
        );

      default: return <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-10"><h1 className="text-6xl font-black text-purple-500 uppercase italic mb-10 tracking-widest tracking-tighter">Module {page}</h1></div>;
    }
  };

  return (
    <div className="app bg-black min-h-screen font-sans selection:bg-purple-600 overflow-x-hidden">
      {renderPage()}
      <GlobalFooter />
      {page > 1 && page < 21 && <NavButtons />}
      <button className="fixed bottom-10 right-10 bg-purple-600 p-6 rounded-full shadow-[0_0_50px_rgba(168,85,247,0.5)] z-[100] hover:scale-110 transition border-2 border-purple-400">
        <MessageCircle size={40} className="text-white fill-white" />
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8a2be2; border-radius: 20px; border: 3px solid black; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 40px; width: 40px; border-radius: 50%; background: #fff; cursor: pointer; border: 4px solid #8a2be2; box-shadow: 0 0 20px #8a2be2; }
      `}} />
    </div>
  );
}