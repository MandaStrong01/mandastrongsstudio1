import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Film, Play, Bot, Menu, Check, Search } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');
  const [movieDuration, setMovieDuration] = useState(90);
  const [searchQuery, setSearchQuery] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // OWNER BYPASS: woolleya129@gmail.com
  const handleLogin = () => {
    if (email.toLowerCase() === 'woolleya129@gmail.com') {
      setCurrentPage(11); 
    } else {
      setCurrentPage(4);
    }
  };

  useEffect(() => {
    if (currentPage === 1 && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentPage]);

  const Nav = ({ p, n }: { p: number; n: number }) => (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 flex gap-8 z-40">
      <button onClick={() => setCurrentPage(p)} className="bg-purple-900/80 text-white px-12 py-3 rounded-xl font-bold border-2 border-purple-500 uppercase italic">Back</button>
      <button onClick={() => setCurrentPage(n)} className="bg-purple-600 text-white px-12 py-3 rounded-xl font-bold border-2 border-purple-400 uppercase italic">Next</button>
    </div>
  );

  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-black font-sans selection:bg-purple-500 overflow-x-hidden">
      {children}
      <div className="fixed top-6 right-6 z-50 group">
        <button className="bg-purple-600 p-4 rounded-full border-2 border-purple-400 shadow-2xl"><Menu size={24} /></button>
        <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-gray-900 border-2 border-purple-600 rounded-xl p-2 shadow-2xl">
          <p className="text-[10px] font-bold p-2 uppercase italic text-purple-400">Quick Access</p>
          {['Editor Home', 'Media Library', 'Tools'].map(i => <button key={i} className="w-full text-left p-2 hover:bg-purple-600 text-xs font-bold uppercase">{i}</button>)}
        </div>
      </div>
      <button onClick={() => setCurrentPage(19)} className="fixed bottom-8 right-8 bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-50 border-2 border-purple-400"><Bot size={28} /></button>
      {currentPage >= 3 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full text-center z-30">
          <p className="text-gray-500 text-[10px] font-black uppercase">MandaStrong1 2026 ~ Author Of Doxy The School Bully ~ MandaStrong1.Etsy.com</p>
        </div>
      )}
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 1: // LANDING
        return (
          <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
            <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src="background__2_.mp4" type="video/mp4" />
            </video>
            <div className="relative z-10 text-center px-4">
              <h1 className="text-7xl md:text-9xl font-black mb-4 text-black italic tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>MANDASTRONG'S STUDIO</h1>
              <p className="text-2xl md:text-3xl mb-32 text-black font-bold italic tracking-tight underline decoration-black underline-offset-8">Welcome To The All-In-One Make-A-Movie App!</p>
              <div className="flex gap-6 justify-center">
                <button onClick={() => setCurrentPage(2)} className="bg-black text-white px-12 py-4 rounded-xl font-bold shadow-2xl">Next</button>
                <button onClick={() => setCurrentPage(3)} className="bg-black text-white px-12 py-4 rounded-xl font-bold shadow-2xl">Login</button>
              </div>
            </div>
          </div>
        );

      case 3: // PLANS
        return (
          <div className="p-8 pb-40">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-purple-950/20 border-2 border-purple-600 p-8 rounded-3xl">
                  <h2 className="text-3xl font-black mb-6 italic text-purple-500 uppercase">Login</h2>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="woolleya129@gmail.com" className="w-full bg-black border-2 border-purple-800 p-4 rounded-xl mb-4 text-white" />
                  <button onClick={handleLogin} className="w-full bg-purple-600 py-4 rounded-xl font-black uppercase italic">Access Studio</button>
                </div>
                <div className="bg-purple-950/20 border-2 border-purple-600 p-8 rounded-3xl flex items-center justify-center"><button className="w-full bg-purple-600 py-4 rounded-xl font-black uppercase italic">Create Account</button></div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 border-t border-purple-900/40 pt-12">
                <div className="border-2 border-purple-600 p-6 rounded-2xl text-center"><h3 className="font-bold mb-2">Basic</h3><p className="text-4xl font-black mb-4">$20<span className="text-xs text-gray-500">/mo</span></p><button className="w-full bg-gray-800 py-2 rounded-lg font-bold">Select</button></div>
                <div className="border-2 border-yellow-500 p-6 rounded-2xl text-center bg-purple-900/20 scale-105"><h3 className="font-bold mb-2">Pro</h3><p className="text-4xl font-black mb-4">$30<span className="text-xs text-gray-500">/mo</span></p><button className="w-full bg-yellow-500 text-black py-2 rounded-lg font-bold uppercase">✓ Selected</button></div>
                <div className="border-2 border-purple-600 p-6 rounded-2xl text-center"><h3 className="font-bold mb-2">Studio</h3><p className="text-4xl font-black mb-4">$50<span className="text-xs text-gray-500">/mo</span></p><button className="w-full bg-gray-800 py-2 rounded-lg font-bold">Select</button></div>
              </div>
              <div className="flex justify-center mt-12"><button className="bg-purple-600 px-20 py-4 rounded-xl font-black text-xl uppercase italic shadow-2xl border-2 border-purple-400">Continue</button></div>
            </div>
            <Nav p={2} n={4} />
          </div>
        );

      case 4: // AI BOARDS
        return (
          <div className="p-8">
            <div className="flex justify-between items-center mb-12">
              <div className="relative"><Search className="absolute left-3 top-3 text-purple-500" size={18} /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="SEARCH FOR TOOL" className="bg-gray-900 border-2 border-purple-600 rounded-lg py-2 pl-10 pr-4 font-bold text-xs uppercase outline-none w-64" /></div>
              <h1 className="text-4xl font-black text-purple-500 italic uppercase">AI Tool Board</h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto opacity-30 italic font-bold text-center pt-20">Full 600-Tool Suite Active for Owner...</div>
            <Nav p={3} n={5} />
          </div>
        );

      case 14: // ENHANCEMENT
        return (
          <div className="p-8 flex flex-col min-h-screen pb-40">
            <h1 className="text-4xl font-black mb-12 text-purple-500 italic uppercase underline decoration-purple-600 underline-offset-8">Enhancement Studio</h1>
            <div className="grid md:grid-cols-2 gap-12 flex-1 mb-10">
              <div className="bg-gray-900 border-2 border-purple-600 rounded-3xl flex items-center justify-center relative"><Play size={80} className="text-purple-600 opacity-20" /><div className="absolute top-4 left-4 bg-purple-600 px-4 py-1 rounded-lg text-[10px] font-black uppercase italic">Live Viewer</div></div>
              <div className="bg-gray-950 p-8 rounded-3xl border border-purple-900/30 flex flex-col justify-center">
                <label className="text-xl font-black block mb-8 italic text-purple-400 uppercase tracking-widest underline decoration-purple-600 underline-offset-4">Movie Duration Slider</label>
                <input type="range" min="0" max="180" value={movieDuration} onChange={(e) => setMovieDuration(parseInt(e.target.value))} className="w-full h-4 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                <div className="flex justify-between mt-8 text-5xl font-black text-white"><span>{movieDuration} MIN</span><span className="text-gray-700 text-sm uppercase tracking-widest self-end">180 Min Cap</span></div>
              </div>
            </div>
            <div className="flex justify-center"><button className="bg-purple-600 px-20 py-5 rounded-2xl font-black text-2xl shadow-2xl uppercase italic border-2 border-purple-400">Continue Rendering</button></div>
            <Nav p={12} n={15} />
          </div>
        );

      case 21: // FINALE
        return (
          <div className="flex flex-col items-center justify-center text-center p-10 min-h-screen bg-black">
            <h1 className="text-6xl md:text-8xl font-black mb-12 text-purple-500 italic uppercase tracking-tighter leading-none">THAT'S ALL FOLKS!</h1>
            <div className="bg-purple-950/20 border-2 border-purple-600 p-12 rounded-3xl max-w-4xl shadow-2xl">
              <h2 className="text-3xl font-black mb-8 italic uppercase text-white">A Special Thank You</h2>
              <p className="text-xl text-gray-300 italic mb-10 leading-relaxed">Supporting Veterans Mental Health & School Safety Initiatives Through Your Creative Vision.</p>
              <button onClick={() => window.open('https://MandaStrong1.Etsy.com')} className="bg-purple-600 px-16 py-4 rounded-xl font-black text-xl uppercase italic shadow-xl border-2 border-purple-400">Visit Etsy Store</button>
            </div>
            <button onClick={() => setCurrentPage(1)} className="mt-16 bg-green-600 px-24 py-5 rounded-2xl font-black text-2xl border-4 border-green-400 uppercase italic shadow-2xl">🏠 Home</button>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <h1 className="text-5xl font-black text-purple-500 uppercase italic mb-10 tracking-widest">Module {currentPage}</h1>
            <Nav p={currentPage - 1} n={currentPage + 1} />
          </div>
        );
    }
  };

  return <Layout>{renderPage()}</Layout>;
}