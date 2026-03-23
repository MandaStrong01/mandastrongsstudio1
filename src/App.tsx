import { useState, useRef, useEffect } from "react";

const GOLD = "#e8c96d";
const GOLDDIM = "#a07820";
const GOLDBG = "#1a1400";
const BG = "#000000";
const BG2 = "#000000";
const BG3 = "#000000";
const BG4 = "#080808";
const WHITE = "#d4c9a8";
const DIM = "#aaaaaa";
const TOTAL = 23;

const STRIPE = {
  basic:  "https://buy.stripe.com/test_basic",
  pro:    "https://buy.stripe.com/test_pro",
  studio: "https://buy.stripe.com/test_studio",
};

const G = (v, sm) => ({
  background: v==="gold" ? `linear-gradient(135deg,${GOLDDIM},${GOLD})` : "transparent",
  border: v==="gold" ? "none" : `1px solid ${GOLD}`,
  color: v==="gold" ? "#000" : GOLD,
  borderRadius:0, fontWeight:900,
  padding: sm ? "5px 14px" : "10px 26px",
  fontSize: sm ? 11 : 13,
  cursor:"pointer", letterSpacing:2, textTransform:"uppercase",
  fontFamily:"'Rajdhani',sans-serif",
});
const Sp = { minHeight:"100vh", background:"#000", color:WHITE, fontFamily:"'Rajdhani',sans-serif", paddingBottom:100 };
const H1 = { fontFamily:"'Cinzel',serif", color:GOLD, letterSpacing:5, textTransform:"uppercase", margin:0 };
const Card = (x) => ({ background:"#000", border:`1px solid ${GOLDDIM}`, borderRadius:0, padding:18, ...(x||{}) });

const WRITING = ["Script to Movie","Text to Script","Script to Screenplay","Prompt to Story","Story to Script","Feature Film Script","Short Film Script","TV Pilot Script","Documentary Script","Commercial Script","YouTube Script","Podcast Script","Social Media Script","Explainer Script","Plot Generator","Story Outline","Three Act Structure","Five Act Structure","Beat Sheet Builder","Character Bio Writer","Character Arc Builder","Subplot Generator","Plot Twist Generator","Opening Hook Creator","Climax Designer","Logline Generator","Synopsis Writer","Treatment Writer","Scene Writer","Text to Dialogue","Dialogue Generator","Narration Writer","Voiceover Script","Interview Script","Action Line Writer","Scene Heading Tool","Parenthetical Generator","Script Formatter","Dialogue Tightener","Script Timer","Word Counter","Page Counter","Reading Time Estimator","Format Checker","Grammar Polish","Spell Checker","Continuity Checker","Plot Hole Detector","Tone Checker","Genre Classifier"];
const VOICE = ["Upload Own Voice","Record My Voice","Clone My Voice","Text to Voice","Text to Speech","Text to Narration","Text to Audiobook","Text to Voiceover","Voice Cloning","Voice to Voice","AI Voice Actor","Neural Voice Generator","Emotion Voice Synth","Trailer Voice Generator","Documentary Voice","Commercial Voice","Character Voice Creator","Accent Generator","Multi Language Voice","Voice Translator","Lip Sync AI","Dialogue Synth","Audiobook Creator","Podcast Voice","Radio DJ Voice","Sports Commentary Voice","ASMR Creator","Whisper Generator","Meditation Voice","Alien Voice","Deep Voice Generator","Robot Voice","Monster Voice","Child Voice","Elderly Voice","Male to Female Voice","Female to Male Voice","Speed Controller","Tone Adjuster","Pitch Controller","Volume Normalizer","Clarity Booster","Voice Denoiser","Echo Remover","Reverb Remover","Background Noise Remover","Voice EQ Studio"];
const IMAGE_T = ["Text to Image","Prompt to Image","Image to Image","Image Upscaler","Image Generator","AI Art Generator","Photo to Painting","Sketch to Image","Wireframe to Image","Background Generator","Background Remover","Sky Replacer","Object Remover","Face Generator","Character Design","Portrait Generator","Avatar Creator","Product Image Generator","Architecture Visualizer","Interior Design Generator","Landscape Generator","Abstract Art Generator","Logo Generator","Icon Creator","Texture Generator","Pattern Maker","Color Palette Generator","Style Transfer","Photo Enhancer","Photo Restorer","Old Photo Colorizer","Black & White to Color","Image Denoiser","Sharpness Enhancer","Clarity Booster","Detail Enhancer","HDR Image Creator","Exposure Fixer","White Balance AI","Color Grading Studio","LUT Creator","Tone Mapper","Contrast Adjuster","Brightness Tool","Saturation Engine","Hue Shift","Temperature Control","Vignette Tool"];
const VIDEO_T = ["Text to Video","Image to Video","Video to Video","AI Video Creator","AI Film Generator","Video Upscaler","AI Video Generator 4K","Set to Video","Video Colorizer","Color Grading Pro","Fast Look Generator","Film Restoration","Time Lapse Creator","Video Trimmer","Background Remover","Digital Human Video","Rotoscope Video","Animation Creator","Puppet Animator","Motion Capture","Character Animator","Video Stabilizer","Video Compressor","Cinematic LUT","Black & White Film","Film Texture","VHS Effect","Glitch Effect","Quick Film Creator","Opening Slate","Time Freeze","Bullet Time Effect","Rain Simulation","Snow Simulation","Smoke Generator","Fire Simulation","Particle System","AI Progressive Video","4K Upscaling"];
const MOTION = ["AI 8K Upscaling","AI 4K Upscaling","Video Super Resolution","Frame Interpolation","Video Denoiser","Noise Reduction","Grain Remover","Artifact Remover","Scratch Remover","Video Sharpener","Clarity Booster","Detail Enhancer","Edge Enhancement","Texture Boost","White Balance AI","Color Correction","Auto Color Balance","Color Match Pro","Color Grading AI","Cinematic Color Grade","Film Stock Emulation","LUT Generator","Tone Mapping Pro","HDR Enhancement","Deep HDR Boost","Dynamic Range Expansion","Shadow Recovery","Highlight Recovery","Black Point Calibration","Gamma Correction","Contrast Enhancer","Brightness Optimizer","Saturation Booster","Smart Saturation","Face Enhancement","Face Retouch","Eye Enhancer","Teeth Whitener","Skin Tone Enhancer","Background Enhancer","Sky Enhancer","Landscape Enhancer","Night Video Enhancer","Low Light Clarity","Motion Stabilization","Shake Remover","Rolling Shutter Fix"];

const NAV = [{p:1,l:"Home"},{p:2,l:"Platform"},{p:3,l:"Examples"},{p:4,l:"Login / Pricing"},{p:5,l:"Writing Tools"},{p:6,l:"Voice Tools"},{p:7,l:"Image Tools"},{p:8,l:"Video Tools"},{p:9,l:"Motion & VFX"},{p:10,l:"Enhancement"},{p:11,l:"Upload Media"},{p:12,l:"Editor Suite"},{p:13,l:"Timeline Editor"},{p:14,l:"Enhancement Studio"},{p:15,l:"Audio Mixer"},{p:16,l:"Render Engine"},{p:17,l:"Film Preview"},{p:18,l:"Export & Distribute"},{p:19,l:"Tutorials"},{p:20,l:"Terms & Disclaimer"},{p:21,l:"Agent Grok"},{p:22,l:"Community Hub"},{p:23,l:"That's All Folks"}];

function QAMenu({ go, onClose, user }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex" }}>
      <div style={{ width:256, background:"#000", borderRight:`1px solid ${GOLD}`, height:"100vh", overflowY:"auto", padding:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <span style={{ fontFamily:"'Cinzel',serif", color:GOLD, fontSize:13, fontWeight:900, letterSpacing:3 }}>QUICK ACCESS</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:GOLD, fontSize:20, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ background:`linear-gradient(135deg,${GOLDDIM},${GOLD})`, borderRadius:0, padding:"9px 12px", marginBottom:10, textAlign:"center" }}>
          <div style={{ color:"#000", fontWeight:900, fontSize:12, letterSpacing:3, fontFamily:"'Cinzel',serif" }}>MANDA STRONG STUDIO</div>
        </div>
        {user && user.plan && <div style={{ background:"#000", border:`1px solid ${GOLDDIM}`, borderRadius:0, padding:"7px 10px", marginBottom:14, textAlign:"center" }}>
          <div style={{ color:DIM, fontSize:13, letterSpacing:2 }}>PLAN</div>
          <div style={{ color:GOLD, fontWeight:900, fontSize:14, fontFamily:"'Cinzel',serif" }}>{user.plan}</div>
        </div>}
        {NAV.map(i => (
          <button key={i.p} onClick={() => { go(i.p); onClose(); }}
            style={{ width:"100%", textAlign:"left", background:"none", border:"none", color:WHITE, padding:"8px 8px", borderRadius:0, cursor:"pointer", fontSize:13, fontWeight:700, display:"block", marginBottom:1, letterSpacing:1 }}
            onMouseEnter={e => { e.currentTarget.style.background=BG4; e.currentTarget.style.color=GOLD; }}
            onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color=WHITE; }}>
            {String(i.p).padStart(2,"0")} &nbsp; {i.l.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{ flex:1, background:"rgba(0,0,0,0.75)" }} onClick={onClose} />
    </div>
  );
}

function Header({ go, setMenu }) {
  return (
    <header style={{ position:"sticky", top:0, zIndex:500, background:"#000", borderBottom:`1px solid ${GOLD}`, padding:"0 16px", height:52, display:"flex", alignItems:"center", gap:12 }}>
      <button onClick={() => setMenu(true)} style={{ background:"none", border:`1px solid ${GOLD}`, color:GOLD, borderRadius:0, width:34, height:34, cursor:"pointer", fontSize:16, flexShrink:0 }}>☰</button>
      <div onClick={() => go(1)} style={{ cursor:"pointer", flexShrink:0 }}>
        <div style={{ fontFamily:"'Cinzel',serif", color:GOLD, fontSize:13, fontWeight:900, letterSpacing:3, lineHeight:1, textShadow:`0 0 16px ${GOLD}99` }}>MANDA STRONG</div>
        <div style={{ fontFamily:"'Cinzel',serif", color:GOLDDIM, fontSize:13, letterSpacing:4 }}>STUDIO</div>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ color:GOLD, fontSize:12, letterSpacing:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", fontWeight:700 }}>
          ✦ CINEMA INTELLIGENCE PLATFORM &nbsp;·&nbsp; 600+ AI TOOLS &nbsp;·&nbsp; 8K EXPORT &nbsp;·&nbsp; UP TO 3-HOUR FILMS
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <div style={{ color:"#22c55e", fontSize:13, letterSpacing:2, fontWeight:900 }}>● SYSTEM ONLINE</div>
        <div onClick={() => go(21)} style={{ width:36, height:36, background:`linear-gradient(135deg,${GOLDDIM},${GOLD})`, borderRadius:0, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:19, fontWeight:900, color:"#000", boxShadow:`0 0 18px ${GOLD}77` }}>G</div>
      </div>
    </header>
  );
}

function Footer({ page, go }) {
  return (
    <footer style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:400, background:"#000", borderTop:`1px solid ${GOLD}`, padding:"6px 20px 8px", display:"flex", flexDirection:"column", gap:4 }}>
      <div style={{ textAlign:"center" }}>
        <span style={{ color:GOLD, fontSize:12, letterSpacing:1, fontWeight:700 }}>MANDASTRONG STUDIO 2026 · PROFESSIONAL CINEMA SYNTHESIS · MandaStrong1.Etsy.com</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
        <button onClick={() => go(Math.max(1,page-1))} disabled={page===1} style={{ ...G("out",true), opacity:page===1?0.3:1 }}>◀ BACK</button>
        <span style={{ color:GOLD, fontSize:13, fontWeight:900, fontFamily:"'Cinzel',serif", letterSpacing:2 }}>PAGE {page} / {TOTAL}</span>
        <button onClick={() => go(Math.min(TOTAL,page+1))} disabled={page===TOTAL} style={{ ...G("gold",true), opacity:page===TOTAL?0.3:1 }}>NEXT ▶</button>
        <span style={{ color:"#22c55e", fontSize:13, fontWeight:700, marginLeft:20 }}>● AUTOSAVE ON</span>
      </div>
    </footer>
  );
}

function ToolCard({ name, onOpen }) {
  return (
    <div onClick={() => onOpen(name)}
      style={{ background:"#000", border:`1px solid ${GOLDDIM}`, borderRadius:0, padding:"14px 12px", cursor:"pointer", transition:"all .15s", minHeight:56, display:"flex", alignItems:"center" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor=GOLD; e.currentTarget.style.background="#0a0800"; e.currentTarget.style.boxShadow=`0 0 10px ${GOLD}44`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor=GOLDDIM; e.currentTarget.style.background="#000"; e.currentTarget.style.boxShadow="none"; }}>
      <div style={{ color:WHITE, fontSize:13, fontWeight:800, lineHeight:1.3, letterSpacing:.5 }}>{name}</div>
    </div>
  );
}

function ToolPanel({ tool, onClose, onSave }) {
  const [mode, setMode] = useState("upload");
  const [describe, setDescribe] = useState("");
  const [result, setResult] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const runAI = async () => {
    if (!describe.trim()) return;
    setLoading(true); setSaved(false); setResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true" },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800,
          messages:[{ role:"user", content:`MandaStrong Studio — Tool: "${tool}"\nUser request: ${describe}\n\nGenerate professional cinematic content for this tool. Be specific and creative.` }] })
      });
      const d = await res.json();
      setResult(d.content && d.content[0] ? d.content[0].text : "Generated successfully!");
    } catch(e) { setResult("Error connecting — check API key in Bolt settings."); }
    setLoading(false);
  };

  const save = () => {
    if (!result.trim()) return;
    if (onSave) onSave({ id:Date.now()+Math.random(), name:`${tool} — Result`, type:"text/plain", url:"", content:result });
    setSaved(true);
  };

  const handleFile = (files) => {
    if (!files || !files[0]) return;
    const f = files[0];
    if (onSave) onSave({ id:Date.now()+Math.random(), name:f.name, type:f.type, file:f, url:URL.createObjectURL(f) });
    setSaved(true);
  };

  const inp = { width:"100%", background:"#000", border:`1px solid ${GOLDDIM}`, borderRadius:0, padding:"9px 12px", color:WHITE, fontSize:14, outline:"none", boxSizing:"border-box", letterSpacing:.5, fontFamily:"'Rajdhani',sans-serif" };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:900, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:"min(560px,95vw)", background:"#000", border:`1px solid ${GOLD}`, borderRadius:0, padding:26, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <h2 style={{ ...H1, fontSize:16, margin:0, letterSpacing:4 }}>{tool}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:GOLD, fontSize:20, cursor:"pointer" }}>✕</button>
        </div>
        {/* 3 mode buttons */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:18 }}>
          {[["upload","UPLOAD"],["paste","PASTE"],["ai","AI CREATE ✦"]].map(([m,l]) => (
            <button key={m} onClick={() => setMode(m)}
              style={{ ...G(mode===m?"gold":"out",true), textAlign:"center", fontSize:11 }}>{l}</button>
          ))}
        </div>
        {/* UPLOAD mode */}
        {mode==="upload" && (
          <div style={{ marginBottom:14 }}>
            <div style={{ color:GOLD, fontSize:12, letterSpacing:3, fontWeight:900, marginBottom:10 }}>UPLOAD FILE</div>
            <div onClick={() => fileRef.current && fileRef.current.click()}
              style={{ border:`2px dashed ${GOLDDIM}`, padding:"30px 20px", textAlign:"center", cursor:"pointer", transition:"border-color .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor=GOLD}
              onMouseLeave={e => e.currentTarget.style.borderColor=GOLDDIM}>
              <div style={{ fontSize:28, marginBottom:8 }}>⬆</div>
              <div style={{ color:WHITE, fontSize:13, fontWeight:700, letterSpacing:1 }}>CLICK TO BROWSE</div>
              <div style={{ color:DIM, fontSize:13, marginTop:4 }}>Video · Audio · Image · Text</div>
            </div>
            <input ref={fileRef} type="file" style={{ display:"none" }} onChange={e => handleFile(e.target.files)} />
          </div>
        )}
        {/* PASTE mode */}
        {mode==="paste" && (
          <div style={{ marginBottom:14 }}>
            <div style={{ color:GOLD, fontSize:12, letterSpacing:3, fontWeight:900, marginBottom:6 }}>ADD URL</div>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste a URL to import content..." style={{ ...inp, marginBottom:10 }} />
            <div style={{ color:GOLD, fontSize:12, letterSpacing:3, fontWeight:900, marginBottom:6 }}>OR PASTE TEXT</div>
            <textarea value={describe} onChange={e => setDescribe(e.target.value)} placeholder="Paste your content here..."
              style={{ ...inp, height:100, resize:"none", lineHeight:1.6 }} />
            <button onClick={() => { if(onSave) onSave({ id:Date.now()+Math.random(), name:`${tool} — Pasted`, type:"text/plain", url: url||"", content:describe }); setSaved(true); }}
              style={{ ...G("gold",false), marginTop:8, width:"100%", padding:"12px" }}>SAVE TO MEDIA LIBRARY</button>
          </div>
        )}
        {/* AI CREATE mode */}
        {mode==="ai" && (
          <div style={{ marginBottom:14 }}>
            <div style={{ color:GOLD, fontSize:12, letterSpacing:3, fontWeight:900, marginBottom:6 }}>DESCRIBE</div>
            <textarea value={describe} onChange={e => setDescribe(e.target.value)} placeholder={`Describe what you want from "${tool}"...`}
              style={{ ...inp, height:80, resize:"none", lineHeight:1.6 }} />
            <button onClick={runAI} disabled={loading||!describe.trim()}
              style={{ ...G("gold",false), marginTop:8, width:"100%", padding:"12px", opacity:loading||!describe.trim()?0.5:1 }}>
              {loading ? "⟳  GENERATING..." : "AI CREATE ✦"}
            </button>
            {result && (
              <div style={{ marginTop:14 }}>
                <div style={{ color:GOLD, fontSize:12, letterSpacing:3, fontWeight:900, marginBottom:6 }}>RESULT</div>
                <textarea value={result} onChange={e => setResult(e.target.value)}
                  style={{ ...inp, height:140, resize:"none", lineHeight:1.7 }} />
                <button onClick={save} style={{ ...G("gold",false), marginTop:8, width:"100%", padding:"12px" }}>GENERATE & SAVE</button>
              </div>
            )}
          </div>
        )}
        {saved && (
          <div style={{ marginTop:14, background:"#0a2a0a", border:`1px solid #22c55e`, borderRadius:0, padding:"12px 16px", textAlign:"center" }}>
            <div style={{ color:"#22c55e", fontWeight:900, fontSize:14, letterSpacing:2 }}>✓ ASSET SAVED TO MEDIA LIBRARY</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolPage({ title, subtitle, tools, onSave }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);
  const filtered = tools.filter(t => t.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ ...Sp }}>
      <div style={{ padding:"14px 18px 12px", borderBottom:`1px solid ${GOLDDIM}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontSize:13, color:GOLD, letterSpacing:4, fontWeight:700 }}>{subtitle}</div>
          <h1 style={{ ...H1, fontSize:24, margin:0 }}>{title}</h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ position:"relative" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${tools.length} tools...`}
              style={{ background:"#000", border:`1px solid ${GOLDDIM}`, borderRadius:0, padding:"7px 12px 7px 28px", color:WHITE, fontSize:13, outline:"none", width:200 }} />
            <span style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:GOLD, fontSize:13 }}>🔍</span>
            {search && <button onClick={() => setSearch("")} style={{ position:"absolute", right:7, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:GOLD, cursor:"pointer", padding:0 }}>✕</button>}
          </div>
          <span style={{ color:WHITE, fontSize:12, fontWeight:700, letterSpacing:1 }}>{filtered.length} TOOLS</span>
        </div>
      </div>
      <div style={{ padding:12, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
        {filtered.map(t => <ToolCard key={t} name={t} onOpen={setOpen} />)}
      </div>
      {open && <ToolPanel tool={open} onClose={() => setOpen(null)} onSave={onSave} />}
    </div>
  );
}

function P1({ go }) {
  return (
    <div style={{ ...Sp }}>
      <div style={{ background:"#000", padding:"56px 40px 36px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          {[...Array(55)].map((_,i) => (
            <div key={i} style={{ position:"absolute", width:i%4===0?2:1, height:i%4===0?2:1, background:GOLD, borderRadius:"50%", opacity:.1+i%4*.15, left:`${(i*17+3)%100}%`, top:`${(i*11+7)%100}%`, animation:`tw ${1.8+i%3*.8}s ease-in-out ${i%5*.35}s infinite` }} />
          ))}
        </div>
        <style>{`@keyframes tw{0%,100%{opacity:.05}50%{opacity:.85}}`}</style>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:13, color:DIM, letterSpacing:6, marginBottom:12 }}>CINEMA INTELLIGENCE PLATFORM — EST. 2026</div>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(34px,6vw,58px)", fontWeight:900, color:GOLD, letterSpacing:5, lineHeight:1, textShadow:`0 0 60px ${GOLD}dd, 0 0 120px ${GOLD}66` }}>MANDA STRONG</div>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(34px,6vw,58px)", fontWeight:900, color:GOLD, letterSpacing:5, lineHeight:1, textShadow:`0 0 60px ${GOLD}dd, 0 0 120px ${GOLD}66`, marginBottom:14 }}>STUDIO</div>
          <div style={{ color:WHITE, fontSize:12, letterSpacing:4, marginBottom:28, fontWeight:600 }}>600+ AI TOOLS · 8K EXPORT · UP TO 3-HOUR FILMS</div>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => go(4)} style={{ ...G("gold",false), fontSize:14, padding:"14px 38px", letterSpacing:3 }}>START CREATING</button>
            <button onClick={() => go(4)} style={{ ...G("out",false), fontSize:14, padding:"14px 38px", letterSpacing:3 }}>LOGIN / REGISTER</button>
          </div>
        </div>
      </div>
      <div style={{ borderTop:`1px solid ${GOLD}`, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, padding:"16px 24px 18px", maxWidth:800, margin:"0 auto" }}>
        {[["600+","AI TOOLS"],["8K","EXPORT"],["3 HRS","DURATION"],["1TB","STORAGE"]].map(([v,l]) => (
          <div key={v} style={{ ...Card(), textAlign:"center", padding:12 }}>
            <div style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:22, fontWeight:900, textShadow:`0 0 16px ${GOLD}77` }}>{v}</div>
            <div style={{ color:WHITE, fontSize:13, marginTop:3, fontWeight:700, letterSpacing:2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center", paddingBottom:24, paddingTop:16 }}>
        <div onClick={() => alert("Mobile: Share then Add to Home Screen\nDesktop: Click install icon in your browser address bar")}
          style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:110, height:110, background:"#000", border:`2px solid ${GOLD}`, cursor:"pointer", gap:4, transition:"background .15s" }}
          onMouseEnter={e => { e.currentTarget.style.background=GOLDDIM; }}
          onMouseLeave={e => { e.currentTarget.style.background="#000"; }}>
          <div style={{ fontSize:26, lineHeight:1 }}>⬇</div>
          <div style={{ color:GOLD, fontSize:13, fontWeight:900, letterSpacing:1, textAlign:"center", lineHeight:1.4 }}>DOWNLOAD<br/>AS APP</div>
        </div>
      </div>
    </div>
  );
}

function P2({ go }) {
  return (
    <div style={{ ...Sp, padding:40 }}>
      <div style={{ maxWidth:880, margin:"0 auto" }}>
        <div style={{ fontSize:13, color:GOLD, letterSpacing:4, marginBottom:8, fontWeight:700 }}>AI CREATOR PLATFORM</div>
        <h1 style={{ ...H1, fontSize:30, marginBottom:14 }}>MAKE AWESOME FAMILY MOVIES OR TURN YOUR DREAMS INTO REALITY</h1>
        <p style={{ color:WHITE, fontSize:15, lineHeight:1.9, maxWidth:720, marginBottom:28 }}>MandaStrong Studio combines the power of 600+ professional AI tools with an intuitive cinematic workspace — so anyone can create stunning short films, family videos, or feature-length productions up to 3 hours long. No film school required.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:28 }}>
          {[["600+","AI Tools"],["8K","Export Quality"],["3 HOURS","Max Duration"],["1TB","Cloud Storage"]].map(([v,l]) => (
            <div key={v} style={{ ...Card(), textAlign:"center", padding:14 }}>
              <div style={{ color:GOLD, fontFamily:"'Cinzel',serif", fontSize:22, fontWeight:900 }}>{v}</div>
              <div style={{ color:WHITE, fontSize:13, marginTop:4, fontWeight:600, letterSpacing:1 }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={() => go(4)} style={{ ...G("gold",false) }}>START CREATING</button>
      </div>
    </div>
  );
}

function P3() {
  const [playing, setPlaying] = useState([false,false,false]);
  const toggle = i => setPlaying(p => p.map((v,j) => j===i?!v:v));
  return (
    <div style={{ ...Sp, padding:40 }}>
      <div style={{ maxWidth:980, margin:"0 auto" }}>
        <div style={{ fontSize:13, color:GOLD, letterSpacing:4, marginBottom:8, fontWeight:700 }}>SHOWCASE</div>
        <h1 style={{ ...H1, fontSize:30, marginBottom:24 }}>EXAMPLES MADE BY MANDASTRONG STUDIO</h1>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ ...Card() }}>
              <div style={{ background:"#000", height:160, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12, border:`1px solid ${GOLDDIM}`, position:"relative", cursor:"pointer" }}
                onClick={() => toggle(s-1)}>
                <div style={{ width:52, height:52, borderRadius:0, border:`2px solid ${GOLD}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ color:GOLD, fontSize:22, marginLeft:4 }}>{playing[s-1] ? "⏸" : "▶"}</div>
                </div>
                <div style={{ position:"absolute", bottom:8, left:10, color:GOLD, fontSize:13, fontWeight:700, letterSpacing:2 }}>VIEWER 0{s}</div>
              </div>
              <button style={{ ...G("out",true), width:"100%" }}>⬆ UPLOAD FILM</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function P4({ go, setUser }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  const [name,setName]=useState(""); const [re,setRe]=useState("");
  const inp = { width:"100%", background:"#000", border:`1px solid ${GOLDDIM}`, borderRadius:0, padding:"10px 12px", color:WHITE, fontSize:14, marginBottom:10, outline:"none", boxSizing:"border-box", fontFamily:"'Rajdhani',sans-serif" };
  const login = () => {
    if(email==="woolleya129@gmail.com"&&pass==="Mangler1970!!"){setUser({name:"Amanda",plan:"Studio",isAdmin:true});go(5);}
    else{setUser({name:email.split("@")[0]||"Creator",plan:"Creator",isAdmin:false});go(5);}
  };
  return (
    <div style={{ ...Sp, padding:40 }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:18, marginBottom:36 }}>
          <div style={{ ...Card() }}>
            <div style={{ fontSize:13, color:GOLD, letterSpacing:3, marginBottom:8, fontWeight:700 }}>EXISTING USER</div>
            <h2 style={{ ...H1, fontSize:18, marginBottom:18 }}>SIGN IN</h2>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" style={inp}/>
            <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" style={{...inp,marginBottom:16}}/>
            <button onClick={login} style={{...G("gold",false),width:"100%",padding:"12px"}}>SIGN IN TO STUDIO</button>
            <div style={{textAlign:"center",marginTop:8,color:DIM,fontSize:12,letterSpacing:1}}>Secured with 256-bit encryption</div>
          </div>
          <div style={{...Card(),border:`2px solid #22c55e`,position:"relative"}}>
            <div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:"#22c55e",color:"#000",borderRadius:0,padding:"3px 14px",fontSize:12,fontWeight:900,whiteSpace:"nowrap",letterSpacing:1}}>🎉 7-DAY FREE TRIAL</div>
            <div style={{fontSize:13,color:GOLD,letterSpacing:3,marginBottom:8,marginTop:10,fontWeight:700}}>NEW CREATOR</div>
            <h2 style={{...H1,fontSize:18,marginBottom:18}}>CREATE ACCOUNT</h2>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name" style={inp}/>
            <input value={re} onChange={e=>setRe(e.target.value)} placeholder="Email address" style={{...inp,marginBottom:16}}/>
            <button onClick={()=>{setUser({name:name||"Creator",plan:"Studio Trial",isAdmin:false});window.open(STRIPE.studio,"_blank");go(5);}}
              style={{width:"100%",padding:"12px",background:"#22c55e",border:"none",color:"#000",borderRadius:0,fontWeight:900,fontSize:13,cursor:"pointer",letterSpacing:2}}>START FREE TRIAL — $0</button>
            <div style={{textAlign:"center",marginTop:8,color:DIM,fontSize:12,letterSpacing:1}}>Studio Plan Free for 7 Days · No Credit Card</div>
          </div>
          <div style={{...Card(),textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:10}}>👁</div>
            <h2 style={{...H1,fontSize:16,marginBottom:10}}>EXPLORE FIRST</h2>
            <p style={{color:WHITE,fontSize:14,lineHeight:1.7,marginBottom:20}}>Browse 600+ AI tools before committing. No account required.</p>
            <button onClick={()=>{setUser({name:"Guest",plan:"Guest",isAdmin:false});go(5);}} style={{...G("out",false),width:"100%"}}>BROWSE AS GUEST</button>
          </div>
        </div>
        <h2 style={{...H1,fontSize:22,textAlign:"center",marginBottom:22}}>SUBSCRIPTION PLANS</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          {[
            {t:"CREATOR PLAN",p:"20",link:STRIPE.basic,f:["HD Export 1080p","100 AI Tools","10GB Storage","Email Support","Basic Timeline"],pop:false,trial:false},
            {t:"PRO PLAN",p:"30",link:STRIPE.pro,f:["4K Export","300 AI Tools","100GB Storage","Priority Support","Full Timeline","Commercial License"],pop:true,trial:false},
            {t:"STUDIO PLAN",p:"50",link:STRIPE.studio,f:["8K Export","600+ AI Tools","1TB Storage","24/7 Support","Full Rights","API Access","7-Day Free Trial"],pop:false,trial:true},
          ].map(plan => (
            <div key={plan.t} style={{...Card(),border:plan.pop?`2px solid ${GOLD}`:`1px solid ${GOLDDIM}`,position:"relative"}}>
              {plan.pop&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:GOLD,color:"#000",borderRadius:0,padding:"2px 12px",fontSize:12,fontWeight:900,whiteSpace:"nowrap",letterSpacing:1}}>MOST POPULAR</div>}
              {plan.trial&&<div style={{position:"absolute",top:-11,right:12,background:"#22c55e",color:"#000",borderRadius:0,padding:"2px 10px",fontSize:12,fontWeight:900,whiteSpace:"nowrap"}}>🎉 FREE TRIAL</div>}
              <div style={{color:WHITE,fontSize:13,letterSpacing:3,fontWeight:700}}>{plan.t}</div>
              <div style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:34,fontWeight:900,margin:"8px 0",textShadow:`0 0 20px ${GOLD}66`}}>${plan.p}<span style={{fontSize:12,color:WHITE}}>/mo</span></div>
              <div style={{margin:"12px 0"}}>{plan.f.map(f=><div key={f} style={{color:WHITE,fontSize:13,padding:"3px 0",borderBottom:`1px solid ${BG}`}}>✓ {f}</div>)}</div>
              <button onClick={()=>window.open(plan.link,"_blank")} style={{...G(plan.trial?"out":"gold",false),width:"100%"}}>{plan.trial?"START FREE TRIAL":"SUBSCRIBE NOW"}</button>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",color:WHITE,fontSize:12,marginTop:14,letterSpacing:1}}>30-day money-back guarantee · Secure checkout via Stripe</div>
      </div>
    </div>
  );
}

function P11({ mediaLib, setMediaLib }) {
  const fileRef = useRef(null);
  const onFiles = files => {
    if(!files)return;
    const n=Array.from(files).map(f=>({id:Date.now()+Math.random(),name:f.name,type:f.type,file:f,url:URL.createObjectURL(f)}));
    setMediaLib(p=>[...p,...n]);
  };
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <div style={{fontSize:13,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>ASSET INGESTION</div>
        <h1 style={{...H1,fontSize:28,marginBottom:4}}>UPLOAD MEDIA</h1>
        <div style={{color:WHITE,fontSize:14,marginBottom:20,fontWeight:700,letterSpacing:1}}>{mediaLib.length} ASSETS IN LIBRARY</div>
        <div onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor=GOLD;}}
          onDragLeave={e=>{e.currentTarget.style.borderColor=GOLDDIM;}}
          onDrop={e=>{e.preventDefault();onFiles(e.dataTransfer.files);e.currentTarget.style.borderColor=GOLDDIM;}}
          onClick={()=>fileRef.current&&fileRef.current.click()}
          style={{border:`2px dashed ${GOLDDIM}`,borderRadius:0,padding:"50px 40px",textAlign:"center",cursor:"pointer",marginBottom:16,transition:"border-color .2s"}}>
          <div style={{fontSize:36,marginBottom:10}}>🎬</div>
          <div style={{color:WHITE,fontWeight:900,fontSize:16,letterSpacing:3}}>DRAG & DROP YOUR MEDIA HERE</div>
          <div style={{color:WHITE,fontSize:13,marginTop:8,letterSpacing:1}}>Or click to browse · Video · Audio · Images</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
          {[["📁","BROWSE FILES"],["🖥","RECORD SCREEN"],["🔗","IMPORT FROM URL"]].map(([ic,lb])=>(
            <button key={lb} onClick={()=>fileRef.current&&fileRef.current.click()}
              style={{...Card(),textAlign:"center",padding:16,cursor:"pointer",display:"block",border:`1px solid ${GOLDDIM}`}}>
              <div style={{fontSize:22,marginBottom:6}}>{ic}</div>
              <div style={{color:WHITE,fontSize:13,fontWeight:800,letterSpacing:2}}>{lb}</div>
            </button>
          ))}
        </div>
        {mediaLib.length>0&&(
          <div>
            <h3 style={{color:GOLD,fontWeight:900,fontSize:13,letterSpacing:3,marginBottom:10}}>MEDIA LIBRARY ({mediaLib.length})</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
              {mediaLib.map(a=>(
                <div key={a.id} style={{...Card(),padding:8,position:"relative"}}>
                  {a.type.startsWith("video")?<video src={a.url} style={{width:"100%",borderRadius:0,marginBottom:5}}/>:
                   a.type.startsWith("image")?<img src={a.url} style={{width:"100%",borderRadius:0,marginBottom:5}} alt={a.name}/>:
                   <div style={{height:60,background:"#000",borderRadius:0,marginBottom:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🎵</div>}
                  <div style={{color:WHITE,fontSize:13,fontWeight:800,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div>
                  <button onClick={()=>setMediaLib(p=>p.filter(x=>x.id!==a.id))}
                    style={{position:"absolute",top:5,right:5,background:"#7f1d1d",border:"none",color:"#ef4444",borderRadius:0,width:16,height:16,cursor:"pointer",fontSize:13,padding:0}}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" multiple accept="video/*,audio/*,image/*" onChange={e=>onFiles(e.target.files)} style={{display:"none"}}/>
      </div>
    </div>
  );
}

function P12({ go, mediaLib }) {
  const [dur,setDur]=useState(90);
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:880,margin:"0 auto"}}>
        <div style={{fontSize:13,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>PRODUCTION HUB</div>
        <h1 style={{...H1,fontSize:28,marginBottom:4}}>EDITOR SUITE</h1>
        <div style={{color:WHITE,fontSize:14,marginBottom:20,fontWeight:600,letterSpacing:1}}>Your complete post-production workspace.</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
          {[{ic:"🗂",t:"MEDIA LIBRARY",d:`${mediaLib.length} assets`,p:11},{ic:"⏱",t:"TIMELINE EDITOR",d:"Multi-track editing",p:13},{ic:"✨",t:"ENHANCEMENT STUDIO",d:"90+ AI tools",p:14},{ic:"🎵",t:"AUDIO MIXER",d:"4-channel mixing",p:15},{ic:"⚡",t:"RENDER ENGINE",d:"Up to 8K output",p:16},{ic:"▶",t:"PREVIEW PLAYER",d:"Full-screen playback",p:17}].map(c=>(
            <button key={c.t} onClick={()=>go(c.p)}
              style={{...Card(),textAlign:"left",cursor:"pointer",transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.boxShadow=`0 0 14px ${GOLD}33`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=GOLDDIM;e.currentTarget.style.boxShadow="none";}}>
              <div style={{fontSize:28,marginBottom:8}}>{c.ic}</div>
              <div style={{color:GOLD,fontWeight:900,fontSize:13,letterSpacing:2}}>{c.t}</div>
              <div style={{color:WHITE,fontSize:12,marginTop:4,fontWeight:600}}>{c.d}</div>
            </button>
          ))}
        </div>
        <div style={{...Card()}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{color:GOLD,fontWeight:900,fontSize:12,letterSpacing:3}}>MOVIE DURATION</div>
            <div style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:900}}>{dur} MIN</div>
          </div>
          <input type="range" min={0} max={180} step={5} value={dur} onChange={e=>setDur(+e.target.value)}
            style={{width:"100%",accentColor:GOLD,height:4,marginBottom:8}}/>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{color:DIM,fontSize:12,letterSpacing:1}}>0 MIN</span>
            <span style={{color:DIM,fontSize:12,letterSpacing:1}}>30</span>
            <span style={{color:DIM,fontSize:12,letterSpacing:1}}>60</span>
            <span style={{color:DIM,fontSize:12,letterSpacing:1}}>90</span>
            <span style={{color:DIM,fontSize:12,letterSpacing:1}}>120</span>
            <span style={{color:DIM,fontSize:12,letterSpacing:1}}>150</span>
            <span style={{color:DIM,fontSize:12,letterSpacing:1}}>180 MIN</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function P13({ go, mediaLib, timeline, setTimeline }) {
  const [tracks,setTracks]=useState(["VIDEO TRACK","AUDIO TRACK","TEXT / TITLES"]);
  const addToTrack=(idx,asset)=>setTimeline(p=>({...p,[idx]:[...(p[idx]||[]),asset]}));
  return (
    <div style={{...Sp,padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:13,color:GOLD,letterSpacing:4,fontWeight:700}}>EDITING WORKSPACE</div>
          <h1 style={{...H1,fontSize:24,margin:0}}>TIMELINE EDITOR</h1>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setTracks(p=>[...p,`TRACK ${p.length+1}`])} style={{...G("out",true)}}>+ ADD TRACK</button>
          <button onClick={()=>go(16)} style={{...G("gold",false)}}>→ RENDER</button>
          <button onClick={()=>setTimeline({})} style={{...G("out",true)}}>CLEAR ALL</button>
        </div>
      </div>
      <div style={{background:"#000",borderRadius:0,height:100,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,border:`1px solid ${GOLDDIM}`}}>
        {mediaLib[0]&&mediaLib[0].type.startsWith("video")?
          <video src={mediaLib[0].url} style={{height:"100%",width:"100%",objectFit:"cover",opacity:.5}}/>:
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:12,letterSpacing:3,color:WHITE,marginBottom:8}}>ADD MEDIA TO SEE PREVIEW</div>
            <button onClick={()=>go(11)} style={{...G("out",true)}}>⬆ UPLOAD MEDIA</button>
          </div>}
      </div>
      {tracks.map((tr,idx)=>(
        <div key={idx} style={{marginBottom:8}}>
          <div style={{color:GOLD,fontSize:13,letterSpacing:3,marginBottom:4,fontWeight:900}}>{tr}</div>
          <div onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData("assetId");const a=mediaLib.find(x=>String(x.id)===id);if(a)addToTrack(idx,a);}}
            style={{background:"#000",border:`1px dashed ${GOLDDIM}`,borderRadius:0,minHeight:42,padding:6,display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            {(timeline[idx]||[]).map((a,i)=>(
              <div key={i} style={{background:GOLDDIM,borderRadius:0,padding:"3px 10px",fontSize:12,color:"#000",fontWeight:900,display:"flex",alignItems:"center",gap:5}}>
                {a.name.slice(0,12)}
                <button onClick={()=>setTimeline(p=>({...p,[idx]:p[idx].filter((_,j)=>j!==i)}))}
                  style={{background:"none",border:"none",color:"#000",cursor:"pointer",fontSize:13,padding:0}}>✕</button>
              </div>
            ))}
            {!(timeline[idx]||[]).length&&<span style={{color:WHITE,fontSize:12,letterSpacing:1}}>DROP {tr} CLIPS HERE</span>}
          </div>
        </div>
      ))}
      {mediaLib.length>0&&(
        <div style={{marginTop:12}}>
          <div style={{color:GOLD,fontSize:13,letterSpacing:3,marginBottom:6,fontWeight:900}}>DRAG TO TIMELINE:</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {mediaLib.map(a=>(
              <div key={a.id} draggable onDragStart={e=>e.dataTransfer.setData("assetId",String(a.id))}
                style={{background:"#000",border:`1px solid ${GOLD}`,borderRadius:0,padding:"4px 10px",cursor:"grab",color:GOLD,fontSize:12,fontWeight:700}}>
                📎 {a.name.slice(0,14)}
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{...Card(),marginTop:12,display:"flex",alignItems:"center",gap:8}}>
        {["⏮","⏪","▶","⏩","⏭"].map(c=><button key={c} style={{...G("out",true)}}>{c}</button>)}
        <div style={{flex:1,height:3,background:"#000",borderRadius:1}}><div style={{width:"0%",height:"100%",background:GOLD,borderRadius:1}}/></div>
        <span style={{color:WHITE,fontSize:12,fontWeight:700,letterSpacing:1}}>00:00 / 90:00</span>
      </div>
    </div>
  );
}

function P14() {
  const tools14=MOTION.slice(0,14);
  const [active,setActive]=useState(tools14[0]);
  const [vals,setVals]=useState({Intensity:75,Clarity:80,Color:70,Brightness:65});
  return (
    <div style={{...Sp,display:"flex"}}>
      <div style={{width:176,background:"#000",borderRight:`1px solid ${GOLDDIM}`,overflowY:"auto",padding:8}}>
        {tools14.map(t=>(
          <button key={t} onClick={()=>setActive(t)}
            style={{width:"100%",textAlign:"left",background:t===active?BG4:"none",border:"none",color:t===active?GOLD:WHITE,padding:"8px 10px",borderRadius:0,cursor:"pointer",fontSize:12,fontWeight:t===active?900:600,marginBottom:1,borderLeft:t===active?`2px solid ${GOLD}`:"2px solid transparent"}}>
            {t}
          </button>
        ))}
      </div>
      <div style={{flex:1,padding:28}}>
        <div style={{fontSize:13,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>ENHANCEMENT STUDIO</div>
        <h2 style={{...H1,fontSize:22,marginBottom:6}}>{active.toUpperCase()}</h2>
        <div style={{color:WHITE,fontSize:14,marginBottom:20,fontWeight:600}}>Apply AI powered <strong style={{color:GOLD}}>{active}</strong> to your footage.</div>
        {Object.entries(vals).map(([k,v])=>(
          <div key={k} style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:WHITE,fontSize:13,fontWeight:700,letterSpacing:1}}>{k}</span>
              <span style={{color:GOLD,fontSize:13,fontWeight:900}}>{v}%</span>
            </div>
            <input type="range" min={0} max={100} value={v} onChange={e=>setVals(p=>({...p,[k]:+e.target.value}))} style={{width:"100%",accentColor:GOLD}}/>
          </div>
        ))}
        <div style={{display:"flex",gap:10,marginTop:18}}>
          <button style={{...G("gold",false)}}>APPLY ENHANCEMENT</button>
          <button onClick={()=>setVals({Intensity:75,Clarity:80,Color:70,Brightness:65})} style={{...G("out",false)}}>RESET</button>
        </div>
      </div>
    </div>
  );
}

function P15() {
  const [lvl,setLvl]=useState({MUSIC:75,VOICE:60,EFX:50,MASTER:85});
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <div style={{fontSize:13,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>MIXING CONSOLE</div>
        <h1 style={{...H1,fontSize:28,marginBottom:24}}>AUDIO MIXER</h1>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
          {Object.entries(lvl).map(([ch,val])=>(
            <div key={ch} style={{...Card(),textAlign:"center",padding:18}}>
              <div style={{color:GOLD,fontSize:12,letterSpacing:3,marginBottom:8,fontWeight:900}}>{ch}</div>
              <div style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:30,fontWeight:900,marginBottom:12,textShadow:`0 0 16px ${GOLD}88`}}>{val}</div>
              <input type="range" min={0} max={100} value={val} onChange={e=>setLvl(p=>({...p,[ch]:+e.target.value}))} style={{width:"100%",height:100,accentColor:GOLD}}/>
              <div style={{height:3,background:"#000",borderRadius:1,marginTop:10}}>
                <div style={{width:`${val}%`,height:"100%",background:`linear-gradient(90deg,${GOLDDIM},${GOLD})`,borderRadius:1}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setLvl({MUSIC:75,VOICE:60,EFX:50,MASTER:85})} style={{...G("out",false)}}>RESET LEVELS</button>
          <button style={{...G("gold",false)}}>SAVE PRESET</button>
        </div>
      </div>
    </div>
  );
}

function P16({ go, timeline, setRendered }) {
  const [quality,setQuality]=useState("8K - 4320p");
  const [format,setFormat]=useState("MP4");
  const [dur,setDur]=useState(90);
  const [progress,setProgress]=useState(0);
  const [rendering,setRendering]=useState(false);
  const [done,setDone]=useState(false);
  const clips=Object.values(timeline||{}).flat().length;
  const startRender=()=>{
    if(clips===0){alert("Add clips to the timeline first!");return;}
    setRendering(true);setDone(false);setProgress(0);
    let p=0;const iv=setInterval(()=>{p+=Math.random()*7+2;if(p>=100){clearInterval(iv);setProgress(100);setRendering(false);setDone(true);setRendered({url:"",quality,format,duration:dur,timestamp:new Date().toLocaleString()});}else setProgress(Math.round(p));},200);
  };
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:780,margin:"0 auto"}}>
        <div style={{fontSize:13,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>FINAL OUTPUT</div>
        <h1 style={{...H1,fontSize:28,marginBottom:20}}>RENDER FILM</h1>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <div style={{...Card()}}>
            <div style={{color:GOLD,fontWeight:900,fontSize:12,letterSpacing:3,marginBottom:10}}>EXPORT QUALITY</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["8K - 4320p","4K - 2160p","HD - 1080p","SD - 720p"].map(q=><button key={q} onClick={()=>setQuality(q)} style={{...G(quality===q?"gold":"out",true)}}>{q}</button>)}
            </div>
          </div>
          <div style={{...Card()}}>
            <div style={{color:GOLD,fontWeight:900,fontSize:12,letterSpacing:3,marginBottom:10}}>FORMAT</div>
            <div style={{display:"flex",gap:6}}>
              {["MP4","MOV","AVI","WebM"].map(f=><button key={f} onClick={()=>setFormat(f)} style={{...G(format===f?"gold":"out",true)}}>{f}</button>)}
            </div>
          </div>
        </div>
        <div style={{...Card(),marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{color:GOLD,fontWeight:900,fontSize:12,letterSpacing:3}}>FILM DURATION</div>
            <div style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:900}}>{dur} MIN</div>
          </div>
          <input type="range" min={0} max={180} step={5} value={dur} onChange={e=>setDur(+e.target.value)}
            style={{width:"100%",accentColor:GOLD,marginBottom:6}}/>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{color:DIM,fontSize:13,letterSpacing:1}}>0</span>
            <span style={{color:DIM,fontSize:13,letterSpacing:1}}>60</span>
            <span style={{color:DIM,fontSize:13,letterSpacing:1}}>90</span>
            <span style={{color:DIM,fontSize:13,letterSpacing:1}}>120</span>
            <span style={{color:DIM,fontSize:13,letterSpacing:1}}>180 MIN</span>
          </div>
        </div>
        <div style={{...Card(),display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          {["⏮","⏪","▶","⏩","⏭"].map(c=><button key={c} style={{...G("out",true)}}>{c}</button>)}
          <div style={{flex:1,height:3,background:"#000",borderRadius:1}}>
            <div style={{width:`${progress}%`,height:"100%",background:`linear-gradient(90deg,${GOLDDIM},${GOLD})`,borderRadius:1,transition:"width .3s"}}/>
          </div>
          <span style={{color:WHITE,fontSize:12,fontWeight:700,letterSpacing:1}}>00:00 / 90:00</span>
        </div>
        {rendering&&<div style={{...Card(),marginBottom:12,textAlign:"center"}}>
          <div style={{color:GOLD,fontWeight:900,fontSize:13,marginBottom:8,letterSpacing:2}}>RENDERING... {progress}%</div>
          <div style={{height:6,background:"#000",borderRadius:0}}><div style={{width:`${progress}%`,height:"100%",background:`linear-gradient(90deg,${GOLDDIM},${GOLD})`,borderRadius:0,transition:"width .3s"}}/></div>
        </div>}
        {done&&<div style={{background:"#0a2a0a",border:"1px solid #22c55e",borderRadius:0,padding:14,marginBottom:12,textAlign:"center"}}>
          <div style={{color:"#22c55e",fontWeight:900,fontSize:13,letterSpacing:2}}>RENDER COMPLETE — {quality} · {format}</div>
          <button onClick={()=>go(17)} style={{...G("out",true),marginTop:10,color:"#22c55e",borderColor:"#22c55e"}}>PREVIEW FILM</button>
        </div>}
        <button onClick={startRender} disabled={rendering}
          style={{...G("gold",false),width:"100%",padding:"14px",fontSize:13,letterSpacing:3,opacity:rendering?0.6:1}}>
          {rendering?`RENDERING... ${progress}%`:`START RENDER — ${quality} · ${format}`}
        </button>
      </div>
    </div>
  );
}

function P17({ go, rendered, mediaLib }) {
  const vs=mediaLib.find(a=>a.type.startsWith("video"))?mediaLib.find(a=>a.type.startsWith("video")).url:"";
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:880,margin:"0 auto"}}>
        <h1 style={{...H1,fontSize:28,marginBottom:14}}>FILM PREVIEW</h1>
        <div style={{background:"#000",borderRadius:0,overflow:"hidden",marginBottom:14,aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${GOLDDIM}`}}>
          {vs?<video src={vs} controls style={{width:"100%",height:"100%"}}/>:
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:36,marginBottom:10}}>🎬</div>
              <div style={{fontSize:12,letterSpacing:3,color:WHITE}}>NO RENDER AVAILABLE</div>
              <button onClick={()=>go(16)} style={{...G("out",true),marginTop:12}}>GO TO RENDER</button>
            </div>}
        </div>
        {rendered&&<div style={{...Card(),color:WHITE,fontSize:12,fontWeight:700,letterSpacing:1}}>RENDERED: {rendered.quality} · {rendered.format} · {rendered.timestamp}</div>}
        <div style={{...Card(),marginTop:10,display:"flex",alignItems:"center",gap:8}}>
          {["⏮","⏪","▶","⏩","⏭"].map(c=><button key={c} style={{...G("out",true)}}>{c}</button>)}
          <div style={{flex:1,height:3,background:"#000",borderRadius:1}}/>
          <span style={{color:WHITE,fontSize:12,fontWeight:700,letterSpacing:1}}>00:00 / 90:00</span>
        </div>
      </div>
    </div>
  );
}

function P18({ rendered, mediaLib }) {
  const vs=mediaLib.find(a=>a.type.startsWith("video"))?mediaLib.find(a=>a.type.startsWith("video")).url:"";
  const dl=()=>{if(!vs){alert("No film yet — render first!");return;}const a=document.createElement("a");a.href=vs;a.download="MandaStrong_Film.mp4";a.click();};
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:780,margin:"0 auto"}}>
        <div style={{fontSize:13,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>DISTRIBUTION</div>
        <h1 style={{...H1,fontSize:28,marginBottom:14}}>EXPORT & DISTRIBUTE</h1>
        <div style={{...Card(),marginBottom:16,textAlign:"center",color:rendered?WHITE:DIM,fontWeight:700,letterSpacing:1}}>
          {rendered?`FILM READY: ${rendered.quality} · ${rendered.format}`:"NO FILM RENDERED YET"}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
          {[["💾","DOWNLOAD TO DEVICE",dl],["💿","SAVE PROJECT FILE",()=>{}],["🌐","SHARE TO COMMUNITY HUB",()=>{}]].map(([ic,lb,fn])=>(
            <button key={lb} onClick={fn} style={{...Card(),cursor:"pointer",textAlign:"center",padding:16,display:"block"}}>
              <div style={{fontSize:24,marginBottom:6}}>{ic}</div>
              <div style={{color:WHITE,fontSize:13,fontWeight:900,letterSpacing:2}}>{lb}</div>
            </button>
          ))}
        </div>
        <div style={{color:GOLD,fontWeight:900,fontSize:12,letterSpacing:3,marginBottom:10}}>SHARE DIRECTLY TO SOCIAL MEDIA</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[
            {n:"YouTube",c:"#FF0000",icon:"▶"},
            {n:"Instagram",c:"#E1306C",icon:"◈"},
            {n:"TikTok",c:"#ffffff",icon:"♪"},
            {n:"X / Twitter",c:"#ffffff",icon:"𝕏"},
            {n:"Facebook",c:"#1877F2",icon:"f"},
            {n:"LinkedIn",c:"#0A66C2",icon:"in"},
            {n:"Vimeo",c:"#1AB7EA",icon:"V"},
            {n:"Pinterest",c:"#E60023",icon:"P"},
            {n:"WhatsApp",c:"#25D366",icon:"✆"},
          ].map(s=>(
            <button key={s.n} style={{background:"#000",border:`1px solid ${GOLDDIM}`,padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"border-color .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=s.c}
              onMouseLeave={e=>e.currentTarget.style.borderColor=GOLDDIM}>
              <span style={{color:s.c,fontSize:14,fontWeight:900,minWidth:16,textAlign:"center"}}>{s.icon}</span>
              <span style={{color:WHITE,fontSize:13,fontWeight:700}}>{s.n}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function P19() {
  const tuts=[{n:"01",t:"Getting Started - Platform Overview",d:"8:30",l:"Beginner"},{n:"02",t:"Importing & Managing Media Assets",d:"6:15",l:"Beginner"},{n:"03",t:"Multi-Track Timeline Editing",d:"12:45",l:"Intermediate"},{n:"04",t:"AI Tools - 600+ Features Explained",d:"18:20",l:"Intermediate"},{n:"05",t:"Professional Color Grading with AI",d:"22:00",l:"Advanced"},{n:"06",t:"Audio Mixing & Sound Design",d:"15:10",l:"Intermediate"},{n:"07",t:"AI Enhancement Studio Deep Dive",d:"20:30",l:"Advanced"},{n:"08",t:"Render Settings & Export Optimization",d:"8:15",l:"Beginner"}];
  const lc={Beginner:"#22c55e",Intermediate:"#f59e0b",Advanced:"#ef4444"};
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:780,margin:"0 auto"}}>
        <div style={{fontSize:13,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>LEARNING CENTER</div>
        <h1 style={{...H1,fontSize:28,marginBottom:20}}>TUTORIALS</h1>
        {tuts.map(t=>(
          <div key={t.n} onClick={()=>window.open("https://youtube.com","_blank")}
            style={{...Card(),marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"border-color .15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=GOLD}
            onMouseLeave={e=>e.currentTarget.style.borderColor=GOLDDIM}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:16,fontWeight:900,minWidth:28}}>{t.n}</span>
              <div>
                <div style={{color:WHITE,fontWeight:800,fontSize:14,letterSpacing:.5}}>{t.t}</div>
                <div style={{color:WHITE,fontSize:12,marginTop:2,fontWeight:600,letterSpacing:1}}>{t.d} · OPENS ON YOUTUBE</div>
              </div>
            </div>
            <span style={{background:lc[t.l]+"22",border:`1px solid ${lc[t.l]}`,color:lc[t.l],borderRadius:0,padding:"3px 10px",fontSize:13,fontWeight:900,flexShrink:0,letterSpacing:2}}>{t.l.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function P20() {
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:780,margin:"0 auto"}}>
        <div style={{fontSize:13,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>LEGAL</div>
        <h1 style={{...H1,fontSize:28,marginBottom:4}}>TERMS OF SERVICE & DISCLAIMER</h1>
        <div style={{color:WHITE,fontSize:12,marginBottom:20,fontWeight:600,letterSpacing:2}}>EFFECTIVE: MARCH 2026 · MANDASTRONG STUDIO LLC</div>
        <div style={{...Card(),marginBottom:14}}>
          <h2 style={{color:GOLD,fontWeight:900,fontSize:16,marginBottom:12,letterSpacing:2}}>TERMS OF SERVICE</h2>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9,margin:0}}>By accessing or using MandaStrong Studio, you agree to be legally bound by these Terms of Service. These Terms constitute a binding agreement between you and MandaStrong Studio LLC. Subscriptions bill monthly and auto-renew unless cancelled. All payments processed via Stripe. Studio Plan subscribers receive full commercial rights. You retain ownership of all media you upload. For support contact MandaStrong1.Etsy.com or Agent Grok on Page 21.</p>
        </div>
        <div style={{...Card()}}>
          <h2 style={{color:GOLD,fontWeight:900,fontSize:16,marginBottom:12,letterSpacing:2}}>DISCLAIMER</h2>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9,margin:0}}>MandaStrong Studio is provided "as is" without warranties of any kind. To the fullest extent permitted by law, MandaStrong Studio LLC shall not be liable for any indirect or consequential damages. AI-generated content is produced algorithmically — users are solely responsible for reviewing all outputs. A portion of revenue supports veterans' mental health and anti-bullying education.</p>
        </div>
      </div>
    </div>
  );
}

function P21() {
  const [msgs,setMsgs]=useState([{role:"assistant",content:"Ask me anything about your production."}]);
  const [inp,setInp]=useState("");const [loading,setLoading]=useState(false);
  const bot=useRef(null);
  const qs=["How do I export in 8K?","What AI tools do you have?","How does the timeline work?","Tell me about pricing"];
  useEffect(()=>{bot.current&&bot.current.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=async()=>{
    if(!inp.trim())return;const q=inp.trim();setInp("");setLoading(true);
    setMsgs(p=>[...p,{role:"user",content:q}]);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:"You are Agent Grok, the 24/7 AI assistant for MandaStrong Studio — a professional cinema AI platform with 600+ tools, 8K export, films up to 3 hours, subscription plans $20/$30/$50/mo including a 7-day free trial. Be helpful, professional, and concise.",messages:[...msgs.filter(m=>m.role!=="system"),{role:"user",content:q}]})});
      const d=await r.json();setMsgs(p=>[...p,{role:"assistant",content:d.content&&d.content[0]?d.content[0].text:"Let me help with that!"}]);
    }catch(e){setMsgs(p=>[...p,{role:"assistant",content:"Unable to connect — check API key in Bolt settings."}]);}
    setLoading(false);
  };
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{width:52,height:52,background:`linear-gradient(135deg,${GOLDDIM},${GOLD})`,borderRadius:0,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontFamily:"'Cinzel',serif",fontSize:26,fontWeight:900,color:"#000",boxShadow:`0 0 24px ${GOLD}88`}}>G</div>
          <h1 style={{...H1,fontSize:24}}>AGENT GROK</h1>
          <div style={{color:WHITE,fontSize:12,letterSpacing:4,fontWeight:700}}>24/7 PRODUCTION SUPPORT</div>
          <div style={{color:"#22c55e",fontSize:13,letterSpacing:3,marginTop:4,fontWeight:900}}>● ONLINE · BUILD 2026.03.21</div>
        </div>
        <div style={{...Card(),height:290,overflowY:"auto",marginBottom:10,display:"flex",flexDirection:"column",gap:8,padding:12}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{padding:"10px 14px",borderRadius:0,background:m.role==="user"?"rgba(245,197,24,0.08)":"rgba(26,82,118,0.2)",borderLeft:`2px solid ${m.role==="user"?GOLD:"#2980b9"}`}}>
              <span style={{fontSize:13,color:GOLD,display:"block",marginBottom:4,fontWeight:900,letterSpacing:2}}>{m.role==="user"?"YOU":"AGENT GROK"}</span>
              <span style={{color:WHITE,fontSize:14,lineHeight:1.7}}>{m.content}</span>
            </div>
          ))}
          {loading&&<div style={{padding:"10px 14px",background:"rgba(26,82,118,0.2)",borderLeft:"2px solid #2980b9",borderRadius:0,color:WHITE,fontSize:13}}>Agent Grok is thinking...</div>}
          <div ref={bot}/>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
          {qs.map(q=><button key={q} onClick={()=>setInp(q)} style={{...G("out",true),fontSize:11}}>{q}</button>)}
        </div>
        <div style={{display:"flex",gap:8}}>
          <textarea value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder="Ask Agent Grok anything about your production..."
            style={{flex:1,height:50,resize:"none",padding:"10px 12px",fontSize:14,background:"#000",border:`1px solid ${GOLDDIM}`,color:WHITE,borderRadius:0,outline:"none",lineHeight:1.5,fontFamily:"'Rajdhani',sans-serif"}}/>
          <button onClick={send} disabled={loading||!inp.trim()} style={{...G("gold",false),height:50,padding:"0 22px",opacity:loading||!inp.trim()?0.5:1,letterSpacing:2}}>SEND</button>
        </div>
      </div>
    </div>
  );
}

function P22() {
  const [posts,setPosts]=useState([{id:1,user:"Sarah J.",title:"Epic Action Feature",icon:"🎬",views:2847,likes:1522},{id:2,user:"Mike Chen",title:"Family Documentary",icon:"📽",views:1256,likes:812},{id:3,user:"Emily R.",title:"Short Film Entry",icon:"🏆",views:3421,likes:2156},{id:4,user:"Alex T.",title:"Music Video Cut",icon:"🎵",views:5234,likes:4012}]);
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:780,margin:"0 auto"}}>
        <div style={{fontSize:13,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>CREATOR NETWORK</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h1 style={{...H1,fontSize:28,margin:0}}>COMMUNITY HUB</h1>
          <button style={{...G("gold",false)}}>UPLOAD YOUR MOVIE</button>
        </div>
        {posts.map(p=>(
          <div key={p.id} style={{...Card(),marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:24}}>{p.icon}</span>
              <div>
                <div style={{color:GOLD,fontWeight:900,fontSize:14,letterSpacing:1}}>{p.title}</div>
                <div style={{color:WHITE,fontSize:12,fontWeight:600,letterSpacing:1}}>by {p.user}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{color:WHITE,fontSize:12,fontWeight:700}}>👁 {p.views.toLocaleString()}</span>
              <span style={{color:WHITE,fontSize:12,fontWeight:700}}>❤️ {p.likes.toLocaleString()}</span>
              <button onClick={()=>setPosts(ps=>ps.map(x=>x.id===p.id?{...x,likes:x.likes+1}:x))} style={{...G("out",true)}}>POST</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function P23({ go }) {
  const [guideOpen, setGuideOpen] = useState(false);
  return (
    <div style={{...Sp,padding:"26px 40px 80px"}}>
      <div style={{maxWidth:780,margin:"0 auto",textAlign:"center"}}>
        <h1 style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:"clamp(20px,3vw,28px)",fontWeight:900,letterSpacing:5,textShadow:`0 0 30px ${GOLD}99`,marginBottom:14}}>THAT'S ALL FOLKS</h1>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`,marginBottom:18}}/>
        <video autoPlay loop muted playsInline
          style={{width:"100%",aspectRatio:"16/9",background:"#000",border:`1px solid ${GOLDDIM}`,marginBottom:20,display:"block"}}>
          <source src="/background.mp4" type="video/mp4" />
          <source src="/thatsallfolks.mp4" type="video/mp4" />
          <source src="/ocean.mp4" type="video/mp4" />
        </video>
        <div onClick={() => setGuideOpen(g => !g)}
          style={{...Card(),marginBottom:guideOpen?0:16,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",border:`1px solid ${GOLD}`}}>
          <span style={{color:GOLD,fontWeight:900,fontSize:14,letterSpacing:3}}>📖 HOW TO USE GUIDE</span>
          <span style={{color:GOLD,fontSize:18}}>{guideOpen?"▲":"▼"}</span>
        </div>
        {guideOpen && (
          <div style={{...Card(),textAlign:"left",marginBottom:16,borderTop:"none"}}>
            {[["NAVIGATION","Use ☰ Quick Access menu or BACK/NEXT buttons to move between all 23 pages."],["PAGES 1-3","Home, Platform overview, and Example films. Upload your own films to the viewer slots."],["PAGE 4","Login, register for your 7-Day Free Trial, or browse as guest. Stripe handles all payments."],["PAGES 5-10","600+ AI Tools across 6 categories. Click any tool to open it, describe what you want, hit AI CREATE."],["PAGE 11","Upload your media — video, audio, images. Drag files in or click Browse."],["PAGE 12","Editor Suite hub — access all editing tools from one place."],["PAGE 13","Timeline Editor — drag your media onto tracks. Add extra tracks with + ADD TRACK."],["PAGE 14","Enhancement Studio — AI-powered video enhancement with sliders."],["PAGE 15","Audio Mixer — 4 channels: Music, Voice, EFX, Master."],["PAGE 16","Render Engine — choose quality (up to 8K) and format, then START RENDER."],["PAGE 17","Film Preview — watch your rendered film, use playback controls."],["PAGE 18","Export & Distribute — download or share to social media."],["PAGES 19-20","Tutorials and Terms of Service."],["PAGE 21","Agent Grok — your 24/7 AI assistant powered by Claude."],["PAGE 22","Community Hub — share your films with other creators."]].map(([t,d]) => (
              <div key={t} style={{borderBottom:`1px solid ${GOLDDIM}33`,paddingBottom:10,marginBottom:10}}>
                <div style={{color:GOLD,fontWeight:900,fontSize:13,letterSpacing:2,marginBottom:4}}>{t}</div>
                <div style={{color:WHITE,fontSize:13,lineHeight:1.7}}>{d}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{...Card(),textAlign:"left",marginBottom:16}}>
          <h2 style={{color:GOLD,fontWeight:900,fontSize:15,textAlign:"center",marginBottom:14,letterSpacing:3}}>✦ A SPECIAL THANK YOU ✦</h2>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9}}>Dear Creator,</p>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9}}>From the bottom of my heart — <strong style={{color:GOLD}}>thank you.</strong> Whether you're here to capture precious family memories, tell a story that's lived rent-free in your head for years, or simply explore what's possible when creativity meets technology, you chose to do it with MandaStrong Studio. That means everything.</p>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9}}>I built this platform because I believe that <strong style={{color:GOLD}}>storytelling should have no gatekeepers.</strong> You don't need a film school degree or a Hollywood budget. You just need a story worth telling — and now you have 600+ professional tools to help you tell it.</p>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9}}>Every subscription supports <strong style={{color:GOLD}}>veterans' mental health initiatives</strong> and <strong style={{color:GOLD}}>school anti-bullying programs</strong> — causes deeply personal to me as the author of <em>Doxy the School Bully.</em> A significant portion of all proceeds goes directly to these causes. When you create here, you're helping build a kinder world.</p>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9}}>Together, we are building a community of creators who use their talents to spread kindness, understanding, and hope.</p>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9}}>With gratitude and cinematic love,</p>
          <p style={{color:GOLD,fontWeight:900,fontSize:14,letterSpacing:2}}>— AMANDA STRONG</p>
          <p style={{color:WHITE,fontSize:12,letterSpacing:1}}>Founder, MandaStrong Studio · Author of Doxy the School Bully<br/>MandaStrong1.Etsy.com</p>
        </div>
        <div style={{...Card(),textAlign:"left",marginBottom:16}}>
          <h2 style={{color:GOLD,fontWeight:900,fontSize:12,letterSpacing:3,marginBottom:14}}>OUR MISSION</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{ic:"🎬",t:"EMPOWER CREATORS",d:"600+ AI tools making professional filmmaking accessible to everyone."},{ic:"🛡",t:"PROTECT THE YOUNG",d:"Most proceeds fund school anti-bullying programs, inspired by Doxy the School Bully."},{ic:"🏅",t:"SUPPORT VETERANS",d:"A major portion funds mental health services for veterans — because they deserve the best."},{ic:"🌐",t:"BUILD COMMUNITY",d:"The Creator Network connects filmmakers worldwide to share and grow."}].map(m=>(
              <div key={m.t} style={{background:"#000",border:`1px solid ${GOLDDIM}`,borderRadius:0,padding:12}}>
                <div style={{fontSize:18,marginBottom:5}}>{m.ic}</div>
                <div style={{color:GOLD,fontWeight:900,fontSize:12,letterSpacing:2,marginBottom:4}}>{m.t}</div>
                <div style={{color:WHITE,fontSize:12,lineHeight:1.7}}>{m.d}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>window.open("https://MandaStrong1.Etsy.com","_blank")} style={{...G("out",false)}}>VISIT ETSY STORE</button>
          <button onClick={()=>window.close()} style={{...G("gold",false)}}>EXIT APP</button>
        </div>
      </div>
    </div>
  );
}

const STOCK_VOICES = [
  { id:"aurora", name:"Aurora", desc:"Warm British Female", style:"Documentary · Narrator", accent:"British RP", pitch:1.0, rate:0.9 },
  { id:"marcus", name:"Marcus", desc:"Deep American Male", style:"Cinematic · Authoritative", accent:"American", pitch:0.85, rate:0.95 },
  { id:"sophia", name:"Sophia", desc:"Bright Australian Female", style:"Upbeat · Engaging", accent:"Australian", pitch:1.1, rate:1.05 },
  { id:"james", name:"James", desc:"Dry British Male", style:"Sarcastic · Witty", accent:"British", pitch:0.92, rate:0.88 },
  { id:"nova", name:"Nova", desc:"Neutral AI Female", style:"Clean · Professional", accent:"Neutral", pitch:1.05, rate:1.0 },
  { id:"river", name:"River", desc:"Warm American Male", style:"Friendly · Intimate", accent:"American South", pitch:0.95, rate:0.92 },
];

function P6Voice({ onSave }) {
  const [selVoice, setSelVoice] = useState("aurora");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [saved, setSaved] = useState(false);
  const [playing, setPlaying] = useState(null);
  const [search, setSearch] = useState("");
  const filtered = VOICE.filter(t => t.toLowerCase().includes(search.toLowerCase()));

  const speak = (voiceId, txt) => {
    if (!txt.trim()) return;
    const v = STOCK_VOICES.find(x => x.id === voiceId);
    if (!v) return;
    const utt = new SpeechSynthesisUtterance(txt);
    utt.pitch = v.pitch; utt.rate = v.rate;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(x => x.lang.startsWith("en"));
    if (match) utt.voice = match;
    setPlaying(voiceId);
    utt.onend = () => setPlaying(null);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  };

  const generateNarration = async () => {
    if (!text.trim()) return;
    setLoading(true); setResult(""); setSaved(false);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true" },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{ role:"user", content:`You are a professional narrator for MandaStrong Studio. The selected voice style is: ${STOCK_VOICES.find(x=>x.id===selVoice)?.style}. Take this text and format it as polished narration with natural pauses marked as [pause], emphasis marked as *word*, and breath marks as /. Make it sound cinematic and professional:\n\n${text}` }] })
      });
      const d = await res.json();
      const narration = d.content && d.content[0] ? d.content[0].text : text;
      setResult(narration);
      speak(selVoice, narration.replace(/\[pause\]|\*|\/|\n/g, " "));
    } catch(e) { setResult(text); speak(selVoice, text); }
    setLoading(false);
  };

  const saveToLibrary = () => {
    if (!result.trim()) return;
    const v = STOCK_VOICES.find(x => x.id === selVoice);
    if (onSave) onSave({ id:Date.now()+Math.random(), name:`Narration — ${v.name}`, type:"audio/narration", url:"", content:result });
    setSaved(true);
  };

  const inp = { width:"100%", background:"#000", border:`1px solid ${GOLDDIM}`, borderRadius:0, padding:"10px 12px", color:WHITE, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'Rajdhani',sans-serif" };

  return (
    <div style={{ ...Sp }}>
      <div style={{ padding:"14px 18px 12px", borderBottom:`1px solid ${GOLDDIM}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontSize:12, color:GOLD, letterSpacing:4, fontWeight:700 }}>AI WORKSTATION 02 — VOICE</div>
          <h1 style={{ ...H1, fontSize:24, margin:0 }}>VOICE TOOLS</h1>
        </div>
        <div style={{ position:"relative" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search voice tools..."
            style={{ background:"#000", border:`1px solid ${GOLDDIM}`, borderRadius:0, padding:"7px 12px 7px 28px", color:WHITE, fontSize:13, outline:"none", width:200 }} />
          <span style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:GOLD }}>🔍</span>
        </div>
      </div>

      <div style={{ padding:"16px 18px" }}>
        {/* STOCK VOICES */}
        <div style={{ color:GOLD, fontSize:12, letterSpacing:3, fontWeight:900, marginBottom:12 }}>SELECT VOICE</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:20 }}>
          {STOCK_VOICES.map(v => (
            <div key={v.id} onClick={() => setSelVoice(v.id)}
              style={{ background:"#000", border:`2px solid ${selVoice===v.id ? GOLD : GOLDDIM}`, padding:"12px 14px", cursor:"pointer", transition:"all .15s", boxShadow:selVoice===v.id?`0 0 16px ${GOLD}44`:"none" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                <div style={{ color:selVoice===v.id ? GOLD : WHITE, fontSize:15, fontWeight:900, letterSpacing:1 }}>{v.name}</div>
                <button onClick={e => { e.stopPropagation(); speak(v.id, `Hello, I'm ${v.name}. ${v.desc}. Ready to narrate your documentary.`); }}
                  style={{ background:selVoice===v.id?GOLDDIM:"#111", border:`1px solid ${GOLDDIM}`, color:GOLD, padding:"3px 10px", cursor:"pointer", fontSize:11, fontWeight:900, letterSpacing:1 }}>
                  {playing===v.id ? "⏹ STOP" : "▶ PLAY"}
                </button>
              </div>
              <div style={{ color:GOLD, fontSize:11, letterSpacing:1, marginBottom:3 }}>{v.desc}</div>
              <div style={{ color:WHITE, fontSize:10, letterSpacing:1 }}>{v.style} · {v.accent}</div>
            </div>
          ))}
        </div>

        {/* TEXT TO NARRATION */}
        <div style={{ ...Card(), marginBottom:16 }}>
          <div style={{ color:GOLD, fontSize:12, letterSpacing:3, fontWeight:900, marginBottom:10 }}>TEXT TO NARRATION / VOICEOVER</div>
          <div style={{ color:WHITE, fontSize:13, marginBottom:12 }}>
            Selected voice: <strong style={{ color:GOLD }}>{STOCK_VOICES.find(x=>x.id===selVoice)?.name}</strong> — {STOCK_VOICES.find(x=>x.id===selVoice)?.desc}
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste your script, dialogue, narration, or any text here... AI will format it for professional narration and speak it in the selected voice."
            style={{ ...inp, height:120, resize:"none", lineHeight:1.7, marginBottom:10 }} />
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={generateNarration} disabled={loading||!text.trim()}
              style={{ ...G("gold",false), flex:1, padding:"12px", opacity:loading||!text.trim()?0.5:1 }}>
              {loading ? "⟳ GENERATING..." : "▶ GENERATE & SPEAK"}
            </button>
            <button onClick={() => speak(selVoice, text)} disabled={!text.trim()}
              style={{ ...G("out",false), padding:"12px 20px", opacity:!text.trim()?0.5:1 }}>
              ▶ SPEAK NOW
            </button>
          </div>
        </div>

        {result && (
          <div style={{ ...Card(), marginBottom:16 }}>
            <div style={{ color:GOLD, fontSize:12, letterSpacing:3, fontWeight:900, marginBottom:8 }}>NARRATION OUTPUT</div>
            <textarea value={result} onChange={e => setResult(e.target.value)}
              style={{ ...inp, height:120, resize:"none", lineHeight:1.7, marginBottom:10 }} />
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => speak(selVoice, result.replace(/\[pause\]|\*|\/|\n/g," "))} style={{ ...G("out",false) }}>▶ PLAY NARRATION</button>
              <button onClick={() => window.speechSynthesis.cancel()} style={{ ...G("out",false) }}>⏹ STOP</button>
              <button onClick={saveToLibrary} style={{ ...G("gold",false) }}>SAVE TO MEDIA LIBRARY</button>
            </div>
            {saved && <div style={{ marginTop:12, background:"#0a2a0a", border:"1px solid #22c55e", padding:"10px 14px", color:"#22c55e", fontWeight:900, fontSize:13, letterSpacing:2 }}>✓ ASSET SAVED TO MEDIA LIBRARY</div>}
          </div>
        )}

        {/* REST OF VOICE TOOLS */}
        <div style={{ color:GOLD, fontSize:12, letterSpacing:3, fontWeight:900, marginBottom:10, marginTop:8 }}>ALL VOICE TOOLS</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
          {filtered.map(t => <ToolCard key={t} name={t} onOpen={n => {
            if(n==="Text to Narration"||n==="Text to Voiceover"||n==="Text to Speech"||n==="Text to Voice") {
              window.scrollTo(0,0);
            }
          }} />)}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page,setPage]=useState(1);
  const [menu,setMenu]=useState(false);
  const [user,setUser]=useState({name:"Guest",plan:"Guest",isAdmin:false});
  const [mediaLib,setMediaLib]=useState([]);
  const [timeline,setTimeline]=useState({});
  const [rendered,setRendered]=useState(null);
  const go=p=>{setPage(p);window.scrollTo(0,0);};
  const save=a=>setMediaLib(p=>[...p,a]);
  const pages={
    1:<P1 go={go}/>,2:<P2 go={go}/>,3:<P3/>,4:<P4 go={go} setUser={setUser}/>,
    5:<ToolPage title="WRITING TOOLS" subtitle="AI WORKSTATION 01 — WRITING" tools={WRITING} onSave={save}/>,
    6:<P6Voice onSave={save}/>,
    7:<ToolPage title="IMAGE TOOLS" subtitle="AI WORKSTATION 03 — IMAGE" tools={IMAGE_T} onSave={save}/>,
    8:<ToolPage title="VIDEO TOOLS" subtitle="AI WORKSTATION 04 — VIDEO" tools={VIDEO_T} onSave={save}/>,
    9:<ToolPage title="MOTION & VFX" subtitle="AI WORKSTATION 05 — MOTION" tools={MOTION} onSave={save}/>,
    10:<ToolPage title="ENHANCEMENT STUDIO" subtitle="AI WORKSTATION 06 — ENHANCE" tools={MOTION} onSave={save}/>,
    11:<P11 mediaLib={mediaLib} setMediaLib={setMediaLib}/>,
    12:<P12 go={go} mediaLib={mediaLib}/>,
    13:<P13 go={go} mediaLib={mediaLib} timeline={timeline} setTimeline={setTimeline}/>,
    14:<P14/>,15:<P15/>,
    16:<P16 go={go} timeline={timeline} setRendered={setRendered}/>,
    17:<P17 go={go} rendered={rendered} mediaLib={mediaLib}/>,
    18:<P18 rendered={rendered} mediaLib={mediaLib}/>,
    19:<P19/>,20:<P20/>,21:<P21/>,22:<P22/>,23:<P23 go={go}/>,
  };
  return (
    <div style={{background:"#000",minHeight:"100vh",fontFamily:"'Rajdhani',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Rajdhani:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      <Header go={go} setMenu={setMenu}/>
      {menu&&<QAMenu go={go} onClose={()=>setMenu(false)} user={user}/>}
      <div style={{minHeight:"calc(100vh - 116px)"}}>{pages[page]||<P1 go={go}/>}</div>
      <Footer page={page} go={go}/>
    </div>
  );
}
