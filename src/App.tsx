import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Film, Heart, MessageCircle, Upload, Menu, Check, Home, Search, Download, Eye, Bot, FileText, Play } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const thatsAllFolksRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (currentPage === 20 && thatsAllFolksRef.current) {
      thatsAllFolksRef.current.play().catch(() => {});
    }
  }, [currentPage]);

  // GROK BUTTON - fixed bottom right every page
  const GrokBtn = () => (
    <div className="fixed bottom-8 right-8 z-50 hover:scale-110 transition-all cursor-pointer" onClick={() => setCurrentPage(19)} style={{filter:'drop-shadow(0 4px 16px #2d1554)'}}>
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 6 Q6 6 6 10 L6 58 Q6 62 10 62 L38 62 L28 80 L52 62 L80 62 Q84 62 84 58 L84 10 Q84 6 80 6 Z" fill="#2d1554"/>
        <text x="45" y="42" textAnchor="middle" dominantBaseline="middle" fontSize="32" fontWeight="900" fill="#7c3aed" fontFamily="Arial Black, sans-serif">G</text>
      </svg>
    </div>
  );

  // TOOL MODAL - Shows Upload/Paste/Create With AI
  const ToolModal = ({ tool, onClose }: { tool: string; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-black border-2 border-[#7c3aed] rounded-3xl max-w-3xl w-full p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">{tool}</h2>
            <p className="text-[#7c3aed]">Professional AI-powered tool for creating amazing content</p>
          </div>
          <button onClick={onClose} className="text-[#7c3aed] hover:text-white text-2xl">✕</button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button className="bg-[#2d1554] hover:bg-[#2d1554] border-2 border-[#7c3aed] rounded-2xl p-6 transition-all">
            <Upload size={40} className="mx-auto mb-3 text-[#7c3aed]" />
            <p className="font-bold text-white">Upload</p>
          </button>
          <button className="bg-[#2d1554] hover:bg-[#2d1554] border-2 border-[#7c3aed] rounded-2xl p-6 transition-all">
            <FileText size={40} className="mx-auto mb-3 text-[#7c3aed]" />
            <p className="font-bold text-white">Paste</p>
          </button>
          <button className="bg-[#2d1554] hover:bg-[#2d1554] border-2 border-[#7c3aed] rounded-2xl p-6 transition-all">
            <Sparkles size={40} className="mx-auto mb-3 text-[#7c3aed]" />
            <p className="font-bold text-white">Create With AI</p>
          </button>
        </div>
        <div className="bg-black/30 rounded-2xl p-4">
          <p className="text-[#7c3aed] text-sm leading-relaxed">
            This tool converts and transforms your content using advanced AI. Upload your files, paste text, or create from scratch.
            Supports: Text-to-Video, Image-to-Video, Audio-to-Animation, Video-to-Enhanced, and all creative transformations.
          </p>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {

      // ================================================================
      // PAGE 1 - Welcome
      // ================================================================
      case 1:
        return (
          <div className="min-h-screen bg-[#2d1554] flex flex-col justify-between px-6 py-8">
            <div className="flex justify-start">
              <button className="bg-[#2d1554] hover:bg-[#2d1554] text-[#7c3aed] px-5 py-2 rounded-xl text-sm font-bold border border-[#7c3aed] flex items-center gap-2 transition-all">
                <Menu size={16} /> Quick Access
              </button>
            </div>
            <div className="flex flex-col items-center justify-center text-center flex-1 py-12">
              <h1 className="text-6xl md:text-8xl font-black text-[#7c3aed] leading-tight mb-8" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                MANDASTRONG STUDIO
              </h1>
              <p className="text-2xl md:text-3xl text-[#7c3aed] font-bold italic">
                Welcome To An All In One Make Your Own Longer Movies!
              </p>
            </div>
            <div className="flex gap-4 justify-center pb-4">
              <button onClick={() => setCurrentPage(2)} className="bg-[#2d1554] hover:bg-[#2d1554] text-[#7c3aed] px-8 py-3 rounded-xl text-base font-bold border border-[#7c3aed] transition-all">Next</button>
              <button onClick={() => setCurrentPage(3)} className="bg-[#2d1554] hover:bg-[#2d1554] text-[#7c3aed] px-8 py-3 rounded-xl text-base font-bold border border-[#7c3aed] transition-all">Login</button>
              <button onClick={() => setCurrentPage(3)} className="bg-[#2d1554] hover:bg-[#2d1554] text-[#7c3aed] px-8 py-3 rounded-xl text-base font-bold border border-[#7c3aed] transition-all">Register</button>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 2 - Tagline
      // ================================================================
      case 2:
        return (
          <div className="min-h-screen bg-[#2d1554] text-white flex flex-col items-center justify-between px-4 py-12">
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-5xl">
              <div className="flex justify-center mb-8">
                <Sparkles size={80} className="text-[#7c3aed]" />
              </div>
              <h1 className="text-7xl md:text-8xl font-bold mb-8 text-white">MANDASTRONG'S<br/>STUDIO</h1>
              <p className="text-4xl md:text-5xl mb-4 text-[#7c3aed] font-bold italic">Make Amazing Family Movies</p>
              <p className="text-4xl md:text-5xl text-[#7c3aed] font-bold italic">& Bring Dreams To Life!</p>
            </div>
            <div className="flex gap-6 justify-center pb-6">
              <button onClick={() => setCurrentPage(1)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-5 rounded-xl text-xl font-bold border-2 border-[#7c3aed] transition-all">← Back</button>
              <button onClick={() => setCurrentPage(3)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-5 rounded-xl text-xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 3 - Login/Register/Plans
      // ================================================================
      case 3:
        return (
          <div className="min-h-screen bg-[#2d1554] text-white p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="border-2 border-[#7c3aed] rounded-2xl p-6">
                <h2 className="text-3xl font-bold mb-6 text-white">Login</h2>
                <div className="space-y-4">
                  <input type="email" placeholder="Email" className="w-full bg-black border border-[#7c3aed] rounded-xl px-4 py-3 text-white placeholder-[#2d1554] outline-none focus:border-[#7c3aed]" />
                  <input type="password" placeholder="Password" className="w-full bg-black border border-[#7c3aed] rounded-xl px-4 py-3 text-white placeholder-[#2d1554] outline-none focus:border-[#7c3aed]" />
                  <button onClick={() => setCurrentPage(4)} className="w-full bg-[#2d1554] hover:bg-[#2d1554] py-3 rounded-xl font-bold text-white transition-all">Login</button>
                </div>
              </div>
              <div className="border-2 border-[#7c3aed] rounded-2xl p-6">
                <h2 className="text-3xl font-bold mb-6 text-white">Register</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Name" className="w-full bg-black border border-[#7c3aed] rounded-xl px-4 py-3 text-white placeholder-[#2d1554] outline-none focus:border-[#7c3aed]" />
                  <input type="email" placeholder="Email" className="w-full bg-black border border-[#7c3aed] rounded-xl px-4 py-3 text-white placeholder-[#2d1554] outline-none focus:border-[#7c3aed]" />
                  <input type="password" placeholder="Password" className="w-full bg-black border border-[#7c3aed] rounded-xl px-4 py-3 text-white placeholder-[#2d1554] outline-none focus:border-[#7c3aed]" />
                  <button onClick={() => setCurrentPage(4)} className="w-full bg-[#2d1554] hover:bg-[#2d1554] py-3 rounded-xl font-bold text-white transition-all">Create Account</button>
                </div>
              </div>
            </div>
            <div className="text-center mb-6">
              <button onClick={() => setCurrentPage(4)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-4 rounded-xl font-bold text-white transition-all">
                Browse as Guest (View Only)
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-6">
              {[
                { name:'Basic', price:'$20', features:['HD Export','100 AI Tools','Basic Templates','10GB Storage','Email Support'] },
                { name:'Pro', price:'$30', features:['4K Export','300 AI Tools','Premium Templates','100GB Storage','Priority Support','Commercial License'], popular:true },
                { name:'Studio', price:'$50', features:['8K Export','All 600 AI Tools','Unlimited Templates','1TB Storage','24/7 Live Support','Full Commercial Rights','Team Collaboration'] }
              ].map(plan => (
                <div key={plan.name} className="border-2 border-[#7c3aed] rounded-2xl p-6 relative">
                  {plan.popular && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#2d1554] px-4 py-1 rounded-full text-xs font-bold text-white">POPULAR</div>}
                  <h3 className="text-2xl font-bold mb-1 text-white">{plan.name}</h3>
                  <p className="text-4xl font-black mb-4 text-white">{plan.price}<span className="text-lg text-[#7c3aed]">/mo</span></p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map(f => <li key={f} className="flex gap-2 text-sm text-[#7c3aed]"><Check size={16} className="text-[#2d1554] flex-shrink-0 mt-0.5" />{f}</li>)}
                  </ul>
                  <button onClick={() => setCurrentPage(4)} className="w-full bg-[#2d1554] hover:bg-[#2d1554] py-3 rounded-xl font-bold text-white transition-all">
                    {plan.popular ? '✓ Selected' : 'Select'}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-6 justify-center pb-6">
              <button onClick={() => setCurrentPage(2)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-4 rounded-xl font-bold text-white border border-[#7c3aed] transition-all">← Back</button>
              <button onClick={() => setCurrentPage(4)} className="bg-[#2d1554] hover:bg-[#2d1554] px-16 py-4 rounded-xl font-bold text-white text-lg transition-all">Next →</button>
            </div>
            <p className="text-[#2d1554] text-xs text-center mt-4">MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ MandaStrong1.Etsy.com</p>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGES 4-9 AI TOOL BOARDS - 4 ROWS ACROSS, 120 TOOLS PER PAGE
      // ================================================================
      case 4: case 5: case 6: case 7: case 8: case 9: {
        const allTools: Record<number, string[]> = {
          4: Array.from({length: 120}, (_, i) => `Text-to-${['Video','Image','Audio','Script','Story'][i%5]} Tool ${Math.floor(i/5)+1}`),
          5: Array.from({length: 120}, (_, i) => `Image-to-${['Video','3D','Animation','Art','Design'][i%5]} Tool ${Math.floor(i/5)+1}`),
          6: Array.from({length: 120}, (_, i) => `Audio-to-${['Video','Animation','Music','Voice','Sound'][i%5]} Tool ${Math.floor(i/5)+1}`),
          7: Array.from({length: 120}, (_, i) => `Video-to-${['Enhanced','HD','4K','Edit','Effect'][i%5]} Tool ${Math.floor(i/5)+1}`),
          8: Array.from({length: 120}, (_, i) => `Motion-to-${['3D','Animation','Character','Scene','Effect'][i%5]} Tool ${Math.floor(i/5)+1}`),
          9: Array.from({length: 120}, (_, i) => `AI ${['Enhance','Transform','Create','Generate','Design'][i%5]} Tool ${Math.floor(i/5)+1}`),
        };
        const names: Record<number,string> = {4:'Text Tools',5:'Image Tools',6:'Audio Tools',7:'Video Tools',8:'Motion Tools',9:'Enhancement Tools'};
        const tools = allTools[currentPage] || [];
        const filtered = tools.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

        return (
          <div className="min-h-screen bg-[#2d1554] text-white p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold text-[#7c3aed]">AI TOOL BOARD</h1>
                <p className="text-[#7c3aed] mt-1">{names[currentPage]} - 120 Professional AI Tools</p>
              </div>
              <button className="bg-[#2d1554] hover:bg-[#2d1554] px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all border border-[#7c3aed]">
                <Menu size={24} /> Quick Access
              </button>
            </div>
            <div className="mb-6 max-w-xl relative">
              <Search size={22} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7c3aed]" />
              <input type="text" placeholder="Search for tools..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-[#2e1065] border-2 border-[#7c3aed] rounded-2xl pl-12 pr-6 py-4 text-white placeholder-[#7c3aed] outline-none focus:border-[#7c3aed] transition-all" />
            </div>
            <div className="bg-[#2e1065]/50 border-2 border-[#7c3aed] rounded-3xl p-6 mb-6 h-[500px] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-4 gap-3">
                {filtered.map((tool,i) => (
                  <button key={i} onClick={() => setSelectedTool(tool)} className="bg-[#2d1554] border border-[#7c3aed] hover:border-[#7c3aed] rounded-xl p-4 text-center transition-all hover:scale-105 hover:bg-[#2d1554]">
                    <Sparkles size={24} className="text-[#7c3aed] mx-auto mb-2" />
                    <span className="text-sm font-bold text-white">{tool}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-6 pb-6">
              <button onClick={() => setCurrentPage(currentPage-1)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-4 rounded-2xl font-bold border border-[#7c3aed] transition-all">← Back</button>
              <button onClick={() => setCurrentPage(currentPage+1)} className="bg-[#2d1554] hover:bg-[#2d1554] px-16 py-4 rounded-2xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
            {selectedTool && <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />}
          </div>
        );
      }

      // ================================================================
      // PAGE 10 - EDITOR'S CHOICE - FULL MOVIE SCREEN
      // ================================================================
      case 10:
        return (
          <div className="min-h-screen bg-[#2d1554] text-white flex flex-col px-8 py-6">
            <h1 className="text-5xl font-black text-center text-white mb-8">EDITOR'S CHOICE</h1>
            <div className="flex-1 flex items-center justify-center mb-8">
              <div className="w-full max-w-6xl bg-black rounded-3xl overflow-hidden border-4 border-[#7c3aed] shadow-2xl">
                <div className="aspect-video bg-black flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-32 h-32 bg-[#2d1554] hover:bg-[#2d1554] rounded-full flex items-center justify-center transition-all hover:scale-110">
                      <Play size={48} className="text-white ml-2" />
                    </button>
                  </div>
                  <video className="w-full h-full" controls>
                    <source src="/exported_movie.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 pb-6">
              <button onClick={() => setCurrentPage(9)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-4 rounded-2xl font-bold border border-[#7c3aed] transition-all">← Back</button>
              <button onClick={() => setCurrentPage(11)} className="bg-[#2d1554] hover:bg-[#2d1554] px-16 py-4 rounded-2xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGES 11-16 - Studio Master Tools
      // ================================================================
      case 11:
        return (
          <div className="min-h-screen bg-[#2d1554] text-white p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-[#7c3aed]">MEDIA LIBRARY</h1>
              <div className="flex gap-4">
                <label className="bg-[#2d1554] hover:bg-[#2d1554] px-6 py-3 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all">
                  <Upload size={20} /> Upload Media
                  <input type="file" className="hidden" multiple accept="video/*,audio/*,image/*" />
                </label>
              </div>
            </div>
            <label className="block border-4 border-dashed border-[#7c3aed] hover:border-[#7c3aed] rounded-3xl p-12 text-center mb-8 cursor-pointer transition-all bg-[#2e1065]/30">
              <Upload size={64} className="text-[#7c3aed] mx-auto mb-4" />
              <p className="text-2xl font-bold text-[#7c3aed] mb-2">Drag & Drop Files Here</p>
              <p className="text-[#7c3aed] mb-4">Upload Videos, Audio, Images • All Formats Supported</p>
              <input type="file" className="hidden" multiple accept="video/*,audio/*,image/*" />
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Movie_Part1.mp4','Movie_Part2.mp4','Background_Music.mp3','Voice_Over.mp3','Scene1.png','Scene2.png'].map((file,i) => (
                <div key={i} className="bg-[#2d1554] border-2 border-[#7c3aed] rounded-2xl p-4 hover:border-[#7c3aed] transition-all">
                  <Film size={40} className="text-[#7c3aed] mb-2" />
                  <p className="font-bold text-sm mb-3 truncate text-[#7c3aed]">{file}</p>
                  <button className="bg-[#2d1554] hover:bg-[#2d1554] w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all"><Download size={14} /> Download</button>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-8 pb-6">
              <button onClick={() => setCurrentPage(10)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-4 rounded-2xl font-bold border border-[#7c3aed] transition-all">← Back</button>
              <button onClick={() => setCurrentPage(12)} className="bg-[#2d1554] hover:bg-[#2d1554] px-16 py-4 rounded-2xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
          </div>
        );

      case 12:
        return (
          <div className="min-h-screen bg-[#2d1554] text-white p-8">
            <h1 className="text-4xl font-bold text-[#7c3aed] mb-8 text-center">TIMELINE EDITOR</h1>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="col-span-1 bg-[#2e1065] border-2 border-[#7c3aed] rounded-2xl p-4">
                <h3 className="font-bold text-[#7c3aed] mb-4">MEDIA LIBRARY</h3>
                {['Video1.mp4','Audio1.mp3','Image1.png','Video2.mp4'].map((f,i) => (
                  <div key={i} className="bg-[#2d1554] rounded-xl p-3 mb-2 text-sm cursor-pointer hover:bg-[#2d1554] transition-all text-[#7c3aed] border border-[#7c3aed]">{f}</div>
                ))}
              </div>
              <div className="col-span-3 bg-[#2e1065] border-2 border-[#7c3aed] rounded-2xl p-4">
                <div className="bg-black h-64 rounded-xl mb-4 flex items-center justify-center border-2 border-[#7c3aed]">
                  <button className="w-20 h-20 bg-[#2d1554] hover:bg-[#2d1554] rounded-full flex items-center justify-center cursor-pointer transition-all">
                    <Play size={32} className="text-white ml-1" />
                  </button>
                </div>
                <p className="text-[#7c3aed] text-sm mb-4">Timeline Preview — Drag media from library to tracks below</p>
                <div className="space-y-3">
                  {['VIDEO TRACK 1','AUDIO TRACK 1','TEXT TRACK 1'].map((track,i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-[#7c3aed] text-sm w-28 font-bold">{track}</span>
                      <div className="flex-1 bg-[#2d1554] h-12 rounded-lg border-2 border-[#7c3aed] hover:border-[#7c3aed] transition-all cursor-pointer flex items-center px-4">
                        <span className="text-[#2d1554] text-xs">Drop media here or click to add</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 pb-6">
              <button onClick={() => setCurrentPage(11)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-4 rounded-2xl font-bold border border-[#7c3aed] transition-all">← Back</button>
              <button onClick={() => setCurrentPage(13)} className="bg-[#2d1554] hover:bg-[#2d1554] px-16 py-4 rounded-2xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
          </div>
        );

      case 13:
        return (
          <div className="min-h-screen bg-[#2d1554] text-white p-8">
            <h1 className="text-4xl font-bold text-[#7c3aed] mb-8 text-center">AUDIO MIXER</h1>
            <div className="bg-[#2e1065] border-2 border-[#7c3aed] rounded-3xl p-8 mb-6">
              <div className="grid grid-cols-4 gap-6">
                {[{ch:'MUSIC',vol:75},{ch:'VOICE',vol:85},{ch:'SFX',vol:60},{ch:'MASTER',vol:80}].map((c,i) => (
                  <div key={i} className={`bg-[#2d1554] rounded-2xl p-6 border-2 ${i===3?'border-[#7c3aed]':'border-[#7c3aed]'}`}>
                    <p className="text-center font-bold text-[#7c3aed] mb-4 text-xl">{c.ch}</p>
                    <div className="h-48 bg-[#2e1065] rounded-xl mb-4 relative overflow-hidden border-2 border-[#7c3aed]">
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2d1554] to-[#7c3aed] rounded-xl transition-all" style={{height:`${c.vol}%`}}></div>
                    </div>
                    <p className="text-center font-black mb-4 text-white text-2xl">{c.vol}%</p>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-[#2d1554] hover:bg-[#2d1554] py-3 rounded-lg text-xs font-bold transition-all">MUTE</button>
                      <button className="flex-1 bg-[#2d1554] hover:bg-[#2d1554] py-3 rounded-lg text-xs font-bold transition-all">{i===3?'OUTPUT':'SOLO'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-6 pb-6">
              <button onClick={() => setCurrentPage(12)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-4 rounded-2xl font-bold border border-[#7c3aed] transition-all">← Back</button>
              <button onClick={() => setCurrentPage(14)} className="bg-[#2d1554] hover:bg-[#2d1554] px-16 py-4 rounded-2xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
          </div>
        );

      case 14:
        return (
          <div className="min-h-screen bg-[#2d1554] text-white p-8">
            <h1 className="text-4xl font-bold text-[#7c3aed] mb-8 text-center">SETTINGS & CONFIGURATION</h1>
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-[#2e1065] border-2 border-[#7c3aed] rounded-3xl p-8">
                <h3 className="text-[#7c3aed] font-bold text-xl mb-6">Video Settings</h3>
                <div className="space-y-4">
                  <div><label className="block mb-2 text-[#7c3aed] font-bold">Movie Title</label><input defaultValue="My Awesome Movie" className="w-full bg-[#2d1554] border-2 border-[#7c3aed] rounded-xl px-4 py-3 text-white outline-none focus:border-[#7c3aed] transition-all" /></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="block mb-2 text-[#7c3aed] font-bold">Resolution</label><select className="w-full bg-[#2d1554] border-2 border-[#7c3aed] rounded-xl px-4 py-3 text-white outline-none"><option>1920x1080 (Full HD)</option><option>3840x2160 (4K)</option><option>7680x4320 (8K)</option></select></div>
                    <div><label className="block mb-2 text-[#7c3aed] font-bold">Frame Rate</label><select className="w-full bg-[#2d1554] border-2 border-[#7c3aed] rounded-xl px-4 py-3 text-white outline-none"><option>30 fps</option><option>60 fps</option><option>24 fps</option></select></div>
                    <div><label className="block mb-2 text-[#7c3aed] font-bold">Duration (min)</label><select className="w-full bg-[#2d1554] border-2 border-[#7c3aed] rounded-xl px-4 py-3 text-white outline-none"><option>30</option><option>60</option><option>90</option><option>120</option><option>180</option></select></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-8 pb-6">
              <button onClick={() => setCurrentPage(13)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-4 rounded-2xl font-bold border border-[#7c3aed] transition-all">← Back</button>
              <button onClick={() => setCurrentPage(15)} className="bg-[#2d1554] hover:bg-[#2d1554] px-16 py-4 rounded-2xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
          </div>
        );

      case 15:
        return (
          <div className="min-h-screen bg-[#2d1554] text-white p-8">
            <h1 className="text-4xl font-bold text-[#7c3aed] mb-8 text-center">TUTORIALS & LEARNING CENTER</h1>
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-[#2e1065] border-2 border-[#7c3aed] rounded-3xl overflow-hidden">
                  <div className="bg-black h-64 flex items-center justify-center">
                    <button className="w-20 h-20 bg-[#2d1554] hover:bg-[#2d1554] rounded-full flex items-center justify-center text-3xl transition-all">▶</button>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white">Getting Started with MandaStrong Studio</h3>
                    <p className="text-[#7c3aed] text-sm mb-3">Welcome to MandaStrong Studio! This tutorial shows you how to access all tools.</p>
                    <span className="bg-[#2d1554] px-3 py-1 rounded-full text-xs font-bold text-white">Beginner • 5:30</span>
                  </div>
                </div>
                <div className="bg-[#2e1065] border-2 border-[#7c3aed] rounded-3xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Tutorial Library</h3>
                  <div className="space-y-3">
                    {[
                      {title:'Getting Started with MandaStrong Studio',time:'5:30',level:'Beginner'},
                      {title:'Multi-Track Timeline Editing',time:'12:45',level:'Intermediate'},
                      {title:'Professional Color Grading Techniques',time:'18:20',level:'Advanced'},
                      {title:'Audio Mixing & Mastering',time:'15:10',level:'Intermediate'},
                      {title:'Creating Stunning Visual Effects',time:'22:35',level:'Advanced'},
                      {title:'Export Settings for Social Media',time:'8:15',level:'Beginner'},
                    ].map((t,i) => (
                      <button key={i} className={`w-full bg-[#2d1554] hover:bg-[#2d1554] rounded-xl p-4 text-left transition-all border-2 ${i===0?'border-[#7c3aed]':'border-[#7c3aed]'}`}>
                        <p className="font-bold text-sm mb-1 text-white">{t.title}</p>
                        <p className="text-[#7c3aed] text-xs">⏱ {t.time} • {t.level}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 pb-6">
              <button onClick={() => setCurrentPage(14)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-4 rounded-2xl font-bold border border-[#7c3aed] transition-all">← Back</button>
              <button onClick={() => setCurrentPage(16)} className="bg-[#2d1554] hover:bg-[#2d1554] px-16 py-4 rounded-2xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
          </div>
        );

      case 16:
        return (
          <div className="min-h-screen bg-[#2d1554] text-white p-8">
            <h1 className="text-4xl font-bold text-[#7c3aed] mb-8 text-center">EXPORT CENTER</h1>
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-[#2e1065] border-2 border-[#7c3aed] rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Export Settings</h3>
                  <div className="space-y-6">
                    <div><label className="block mb-3 text-[#7c3aed] font-bold">Resolution</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['4K','1080p','720p'].map(r => <button key={r} className={`px-6 py-4 rounded-xl font-bold transition-all ${r==='4K'?'bg-[#2d1554] text-white border-2 border-[#7c3aed]':'bg-[#2d1554] text-[#7c3aed] border-2 border-[#7c3aed]'}`}>{r}</button>)}
                      </div>
                    </div>
                    <div><label className="block mb-3 text-[#7c3aed] font-bold">Format</label>
                      <select className="w-full bg-[#2d1554] border-2 border-[#7c3aed] rounded-xl px-4 py-4 text-white outline-none font-bold"><option>MP4 (H.264)</option><option>MOV</option><option>WebM</option></select>
                    </div>
                    <button className="w-full bg-[#2d1554] hover:bg-[#2d1554] py-4 rounded-2xl font-bold text-xl transition-all border-2 border-[#7c3aed]">Start Rendering</button>
                  </div>
                </div>
                <div className="bg-[#2e1065] border-2 border-[#7c3aed] rounded-3xl p-8 flex flex-col items-center justify-center">
                  <Film size={80} className="text-[#7c3aed] mb-6" />
                  <h3 className="text-3xl font-bold mb-4 text-white">Ready to Export</h3>
                  <p className="text-[#7c3aed] text-center mb-6">Your movie will be rendered and auto-saved to Editor's Choice screen</p>
                  <div className="text-center">
                    <p className="text-6xl font-black text-white mb-2">90</p>
                    <p className="text-[#7c3aed] text-xl">MINUTES</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 pb-6">
              <button onClick={() => setCurrentPage(15)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-4 rounded-2xl font-bold border border-[#7c3aed] transition-all">← Back</button>
              <button onClick={() => setCurrentPage(17)} className="bg-[#2d1554] hover:bg-[#2d1554] px-16 py-4 rounded-2xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 17 - TERMS OF SERVICE & DISCLAIMER
      // ================================================================
      case 17:
        return (
          <div className="min-h-screen bg-[#2d1554] text-white p-8">
            <h1 className="text-4xl font-bold text-[#7c3aed] mb-8 text-center">TERMS OF SERVICE & DISCLAIMER</h1>
            <div className="max-w-5xl mx-auto">
              <div className="bg-[#2d1554] rounded-t-3xl p-8 text-center border-2 border-[#7c3aed]">
                <FileText size={64} className="mx-auto mb-4 text-white" />
                <h2 className="text-4xl font-bold text-white mb-2">Legal Agreement</h2>
                <p className="text-[#7c3aed] text-lg">Please read carefully before using MandaStrong Studio</p>
              </div>
              <div className="bg-[#2e1065] border-x-2 border-b-2 border-[#7c3aed] rounded-b-3xl p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Terms of Service</h3>
                  <p className="text-[#7c3aed] leading-relaxed">
                    By using MandaStrong Studio, you agree to these Terms of Service. This platform is provided "as is" for creative video production.
                    You retain all rights to content you create. We grant you a non-exclusive, revocable license to use our AI tools and services.
                    You agree not to use this platform for illegal purposes, to create harmful content, or to violate intellectual property rights of others.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Disclaimer</h3>
                  <p className="text-[#7c3aed] leading-relaxed">
                    MandaStrong Studio provides AI-powered creative tools. We do not guarantee specific results. You are responsible for your content and its use.
                    We are not liable for any damages, losses, or issues arising from your use of this platform. All AI-generated content should be reviewed before publishing.
                    We reserve the right to modify, suspend, or terminate services at any time.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Privacy & Data</h3>
                  <p className="text-[#7c3aed] leading-relaxed">
                    We respect your privacy. Your uploaded content and created works are stored securely. We do not sell your data.
                    We may collect anonymous usage statistics to improve our services. Your personal information is protected according to applicable data protection laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Content Rights & Usage</h3>
                  <p className="text-[#7c3aed] leading-relaxed">
                    You own all content you create using MandaStrong Studio. You are responsible for ensuring you have the rights to any content you upload.
                    By using AI tools, you agree that AI-generated content may have similarities to other AI outputs. Commercial use is permitted under Pro and Studio plans only.
                  </p>
                </div>
                <div className="bg-[#2d1554] rounded-2xl p-6 border-2 border-[#7c3aed]">
                  <div className="flex items-start gap-4 mb-4">
                    <input type="checkbox" id="agree" className="w-6 h-6 mt-1 accent-[#2d1554]" />
                    <label htmlFor="agree" className="text-white font-bold text-lg">
                      I have read, understood, and agree to the Terms of Service, Disclaimer, and Privacy Policy
                    </label>
                  </div>
                  <button onClick={() => setCurrentPage(18)} className="w-full bg-[#2d1554] hover:bg-[#2d1554] py-4 rounded-xl font-bold text-xl transition-all">
                    Accept & Continue
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-8 pb-6">
              <button onClick={() => setCurrentPage(16)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-4 rounded-2xl font-bold border border-[#7c3aed] transition-all">← Back</button>
              <button onClick={() => setCurrentPage(18)} className="bg-[#2d1554] hover:bg-[#2d1554] px-16 py-4 rounded-2xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 18 - AGENT GROK 24/7
      // ================================================================
      case 18:
        return (
          <div className="min-h-screen bg-[#2d1554] text-white p-8">
            <h1 className="text-4xl font-bold text-[#7c3aed] mb-8 text-center">AGENT GROK - 24/7 HELP DESK</h1>
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-[#2e1065] border-2 border-[#7c3aed] rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-[#2d1554] w-20 h-20 rounded-full flex items-center justify-center border-2 border-[#7c3aed]">
                      <Bot size={40} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">Agent Grok</h3>
                      <p className="text-[#7c3aed] flex items-center gap-2 font-bold">
                        <span className="w-3 h-3 bg-[#7c3aed] rounded-full inline-block animate-pulse"></span>
                        Online 24/7 • Instant Responses
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    <div className="bg-[#2d1554] rounded-2xl p-4 border-2 border-[#7c3aed]">
                      <p className="text-white font-bold mb-2">Agent Grok</p>
                      <p className="text-[#7c3aed]">Hello! I'm Agent Grok, your 24/7 AI assistant for MandaStrong Studio. How can I help you today?</p>
                      <p className="text-xs text-[#7c3aed] mt-2">Just now</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <input type="text" placeholder="Type your question..." className="w-full bg-[#2d1554] border-2 border-[#7c3aed] rounded-2xl px-6 py-4 text-white placeholder-[#7c3aed] outline-none focus:border-[#7c3aed] transition-all font-bold" />
                    <button className="w-full bg-[#2d1554] hover:bg-[#2d1554] py-4 rounded-2xl font-bold text-xl transition-all">Send Message</button>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-[#2e1065] border-2 border-[#7c3aed] rounded-3xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Quick Questions</h3>
                    <div className="space-y-3">
                      {[
                        'How do I upload videos?',
                        'What video formats are supported?',
                        'How do I export my movie?',
                        'Can I use custom music?',
                        'How do I adjust audio levels?',
                        'What are rendering options?'
                      ].map((q,i) => (
                        <button key={i} className="w-full bg-[#2d1554] hover:bg-[#2d1554] rounded-xl p-4 text-left transition-all text-white border-2 border-[#7c3aed] font-bold">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#2e1065] border-2 border-[#7c3aed] rounded-3xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">System Status</h3>
                    {['AI Services','Rendering Engine','Cloud Storage','24/7 Support'].map(s => (
                      <div key={s} className="flex justify-between items-center mb-3 pb-3 border-b border-[#7c3aed]">
                        <span className="text-white font-bold">{s}</span>
                        <span className="text-[#7c3aed] flex items-center gap-2 font-bold">
                          <span className="w-3 h-3 bg-[#7c3aed] rounded-full inline-block animate-pulse"></span>
                          Operational
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 pb-6">
              <button onClick={() => setCurrentPage(17)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-4 rounded-2xl font-bold border border-[#7c3aed] transition-all">← Back</button>
              <button onClick={() => setCurrentPage(19)} className="bg-[#2d1554] hover:bg-[#2d1554] px-16 py-4 rounded-2xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 19 - COMMUNITY HUB
      // ================================================================
      case 19:
        return (
          <div className="min-h-screen bg-[#2d1554] text-white p-8">
            <h1 className="text-4xl font-bold text-[#7c3aed] mb-8 text-center">COMMUNITY HUB</h1>
            <div className="flex justify-center gap-4 mb-8">
              {['Recent','Popular','Trending'].map(tab => (
                <button key={tab} className={`px-8 py-4 rounded-xl font-bold transition-all border-2 ${tab==='Recent'?'bg-[#2d1554] text-white border-[#7c3aed]':'bg-[#2d1554] text-[#7c3aed] border-[#7c3aed]'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                {title:'Epic Family Adventure',creator:'Sarah M',hearts:2847},
                {title:'Animated Story Time',creator:'Mike C',hearts:1923},
                {title:'School Musical Project',creator:'Emily R',hearts:3156},
                {title:'Nature Documentary',creator:'Alex T',hearts:2634},
                {title:'Birthday Celebration',creator:'Jessica K',hearts:1876},
                {title:'Travel Memories',creator:'David B',hearts:2234},
              ].map((item,i) => (
                <div key={i} className="bg-[#2e1065] border-2 border-[#7c3aed] rounded-3xl overflow-hidden hover:border-[#7c3aed] transition-all">
                  <div className="bg-black h-48 flex items-center justify-center relative border-b-2 border-[#7c3aed]">
                    <Film size={64} className="text-[#7c3aed]" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                    <p className="text-[#7c3aed] text-sm mb-4 font-bold">{item.creator}</p>
                    <div className="flex gap-6 mb-4">
                      <button className="flex items-center gap-2 text-[#7c3aed] hover:text-white transition-all font-bold">
                        <Heart size={20} /> {item.hearts}
                      </button>
                      <button className="flex items-center gap-2 text-[#7c3aed] hover:text-white transition-all font-bold">
                        <MessageCircle size={20} /> Comments
                      </button>
                    </div>
                    <button className="w-full bg-[#2d1554] hover:bg-[#2d1554] py-3 rounded-xl font-bold transition-all">View Movie</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 pb-6">
              <button onClick={() => setCurrentPage(18)} className="bg-[#2d1554] hover:bg-[#2d1554] px-12 py-4 rounded-2xl font-bold border border-[#7c3aed] transition-all">← Back</button>
              <button onClick={() => setCurrentPage(20)} className="bg-[#2d1554] hover:bg-[#2d1554] px-16 py-4 rounded-2xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 20 - THAT'S ALL FOLKS - LARGER WINDOW WITH HOW TO GUIDE
      // ================================================================
      case 20:
        return (
          <div className="min-h-screen bg-[#2d1554] text-white p-8">
            <h1 className="text-6xl md:text-8xl font-black text-white text-center mb-8">THAT'S ALL FOLKS!</h1>

            <div className="max-w-7xl mx-auto mb-10 rounded-3xl overflow-hidden border-4 border-[#7c3aed] shadow-2xl">
              <video ref={thatsAllFolksRef} autoPlay loop muted playsInline controls className="w-full">
                <source src="/thatsallfolks.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="max-w-6xl mx-auto bg-[#2e1065] border-2 border-[#7c3aed] rounded-3xl p-12 mb-8">
              <h2 className="text-5xl font-bold mb-8 text-center text-white">A Special Thank You</h2>
              <div className="space-y-6 text-[#7c3aed] text-lg leading-relaxed">
                <p className="text-xl">To all current and future creators, dreamers, and storytellers...</p>
                <p>Your creativity and passion inspire positive change in the world. Through your films and stories, you have the power to educate, inspire, and bring awareness to critical issues like bullying prevention, social skills development, and humanity's collective growth.</p>
                <p>Every piece of content you create has the potential to touch hearts, change minds, and make our world a better place. Together, we are building a community of creators who use their talents to spread kindness, understanding, and hope.</p>
                <div className="bg-[#2d1554] rounded-2xl p-8 space-y-5 border-2 border-[#7c3aed]">
                  <h3 className="text-3xl font-bold text-white">Supporting Our Heroes & Community</h3>
                  <p><strong className="text-white text-xl">🎖️ Veterans Mental Health Services</strong> — 100% of all Etsy Store proceeds are donated directly to Veterans Mental Health Services, supporting those who have sacrificed so much for our freedom.</p>
                  <p><strong className="text-white text-xl">🌍 Humanity For All</strong> — We believe every person deserves dignity, kindness, and the opportunity to thrive in a safe, supportive world.</p>
                  <p><strong className="text-white text-xl">🏫 Supporting Schools With Social Skills</strong> — Through movie-based educational content, we provide schools with powerful resources to help students develop essential social skills for their futures.</p>
                </div>
                <p className="text-center text-2xl font-bold text-white mt-8">
                  Visit our fundraiser at <a href="https://MandaStrong1.Etsy.com" target="_blank" rel="noopener noreferrer" className="text-[#7c3aed] hover:text-white underline">MandaStrong1.Etsy.com</a>
                </p>
              </div>
            </div>

            <div className="max-w-6xl mx-auto bg-[#2d1554] border-2 border-[#7c3aed] rounded-3xl p-8 mb-8">
              <h2 className="text-4xl font-bold mb-6 text-center text-white">📚 How To Use MandaStrong Studio</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#2e1065] rounded-2xl p-6 border-2 border-[#7c3aed]">
                  <h3 className="text-2xl font-bold text-white mb-3">Step 1: Choose Your AI Tools</h3>
                  <p className="text-[#7c3aed]">Browse through pages 4-9 to access 600+ professional AI tools. Each tool board has 120 tools organized in 4 rows. Click any tool to Upload, Paste, or Create With AI.</p>
                </div>
                <div className="bg-[#2e1065] rounded-2xl p-6 border-2 border-[#7c3aed]">
                  <h3 className="text-2xl font-bold text-white mb-3">Step 2: Create Your Content</h3>
                  <p className="text-[#7c3aed]">Use Text-to-Video, Image-to-Animation, Audio-to-Motion tools to create amazing content. All tools support multiple formats and transformations.</p>
                </div>
                <div className="bg-[#2e1065] rounded-2xl p-6 border-2 border-[#7c3aed]">
                  <h3 className="text-2xl font-bold text-white mb-3">Step 3: Upload to Media Library</h3>
                  <p className="text-[#7c3aed]">Page 11 is your Media Library. Upload videos, audio, images. Drag and drop supported. All files are saved automatically.</p>
                </div>
                <div className="bg-[#2e1065] rounded-2xl p-6 border-2 border-[#7c3aed]">
                  <h3 className="text-2xl font-bold text-white mb-3">Step 4: Edit on Timeline</h3>
                  <p className="text-[#7c3aed]">Page 12 Timeline Editor lets you arrange your media. Drag files from library to video, audio, and text tracks. Preview in real-time.</p>
                </div>
                <div className="bg-[#2e1065] rounded-2xl p-6 border-2 border-[#7c3aed]">
                  <h3 className="text-2xl font-bold text-white mb-3">Step 5: Mix Your Audio</h3>
                  <p className="text-[#7c3aed]">Page 13 Audio Mixer gives you professional control over music, voice, sound effects, and master output levels.</p>
                </div>
                <div className="bg-[#2e1065] rounded-2xl p-6 border-2 border-[#7c3aed]">
                  <h3 className="text-2xl font-bold text-white mb-3">Step 6: Configure & Export</h3>
                  <p className="text-[#7c3aed]">Page 14 Settings lets you choose resolution (HD/4K/8K), frame rate, and duration. Then export your masterpiece.</p>
                </div>
                <div className="bg-[#2e1065] rounded-2xl p-6 border-2 border-[#7c3aed]">
                  <h3 className="text-2xl font-bold text-white mb-3">Step 7: Watch & Share</h3>
                  <p className="text-[#7c3aed]">Page 10 Editor's Choice shows your completed movie in a full cinema screen with play controls. Share with the world!</p>
                </div>
                <div className="bg-[#2d1554] rounded-2xl p-6 border-2 border-[#7c3aed]">
                  <h3 className="text-2xl font-bold text-white mb-3">Need Help? Ask Agent Grok!</h3>
                  <p className="text-[#7c3aed]">Click the Grok button (bottom right) on any page for instant 24/7 help. Agent Grok answers all your questions immediately.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-8 justify-center mb-10">
              <button onClick={() => setCurrentPage(19)} className="bg-[#2d1554] hover:bg-[#2d1554] border-2 border-[#7c3aed] px-16 py-6 rounded-2xl font-bold text-xl transition-all">← Back</button>
              <button onClick={() => setCurrentPage(1)} className="bg-[#2d1554] hover:bg-[#2d1554] px-20 py-6 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all">
                <Home size={28} /> Home
              </button>
            </div>
            <p className="text-[#7c3aed] text-sm text-center font-bold">MandaStrong1 2026 ~ Author Of Doxy The School Bully ~ MandaStrong1@Etsy.com</p>
            <GrokBtn />
          </div>
        );

      default:
        return <div className="min-h-screen bg-[#2d1554] text-white flex items-center justify-center"><p>Page not found</p></div>;
    }
  };

  return <div className="min-h-screen">{renderPage()}</div>;
}
