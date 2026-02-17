import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Film, Heart, MessageCircle, Upload, Menu, Check, Home, Search, Download, Eye, Bot, FileText } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const thatsAllFolksRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (currentPage === 21 && thatsAllFolksRef.current) {
      thatsAllFolksRef.current.play().catch(() => {});
    }
  }, [currentPage]);

  // GROK BUTTON - fixed bottom right every page
  const GrokBtn = () => (
    <div className="fixed bottom-8 right-8 z-50 hover:scale-110 transition-all cursor-pointer" style={{filter:'drop-shadow(0 4px 16px #581c87)'}}>
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 6 Q6 6 6 10 L6 58 Q6 62 10 62 L38 62 L28 80 L52 62 L80 62 Q84 62 84 58 L84 10 Q84 6 80 6 Z" fill="#6b21a8"/>
        <text x="45" y="42" textAnchor="middle" dominantBaseline="middle" fontSize="32" fontWeight="900" fill="#d8b4fe" fontFamily="Arial Black, sans-serif">G</text>
      </svg>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {

      // ================================================================
      // PAGE 1 - BLACK BG, PURPLE TEXT, QUICK ACCESS TOP LEFT, GROK BOTTOM RIGHT
      // ================================================================
      case 1:
        return (
          <div className="min-h-screen bg-black flex flex-col justify-between px-6 py-8">
            {/* TOP LEFT - QUICK ACCESS */}
            <div className="flex justify-start">
              <button className="bg-purple-900 hover:bg-purple-800 text-purple-300 px-5 py-2 rounded-xl text-sm font-bold border border-purple-700 flex items-center gap-2 transition-all">
                <Menu size={16} /> Quick Access
              </button>
            </div>

            {/* CENTRE */}
            <div className="flex flex-col items-center justify-center text-center flex-1 py-12">
              <h1 className="text-6xl md:text-8xl font-black text-purple-400 leading-tight mb-8" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                MANDASTRONG STUDIO
              </h1>
              <p className="text-2xl md:text-3xl text-purple-300 font-bold italic">
                Welcome To An All In One Make Your Own Longer Movies!
              </p>
            </div>

            {/* BOTTOM - Next Login Register centered */}
            <div className="flex gap-4 justify-center pb-4">
              <button onClick={() => setCurrentPage(2)} className="bg-purple-900 hover:bg-purple-800 text-purple-200 px-8 py-3 rounded-xl text-base font-bold border border-purple-700 transition-all">Next</button>
              <button onClick={() => setCurrentPage(3)} className="bg-purple-900 hover:bg-purple-800 text-purple-200 px-8 py-3 rounded-xl text-base font-bold border border-purple-700 transition-all">Login</button>
              <button onClick={() => setCurrentPage(3)} className="bg-purple-900 hover:bg-purple-800 text-purple-200 px-8 py-3 rounded-xl text-base font-bold border border-purple-700 transition-all">Register</button>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 2 - DEEP PURPLE, SPARKLES, BOLD ITALIC TAGLINES
      // ================================================================
      case 2:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white flex flex-col items-center justify-center relative px-4">
            <div className="text-center max-w-5xl">
              <div className="flex justify-center mb-8">
                <Sparkles size={80} className="text-purple-300" />
              </div>
              <h1 className="text-7xl md:text-8xl font-bold mb-8 text-white">MANDASTRONG'S<br/>STUDIO</h1>
              <p className="text-4xl md:text-5xl mb-4 text-purple-300 font-bold italic">Make Amazing Family Movies</p>
              <p className="text-4xl md:text-5xl mb-16 text-purple-300 font-bold italic">& Bring Dreams To Life!</p>
              <div className="flex gap-6 justify-center">
                <button onClick={() => setCurrentPage(1)} className="bg-purple-800 hover:bg-purple-700 px-12 py-5 rounded-xl text-xl font-bold border-2 border-purple-500 transition-all">← Back</button>
                <button onClick={() => setCurrentPage(3)} className="bg-purple-600 hover:bg-purple-500 px-12 py-5 rounded-xl text-xl font-bold transition-all">Next →</button>
              </div>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 3
      // ================================================================
      case 3:
        return (
          <div className="min-h-screen bg-black text-white p-6">

            {/* TOP - LOGIN + REGISTER side by side */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="border-2 border-purple-700 rounded-2xl p-6">
                <h2 className="text-3xl font-bold mb-6 text-white">Login</h2>
                <div className="space-y-4">
                  <input type="email" placeholder="Email" className="w-full bg-black border border-purple-700 rounded-xl px-4 py-3 text-white placeholder-purple-600 outline-none focus:border-purple-400" />
                  <input type="password" placeholder="Password" className="w-full bg-black border border-purple-700 rounded-xl px-4 py-3 text-white placeholder-purple-600 outline-none focus:border-purple-400" />
                  <button onClick={() => setCurrentPage(4)} className="w-full bg-purple-700 hover:bg-purple-600 py-3 rounded-xl font-bold text-white transition-all">Login</button>
                </div>
              </div>
              <div className="border-2 border-purple-700 rounded-2xl p-6">
                <h2 className="text-3xl font-bold mb-6 text-white">Register</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Name" className="w-full bg-black border border-purple-700 rounded-xl px-4 py-3 text-white placeholder-purple-600 outline-none focus:border-purple-400" />
                  <input type="email" placeholder="Email" className="w-full bg-black border border-purple-700 rounded-xl px-4 py-3 text-white placeholder-purple-600 outline-none focus:border-purple-400" />
                  <input type="password" placeholder="Password" className="w-full bg-black border border-purple-700 rounded-xl px-4 py-3 text-white placeholder-purple-600 outline-none focus:border-purple-400" />
                  <button onClick={() => setCurrentPage(4)} className="w-full bg-purple-700 hover:bg-purple-600 py-3 rounded-xl font-bold text-white transition-all">Create Account</button>
                </div>
              </div>
            </div>

            {/* BROWSE AS GUEST */}
            <div className="text-center mb-6">
              <button onClick={() => setCurrentPage(4)} className="bg-purple-700 hover:bg-purple-600 px-12 py-4 rounded-xl font-bold text-white transition-all">
                Browse as Guest (View Only)
              </button>
            </div>

            {/* 3 PLAN BOXES side by side */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {[
                { name:'Basic', price:'$20', features:['HD Export','100 AI Tools','Basic Templates','10GB Storage','Email Support'] },
                { name:'Pro', price:'$30', features:['4K Export','300 AI Tools','Premium Templates','100GB Storage','Priority Support','Commercial License'], popular:true },
                { name:'Studio', price:'$50', features:['8K Export','All 600 AI Tools','Unlimited Templates','1TB Storage','24/7 Live Support','Full Commercial Rights','Team Collaboration'] }
              ].map(plan => (
                <div key={plan.name} className="border-2 border-purple-700 rounded-2xl p-6 relative">
                  {plan.popular && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-700 px-4 py-1 rounded-full text-xs font-bold text-white">POPULAR</div>}
                  <h3 className="text-2xl font-bold mb-1 text-white">{plan.name}</h3>
                  <p className="text-4xl font-black mb-4 text-white">{plan.price}<span className="text-lg text-purple-400">/mo</span></p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map(f => <li key={f} className="flex gap-2 text-sm text-purple-300"><Check size={16} className="text-purple-500 flex-shrink-0 mt-0.5" />{f}</li>)}
                  </ul>
                  <button onClick={() => setCurrentPage(4)} className="w-full bg-purple-700 hover:bg-purple-600 py-3 rounded-xl font-bold text-white transition-all">
                    {plan.popular ? '✓ Selected' : 'Select'}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button onClick={() => setCurrentPage(4)} className="bg-purple-700 hover:bg-purple-600 px-16 py-4 rounded-xl font-bold text-white text-lg transition-all">Continue to Payment</button>
              <p className="text-purple-600 text-sm mt-3">Secure payment powered by Stripe</p>
              <p className="text-purple-800 text-xs mt-4">MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ MandaStrong1.Etsy.com</p>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGES 4-9 AI TOOL BOARDS
      // ================================================================
      case 4: case 5: case 6: case 7: case 8: case 9:
        const boards: Record<number,string[]> = {
          4: ['Dialogue Writer','Plot Generator','Scene Writer','Story Outliner','Character Developer','Dialogue Editor','Plot Designer','Story Planner','Treatment Writer','Script Formatter','Plot Creator','Three Act Builder','Backstory Generator','Motivation Builder','Theme Generator','Advanced Story Outliner','Story Consultant','Plot Twist Creator','Scene Analyzer','Conflict Generator'],
          5: ['Voice Maker','Voice Cloner','Voice Creator Tool','Voice Recorder','Speech Converter','Voice Builder','Advanced Voice Generator','Voice Studio Tool','Premium Voice Generator','Voice Audio Tool','Emotional Voice Generator','Advanced Speech Creator','Natural Voice Generator','Voice Reader','Speech Generator','Narration Creator','Voice Imitator','Fast Speech Generator','Live Voice Tool','Streaming Voice Generator'],
          6: ['Image Creator','Advanced Image Generator','Design Generator','Image Tool','Art Maker','Art Mixer','Image Stream Tool','Art Library Tool','Workflow Tool','Auto Image Generator','Image Studio Pro','Easy Image Generator','Text Inversion Tool','Style Tool','Model Trainer','Style Transfer Tool','Turnaround Generator','Expression Grid Tool','Depth Controller','Edge Guide Tool'],
          7: ['Motion Video Maker','Video Creator','Avatar Generator','Video Synthesizer','Video Studio','Video Flow Generator','Video Creator Studio','Video Crafter','Image to Motion Tool','Video Style Tool','Temporal Flow Tool','Frame Blender','Dynamic Pan Tool','Tilt Shot Tool','Tracking Shot Tool','Crane Movement Tool','Steadycam Tool','Handheld Effect Tool','Shot Transition Tool','Establishing Shot Tool'],
          8: ['Motion Animator','Motion Studio','Auto Animator','Motion Flow Tool','Motion Capture Pro','Webcam Motion Tool','Skeleton Tracker','Joint Tracker','Character Rigger','3D Character Studio','Player Avatar Creator','Avatar Generator','Face Tracker','Facial Motion Tool','Audio to Face Tool','Face Audio Syncer','3D Shape Generator','3D Model Tool','Gaussian Splat Render','3D From Image Tool'],
          9: ['Smart Video Editor','Auto Editor','Video Tools Suite','Edit Master','Scene Detector','Beat Syncer','Auto Assembly Tool','Smart Timeline','Highlight Finder','Key Moment Finder','Context Editor','Intelligent Cutter','Word Remover','Filler Word Remover','Gap Closer','Smart Trimmer','Smart Fade Tool','Transition Matcher','Flow Transition Tool','Smooth Cut Tool']
        };
        const names: Record<number,string> = {4:'Script & Story',5:'Voice & Audio',6:'Image Generation',7:'Video Creation',8:'Motion & Animation',9:'Smart Editing'};
        const filtered = (boards[currentPage]||[]).filter(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold text-purple-300">AI TOOL BOARD</h1>
                <p className="text-purple-400 mt-1">{names[currentPage]}</p>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all">
                <Menu size={24} /> Quick Access
              </button>
            </div>
            <div className="mb-6 max-w-xl relative">
              <Search size={22} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
              <input type="text" placeholder="Search for tools..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-purple-950/50 border-2 border-purple-600 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-purple-400 outline-none focus:border-purple-400 transition-all" />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {filtered.map((tool,i) => (
                <button key={i} className="bg-purple-950/50 border-2 border-purple-600 hover:border-purple-400 rounded-2xl p-5 text-left flex items-center gap-4 transition-all hover:scale-105">
                  <Sparkles size={28} className="text-purple-400 flex-shrink-0" />
                  <span className="text-lg font-bold">{tool}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-6">
              <button onClick={() => setCurrentPage(currentPage-1)} className="bg-purple-800 hover:bg-purple-700 px-12 py-4 rounded-2xl font-bold border border-purple-500 transition-all">← Back</button>
              <button onClick={() => setCurrentPage(currentPage+1)} className="bg-purple-600 hover:bg-purple-500 px-16 py-4 rounded-2xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 10 - NO MOVIE UPLOADED
      // ================================================================
      case 10:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white flex flex-col items-center justify-center p-8">
            <Film size={120} className="text-purple-400 mb-8" />
            <h2 className="text-4xl font-bold mb-4">No Movie Uploaded</h2>
            <p className="text-purple-300 mb-8">Upload your movie to watch it here!</p>
            <button onClick={() => setCurrentPage(11)} className="bg-purple-600 hover:bg-purple-500 px-12 py-5 rounded-2xl font-bold text-xl mb-12 transition-all">Go to Upload Page</button>
            <div className="flex gap-6">
              <button onClick={() => setCurrentPage(9)} className="bg-purple-800 hover:bg-purple-700 px-10 py-4 rounded-xl font-bold border border-purple-500 transition-all">← Back</button>
              <button onClick={() => setCurrentPage(11)} className="bg-purple-600 hover:bg-purple-500 px-10 py-4 rounded-xl font-bold transition-all">Next →</button>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 11 - MEDIA LIBRARY
      // ================================================================
      case 11:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-purple-300">MEDIA LIBRARY</h1>
              <div className="flex gap-4">
                <label className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all">
                  <Upload size={20} /> Upload Media
                  <input type="file" className="hidden" multiple accept="video/*,audio/*,image/*" />
                </label>
                <button onClick={() => setCurrentPage(10)} className="bg-purple-800 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold border border-purple-500 transition-all">← Back</button>
                <button onClick={() => setCurrentPage(12)} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold transition-all">Next →</button>
              </div>
            </div>
            <label className="block border-4 border-dashed border-purple-600 hover:border-purple-400 rounded-3xl p-12 text-center mb-8 cursor-pointer transition-all">
              <Upload size={64} className="text-purple-400 mx-auto mb-4" />
              <p className="text-2xl font-bold text-purple-300 mb-2">Drag & Drop Files Here</p>
              <p className="text-purple-400 mb-4">or click to browse</p>
              <input type="file" className="hidden" multiple accept="video/*,audio/*,image/*" />
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['packageDTSB.mp4','AI_Movie.mp4','DTSB.MP4','rendered.mp4','final_movie.mp4','Movie_Prompt.mp4'].map((file,i) => (
                <div key={i} className="bg-purple-950/50 border-2 border-purple-600 rounded-2xl p-4 hover:border-purple-400 transition-all">
                  <Film size={40} className="text-purple-400 mb-2" />
                  <p className="font-bold text-sm mb-3 truncate text-purple-200">{file}</p>
                  <button className="bg-purple-700 hover:bg-purple-600 w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all"><Download size={14} /> Download</button>
                </div>
              ))}
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 12 - TIMELINE EDITOR
      // ================================================================
      case 12:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-purple-300">TIMELINE EDITOR</h1>
              <div className="flex gap-4">
                <button onClick={() => setCurrentPage(11)} className="bg-purple-800 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold border border-purple-500 transition-all">← Back</button>
                <button onClick={() => setCurrentPage(13)} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold transition-all">Next →</button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 bg-purple-950/50 border-2 border-purple-600 rounded-2xl p-4">
                <h3 className="font-bold text-purple-300 mb-4">MEDIA LIBRARY</h3>
                {['Video1.mp4','Audio1.mp3','Image1.png','Video2.mp4'].map((f,i) => (
                  <div key={i} className="bg-purple-900/50 rounded-xl p-3 mb-2 text-sm cursor-pointer hover:bg-purple-800/50 transition-all text-purple-200 border border-purple-700">{f}</div>
                ))}
              </div>
              <div className="col-span-3 bg-purple-950/50 border-2 border-purple-600 rounded-2xl p-4">
                <div className="bg-purple-900/50 h-48 rounded-xl mb-4 flex items-center justify-center border border-purple-700">
                  <button className="w-16 h-16 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center cursor-pointer transition-all text-2xl">▶</button>
                </div>
                <p className="text-purple-400 text-sm mb-3">Video Preview Window — Select a video to preview</p>
                <div className="space-y-3">
                  {['VIDEO 1','AUDIO 1','TEXT 1'].map((track,i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-purple-400 text-sm w-16">{track}</span>
                      <div className="flex-1 bg-purple-900/50 h-10 rounded-lg border border-purple-600 hover:border-purple-400 transition-all cursor-pointer flex items-center px-4">
                        <span className="text-purple-500 text-xs">Drop media here</span>
                      </div>
                      <button className="text-purple-400 hover:text-purple-200 text-lg font-bold transition-all">+</button>
                    </div>
                  ))}
                </div>
                <p className="text-purple-500 text-xs mt-4 text-center">Select or drag a media file from the library to add it to the timeline</p>
              </div>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 13 - AUDIO MIXER
      // ================================================================
      case 13:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-purple-300">AUDIO MIXER</h1>
                <p className="text-purple-500 text-sm">Rendered Video 12/30/2025, 7:25:44 AM</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setCurrentPage(12)} className="bg-purple-800 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold border border-purple-500 transition-all">← Back</button>
                <button onClick={() => setCurrentPage(14)} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold transition-all">Next →</button>
              </div>
            </div>
            <div className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl p-8 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-purple-400 font-bold text-xl">PROFESSIONAL AUDIO MIXER</h3>
                <button className="bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-xl font-bold border border-purple-500 transition-all">Save Settings</button>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {[{ch:'MUSIC',vol:75},{ch:'VOICE',vol:50},{ch:'SFX',vol:65},{ch:'MASTER',vol:80}].map((c,i) => (
                  <div key={i} className={`bg-purple-900/50 rounded-2xl p-4 ${i===3?'border-2 border-purple-400':''}`}>
                    <p className="text-center font-bold text-purple-300 mb-4">{c.ch}</p>
                    <div className="h-40 bg-purple-800/50 rounded-xl mb-4 relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500 to-purple-700 rounded-xl transition-all" style={{height:`${c.vol}%`}}></div>
                    </div>
                    <p className="text-center font-bold mb-4 text-purple-200">{c.vol}%</p>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-purple-700 hover:bg-purple-600 py-2 rounded-lg text-xs font-bold transition-all">MUTE</button>
                      <button className="flex-1 bg-purple-700 hover:bg-purple-600 py-2 rounded-lg text-xs font-bold transition-all">{i===3?'OUTPUT':'SOLO'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl p-6">
              <h3 className="text-purple-400 font-bold mb-4">AUDIO EFFECTS</h3>
              <div className="grid grid-cols-4 gap-4">
                {['Reverb','Echo','Compressor','Equalizer'].map(fx => (
                  <button key={fx} className="bg-purple-700 hover:bg-purple-600 py-4 rounded-xl font-bold transition-all text-purple-200">{fx}</button>
                ))}
              </div>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 14 - SETTINGS
      // ================================================================
      case 14:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-purple-300">SETTINGS & CONFIGURATION</h1>
              <div className="flex gap-4">
                <button onClick={() => setCurrentPage(13)} className="bg-purple-800 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold border border-purple-500 transition-all">← Back</button>
                <button onClick={() => setCurrentPage(15)} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold transition-all">Next →</button>
              </div>
            </div>
            <div className="space-y-6 max-w-4xl">
              <div className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl p-8">
                <h3 className="text-purple-400 font-bold text-xl mb-6">⚙️ Video Settings</h3>
                <div className="space-y-4">
                  <div><label className="block mb-2 text-purple-300">Movie Title</label><input defaultValue="My Awesome Movie" className="w-full bg-purple-900/50 border-2 border-purple-600 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-400 transition-all" /></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="block mb-2 text-purple-300">Resolution</label><select className="w-full bg-purple-900/50 border-2 border-purple-600 rounded-xl px-4 py-3 text-white outline-none"><option>1920x1080 (Full HD)</option><option>3840x2160 (4K)</option><option>7680x4320 (8K)</option></select></div>
                    <div><label className="block mb-2 text-purple-300">Frame Rate</label><select className="w-full bg-purple-900/50 border-2 border-purple-600 rounded-xl px-4 py-3 text-white outline-none"><option>30 fps</option><option>60 fps</option><option>24 fps</option></select></div>
                    <div><label className="block mb-2 text-purple-300">Aspect Ratio</label><select className="w-full bg-purple-900/50 border-2 border-purple-600 rounded-xl px-4 py-3 text-white outline-none"><option>16:9 (Widescreen)</option><option>4:3</option><option>1:1</option></select></div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl p-8">
                <h3 className="text-purple-400 font-bold text-xl mb-6">🎬 Movie Duration</h3>
                <p className="text-6xl font-black text-purple-300 text-center mb-2">90</p>
                <p className="text-center text-purple-500 mb-6">MINUTES</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  {['30 min','60 min','90 min','120 min','180 min','240 min'].map(d => (
                    <button key={d} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${d==='90 min'?'bg-purple-500 text-white':'bg-purple-800 hover:bg-purple-700 text-purple-300'}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl p-8">
                <h3 className="text-purple-400 font-bold text-xl mb-6">💾 Auto-Save & Backup</h3>
                <div className="flex items-center gap-4 mb-4"><input type="checkbox" defaultChecked className="w-6 h-6 accent-purple-600" /><label className="text-purple-200">Enable Auto-Save</label></div>
                <div><label className="block mb-2 text-purple-300">Auto-Save Interval</label><select className="w-full bg-purple-900/50 border-2 border-purple-600 rounded-xl px-4 py-3 text-white outline-none"><option>Every 5 minutes</option><option>Every 10 minutes</option><option>Every 15 minutes</option></select></div>
              </div>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 15 - TUTORIALS
      // ================================================================
      case 15:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-purple-300">TUTORIALS & LEARNING CENTER</h1>
              <div className="flex gap-4">
                <button onClick={() => setCurrentPage(14)} className="bg-purple-800 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold border border-purple-500 transition-all">← Back</button>
                <button onClick={() => setCurrentPage(16)} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold transition-all">Next →</button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl overflow-hidden">
                <div className="bg-purple-900 h-64 flex items-center justify-center">
                  <button className="w-20 h-20 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center text-3xl transition-all">▶</button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-purple-200">Getting Started with MandaStrong Studio</h3>
                  <p className="text-purple-400 text-sm mb-3">Welcome to MandaStrong Studio! This tutorial shows you how to access all tools.</p>
                  <span className="bg-purple-700 px-3 py-1 rounded-full text-xs font-bold text-purple-200">Beginner • 5:30</span>
                </div>
              </div>
              <div className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-4">📚 Tutorial Library</h3>
                <div className="space-y-3">
                  {[
                    {title:'Getting Started with MandaStrong Studio',time:'5:30',level:'Beginner'},
                    {title:'Multi-Track Timeline Editing',time:'12:45',level:'Intermediate'},
                    {title:'Professional Color Grading Techniques',time:'18:20',level:'Advanced'},
                    {title:'Audio Mixing & Mastering',time:'15:10',level:'Intermediate'},
                    {title:'Creating Stunning Visual Effects',time:'22:35',level:'Advanced'},
                    {title:'Export Settings for Social Media',time:'8:15',level:'Beginner'},
                  ].map((t,i) => (
                    <button key={i} className={`w-full bg-purple-900/50 hover:bg-purple-800/50 rounded-xl p-4 text-left transition-all ${i===0?'border-2 border-purple-400':''}`}>
                      <p className="font-bold text-sm mb-1 text-purple-200">{t.title}</p>
                      <p className="text-purple-500 text-xs">⏱ {t.time} • {t.level}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 16 - EXPORT CENTER
      // ================================================================
      case 16:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-purple-300">EXPORT CENTER</h1>
                <p className="text-purple-400 mt-1">Ready to export your movie</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setCurrentPage(15)} className="bg-purple-800 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold border border-purple-500 transition-all">← Back</button>
                <button onClick={() => setCurrentPage(17)} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold transition-all">Next →</button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl p-8 space-y-6">
                <h3 className="text-purple-400 font-bold text-xl">Export Settings</h3>
                <div>
                  <label className="block mb-2 text-purple-300">Resolution</label>
                  <div className="flex gap-3">
                    {['4K','1080p','720p'].map(r => <button key={r} className={`px-6 py-3 rounded-xl font-bold transition-all ${r==='4K'?'bg-purple-500 text-white':'bg-purple-800 hover:bg-purple-700 text-purple-300'}`}>{r}</button>)}
                  </div>
                </div>
                <div><label className="block mb-2 text-purple-300">Export Format</label><select className="w-full bg-purple-900/50 border-2 border-purple-600 rounded-xl px-4 py-3 text-white outline-none"><option>MP4 (H.264)</option><option>MOV</option><option>AVI</option><option>WebM</option></select></div>
                <div>
                  <label className="block mb-2 text-purple-300">Quality</label>
                  <div className="flex gap-3">
                    {['High','Medium','Low'].map(q => <button key={q} className={`px-6 py-3 rounded-xl font-bold transition-all ${q==='High'?'bg-purple-500 text-white':'bg-purple-800 hover:bg-purple-700 text-purple-300'}`}>{q}</button>)}
                  </div>
                </div>
                <div><label className="block mb-2 text-purple-300">Frame Rate</label><select className="w-full bg-purple-900/50 border-2 border-purple-600 rounded-xl px-4 py-3 text-white outline-none"><option>60 fps</option><option>30 fps</option><option>24 fps</option></select></div>
                <div><label className="block mb-2 text-purple-300">Export Date</label><input type="date" className="w-full bg-purple-900/50 border-2 border-purple-600 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-400 transition-all" /></div>
              </div>
              <div className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl p-8 flex flex-col items-center justify-center">
                <Film size={80} className="text-purple-400 mb-6" />
                <h3 className="text-2xl font-bold mb-2 text-purple-200">Ready to Render</h3>
                <p className="text-purple-400 mb-4">Your movie is ready to be exported</p>
                <div className="text-center mb-8">
                  <p className="text-5xl font-black text-purple-300">90</p>
                  <p className="text-purple-500">MINUTES</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-500 px-12 py-5 rounded-2xl font-bold text-xl transition-all">Start Rendering</button>
              </div>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 17 - MY PROJECTS
      // ================================================================
      case 17:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-purple-300">MY PROJECTS</h1>
              <div className="flex gap-4">
                <button onClick={() => setCurrentPage(16)} className="bg-purple-800 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold border border-purple-500 transition-all">← Back</button>
                <button onClick={() => setCurrentPage(18)} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold transition-all">Next →</button>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {['My First Movie','Family Adventure','School Project','Documentary','Short Film','Music Video'].map((p,i) => (
                <div key={i} className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl p-6 hover:border-purple-400 transition-all cursor-pointer hover:scale-105">
                  <div className="bg-purple-900 rounded-2xl h-32 mb-4 flex items-center justify-center border border-purple-700">
                    <Film size={40} className="text-purple-400" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-purple-200">{p}</h3>
                  <p className="text-purple-500 text-sm">Last edited: 2 days ago</p>
                </div>
              ))}
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 18 - TERMS OF SERVICE
      // ================================================================
      case 18:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-purple-300">TERMS OF SERVICE & DISCLAIMER</h1>
              <div className="flex gap-4">
                <button onClick={() => setCurrentPage(17)} className="bg-purple-800 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold border border-purple-500 transition-all">← Back</button>
                <button onClick={() => setCurrentPage(19)} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold transition-all">Next →</button>
              </div>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-purple-600 rounded-t-3xl p-8 text-center">
                <FileText size={48} className="mx-auto mb-4" />
                <h2 className="text-3xl font-bold">Legal Agreement</h2>
                <p className="text-purple-200">Please read carefully before using MandaStrong Studio</p>
              </div>
              <div className="bg-purple-950/70 border-2 border-purple-600 rounded-b-3xl p-8 space-y-6">
                <div><h3 className="text-purple-400 font-bold text-xl mb-3">Terms of Use</h3><p className="text-purple-200 text-sm leading-relaxed">Welcome to MandaStrong Studio. By accessing and using this application, you agree to be bound by these Terms of Service. By creating an account, you acknowledge that you have read, understood, and agree to our Terms. We grant you a limited, non-exclusive, non-transferable license to use MandaStrong Studio for personal or commercial video creation.</p></div>
                <div><h3 className="text-purple-400 font-bold text-xl mb-3">Privacy Policy</h3><p className="text-purple-200 text-sm leading-relaxed">We collect information you provide directly to us, including your name, email address, and any content you create or upload. We implement appropriate technical measures to protect your personal information.</p></div>
                <div className="flex items-center gap-4 pt-4">
                  <input type="checkbox" id="agree" className="w-6 h-6 accent-purple-600" />
                  <label htmlFor="agree" className="text-purple-200">I have read and agree to the Terms of Service and Privacy Policy</label>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setCurrentPage(19)} className="flex-1 bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl font-bold transition-all">Accept & Continue</button>
                  <button className="flex-1 bg-purple-800 hover:bg-purple-700 py-4 rounded-2xl font-bold transition-all border border-purple-600">Decline</button>
                </div>
              </div>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 19 - AGENT GROK 24/7
      // ================================================================
      case 19:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-purple-300">AGENT GROK - 24/7 HELP DESK</h1>
              <div className="flex gap-4">
                <button onClick={() => setCurrentPage(18)} className="bg-purple-800 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold border border-purple-500 transition-all">← Back</button>
                <button onClick={() => setCurrentPage(20)} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold transition-all">Next →</button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center"><Bot size={32} /></div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-200">Agent Grok</h3>
                    <p className="text-purple-400 flex items-center gap-2 text-sm"><span className="w-2 h-2 bg-purple-400 rounded-full inline-block"></span> Online & Ready 24/7 • Instant Responses</p>
                  </div>
                </div>
                <div className="bg-purple-900/50 rounded-2xl p-4 mb-6 border border-purple-700">
                  <p className="text-sm text-purple-200">Hello! I'm Agent Grok, your 24/7 AI assistant for MandaStrong Studio. How can I help you today?</p>
                  <p className="text-xs text-purple-500 mt-2">Just now</p>
                </div>
                <input type="text" placeholder="Type your question..." className="w-full bg-purple-950/50 border-2 border-purple-600 rounded-2xl px-6 py-4 text-white placeholder-purple-400 outline-none focus:border-purple-400 transition-all mb-4" />
                <button className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl font-bold transition-all">Send Message</button>
              </div>
              <div className="space-y-6">
                <div className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl p-6">
                  <h3 className="text-xl font-bold text-purple-300 mb-4">Frequently Asked Questions</h3>
                  {['How do I export my video?','What video formats are supported?','How do I add text to my video?','Can I use custom fonts?','How do I adjust audio levels?','What are the render quality options?'].map((q,i) => (
                    <button key={i} className="w-full bg-purple-900/50 hover:bg-purple-800/50 rounded-xl p-4 text-left text-sm transition-all mb-2 text-purple-200 border border-purple-700">{q}</button>
                  ))}
                </div>
                <div className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl p-6">
                  <h3 className="text-xl font-bold text-purple-300 mb-4">Service Status</h3>
                  {['API Services','Render Queue','File Storage'].map(s => (
                    <div key={s} className="flex justify-between items-center mb-3">
                      <span className="text-purple-200">{s}</span>
                      <span className="text-purple-400 flex items-center gap-2 text-sm"><span className="w-2 h-2 bg-purple-400 rounded-full inline-block"></span> Operational</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 20 - COMMUNITY HUB
      // ================================================================
      case 20:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-purple-300">COMMUNITY HUB</h1>
              <div className="flex gap-4">
                <label className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all">
                  <Upload size={20} /> Upload Your Creation
                  <input type="file" className="hidden" accept="video/*" />
                </label>
                <button onClick={() => setCurrentPage(19)} className="bg-purple-800 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold border border-purple-500 transition-all">← Back</button>
                <button onClick={() => setCurrentPage(21)} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-bold transition-all">Next →</button>
              </div>
            </div>
            <div className="flex gap-4 mb-8">
              {['Recent','Popular','Trending'].map(tab => (
                <button key={tab} className={`px-6 py-3 rounded-xl font-bold transition-all ${tab==='Recent'?'bg-purple-600 text-white':'bg-purple-900/50 text-purple-300 hover:bg-purple-800/50 border border-purple-700'}`}>{tab}</button>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {title:'Epic Action Montage',creator:'Sarah Johnson',time:'2 hours ago',hearts:1247,likes:823,comments:156},
                {title:'Cinematic Travel Vlog',creator:'Mike Chen',time:'5 hours ago',hearts:892,likes:634,comments:89},
                {title:'Product Showcase Video',creator:'Emily Rodriguez',time:'1 day ago',hearts:2156,likes:1423,comments:267},
                {title:'Music Video Edit',creator:'Alex Thompson',time:'1 day ago',hearts:3421,likes:2789,comments:445},
                {title:'Wedding Highlights',creator:'Jessica Kim',time:'3 days ago',hearts:1876,likes:1234,comments:198},
                {title:'Gaming Montage',creator:'David Brown',time:'4 days ago',hearts:4532,likes:3201,comments:567},
              ].map((item,i) => (
                <div key={i} className="bg-purple-950/50 border-2 border-purple-600 rounded-3xl overflow-hidden hover:border-purple-400 transition-all">
                  <div className="bg-purple-900 h-40 flex items-center justify-center relative border-b border-purple-700">
                    <Film size={48} className="text-purple-400" />
                    <span className="absolute top-3 right-3 bg-purple-600 text-xs px-3 py-1 rounded-full font-bold">🔥 Trending</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-1 text-purple-200">{item.title}</h3>
                    <p className="text-purple-500 text-sm mb-3">{item.creator} • {item.time}</p>
                    <div className="flex gap-4 mb-4">
                      <button className="flex items-center gap-1 text-purple-300 hover:text-purple-100 transition-all"><Heart size={18} /> {item.hearts}</button>
                      <button className="flex items-center gap-1 text-purple-300 hover:text-purple-100 transition-all">👍 {item.likes}</button>
                      <button className="flex items-center gap-1 text-purple-300 hover:text-purple-100 transition-all"><MessageCircle size={18} /> {item.comments}</button>
                    </div>
                    <button className="w-full bg-purple-700 hover:bg-purple-600 py-3 rounded-xl font-bold text-sm transition-all text-purple-200">View All Comments</button>
                  </div>
                </div>
              ))}
            </div>
            <GrokBtn />
          </div>
        );

      // ================================================================
      // PAGE 21 - THAT'S ALL FOLKS - VIDEO TOP, THANK YOU BELOW
      // ================================================================
      case 21:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white p-8">
            <h1 className="text-6xl md:text-8xl font-black text-purple-300 text-center mb-8">THAT'S ALL FOLKS!</h1>

            {/* VIDEO UNDER TITLE - TOP OF PAGE */}
            <div className="max-w-3xl mx-auto mb-10 rounded-3xl overflow-hidden border-2 border-purple-600">
              <video ref={thatsAllFolksRef} autoPlay loop muted playsInline controls className="w-full">
                <source src="ThatsAllFolks.MP4" type="video/mp4" />
              </video>
            </div>

            {/* THANK YOU LETTER */}
            <div className="max-w-4xl mx-auto bg-purple-950/70 border-2 border-purple-600 rounded-3xl p-12 mb-12">
              <h2 className="text-4xl font-bold mb-8 text-center text-purple-300">A Special Thank You</h2>
              <div className="space-y-6 text-purple-200 text-lg leading-relaxed">
                <p>To all current and future creators, dreamers, and storytellers...</p>
                <p>Your creativity and passion inspire positive change in the world. Through your films and stories, you have the power to educate, inspire, and bring awareness to critical issues like bullying prevention, social skills development, and humanity's collective growth.</p>
                <p>Every piece of content you create has the potential to touch hearts, change minds, and make our world a better place. Together, we are building a community of creators who use their talents to spread kindness, understanding, and hope. Your impact matters more than you know.</p>
                <div className="bg-purple-900/60 rounded-2xl p-8 space-y-5 border border-purple-700">
                  <h3 className="text-2xl font-bold text-purple-300">Supporting Our Heroes & Community</h3>
                  <p><strong className="text-white">🎖️ Veterans Mental Health Services</strong> — 100% of all Etsy Store proceeds are donated directly to Veterans Mental Health Services, supporting those who have sacrificed so much for our freedom.</p>
                  <p><strong className="text-white">🌍 Humanity For All</strong> — We believe every person deserves dignity, kindness, and the opportunity to thrive in a safe, supportive world.</p>
                  <p><strong className="text-white">🏫 Supporting Schools With Social Skills</strong> — Through movie-based educational content, we provide schools with powerful resources to help students develop essential social skills for their futures — because every child deserves the tools to connect, communicate, and grow.</p>
                </div>
                <p className="text-center text-xl font-bold text-purple-300">Visit our fundraiser at <a href="https://MandaStrong1.Etsy.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-200 underline">MandaStrong1.Etsy.com</a></p>
              </div>
            </div>

            <div className="flex gap-8 justify-center mb-10">
              <button onClick={() => setCurrentPage(20)} className="bg-purple-800 hover:bg-purple-700 border-2 border-purple-500 px-16 py-6 rounded-2xl font-bold text-xl transition-all">← Back</button>
              <button onClick={() => setCurrentPage(1)} className="bg-purple-600 hover:bg-purple-500 px-20 py-6 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all"><Home size={24} /> Home</button>
            </div>
            <p className="text-purple-500 text-sm text-center">MandaStrong1 2026 ~ Author Of Doxy The School Bully ~ MandaStrong1@Etsy.com</p>
            <GrokBtn />
          </div>
        );

      default:
        return <div className="min-h-screen bg-purple-950 text-white flex items-center justify-center"><p>Page not found</p></div>;
    }
  };

  return <div className="min-h-screen">{renderPage()}</div>;
}
