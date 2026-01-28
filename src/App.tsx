import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Film, Play, Bot, Menu, Check, Search, Video, Clapperboard, Music } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');
  const [movieDuration, setMovieDuration] = useState(90);
  const [searchQuery, setSearchQuery] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // OWNER ACCESS: woolleya129@gmail.com triggers immediate bypass
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

  // FIXED FOOTER (Starts Page 3)
  const Footer = () => (
    <div className="fixed bottom-4 left-0 w-full text-center z-30 px-4">
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
        MandaStrong1 2026 ~ Author Of Doxy The School Bully ~ MandaStrong1.Etsy.com
      </p>
    </div>
  );

  // GLOBAL UI ELEMENTS
  const GlobalUI = () => (
    <>
      <div className="fixed top-6 right-6 z-50 group">
        <button className="bg-purple-600 p-4 rounded-full border-2 border-purple-400 shadow-2xl hover:scale-110 transition-all"><Menu size={24} /></button>
        <div className="hidden group-hover:block absolute right-0 mt-2 w-56 bg-gray-900 border-2 border-purple-600 rounded-xl shadow-2xl p-2 uppercase italic text-xs font-bold">
          <p className="p-2 text-purple-400 border-b border-purple-900/50 mb-2">Quick Access</p>
          {['Editor Home', 'Media Library', 'AI Tool Boards', 'Help Desk'].map(item => (
            <button key={item} className="w-full text-left p-2 hover:bg-purple-600 rounded-lg">{item}</button>
          ))}
        </div>
      </div>
      <button onClick={() => setCurrentPage(19)} className="fixed bottom-8 right-8 bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-50 border-2 border-purple-400 hover:scale-110 transition-all">
        <Bot size={28} />
      </button>
    </>
  );

  // CENTERED NAV BUTTONS
  const Nav = ({ p, n }: { p: number; n: number }) => (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 flex gap-8 z-40">
      <button onClick={() => setCurrentPage(p)} className="bg-purple-950/80 text-white px-14 py-3 rounded-xl font-bold border-2 border-purple-500 uppercase italic shadow-lg">Back</button>
      <button onClick={() => setCurrentPage(n)} className="bg-purple-600 text-white px-14 py-3 rounded-xl font-bold border-2 border-purple-400 uppercase italic shadow-lg">Next</button>
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
              <h1 className="text-7xl md:text-9xl font-black mb-4 text-black italic tracking-tighter leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>MANDASTRONG'S STUDIO</h1>
              <p className="text-2xl md:text-3xl mb-32 text-black font-bold italic tracking-tight underline decoration-black decoration-4 underline-offset-8">Welcome To The All-In-One Make-A-Movie App!</p>
              <div className="flex gap-6 justify-center">
                <button onClick={() => setCurrentPage(2)} className="bg-black text-white px-14 py-5 rounded-2xl font-bold text-xl shadow-2xl">Next</button>
                <button onClick={() => setCurrentPage(3)} className="bg-black text-white px-14 py-5 rounded-2xl font-bold text-xl shadow-2xl">Login</button>
              </div>
            </div>
          </div>
        );

      case 3: // PLANS OVERLAY
        return (
          <div className="min-h-screen bg-black/90 text-white p-8 overflow-y-auto pb-40">
            <div className="max-w-7xl mx-auto pt-10">
              <div className="grid md:grid-cols-2 gap-8 mb-20">
                <div className="bg-purple-950/20 border-2 border-purple-600 rounded-3xl p-10">
                  <h2 className="text-3xl font-black mb-8 italic uppercase text-purple-500">Login</h2>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="woolleya129@gmail.com" className="w-full bg-black border-2 border-purple-800 rounded-xl p-4 mb-4 text-white" />
                  <button onClick={handleLogin} className="w-full bg-purple-600 py-4 rounded-xl font-black text-xl uppercase italic shadow-lg">Access Studio</button>
                </div>
                <div className="bg-purple-950/20 border-2 border-purple-600 rounded-3xl p-10 flex flex-col justify-center text-center">
                  <h2 className="text-3xl font-black mb-8 italic uppercase text-purple-500">Register</h2>
                  <button className="w-full bg-purple-600 py-4 rounded-xl font-black text-xl uppercase italic shadow-lg">Create Account</button>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 border-t border-purple-900/60 pt-16">
                <div className="border-2 border-purple-600 p-8 rounded-3xl text-center"><h3 className="text-2xl font-black mb-4 italic uppercase">Basic</h3><p className="text-5xl font-black mb-6">$20<span className="text-lg text-gray-500 font-bold">/mo</span></p><button className="w-full bg-gray-800 py-3 rounded-xl font-bold uppercase">Select</button></div>
                <div className="border-2 border-yellow-400 p-8 rounded-3xl text-center relative bg-purple-900/20 scale-105 shadow-2xl shadow-yellow-500/10"><div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-1 rounded-full text-[10px] font-black uppercase italic">Most Popular</div><h3 className="text-2xl font-black mb-4 italic uppercase">Pro</h3><p className="text-5xl font-black mb-6">$30<span className="text-lg text-gray-400 font-bold">/mo</span></p><button className="w-full bg-yellow-500 text-black py-3 rounded-xl font-black uppercase italic">✓ SELECTED</button></div>
                <div className="border-2 border-purple-600 p-8 rounded-3xl text-center"><h3 className="text-2xl font-black mb-4 italic uppercase">Studio</h3><p className="text-5xl font-black mb-6">$50<span className="text-lg text-gray-400 font-bold">/mo</span></p><button className="w-full bg-gray-800 py-3 rounded-xl font-bold uppercase">Select</button></div>
              </div>
              <div className="flex justify-center mt-12"><button className="bg-purple-600 px-24 py-5 rounded-2xl font-black text-2xl border-2 border-purple-400 shadow-2xl uppercase italic">Continue</button></div>
            </div>
            <Nav p={2} n={4} /><Footer />
          </div>
        );

      case 4: // AI BOARD
        return (
          <div className="min-h-screen bg-black text-white p-8">
            <div className="flex justify-between items-center mb-12">
              <div className="relative w-80">
                <Search className="absolute left-4 top-4 text-purple-500" size={20} />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="SEARCH FOR TOOL" className="w-full bg-gray-900 border-2 border-purple-600 rounded-xl py-3 pl-12 pr-4 font-black uppercase text-xs" />
              </div>
              <h1 className="text-4xl font-black text-purple-500 italic uppercase underline decoration-purple-600 underline-offset-8">AI Tool Board</h1>
            </div>
            <div className="max-w-5xl mx-auto opacity-30 italic font-bold text-center pt-24">Full Library of 600 Tools Active for Admin...</div>
            <Nav p={3} n={5} /><Footer />
          </div>
        );

      case 12: // MEDIA LIBRARY
        return (
          <div className="min-h-screen bg-black text-white p-10">
            <div className="flex justify-between items-start mb-16">
              <h1 className="text-4xl font-black text-purple-500 italic uppercase underline decoration-purple-600 underline-offset-8">Media Library</h1>
              <div className="flex gap-4">
                <button onClick={() => setCurrentPage(14)} className="bg-blue-600 border-2 border-blue-400 px-10 py-4 rounded-xl font-black text-white flex items-center gap-3 shadow-2xl uppercase italic"><Play size={20} fill="white" /> Open Enhancement Studio</button>
                <button className="bg-purple-600 px-10 py-4 rounded-xl font-black uppercase italic shadow-lg">Upload Media</button>
              </div>
            </div>
            <Nav p={11} n={13} /><Footer />
          </div>
        );

      case 14: // ENHANCEMENT STUDIO (0-180 MIN)
        return (
          <div className="min-h-screen bg-black text-white p-10 flex flex-col pb-40">
            <h1 className="text-5xl font-black mb-12 text-purple-500 italic uppercase underline decoration-purple-600 underline-offset-8 tracking-tighter">Enhancement Studio</h1>
            <div className="flex-1 grid md:grid-cols-2 gap-12 mb-10">
              <div className="bg-gray-900 border-2 border-purple-600 rounded-3xl flex items-center justify-center relative"><Play size={100} className="text-purple-600 opacity-20" /><div className="absolute top-6 left-6 bg-purple-600 px-5 py-2 rounded-xl text-xs font-black uppercase italic shadow-lg">Live Viewer</div></div>
              <div className="bg-gray-950 p-12 rounded-3xl border border-purple-900/30 flex flex-col justify-center">
                <label className="text-2xl font-black block mb-12 italic text-purple-400 uppercase tracking-widest underline decoration-purple-600 underline-offset-4">Movie Duration Slider</label>
                <input type="range" min="0" max="180" value={movieDuration} onChange={(e) => setMovieDuration(parseInt(e.target.value))} className="w-full h-4 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                <div className="flex justify-between mt-12 text-6xl font-black text-white tracking-tighter italic"><span>{movieDuration} MIN</span><span className="text-gray-700 text-xl uppercase tracking-[0.3em] self-end">180 Min Cap</span></div>
              </div>
            </div>
            <div className="flex justify-center mb-10"><button className="bg-purple-600 px-24 py-6 rounded-3xl font-black text-3xl shadow-2xl uppercase italic border-2 border-purple-400">Continue Rendering</button></div>
            <Nav p={12} n={15} /><Footer />
          </div>
        );

      case 21: // FINALE
        return (
          <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center justify-center text-center">
            <h1 className="text-7xl md:text-9xl font-black mb-12 text-purple-500 italic uppercase tracking-tighter leading-none">THAT'S ALL FOLKS!</h1>
            <div className="bg-purple-950/20 border-2 border-purple-600 rounded-3xl p-16 max-w-5xl shadow-2xl backdrop-blur-md">
              <h2 className="text-4xl font-black mb-10 italic uppercase tracking-widest text-white text-center">A Special Thank You</h2>
              <p className="text-2xl text-gray-300 italic mb-12 font-medium leading-relaxed underline decoration-purple-500 underline-offset-8">Supporting Veterans Mental Health & School Safety Initiatives Through Your Creative Vision.</p>
              <button onClick={() => window.open('https://MandaStrong1.Etsy.com')} className="bg-purple-600 px-20 py-5 rounded-2xl font-black text-2xl uppercase tracking-tighter shadow-xl border-2 border-purple-400 italic">Visit Etsy Store</button>
            </div>
            <button onClick={() => setCurrentPage(1)} className="mt-20 bg-green-600 px-32 py-7 rounded-3xl font-black text-3xl border-4 border-green-400 uppercase italic shadow-2xl">🏠 Home</button>
          </div>
        );

      default: return <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-10"><h1 className="text-5xl font-black text-purple-500 uppercase italic mb-10">Module {currentPage}</h1><Nav p={currentPage - 1} n={currentPage + 1} /><Footer /></div>;
    }
  };

  return <div className="min-h-screen bg-black font-sans selection:bg-purple-500 overflow-x-hidden">{renderPage()}<GlobalUI /></div>;
}