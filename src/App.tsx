import { useState, useRef, useEffect } from "react";

const GOLD = "#e8c96d";
const GOLDDIM = "#a07820";
const BG = "#000000";
const BG4 = "#080808";
const WHITE = "#d4c9a8";
const DIM = "#aaaaaa";
const TOTAL = 23;

const STRIPE = {
  basic: "https://buy.stripe.com/test_basic",
  pro: "https://buy.stripe.com/test_pro",
  studio: "https://buy.stripe.com/test_studio",
};

const G = (v, sm) => ({
  background: v === "gold" ? `linear-gradient(135deg,${GOLDDIM},${GOLD})` : "transparent",
  border: v === "gold" ? "none" : `1px solid ${GOLD}`,
  color: v === "gold" ? "#000" : GOLD,
  borderRadius: 0,
  fontWeight: 900,
  padding: sm ? "5px 14px" : "10px 26px",
  fontSize: sm ? 11 : 13,
  cursor: "pointer",
  letterSpacing: 2,
  textTransform: "uppercase",
  fontFamily: "'Rajdhani',sans-serif",
});

const Sp = { minHeight: "100vh", background: BG, color: WHITE, fontFamily: "'Rajdhani',sans-serif", paddingBottom: 100 };
const H1 = { fontFamily: "'Cinzel',serif", color: GOLD, letterSpacing: 5, textTransform: "uppercase", margin: 0 };
const Card = (x) => ({ background: "#0a0a0a", border: `1px solid ${GOLDDIM}`, borderRadius: 0, padding: 18, ...(x || {}) });

const STOCK_VOICES = [
  { id: "aurora", name: "Aurora", desc: "Warm British Female", style: "Documentary · Narrator", accent: "British RP" },
  { id: "marcus", name: "Marcus", desc: "Deep American Male", style: "Cinematic · Authoritative", accent: "American" },
  { id: "sophia", name: "Sophia", desc: "Bright Australian Female", style: "Upbeat · Engaging", accent: "Australian" },
  { id: "james", name: "James", desc: "Dry British Male", style: "Sarcastic · Witty", accent: "British" },
  { id: "nova", name: "Nova", desc: "Neutral AI Female", style: "Clean · Professional", accent: "Neutral" },
  { id: "river", name: "River", desc: "Warm American Male", style: "Friendly · Intimate", accent: "American South" },
];

const VOICE_TOOLS = [
  "Upload Own Voice", "Record My Voice", "Clone My Voice", "Text to Voice", "Text to Speech", "Text to Narration",
  "Text to Audiobook", "Text to Voiceover", "Voice Cloning", "Voice to Voice", "AI Voice Actor", "Neural Voice Generator",
  "Emotion Voice Synth", "Trailer Voice Generator", "Documentary Voice", "Commercial Voice", "Character Voice Creator",
  "Accent Generator", "Multi Language Voice", "Voice Translator", "Lip Sync AI", "Dialogue Synth", "Audiobook Creator",
  "Podcast Voice", "Radio DJ Voice", "Sports Commentary Voice", "ASMR Creator", "Whisper Generator", "Meditation Voice",
  "Alien Voice", "Deep Voice Generator", "Robot Voice", "Monster Voice", "Child Voice", "Elderly Voice",
  "Male to Female Voice", "Female to Male Voice", "Speed Controller", "Tone Adjuster", "Pitch Controller",
  "Volume Normalizer", "Clarity Booster", "Voice Denoiser", "Echo Remover", "Reverb Remover", "Background Noise Remover",
  "Voice EQ Studio"
];

const WRITING = [
  "Script to Movie", "Text to Script", "Script to Screenplay", "Prompt to Story", "Story to Script", "Feature Film Script",
  "Short Film Script", "TV Pilot Script", "Documentary Script", "Commercial Script", "YouTube Script", "Podcast Script",
  "Social Media Script", "Explainer Script", "Plot Generator", "Story Outline", "Three Act Structure", "Five Act Structure",
  "Beat Sheet Builder", "Character Bio Writer", "Character Arc Builder", "Subplot Generator", "Plot Twist Generator",
  "Opening Hook Creator", "Climax Designer", "Logline Generator", "Synopsis Writer", "Treatment Writer", "Scene Writer",
  "Text to Dialogue", "Dialogue Generator", "Narration Writer", "Voiceover Script", "Interview Script", "Action Line Writer",
  "Scene Heading Tool", "Parenthetical Generator", "Script Formatter", "Dialogue Tightener", "Script Timer", "Word Counter",
  "Page Counter", "Reading Time Estimator", "Format Checker", "Grammar Polish", "Spell Checker", "Continuity Checker",
  "Plot Hole Detector", "Tone Checker", "Genre Classifier"
];

const IMAGE_T = [
  "Text to Image", "Prompt to Image", "Image to Image", "Image Upscaler", "Image Generator", "AI Art Generator",
  "Photo to Painting", "Sketch to Image", "Wireframe to Image", "Background Generator", "Background Remover",
  "Sky Replacer", "Object Remover", "Face Generator", "Character Design", "Portrait Generator", "Avatar Creator",
  "Product Image Generator", "Architecture Visualizer", "Interior Design Generator", "Landscape Generator",
  "Abstract Art Generator", "Logo Generator", "Icon Creator", "Texture Generator", "Pattern Maker",
  "Color Palette Generator", "Style Transfer", "Photo Enhancer", "Photo Restorer", "Old Photo Colorizer",
  "Black & White to Color", "Image Denoiser", "Sharpness Enhancer", "Clarity Booster", "Detail Enhancer",
  "HDR Image Creator", "Exposure Fixer", "White Balance AI", "Color Grading Studio", "LUT Creator", "Tone Mapper",
  "Contrast Adjuster", "Brightness Tool", "Saturation Engine", "Hue Shift", "Temperature Control", "Vignette Tool"
];

const VIDEO_T = [
  "Text to Video", "Image to Video", "Video to Video", "AI Video Creator", "AI Film Generator", "Video Upscaler",
  "AI Video Generator 4K", "Set to Video", "Video Colorizer", "Color Grading Pro", "Fast Look Generator",
  "Film Restoration", "Time Lapse Creator", "Video Trimmer", "Background Remover", "Digital Human Video",
  "Rotoscope Video", "Animation Creator", "Puppet Animator", "Motion Capture", "Character Animator",
  "Video Stabilizer", "Video Compressor", "Cinematic LUT", "Black & White Film", "Film Texture", "VHS Effect",
  "Glitch Effect", "Quick Film Creator", "Opening Slate", "Time Freeze", "Bullet Time Effect", "Rain Simulation",
  "Snow Simulation", "Smoke Generator", "Fire Simulation", "Particle System", "AI Progressive Video", "4K Upscaling"
];

const MOTION = [
  "AI 8K Upscaling", "AI 4K Upscaling", "Video Super Resolution", "Frame Interpolation", "Video Denoiser",
  "Noise Reduction", "Grain Remover", "Artifact Remover", "Scratch Remover", "Video Sharpener", "Clarity Booster",
  "Detail Enhancer", "Edge Enhancement", "Texture Boost", "White Balance AI", "Color Correction", "Auto Color Balance",
  "Color Match Pro", "Color Grading AI", "Cinematic Color Grade", "Film Stock Emulation", "LUT Generator",
  "Tone Mapping Pro", "HDR Enhancement", "Deep HDR Boost", "Dynamic Range Expansion", "Shadow Recovery",
  "Highlight Recovery", "Black Point Calibration", "Gamma Correction", "Contrast Enhancer", "Brightness Optimizer",
  "Saturation Booster", "Smart Saturation", "Face Enhancement", "Face Retouch", "Eye Enhancer", "Teeth Whitener",
  "Skin Tone Enhancer", "Background Enhancer", "Sky Enhancer", "Landscape Enhancer", "Night Video Enhancer",
  "Low Light Clarity", "Motion Stabilization", "Shake Remover", "Rolling Shutter Fix"
];

const NAV = [
  {p:1,l:"Home"},{p:2,l:"Platform"},{p:3,l:"Examples"},{p:4,l:"Login / Pricing"},{p:5,l:"Writing Tools"},
  {p:6,l:"Voice Tools"},{p:7,l:"Image Tools"},{p:8,l:"Video Tools"},{p:9,l:"Motion & VFX"},{p:10,l:"Enhancement"},
  {p:11,l:"Upload Media"},{p:12,l:"Editor Suite"},{p:13,l:"Timeline Editor"},{p:14,l:"Enhancement Studio"},
  {p:15,l:"Audio Mixer"},{p:16,l:"Render Engine"},{p:17,l:"Film Preview"},{p:18,l:"Export & Distribute"},
  {p:19,l:"Tutorials"},{p:20,l:"Terms & Disclaimer"},{p:21,l:"Agent Grok"},{p:22,l:"Community Hub"},
  {p:23,l:"That's All Folks"}
];

let VOICE_ASSIGNMENTS = {};
try { VOICE_ASSIGNMENTS = JSON.parse(localStorage.getItem("ms_voice_assign") || "{}"); } catch {}

let currentUtterance = null;

function speakText(voiceId, txt, onStart, onEnd) {
  if (!txt || !txt.trim()) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
  const clean = txt.replace(/\[pause\]/g, ". ").replace(/[*\/]/g, " ").slice(0, 5000);
  const doSpeak = () => {
    const allVoices = window.speechSynthesis.getVoices();
    const utt = new SpeechSynthesisUtterance(clean);
    utt.pitch = 1.0; utt.rate = 0.9;
    const assignedName = VOICE_ASSIGNMENTS[voiceId];
    let picked = assignedName ? allVoices.find(v => v.name === assignedName) : null;
    if (!picked) {
      const isMale = ["james","marcus","river"].includes(voiceId);
      const femalePat = /samantha|zira|victoria|moira|karen|susan|lisa|fiona|serena|tessa|heather|hazel|allison|ava|nora|siri|female/i;
      const malePat = /david|daniel|oliver|arthur|george|harry|lee|ryan|eric|reed|liam|aaron|rishi|wayne|brian|derek|steven|alan|albert|andy|tom|bruce|fred|mark|paul|peter|john|james|gordon|alex|eddy|bobby|ralph|male/i;
      if (isMale) {
        picked = allVoices.find(x=>malePat.test(x.name))
              || allVoices.find(x=>x.lang==="en-GB"&&!femalePat.test(x.name))
              || allVoices.find(x=>x.lang.startsWith("en")&&!femalePat.test(x.name))
              || allVoices[0];
      } else {
        picked = voiceId==="aurora" ? (allVoices.find(x=>/kate|serena|emily/i.test(x.name))||allVoices.find(x=>x.lang==="en-GB"))
               : voiceId==="sophia" ? (allVoices.find(x=>/karen/i.test(x.name))||allVoices.find(x=>x.lang==="en-AU"))
               : allVoices.find(x=>/samantha|victoria|zira/i.test(x.name));
        picked = picked||allVoices.find(x=>x.lang.startsWith("en"))||allVoices[0];
      }
    }
    if (picked) utt.voice = picked;
    currentUtterance = utt;
    if (onStart) onStart();
    utt.onend = () => { currentUtterance = null; if (onEnd) onEnd(); };
    utt.onerror = () => { currentUtterance = null; if (onEnd) onEnd(); };
    window.speechSynthesis.speak(utt);
  };
  if (window.speechSynthesis.getVoices().length > 0) doSpeak();
  else window.speechSynthesis.onvoiceschanged = doSpeak;
}

function stopSpeaking() {
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

function QAMenu({ go, onClose, user }) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex"}}>
      <div style={{width:256,background:"#050505",borderRight:`1px solid ${GOLD}`,height:"100vh",overflowY:"auto",padding:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <span style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:13,fontWeight:900,letterSpacing:3}}>QUICK ACCESS</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:GOLD,fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{background:`linear-gradient(135deg,${GOLDDIM},${GOLD})`,padding:"9px 12px",marginBottom:10,textAlign:"center"}}>
          <div style={{color:"#000",fontWeight:900,fontSize:10,letterSpacing:3,fontFamily:"'Cinzel',serif"}}>MANDA STRONG STUDIO</div>
        </div>
        {user&&user.plan&&<div style={{background:"#0a0a0a",border:`1px solid ${GOLDDIM}`,padding:"7px 10px",marginBottom:14,textAlign:"center"}}>
          <div style={{color:DIM,fontSize:9,letterSpacing:2}}>PLAN</div>
          <div style={{color:GOLD,fontWeight:900,fontSize:14,fontFamily:"'Cinzel',serif"}}>{user.plan}</div>
        </div>}
        {NAV.map(i=>(
          <button key={i.p} onClick={()=>{go(i.p);onClose();}}
            style={{width:"100%",textAlign:"left",background:"none",border:"none",color:WHITE,padding:"8px",cursor:"pointer",fontSize:13,fontWeight:700,display:"block",marginBottom:1,letterSpacing:1}}
            onMouseEnter={e=>{e.currentTarget.style.background=BG4;e.currentTarget.style.color=GOLD;}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=WHITE;}}>
            {String(i.p).padStart(2,"0")} &nbsp; {i.l.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{flex:1,background:"rgba(0,0,0,0.75)"}} onClick={onClose}/>
    </div>
  );
}

function Header({ go, setMenu }) {
  return (
    <header style={{position:"sticky",top:0,zIndex:500,background:"#000",borderBottom:`1px solid ${GOLD}`,padding:"0 16px",height:52,display:"flex",alignItems:"center",gap:12}}>
      <button onClick={()=>setMenu(true)} style={{background:"none",border:`1px solid ${GOLD}`,color:GOLD,width:34,height:34,cursor:"pointer",fontSize:16,flexShrink:0}}>☰</button>
      <div onClick={()=>go(1)} style={{cursor:"pointer",flexShrink:0}}>
        <div style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:13,fontWeight:900,letterSpacing:3,lineHeight:1,textShadow:`0 0 16px ${GOLD}99`}}>MANDA STRONG</div>
        <div style={{fontFamily:"'Cinzel',serif",color:GOLDDIM,fontSize:9,letterSpacing:4}}>STUDIO</div>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{color:GOLD,fontSize:11,letterSpacing:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontWeight:700}}>
          ✦ CINEMA INTELLIGENCE PLATFORM &nbsp;·&nbsp; 600+ AI TOOLS &nbsp;·&nbsp; 8K EXPORT &nbsp;·&nbsp; UP TO 3-HOUR FILMS
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <div style={{color:"#22c55e",fontSize:11,letterSpacing:2,fontWeight:900}}>● SYSTEM ONLINE</div>
        <div onClick={()=>go(21)} style={{width:36,height:36,background:`linear-gradient(135deg,${GOLDDIM},${GOLD})`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:19,fontWeight:900,color:"#000",boxShadow:`0 0 18px ${GOLD}77`}}>G</div>
      </div>
    </header>
  );
}

function Footer({ page, go, onSave }) {
  return (
    <footer style={{position:"fixed",bottom:0,left:0,right:0,zIndex:400,background:"#000",borderTop:`1px solid ${GOLD}`,padding:"6px 20px 8px",display:"flex",flexDirection:"column",gap:4}}>
      <div style={{textAlign:"center"}}>
        <span style={{color:GOLD,fontSize:11,letterSpacing:1,fontWeight:700}}>MANDASTRONG STUDIO 2026 · PROFESSIONAL CINEMA SYNTHESIS · MandaStrong1.Etsy.com</span>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14}}>
        <button onClick={()=>go(Math.max(1,page-1))} disabled={page===1} style={{...G("out",true),opacity:page===1?0.3:1}}>◀ BACK</button>
        <span style={{color:GOLD,fontSize:11,fontWeight:900,fontFamily:"'Cinzel',serif",letterSpacing:2}}>PAGE {page} / {TOTAL}</span>
        <button onClick={()=>go(Math.min(TOTAL,page+1))} disabled={page===TOTAL} style={{...G("gold",true),opacity:page===TOTAL?0.3:1}}>NEXT ▶</button>
        <button onClick={onSave} style={{...G("out",true),fontSize:11,letterSpacing:2}}>💾 SAVE PROJECT</button>
        <span style={{color:"#22c55e",fontSize:11,fontWeight:700}}>● AUTOSAVE ON</span>
      </div>
    </footer>
  );
}

function ToolCard({ name, onOpen }) {
  return (
    <div onClick={()=>onOpen(name)}
      style={{background:"#000",border:`1px solid ${GOLDDIM}`,padding:"14px 12px",cursor:"pointer",transition:"all .15s",minHeight:56,display:"flex",alignItems:"center"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.background=BG4;e.currentTarget.style.boxShadow=`0 0 10px ${GOLD}44`;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=GOLDDIM;e.currentTarget.style.background="#000";e.currentTarget.style.boxShadow="none";}}>
      <div style={{color:WHITE,fontSize:13,fontWeight:800,lineHeight:1.3,letterSpacing:.5}}>{name}</div>
    </div>
  );
}

function ToolPanel({ tool, onClose, onSave }) {
  const isVoice = VOICE_TOOLS.includes(tool);
  const [mode, setMode] = useState(isVoice ? "voice" : "ai");
  const [describe, setDescribe] = useState("");
  const [result, setResult] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [playing, setPlaying] = useState(null);
  const fileRef = useRef(null);
  const [selVoice, setSelVoice] = useState("james");

  const inp = {width:"100%",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"9px 12px",color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif"};

  const speak = (vid, txt) => speakText(vid, txt, ()=>setPlaying(vid), ()=>setPlaying(null));

  const runAI = async () => {
    if (!describe.trim()) return;
    setLoading(true); setSaved(false); setResult("");
    try {
      let prompt = "";
      if (isVoice) {
        prompt = `Format this as cinematic narration, voice style: ${STOCK_VOICES.find(x=>x.id===selVoice)?.style}. Mark pauses as [pause] and emphasis as *word*:\n\n${describe}`;
      } else {
        prompt = `You are a professional at MandaStrong Studio. Tool: "${tool}".\n\nUser request: ${describe}\n\nGenerate complete, detailed, professional content.`;
      }
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "anthropic-dangerous-direct-browser-access":"true"
        },
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,
          messages:[{role:"user",content:prompt}]})
      });
      const d = await res.json();
      const txt = d.content&&d.content[0]?d.content[0].text:"Generated!";
      setResult(txt);
      if (isVoice) speak(selVoice, txt);
    } catch(e) { setResult("Error — check API key in Bolt settings."); }
    setLoading(false);
  };

  const saveAsset = () => {
    const content = result||describe;
    if (!content.trim()) return;
    if (onSave) onSave({id:Date.now()+Math.random(),name:`${tool} — ${isVoice?STOCK_VOICES.find(x=>x.id===selVoice)?.name:"Result"}`,type:isVoice?"audio/narration":"text/plain",url:"",content});
    setSaved(true);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:900,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"min(600px,95vw)",background:"#050505",border:`1px solid ${GOLD}`,padding:26,maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h2 style={{...H1,fontSize:16,margin:0,letterSpacing:4}}>{tool}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:GOLD,fontSize:20,cursor:"pointer"}}>✕</button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:20}}>
          <button onClick={()=>setMode("upload")} style={{...G(mode==="upload"?"gold":"out",true),fontSize:11}}>UPLOAD</button>
          <button onClick={()=>setMode("paste")} style={{...G(mode==="paste"?"gold":"out",true),fontSize:11}}>PASTE</button>
          <button onClick={()=>setMode("ai")} style={{...G(mode==="ai"?"gold":"out",true),fontSize:11}}>PROMPT</button>
          <button onClick={()=>setMode("ai")} style={{...G(mode==="ai"?"gold":"out",true),fontSize:11}}>TIMELINE</button>
          <button onClick={saveAsset} style={{...G("gold",true),fontSize:11}}>SAVE</button>
          <button onClick={runAI} disabled={loading} style={{...G("gold",true),fontSize:11,opacity:loading?0.6:1}}>AI ✦</button>
        </div>

        {mode==="voice"&&isVoice&&(
          <div>
            <div style={{color:GOLD,fontSize:12,letterSpacing:3,fontWeight:900,marginBottom:10}}>SELECT VOICE</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
              {STOCK_VOICES.map(v=>(
                <div key={v.id} onClick={()=>setSelVoice(v.id)}
                  style={{background:"#000",border:`2px solid ${selVoice===v.id?GOLD:GOLDDIM}`,padding:"10px 12px",cursor:"pointer",boxShadow:selVoice===v.id?`0 0 12px ${GOLD}44`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{color:selVoice===v.id?GOLD:WHITE,fontSize:14,fontWeight:900}}>{v.name}</span>
                    <button onClick={e=>{e.stopPropagation();speak(v.id,`Hi I am ${v.name}. ${v.desc}. Ready to narrate.`);}}
                      style={{background:"none",border:`1px solid ${GOLDDIM}`,color:GOLD,padding:"2px 8px",cursor:"pointer",fontSize:10,fontWeight:900}}>
                      {playing===v.id?"⏹":"▶"}
                    </button>
                  </div>
                  <div style={{color:GOLD,fontSize:11}}>{v.desc}</div>
                  <div style={{color:WHITE,fontSize:10,marginTop:2}}>{v.style} · {v.accent}</div>
                </div>
              ))}
            </div>
            <textarea value={describe} onChange={e=>setDescribe(e.target.value)} placeholder="Paste your narration text here..."
              style={{...inp,height:110,resize:"none",lineHeight:1.7,marginBottom:10}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:result?14:0}}>
              <button onClick={runAI} disabled={loading||!describe.trim()} style={{...G("gold",false),padding:"12px",opacity:loading||!describe.trim()?0.5:1}}>
                {loading?"⟳ GENERATING...":"AI FORMAT & SPEAK ✦"}
              </button