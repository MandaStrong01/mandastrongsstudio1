import { useState, useRef, useCallback } from 'react';
import { Menu, Sparkles, MessageCircle, ChevronLeft, ChevronRight, CheckCircle, Play, Upload, Film, Mic, Zap, Shield, Music, Sliders, Database, FileVideo, TrendingUp, BookOpen, Clock, ThumbsUp, Heart, HelpCircle, Plus, Eye, Layers, X, Download, Save, Wand2, Trash2, Share2, Search } from 'lucide-react';

// 799 AI TOOLS
const AI_TOOLS = {
  "Text to Video": ["Text to Cinematic Scene","Prompt to Movie Clip","Description to Visual Story","Text to Action Sequence","Prompt to Drama Scene","Text to Comedy Sketch","Description to Thriller Scene","Prompt to Romance Moment","Text to Sci-Fi World","Description to Fantasy Realm","Prompt to Horror Atmosphere","Text to Documentary Style","Description to Music Video Scene","Prompt to Commercial Spot","Text to Movie Trailer","Description to Short Film","Prompt to Animation Style","Text to Stop Motion Scene","Description to Time Lapse Video","Prompt to Montage Sequence","Text to B-Roll Footage","Description to Establishing Shot","Prompt to Aerial View","Text to POV Perspective","Description to Close-Up Detail","Prompt to Wide Landscape","Text to Reaction Shot","Description to Insert Detail","Prompt to Cutaway Shot","Text to Match Cut","Description to Jump Cut","Prompt to Cross Cut","Text to Dissolve Transition","Description to Fade Scene","Prompt to Wipe Effect","Text to Split Screen","Description to Picture in Picture","Prompt to Flashback Sequence","Text to Flash Forward","Description to Dream Sequence","Prompt to Parallel Action","Text to Slow Motion Drama","Description to Speed Ramp Effect","Prompt to Reverse Shot","Text to Dutch Angle","Description to Crane Shot","Prompt to Dolly Zoom","Text to Tracking Shot","Description to Steadicam Move","Prompt to Handheld Energy","Text to Whip Pan","Description to Rack Focus","Prompt to Deep Focus Shot","Text to Shallow Depth","Description to Bokeh Background","Prompt to Lens Flare","Text to God Rays","Description to Volumetric Light","Prompt to Cinematic Grain","Text to Film Look","Description to Color Grade","Prompt to LUT Apply","Text to Vintage Film","Description to Modern Digital","Prompt to IMAX Style","Text to Anamorphic Look","Description to Widescreen Format","Prompt to Vertical Video","Text to Square Format","Description to 16x9 Standard","Prompt to 4x3 Classic","Text to Ultra Wide","Description to Panoramic View","Prompt to 360 Video","Text to VR Scene","Description to AR Element","Prompt to Hologram Effect","Text to Glitch Art","Description to Cyberpunk Style","Prompt to Retro 80s Look","Text to Film Noir","Description to Golden Age Cinema","Prompt to New Wave Style","Text to Documentary Realism","Description to Found Footage","Prompt to Screen Recording","Text to Split Timeline","Description to Nonlinear Edit","Prompt to Anthology Format","Text to Vignette Style","Description to Parallel Story","Prompt to Frame Story","Text to Nested Narrative","Description to Multiple POV","Prompt to Unreliable Narrator","Text to Breaking Fourth Wall","Description to Meta Commentary","Prompt to Experimental Film","Text to Abstract Visual","Description to Surreal Scene","Prompt to Magical Realism","Text to Heightened Reality","Description to Stylized Action","Prompt to Fight Choreography","Text to Car Chase","Description to Explosion Scene","Prompt to Destruction Sequence","Text to Natural Disaster","Description to Crowd Scene","Prompt to Intimate Moment","Text to Emotional Beat","Description to Character Study","Prompt to Tension Build","Text to Climax Scene","Description to Resolution","Prompt to Denouement","Text to Opening Credits","Description to Title Card","Prompt to End Credits","Text to Post Credits Scene","Description to Teaser Hook","Prompt to Cold Open","Text to Stinger Ending","Description to Cliffhanger"],
  "Image to Video": ["Photo to Motion","Still to Animation","Image to Cinematic","Portrait to Scene","Landscape to Flythrough","Artwork to Living Painting","Sketch to Rendered Scene","Drawing to Animated Story","Painting to Motion Art","Illustration to Movie Scene","Concept Art to Preview","Storyboard to Animatic","Comic Panel to Motion","Manga to Anime Style","Poster to Trailer","Album Art to Music Video","Book Cover to Teaser","Product Photo to Commercial","Food Photo to Recipe Video","Fashion Photo to Runway","Architecture Photo to Tour","Interior Photo to Walkthrough","Nature Photo to Documentary","Wildlife Photo to Scene","Pet Photo to Character","Baby Photo to Memory Film","Wedding Photo to Highlight","Travel Photo to Journey","Selfie to Reaction Video","Group Photo to Story","Historical Photo to Reenactment","Vintage Photo to Colorized","Black White to Color Motion","Sepia Tone to Modern","Polaroid to Retro Clip","Film Strip to Montage","Negative to Positive Motion","Scan to Digital Animation","Screenshot to Tutorial","Meme to Video Meme","Infographic to Explainer","Chart to Data Viz","Graph to Animated Stats","Map to Journey Animation","Blueprint to 3D Walk","Floor Plan to Virtual Tour","Diagram to Technical Demo","Logo to Brand Video","Icon to UI Animation","Emoji to Expression","Avatar to Character","Profile Pic to Intro","Thumbnail to Full Video","Preview to Extended Cut","Promo Image to Commercial","Banner to Video Ad","Header to Hero Video","Background to Parallax","Texture to Material Demo","Pattern to Hypnotic Loop","Gradient to Color Flow","Bokeh to Dreamy Scene","Silhouette to Reveal","Shadow to Mystery","Reflection to Mirror World","Refraction to Prism","Transparency to Glass","Overlay to Composite","Mask to Cutout Animation","Layer to Depth Motion","Collage to Stop Motion","Mosaic to Particle Reveal","Pixelation to Retro Game","Vector to Clean Motion","Raster to Pixel Art","Upscale to 4K Motion","Downscale to Lo-Fi","Crop to Reframe","Rotate to Spin Effect","Flip to Mirror","Distort to Warp","Stretch to Aspect Change","Squeeze to Compression","Bulge to Fish Eye","Pinch to Vortex","Twirl to Spiral","Ripple to Water","Wave to Ocean Motion","Shake to Earthquake","Vibrate to Intensity","Pulse to Heartbeat","Glow to Neon Sign","Shine to Sparkle","Blur to Focus Pull","Sharpen to Clarity","Soften to Dreamy Haze","Harden to Sharp Contrast","Desaturate to BW","Saturate to Color Pop","Hue Shift to Color Change","Temperature to Mood Shift","Tint to Filter Effect","Exposure to Brightness Flow","Contrast to Dramatic Look","Highlights to Bloom","Shadows to Crush Black","Midtones to Balance","Whites to Pure Bright","Blacks to Deep Dark","Clarity to Detail Enhance","Vibrance to Natural Pop","Saturation Boost","Dehaze to Clear","Structure to Texture","Grain to Film Look","Noise to Authentic Feel"],
  "Script to Movie": ["Screenplay to Video","Dialogue to Acted Scene","Action Line to Movement","Scene Heading to Location","Character Desc to Design","Stage Direction to Visual","Parenthetical to Performance","Transition to Edit","Slug Line to Shot Setup","INT to Interior Scene","EXT to Exterior Scene","DAY to Daytime Lighting","NIGHT to Nighttime Mood","DAWN to Morning Glow","DUSK to Evening Atmosphere","CONTINUOUS to Seamless","LATER to Time Jump","FLASHBACK to Memory","MONTAGE to Sequence","INTERCUT to Cross Cutting","VO to Voiceover","OS to Off Screen","BG to Background Action","FG to Foreground Focus","CLOSE UP to Tight Shot","WIDE SHOT to Establishing","MEDIUM SHOT to Standard","TWO SHOT to Dual Character","OVER SHOULDER to Conversation","POV to Point of View","INSERT to Detail Shot","ANGLE ON to Specific Focus","REVERSE to Opposite View","CRANE UP to Rising Shot","CRANE DOWN to Descending","DOLLY IN to Push In","DOLLY OUT to Pull Back","TRACK LEFT to Side Move","TRACK RIGHT to Lateral Slide","PAN LEFT to Horizontal Sweep","PAN RIGHT to Panoramic Turn","TILT UP to Upward Angle","TILT DOWN to Downward View","ZOOM IN to Magnify","ZOOM OUT to Reveal Context","RACK FOCUS to Shift Depth","FOLLOW to Tracking Character","CIRCLE to Orbit Shot","AERIAL to Birds Eye","LOW ANGLE to Power Shot","HIGH ANGLE to Vulnerable View","DUTCH ANGLE to Unease","HANDHELD to Raw Energy","STEADICAM to Smooth Glide","WHIP PAN to Fast Transition","CRASH ZOOM to Shock","FREEZE FRAME to Still","SLOW MOTION to Drama","SPEED RAMP to Dynamic","TIME LAPSE to Passage","REVERSE MOTION to Rewind","MATCH CUT to Visual Link","JUMP CUT to Jarring Edit","CROSS DISSOLVE to Blend","FADE IN to Scene Start","FADE OUT to Scene End","FADE BLACK to Dramatic","FADE WHITE to Ethereal","WIPE to Stylized","IRIS IN to Focus","IRIS OUT to Vintage","SMASH CUT to Shocking","L CUT to Audio Lead","J CUT to Audio Trail","CROSSFADE to Smooth Audio","HARD CUT to Abrupt","SOFT CUT to Gentle","INVISIBLE CUT to Seamless","GRAPHIC MATCH to Echo","SOUND BRIDGE to Connect","PARALLEL EDIT to Simultaneous","SPLIT SCREEN to Dual","PIP to Inset View","SUPERIMPOSE to Overlay","DOUBLE EXPOSURE to Blend","GHOST IMAGE to Transparent","MIRROR to Symmetry","KALEIDOSCOPE to Pattern","STROBE to Flash","BEAT to Pause Moment","ACTION to Start","CUT to Stop","PRINT to Good Take","HOLD to Maintain","RESET to Return","CLEAR FRAME to Empty","FRAME UP to Compose","ROLLING to Recording","SPEED to Ready","MARKER to Slate","TAIL SLATE to End Mark","CHECKING GATE to Verify","MOVING ON to Next Setup","MARTINI SHOT to Last","WRAP to Complete"],
  "Voice Creator": ["Text to Natural Voice","Voice Clone from Sample","AI Narrator Professional","Character Voice Creator","Regional Accent Generator","Emotion Happy Voice","Emotion Sad Voice","Emotion Angry Voice","Emotion Excited Voice","Emotion Calm Voice","Emotion Scared Voice","Emotion Surprised Voice","Age Child Voice","Age Teen Voice","Age Young Adult","Age Middle Age","Age Elderly Voice","Gender Male Voice","Gender Female Voice","Gender Neutral Voice","Pitch High Control","Pitch Low Control","Speed Fast Control","Speed Slow Control","Tone Formal Voice","Tone Casual Voice","Style Conversational","Style Dramatic","Style Documentary","Style Audiobook","Style Commercial Voice","Style Trailer Voice","Voice Echo Effect","Voice Reverb Hall","Voice Distortion","Voice Robot Mod","Lip Sync Auto Match","Multi Voice Dialogue","Laugh Generation","Cry Emotional","Scream Intense","Whisper Quiet"],
  "Audio Studio": ["Background Music","Film Score Compose","Sound Effect Create","Foley Generator","Dialogue Cleanup","Noise Reduction","Volume Normalize","Stereo Mix","Surround 51 Mix","Bass Boost","Treble Enhance","Echo Chamber","Reverb Hall","Delay Effect","Chorus FX","Hip Hop Beat","Cinematic Epic","Trailer Music","Tension Builder","EDM Drop","LoFi Beats","Jazz Swing","Rock Power","Classical Orchestra"],
  "VFX Magic": ["Remove Background","Green Screen Key","Motion Track","Color Grade Cinematic","Film Grain","Lens Flare","Smoke Effect","Fire Simulation","Explosion Particle","Rain Generator","Snow Fall","Lightning Strike","Sky Replacement","Glow Aura","Hologram Project","3D Text Extrude","Transition Wipe","Glitch Digital","Time Freeze","Speed Ramp"]
};

const PAGES = ['Welcome','About','Login','Text to Video','Image to Video','Script to Movie','Voice Creator','Audio Studio','VFX Magic','Upload','Editor','Library','Enhancement','Audio Mixer','Preview','Export','Tutorials','Terms','Agent Grok','Community','Thank You'];

export default function App() {
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [duration, setDuration] = useState(90);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedEnhancement, setSelectedEnhancement] = useState(null);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [timeline, setTimeline] = useState({ video: [], audio: [], text: [] });
  const [draggedItem, setDraggedItem] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [spinnerMsg, setSpinnerMsg] = useState('');
  const [audioLevels, setAudioLevels] = useState({ music: 75, voice: 50, sfx: 65, master: 80 });
  const [enhancementSettings, setEnhancementSettings] = useState({ intensity: 75, clarity: 75, color: 75, brightness: 75 });
  const [exportSettings, setExportSettings] = useState({ quality: '8K', format: 'MP4' });
  const [communityPosts, setCommunityPosts] = useState([
    {id:1,title:'Epic Action Movie',user:'Sarah J.',emoji:'🎬',likes:2847,loves:1923,comments:[]},
    {id:2,title:'Family Vacation',user:'Mike Chen',emoji:'✈️',likes:1256,loves:892,comments:[]},
    {id:3,title:'First Documentary',user:'Emily R.',emoji:'📹',likes:3421,loves:2156,comments:[]},
    {id:4,title:'Music Video',user:'Alex T.',emoji:'🎵',likes:5234,loves:4012,comments:[]}
  ]);
  const [newComment, setNewComment] = useState({});
  const [toolSearch, setToolSearch] = useState('');
  const [userPlan] = useState('Studio');
  const [loggedInUser] = useState('woolleya129@gmail.com');

  const fileInputRef = useRef(null);

  const Spinner = ({ message }) => (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center">
      <div className="relative w-40 h-40 mb-8">
        <div className="absolute inset-0 rounded-full border-8 border-[#7c3aed]/30"/>
        <div className="absolute inset-0 rounded-full border-8 border-t-[#7c3aed] border-r-transparent border-b-transparent border-l-transparent" style={{animation:'spin 1s linear infinite'}}/>
        <Sparkles className="absolute inset-0 m-auto text-[#7c3aed]" size={48}/>
      </div>
      <p className="text-2xl font-black text-white text-center px-8">{message}</p>
      {rendering && (
        <div className="mt-6 w-80">
          <div className="w-full bg-zinc-800 h-4 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-full transition-all duration-300" style={{width:`${renderProgress}%`}}/>
          </div>
          <p className="text-center text-[#7c3aed] font-black text-2xl mt-2">{renderProgress}%</p>
        </div>
      )}
    </div>
  );

  const handleFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    setGenerating(true);
    setSpinnerMsg('📁 Uploading...');
    let loaded = 0;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaLibrary(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'image',
          size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
          url: event.target.result,
          timestamp: new Date().toISOString()
        }]);
        loaded++;
        if (loaded === files.length) {
          setGenerating(false);
          setSpinnerMsg('');
        }
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleAIGenerate = useCallback(() => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    setSpinnerMsg(`🤖 Generating "${selectedTool}"...`);
    setTimeout(() => {
      setMediaLibrary(prev => [...prev, {
        id: Date.now(),
        name: `AI-${selectedTool.replace(/\s+/g,'-').toLowerCase()}.mp4`,
        type: 'video',
        size: (Math.random() * 500 + 100).toFixed(2) + 'MB',
        url: `data:video/mp4;base64,AI_GENERATED`,
        aiGenerated: true,
        timestamp: new Date().toISOString()
      }]);
      setGenerating(false);
      setSpinnerMsg('');
      setAiPrompt('');
      setSelectedTool(null);
    }, 3000);
  }, [aiPrompt, selectedTool]);

  const handleDrop = useCallback((track) => {
    if (!draggedItem) return;
    setTimeline(prev => ({ ...prev, [track]: [...prev[track], { ...draggedItem, trackPosition: Date.now() }] }));
    setDraggedItem(null);
  }, [draggedItem]);

  const removeFromTimeline = useCallback((track, index) => {
    setTimeline(prev => ({ ...prev, [track]: prev[track].filter((_, i) => i !== index) }));
  }, []);

  const deleteFromLibrary = useCallback((id) => {
    setMediaLibrary(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleRender = useCallback(() => {
    setRendering(true);
    setRenderProgress(0);
    setSpinnerMsg(`🎬 Rendering ${exportSettings.quality}...`);
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setMediaLibrary(prev => [...prev, {
              id: Date.now(),
              name: `mandastrong-${Date.now()}.${exportSettings.format.toLowerCase()}`,
              type: 'video',
              size: (Math.random() * 1000 + 500).toFixed(2) + 'MB',
              url: `data:video/mp4;base64,RENDERED`,
              rendered: true,
              timestamp: new Date().toISOString()
            }]);
            setCurrentVideo({id: Date.now(), name: `movie-${Date.now()}.mp4`});
            setRendering(false);
            setRenderProgress(0);
            setSpinnerMsg('');
            setPage(16);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
  }, [exportSettings]);

  const handleDownload = useCallback((asset) => {
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = asset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleLike = useCallback((postId) => {
    setCommunityPosts(prev => prev.map(p => p.id === postId ? {...p, likes: p.likes + 1} : p));
  }, []);

  const handleLove = useCallback((postId) => {
    setCommunityPosts(prev => prev.map(p => p.id === postId ? {...p, loves: p.loves + 1} : p));
  }, []);

  const handleComment = useCallback((postId) => {
    const comment = newComment[postId];
    if (!comment?.trim()) return;
    setCommunityPosts(prev => prev.map(p => p.id === postId ? {...p, comments: [...(p.comments||[]), {id:Date.now(), text:comment, user: loggedInUser, timestamp: new Date().toISOString()}]} : p));
    setNewComment(prev => ({...prev, [postId]: ''}));
  }, [newComment, loggedInUser]);

  const filteredTools = (category) => {
    const tools = AI_TOOLS[category] || [];
    if (!toolSearch) return tools;
    return tools.filter(t => t.toLowerCase().includes(toolSearch.toLowerCase()));
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <style>{`
        [data-bolt-badge],[class*="bolt"],[id*="bolt"],a[href*="bolt"]{display:none!important;}
        .scrollbar::-webkit-scrollbar{width:6px;}
        .scrollbar::-webkit-scrollbar-track{background:#000;}
        .scrollbar::-webkit-scrollbar-thumb{background:#7c3aed;border-radius:10px;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes wave{0%,100%{transform:scaleY(0.5)}50%{transform:scaleY(1)}}
      `}</style>

      <input ref={fileInputRef} type="file" multiple accept="video/*,audio/*,image/*" onChange={handleFileUpload} className="hidden"/>

      {(generating || rendering) && <Spinner message={spinnerMsg}/>}

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 border-b-2 border-[#7c3aed] px-6 py-4 flex items-center justify-between">
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-3 bg-[#7c3aed] px-4 py-2 rounded-xl hover:bg-[#6d28d9] transition">
            <Menu size={24}/><span className="font-black text-sm uppercase">Menu</span>
          </button>
          {menuOpen && (
            <div className="absolute top-14 left-0 bg-zinc-950 border-2 border-[#7c3aed] rounded-2xl w-72 shadow-2xl max-h-[80vh] overflow-y-auto scrollbar z-50">
              <div className="bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] p-4 rounded-t-xl text-center">
                <div className="text-xs font-bold text-white/70 mb-1">CURRENT PLAN</div>
                <div className="text-xl font-black text-white">{userPlan}</div>
                <div className="text-xs text-white/80 mt-1">{loggedInUser}</div>
              </div>
              <div className="p-4 space-y-1">
                {PAGES.map((p, i) => (
                  <button key={i} onClick={() => { setPage(i+1); setMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition ${page===i+1?'bg-[#7c3aed] text-white':'text-zinc-300 hover:bg-[#7c3aed]/20'}`}>
                    {i+1}. {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-center cursor-pointer" onClick={() => setPage(1)}>
          <div className="text-2xl font-black text-[#7c3aed] uppercase">MANDASTRONG</div>
          <div className="text-xs text-zinc-400 uppercase">AI Movie Studio</div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p-1))} className="bg-zinc-800 p-2 rounded-lg hover:bg-[#7c3aed] transition"><ChevronLeft size={20}/></button>
          <button onClick={() => setPage(p => Math.min(21, p+1))} className="bg-[#7c3aed] p-2 rounded-lg hover:bg-[#6d28d9] transition"><ChevronRight size={20}/></button>
        </div>
      </header>

      <main className="pt-20 pb-32 min-h-screen overflow-y-auto scrollbar">

        {/* PAGE 1 */}
        {page === 1 && (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
            <div className="w-40 h-40 rounded-full bg-[#7c3aed]/20 border-4 border-[#7c3aed] flex items-center justify-center mb-8 animate-pulse">
              <Film size={80} className="text-[#7c3aed]"/>
            </div>
            <h1 className="text-8xl font-black uppercase text-[#7c3aed] mb-4 leading-none">MANDA<br/>STRONG</h1>
            <p className="text-3xl font-bold text-white mb-2">AI Movie Studio</p>
            <p className="text-zinc-400 text-xl mb-12 max-w-3xl">Welcome To The All In One Make Your Own Longer Movies App!</p>
            <button onClick={() => setPage(3)} className="px-16 py-6 bg-[#7c3aed] rounded-full font-black text-2xl uppercase hover:bg-[#6d28d9] transition shadow-2xl">🎬 START CREATING</button>
          </div>
        )}

        {/* PAGES 4-9 - AI TOOLS WITH SEARCH */}
        {[4,5,6,7,8,9].includes(page) && (
          <div className="min-h-screen p-8 pt-20 pb-40">
            {/* SEARCH BAR - TOP LEFT */}
            <div className="max-w-7xl mx-auto mb-8">
              <div className="relative max-w-xl">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c3aed]"/>
                <input value={toolSearch} onChange={e => setToolSearch(e.target.value)} placeholder="🔍 Search AI Tools..." className="w-full bg-zinc-900 border-2 border-[#7c3aed] pl-12 pr-10 py-4 rounded-xl text-white outline-none text-lg font-bold"/>
                {toolSearch && <button onClick={() => setToolSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"><X size={20}/></button>}
              </div>
            </div>

            {[['Text to Video',4],['Image to Video',5],['Script to Movie',6],['Voice Creator',7],['Audio Studio',8],['VFX Magic',9]].map(([cat, pg]) => page === pg && (
              <div key={cat} className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-black uppercase text-[#7c3aed] mb-12 text-center">{cat.toUpperCase()}</h1>
                <div className="grid grid-cols-4 gap-4">
                  {filteredTools(cat).map(tool => (
                    <button key={tool} onClick={() => setSelectedTool(tool)} className="bg-zinc-950 border-2 border-zinc-800 p-5 rounded-2xl hover:border-[#7c3aed] hover:bg-[#7c3aed]/10 transition text-left group">
                      <Sparkles size={24} className="text-[#7c3aed] mb-3 group-hover:scale-110 transition-transform"/>
                      <h3 className="text-sm font-bold text-white leading-tight">{tool}</h3>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* TOOL MODAL WITH PASTE */}
            {selectedTool && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8">
                <div className="bg-zinc-950 border-4 border-[#7c3aed] rounded-3xl p-10 max-w-2xl w-full">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black uppercase text-[#7c3aed]">{selectedTool}</h2>
                    <button onClick={() => {setSelectedTool(null);setAiPrompt('');}} className="text-white hover:text-red-500"><X size={32}/></button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <button onClick={() => fileInputRef.current?.click()} className="aspect-square bg-zinc-900 border-2 border-[#7c3aed] rounded-2xl flex flex-col items-center justify-center hover:bg-[#7c3aed]/20 transition">
                      <Upload size={48} className="text-[#7c3aed] mb-2"/>
                      <p className="font-black text-white text-sm">UPLOAD</p>
                    </button>

                    <button onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text.startsWith('data:') || text.startsWith('http')) {
                          setMediaLibrary(prev => [...prev, {
                            id: Date.now(),
                            name: `pasted-${Date.now()}.mp4`,
                            type: 'video',
                            size: '0 MB',
                            url: text,
                            timestamp: new Date().toISOString()
                          }]);
                          setSelectedTool(null);
                        } else alert('📋 Paste a valid URL');
                      } catch {
                        alert('❌ Clipboard denied');
                      }
                    }} className="aspect-square bg-zinc-900 border-2 border-[#7c3aed] rounded-2xl flex flex-col items-center justify-center hover:bg-[#7c3aed]/20 transition">
                      <Layers size={48} className="text-[#7c3aed] mb-2"/>
                      <p className="font-black text-white text-sm">PASTE</p>
                    </button>

                    <div className="aspect-square bg-zinc-900 border-2 border-[#7c3aed] rounded-2xl flex flex-col items-center justify-center">
                      <Sparkles size={48} className="text-[#7c3aed] mb-2"/>
                      <p className="font-black text-white text-sm">GENERATE</p>
                    </div>
                  </div>

                  <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Describe what you want..." className="w-full bg-black border-2 border-[#7c3aed] p-5 rounded-xl text-white text-lg outline-none resize-none h-32 mb-6"/>
                  <button onClick={handleAIGenerate} disabled={!aiPrompt.trim()} className="w-full py-4 bg-[#7c3aed] rounded-xl font-black uppercase text-xl hover:bg-[#6d28d9] transition disabled:opacity-50">
                    <Sparkles size={20} className="inline mr-2"/>GENERATE
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAGE 11 - EDITOR SUITE WITH DURATION SLIDER */}
        {page === 11 && (
          <div className="min-h-screen p-8 pt-20 pb-40">
            <h1 className="text-6xl font-black uppercase text-[#7c3aed] mb-12 text-center">EDITOR SUITE</h1>
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] rounded-3xl p-12 mb-12 border-4 border-[#a78bfa]">
              <div className="flex items-center gap-6 mb-8">
                <Clock size={56} className="text-white"/>
                <h3 className="text-4xl font-black text-white">MOVIE DURATION</h3>
              </div>
              <div className="text-center mb-6">
                <div className="text-8xl font-black text-white">{duration}</div>
                <div className="text-2xl font-bold text-white/80 uppercase">MINUTES</div>
                <div className="text-xl text-white/60 mt-2">{Math.floor(duration/60)}h {duration%60}m</div>
              </div>
              <input 
                type="range" 
                min="1" 
                max="180" 
                value={duration} 
                onChange={e => setDuration(Number(e.target.value))} 
                className="w-full h-4 rounded-full mb-4 cursor-pointer appearance-none bg-white/20"
                style={{accentColor:'white'}}
              />
              <div className="flex justify-between text-sm text-white/70 mb-8">
                <span>1 min</span>
                <span>30 min</span>
                <span>60 min</span>
                <span>90 min</span>
                <span>120 min</span>
                <span>180 min (3 hours)</span>
              </div>
              <div className="grid grid-cols-6 gap-3">
                {[30,60,90,120,150,180].map(m => (
                  <button key={m} onClick={() => setDuration(m)} className={`py-4 rounded-xl font-bold text-lg transition ${duration===m?'bg-white text-[#7c3aed]':'bg-white/20 text-white hover:bg-white/30'}`}>
                    {m}min
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PAGE 21 - THANK YOU */}
        {page === 21 && (
          <div className="min-h-screen p-8 pt-20 pb-40 max-w-6xl mx-auto">
            <div className="mb-12">
              <audio autoPlay loop className="w-full">
                <source src="/ThatsAllFolks.mp3" type="audio/mpeg"/>
              </audio>
              <p className="text-center text-zinc-500 text-sm mt-2">♪ Playing ThatsAllFolks.mp3 ♪</p>
            </div>
            <h1 className="text-9xl font-black text-[#7c3aed] uppercase text-center mb-16">THAT'S ALL<br/>FOLKS!</h1>
          </div>
        )}

      </main>
    </div>
  );
}
