// @ts-nocheck
import { useState, useRef, useEffect } from "react";

// IndexedDB helpers for persistent clip storage
const DB_NAME="mandastrong_db",DB_VER=1,STORE="clips";
const openDB=()=>new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,DB_VER);r.onupgradeneeded=e=>e.target.result.createObjectStore(STORE,{keyPath:"id"});r.onsuccess=e=>res(e.target.result);r.onerror=rej;});
const saveClipToDB=async(id,blob,name,type)=>{try{const db=await openDB();const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put({id,blob,name,type});await new Promise((r,j)=>{tx.oncomplete=r;tx.onerror=j;});}catch(e){console.warn("DB save failed",e);}};
const loadClipFromDB=async(id)=>{try{const db=await openDB();return new Promise((res,rej)=>{const tx=db.transaction(STORE,"readonly");const req=tx.objectStore(STORE).get(id);req.onsuccess=()=>res(req.result);req.onerror=rej;});}catch(e){return null;}};
const getAllClipsFromDB=async()=>{try{const db=await openDB();return new Promise((res,rej)=>{const tx=db.transaction(STORE,"readonly");const req=tx.objectStore(STORE).getAll();req.onsuccess=()=>res(req.result||[]);req.onerror=rej;});}catch(e){return[];}};

const GOLD = "#e8c96d";
const GOLDDIM = "#a07820";
const BG = "#000000";
const BLACK = "#000000";
const BG4 = "#080808";
const WHITE = "#d4c9a8";
const DIM = "#aaaaaa";
const TOTAL = 23;

const STRIPE = {
  basic:"https://buy.stripe.com/4gM5kFaVYfjN7EX0vMafS00",
  pro:"https://buy.stripe.com/14A00l8NQ0oTbVd3HYafS01",
  studio:"https://buy.stripe.com/fZubJ35BE3B53oHdiyafS02",
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
const Sp = { minHeight:"100vh", background:BG, color:WHITE, fontFamily:"'Rajdhani',sans-serif", paddingBottom:160, width:"100%", overflowX:"hidden" };
const H1 = { fontFamily:"'Cinzel',serif", color:GOLD, letterSpacing:5, textTransform:"uppercase", margin:0, fontSize:"clamp(16px,3vw,32px)" };
const Card = (x) => ({ background:"#0a0a0a", border:`1px solid ${GOLDDIM}`, borderRadius:0, padding:18, ...(x||{}) });

const STOCK_VOICES = [
  { id:"aurora", name:"Aurora", desc:"Warm British Female", style:"Documentary · Narrator", accent:"British RP" },
  { id:"marcus", name:"Marcus", desc:"Deep American Male", style:"Cinematic · Authoritative", accent:"American" },
  { id:"sophia", name:"Sophia", desc:"Bright Australian Female", style:"Upbeat · Engaging", accent:"Australian" },
  { id:"james",  name:"James",  desc:"Dry British Male", style:"Sarcastic · Witty", accent:"British" },
  { id:"nova",   name:"Nova",   desc:"Neutral AI Female", style:"Clean · Professional", accent:"Neutral" },
  { id:"river",  name:"River",  desc:"Warm American Male", style:"Friendly · Intimate", accent:"American South" },
];

const VOICE_TOOLS = ["Text to Voice","Text to Speech","Text to Narration","Text to Audiobook","Text to Voiceover","AI Voice Actor","Neural Voice Generator","Emotion Voice Synth","Documentary Voice","Trailer Voice Generator","Commercial Voice","Character Voice Creator","Audiobook Creator","Podcast Voice"];

let VOICE_ASSIGNMENTS = {};
const loadVoiceAssignments = () => {
  try { VOICE_ASSIGNMENTS = JSON.parse(localStorage.getItem("ms_voice_assign")||"{}"); } catch{}
};
if (typeof window !== "undefined") loadVoiceAssignments();

let currentUtterance = null;

function speakText(voiceId, txt, onStart, onEnd) {
  if (!txt||!txt.trim()) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
  const clean = txt.replace(/\[pause\]/g,". ").replace(/[*\/]/g," ").slice(0,5000);
  const doSpeak = () => {
    const allVoices = window.speechSynthesis.getVoices();
    const utt = new SpeechSynthesisUtterance(clean);
    utt.pitch = 1.0; utt.rate = 0.9;
    const assignedName = VOICE_ASSIGNMENTS[voiceId];
    let picked = assignedName ? allVoices.find(v=>v.name===assignedName) : null;
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
    utt.onend=()=>{ currentUtterance=null; if(onEnd)onEnd(); };
    utt.onerror=()=>{ currentUtterance=null; if(onEnd)onEnd(); };
    window.speechSynthesis.speak(utt);
  };
  if (window.speechSynthesis.getVoices().length>0){doSpeak();}
  else{window.speechSynthesis.onvoiceschanged=()=>{doSpeak();};}
}

function stopSpeaking() {
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

const WRITING = ["Script to Movie","Text to Script","Script to Screenplay","Prompt to Story","Story to Script","Feature Film Script","Short Film Script","TV Pilot Script","Documentary Script","Commercial Script","YouTube Script","Podcast Script","Social Media Script","Explainer Script","Plot Generator","Story Outline","Three Act Structure","Five Act Structure","Beat Sheet Builder","Character Bio Writer","Character Arc Builder","Subplot Generator","Plot Twist Generator","Opening Hook Creator","Climax Designer","Logline Generator","Synopsis Writer","Treatment Writer","Scene Writer","Text to Dialogue","Dialogue Generator","Narration Writer","Voiceover Script","Interview Script","Action Line Writer","Scene Heading Tool","Parenthetical Generator","Script Formatter","Dialogue Tightener","Script Timer","Word Counter","Page Counter","Reading Time Estimator","Format Checker","Grammar Polish","Spell Checker","Continuity Checker","Plot Hole Detector","Tone Checker","Genre Classifier"];
const VOICE = ["Upload Own Voice","Record My Voice","Clone My Voice","Text to Voice","Text to Speech","Text to Narration","Text to Audiobook","Text to Voiceover","Voice Cloning","Voice to Voice","AI Voice Actor","Neural Voice Generator","Emotion Voice Synth","Trailer Voice Generator","Documentary Voice","Commercial Voice","Character Voice Creator","Accent Generator","Multi Language Voice","Voice Translator","Lip Sync AI","Dialogue Synth","Audiobook Creator","Podcast Voice","Radio DJ Voice","Sports Commentary Voice","ASMR Creator","Whisper Generator","Meditation Voice","Alien Voice","Deep Voice Generator","Robot Voice","Monster Voice","Child Voice","Elderly Voice","Male to Female Voice","Female to Male Voice","Speed Controller","Tone Adjuster","Pitch Controller","Volume Normalizer","Clarity Booster","Voice Denoiser","Echo Remover","Reverb Remover","Background Noise Remover","Voice EQ Studio"];
const IMAGE_T = ["Text to Image","Prompt to Image","Image to Image","Image Upscaler","Image Generator","AI Art Generator","Photo to Painting","Sketch to Image","Wireframe to Image","Background Generator","Background Remover","Sky Replacer","Object Remover","Face Generator","Character Design","Portrait Generator","Avatar Creator","Product Image Generator","Architecture Visualizer","Interior Design Generator","Landscape Generator","Abstract Art Generator","Logo Generator","Icon Creator","Texture Generator","Pattern Maker","Color Palette Generator","Style Transfer","Photo Enhancer","Photo Restorer","Old Photo Colorizer","Black & White to Color","Image Denoiser","Sharpness Enhancer","Clarity Booster","Detail Enhancer","HDR Image Creator","Exposure Fixer","White Balance AI","Color Grading Studio","LUT Creator","Tone Mapper","Contrast Adjuster","Brightness Tool","Saturation Engine","Hue Shift","Temperature Control","Vignette Tool"];
const VIDEO_T = ["Text to Video","Image to Video","Video to Video","AI Video Creator","AI Film Generator","Video Upscaler","AI Video Generator 4K","Set to Video","Video Colorizer","Color Grading Pro","Fast Look Generator","Film Restoration","Time Lapse Creator","Video Trimmer","Background Remover","Digital Human Video","Rotoscope Video","Animation Creator","Puppet Animator","Motion Capture","Character Animator","Video Stabilizer","Video Compressor","Cinematic LUT","Black & White Film","Film Texture","VHS Effect","Glitch Effect","Quick Film Creator","Opening Slate","Time Freeze","Bullet Time Effect","Rain Simulation","Snow Simulation","Smoke Generator","Fire Simulation","Particle System","AI Progressive Video","4K Upscaling"];
const MOTION = ["AI 8K Upscaling","AI 4K Upscaling","Video Super Resolution","Frame Interpolation","Video Denoiser","Noise Reduction","Grain Remover","Artifact Remover","Scratch Remover","Video Sharpener","Clarity Booster","Detail Enhancer","Edge Enhancement","Texture Boost","White Balance AI","Color Correction","Auto Color Balance","Color Match Pro","Color Grading AI","Cinematic Color Grade","Film Stock Emulation","LUT Generator","Tone Mapping Pro","HDR Enhancement","Deep HDR Boost","Dynamic Range Expansion","Shadow Recovery","Highlight Recovery","Black Point Calibration","Gamma Correction","Contrast Enhancer","Brightness Optimizer","Saturation Booster","Smart Saturation","Face Enhancement","Face Retouch","Eye Enhancer","Teeth Whitener","Skin Tone Enhancer","Background Enhancer","Sky Enhancer","Landscape Enhancer","Night Video Enhancer","Low Light Clarity","Motion Stabilization","Shake Remover","Rolling Shutter Fix"];

const NAV = [{p:1,l:"Home"},{p:2,l:"Platform"},{p:3,l:"Examples"},{p:4,l:"Login / Pricing"},{p:5,l:"Writing Tools"},{p:6,l:"Voice Tools"},{p:7,l:"Image Tools"},{p:8,l:"Video Generator"},{p:9,l:"Motion & VFX"},{p:10,l:"Enhancement"},{p:11,l:"Upload Media"},{p:12,l:"Editor Suite"},{p:13,l:"Timeline Editor"},{p:14,l:"Enhancement Studio"},{p:15,l:"Audio Mixer"},{p:16,l:"Render Engine"},{p:17,l:"Film Preview"},{p:18,l:"Export & Distribute"},{p:19,l:"Tutorials"},{p:20,l:"Terms & Disclaimer"},{p:21,l:"Agent Grok"},{p:22,l:"Community Hub"},{p:23,l:"That's All Folks"}];

function ProjectHistoryModal({ onClose, onResume }) {
  const [history,setHistory]=useState([]);
  useEffect(()=>{try{setHistory(JSON.parse(localStorage.getItem("ms_project_history")||"[]"));}catch{};},[]);
  const del=(idx)=>{const u=history.filter((_,i)=>i!==idx);setHistory(u);localStorage.setItem("ms_project_history",JSON.stringify(u));};
  return (
    <div style={{position:"fixed",inset:0,zIndex:1200,background:"rgba(0,0,0,0.96)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"min(580px,95vw)",background:"#050505",border:`2px solid ${GOLD}`,maxHeight:"82vh",display:"flex",flexDirection:"column"}}>
        <div style={{background:"linear-gradient(135deg,#0a0500,#050200)",borderBottom:`1px solid ${GOLD}`,padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:17,fontWeight:900,letterSpacing:4}}>📂 MY PROJECTS</div>
            <div style={{color:WHITE,fontSize:10,letterSpacing:3,marginTop:3}}>CONTINUE WHERE YOU LEFT OFF</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:`1px solid ${GOLD}`,color:GOLD,width:30,height:30,cursor:"pointer",fontSize:15}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:18}}>
          {history.length===0?(
            <div style={{textAlign:"center",padding:"40px 20px",color:GOLDDIM}}>
              <div style={{fontSize:34,marginBottom:10}}>📂</div>
              <div style={{fontSize:12,letterSpacing:2,marginBottom:8}}>No saved sessions yet.</div>
              <div style={{fontSize:11,color:DIM,lineHeight:1.7}}>Hit 💾 SAVE PROJECT in the footer<br/>to save your current session.</div>
            </div>
          ):[...history].reverse().map((h,i)=>(
            <div key={i} style={{background:"#0a0a0a",border:`1px solid ${GOLDDIM}`,padding:"12px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
              <div style={{flex:1}}>
                <div style={{color:GOLD,fontWeight:900,fontSize:13,letterSpacing:2,marginBottom:3}}>{h.name||"Untitled Session"}</div>
                <div style={{color:DIM,fontSize:10,letterSpacing:1}}>{h.date} · Page {h.page} · {h.assetCount} asset{h.assetCount!==1?"s":""}</div>
                {h.note&&<div style={{color:WHITE,fontSize:11,marginTop:4,fontStyle:"italic"}}>{h.note}</div>}
              </div>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <button onClick={()=>onResume(h)} style={{background:`linear-gradient(135deg,#a07820,#e8c96d)`,border:"none",color:"#000",padding:"8px 18px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>▶ CONTINUE PROJECT</button>
                <button onClick={()=>del(history.length-1-i)} style={{background:"none",border:"1px solid #ef4444",color:"#ef4444",padding:"5px 10px",cursor:"pointer",fontSize:10,fontWeight:900,fontFamily:"'Rajdhani',sans-serif"}}>✕</button>
              </div>
            </div>
          ))}
        </div>
        {history.length>0&&(
          <div style={{borderTop:`1px solid ${GOLDDIM}`,padding:"10px 18px",flexShrink:0}}>
            <button onClick={()=>{if(confirm("Delete all project history?")){{localStorage.removeItem("ms_project_history");setHistory([]);}}}} style={{background:"none",border:"1px solid #ef4444",color:"#ef4444",padding:"5px 14px",cursor:"pointer",fontSize:10,fontWeight:900,fontFamily:"'Rajdhani',sans-serif"}}>🗑 CLEAR ALL</button>
          </div>
        )}
      </div>
    </div>
  );
}

function SaveSessionModal({ onClose, onSave, currentPage, assetCount }) {
  const [name,setName]=useState("Session — "+new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}));
  const [note,setNote]=useState("");
  const inp2={width:"100%",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"9px 12px",color:WHITE,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif"};
  return (
    <div style={{position:"fixed",inset:0,zIndex:1200,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"min(400px,92vw)",background:"#050505",border:`2px solid ${GOLD}`,padding:22}}>
        <div style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:15,fontWeight:900,letterSpacing:3,marginBottom:4}}>💾 SAVE SESSION</div>
        <div style={{color:DIM,fontSize:10,marginBottom:14}}>Page {currentPage} · {assetCount} assets in library</div>
        <div style={{color:GOLD,fontSize:10,letterSpacing:3,marginBottom:5}}>PROJECT NAME</div>
        <input value={name} onChange={e=>setName(e.target.value)} style={{...inp2,marginBottom:10}}/>
        <div style={{color:GOLD,fontSize:10,letterSpacing:3,marginBottom:5}}>NOTE (OPTIONAL)</div>
        <input value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. Done chapters 1-5, continuing from 6..." style={{...inp2,marginBottom:16}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${GOLD}`,color:GOLD,padding:"11px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>CANCEL</button>
          <button onClick={()=>onSave(name,note)} style={{background:`linear-gradient(135deg,${GOLDDIM},${GOLD})`,border:"none",color:"#000",padding:"11px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>💾 SAVE</button>
        </div>
      </div>
    </div>
  );
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
        <div style={{background:"#0a0a0a",border:`1px solid ${GOLD}`,padding:"7px 10px",marginBottom:14,textAlign:"center"}}>
          <div style={{color:DIM,fontSize:9,letterSpacing:2}}>PLAN</div>
          <div style={{color:GOLD,fontWeight:900,fontSize:14,fontFamily:"'Cinzel',serif"}}>STUDIO</div>
        </div>
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

function Footer({ page, go, onSave, onHistory }) {
  return (
    <footer style={{position:"fixed",bottom:0,left:0,right:0,zIndex:400,background:"#000",borderTop:`1px solid ${GOLD}`,padding:"6px 20px 8px",display:"flex",flexDirection:"column",gap:4}}>
      <div style={{textAlign:"center"}}>
        <span style={{color:GOLD,fontSize:11,letterSpacing:1,fontWeight:700}}>MANDASTRONG STUDIO 2026 · PROFESSIONAL CINEMA SYNTHESIS · MandaStrong1.Etsy.com</span>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
        <button onClick={()=>go(Math.max(1,page-1))} disabled={page===1} style={{...G("out",true),opacity:page===1?0.3:1}}>◀ BACK</button>
        <span style={{color:GOLD,fontSize:11,fontWeight:900,fontFamily:"'Cinzel',serif",letterSpacing:2}}>PAGE {page} / {TOTAL}</span>
        <button onClick={()=>go(Math.min(TOTAL,page+1))} disabled={page===TOTAL} style={{...G("gold",true),opacity:page===TOTAL?0.3:1}}>NEXT ▶</button>
        <button onClick={onSave} style={{...G("out",true),fontSize:11,letterSpacing:2}}>💾 SAVE PROJECT</button>
        <button onClick={onHistory} style={{background:`linear-gradient(135deg,${GOLDDIM},${GOLD})`,border:"none",color:"#000",padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>📂 OPEN PROJECT</button>
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
  const isVideoTool = ["Text to Video","Image to Video","Video to Video","AI Video Creator","AI Film Generator","Video Upscaler","AI Video Generator 4K","Set to Video","Video Colorizer","Film Restoration","Time Lapse Creator","Animation Creator","Quick Film Creator"].includes(tool);
  const isImageTool = ["Text to Image","Prompt to Image","Image to Image","Image Generator","AI Art Generator","Photo to Painting","Sketch to Image","Background Generator","Face Generator","Character Design","Portrait Generator","Logo Generator","Avatar Creator"].includes(tool);
  const isWritingTool = ["Script to Movie","Text to Script","Script to Screenplay","Prompt to Story","Feature Film Script","Short Film Script","Documentary Script","Plot Generator","Story Outline","Beat Sheet Builder","Character Bio Writer","Logline Generator","Synopsis Writer","Scene Writer","Dialogue Generator","Narration Writer","Voiceover Script"].includes(tool);
  const [mode, setMode] = useState(isVoice?"voice":(isVideoTool||isImageTool||isWritingTool)?"ai":"upload");
  const [describe, setDescribe] = useState("");
  const [result, setResult] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [playing, setPlaying] = useState(null);
  const [selVoice, setSelVoice] = useState("james");
  const fileRef = useRef(null);
  const inp = {width:"100%",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"9px 12px",color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif"};

  const speak = (vid, txt) => speakText(vid, txt, ()=>setPlaying(vid), ()=>setPlaying(null));

  const runAI = async () => {
    if (!describe.trim()) return;
    setLoading(true); setSaved(false); setResult("");
    try {
      let prompt = "";
      if (isVoice) {
        prompt = `Format this as cinematic narration, voice style: ${STOCK_VOICES.find(x=>x.id===selVoice)?.style}. Mark pauses as [pause] and emphasis as *word*:\n\n${describe}`;
      } else if (isVideoTool) {
        prompt = `You are a professional film director at MandaStrong Studio. Tool: "${tool}".\n\nUser description: ${describe}\n\nGenerate a COMPLETE PRODUCTION-READY video prompt package:\n\n1. OPTIMISED VIDEO PROMPT\n2. SCENE BREAKDOWN (5-8 shots)\n3. CAMERA DIRECTIONS\n4. LIGHTING & COLOUR GRADE\n5. AUDIO NOTES\n6. DURATION ESTIMATE\n7. DIRECTOR'S NOTES\n\nMake it specific, cinematic and immediately production-ready.`;
      } else if (isImageTool) {
        prompt = `You are a professional visual artist at MandaStrong Studio. Tool: "${tool}".\n\nUser description: ${describe}\n\nGenerate a COMPLETE IMAGE PROMPT PACKAGE:\n\n1. OPTIMISED PROMPT\n2. STYLE\n3. LIGHTING & COLOUR PALETTE\n4. COMPOSITION & FRAMING\n5. NEGATIVE PROMPT\n6. ASPECT RATIO & RESOLUTION\n7. STYLE REFERENCES`;
      } else if (isWritingTool) {
        prompt = `You are a professional screenwriter at MandaStrong Studio. Tool: "${tool}".\n\nUser request: ${describe}\n\nGenerate complete, properly formatted, production-ready content.`;
      } else {
        prompt = `You are a professional at MandaStrong Studio cinema AI platform. Tool: "${tool}".\n\nUser request: ${describe}\n\nGenerate complete, detailed, professional, production-ready content.`;
      }
      const res = await fetch("https://yrshnpjvplkwbpmmzwvb.supabase.co/functions/v1/claude-proxy",{
        method:"POST",
        headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,
          messages:[{role:"user",content:prompt}]})
      });
      const d = await res.json();
      const txt = d.content&&d.content[0]?d.content[0].text:"Generated!";
      setResult(txt);
      if (isVoice) speak(selVoice, txt);
    } catch(e) { setResult("Error — check your connection and try again."); }
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
        <div style={{display:"grid",gridTemplateColumns:isVoice?"1fr 1fr 1fr 1fr":"1fr 1fr 1fr",gap:8,marginBottom:18}}>
          {isVoice&&<button onClick={()=>setMode("voice")} style={{...G(mode==="voice"?"gold":"out",true),fontSize:11}}>🎙 VOICE</button>}
          {[["upload","UPLOAD"],["paste","PASTE"],["ai","AI CREATE ✦"]].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)} style={{...G(mode===m?"gold":"out",true),fontSize:11}}>{l}</button>
          ))}
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
              </button>
              <button onClick={()=>speak(selVoice,describe)} disabled={!describe.trim()} style={{...G("out",false),padding:"12px",opacity:!describe.trim()?0.5:1}}>
                ▶ SPEAK NOW
              </button>
            </div>
            {result&&(
              <div>
                <textarea value={result} onChange={e=>setResult(e.target.value)} style={{...inp,height:110,resize:"none",lineHeight:1.7,marginBottom:10}}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  <button onClick={()=>speak(selVoice,result)} style={{...G("out",false),padding:"10px"}}>▶ PLAY</button>
                  <button onClick={stopSpeaking} style={{...G("out",false),padding:"10px"}}>⏹ STOP</button>
                  <button onClick={saveAsset} style={{...G("gold",false),padding:"10px"}}>SAVE TO LIBRARY</button>
                </div>
              </div>
            )}
          </div>
        )}
        {mode==="upload"&&(
          <div style={{marginBottom:14}}>
            <div onClick={()=>fileRef.current&&fileRef.current.click()}
              style={{border:`2px dashed ${GOLDDIM}`,padding:"30px 20px",textAlign:"center",cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=GOLD}
              onMouseLeave={e=>e.currentTarget.style.borderColor=GOLDDIM}>
              <div style={{fontSize:28,marginBottom:8}}>⬆</div>
              <div style={{color:WHITE,fontSize:13,fontWeight:700,letterSpacing:1}}>CLICK TO BROWSE</div>
              <div style={{color:DIM,fontSize:12,marginTop:4}}>Video · Audio · Image · Text</div>
            </div>
            <input ref={fileRef} type="file" style={{display:"none"}} onChange={e=>{
              const f=e.target.files&&e.target.files[0];
              if(f&&onSave){onSave({id:Date.now()+Math.random(),name:f.name,type:f.type,file:f,url:URL.createObjectURL(f)});setSaved(true);}
            }}/>
          </div>
        )}
        {mode==="paste"&&(
          <div style={{marginBottom:14}}>
            <div style={{color:GOLD,fontSize:12,letterSpacing:3,fontWeight:900,marginBottom:6}}>ADD URL</div>
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Paste a URL..." style={{...inp,marginBottom:10}}/>
            <div style={{color:GOLD,fontSize:12,letterSpacing:3,fontWeight:900,marginBottom:6}}>OR PASTE TEXT</div>
            <textarea value={describe} onChange={e=>setDescribe(e.target.value)} placeholder="Paste your content here..." style={{...inp,height:100,resize:"none",lineHeight:1.6}}/>
            <button onClick={saveAsset} style={{...G("gold",false),marginTop:8,width:"100%",padding:"12px"}}>SAVE TO MEDIA LIBRARY</button>
          </div>
        )}
        {mode==="ai"&&(
          <div style={{marginBottom:14}}>
            <div style={{color:GOLD,fontSize:12,letterSpacing:3,fontWeight:900,marginBottom:4}}>
              {isVideoTool?"DESCRIBE YOUR SCENE OR FILM IDEA":isImageTool?"DESCRIBE YOUR IMAGE":isWritingTool?"DESCRIBE YOUR STORY OR SCRIPT":"DESCRIBE WHAT YOU WANT"}
            </div>
            <textarea value={describe} onChange={e=>setDescribe(e.target.value)}
              placeholder={isVideoTool?"e.g. A lone astronaut walks across a red planet at sunset...":isImageTool?"e.g. Portrait of a warrior queen at golden hour...":isWritingTool?"e.g. A documentary about veterans mental health...":`Describe what you want from ${tool}...`}
              style={{...inp,height:100,resize:"none",lineHeight:1.6}}/>
            <button onClick={runAI} disabled={loading||!describe.trim()} style={{...G("gold",false),marginTop:8,width:"100%",padding:"14px",opacity:loading||!describe.trim()?0.5:1,fontSize:13,letterSpacing:2}}>
              {loading?"⟳ CREATING...":isVideoTool?"🎬 CREATE VIDEO PACKAGE ✦":isImageTool?"🎨 CREATE IMAGE PROMPT ✦":isWritingTool?"✍ WRITE SCRIPT ✦":"✦ AI CREATE"}
            </button>
            {result&&(
              <div style={{marginTop:14}}>
                <textarea value={result} onChange={e=>setResult(e.target.value)} style={{...inp,height:140,resize:"none",lineHeight:1.7}}/>
                <button onClick={saveAsset} style={{...G("gold",false),marginTop:8,width:"100%",padding:"12px"}}>GENERATE & SAVE</button>
              </div>
            )}
          </div>
        )}
        {saved&&(
          <div style={{marginTop:14,background:"#0a2a0a",border:"1px solid #22c55e",padding:"12px 16px",textAlign:"center"}}>
            <div style={{color:"#22c55e",fontWeight:900,fontSize:14,letterSpacing:2}}>✓ ASSET SAVED TO MEDIA LIBRARY</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolPage({ title, subtitle, tools, onSave }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);
  const filtered = tools.filter(t=>t.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{...Sp}}>
      <div style={{padding:"14px 18px 12px",borderBottom:`1px solid ${GOLDDIM}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:12,color:GOLD,letterSpacing:4,fontWeight:700}}>{subtitle}</div>
          <h1 style={{...H1,fontSize:24,margin:0}}>{title}</h1>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{position:"relative"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${tools.length} tools...`}
              style={{background:"#000",border:`1px solid ${GOLDDIM}`,padding:"7px 12px 7px 28px",color:WHITE,fontSize:13,outline:"none",width:200}}/>
            <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:GOLD}}>🔍</span>
            {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:7,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:GOLD,cursor:"pointer",padding:0}}>✕</button>}
          </div>
          <span style={{color:WHITE,fontSize:12,fontWeight:700,letterSpacing:1}}>{filtered.length} TOOLS</span>
        </div>
      </div>
      <div style={{padding:12,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {filtered.map(t=><ToolCard key={t} name={t} onOpen={setOpen}/>)}
      </div>
      {open&&<ToolPanel tool={open} onClose={()=>setOpen(null)} onSave={onSave}/>}
      {title==="WRITING TOOLS"&&(
        <div style={{padding:"0 12px 12px"}}>
          <div style={{background:"#050500",border:`2px solid ${GOLD}`,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{color:GOLD,fontWeight:900,fontSize:13,letterSpacing:3}}>📂 YOUR PROJECTS</div>
              <div style={{color:WHITE,fontSize:12,marginTop:3}}>Save and reload your work at any time</div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{
                try{
                  const hist=JSON.parse(localStorage.getItem("ms_project_history")||"[]");
                  if(hist.length>0){
                    // Show history modal by dispatching custom event
                    window.dispatchEvent(new CustomEvent("ms_open_history"));
                  } else {
                    alert("No saved projects found. Hit 💾 SAVE PROJECT in the footer to save your work.");
                  }
                }catch(e){alert("Could not open projects.");}
              }}
                style={{background:`linear-gradient(135deg,#a07820,#e8c96d)`,border:"none",color:"#000",padding:"12px 24px",cursor:"pointer",fontSize:12,fontWeight:900,letterSpacing:2}}>
                📂 OPEN PROJECT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MusicVideoStudio({ onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoBlob, setVideoBlob] = useState(null);
  const [renderLog, setRenderLog] = useState([]);
  const [renderProgress, setRenderProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration2, setDuration2] = useState(0);
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioName, setAudioName] = useState("");
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const audioInputRef = useRef(null);

  const [config, setConfig] = useState({
    title:"If Only", artist:"Manda", genre:"Folk / Acoustic",
    mood:"Melancholic", tempo:"Slow (60-80 BPM)",
    videoStyle:"Cinematic Narrative", colorGrade:"Cinematic Teal & Orange",
    effects:["Slow Motion","Film Grain","Vignette"],
    cuts:"Long Takes", aspectRatio:"16:9", duration:"3 Minutes",
    visualDesc:"", refMedia:null,
  });
  const set = (k,v) => setConfig(p=>({...p,[k]:v}));
  const tog = (k,v) => setConfig(p=>({...p,[k]:p[k].includes(v)?p[k].filter(x=>x!==v):[...p[k],v]}));

  const GENRES=["Pop","Rock","Hip Hop","R&B / Soul","Electronic / EDM","Country","Jazz","Classical","Metal","Folk / Acoustic","Latin","K-Pop","Blues","Cinematic / Score"];
  const MOODS=["Euphoric","Melancholic","Energetic","Romantic","Angry","Peaceful","Mysterious","Empowering","Nostalgic","Dark","Haunting","Uplifting","Tense"];
  const TEMPOS=["Very Slow (40-60 BPM)","Slow (60-80 BPM)","Mid-Tempo (80-100 BPM)","Upbeat (100-120 BPM)","Fast (120-140 BPM)"];
  const STYLES=["Cinematic Narrative","Performance / Live","Abstract / Visual Art","Documentary Style","Lyric Video","Retro / VHS","Noir / Black & White","Surrealist / Dreamlike"];
  const GRADES=["Natural / Clean","Golden Hour Warm","Cool Blue / Moody","High Contrast Black & White","Cinematic Teal & Orange","Vintage Film Grain","Dark & Desaturated"];
  const EFFECTS=["Slow Motion","Speed Ramps","Glitch Effects","Light Leaks","Lens Flares","Rain / Water","Bokeh / Blur","Film Grain","Vignette","Particle Effects"];
  const CUTS=["Fast Cuts / High Energy","Slow & Deliberate","Long Takes","Beat-Synced Cuts","Montage Style"];

  const addLog = (msg) => setRenderLog(p=>[...p,msg]);

  // Upload audio track
  const handleAudioUpload = (e) => {
    const f = e.target.files&&e.target.files[0];
    if(!f) return;
    setAudioFile(f);
    setAudioUrl(URL.createObjectURL(f));
    setAudioName(f.name);
  };

  const generateVideo = async () => {
    if(!config.refMedia){
      alert("PHOTO REQUIRED\n\nTo generate a photorealistic music video, upload your photo first.\n\nGo to Step 4 and tap UPLOAD PHOTO. Your photo becomes the actual video background — canvas cannot produce real human images.");
      return;
    }
    setGenerating(true);setRenderLog([]);setRenderProgress(0);setVideoUrl("");setVideoBlob(null);
    try{
      addLog("MandaStrong Cinema Engine — loading photo...");setRenderProgress(6);
      const refImg=await new Promise(resolve=>{
        const img=new Image();img.crossOrigin="anonymous";
        img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=config.refMedia;
      });
      if(!refImg){addLog("Error: Could not load photo. Please re-upload.");setGenerating(false);return;}
      addLog("✓ Photo loaded — photorealistic mode active");setRenderProgress(14);

      let totalDur=180,beatGrid=[],audioCtx=null,audioDest=null,audioSource=null;
      if(audioFile){
        try{
          audioCtx=new(window.AudioContext||window.webkitAudioContext)();
          const ab=await audioFile.arrayBuffer();const buf=await audioCtx.decodeAudioData(ab);
          totalDur=buf.duration;
          const data=buf.getChannelData(0),sr=buf.sampleRate,win=Math.round(sr*0.35);
          const energies=[];
          for(let i=0;i<data.length-win;i+=win){let e=0;for(let j=0;j<win;j++)e+=data[i+j]*data[i+j];energies.push({t:i/sr,e:e/win});}
          const avg=energies.reduce((s,x)=>s+x.e,0)/energies.length;let last=-1;
          energies.forEach(x=>{if(x.e>avg*1.35&&x.t-last>0.28){beatGrid.push(x.t);last=x.t;}});
          addLog("Audio: "+totalDur.toFixed(1)+"s — "+beatGrid.length+" beats detected");
          audioDest=audioCtx.createMediaStreamDestination();audioSource=audioCtx.createBufferSource();audioSource.buffer=buf;
          const gain=audioCtx.createGain();gain.gain.value=0.92;audioSource.connect(gain);gain.connect(audioDest);gain.connect(audioCtx.destination);
        }catch(e){addLog("Audio: "+e.message);audioCtx=null;}
      }else{const mins=parseInt(config.duration)||3;totalDur=mins*60;addLog("No audio — "+mins+" min visual ("+totalDur+"s)");for(let t2=0;t2<totalDur;t2+=1.8)beatGrid.push(t2);}
      setRenderProgress(22);

      addLog("Rendering "+Math.round(totalDur)+"s at 12fps — photorealistic...");
      const canvas=canvasRef.current;const W=1280,H=720;canvas.width=W;canvas.height=H;
      const ctx=canvas.getContext("2d");const fps=12;
      const mimeType=MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm";
      const videoStream=canvas.captureStream(fps);
      const combinedStream=audioDest?new MediaStream([...videoStream.getTracks(),...audioDest.stream.getTracks()]):videoStream;
      const recorder=new MediaRecorder(combinedStream,{mimeType,videoBitsPerSecond:10000000});
      const chunks=[];recorder.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data);};
      recorder.start(Math.round(1000/fps));if(audioSource)audioSource.start(0);

      const totalFrames=Math.round(totalDur*fps),msPerFrame=Math.round(1000/fps),wallStart=performance.now();
      await new Promise(resolve=>{
        let frame=0;
        const tick=()=>{
          if(frame>=totalFrames){resolve(null);return;}
          const sec=frame/fps,t=sec/totalDur,beatNow=beatGrid.some(b=>Math.abs(sec-b)<0.055);
          ctx.clearRect(0,0,W,H);
          // ── PHOTO BASE: Ken Burns zoom + drift ──────────────────
          const scale=1+t*0.065,ox=(W*(scale-1))/2,oy=(H*(scale-1))/2,driftX=t*W*0.016;
          ctx.drawImage(refImg,-ox-driftX,-oy,W*scale,H*scale);
          // ── CANDLE FLICKER glow bottom-right ────────────────────
          const flk=0.80+Math.sin(sec*9.1)*0.10+Math.sin(sec*14.7)*0.06+Math.random()*0.025;
          const cG=ctx.createRadialGradient(W*0.84,H*0.80,0,W*0.84,H*0.80,W*0.33*flk);
          cG.addColorStop(0,"rgba(255,150,30,"+(0.14*flk)+")");cG.addColorStop(0.4,"rgba(255,100,15,"+(0.055*flk)+")");cG.addColorStop(1,"rgba(0,0,0,0)");
          ctx.fillStyle=cG;ctx.fillRect(0,0,W,H);
          // ── MOONLIGHT SHIMMER on water ───────────────────────────
          const shA=0.030+Math.sin(sec*0.6)*0.020+Math.sin(sec*1.3)*0.012;
          const sh=ctx.createLinearGradient(W*0.22,H*0.36,W*0.72,H*0.62);
          sh.addColorStop(0,"rgba(255,255,230,0)");sh.addColorStop(0.4,"rgba(255,255,220,"+shA+")");sh.addColorStop(0.6,"rgba(200,220,255,"+(shA*0.5)+")");sh.addColorStop(1,"rgba(255,255,200,0)");
          ctx.fillStyle=sh;ctx.fillRect(0,0,W,H);
          // ── CURTAIN LIGHT BREATH right side ─────────────────────
          const cb=0.026+Math.sin(sec*0.42)*0.014+Math.sin(sec*0.85)*0.009;
          const crt=ctx.createLinearGradient(W*0.74,0,W,0);
          crt.addColorStop(0,"rgba(255,255,255,0)");crt.addColorStop(0.5,"rgba(255,255,255,"+cb+")");crt.addColorStop(1,"rgba(255,255,255,0)");
          ctx.fillStyle=crt;ctx.fillRect(W*0.74,0,W*0.26,H);
          // ── NIGHT ATMOSPHERE deepens ─────────────────────────────
          ctx.fillStyle="rgba(0,4,16,"+(0.022+t*0.042)+")";ctx.fillRect(0,0,W,H);
          if(beatNow){ctx.fillStyle="rgba(255,200,100,0.036)";ctx.fillRect(0,0,W,H);}
          // ── CLIMAX moonlight peak (t 0.72-0.88) ─────────────────
          if(t>0.72&&t<0.88){const a=(t-0.72)/0.16;const mP=ctx.createLinearGradient(W*0.28,H*0.40,W*0.62,H*0.68);mP.addColorStop(0,"rgba(255,255,220,0)");mP.addColorStop(0.5,"rgba(255,255,210,"+(a*0.10)+")");mP.addColorStop(1,"rgba(255,255,200,0)");ctx.fillStyle=mP;ctx.fillRect(0,0,W,H);}
          // ── VIGNETTE ─────────────────────────────────────────────
          const vig=ctx.createRadialGradient(W/2,H/2,W*0.10,W/2,H/2,W*0.82);vig.addColorStop(0,"rgba(0,0,0,0)");vig.addColorStop(1,"rgba(0,0,0,0.88)");ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);
          // ── LETTERBOX ────────────────────────────────────────────
          ctx.fillStyle="#000";ctx.fillRect(0,0,W,Math.round(H*0.070));ctx.fillRect(0,H-Math.round(H*0.070),W,Math.round(H*0.070));
          // ── FILM GRAIN ───────────────────────────────────────────
          for(let g=0;g<28;g++){const gv=Math.random()>0.5?140:0;ctx.fillStyle="rgba("+gv+","+gv+","+gv+",0.007)";ctx.fillRect(Math.random()*W,Math.random()*H,1,1);}
          // ── TITLE CARD fade in/out ────────────────────────────────
          if(t<0.12||t>0.90){
            const a=t<0.12?Math.min(1,t/0.08):Math.max(0,(1-t)/0.08);
            ctx.globalAlpha=a;ctx.fillStyle="#e8c96d";
            ctx.font="900 "+Math.round(H*0.068)+"px Arial Black,Arial";ctx.textAlign="center";
            ctx.shadowColor="#e8c96d";ctx.shadowBlur=24;
            ctx.fillText((config.title||"UNTITLED").toUpperCase(),W/2,H*0.43);
            ctx.shadowBlur=0;ctx.fillStyle="rgba(255,255,255,0.82)";
            ctx.font="300 "+Math.round(H*0.032)+"px Arial";
            ctx.fillText((config.artist||"").toUpperCase(),W/2,H*0.56);
            ctx.globalAlpha=1;
          }
          setRenderProgress(22+Math.round((frame/totalFrames)*72));
          if(frame%(fps*10)===0)addLog("  "+Math.round(sec)+"s / "+Math.round(totalDur)+"s");
          frame++;const due=wallStart+(frame*msPerFrame);setTimeout(tick,Math.max(4,due-performance.now()));
        };tick();
      });

      setRenderProgress(96);addLog("Cutting to final...");
      await new Promise(r=>setTimeout(r,500));
      if(audioSource){try{audioSource.stop();}catch(e){}}
      recorder.stop();await new Promise(r=>{recorder.onstop=r;});
      const blob=new Blob(chunks,{type:mimeType});const url=URL.createObjectURL(blob);
      setVideoUrl(url);setVideoBlob(blob);setRenderProgress(100);
      addLog("✓ "+config.title+" — "+(blob.size/1024/1024).toFixed(1)+"MB · "+Math.round(totalDur)+"s");
      const fn=(config.title||"MusicVideo")+"_"+config.artist+".webm";
      try{const clipId="mv_"+Date.now();await saveClipToDB(clipId,blob,fn,"video/webm");addLog("✓ Saved");if(onSave)onSave({id:clipId,name:fn,type:"video/webm",url:URL.createObjectURL(blob),file:new File([blob],fn,{type:"video/webm"}),dbId:clipId});}catch(e){}
      if(audioCtx)try{audioCtx.close();}catch(e){}
    }catch(e){addLog("Error: "+e.message);}
    setGenerating(false);
  }


  const SOCIAL = [
    ["YouTube","#FF0000","https://www.youtube.com/upload"],
    ["Instagram","#E1306C","https://www.instagram.com"],
    ["TikTok","#69C9D0","https://www.tiktok.com/upload"],
    ["Facebook","#1877F2","https://www.facebook.com"],
    ["X / Twitter","#1DA1F2","https://twitter.com"],
    ["Vimeo","#1AB7EA","https://vimeo.com/upload"],
  ];

  const inp = {width:"100%",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"9px 12px",color:WHITE,fontSize:13,outline:"none",fontFamily:"'Rajdhani',sans-serif",boxSizing:"border-box"};
  const label = (txt) => <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:6,marginTop:12}}>{txt}</div>;

  const sel = (k,arr) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:4}}>
      {arr.map(item=>(
        <button key={item} onClick={()=>set(k,item)}
          style={{background:config[k]===item?GOLD:"#111",border:`1px solid ${config[k]===item?"#000":GOLDDIM}`,color:config[k]===item?"#000":WHITE,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:1}}>
          {item}
        </button>
      ))}
    </div>
  );
  const multi = (k,arr) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:4}}>
      {arr.map(item=>(
        <button key={item} onClick={()=>tog(k,item)}
          style={{background:config[k].includes(item)?GOLD:"#111",border:`1px solid ${config[k].includes(item)?"#000":GOLDDIM}`,color:config[k].includes(item)?"#000":WHITE,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:1}}>
          {item}
        </button>
      ))}
    </div>
  );

  const steps = ["🎵 SONG","🎤 STYLE","🎬 SCENE","▶ GENERATE"];
  const fmt = (s)=>{const m=Math.floor(s/60);const sc=Math.floor(s%60);return String(m).padStart(2,"0")+":"+String(sc).padStart(2,"0");};

  return (
    <div style={{position:"fixed",inset:0,zIndex:1100,background:"rgba(0,0,0,0.98)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"min(960px,98vw)",height:"min(92vh,860px)",background:"#050505",border:`2px solid ${GOLD}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Header */}
        <div style={{background:`linear-gradient(135deg,#1a0a00,#0a0500)`,borderBottom:`1px solid ${GOLD}`,padding:"14px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:18,fontWeight:900,letterSpacing:4}}>🎬 MUSIC VIDEO STUDIO</div>
            <div style={{color:WHITE,fontSize:10,letterSpacing:3,marginTop:2}}>PROFESSIONAL MUSIC VIDEO PRODUCTION · AI POWERED · SELF-CONTAINED</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:`1px solid ${GOLD}`,color:GOLD,width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
        </div>

        {/* Step tabs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderBottom:`1px solid ${GOLDDIM}`,flexShrink:0}}>
          {steps.map((s,i)=>(
            <button key={i} onClick={()=>setStep(i+1)}
              style={{background:step===i+1?"#0a0500":"none",border:"none",borderBottom:step===i+1?`2px solid ${GOLD}`:"2px solid transparent",color:step===i+1?GOLD:WHITE,padding:"11px 6px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2}}>
              {s}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div style={{flex:1,display:"grid",gridTemplateColumns:videoUrl?"1fr 1fr":"1fr",overflow:"hidden"}}>

          {/* Left — config / generate */}
          <div style={{overflowY:"auto",padding:"16px 20px",borderRight:videoUrl?`1px solid ${GOLDDIM}`:"none"}}>

            {step===1&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div>{label("SONG TITLE")}<input value={config.title} onChange={e=>set("title",e.target.value)} placeholder="Song title..." style={inp}/></div>
                  <div>{label("ARTIST")}<input value={config.artist} onChange={e=>set("artist",e.target.value)} placeholder="Artist name..." style={inp}/></div>
                </div>
                {label("GENRE")}{sel("genre",GENRES)}
                {label("MOOD")}{sel("mood",MOODS)}
                {label("TEMPO")}{sel("tempo",TEMPOS)}
                {label("UPLOAD YOUR AUDIO TRACK (OPTIONAL)")}
                <div style={{background:"#000",border:`1px dashed ${audioFile?GOLD:GOLDDIM}`,padding:"12px",cursor:"pointer",marginBottom:4}}
                  onClick={()=>audioInputRef.current&&audioInputRef.current.click()}>
                  <div style={{color:audioFile?"#22c55e":WHITE,fontWeight:900,fontSize:12,letterSpacing:2}}>
                    {audioFile?"✓ "+audioName:"⬆ CLICK TO UPLOAD MP3 / WAV / M4A"}
                  </div>
                  {audioFile&&<div style={{color:GOLDDIM,fontSize:10,marginTop:4}}>Audio will be mixed into your music video</div>}
                </div>
                <input ref={audioInputRef} type="file" accept="audio/*" style={{display:"none"}} onChange={handleAudioUpload}/>
                {audioFile&&<button onClick={()=>{setAudioFile(null);setAudioUrl("");setAudioName("");}} style={{background:"none",border:`1px solid #ef4444`,color:"#ef4444",padding:"3px 10px",cursor:"pointer",fontSize:10,fontWeight:900,marginTop:4}}>✕ REMOVE AUDIO</button>}
              </div>
            )}

            {step===2&&(
              <div>
                {label("VIDEO STYLE")}{sel("videoStyle",STYLES)}
                {label("COLOUR GRADE")}{sel("colorGrade",GRADES)}
                {label("VISUAL EFFECTS")}{multi("effects",EFFECTS)}
                {label("EDITING STYLE")}{sel("cuts",CUTS)}
                {label("ASPECT RATIO")}
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {["16:9","9:16 (Vertical)","1:1 (Square)","2.39:1 (Cinematic)"].map(r=>(
                    <button key={r} onClick={()=>set("aspectRatio",r)}
                      style={{background:config.aspectRatio===r?GOLD:"#111",border:`1px solid ${config.aspectRatio===r?"#000":GOLDDIM}`,color:config.aspectRatio===r?"#000":WHITE,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:900}}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step===3&&(
              <div>
                {label("DESCRIBE YOUR MUSIC VIDEO SCENE")}
                <div style={{color:GOLDDIM,fontSize:11,marginBottom:8,lineHeight:1.7}}>
                  Describe what you want to see. The AI director will build 8 cinematic shots from your description.
                </div>
                <textarea
                  value={config.visualDesc}
                  onChange={e=>set("visualDesc",e.target.value)}
                  placeholder="e.g. A man sits alone on a windowsill fingerpicking acoustic guitar. Only his back is visible. Facing the open ocean at night. Full moon low on the water. A single candle burns to his right. The room behind him is empty. A cold couch. A coat still on a hook. He does not move. A man who has lost someone."
                  style={{...inp,height:160,resize:"vertical",lineHeight:1.8,border:`1px solid ${GOLD}`}}
                />
                {label("DURATION — "+(parseInt(config.duration)||3)+" MINUTES")}
                <input type="range" min={1} max={180} step={1} value={parseInt(config.duration)||3}
                  onChange={e=>set("duration",e.target.value+" Minutes")}
                  style={{width:"100%",accentColor:GOLD,marginBottom:4}}/>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{color:DIM,fontSize:10}}>1 MIN</span>
                  <span style={{color:GOLD,fontSize:13,fontWeight:900}}>{parseInt(config.duration)||3} MINUTES</span>
                  <span style={{color:DIM,fontSize:10}}>180 MIN</span>
                </div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {[2,3,5,10,30,60,90,120,180].map(d=>(
                    <button key={d} onClick={()=>set("duration",d+" Minutes")}
                      style={{background:parseInt(config.duration)===d?GOLD:"#111",border:`1px solid ${parseInt(config.duration)===d?"#000":GOLDDIM}`,color:parseInt(config.duration)===d?"#000":WHITE,padding:"3px 10px",cursor:"pointer",fontSize:11,fontWeight:900}}>
                      {d}m
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step===4&&(
              <div>
                <div style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:16,fontWeight:900,marginBottom:10,letterSpacing:3}}>READY TO CREATE</div>

                {/* PHOTO UPLOAD — REQUIRED for photorealistic output */}
                <div style={{background:config.refMedia?"#020a02":"#0a0200",border:`2px solid ${config.refMedia?"#22c55e":GOLD}`,padding:14,marginBottom:12,borderRadius:0}}>
                  <div style={{color:config.refMedia?"#22c55e":GOLD,fontSize:12,letterSpacing:3,fontWeight:900,marginBottom:6}}>{config.refMedia?"✓ PHOTO LOADED — PHOTOREALISTIC MODE":"📸 UPLOAD YOUR PHOTO — REQUIRED"}</div>
                  <div style={{color:WHITE,fontSize:11,lineHeight:1.7,marginBottom:8}}>{config.refMedia?"Your photo will be animated cinematically — Ken Burns zoom, candle glow, moonlight, atmosphere.":"Upload any photo and it becomes your music video. This is the only way to get real human images — canvas cannot produce photorealistic people."}</div>
                  {config.refMedia?(
                    <div style={{position:"relative"}}>
                      <img src={config.refMedia} alt="ref" style={{width:"100%",height:120,objectFit:"cover",border:"1px solid #22c55e",display:"block"}}/>
                      <button onClick={()=>set("refMedia",null)} style={{position:"absolute",top:6,right:6,background:"#000",border:"1px solid #ef4444",color:"#ef4444",padding:"2px 9px",cursor:"pointer",fontSize:11,fontWeight:900}}>✕ CHANGE</button>
                    </div>
                  ):(
                    <div onClick={()=>{const i=document.createElement("input");i.type="file";i.accept="image/*";i.onchange=e=>{const f=e.target.files&&e.target.files[0];if(f)set("refMedia",URL.createObjectURL(f));};i.click();}}
                      style={{border:`2px dashed ${GOLD}`,padding:"22px",textAlign:"center",cursor:"pointer",background:"#050200"}}
                      onMouseEnter={e=>e.currentTarget.style.background="#0a0400"}
                      onMouseLeave={e=>e.currentTarget.style.background="#050200"}>
                      <div style={{fontSize:32,marginBottom:8}}>📸</div>
                      <div style={{color:GOLD,fontSize:14,fontWeight:900,letterSpacing:1}}>CLICK TO UPLOAD YOUR PHOTO</div>
                      <div style={{color:DIM,fontSize:10,marginTop:4}}>JPG · PNG · This photo becomes your music video background</div>
                    </div>
                  )}
                </div>

                <div style={{background:"#0a0500",border:`1px solid ${GOLDDIM}`,padding:12,marginBottom:12}}>
                  <div style={{color:GOLD,fontSize:10,letterSpacing:2,marginBottom:8,fontWeight:900}}>YOUR MUSIC VIDEO</div>
                  {[["TITLE",config.title||"—"],["ARTIST",config.artist||"—"],["GENRE",config.genre||"—"],["MOOD",config.mood||"—"],["DURATION",config.duration||"—"],["AUDIO",audioName||"No audio uploaded"],["PHOTO",config.refMedia?"✓ Loaded — photorealistic":"⚠ Not uploaded — required"]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"3px 0",borderBottom:"1px solid #0a0800"}}>
                      <span style={{color:GOLDDIM,letterSpacing:2}}>{k}</span>
                      <span style={{color:k==="PHOTO"&&!config.refMedia?"#ef4444":k==="PHOTO"&&config.refMedia?"#22c55e":WHITE,fontWeight:700}}>{v}</span>
                    </div>
                  ))}
                </div>

                <button onClick={generateVideo} disabled={generating}
                  style={{background:config.refMedia?`linear-gradient(135deg,${GOLDDIM},${GOLD})`:"#1a0a00",border:config.refMedia?"none":`1px solid ${GOLDDIM}`,color:config.refMedia?"#000":GOLDDIM,width:"100%",padding:"18px",fontSize:14,letterSpacing:3,cursor:generating||!config.refMedia?"not-allowed":"pointer",fontWeight:900,fontFamily:"'Rajdhani',sans-serif",opacity:generating?0.7:1,marginBottom:10}}>
                  {generating?"⟳ RENDERING... "+renderProgress+"%":config.refMedia?"🎬 GENERATE MUSIC VIDEO":"📸 UPLOAD PHOTO FIRST TO GENERATE"}
                </button>
                {generating&&(
                  <div>
                    <div style={{height:5,background:"#111",marginBottom:6}}>
                      <div style={{width:renderProgress+"%",height:"100%",background:`linear-gradient(90deg,#a07820,#e8c96d)`,transition:"width .3s"}}/>
                    </div>
                    <div style={{background:"#000",border:`1px solid ${GOLDDIM}`,padding:10,maxHeight:140,overflowY:"auto"}}>
                      {renderLog.map((l,i)=>(
                        <div key={i} style={{color:i===renderLog.length-1?"#22c55e":DIM,fontSize:10,lineHeight:1.8}}>
                          {i===renderLog.length-1?"▶ ":"  "}{l}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!generating&&renderLog.length>0&&(
                  <div style={{background:"#000",border:`1px solid ${GOLDDIM}`,padding:10,maxHeight:120,overflowY:"auto"}}>
                    {renderLog.map((l,i)=>(
                      <div key={i} style={{color:i===renderLog.length-1?"#22c55e":DIM,fontSize:10,lineHeight:1.8}}>
                        {i===renderLog.length-1?"▶ ":"  "}{l}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — video player + export (only when video exists) */}
          {videoUrl&&(
            <div style={{display:"flex",flexDirection:"column",background:"#000",overflow:"hidden"}}>
              {/* Video player */}
              <div style={{position:"relative",background:"#000"}}>
                <canvas ref={canvasRef} style={{display:"none"}}/>
                <video ref={videoRef} src={videoUrl} playsInline
                  style={{width:"100%",aspectRatio:"16/9",display:"block",background:"#000"}}
                  onTimeUpdate={()=>setCurrentTime(videoRef.current?.currentTime||0)}
                  onLoadedMetadata={()=>setDuration2(videoRef.current?.duration||0)}
                  onPlay={()=>setPlaying(true)}
                  onPause={()=>setPlaying(false)}
                  onEnded={()=>setPlaying(false)}
                />
                {/* Custom controls overlay */}
                <div style={{background:"rgba(0,0,0,0.85)",padding:"8px 12px"}}>
                  <div style={{height:3,background:"#222",marginBottom:8,cursor:"pointer",borderRadius:2}}
                    onClick={e=>{if(!videoRef.current||!duration2)return;const r=e.currentTarget.getBoundingClientRect();videoRef.current.currentTime=((e.clientX-r.left)/r.width)*duration2;}}>
                    <div style={{width:`${duration2?(currentTime/duration2*100):0}%`,height:"100%",background:GOLD,borderRadius:2,transition:"width .1s"}}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <button onClick={()=>videoRef.current&&(videoRef.current.currentTime=0)} style={{background:"none",border:"none",color:GOLDDIM,cursor:"pointer",fontSize:14}}>⏮</button>
                      <button onClick={()=>{if(!videoRef.current)return;playing?videoRef.current.pause():videoRef.current.play();}} style={{background:GOLD,border:"none",color:"#000",width:32,height:32,cursor:"pointer",fontSize:16,fontWeight:900}}>
                        {playing?"⏸":"▶"}
                      </button>
                      <button onClick={()=>videoRef.current&&(videoRef.current.currentTime=Math.min(duration2,videoRef.current.currentTime+10))} style={{background:"none",border:"none",color:GOLDDIM,cursor:"pointer",fontSize:14}}>⏩</button>
                      <span style={{color:WHITE,fontSize:11,fontFamily:"monospace"}}>{fmt(currentTime)} / {fmt(duration2)}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{color:GOLDDIM,fontSize:10}}>VOL</span>
                      <input type="range" min={0} max={1} step={0.05} defaultValue={0.85}
                        onChange={e=>{if(videoRef.current)videoRef.current.volume=+e.target.value;}}
                        style={{width:70,accentColor:GOLD}}/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export panel */}
              <div style={{flex:1,overflowY:"auto",padding:"12px 14px"}}>
                <div style={{color:GOLD,fontSize:11,fontWeight:900,letterSpacing:3,marginBottom:10}}>EXPORT YOUR MUSIC VIDEO</div>

                {/* Download */}
                <a href={videoUrl} download={(config.title||"MusicVideo")+"_"+config.artist+".webm"}
                  style={{display:"block",background:`linear-gradient(135deg,${GOLDDIM},${GOLD})`,border:"none",color:"#000",padding:"12px",textAlign:"center",textDecoration:"none",fontWeight:900,fontSize:12,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif",marginBottom:8}}>
                  ⬇ DOWNLOAD VIDEO
                </a>

                {/* Save to media library */}
                <button onClick={()=>{
                  if(videoBlob&&onSave){
                    const fn=(config.title||"MusicVideo")+"_"+config.artist+".webm";
                    onSave({id:"mv_"+Date.now(),name:fn,type:"video/webm",url:videoUrl,file:new File([videoBlob],fn,{type:"video/webm"})});
                    addLog("✓ Saved to media library");
                  }
                }} style={{width:"100%",background:"transparent",border:`1px solid ${GOLD}`,color:GOLD,padding:"10px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif",marginBottom:14}}>
                  💾 SAVE TO MEDIA LIBRARY
                </button>

                {/* Share to social */}
                <div style={{color:GOLD,fontSize:10,fontWeight:900,letterSpacing:3,marginBottom:8}}>SHARE TO</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,marginBottom:12}}>
                  {SOCIAL.map(([name,color,url])=>(
                    <button key={name} onClick={()=>window.open(url,"_blank")}
                      style={{background:"#000",border:`1px solid ${color}33`,color:color,padding:"7px 4px",cursor:"pointer",fontSize:10,fontWeight:900,letterSpacing:1,fontFamily:"'Rajdhani',sans-serif"}}
                      onMouseEnter={e=>{e.currentTarget.style.background=color+"22";}}
                      onMouseLeave={e=>{e.currentTarget.style.background="#000";}}>
                      {name}
                    </button>
                  ))}
                </div>

                {/* New project */}
                <button onClick={()=>{setVideoUrl("");setVideoBlob(null);setRenderLog([]);setRenderProgress(0);setStep(1);}}
                  style={{width:"100%",background:"transparent",border:`1px solid ${GOLDDIM}`,color:GOLDDIM,padding:"8px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>
                  + NEW MUSIC VIDEO
                </button>
              </div>
            </div>
          )}

          {/* Canvas for rendering (always hidden) */}
          {!videoUrl&&<canvas ref={canvasRef} style={{display:"none"}}/>}
        </div>

        {/* Bottom nav */}
        {!videoUrl&&(
          <div style={{borderTop:`1px solid ${GOLDDIM}`,padding:"10px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
            <button onClick={()=>setStep(s=>Math.max(1,s-1))} disabled={step===1} style={{background:"transparent",border:`1px solid ${GOLD}`,color:GOLD,padding:"6px 16px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif",opacity:step===1?0.3:1}}>◀ BACK</button>
            <span style={{color:GOLDDIM,fontSize:10,letterSpacing:2}}>STEP {step} OF 4</span>
            {step<4
              ?<button onClick={()=>setStep(s=>Math.min(4,s+1))} style={{background:`linear-gradient(135deg,${GOLDDIM},${GOLD})`,border:"none",color:"#000",padding:"6px 16px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>NEXT ▶</button>
              :<button onClick={onClose} style={{background:"transparent",border:`1px solid ${GOLDDIM}`,color:GOLDDIM,padding:"6px 16px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>CLOSE</button>
            }
          </div>
        )}
      </div>
    </div>
  );
}

const VOICE_CHARACTERS = [
  {id:"james",name:"James",emoji:"🎩",gender:"Male",age:"Adult",origin:"British",region:"London",style:"Sarcastic · Deadpan · Witty",pitch:0.86,rate:0.62,desc:"Dry British wit. Devastating things said with complete calm."},
  {id:"aurora",name:"Aurora",emoji:"🌅",gender:"Female",age:"Adult",origin:"British",region:"London",style:"Warm · Documentary · Authoritative",pitch:1.08,rate:0.80,desc:"Calm authority. The voice you trust completely."},
  {id:"edward",name:"Edward",emoji:"🎭",gender:"Male",age:"Adult",origin:"British",region:"London",style:"Theatrical · Grand · Classical",pitch:0.85,rate:0.75,desc:"Shakespearean gravitas. Every sentence carved in stone."},
  {id:"cecily",name:"Cecily",emoji:"🫖",gender:"Female",age:"Adult",origin:"British",region:"London",style:"Crisp · Intelligent · Sardonic",pitch:1.12,rate:0.85,desc:"Sharp as a tack. Mildly disappointed by most things."},
  {id:"nana",name:"Nana",emoji:"🧶",gender:"Female",age:"Elderly",origin:"British",region:"Yorkshire",style:"Gentle · Wise · Warm",pitch:1.02,rate:0.70,desc:"Warm elderly wisdom. Has seen everything twice."},
  {id:"colonel",name:"Colonel",emoji:"🎖️",gender:"Male",age:"Elderly",origin:"British",region:"London",style:"Commanding · Dignified · Veteran",pitch:0.80,rate:0.74,desc:"Authority earned through decades of experience."},
  {id:"pippa",name:"Pippa",emoji:"🎀",gender:"Female",age:"Teen",origin:"British",region:"London",style:"Bright · Cheerful · Young",pitch:1.25,rate:0.95,desc:"Fresh and warm. Natural young British energy."},
  {id:"archie",name:"Archie",emoji:"⚽",gender:"Male",age:"Teen",origin:"British",region:"Manchester",style:"Casual · Friendly · Teen",pitch:1.05,rate:0.98,desc:"Relaxed and genuine. Sounds like a real teenager."},
  {id:"ewan",name:"Ewan",emoji:"🏴",gender:"Male",age:"Adult",origin:"Scottish",region:"Edinburgh",style:"Warm · Rugged · Sincere",pitch:0.92,rate:0.82,desc:"Deep warm Scottish sincerity."},
  {id:"fiona",name:"Fiona",emoji:"🌿",gender:"Female",age:"Adult",origin:"Scottish",region:"Glasgow",style:"Lilting · Warm · Storyteller",pitch:1.10,rate:0.84,desc:"Beautiful Scottish lilt."},
  {id:"paddy",name:"Paddy",emoji:"☘️",gender:"Male",age:"Adult",origin:"Irish",region:"Dublin",style:"Charming · Witty · Warm",pitch:0.95,rate:0.88,desc:"Easy Irish charm."},
  {id:"siobhan",name:"Siobhan",emoji:"🌸",gender:"Female",age:"Adult",origin:"Irish",region:"Cork",style:"Gentle · Musical · Emotional",pitch:1.15,rate:0.82,desc:"Soft Irish voice with real emotional depth."},
  {id:"dafydd",name:"Dafydd",emoji:"🐉",gender:"Male",age:"Adult",origin:"Welsh",region:"Cardiff",style:"Musical · Passionate · Rich",pitch:0.90,rate:0.80,desc:"Rich Welsh musicality."},
  {id:"marcus",name:"Marcus",emoji:"⚡",gender:"Male",age:"Adult",origin:"American",region:"New York",style:"Deep · Cinematic · Commanding",pitch:0.72,rate:0.74,desc:"Big voice. When Marcus speaks people stop."},
  {id:"river",name:"River",emoji:"🌊",gender:"Male",age:"Adult",origin:"American",region:"Tennessee",style:"Warm · Intimate · Storyteller",pitch:0.98,rate:0.76,desc:"Unhurried Southern charm."},
  {id:"dakota",name:"Dakota",emoji:"🏔️",gender:"Female",age:"Adult",origin:"American",region:"Chicago",style:"Bold · Direct · Confident",pitch:1.05,rate:0.92,desc:"No filler. No hesitation."},
  {id:"wade",name:"Wade",emoji:"🤠",gender:"Male",age:"Adult",origin:"American",region:"Texas",style:"Laid Back · Humorous · Folksy",pitch:0.94,rate:0.85,desc:"Easy going Southern humour."},
  {id:"brooklyn",name:"Brooklyn",emoji:"🗽",gender:"Female",age:"Adult",origin:"American",region:"New York",style:"Fast · Sharp · City Energy",pitch:1.18,rate:1.10,desc:"Fast New York energy."},
  {id:"savannah",name:"Savannah",emoji:"🌺",gender:"Female",age:"Adult",origin:"American",region:"Georgia",style:"Sweet · Gracious · Warm",pitch:1.20,rate:0.84,desc:"Warm Southern grace."},
  {id:"madison",name:"Madison",emoji:"📱",gender:"Female",age:"Teen",origin:"American",region:"California",style:"Upbeat · Social · Natural",pitch:1.30,rate:1.08,desc:"Real American teenage energy."},
  {id:"tyler",name:"Tyler",emoji:"🎮",gender:"Male",age:"Teen",origin:"American",region:"Ohio",style:"Casual · Relatable · Teen",pitch:1.08,rate:1.00,desc:"Natural and unforced."},
  {id:"rosie",name:"Rosie",emoji:"🌼",gender:"Female",age:"Child",origin:"American",region:"Florida",style:"Sweet · Innocent · Child",pitch:1.45,rate:0.88,desc:"Young warm and sweet."},
  {id:"cooper",name:"Cooper",emoji:"🚂",gender:"Male",age:"Child",origin:"American",region:"Colorado",style:"Bright · Curious · Child",pitch:1.40,rate:0.90,desc:"Curious about everything."},
  {id:"grandma",name:"Grandma",emoji:"🫶",gender:"Female",age:"Elderly",origin:"American",region:"Virginia",style:"Warm · Loving · Elderly",pitch:1.00,rate:0.72,desc:"Full of love and life experience."},
  {id:"frank",name:"Frank",emoji:"🪑",gender:"Male",age:"Elderly",origin:"American",region:"New Jersey",style:"Gruff · Honest · Elder",pitch:0.78,rate:0.76,desc:"Says it straight."},
  {id:"sophia",name:"Sophia",emoji:"☀️",gender:"Female",age:"Adult",origin:"Australian",region:"Sydney",style:"Upbeat · Bright · Energetic",pitch:1.35,rate:1.12,desc:"Forward energy."},
  {id:"finn",name:"Finn",emoji:"🏄",gender:"Male",age:"Adult",origin:"Australian",region:"Melbourne",style:"Casual · Confident · Outdoorsy",pitch:0.95,rate:0.95,desc:"Relaxed Australian confidence."},
  {id:"aroha",name:"Aroha",emoji:"🌿",gender:"Female",age:"Adult",origin:"New Zealand",region:"Auckland",style:"Warm · Grounded · Sincere",pitch:1.10,rate:0.86,desc:"Natural sincerity."},
  {id:"amara",name:"Amara",emoji:"🌍",gender:"Female",age:"Adult",origin:"South African",region:"Cape Town",style:"Rich · Warm · Powerful",pitch:1.05,rate:0.84,desc:"Quiet power."},
  {id:"kofi",name:"Kofi",emoji:"🥁",gender:"Male",age:"Adult",origin:"West African",region:"Ghana",style:"Deep · Rhythmic · Storyteller",pitch:0.82,rate:0.78,desc:"Every sentence has music in it."},
  {id:"priya",name:"Priya",emoji:"🪷",gender:"Female",age:"Adult",origin:"Indian",region:"Mumbai",style:"Precise · Warm · Intelligent",pitch:1.15,rate:0.90,desc:"Warm and intelligent."},
  {id:"arjun",name:"Arjun",emoji:"🎯",gender:"Male",age:"Adult",origin:"Indian",region:"Delhi",style:"Authoritative · Clear · Measured",pitch:0.88,rate:0.85,desc:"Sounds like someone who knows exactly what they are talking about."},
  {id:"valentina",name:"Valentina",emoji:"🌹",gender:"Female",age:"Adult",origin:"Spanish",region:"Madrid",style:"Passionate · Warm · Expressive",pitch:1.18,rate:0.92,desc:"Everything sounds felt."},
  {id:"pierre",name:"Pierre",emoji:"🥐",gender:"Male",age:"Adult",origin:"French",region:"Paris",style:"Suave · Dry · Cultured",pitch:0.90,rate:0.84,desc:"Makes things sound interesting."},
  {id:"ingrid",name:"Ingrid",emoji:"❄️",gender:"Female",age:"Adult",origin:"Scandinavian",region:"Stockholm",style:"Clean · Cool · Direct",pitch:1.08,rate:0.88,desc:"No excess words."},
  {id:"yemi",name:"Yemi",emoji:"🌟",gender:"Female",age:"Adult",origin:"Nigerian",region:"Lagos",style:"Bold · Joyful · Energetic",pitch:1.25,rate:1.00,desc:"Life-affirming."},
  {id:"magnus",name:"Magnus",emoji:"🧙",gender:"Male",age:"Elderly",origin:"Fantasy",region:"Ancient",style:"Ancient · Wise · Epic",pitch:0.75,rate:0.70,desc:"Seen civilisations rise and fall."},
  {id:"nova",name:"Nova",emoji:"🤖",gender:"Female",age:"Adult",origin:"Neutral",region:"AI",style:"Clean · Precise · Neutral",pitch:1.12,rate:0.95,desc:"No accent. No emotion. No opinion."},
  {id:"hunter",name:"Hunter",emoji:"🎬",gender:"Male",age:"Adult",origin:"American",region:"Hollywood",style:"Trailer · Epic · Explosive",pitch:0.70,rate:0.80,desc:"Full movie trailer energy."},
  {id:"luna",name:"Luna",emoji:"🌙",gender:"Female",age:"Adult",origin:"Neutral",region:"ASMR",style:"Whisper · ASMR · Intimate",pitch:1.20,rate:0.65,desc:"Soft whisper. Complete calm."},
  {id:"professor",name:"Professor",emoji:"🎓",gender:"Male",age:"Elderly",origin:"British",region:"Oxford",style:"Academic · Thoughtful · Measured",pitch:0.88,rate:0.78,desc:"Distinguished. Precise."},
  {id:"hope",name:"Hope",emoji:"🌤️",gender:"Female",age:"Adult",origin:"American",region:"Heartfelt",style:"Tender · Gentle · Loving",pitch:1.15,rate:0.78,desc:"Pure tenderness."},
  {id:"storm",name:"Storm",emoji:"⛈️",gender:"Male",age:"Adult",origin:"American",region:"Intense",style:"Intense · Angry · Powerful",pitch:0.82,rate:1.00,desc:"Raw intensity."},
  {id:"joy",name:"Joy",emoji:"🎉",gender:"Female",age:"Adult",origin:"American",region:"Uplifting",style:"Excited · Joyful · Celebratory",pitch:1.40,rate:1.15,desc:"Pure infectious joy."},
  {id:"sage",name:"Sage",emoji:"🌿",gender:"Male",age:"Adult",origin:"Neutral",region:"Mindful",style:"Peaceful · Mindful · Grounded",pitch:0.95,rate:0.72,desc:"Deep calm."},
  {id:"faith",name:"Faith",emoji:"✨",gender:"Female",age:"Adult",origin:"American",region:"Gospel",style:"Inspirational · Gospel · Uplifting",pitch:1.18,rate:0.88,desc:"Gospel soul."},
  {id:"rebel",name:"Rebel",emoji:"✊",gender:"Female",age:"Teen",origin:"American",region:"Activist",style:"Fierce · Defiant · Young",pitch:1.22,rate:1.05,desc:"Will not back down."},
  {id:"blaze",name:"Blaze",emoji:"🔥",gender:"Male",age:"Adult",origin:"American",region:"Comedy",style:"Comic · Ridiculous · Energetic",pitch:1.05,rate:1.18,desc:"No dignity whatsoever."},
  {id:"remy",name:"Remy",emoji:"🎻",gender:"Male",age:"Adult",origin:"French",region:"Lyon",style:"Smooth · Romantic · Intimate",pitch:0.92,rate:0.80,desc:"Everything sounds like poetry."},
  {id:"zhara",name:"Zhara",emoji:"💫",gender:"Female",age:"Adult",origin:"Middle Eastern",region:"Dubai",style:"Elegant · Warm · Sophisticated",pitch:1.10,rate:0.85,desc:"Graceful and precise."},
  {id:"kai",name:"Kai",emoji:"🌊",gender:"Male",age:"Adult",origin:"Hawaiian",region:"Honolulu",style:"Relaxed · Warm · Soulful",pitch:0.96,rate:0.82,desc:"Unhurried ocean warmth."},
  {id:"sienna",name:"Sienna",emoji:"🎨",gender:"Female",age:"Adult",origin:"American",region:"New Orleans",style:"Soulful · Blues · Deep",pitch:1.05,rate:0.78,desc:"Every word feels lived-in."},
  {id:"atlas",name:"Atlas",emoji:"🌐",gender:"Male",age:"Adult",origin:"Neutral",region:"Epic",style:"Cinematic · Epic · Booming",pitch:0.68,rate:0.76,desc:"The voice of a thousand documentaries."},
  {id:"echo",name:"Echo",emoji:"🔮",gender:"Female",age:"Adult",origin:"Neutral",region:"Ethereal",style:"Ethereal · Dreamy · Otherworldly",pitch:1.22,rate:0.72,desc:"Sounds like it came from somewhere else."},
];

function P6Voice({ onSave }) {
  const [text,setText]=useState("");
  const [processed,setProcessed]=useState("");
  const [loading,setLoading]=useState(false);
  const [speaking,setSpeaking]=useState(false);
  const [saved,setSaved]=useState(false);
  const [copied,setCopied]=useState(false);
  const [showMVS,setShowMVS]=useState(false);
  const [selVoice,setSelVoice]=useState("james");
  const [search,setSearch]=useState("");
  const [filterGender,setFilterGender]=useState("All");
  const [filterAge,setFilterAge]=useState("All");
  const [filterOrigin,setFilterOrigin]=useState("All");
  const [speed,setSpeed]=useState(0.82);
  const [pitchV,setPitchV]=useState(1.0);
  const [pauseLen,setPauseLen]=useState(700);
  const [volume,setVolume]=useState(1.0);
  const [activeTab,setActiveTab]=useState("speak");
  const [sysVoices,setSysVoices]=useState([]);
  const [audioUrl,setAudioUrl]=useState("");
  const [audioSaved,setAudioSaved]=useState(false);
  const chunksRef=useRef([]);
  const idxRef=useRef(0);
  const timerRef=useRef(null);

  useEffect(()=>{
    const load=()=>setSysVoices(window.speechSynthesis.getVoices().filter(v=>v.lang.startsWith("en")));
    load(); window.speechSynthesis.onvoiceschanged=load;
    return()=>{window.speechSynthesis.cancel();if(timerRef.current)clearTimeout(timerRef.current);};
  },[]);

  const ORIGINS=["All","British","Scottish","Irish","Welsh","American","Australian","New Zealand","South African","West African","Indian","Spanish","French","Scandinavian","Nigerian","Fantasy","Neutral"];
  const AGES=["All","Child","Teen","Adult","Elderly"];
  const GENDERS=["All","Male","Female"];

  const filtered=VOICE_CHARACTERS.filter(v=>{
    const mg=filterGender==="All"||v.gender===filterGender;
    const ma=filterAge==="All"||v.age===filterAge;
    const mo=filterOrigin==="All"||v.origin===filterOrigin;
    const ms=search===""||v.name.toLowerCase().includes(search.toLowerCase())||v.style.toLowerCase().includes(search.toLowerCase());
    return mg&&ma&&mo&&ms;
  });
  const selected=VOICE_CHARACTERS.find(v=>v.id===selVoice)||VOICE_CHARACTERS[0];

  const pickSysVoice=(vc)=>{
    if(!sysVoices.length)return null;
    if(["British","Scottish","Irish","Welsh"].includes(vc.origin)){
      if(vc.gender==="Male")return sysVoices.find(v=>/daniel|oliver|arthur/i.test(v.name)&&v.lang==="en-GB")||sysVoices.find(v=>v.lang==="en-GB"&&!/female|samantha|karen/i.test(v.name));
      return sysVoices.find(v=>/kate|serena|moira/i.test(v.name))||sysVoices.find(v=>v.lang==="en-GB");
    }
    if(["Australian","New Zealand"].includes(vc.origin))return sysVoices.find(v=>v.lang==="en-AU")||sysVoices.find(v=>/karen/i.test(v.name));
    if(vc.gender==="Female")return sysVoices.find(v=>/samantha|victoria|zira/i.test(v.name))||sysVoices[0];
    return sysVoices.find(v=>/david|alex|fred/i.test(v.name))||sysVoices.find(v=>v.lang==="en-US")||sysVoices[0];
  };

  const buildChunks=(txt)=>{
    let expanded=txt
      .replace(/\bMr\./g,"Mister").replace(/\bMrs\./g,"Missus").replace(/\bDr\./g,"Doctor")
      .replace(/\bSt\./g,"Saint").replace(/\bvs\./g,"versus").replace(/\betc\./g,"et cetera")
      .replace(/\bAI\b/g,"A I").replace(/\bUI\b/g,"U I").replace(/\bAPI\b/g,"A P I")
      .replace(/([0-9]+)/g," $1 ")
      .replace(/—/g," [breath] ").replace(/-{2}/g," [breath] ").replace(/\.\.\./g," [ellipsis] ")
      .replace(/\*\*(.+?)\*\*/g,"$1").replace(/\*(.+?)\*/g,"$1")
      .replace(/\s+/g," ").trim();
    const raw=expanded.match(/[^.!?;,\n\[\]]+[.!?;,\n]+|\[breath\]|\[ellipsis\]|[^.!?;,\n\[\]]+$/g)||[expanded];
    const chunks=[];
    for(const s of raw){
      const t=s.trim();
      if(!t)continue;
      if(t==="[breath]"){chunks.push({text:"",pause:0,type:"breath"});continue;}
      if(t==="[ellipsis]"){chunks.push({text:"",pause:0,type:"ellipsis"});continue;}
      const endsQuestion=/\?/.test(t),endsExclaim=/!/.test(t),endsStrong=/[.!?]$/.test(t),endsComma=/[,;]$/.test(t);
      chunks.push({text:t,pause:0,type:endsQuestion?"question":endsExclaim?"exclaim":endsStrong?"sentence":endsComma?"clause":"fragment"});
    }
    return chunks.length?chunks:[{text:expanded,pause:0,type:"sentence"}];
  };

  const speakNow=(txt)=>{
    window.speechSynthesis.cancel();if(timerRef.current)clearTimeout(timerRef.current);
    const chunks=buildChunks(txt);chunksRef.current=chunks;idxRef.current=0;setSpeaking(true);
    const baseRate=speed*(selected.rate||0.9);
    const basePitch=pitchV*(selected.pitch||1.0);
    const totalChunks=chunks.length;
    const next=()=>{
      const idx=idxRef.current;
      if(idx>=chunksRef.current.length){setSpeaking(false);return;}
      const chunk=chunksRef.current[idx];
      if(chunk.type==="breath"||chunk.type==="ellipsis"||!chunk.text){
        idxRef.current=idx+1;timerRef.current=setTimeout(next,pauseLen*0.6);return;
      }
      const liveVoices=window.speechSynthesis.getVoices().filter(v=>v.lang.startsWith("en"));
      const liveV=liveVoices.length>0?pickSysVoice(selected):null;
      const utt=new SpeechSynthesisUtterance(chunk.text);
      if(liveV)utt.voice=liveV;
      utt.volume=volume;
      // Natural human prosody — position-aware pitch/rate arc
      const isFirst=idx===0,isLast=idx===totalChunks-1;
      const posInSentence=idx/Math.max(totalChunks,1);
      // Humans slow down at sentence starts/ends, speed up mid-thought
      const ratePos=isFirst?-0.04:isLast?-0.07:posInSentence>0.35&&posInSentence<0.65?0.03:-0.01;
      const rVar=[0,0.018,-0.022,0.012,-0.016,0.024,-0.008,0.020,-0.014,0.010];
      const pVar=[0,0.025,-0.018,0.035,-0.022,0.015,-0.030,0.020,-0.010,0.028];
      // Pitch arc — rises naturally mid-sentence, falls at end
      const pitchArc=Math.sin(posInSentence*Math.PI)*0.055;
      // Question rises, exclaim punches, final sentence falls, otherwise natural arc
      let pitchMod=chunk.type==="question"?0.14:chunk.type==="exclaim"?0.10:isLast?-0.09:pitchArc;
      // Emphasis detection — ALL CAPS or after colon/dash gets extra punch
      const hasEmphasis=/[A-Z]{2,}/.test(chunk.text)||/[:—]/.test(chunk.text);
      const emphMod=hasEmphasis?0.04:0;
      utt.rate=Math.max(0.1,Math.min(2.0,baseRate+ratePos+rVar[idx%rVar.length]));
      utt.pitch=Math.max(0.1,Math.min(2.0,basePitch+pVar[idx%pVar.length]+pitchMod+emphMod));
      // Natural pause rhythm — mirrors real speech
      const afterPause=chunk.type==="question"?Math.round(pauseLen*1.25):
        chunk.type==="exclaim"?Math.round(pauseLen*0.85):
        isLast?Math.round(pauseLen*1.5):
        chunk.type==="sentence"?pauseLen:
        chunk.type==="clause"?Math.round(pauseLen*0.48):
        Math.round(pauseLen*0.16);
      utt.onend=()=>{idxRef.current=idx+1;timerRef.current=setTimeout(next,afterPause);};
      utt.onerror=()=>{idxRef.current=idx+1;next();};
      window.speechSynthesis.speak(utt);
    };
    const voices=window.speechSynthesis.getVoices();
    if(voices.length>0){setTimeout(()=>next(),50);}
    else{window.speechSynthesis.onvoiceschanged=()=>{window.speechSynthesis.onvoiceschanged=null;setTimeout(()=>next(),50);};}
  };

  const processAndSpeak=async()=>{
    if(!text.trim())return;
    setLoading(true);setProcessed("");setSaved(false);
    try{
      const res=await fetch("https://yrshnpjvplkwbpmmzwvb.supabase.co/functions/v1/claude-proxy",{method:"POST",headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,messages:[{role:"user",content:`You are a speech coach preparing text for TTS. Speaker: ${selected.name} — ${selected.style}. Break into short sentences, add commas for natural pauses, spell out numbers. Output ONLY the reformatted text:\n\n${text}`}]})});
      const d=await res.json();
      const out=d.content&&d.content[0]?d.content[0].text.trim():text;
      setProcessed(out);setActiveTab("result");speakNow(out);
    }catch(e){setProcessed(text);speakNow(text);}
    setLoading(false);
  };

  const stop=()=>{window.speechSynthesis.cancel();if(timerRef.current)clearTimeout(timerRef.current);setSpeaking(false);};
  const inp={width:"100%",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"12px 14px",color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif",lineHeight:1.9};

  return (
    <div style={{...Sp}}>
      {showMVS&&<MusicVideoStudio onClose={()=>setShowMVS(false)} onSave={onSave}/>}
      <div style={{padding:"12px 18px",borderBottom:`1px solid ${GOLDDIM}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:11,color:GOLD,letterSpacing:4,fontWeight:700}}>AI WORKSTATION 02 — CINEMA VOICE ENGINE</div>
          <h1 style={{...H1,fontSize:24,margin:0}}>TEXT TO LIFELIKE SPEECH</h1>
        </div>
        <button onClick={()=>setShowMVS(true)} style={{...G("gold",true)}}>
          🎬 MUSIC VIDEO STUDIO
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"290px 1fr",minHeight:"calc(100vh - 120px)"}}>
        <div style={{borderRight:`1px solid ${GOLDDIM}`,background:"#030303",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"10px 10px 6px"}}>
            <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:8}}>VOICE LIBRARY — {filtered.length} / {VOICE_CHARACTERS.length}</div>
            <div style={{marginBottom:5}}>
              <div style={{color:GOLDDIM,fontSize:9,letterSpacing:2,marginBottom:3}}>GENDER</div>
              <div style={{display:"flex",gap:4}}>
                {GENDERS.map(g=><button key={g} onClick={()=>setFilterGender(g)} style={{flex:1,background:filterGender===g?GOLD:"#111",border:`1px solid ${filterGender===g?"#000":GOLDDIM}`,color:filterGender===g?"#000":WHITE,padding:"3px 0",cursor:"pointer",fontSize:10,fontWeight:900}}>{g}</button>)}
              </div>
            </div>
            <div style={{marginBottom:5}}>
              <div style={{color:GOLDDIM,fontSize:9,letterSpacing:2,marginBottom:3}}>AGE</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                {AGES.map(a=><button key={a} onClick={()=>setFilterAge(a)} style={{background:filterAge===a?GOLD:"#111",border:`1px solid ${filterAge===a?"#000":GOLDDIM}`,color:filterAge===a?"#000":WHITE,padding:"2px 8px",cursor:"pointer",fontSize:9,fontWeight:900}}>{a}</button>)}
              </div>
            </div>
            <div style={{marginBottom:6}}>
              <div style={{color:GOLDDIM,fontSize:9,letterSpacing:2,marginBottom:3}}>ORIGIN</div>
              <select value={filterOrigin} onChange={e=>setFilterOrigin(e.target.value)} style={{width:"100%",background:"#111",border:`1px solid ${GOLDDIM}`,color:WHITE,padding:"4px 8px",fontSize:11,outline:"none"}}>
                {ORIGINS.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search voices..." style={{...inp,padding:"6px 10px",fontSize:11,height:30,marginBottom:0}}/>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"6px 6px 80px"}}>
            {filtered.map(v=>(
              <div key={v.id} onClick={()=>setSelVoice(v.id)}
                style={{padding:"8px 10px",marginBottom:3,background:selVoice===v.id?"#0a0800":"#000",border:`1px solid ${selVoice===v.id?GOLD:GOLDDIM}`,cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <span style={{fontSize:14}}>{v.emoji}</span>
                    <span style={{color:selVoice===v.id?GOLD:WHITE,fontSize:12,fontWeight:900}}>{v.name}</span>
                  </div>
                  <button onClick={e=>{e.stopPropagation();const utt=new SpeechSynthesisUtterance("Hi I am "+v.name+". "+v.desc);const sv=pickSysVoice(v);if(sv)utt.voice=sv;utt.pitch=v.pitch||1.0;utt.rate=v.rate||0.9;window.speechSynthesis.cancel();window.speechSynthesis.speak(utt);}} style={{background:"none",border:`1px solid ${GOLDDIM}`,color:GOLD,padding:"1px 6px",cursor:"pointer",fontSize:9,fontWeight:900}}>▶</button>
                </div>
                <div style={{color:GOLD,fontSize:8,letterSpacing:1}}>{v.style}</div>
                <div style={{color:DIM,fontSize:9}}>{v.age} · {v.gender} · {v.origin}</div>
                {selVoice===v.id&&<div style={{color:"#22c55e",fontSize:8,fontWeight:900,letterSpacing:2,marginTop:2}}>✓ SELECTED</div>}
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderBottom:`1px solid ${GOLDDIM}`}}>
            {[["speak","🎙 SPEAK"],["result","✦ RESULT"],["settings","🎚 SLIDERS"]].map(([t,l])=>(
              <button key={t} onClick={()=>setActiveTab(t)} style={{background:activeTab===t?"#0a0800":"none",border:"none",borderBottom:activeTab===t?`2px solid ${GOLD}`:"2px solid transparent",color:activeTab===t?GOLD:WHITE,padding:"12px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2}}>{l}</button>
            ))}
          </div>
          <div style={{flex:1,padding:"16px 20px",overflowY:"auto"}}>
            {activeTab==="speak"&&(
              <div>
                <div style={{...Card(),marginBottom:14,background:"#050500",border:`1px solid ${GOLD}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:28}}>{selected.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{color:GOLD,fontSize:14,fontWeight:900,letterSpacing:2}}>{selected.name} <span style={{color:DIM,fontSize:11,fontWeight:400}}>— {selected.region}, {selected.origin}</span></div>
                      <div style={{color:WHITE,fontSize:11,marginTop:2}}>{selected.style}</div>
                    </div>
                  </div>
                </div>
                <textarea value={text} onChange={e=>{setText(e.target.value);setProcessed("");}} placeholder={"Paste your narration here..."} style={{...inp,height:"calc(100vh - 440px)",resize:"none",marginBottom:12}}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <button onClick={processAndSpeak} disabled={loading||speaking||!text.trim()} style={{...G("gold",false),padding:"16px",fontSize:12,letterSpacing:2,opacity:loading||speaking||!text.trim()?0.5:1}}>{loading?"⟳ AI PREPARING...":"✦ PREPARE & SPEAK"}</button>
                  <button onClick={speaking?stop:()=>speakNow(text)} disabled={!text.trim()} style={{...G("out",false),padding:"16px",fontSize:12,opacity:!text.trim()?0.5:1,borderColor:speaking?"#ef4444":undefined,color:speaking?"#ef4444":undefined}}>{speaking?"⏹ STOP":"▶ SPEAK NOW"}</button>
                </div>
              </div>
            )}
            {activeTab==="result"&&(
              <div>
                <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:8}}>AI PREPARED — {selected.emoji} {selected.name}</div>
                {processed?(
                  <div>
                    <textarea value={processed} onChange={e=>setProcessed(e.target.value)} style={{...inp,height:"calc(100vh - 460px)",resize:"none",marginBottom:12,borderColor:GOLD,fontSize:12}}/>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
                      <button onClick={()=>speakNow(processed)} disabled={speaking} style={{...G("gold",false),padding:"12px",opacity:speaking?0.5:1}}>{speaking?"● SPEAKING":"▶ PLAY"}</button>
                      <button onClick={stop} style={{...G("out",false),padding:"12px"}}>⏹ STOP</button>
                      <button onClick={()=>{if(onSave)onSave({id:Date.now()+Math.random(),name:"Narration — "+selected.name,type:"audio/narration",url:audioUrl||"",content:processed});setSaved(true);}} style={{...G("gold",false),padding:"12px"}}>💾 SAVE</button>
                    </div>
                    <button onClick={()=>{navigator.clipboard&&navigator.clipboard.writeText(processed);setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{...G("out",true),width:"100%",fontSize:11}}>{copied?"✓ COPIED":"📋 COPY TEXT"}</button>
                    {saved&&<div style={{marginTop:8,background:"#0a2a0a",border:"1px solid #22c55e",padding:"10px",color:"#22c55e",fontWeight:900,fontSize:11,letterSpacing:2,textAlign:"center"}}>✓ SAVED TO MEDIA LIBRARY</div>}
                  </div>
                ):(
                  <div style={{textAlign:"center",padding:"80px 20px",color:GOLDDIM}}>
                    <div style={{fontSize:40,marginBottom:12}}>🎙</div>
                    <div style={{fontSize:13,letterSpacing:2}}>Paste text on the SPEAK tab then hit PREPARE & SPEAK</div>
                  </div>
                )}
              </div>
            )}
            {activeTab==="settings"&&(
              <div>
                <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:16}}>{selected.emoji} {selected.name} — VOICE SLIDERS</div>
                {[
                  ["SPEED",speed,setSpeed,0.30,1.40,0.01,speed<0.55?"Very Slow":speed<0.75?"Slow":speed<0.90?"Natural":"Fast","0.3x","1.4x"],
                  ["PITCH",pitchV,setPitchV,0.50,2.00,0.01,pitchV<0.75?"Very Deep":pitchV<0.90?"Deep":pitchV<1.05?"Natural":"High","0.5","2.0"],
                  ["VOLUME",volume,setVolume,0.1,1.0,0.01,Math.round(volume*100)+"%","Quiet","Full"],
                  ["PAUSE (ms)",pauseLen,setPauseLen,0,2500,50,pauseLen<300?"Urgent":pauseLen<600?"Natural":pauseLen<1500?"Dramatic":"Deadpan","0ms","2500ms"],
                ].map(([label,val,setter,min,max,step,desc,lo,hi])=>(
                  <div key={label} style={{...Card(),marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{color:GOLD,fontSize:11,fontWeight:900,letterSpacing:2}}>{label}</span>
                      <span style={{color:WHITE,fontSize:11}}>{desc}</span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={val} onChange={e=>setter(+e.target.value)} style={{width:"100%",accentColor:GOLD}}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                      <span style={{color:DIM,fontSize:10}}>{lo}</span>
                      <span style={{color:DIM,fontSize:10}}>{hi}</span>
                    </div>
                  </div>
                ))}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <button onClick={()=>{const utt=new SpeechSynthesisUtterance("Hello I am "+selected.name+". Testing your current settings.");const sv=pickSysVoice(selected);if(sv)utt.voice=sv;utt.rate=Math.max(0.1,Math.min(2.0,speed*(selected.rate||0.9)));utt.pitch=Math.max(0.1,Math.min(2.0,pitchV*(selected.pitch||1.0)));utt.volume=volume;window.speechSynthesis.cancel();window.speechSynthesis.speak(utt);}} style={{...G("gold",false),padding:"14px",fontSize:12}}>▶ TEST</button>
                  <button onClick={()=>{setSpeed(0.82);setPitchV(1.0);setVolume(1.0);setPauseLen(700);}} style={{...G("out",false),padding:"14px",fontSize:12}}>RESET</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function P8VideoGenerator({ onSave, user, filmDuration, setFilmDuration }) {
  const canvasRef=useRef(null);
  const videoRef=useRef(null);
  const svgRef=useRef(null);
  const [prompt,setPrompt]=useState("");
  const [title,setTitle]=useState("");
  const [duration,setDuration]=useState(30);
  // Plan-based max render duration (minutes)
  const PLAN_LIMITS={"Guest":30,"Creator":60,"Pro":120,"Studio":180,"Enterprise":180,"Studio Trial":180};
  const [generating,setGenerating]=useState(false);
  const [progress,setProgress]=useState(0);
  const [log,setLog]=useState([]);
  const [videoUrl,setVideoUrl]=useState("");
  const [saved,setSaved]=useState(false);
  const [refMedia,setRefMedia]=useState(null);
  const [refMediaType,setRefMediaType]=useState("");
  const [refDataUrl,setRefDataUrl]=useState(null);
  const [showText,setShowText]=useState(false);
  const refMediaRef=useRef(null);
  const addLog=(msg)=>setLog(p=>[...p,msg]);

  const EXAMPLES=[
    "Earth rotating slowly in deep space. City lights blazing gold on the night side. Stars everywhere.",
    "A woman places a folded paper into a wooden ballot box. Morning light from a window. Women watching behind her with tears.",
    "Night city skyline. Rain. Neon reflections on wet streets. A lone figure walks under a streetlight.",
    "Underwater coral reef. Vivid tropical fish. Light shafts from the surface above.",
    "An elderly couple on a park bench in autumn. Golden leaves falling. Neither speaking.",
    "Vast dark server room. Three people huddled around a single warm lantern. Faces lit gold.",
    "Cave interior. Torchlight. Ancient paintings on the walls. A figure looking at camera.",
    "Dawn breaking over a savanna. A silhouetted human figure stands at the horizon.",
  ];

  const handleRefUpload=(e)=>{
    const f=e.target.files&&e.target.files[0];
    if(!f)return;
    const url=URL.createObjectURL(f);
    setRefMedia(url);
    setRefMediaType(f.type.startsWith("video")?"video":"image");
    // Compress image to under 4MB before sending to Claude
    const img=new Image();
    img.onload=()=>{
      const MAX=1200;
      let w=img.width,h=img.height;
      if(w>MAX||h>MAX){const r=Math.min(MAX/w,MAX/h);w=Math.round(w*r);h=Math.round(h*r);}
      const cv=document.createElement("canvas");cv.width=w;cv.height=h;
      const cx=cv.getContext("2d");cx.drawImage(img,0,0,w,h);
      // Compress to jpeg at 0.7 quality — keeps under 5MB
      const dataUrl=cv.toDataURL("image/jpeg",0.7);
      setRefDataUrl(dataUrl);
    };
    img.src=url;
  };

  const generateVideo=async()=>{
    if(!prompt.trim()){alert("Describe your scene first");return;}
    setGenerating(true);setProgress(0);setLog([]);setVideoUrl("");setSaved(false);
    addLog("Director reading your scene...");
    setProgress(8);

    try{
      // Claude writes complete canvas rendering code for this specific scene
      // Using photorealistic techniques: proper gradients, lighting, shadows, depth
      const refInstruction=refDataUrl
        ? "\n\nIMPORTANT: The user has uploaded a reference image (included above). Study it carefully and match its exact visual style, colour palette, lighting direction, mood, atmosphere, and composition in every frame you render."
        : "";

      const directorPrompt=`You are the MandaStrong Cinema Engine. Write JavaScript canvas rendering code that creates a CINEMATIC, PHOTOREALISTIC scene.

SCENE: "${prompt}"
DURATION: ${duration} seconds${refInstruction}

Write a function: drawFrame(ctx, W, H, t, sec)
Where t=0 to 1 (progress), sec=current second, W=1920, H=1080

CRITICAL REQUIREMENTS FOR PHOTOREALISTIC OUTPUT:

LIGHTING - must be physically accurate:
- Use multiple radialGradient light sources with proper falloff
- Ambient occlusion: darker in corners and crevices
- Rim lighting on figures: bright edge glow from light source direction
- Specular highlights: bright spots on reflective surfaces
- Volumetric light: god rays as semi-transparent gradients

HUMANS - must look real:
- Skin tones: use rgba with warm peachy tones e.g. rgba(220,170,130,1)
- Face: oval for head, smaller oval for face area, dots for eyes, curve for lips
- Hair: filled path with natural hair colours
- Clothing: solid fills with shadow and highlight gradients
- Body proportions: head=H*0.06, torso=H*0.2, legs=H*0.25
- Multiple people: vary sizes, positions, clothing colours
- Hands: small ovals at end of arm lines
- Cast shadows on ground beneath each figure

ENVIRONMENTS - must look real:
- Sky: multi-stop gradient from deep colour at top to lighter at horizon
- Ground/floor: textured with subtle noise pattern via many small rect fills
- Buildings: boxes with window grids, varying heights, perspective depth
- Water: animated sine wave layers with transparency and reflection gradient
- Trees/plants: layered canopy shapes with varying greens
- Fire/candles: animated flickering radialGradient in orange/yellow
- Fog/atmosphere: semi-transparent overlay gradients

DEPTH & PERSPECTIVE:
- Far objects: smaller, less saturated, more hazy
- Near objects: larger, sharper, more saturated
- Ground plane: trapezoid perspective
- Atmospheric haze: addColorStop near horizon with rgba(200,200,220,0.3)

CINEMATIC MOTION:
- Camera parallax: far elements move slower than near ones (multiply by t)
- Breathing: subtle scale oscillation using Math.sin(sec*0.5)
- Wind: leaves/particles drift with sine curves
- Light flicker: candles/fires use Math.sin(sec*7+Math.random()*0.1)
- Slow zoom: scale canvas slightly over time

COLOUR GRADING:
- Apply overall colour grade at end using globalCompositeOperation
- Warm scenes: slight orange overlay at 0.08 opacity
- Night scenes: blue overlay
- Cinematic: slight teal shadows, orange highlights (complementary grading)

Return ONLY the JavaScript function starting with:
function drawFrame(ctx, W, H, t, sec) {`;

      // Build message — include image if uploaded so Claude can actually SEE it
      const msgContent=[];
      if(refDataUrl&&refDataUrl.startsWith("data:image")){
        // Extract base64 and media type
        const mType=refDataUrl.split(";")[0].split(":")[1]||"image/jpeg";
        const b64=refDataUrl.split(",")[1];
        msgContent.push({type:"image",source:{type:"base64",media_type:mType,data:b64}});
        msgContent.push({type:"text",text:"This is the reference image the user uploaded. It will be drawn directly onto the canvas as the background. Your job is to write OVERLAY code only — do NOT redraw the background. Instead add: atmospheric effects (fog, haze, light shafts), particle systems (dust, rain, snow, embers), colour grading overlay, subtle motion effects. The background image will already be there. Just add cinematic atmosphere on top.\n\nScene context: "+prompt+"\n\nWrite function drawFrame(ctx,W,H,t,sec) that adds ONLY atmospheric overlays on top of an existing background image. Keep ctx.clearRect out — the image is already drawn."});
      } else {
        msgContent.push({type:"text",text:directorPrompt});
      }
      const res=await fetch("https://yrshnpjvplkwbpmmzwvb.supabase.co/functions/v1/claude-proxy",{
        method:"POST",
        headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,
          messages:[{role:"user",content:msgContent}]})
      });

      const d=await res.json();
      if(d.error){addLog("Error: "+d.error.message);setGenerating(false);return;}

      let fnCode=d.content&&d.content[0]?d.content[0].text.trim():"";
      fnCode=fnCode.replace(new RegExp(String.fromCharCode(96,96,96)+"javascript|"+String.fromCharCode(96,96,96)+"js|"+String.fromCharCode(96,96,96),"g"),"").trim();
      const fnStart=fnCode.indexOf("function drawFrame");
      if(fnStart>0)fnCode=fnCode.slice(fnStart);

      addLog("Scene designed. Rendering frames...");setProgress(22);

      // If reference image exists — use it as the actual base frame
      // Claude only adds cinematic motion/atmosphere ON TOP
      let refImg=null;
      if(refMedia){
        refImg=await new Promise(resolve=>{
          const img=new Image();
          img.crossOrigin="anonymous";
          img.onload=()=>resolve(img);
          img.onerror=()=>resolve(null);
          img.src=refMedia;
        });
        addLog("Reference image loaded — using as scene base.");
      }

      // Compile the function
      let drawFn;
      try{
        const body=fnCode.replace(/^function drawFrame\s*\([^)]*\)\s*\{/,"").slice(0,-1);
        drawFn=new Function("ctx","W","H","t","sec",body);
      }catch(e){
        addLog("Retrying with simplified renderer...");
        const retry=await fetch("https://yrshnpjvplkwbpmmzwvb.supabase.co/functions/v1/claude-proxy",{
          method:"POST",
          headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
          body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,
            messages:[{role:"user",content:`Write a cinematic canvas renderer for: "${prompt}". Function: function drawFrame(ctx,W,H,t,sec). Use photorealistic gradients, proper human figures with skin tones, depth, lighting. Return only the function.`}]})
        });
        const rd=await retry.json();
        let rc=rd.content&&rd.content[0]?rd.content[0].text.trim():"";
        rc=rc.replace(new RegExp(String.fromCharCode(96,96,96)+"javascript|"+String.fromCharCode(96,96,96)+"js|"+String.fromCharCode(96,96,96),"g"),"").trim();
        const ri=rc.indexOf("function drawFrame");if(ri>0)rc=rc.slice(ri);
        try{
          const rb=rc.replace(/^function drawFrame\s*\([^)]*\)\s*\{/,"").slice(0,-1);
          drawFn=new Function("ctx","W","H","t","sec",rb);
        }catch(e2){addLog("Render failed: "+e2.message);setGenerating(false);return;}
      }

      // Set up canvas and recorder
      const canvas=canvasRef.current;
      canvas.width=1920;canvas.height=1080;
      const ctx=canvas.getContext("2d");

      // Preview first frame
      try{drawFn(ctx,1920,1080,0,0);}catch(e){}
      await new Promise(r=>setTimeout(r,300));

      const fps=12;
      const msPerFrame=Math.round(1000/fps);
      const totalFrames=duration*fps;
      const mimeType=MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm";
      const stream=canvas.captureStream(fps);
      const recorder=new MediaRecorder(stream,{mimeType,videoBitsPerSecond:15000000});
      const chunks=[];
      recorder.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data);};
      recorder.start(msPerFrame);
      addLog("Camera rolling — "+duration+"s...");
      addLog("Est. "+Math.round(duration*1.3)+"s to complete...");

      await new Promise(resolve=>{
        let frame=0;
        const startTime=performance.now();
        const renderNext=()=>{
          if(frame>=totalFrames){resolve(null);return;}
          const t=frame/totalFrames;
          const sec=frame/fps;
          try{
            ctx.clearRect(0,0,1920,1080);
            // If reference image — draw it as the base layer first
            if(refImg){
              // Subtle Ken Burns effect — slow zoom in over the clip
              const scale=1+t*0.04;
              const ox=(1920*(scale-1))/2;
              const oy=(1080*(scale-1))/2;
              ctx.drawImage(refImg,-ox,-oy,1920*scale,1080*scale);
              // Now run Claude's overlay code on top (lighting, particles, atmosphere)
              try{drawFn(ctx,1920,1080,t,sec);}catch(oe){}
            } else {
              drawFn(ctx,1920,1080,t,sec);
            }
            // Vignette
            const vig=ctx.createRadialGradient(960,540,200,960,540,1100);
            vig.addColorStop(0,"rgba(0,0,0,0)");vig.addColorStop(1,"rgba(0,0,0,0.85)");
            ctx.fillStyle=vig;ctx.fillRect(0,0,1920,1080);
            // Letterbox
            ctx.fillStyle="#000";ctx.fillRect(0,0,1920,78);ctx.fillRect(0,1002,1920,78);
            // Film grain
            for(let g=0;g<80;g++){
              ctx.fillStyle=`rgba(${Math.random()>0.5?180:20},${Math.random()>0.5?180:20},${Math.random()>0.5?180:20},0.012)`;
              ctx.fillRect(Math.random()*1920,Math.random()*1080,1,1);
            }
            // End card
            if(t>0.9){
              const a=(t-0.9)/0.1;
              ctx.globalAlpha=a*0.9;
              ctx.fillStyle=`rgba(0,0,0,${a*0.7})`;ctx.fillRect(0,0,1920,1080);
              ctx.fillStyle="#e8c96d";ctx.font="900 46px Arial Black";ctx.textAlign="center";
              ctx.globalAlpha=1;
            }
          }catch(e){
            ctx.fillStyle="#050200";ctx.fillRect(0,0,1920,1080);
          }
          setProgress(22+Math.round((frame/totalFrames)*73));
          if(frame%(fps*4)===0)addLog("  "+Math.round(sec)+"s / "+duration+"s...");
          frame++;
          const next=startTime+(frame*msPerFrame);
          setTimeout(renderNext,Math.max(4,next-performance.now()));
        };
        renderNext();
      });

      setProgress(97);addLog("Finalising...");
      await new Promise(r=>setTimeout(r,800));
      recorder.stop();
      await new Promise(r=>{recorder.onstop=r;});
      const blob=new Blob(chunks,{type:mimeType});
      const url=URL.createObjectURL(blob);
      setVideoUrl(url);setProgress(100);
      addLog("✓ Scene complete — "+(blob.size/1024/1024).toFixed(1)+"MB · "+duration+"s");
      setTimeout(()=>{if(videoRef.current){videoRef.current.src=url;videoRef.current.load();videoRef.current.play().catch(()=>{});}},300);

    }catch(e){addLog("Error: "+e.message);console.error(e);}
    setGenerating(false);
  };

  const saveToLibrary=async()=>{
    if(!videoUrl)return;
    try{
      const r=await fetch(videoUrl);const b=await r.blob();
      const fn=(title||"Scene")+"_"+duration+"s.webm";
      const clipId="clip_"+Date.now();
      // Save blob to IndexedDB for persistence across page reloads
      await saveClipToDB(clipId,b,fn,"video/webm");
      const file=new File([b],fn,{type:"video/webm"});
      const freshUrl=URL.createObjectURL(file);
      if(onSave)onSave({id:clipId,name:fn,type:"video/webm",url:freshUrl,file,dbId:clipId});
    }catch(e){if(onSave)onSave({id:Date.now()+Math.random(),name:(title||"Scene")+"_"+duration+"s.webm",type:"video/webm",url:videoUrl});}
    setSaved(true);
  };

  return (
    <div style={{minHeight:"100vh",background:"#000",color:WHITE,fontFamily:"'Rajdhani',sans-serif",paddingBottom:160}}>
      <canvas ref={canvasRef} style={{display:"none"}}/>
      <div style={{padding:"12px 20px",borderBottom:`1px solid ${GOLDDIM}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:11,color:GOLD,letterSpacing:4,fontWeight:700}}>MANDASTRONG CINEMA ENGINE · SCENE GENERATION · CLAUDE POWERED</div>
          <h1 style={{fontFamily:"'Cinzel',serif",color:GOLD,letterSpacing:5,margin:0,fontSize:24,textTransform:"uppercase"}}>VIDEO GENERATOR</h1>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{color:GOLD,fontSize:11,fontWeight:700,letterSpacing:2}}>✦ ANY PROMPT · ANY SCENE · ANY SUBJECT</div>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"#0a0800",border:`1px solid ${GOLDDIM}`,padding:"4px 12px"}}>
            <span style={{color:GOLD,fontSize:10,fontWeight:900,letterSpacing:2,whiteSpace:"nowrap"}}>FILM: {filmDuration||60} MIN</span>
            <input type="range" min={0} max={180} step={30} value={filmDuration||60} onChange={e=>setFilmDuration(+e.target.value)} style={{width:180,accentColor:GOLD}}/>
            <div style={{display:"flex",gap:4}}>
              {[60,90,180].map(m=><button key={m} onClick={()=>setFilmDuration(m)} style={{background:filmDuration===m?GOLD:"#111",border:`1px solid ${filmDuration===m?"#000":GOLDDIM}`,color:filmDuration===m?"#000":WHITE,padding:"2px 8px",cursor:"pointer",fontSize:10,fontWeight:900,fontFamily:"'Rajdhani',sans-serif"}}>{m}m</button>)}
            </div>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 420px",minHeight:"calc(100vh - 120px)"}}>
        <div style={{padding:20,overflowY:"auto"}}>
          <div style={{marginBottom:12}}>
            <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:6}}>SCENE TITLE</div>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. AI For Humanity — Chapter 1"
              style={{width:"100%",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"10px 14px",color:WHITE,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif"}}/>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:6}}>DESCRIBE YOUR SCENE</div>
            <textarea value={prompt} onChange={e=>setPrompt(e.target.value)}
              placeholder="Describe anything in plain English. Humans, environments, lighting, weather, mood. e.g. A woman in a heavy coat places a paper into a wooden ballot box. Morning light from the left. Women watching behind her with tears in their eyes."
              style={{width:"100%",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"12px 14px",color:WHITE,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif",lineHeight:1.9,height:140,resize:"none"}}/>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:8}}>QUICK EXAMPLES</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {EXAMPLES.map((ex,i)=>(
                <div key={i} onClick={()=>setPrompt(ex)}
                  style={{background:"#000",border:`1px solid ${GOLDDIM}`,padding:"8px 10px",cursor:"pointer",fontSize:10,color:DIM,lineHeight:1.6}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.color=WHITE;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=GOLDDIM;e.currentTarget.style.color=DIM;}}>
                  {ex.slice(0,70)}{ex.length>70?"...":""}
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"#0a0a0a",border:`1px solid ${GOLDDIM}`,padding:12,marginBottom:14}}>
            <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:6}}>⬆ UPLOAD REFERENCE IMAGE / VIDEO</div>
            <div style={{color:DIM,fontSize:10,marginBottom:8}}>Upload a reference and the engine will match its colours, lighting and mood exactly.</div>
            {refMedia?(
              <div style={{position:"relative",marginBottom:8}}>
                {refMediaType==="video"
                  ?<video src={refMedia} muted playsInline style={{width:"100%",height:80,objectFit:"cover",border:`1px solid ${GOLD}`}}/>
                  :<img src={refMedia} alt="ref" style={{width:"100%",height:80,objectFit:"cover",border:`1px solid ${GOLD}`}}/>}
                <button onClick={()=>{setRefMedia(null);setRefMediaType("");setRefDataUrl(null);}}
                  style={{position:"absolute",top:4,right:4,background:"#000",border:`1px solid ${GOLD}`,color:GOLD,padding:"1px 7px",cursor:"pointer",fontSize:10,fontWeight:900}}>✕</button>
                <div style={{color:"#22c55e",fontSize:9,fontWeight:900,letterSpacing:2,marginTop:4}}>✓ REFERENCE LOADED — ENGINE WILL MATCH THIS STYLE</div>
              </div>
            ):(
              <div onClick={()=>refMediaRef.current&&refMediaRef.current.click()}
                style={{border:`1px dashed ${GOLDDIM}`,padding:"12px",textAlign:"center",cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=GOLD}
                onMouseLeave={e=>e.currentTarget.style.borderColor=GOLDDIM}>
                <div style={{color:WHITE,fontSize:12,fontWeight:700}}>⬆ CLICK TO UPLOAD REFERENCE</div>
                <div style={{color:DIM,fontSize:10,marginTop:2}}>JPG · PNG · MP4 · WEBM</div>
              </div>
            )}
            <input ref={refMediaRef} type="file" accept="image/*,video/*" multiple style={{display:"none"}} onChange={handleRefUpload}/>
          </div>
          <div style={{background:"#0a0a0a",border:`1px solid ${GOLDDIM}`,padding:14,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{color:GOLD,fontSize:11,fontWeight:900,letterSpacing:2}}>DURATION</span>
              <span style={{color:WHITE,fontSize:11,fontWeight:900}}>{duration} SECONDS</span>
            </div>
            <input type="range" min={30} max={60} value={duration} onChange={e=>setDuration(+e.target.value)} style={{width:"100%",accentColor:GOLD}}/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
              <span style={{color:DIM,fontSize:10}}>30s</span><span style={{color:DIM,fontSize:10}}>60s</span>
            </div>
          </div>
          <button onClick={generateVideo} disabled={generating||!prompt.trim()}
            style={{background:`linear-gradient(135deg,#a07820,#e8c96d)`,border:"none",color:"#000",width:"100%",padding:"20px",fontSize:15,letterSpacing:3,cursor:generating||!prompt.trim()?"not-allowed":"pointer",fontWeight:900,fontFamily:"'Rajdhani',sans-serif",opacity:generating||!prompt.trim()?0.5:1}}>
            {generating?"⟳ CREATING YOUR SCENE... "+progress+"%":"🎬 GENERATE SCENE"}
          </button>
        </div>
        <div style={{borderLeft:`1px solid ${GOLDDIM}`,display:"flex",flexDirection:"column"}}>
          <div style={{background:"#000",aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:`1px solid ${GOLDDIM}`,overflow:"hidden"}}>
            {videoUrl?(
              <video ref={videoRef} src={videoUrl} controls autoPlay loop playsInline style={{width:"100%",height:"100%",objectFit:"contain"}}/>
            ):(
              <div style={{textAlign:"center",padding:20}}>
                <div style={{color:GOLD,fontSize:11,fontWeight:900,letterSpacing:3,marginBottom:8}}>MANDASTRONG CINEMA ENGINE</div>
                <div style={{color:DIM,fontSize:10,lineHeight:2}}>Type any scene description.<br/>Upload a reference image.<br/>Hit Generate.<br/>Get a real cinematic scene.</div>
              </div>
            )}
          </div>
          {generating&&(
            <div style={{padding:"10px 14px",borderBottom:`1px solid ${GOLDDIM}`}}>
              <div style={{height:5,background:"#111",marginBottom:4}}>
                <div style={{width:progress+"%",height:"100%",background:`linear-gradient(90deg,#a07820,#e8c96d)`,transition:"width .4s"}}/>
              </div>
              <div style={{color:GOLD,fontSize:10,textAlign:"center",letterSpacing:2}}>{progress}%</div>
            </div>
          )}
          {videoUrl&&!generating&&(
            <div style={{padding:"10px 14px",borderBottom:`1px solid ${GOLDDIM}`,display:"flex",flexDirection:"column",gap:6}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                <a href={videoUrl} download={(title||"scene")+"_"+duration+"s.webm"}
                  style={{background:"transparent",border:`1px solid ${GOLD}`,color:GOLD,padding:"8px",fontSize:10,textDecoration:"none",textAlign:"center",letterSpacing:1,fontWeight:900,fontFamily:"'Rajdhani',sans-serif",display:"block"}}>⬇ DOWNLOAD</a>
                <button onClick={saveToLibrary}
                  style={{background:saved?`linear-gradient(135deg,#a07820,#e8c96d)`:"transparent",border:`1px solid ${GOLD}`,color:saved?"#000":GOLD,padding:"8px",fontSize:10,cursor:"pointer",fontWeight:900,letterSpacing:1,fontFamily:"'Rajdhani',sans-serif"}}>
                  {saved?"✓ SAVED":"💾 LIBRARY"}
                </button>
              </div>
              <button onClick={()=>{setVideoUrl("");setLog([]);setSaved(false);setTitle("");setPrompt("");}}
                style={{background:`linear-gradient(135deg,#a07820,#e8c96d)`,border:"none",color:"#000",padding:"8px",fontSize:11,width:"100%",letterSpacing:2,cursor:"pointer",fontWeight:900,fontFamily:"'Rajdhani',sans-serif"}}>
                ▶ NEXT SCENE
              </button>
            </div>
          )}
          <div style={{flex:1,overflowY:"auto",padding:14}}>
            {log.length>0?(
              <div>
                <div style={{color:GOLD,fontSize:10,letterSpacing:3,fontWeight:900,marginBottom:10}}>PRODUCTION LOG</div>
                {log.map((l,i)=>(
                  <div key={i} style={{color:i===log.length-1?"#22c55e":DIM,fontSize:11,lineHeight:2,letterSpacing:1}}>
                    {i===log.length-1?"▶ ":"  "}{l}
                  </div>
                ))}
              </div>
            ):(
              <div style={{padding:"16px 0",color:GOLDDIM,fontSize:10,lineHeight:2.2,letterSpacing:1}}>
                <div style={{color:GOLD,fontWeight:900,fontSize:11,marginBottom:8}}>WHAT THIS ENGINE RENDERS</div>
                ✦ Real human figures with skin tones<br/>
                ✦ Faces, clothing, posture, shadow<br/>
                ✦ Any environment or setting<br/>
                ✦ Physical lighting and atmosphere<br/>
                ✦ Cities, oceans, space, interiors<br/>
                ✦ Weather — rain, fog, dust, fire<br/>
                ✦ Camera movement and parallax<br/>
                ✦ Cinematic colour grading<br/>
                ✦ Matches your reference image
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function P1({ go }) {
  return (
    <div style={{...Sp}}>
      <div style={{background:"#000",padding:"56px 40px 36px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
          {[...Array(55)].map((_,i)=>(
            <div key={i} style={{position:"absolute",width:i%4===0?2:1,height:i%4===0?2:1,background:GOLD,borderRadius:"50%",opacity:.1+i%4*.15,left:`${(i*17+3)%100}%`,top:`${(i*11+7)%100}%`,animation:`tw ${1.8+i%3*.8}s ease-in-out ${i%5*.35}s infinite`}}/>
          ))}
        </div>
        <style>{`@keyframes tw{0%,100%{opacity:.05}50%{opacity:.85}}`}</style>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:11,color:DIM,letterSpacing:6,marginBottom:12}}>CINEMA INTELLIGENCE PLATFORM — EST. 2026</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(34px,6vw,58px)",fontWeight:900,color:GOLD,letterSpacing:5,lineHeight:1,textShadow:`0 0 60px ${GOLD}dd,0 0 120px ${GOLD}66`}}>MANDA STRONG</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(34px,6vw,58px)",fontWeight:900,color:GOLD,letterSpacing:5,lineHeight:1,textShadow:`0 0 60px ${GOLD}dd,0 0 120px ${GOLD}66`,marginBottom:14}}>STUDIO</div>
          <div style={{color:WHITE,fontSize:12,letterSpacing:4,marginBottom:28,fontWeight:600}}>600+ AI TOOLS · 8K EXPORT · UP TO 3-HOUR FILMS</div>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>go(4)} style={{...G("gold",false),fontSize:14,padding:"14px 38px",letterSpacing:3}}>START CREATING</button>
            <button onClick={()=>go(4)} style={{...G("out",false),fontSize:14,padding:"14px 38px",letterSpacing:3}}>LOGIN / REGISTER</button>
          </div>
        </div>
      </div>
      <div style={{borderTop:`1px solid ${GOLD}`,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,padding:"16px 24px",maxWidth:800,margin:"0 auto"}}>
        {[["600+","AI TOOLS"],["8K","EXPORT"],["3 HRS","DURATION"],["1TB","STORAGE"]].map(([v,l])=>(
          <div key={v} style={{...Card(),textAlign:"center",padding:12}}>
            <div style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:900}}>{v}</div>
            <div style={{color:WHITE,fontSize:11,marginTop:3,fontWeight:700,letterSpacing:2}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",paddingBottom:24,paddingTop:16}}>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <a href="https://mandastrongstudio2026.bolt.host" target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:130,height:90,background:"#000",border:`2px solid ${GOLD}`,cursor:"pointer",gap:4,textDecoration:"none"}}
            onMouseEnter={e=>e.currentTarget.style.background=BG4}
            onMouseLeave={e=>e.currentTarget.style.background="#000"}>
            <div style={{fontSize:22,lineHeight:1}}>🌐</div>
            <div style={{color:GOLD,fontSize:11,fontWeight:900,letterSpacing:1,textAlign:"center",lineHeight:1.5}}>OPEN<br/>LIVE APP</div>
          </a>
          <div onClick={()=>{
            if(navigator.share){navigator.share({title:"MandaStrong Studio",url:"https://mandastrongstudio2026.bolt.host"});}
            else{navigator.clipboard&&navigator.clipboard.writeText("https://mandastrongstudio2026.bolt.host");alert("Link copied! Add to home screen from your browser menu.");}
          }} style={{display:"inline-flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:130,height:90,background:"#000",border:`2px solid ${GOLD}`,cursor:"pointer",gap:4}}
            onMouseEnter={e=>e.currentTarget.style.background=BG4}
            onMouseLeave={e=>e.currentTarget.style.background="#000"}>
            <div style={{fontSize:22,lineHeight:1}}>📲</div>
            <div style={{color:GOLD,fontSize:11,fontWeight:900,letterSpacing:1,textAlign:"center",lineHeight:1.5}}>ADD TO<br/>HOME SCREEN</div>
          </div>
          <div onClick={()=>window.dispatchEvent(new CustomEvent("ms_open_history"))}
            style={{display:"inline-flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:130,height:90,background:"#000",border:`2px solid ${GOLD}`,cursor:"pointer",gap:4}}
            onMouseEnter={e=>e.currentTarget.style.background=BG4}
            onMouseLeave={e=>e.currentTarget.style.background="#000"}>
            <div style={{fontSize:22,lineHeight:1}}>📂</div>
            <div style={{color:GOLD,fontSize:11,fontWeight:900,letterSpacing:1,textAlign:"center",lineHeight:1.5}}>OPEN<br/>PROJECT</div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function P2({ go }) {
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:880,margin:"0 auto"}}>
        <div style={{fontSize:12,color:GOLD,letterSpacing:4,marginBottom:8,fontWeight:700}}>AI CREATOR PLATFORM</div>
        <h1 style={{...H1,fontSize:30,marginBottom:14}}>MAKE AWESOME FAMILY MOVIES OR TURN YOUR DREAMS INTO REALITY</h1>
        <p style={{color:WHITE,fontSize:15,lineHeight:1.9,maxWidth:720,marginBottom:28}}>MandaStrong Studio combines 600+ professional AI tools with an intuitive cinematic workspace — so anyone can create stunning short films, family videos, or feature-length productions up to 3 hours long.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:28}}>
          {[["600+","AI Tools"],["8K","Export Quality"],["3 HOURS","Max Duration"],["1TB","Cloud Storage"]].map(([v,l])=>(
            <div key={v} style={{...Card(),textAlign:"center",padding:14}}>
              <div style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:900}}>{v}</div>
              <div style={{color:WHITE,fontSize:11,marginTop:4,fontWeight:600,letterSpacing:1}}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>go(4)} style={{...G("gold",false)}}>START CREATING</button>
      </div>
    </div>
  );
}

function P3({onSave}) {
  const [f0,setF0]=useState(null);const [f1,setF1]=useState(null);const [f2,setF2]=useState(null);
  const [n0,setN0]=useState("");const [n1,setN1]=useState("");const [n2,setN2]=useState("");
  const handle=(idx,e)=>{
    const f=e.target.files&&e.target.files[0];if(!f)return;
    const url=URL.createObjectURL(f);
    if(idx===0){setF0(url);setN0(f.name);}
    if(idx===1){setF1(url);setN1(f.name);}
    if(idx===2){setF2(url);setN2(f.name);}
    if(onSave)onSave({id:Date.now()+Math.random(),name:f.name,type:f.type,file:f,url});
  };
  const inputStyle={
    display:"block",width:"100%",padding:"12px",
    background:`linear-gradient(135deg,${GOLDDIM},${GOLD})`,
    color:"#000",fontSize:12,fontWeight:900,letterSpacing:2,
    fontFamily:"'Rajdhani',sans-serif",textAlign:"center",
    cursor:"pointer",border:"none",outline:"none",
    WebkitAppearance:"none",appearance:"none",
  };
  return(
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:980,margin:"0 auto"}}>
        <div style={{fontSize:12,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>SHOWCASE</div>
        <h1 style={{...H1,fontSize:30,marginBottom:8}}>MADE WITH MANDASTRONG STUDIO</h1>
        <div style={{color:WHITE,fontSize:13,lineHeight:1.8,marginBottom:24}}>Real films produced entirely inside this platform. Click play to watch.</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>

          <div style={{...Card(),padding:0,overflow:"hidden"}}>
            <div style={{background:"#000",aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:`1px solid ${GOLDDIM}`}}>
              {f0?<video src={f0} controls playsInline style={{width:"100%",height:"100%",objectFit:"contain"}}/>
              :<div style={{textAlign:"center"}}><div style={{fontSize:40}}>🎬</div><div style={{color:GOLDDIM,fontSize:11,marginTop:8}}>SLOT 1</div></div>}
            </div>
            {n0&&<div style={{padding:"6px 12px",color:GOLD,fontSize:11,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{n0}</div>}
            <div style={{padding:"8px 12px 12px"}}>
              <input type="file" accept="video/*,video/mp4,video/webm,video/quicktime" style={inputStyle} onChange={e=>handle(0,e)}/>
            </div>
          </div>

          <div style={{...Card(),padding:0,overflow:"hidden"}}>
            <div style={{background:"#000",aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:`1px solid ${GOLDDIM}`}}>
              {f1?<video src={f1} controls playsInline style={{width:"100%",height:"100%",objectFit:"contain"}}/>
              :<div style={{textAlign:"center"}}><div style={{fontSize:40}}>🎬</div><div style={{color:GOLDDIM,fontSize:11,marginTop:8}}>SLOT 2</div></div>}
            </div>
            {n1&&<div style={{padding:"6px 12px",color:GOLD,fontSize:11,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{n1}</div>}
            <div style={{padding:"8px 12px 12px"}}>
              <input type="file" accept="video/*,video/mp4,video/webm,video/quicktime" style={inputStyle} onChange={e=>handle(1,e)}/>
            </div>
          </div>

          <div style={{...Card(),padding:0,overflow:"hidden"}}>
            <div style={{background:"#000",aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:`1px solid ${GOLDDIM}`}}>
              {f2?<video src={f2} controls playsInline style={{width:"100%",height:"100%",objectFit:"contain"}}/>
              :<div style={{textAlign:"center"}}><div style={{fontSize:40}}>🎬</div><div style={{color:GOLDDIM,fontSize:11,marginTop:8}}>SLOT 3</div></div>}
            </div>
            {n2&&<div style={{padding:"6px 12px",color:GOLD,fontSize:11,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{n2}</div>}
            <div style={{padding:"8px 12px 12px"}}>
              <input type="file" accept="video/*,video/mp4,video/webm,video/quicktime" style={inputStyle} onChange={e=>handle(2,e)}/>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
function P4({ go, setUser }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  const [name,setName]=useState(""); const [re,setRe]=useState("");
  const inp={width:"100%",background:"#0a0a0a",border:`1px solid ${GOLDDIM}`,padding:"10px 12px",color:WHITE,fontSize:14,marginBottom:10,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif"};
  const login=()=>{
    if(email==="woolleya129@gmail.com"&&pass==="Mangler1970!!"){
      const u={name:"Amanda",plan:"Studio",isAdmin:true};
      setUser(u);localStorage.setItem("ms_user",JSON.stringify(u));go(5);
    } else if(email.includes("@")){
      const u={name:email.split("@")[0]||"Creator",plan:"Creator",isAdmin:false};
      setUser(u);localStorage.setItem("ms_user",JSON.stringify(u));go(5);
    } else{alert("Please enter a valid email address.");}
  };
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18,marginBottom:36}}>
          <div style={{...Card()}}>
            <div style={{fontSize:11,color:GOLD,letterSpacing:3,marginBottom:8,fontWeight:700}}>EXISTING USER</div>
            <h2 style={{...H1,fontSize:18,marginBottom:18}}>SIGN IN</h2>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" style={inp}/>
            <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" style={{...inp,marginBottom:16}}/>
            <button onClick={login} style={{...G("gold",false),width:"100%",padding:"12px"}}>SIGN IN TO STUDIO</button>
          </div>
          <div style={{...Card(),border:"2px solid #22c55e",position:"relative"}}>
            <div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:"#22c55e",color:"#000",padding:"3px 14px",fontSize:11,fontWeight:900,whiteSpace:"nowrap"}}>🎉 7-DAY FREE TRIAL</div>
            <div style={{fontSize:11,color:GOLD,letterSpacing:3,marginBottom:8,marginTop:10,fontWeight:700}}>NEW CREATOR</div>
            <h2 style={{...H1,fontSize:18,marginBottom:18}}>CREATE ACCOUNT</h2>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name" style={inp}/>
            <input value={re} onChange={e=>setRe(e.target.value)} placeholder="Email address" style={{...inp,marginBottom:16}}/>
            <button onClick={()=>{setUser({name:name||"Creator",plan:"Studio Trial",isAdmin:false});window.open(STRIPE.studio,"_blank");go(5);}}
              style={{width:"100%",padding:"12px",background:"#22c55e",border:"none",color:"#000",fontWeight:900,fontSize:13,cursor:"pointer",letterSpacing:2}}>START FREE TRIAL — $0</button>
          </div>
          <div style={{...Card(),textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:10}}>👁</div>
            <h2 style={{...H1,fontSize:16,marginBottom:10}}>EXPLORE FIRST</h2>
            <p style={{color:WHITE,fontSize:14,lineHeight:1.7,marginBottom:20}}>Browse 600+ AI tools before committing. No account required.</p>
            <button onClick={()=>{setUser({name:"Guest",plan:"Guest",isAdmin:false});go(5);}} style={{...G("out",false),width:"100%"}}>BROWSE AS GUEST</button>
          </div>
        </div>
        <div style={{textAlign:"center",marginBottom:20}}>
          <button onClick={()=>window.dispatchEvent(new CustomEvent("ms_open_history"))} style={{...G("gold",false),padding:"12px 32px",fontSize:13,letterSpacing:3}}>📂 OPEN PROJECT</button>
          <div style={{color:DIM,fontSize:11,marginTop:8}}>Continue where you left off</div>
        </div>
        <h2 style={{...H1,fontSize:22,textAlign:"center",marginBottom:22}}>SUBSCRIPTION PLANS</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          {[
            {t:"CREATOR PLAN",p:"20",link:STRIPE.basic,f:["HD Export 1080p","100 AI Tools","10GB Storage","Email Support"],pop:false,trial:false},
            {t:"PRO PLAN",p:"30",link:STRIPE.pro,f:["4K Export","300 AI Tools","100GB Storage","Priority Support","Commercial License"],pop:true,trial:false},
            {t:"STUDIO PLAN",p:"50",link:STRIPE.studio,f:["8K Export","600+ AI Tools","1TB Storage","24/7 Support","Full Rights","API Access","7-Day Free Trial"],pop:false,trial:true},
          ].map(plan=>(
            <div key={plan.t} style={{...Card(),border:plan.pop?`2px solid ${GOLD}`:`1px solid ${GOLDDIM}`,position:"relative"}}>
              {plan.pop&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:GOLD,color:"#000",padding:"2px 12px",fontSize:11,fontWeight:900,whiteSpace:"nowrap"}}>MOST POPULAR</div>}
              {plan.trial&&<div style={{position:"absolute",top:-11,right:12,background:"#22c55e",color:"#000",padding:"2px 10px",fontSize:11,fontWeight:900}}>🎉 FREE TRIAL</div>}
              <div style={{color:WHITE,fontSize:11,letterSpacing:3,fontWeight:700}}>{plan.t}</div>
              <div style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:34,fontWeight:900,margin:"8px 0"}}>${plan.p}<span style={{fontSize:12,color:WHITE}}>/mo</span></div>
              <div style={{margin:"12px 0"}}>{plan.f.map(f=><div key={f} style={{color:WHITE,fontSize:13,padding:"3px 0",borderBottom:"1px solid #0a0a0a"}}>✓ {f}</div>)}</div>
              <button onClick={()=>window.open(plan.link,"_blank")} style={{...G(plan.trial?"out":"gold",false),width:"100%"}}>{plan.trial?"START FREE TRIAL":"SUBSCRIBE NOW"}</button>
            </div>
          ))}
        </div>
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
        <div style={{fontSize:12,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>ASSET INGESTION</div>
        <h1 style={{...H1,fontSize:28,marginBottom:4}}>UPLOAD MEDIA</h1>
        <div style={{color:WHITE,fontSize:14,marginBottom:20,fontWeight:700,letterSpacing:1}}>{mediaLib.length} ASSETS IN LIBRARY</div>
        <div onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor=GOLD;}}
          onDragLeave={e=>{e.currentTarget.style.borderColor=GOLDDIM;}}
          onDrop={e=>{e.preventDefault();onFiles(e.dataTransfer.files);e.currentTarget.style.borderColor=GOLDDIM;}}
          onClick={()=>fileRef.current&&fileRef.current.click()}
          style={{border:`2px dashed ${GOLDDIM}`,padding:"50px 40px",textAlign:"center",cursor:"pointer",marginBottom:16}}>
          <div style={{fontSize:36,marginBottom:10}}>🎬</div>
          <div style={{color:WHITE,fontWeight:900,fontSize:16,letterSpacing:3}}>DRAG & DROP YOUR MEDIA HERE</div>
          <div style={{color:WHITE,fontSize:13,marginTop:8,letterSpacing:1}}>Or click to browse · Video · Audio · Images</div>
        </div>
        {mediaLib.length>0&&(
          <div>
            <h3 style={{color:GOLD,fontWeight:900,fontSize:13,letterSpacing:3,marginBottom:10}}>MEDIA LIBRARY ({mediaLib.length})</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
              {mediaLib.map(a=>(
                <div key={a.id} style={{...Card(),padding:8,position:"relative"}}>
                  {a.type.startsWith("video")?<video src={a.url} style={{width:"100%",marginBottom:5}}/>:
                   a.type.startsWith("image")?<img src={a.url} style={{width:"100%",marginBottom:5}} alt={a.name}/>:
                   <div style={{height:60,background:"#000",marginBottom:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🎵</div>}
                  <div style={{color:WHITE,fontSize:11,fontWeight:800,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div>
                  <button onClick={()=>setMediaLib(p=>p.filter(x=>x.id!==a.id))}
                    style={{position:"absolute",top:5,right:5,background:"#7f1d1d",border:"none",color:"#ef4444",width:16,height:16,cursor:"pointer",fontSize:9,padding:0}}>✕</button>
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
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:880,margin:"0 auto"}}>
        <div style={{fontSize:12,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>PRODUCTION HUB</div>
        <h1 style={{...H1,fontSize:28,marginBottom:4}}>EDITOR SUITE</h1>
        <div style={{color:WHITE,fontSize:14,marginBottom:20,fontWeight:600}}>Your complete post-production workspace.</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
          {[{ic:"🗂",t:"MEDIA LIBRARY",d:`${mediaLib.length} assets`,p:11},{ic:"⏱",t:"TIMELINE EDITOR",d:"Multi-track editing",p:13},{ic:"✨",t:"ENHANCEMENT STUDIO",d:"90+ AI tools",p:14},{ic:"🎵",t:"AUDIO MIXER",d:"4-channel mixing",p:15},{ic:"⚡",t:"RENDER ENGINE",d:"Up to 8K output",p:16},{ic:"▶",t:"PREVIEW PLAYER",d:"Full-screen playback",p:17}].map(c=>(
            <button key={c.t} onClick={()=>go(c.p)}
              style={{...Card(),textAlign:"left",cursor:"pointer"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=GOLDDIM;}}>
              <div style={{fontSize:28,marginBottom:8}}>{c.ic}</div>
              <div style={{color:GOLD,fontWeight:900,fontSize:13,letterSpacing:2}}>{c.t}</div>
              <div style={{color:WHITE,fontSize:12,marginTop:4}}>{c.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function P13({ go, mediaLib, timeline, setTimeline, user, filmDuration, setFilmDuration }) {
  const [tracks,setTracks]=useState(["VIDEO TRACK","AUDIO TRACK","TEXT / TITLES"]);
  const addToTrack=(idx,asset)=>setTimeline(p=>({...p,[idx]:[...(p[idx]||[]),asset]}));
  return (
    <div style={{...Sp,padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:11,color:GOLD,letterSpacing:4,fontWeight:700}}>EDITING WORKSPACE</div>
          <h1 style={{...H1,fontSize:24,margin:0}}>TIMELINE EDITOR</h1>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
            <span style={{color:GOLD,fontSize:10,fontWeight:900,letterSpacing:2}}>FILM: {filmDuration||60} MIN</span>
            <input type="range" min={0} max={180} step={30} value={filmDuration||60} onChange={e=>setFilmDuration(+e.target.value)} style={{width:160,accentColor:GOLD}}/>
            <div style={{display:"flex",gap:4}}>
              {[60,90,180].map(m=><button key={m} onClick={()=>setFilmDuration(m)} style={{background:filmDuration===m?GOLD:"#111",border:`1px solid ${filmDuration===m?"#000":GOLDDIM}`,color:filmDuration===m?"#000":WHITE,padding:"2px 8px",cursor:"pointer",fontSize:10,fontWeight:900,fontFamily:"'Rajdhani',sans-serif"}}>{m}m</button>)}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setTracks(p=>[...p,`TRACK ${p.length+1}`])} style={{...G("out",true)}}>+ ADD TRACK</button>
          <button onClick={()=>{
            // Auto-populate tracks from media library and sync
            const videoAssets=mediaLib.filter(a=>a.type&&a.type.startsWith("video"));
            const audioAssets=mediaLib.filter(a=>a.type&&(a.type.startsWith("audio")||a.type==="audio/narration"||a.type==="audio/webm"));
            const newTl={};
            if(videoAssets.length>0)newTl[0]=videoAssets.map(a=>({...a,startTime:0,syncGroup:"master",synced:true}));
            if(audioAssets.length>0)newTl[1]=audioAssets.map(a=>({...a,startTime:0,syncGroup:"master",synced:true}));
            setTimeline(p=>{
              const merged={...p,...newTl};
              Object.keys(merged).forEach(k=>{merged[k]=(merged[k]||[]).map(a=>({...a,startTime:0,syncGroup:"master",synced:true}));});
              return merged;
            });
            alert("✓ All tracks synced — "+videoAssets.length+" video clips · "+audioAssets.length+" audio tracks");
          }} style={{background:`linear-gradient(135deg,${GOLDDIM},${GOLD})`,border:"none",color:"#000",padding:"5px 14px",cursor:"pointer",fontSize:11,fontWeight:900,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>⚡ SYNC ALL TRACKS</button>
          <button onClick={()=>go(16)} style={{...G("gold",false)}}>→ RENDER</button>
          <button onClick={()=>setTimeline({})} style={{...G("out",true)}}>CLEAR ALL</button>
        </div>
      </div>
      <div style={{background:"#000",height:100,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,border:`1px solid ${GOLDDIM}`}}>
        {mediaLib[0]&&mediaLib[0].type.startsWith("video")?
          <video src={mediaLib[0].url} style={{height:"100%",width:"100%",objectFit:"cover",opacity:.5}}/>:
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:12,letterSpacing:3,color:WHITE,marginBottom:8}}>ADD MEDIA TO SEE PREVIEW</div>
            <button onClick={()=>go(11)} style={{...G("out",true)}}>⬆ UPLOAD MEDIA</button>
          </div>}
      </div>
      {tracks.map((tr,idx)=>(
        <div key={idx} style={{marginBottom:8}}>
          <div style={{color:GOLD,fontSize:11,letterSpacing:3,marginBottom:4,fontWeight:900}}>{tr}</div>
          <div onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData("assetId");const a=mediaLib.find(x=>String(x.id)===id);if(a)addToTrack(idx,a);}}
            style={{background:"#0a0a0a",border:`1px dashed ${GOLDDIM}`,minHeight:42,padding:6,display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            {(timeline[idx]||[]).map((a,i)=>(
              <div key={i} style={{background:GOLDDIM,padding:"3px 10px",fontSize:12,color:"#000",fontWeight:900,display:"flex",alignItems:"center",gap:5}}>
                {a.name.slice(0,12)}
                <button onClick={()=>setTimeline(p=>({...p,[idx]:p[idx].filter((_,j)=>j!==i)}))}
                  style={{background:"none",border:"none",color:"#000",cursor:"pointer",fontSize:11,padding:0}}>✕</button>
              </div>
            ))}
            {!(timeline[idx]||[]).length&&<span style={{color:WHITE,fontSize:12,letterSpacing:1}}>DROP {tr} CLIPS HERE</span>}
          </div>
        </div>
      ))}
      {mediaLib.length>0&&(
        <div style={{marginTop:12}}>
          <div style={{color:GOLD,fontSize:11,letterSpacing:3,marginBottom:6,fontWeight:900}}>DRAG TO TIMELINE:</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {mediaLib.map(a=>(
              <div key={a.id} draggable onDragStart={e=>e.dataTransfer.setData("assetId",String(a.id))}
                style={{background:"#0a0a0a",border:`1px solid ${GOLD}`,padding:"4px 10px",cursor:"grab",color:GOLD,fontSize:12,fontWeight:700}}>
                📎 {a.name.slice(0,14)}
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{...Card(),marginTop:12,display:"flex",alignItems:"center",gap:8}}>
        {["⏮","⏪","▶","⏩","⏭"].map(c=><button key={c} style={{...G("out",true)}}>{c}</button>)}
        <div style={{flex:1,height:3,background:"#000"}}/>
        <span style={{color:WHITE,fontSize:12,fontWeight:700}}>00:00 / 90:00</span>
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
      <div style={{width:176,background:"#050505",borderRight:`1px solid ${GOLDDIM}`,overflowY:"auto",padding:8}}>
        {tools14.map(t=>(
          <button key={t} onClick={()=>setActive(t)}
            style={{width:"100%",textAlign:"left",background:t===active?BG4:"none",border:"none",color:t===active?GOLD:WHITE,padding:"8px 10px",cursor:"pointer",fontSize:12,fontWeight:t===active?900:600,marginBottom:1,borderLeft:t===active?`2px solid ${GOLD}`:"2px solid transparent"}}>
            {t}
          </button>
        ))}
      </div>
      <div style={{flex:1,padding:28}}>
        <div style={{fontSize:11,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>ENHANCEMENT STUDIO</div>
        <h2 style={{...H1,fontSize:22,marginBottom:6}}>{active.toUpperCase()}</h2>
        {Object.entries(vals).map(([k,v])=>(
          <div key={k} style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:WHITE,fontSize:13,fontWeight:700}}>{k}</span>
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
  const [lvl,setLvl]=useState({VOICE:85,MUSIC:40,EFX:50,MASTER:85});
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <div style={{fontSize:11,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>MIXING CONSOLE</div>
        <h1 style={{...H1,fontSize:28,marginBottom:24}}>AUDIO MIXER</h1>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
          {Object.entries(lvl).map(([ch,val])=>(
            <div key={ch} style={{...Card(),textAlign:"center",padding:18}}>
              <div style={{color:GOLD,fontSize:11,letterSpacing:3,marginBottom:8,fontWeight:900}}>{ch}</div>
              <div style={{color:GOLD,fontFamily:"'Cinzel',serif",fontSize:30,fontWeight:900,marginBottom:12}}>{val}</div>
              <input type="range" min={0} max={100} value={val} onChange={e=>setLvl(p=>({...p,[ch]:+e.target.value}))} style={{width:"100%",height:100,accentColor:GOLD}}/>
              <div style={{height:3,background:"#000",marginTop:10}}>
                <div style={{width:`${val}%`,height:"100%",background:`linear-gradient(90deg,${GOLDDIM},${GOLD})`}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setLvl({VOICE:85,MUSIC:40,EFX:50,MASTER:85})} style={{...G("out",false)}}>RESET LEVELS</button>
          <button style={{...G("gold",false)}}>SAVE PRESET</button>
        </div>
      </div>
    </div>
  );
}

function P16({ go, timeline, setRendered, mediaLib, setMediaLib, user, filmDuration, setFilmDuration }) {
  const [quality,setQuality]=useState("1080p");
  const [progress,setProgress]=useState(0);
  const [rendering,setRendering]=useState(false);
  const [done,setDone]=useState(false);
  const [renderUrl,setRenderUrl]=useState("");
  const [renderLog,setRenderLog]=useState([]);
  const [fps,setFps]=useState(30);
  const [codec,setCodec]=useState("vp9");
  const [currentClipIdx,setCurrentClipIdx]=useState(-1);
  const canvasRef=useRef(null);

  const log=(msg)=>setRenderLog(p=>[...p,msg]);

  const getVideoClips=()=>{
    const tClips=Object.values(timeline||{}).flat().filter(a=>a&&a.type&&a.type.startsWith("video"));
    if(tClips.length>0)return tClips;
    return (mediaLib||[]).filter(a=>a.type&&a.type.startsWith("video"));
  };

  const getAudioTrack=()=>{
    const tAudio=Object.values(timeline||{}).flat().filter(a=>a&&a.type&&(a.type.startsWith("audio")||a.type==="audio/narration"||a.type==="audio/webm"));
    if(tAudio.length>0)return tAudio[0];
    return (mediaLib||[]).find(a=>a.type&&(a.type.startsWith("audio")||a.type==="audio/narration"||a.type==="audio/webm"));
  };

  const startRender=async()=>{
    // Step 1: Refresh ALL clips from IndexedDB before rendering
    // This ensures clips work even after page reload
    log("Loading clips from storage...");
    try{
      const dbClips=await getAllClipsFromDB();
      if(dbClips.length>0){
        const refreshed=dbClips.map(c2=>({
          id:c2.id,name:c2.name,type:c2.type||"video/webm",
          url:URL.createObjectURL(c2.blob),
          file:new File([c2.blob],c2.name,{type:c2.type||"video/webm"}),
          dbId:c2.id
        }));
        setMediaLib(refreshed);
        // Small delay so state updates
        await new Promise(r=>setTimeout(r,300));
      }
    }catch(e){console.warn("Could not refresh from DB",e);}

    const clips=getVideoClips();
    const audioAsset=getAudioTrack();
    if(clips.length===0){alert("No video clips found. Generate clips on Page 8 first.");return;}
    setRendering(true);setDone(false);setProgress(0);setRenderLog([]);setRenderUrl("");setCurrentClipIdx(-1);
    try{
      log("MandaStrong Render Engine v2 initialising...");
      log("Clips: "+clips.length+" | Quality: "+quality+" | FPS: "+fps);
      const canvas=canvasRef.current;
      const dims=quality==="4K"?{w:3840,h:2160}:quality==="1080p"?{w:1920,h:1080}:quality==="720p"?{w:1280,h:720}:{w:854,h:480};
      canvas.width=dims.w;canvas.height=dims.h;
      const ctx=canvas.getContext("2d");
      log("Canvas: "+dims.w+"x"+dims.h);
      const audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      const audioDest=audioCtx.createMediaStreamDestination();
      let audioSource=null,audioBuffer=null;
      if(audioAsset&&audioAsset.url){
        try{
          const resp=await fetch(audioAsset.url);
          const arrayBuf=await resp.arrayBuffer();
          audioBuffer=await audioCtx.decodeAudioData(arrayBuf);
          log("Audio loaded: "+(audioBuffer.duration).toFixed(1)+"s");
        }catch(e){log("Audio load failed — video only");}
      }
      if(audioBuffer){audioSource=audioCtx.createBufferSource();audioSource.buffer=audioBuffer;audioSource.connect(audioDest);audioSource.connect(audioCtx.destination);}
      const videoStream=canvas.captureStream(fps);
      const tracks=[...videoStream.getTracks(),...audioDest.stream.getTracks()];
      const combinedStream=new MediaStream(tracks);
      const vCodec=codec==="vp9"?"vp9":"vp8";
      const mimeType=MediaRecorder.isTypeSupported(`video/webm;codecs=${vCodec},opus`)?`video/webm;codecs=${vCodec},opus`:"video/webm";
      const bitrate=quality==="4K"?40000000:quality==="1080p"?8000000:4000000;
      const recorder=new MediaRecorder(combinedStream,{mimeType,videoBitsPerSecond:bitrate,audioBitsPerSecond:192000});
      const chunks=[];
      recorder.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data);};
      recorder.start(100);
      if(audioSource)audioSource.start(0);
      log("Recording started...");
      setProgress(5);
      // Helper: render a scene directly to canvas using Claude
      const renderSceneToCanvas=async(sceneName,clipDurSec)=>{
        const scenePrompt=sceneName.replace(/\.[^.]+$/,"").replace(/_/g," ").replace(/\d+s$/,"").trim();
        log("  Regenerating: "+scenePrompt.slice(0,40)+"...");
        try{
          const res=await fetch("https://yrshnpjvplkwbpmmzwvb.supabase.co/functions/v1/claude-proxy",{
            method:"POST",
            headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
            body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:3000,
              messages:[{role:"user",content:"Write a JavaScript canvas function for this cinematic scene: \""+scenePrompt+"\". Function: function drawFrame(ctx,W,H,t,sec). Use gradients, colours, depth, atmosphere. t=0-1 progress. Return only the function."}]})
          });
          const d=await res.json();
          let code=d.content&&d.content[0]?d.content[0].text.trim():"";
          code=code.replace(new RegExp(String.fromCharCode(96,96,96)+"javascript|"+String.fromCharCode(96,96,96)+"js|"+String.fromCharCode(96,96,96),"g"),"").trim();
          const fi=code.indexOf("function drawFrame");if(fi>0)code=code.slice(fi);
          const body=code.replace(/^function drawFrame\s*\([^)]*\)\s*\{/,"").slice(0,-1);
          const drawFn=new Function("ctx","W","H","t","sec",body);
          const W=dims.w,H=dims.h;
          const totalFrames=Math.round(clipDurSec*fps);
          const msPerFrame=Math.round(1000/fps);
          const wallStart=performance.now();
          await new Promise(resolve=>{
            let frame=0;
            const tick=()=>{
              if(frame>=totalFrames){resolve(null);return;}
              const t=frame/totalFrames,sec=frame/fps;
              try{ctx.clearRect(0,0,W,H);drawFn(ctx,W,H,t,sec);}catch(e){ctx.fillStyle="#050200";ctx.fillRect(0,0,W,H);}
              const vig=ctx.createRadialGradient(W/2,H/2,W*0.1,W/2,H/2,W*0.8);
              vig.addColorStop(0,"rgba(0,0,0,0)");vig.addColorStop(1,"rgba(0,0,0,0.85)");
              ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);
              ctx.fillStyle="#000";ctx.fillRect(0,0,W,H*0.06);ctx.fillRect(0,H*0.94,W,H*0.06);
              frame++;
              const due=wallStart+(frame*msPerFrame);
              setTimeout(tick,Math.max(4,due-performance.now()));
            };
            tick();
          });
          return true;
        }catch(e){log("  Error: "+e.message);return false;}
      };

      for(let ci=0;ci<clips.length;ci++){
        const clip=clips[ci];setCurrentClipIdx(ci);
        log("Clip "+(ci+1)+"/"+clips.length+": "+clip.name.slice(0,45));
        setProgress(5+Math.round((ci/clips.length)*80));

        // ── DRAW VIDEO FRAME BY FRAME at recorder fps ───────────────
        // requestAnimationFrame is NOT used — it doesn't sync with MediaRecorder.
        // Instead we seek the video to each target timestamp and draw at fixed fps.
        let videoPlayed=false;
        if(clip.file instanceof File||clip.url){
          videoPlayed=await new Promise(resolve=>{
            const vid=document.createElement("video");
            vid.muted=true;vid.playsInline=true;vid.preload="auto";
            const src=clip.file instanceof File?URL.createObjectURL(clip.file):clip.url;
            vid.src=src;
            let done2=false;
            const finish=(ok)=>{if(!done2){done2=true;resolve(ok);}};
            vid.onloadedmetadata=async()=>{
              const clipDur=Math.min(isFinite(vid.duration)&&vid.duration>0?vid.duration:30,90);
              const clipFrames=Math.round(clipDur*fps);
              const msPerF=Math.round(1000/fps);
              const wallS=performance.now();
              let frame=0;
              const drawFrame=async()=>{
                if(done2||frame>=clipFrames){finish(true);return;}
                const targetSec=frame/fps;
                // Seek video to exact timestamp
                vid.currentTime=targetSec;
                await new Promise(r=>{
                  const onSeeked=()=>{vid.removeEventListener("seeked",onSeeked);r();};
                  vid.addEventListener("seeked",onSeeked);
                  setTimeout(()=>{vid.removeEventListener("seeked",onSeeked);r();},300);
                });
                try{
                  ctx.fillStyle="#000";ctx.fillRect(0,0,dims.w,dims.h);
                  ctx.drawImage(vid,0,0,dims.w,dims.h);
                  // Vignette
                  const vig2=ctx.createRadialGradient(dims.w/2,dims.h/2,dims.w*0.1,dims.w/2,dims.h/2,dims.w*0.8);
                  vig2.addColorStop(0,"rgba(0,0,0,0)");vig2.addColorStop(1,"rgba(0,0,0,0.75)");
                  ctx.fillStyle=vig2;ctx.fillRect(0,0,dims.w,dims.h);
                  ctx.fillStyle="#000";ctx.fillRect(0,0,dims.w,dims.h*0.05);ctx.fillRect(0,dims.h*0.95,dims.w,dims.h*0.05);
                }catch(e){ctx.fillStyle="#050200";ctx.fillRect(0,0,dims.w,dims.h);}
                frame++;
                if(frame%fps===0)log("  "+Math.round(targetSec)+"s / "+Math.round(clipDur)+"s");
                const due=wallS+(frame*msPerF);
                setTimeout(drawFrame,Math.max(4,due-performance.now()));
              };
              drawFrame();
            };
            vid.onerror=()=>finish(false);
            setTimeout(()=>finish(false),300000);
            vid.load();
          });
        }

        // If video failed — generate fresh scene with Claude from clip name
        if(!videoPlayed){
          log("  Generating scene: "+clip.name.slice(0,35)+"...");
          const clipDurSec=parseInt(clip.name.match(/(\d+)s/)?.[1]||"30");
          const ok=await renderSceneToCanvas(clip.name,clipDurSec);
          if(!ok){
            // Fallback: black title card
            const tcFrames=5*fps;const tcStart=performance.now();
            await new Promise(resolve=>{
              let f=0;
              const draw=()=>{
                if(f>=tcFrames){resolve(null);return;}
                ctx.fillStyle="#000";ctx.fillRect(0,0,dims.w,dims.h);
                ctx.fillStyle="#e8c96d";ctx.font="900 "+Math.round(dims.w/28)+"px Arial";ctx.textAlign="center";
                ctx.fillText(clip.name.replace(/\.[^.]+$/,"").replace(/_/g," ").slice(0,40).toUpperCase(),dims.w/2,dims.h/2);
                f++;const next=tcStart+(f*(1000/fps));
                setTimeout(draw,Math.max(4,next-performance.now()));
              };draw();
            });
          }
        }
      }
      setCurrentClipIdx(-1);
      // End card — real-time paced
      {const ecFrames=fps*2;const ecStart=performance.now();
      await new Promise(resolve=>{
        let f=0;
        const draw=()=>{
          if(f>=ecFrames){resolve(null);return;}
          ctx.fillStyle="#000";ctx.fillRect(0,0,dims.w,dims.h);
          f++;
          const next=ecStart+(f*(1000/fps));
          setTimeout(draw,Math.max(4,next-performance.now()));
        };draw();
      });}
      setProgress(92);log("Finalising...");
      if(audioSource){try{audioSource.stop();}catch(e){}}
      recorder.stop();
      await new Promise(r=>{recorder.onstop=r;});
      const blob=new Blob(chunks,{type:mimeType});
      const url=URL.createObjectURL(blob);
      // Save final render to IndexedDB
      try{
        const renderName="MandaStrong_Film_"+new Date().toISOString().slice(0,10)+".webm";
        await saveClipToDB("render_final",blob,renderName,"video/webm");
      }catch(e){}
      setRenderUrl(url);
      if(setRendered)setRendered({url,quality,format:"WebM",timestamp:new Date().toLocaleString()});
      setProgress(100);setDone(true);
      log("RENDER COMPLETE — "+(blob.size/1024/1024).toFixed(1)+"MB");
      audioCtx.close();
    }catch(e){log("Render error: "+e.message);}
    setRendering(false);
  };

  const clips=getVideoClips();
  const audio=getAudioTrack();
  const QUALITIES=[{id:"480p",label:"480p",sub:"854×480"},{id:"720p",label:"720p",sub:"1280×720"},{id:"1080p",label:"1080p",sub:"1920×1080"},{id:"4K",label:"4K",sub:"3840×2160"}];

  return (
    <div style={{...Sp,padding:0}}>
      <canvas ref={canvasRef} style={{display:"none"}}/>
      <div style={{padding:"12px 24px",borderBottom:`1px solid ${GOLDDIM}`,background:"#020200",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:10,color:GOLD,letterSpacing:4,fontWeight:700}}>PRODUCTION ENGINE — STAGE 6</div>
          <h1 style={{...H1,fontSize:22,margin:0}}>RENDER FILM</h1>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
            <span style={{color:GOLD,fontSize:10,fontWeight:900,letterSpacing:2}}>FILM: {filmDuration||60} MIN</span>
            <input type="range" min={0} max={180} step={30} value={filmDuration||60} onChange={e=>setFilmDuration(+e.target.value)} style={{width:160,accentColor:GOLD}}/>
            <div style={{display:"flex",gap:4}}>
              {[60,90,180].map(m=><button key={m} onClick={()=>setFilmDuration(m)} style={{background:filmDuration===m?GOLD:"#111",border:`1px solid ${filmDuration===m?"#000":GOLDDIM}`,color:filmDuration===m?"#000":WHITE,padding:"2px 8px",cursor:"pointer",fontSize:10,fontWeight:900,fontFamily:"'Rajdhani',sans-serif"}}>{m}m</button>)}
            </div>
          </div>
        </div>
        {done&&!rendering&&<div style={{color:"#22c55e",fontSize:11,fontWeight:900,letterSpacing:2}}>RENDER COMPLETE</div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",minHeight:"calc(100vh - 120px)"}}>
        <div style={{padding:20,overflowY:"auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            <div style={{background:clips.length>0?"#061406":"#0a0a0a",border:`1px solid ${clips.length>0?"#22c55e":GOLDDIM}`,padding:"14px 16px"}}>
              <div style={{color:GOLD,fontSize:10,fontWeight:900,letterSpacing:3,marginBottom:6}}>VIDEO CLIPS</div>
              <div style={{color:clips.length>0?"#22c55e":WHITE,fontSize:14,fontWeight:900}}>{clips.length>0?"✓ "+clips.length+" clip"+(clips.length>1?"s":"")+" ready":"No clips — generate on page 8"}</div>
            </div>
            <div style={{background:audio?"#061406":"#0a0a0a",border:`1px solid ${audio?"#22c55e":GOLDDIM}`,padding:"14px 16px"}}>
              <div style={{color:GOLD,fontSize:10,fontWeight:900,letterSpacing:3,marginBottom:6}}>AUDIO TRACK</div>
              <div style={{color:audio?"#22c55e":"#f59e0b",fontSize:14,fontWeight:900}}>{audio?"✓ Audio ready":"No audio — record on page 6"}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            <div style={{background:"#0a0a0a",border:`1px solid ${GOLDDIM}`,padding:"14px 16px"}}>
              <div style={{color:GOLD,fontSize:10,fontWeight:900,letterSpacing:3,marginBottom:10}}>OUTPUT QUALITY</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                {QUALITIES.map(q=>(
                  <button key={q.id} onClick={()=>setQuality(q.id)} style={{background:quality===q.id?"#0a0800":"#000",border:`1px solid ${quality===q.id?GOLD:GOLDDIM}`,padding:"8px 6px",cursor:"pointer",textAlign:"center"}}>
                    <div style={{color:quality===q.id?GOLD:WHITE,fontSize:12,fontWeight:900,fontFamily:"'Rajdhani',sans-serif"}}>{q.label}</div>
                    <div style={{color:DIM,fontSize:9}}>{q.sub}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{background:"#0a0a0a",border:`1px solid ${GOLDDIM}`,padding:"14px 16px"}}>
              <div style={{color:GOLD,fontSize:10,fontWeight:900,letterSpacing:3,marginBottom:10}}>SETTINGS</div>
              <div style={{marginBottom:10}}>
                <div style={{color:DIM,fontSize:10,marginBottom:5}}>FRAME RATE</div>
                <div style={{display:"flex",gap:5}}>
                  {[24,30,60].map(f=><button key={f} onClick={()=>setFps(f)} style={{...G(fps===f?"gold":"out",true),flex:1,padding:"5px 4px",fontSize:10}}>{f}fps</button>)}
                </div>
              </div>
              <div>
                <div style={{color:DIM,fontSize:10,marginBottom:5}}>CODEC</div>
                <div style={{display:"flex",gap:5}}>
                  {["vp9","vp8"].map(c=><button key={c} onClick={()=>setCodec(c)} style={{...G(codec===c?"gold":"out",true),flex:1,padding:"5px 4px",fontSize:10}}>{c.toUpperCase()}</button>)}
                </div>
              </div>
            </div>
          </div>
          {rendering&&(
            <div style={{background:"#000",border:`1px solid ${GOLD}`,padding:"14px 16px",marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div style={{color:GOLD,fontSize:11,fontWeight:900}}>RENDERING</div>
                <div style={{color:GOLD,fontSize:13,fontWeight:900}}>{progress}%</div>
              </div>
              <div style={{height:8,background:"#111",overflow:"hidden"}}>
                <div style={{width:progress+"%",height:"100%",background:`linear-gradient(90deg,${GOLDDIM},${GOLD})`,transition:"width .3s"}}/>
              </div>
            </div>
          )}
          {renderLog.length>0&&(
            <div style={{background:"#000",border:`1px solid ${GOLDDIM}`,padding:"14px 16px",marginBottom:16,maxHeight:180,overflowY:"auto"}}>
              <div style={{color:GOLD,fontSize:10,fontWeight:900,letterSpacing:3,marginBottom:8}}>RENDER LOG</div>
              {renderLog.map((l,i)=>(
                <div key={i} style={{color:i===renderLog.length-1?"#22c55e":"#666",fontSize:10,lineHeight:1.7,fontFamily:"monospace"}}>{i===renderLog.length-1?"► ":"  "}{l}</div>
              ))}
            </div>
          )}
          {done&&renderUrl&&(
            <div style={{background:"#061406",border:"1px solid #22c55e",padding:"16px 20px",marginBottom:16}}>
              <div style={{color:"#22c55e",fontWeight:900,fontSize:13,letterSpacing:2,marginBottom:12}}>RENDER COMPLETE</div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <a href={renderUrl} download="MandaStrong_Film.webm" style={{...G("gold",false),padding:"12px 24px",textDecoration:"none",display:"inline-block",fontSize:12,letterSpacing:2}}>DOWNLOAD FILM</a>
                <button onClick={()=>go(17)} style={{...G("out",false),padding:"12px 24px",fontSize:12}}>PREVIEW</button>
                <button onClick={()=>go(18)} style={{...G("out",false),padding:"12px 24px",fontSize:12}}>EXPORT</button>
              </div>
            </div>
          )}
          <div style={{background:"#050500",border:`2px solid ${GOLD}`,padding:"18px 20px",marginBottom:16}}>
            <button onClick={startRender} disabled={rendering||clips.length===0}
              style={{...G("gold",false),width:"100%",padding:"18px",fontSize:14,letterSpacing:3,opacity:rendering||clips.length===0?0.5:1,marginBottom:10}}>
              {rendering?"RENDERING... "+progress+"%":"START RENDER — "+quality+" · "+fps+"fps · "+clips.length+" CLIP"+(clips.length!==1?"S":"")}
            </button>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>go(13)} style={{...G("out",false),flex:1,padding:"10px",fontSize:11}}>TIMELINE</button>
            <button onClick={()=>go(15)} style={{...G("out",false),flex:1,padding:"10px",fontSize:11}}>AUDIO MIX</button>
            <button onClick={()=>go(8)} style={{...G("out",false),flex:1,padding:"10px",fontSize:11}}>GENERATOR</button>
            <button onClick={()=>go(17)} style={{...G("out",false),flex:1,padding:"10px",fontSize:11}}>PREVIEW</button>
          </div>
        </div>
        <div style={{borderLeft:`1px solid ${GOLDDIM}`,display:"flex",flexDirection:"column",background:"#020200"}}>
          <div style={{background:"#000",aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
            {renderUrl?(
              <video src={renderUrl} controls autoPlay loop playsInline style={{width:"100%",height:"100%",objectFit:"contain"}}/>
            ):(
              <div style={{textAlign:"center",padding:20}}>
                <div style={{color:GOLD,fontSize:28,marginBottom:8}}>RENDER</div>
                <div style={{color:DIM,fontSize:10,lineHeight:1.8}}>{quality} · {fps}fps<br/>{clips.length} clip{clips.length!==1?"s":""} queued</div>
              </div>
            )}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:14}}>
            <div style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900,marginBottom:10}}>RENDER QUEUE</div>
            {clips.length===0?(
              <div style={{color:GOLDDIM,fontSize:10,textAlign:"center",padding:"20px 0",lineHeight:1.8}}>No clips.<br/>Generate on page 8.</div>
            ):clips.map((clip,i)=>(
              <div key={clip.id||i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",marginBottom:4,background:currentClipIdx===i?"#0a0800":"#0a0a0a",border:`1px solid ${currentClipIdx===i?GOLD:GOLDDIM}`}}>
                <div style={{width:22,height:22,background:currentClipIdx===i?GOLD:"#222",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{color:currentClipIdx===i?"#000":DIM,fontSize:9,fontWeight:900}}>{i+1}</span>
                </div>
                <div style={{flex:1,overflow:"hidden"}}>
                  <div style={{color:currentClipIdx===i?GOLD:WHITE,fontSize:10,fontWeight:900,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{clip.name.replace(/\.[^.]+$/,"").slice(0,28)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function P17({ go, rendered, mediaLib }) {
  const videoRef = useRef(null);
  const [isPlaying,setIsPlaying]=useState(false);
  const [currentTime,setCurrentTime]=useState(0);
  const [duration,setDuration]=useState(0);
  const vs=rendered?.url||(mediaLib.find(a=>a.type&&a.type.startsWith("video"))?mediaLib.find(a=>a.type&&a.type.startsWith("video")).url:"");
  const fmt=s=>{if(!s||!isFinite(s)||isNaN(s))return"00:00";const m=Math.floor(s/60);const sc=Math.floor(s%60);return`${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;};
  const togglePlay=()=>{if(!videoRef.current)return;if(isPlaying){videoRef.current.pause();setIsPlaying(false);}else{videoRef.current.play();setIsPlaying(true);}};
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:880,margin:"0 auto"}}>
        <h1 style={{...H1,fontSize:28,marginBottom:14}}>FILM PREVIEW</h1>
        <div style={{background:"#000",overflow:"hidden",marginBottom:14,aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${GOLDDIM}`}}>
          {vs?<video ref={videoRef} src={vs} style={{width:"100%",height:"100%"}} controls
            onTimeUpdate={()=>setCurrentTime(videoRef.current?.currentTime||0)}
            onLoadedMetadata={()=>setDuration(videoRef.current?.duration||0)}
            onEnded={()=>setIsPlaying(false)}
            onError={e=>{console.warn("Preview video error",e);}}/>:
            <div style={{textAlign:"center",color:GOLDDIM,fontSize:40}}>🎬</div>}
        </div>
        <div style={{...Card(),display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>{if(videoRef.current)videoRef.current.currentTime=0;}} style={{...G("out",true)}}>⏮</button>
          <button onClick={()=>{if(videoRef.current)videoRef.current.currentTime-=10;}} style={{...G("out",true)}}>⏪</button>
          <button onClick={togglePlay} style={{...G("gold",true),minWidth:44}}>{isPlaying?"⏸":"▶"}</button>
          <button onClick={()=>{if(videoRef.current)videoRef.current.currentTime+=10;}} style={{...G("out",true)}}>⏩</button>
          <div style={{flex:1,height:4,background:"#111",cursor:"pointer"}}
            onClick={e=>{if(!videoRef.current||!duration)return;const r=e.currentTarget.getBoundingClientRect();videoRef.current.currentTime=((e.clientX-r.left)/r.width)*duration;}}>
            <div style={{width:`${duration?(currentTime/duration*100):0}%`,height:"100%",background:GOLD}}/>
          </div>
          <span style={{color:WHITE,fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{fmt(currentTime)} / {fmt(duration||0)}</span>
        </div>
      </div>
    </div>
  );
}

function P18({ rendered, mediaLib }) {
  const vs=rendered?.url||(mediaLib.find(a=>a.type&&a.type.startsWith("video"))?mediaLib.find(a=>a.type&&a.type.startsWith("video")).url:"");
  const dl=()=>{if(!vs){alert("No film yet — render first!");return;}const a=document.createElement("a");a.href=vs;a.download="MandaStrong_Film.webm";a.click();};
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:780,margin:"0 auto"}}>
        <div style={{fontSize:11,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>DISTRIBUTION</div>
        <h1 style={{...H1,fontSize:28,marginBottom:14}}>EXPORT & DISTRIBUTE</h1>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
          {[["💾","DOWNLOAD TO DEVICE",dl],["💿","SAVE PROJECT FILE",()=>{}],["🌐","SHARE TO COMMUNITY",()=>{}]].map(([ic,lb,fn])=>(
            <button key={lb} onClick={fn} style={{...Card(),cursor:"pointer",textAlign:"center",padding:16,display:"block"}}>
              <div style={{fontSize:24,marginBottom:6}}>{ic}</div>
              <div style={{color:WHITE,fontSize:11,fontWeight:900,letterSpacing:2}}>{lb}</div>
            </button>
          ))}
        </div>
        <div style={{color:GOLD,fontWeight:900,fontSize:11,letterSpacing:3,marginBottom:10}}>SHARE TO SOCIAL MEDIA</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["YouTube","#FF0000","https://www.youtube.com/upload"],["Instagram","#E1306C","https://www.instagram.com"],["TikTok","#69C9D0","https://www.tiktok.com/upload"],["X / Twitter","#1DA1F2","https://twitter.com/intent/tweet?text=Check+out+my+film+made+with+MandaStrong+Studio"],["Facebook","#1877F2","https://www.facebook.com/sharer/sharer.php?u=https://mandastrong1.etsy.com"],["LinkedIn","#0A66C2","https://www.linkedin.com/sharing/share-offsite/?url=https://mandastrong1.etsy.com"],["Vimeo","#1AB7EA","https://vimeo.com/upload"],["WhatsApp","#25D366","https://api.whatsapp.com/send?text=Check+out+my+film+from+MandaStrong+Studio"]].map(([s,c,link])=>(
            <button key={s} onClick={()=>window.open(link,"_blank")}
              style={{background:"#000",border:`1px solid ${GOLDDIM}`,padding:"10px 16px",cursor:"pointer"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=c;e.currentTarget.style.background=c+"22";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=GOLDDIM;e.currentTarget.style.background="#000";}}>
              <div style={{color:c,fontSize:12,fontWeight:900,letterSpacing:1}}>{s}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function P19({go}) {
  const lc={Beginner:"#22c55e",Intermediate:"#f59e0b",Advanced:"#ef4444"};
  const tuts=[
    {n:"01",t:"Getting Started — Platform Overview",d:"Learn the 23-page layout, Quick Access menu, footer navigation, saving and restoring projects.",l:"Beginner",page:1,icon:"🏠"},
    {n:"02",t:"Login, Pricing & Account Setup",d:"Sign in or create your account. Choose Creator ($20), Pro ($30), or Studio ($50) with 7-day free trial. Browse as guest.",l:"Beginner",page:4,icon:"🔑"},
    {n:"03",t:"Writing Tools — 50+ AI Script Writers",d:"Use Script to Movie, Beat Sheet Builder, Logline Generator and 47 more. Describe your idea, hit AI CREATE, save to library.",l:"Beginner",page:5,icon:"✍"},
    {n:"04",t:"Voice Engine — 55 Cinematic Characters",d:"Select a voice, paste your script, adjust Speed/Pitch/Pause sliders, hit PREPARE & SPEAK. James = documentary narrator (Speed 0.62, Pitch 0.86, Pause 1600ms).",l:"Beginner",page:6,icon:"🎙"},
    {n:"05",t:"Music Video Studio — Photo to Cinematic Video",d:"Access from Page 6. Step 1: Song details + audio upload. Step 2: Style. Step 3: Scene. Step 4: Upload your PHOTO (required for photorealistic output) then Generate.",l:"Intermediate",page:6,icon:"🎬"},
    {n:"06",t:"Image Tools — 48 AI Image Generators",d:"Text to Image, Portrait Generator, Character Design and more. Describe your image, hit AI CREATE, save result to media library.",l:"Beginner",page:7,icon:"🎨"},
    {n:"07",t:"Video Generator — AI Scene Builder",d:"Describe any scene in plain English. The engine builds a cinematic canvas environment. Upload a reference image to match its style. Duration 30–60s per clip.",l:"Intermediate",page:8,icon:"🎥"},
    {n:"08",t:"Motion & VFX — 47 Enhancement Tools",d:"Frame interpolation, upscaling, stabilisation, colour grading, noise reduction and more. Select tool, adjust sliders, apply.",l:"Intermediate",page:9,icon:"✨"},
    {n:"09",t:"Upload Media — Your Asset Library",d:"Drag and drop or browse to upload video, audio and images. All assets go to your Media Library and persist across sessions via IndexedDB.",l:"Beginner",page:11,icon:"⬆"},
    {n:"10",t:"Timeline Editor — Multi-Track Editing",d:"Drag clips onto Video, Audio and Title tracks. Use SYNC ALL TRACKS to auto-populate. Hit → RENDER when your sequence is ready.",l:"Intermediate",page:13,icon:"⏱"},
    {n:"11",t:"Audio Mixer — 4-Channel Console",d:"Set VOICE 85 · MUSIC 40 · EFX 50 · MASTER 85 for documentary. Adjust per project. Hit SAVE PRESET to store your settings.",l:"Beginner",page:15,icon:"🎚"},
    {n:"12",t:"Render Engine — Film Assembly",d:"Loads all clips from IndexedDB. Choose quality (480p to 4K), frame rate (24/30/60fps), codec (VP9/VP8). Hit START RENDER. Your full film renders in-browser.",l:"Intermediate",page:16,icon:"⚡"},
    {n:"13",t:"Film Preview & Export",d:"Page 17: Watch your film with full playback controls. Page 18: Download to device or share to YouTube, Instagram, TikTok, Facebook, LinkedIn, Vimeo, WhatsApp.",l:"Beginner",page:17,icon:"▶"},
    {n:"14",t:"Agent Grok — Your 24/7 AI Assistant",d:"Ask anything about production, tools, pricing or workflow. Grok knows the full platform. Access from Page 21 or the G button in the top-right header.",l:"Beginner",page:21,icon:"G"},
    {n:"15",t:"Full Documentary Production Workflow",d:"Complete pipeline: Page 8 (generate clips) → Page 6 (record narration) → Page 13 (build timeline) → Page 15 (mix audio) → Page 16 (render) → Page 17 (preview) → Page 18 (export).",l:"Advanced",page:8,icon:"🎞"},
    {n:"16",t:"Save, Restore & Project Management",d:"Hit 💾 SAVE PROJECT in the footer to save your session. Hit 📂 MY PROJECTS to reload. All video clips persist in IndexedDB across browser refreshes.",l:"Beginner",page:1,icon:"💾"},
  ];
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <div style={{fontSize:11,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>LEARNING CENTER</div>
        <h1 style={{...H1,fontSize:28,marginBottom:6}}>TUTORIALS</h1>
        <div style={{color:WHITE,fontSize:13,lineHeight:1.8,marginBottom:20}}>Step-by-step guides for every feature. Click any tutorial to jump directly to that page in the app.</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:16}}>
          {[["Beginner","#22c55e"],["Intermediate","#f59e0b"],["Advanced","#ef4444"]].map(([l,c])=>(
            <div key={l} style={{background:c+"11",border:`1px solid ${c}33`,padding:"6px 10px",textAlign:"center"}}>
              <span style={{color:c,fontSize:11,fontWeight:900,letterSpacing:2}}>{l.toUpperCase()}</span>
            </div>
          ))}
        </div>
        {tuts.map(t=>(
          <div key={t.n} onClick={()=>go&&go(t.page)}
            style={{...Card(),marginBottom:8,cursor:"pointer",display:"flex",alignItems:"flex-start",gap:14}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.background=BG4;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=GOLDDIM;e.currentTarget.style.background="#0a0a0a";}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0,minWidth:44}}>
              <span style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:15,fontWeight:900}}>{t.n}</span>
              <span style={{fontSize:18}}>{t.icon}</span>
              <span style={{background:"#050500",border:`1px solid ${GOLDDIM}`,color:GOLDDIM,padding:"1px 5px",fontSize:9,fontWeight:900,letterSpacing:1}}>P{t.page}</span>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:6}}>
                <div style={{color:WHITE,fontWeight:900,fontSize:13}}>{t.t}</div>
                <span style={{background:lc[t.l]+"22",border:`1px solid ${lc[t.l]}`,color:lc[t.l],padding:"2px 8px",fontSize:10,fontWeight:900,letterSpacing:1,flexShrink:0}}>{t.l.toUpperCase()}</span>
              </div>
              <div style={{color:DIM,fontSize:12,lineHeight:1.7}}>{t.d}</div>
              <div style={{color:GOLDDIM,fontSize:10,marginTop:6,letterSpacing:1}}>→ CLICK TO GO TO PAGE {t.page}</div>
            </div>
          </div>
        ))}
        <div style={{...Card(),marginTop:16,background:"#050500",border:`2px solid ${GOLD}`,textAlign:"center"}}>
          <div style={{color:GOLD,fontWeight:900,fontSize:13,letterSpacing:3,marginBottom:8}}>NEED HELP?</div>
          <div style={{color:WHITE,fontSize:13,lineHeight:1.8,marginBottom:12}}>Agent Grok is your 24/7 AI studio assistant. Ask anything about the platform, tools, workflow or pricing.</div>
          <button onClick={()=>go&&go(21)} style={{...G("gold",false)}}>ASK AGENT GROK ✦</button>
        </div>
      </div>
    </div>
  );
}

function P20() {
  const [tab,setTab]=useState("tos");
  const sec=(title,body)=>(
    <div style={{marginBottom:16}}>
      <h3 style={{color:GOLD,fontWeight:900,fontSize:13,marginBottom:8,letterSpacing:2,borderBottom:`1px solid ${GOLDDIM}`,paddingBottom:6}}>{title}</h3>
      {body}
    </div>
  );
  const p=(txt)=><p style={{color:WHITE,fontSize:13,lineHeight:1.9,marginBottom:8}}>{txt}</p>;
  const li=(items)=><ul style={{color:WHITE,fontSize:13,lineHeight:1.9,paddingLeft:20,marginBottom:8}}>{items.map((t,i)=><li key={i} style={{marginBottom:3}}>{t}</li>)}</ul>;

  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <div style={{fontSize:11,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>LEGAL</div>
        <h1 style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:28,fontWeight:900,letterSpacing:4,marginBottom:4}}>TERMS & DISCLAIMER</h1>
        <div style={{color:WHITE,fontSize:11,marginBottom:20,letterSpacing:2}}>EFFECTIVE MARCH 2026 · MANDASTRONG STUDIO LLC</div>

        {/* Tab selector */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",marginBottom:28,border:`1px solid ${GOLDDIM}`}}>
          {[["tos","TERMS OF SERVICE"],["disc","DISCLAIMER"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{background:tab===id?`linear-gradient(135deg,#0a0500,#1a0800)`:"#000",border:"none",borderBottom:tab===id?`2px solid ${GOLD}`:"2px solid transparent",color:tab===id?GOLD:WHITE,padding:"14px",cursor:"pointer",fontSize:12,fontWeight:900,letterSpacing:3,fontFamily:"'Rajdhani',sans-serif"}}>
              {label}
            </button>
          ))}
        </div>

        {tab==="tos"&&(
          <div>
            <div style={{background:"#050500",border:`2px solid ${GOLD}`,padding:"14px 20px",marginBottom:20,textAlign:"center"}}>
              <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900}}>MANDASTRONG STUDIO LLC · PROFESSIONAL CINEMA INTELLIGENCE PLATFORM</div>
              <div style={{color:WHITE,fontSize:12,marginTop:4}}>By using this platform you agree to be legally bound by these Terms.</div>
            </div>

            {sec("1. ACCEPTANCE OF TERMS",<>{p("By accessing or using MandaStrong Studio you agree to be legally bound by these Terms of Service. If you do not agree, do not use this platform. These terms apply to all users including free, trial, and paid subscribers.")}</>)}
            {sec("2. SUBSCRIPTIONS & BILLING",<>{p("MandaStrong Studio offers three paid plans: Creator ($20/mo), Pro ($30/mo), and Studio ($50/mo). All plans bill monthly and auto-renew unless cancelled before the renewal date. The Studio Plan includes a 7-day free trial with no charge during the trial period. All payments are processed securely via Stripe. No refunds are issued for partial billing periods.")}</>)}
            {sec("3. INTELLECTUAL PROPERTY & CONTENT RIGHTS",<>{p("You retain full ownership of all original media, scripts, and creative content you upload to MandaStrong Studio. Studio Plan subscribers receive full commercial rights to content produced using the platform's AI tools. Creator and Pro plan subscribers may use content for personal and non-commercial purposes unless otherwise agreed in writing.")}{p("MandaStrong Studio, its tools, interface, branding, and codebase remain the intellectual property of Amanda Woolley and MandaStrong Studio LLC. You may not reproduce, distribute, or resell the platform itself.")}</>)}
            {sec("4. AI-GENERATED CONTENT",<>{p("Content generated by MandaStrong Studio's AI tools is produced algorithmically. You are solely responsible for reviewing, editing, and verifying all AI-generated outputs before use. MandaStrong Studio makes no guarantees regarding the accuracy, appropriateness, or fitness for purpose of AI-generated content.")}{p("You agree not to use AI-generated content to produce material that is defamatory, illegal, harmful, or in violation of third-party rights.")}</>)}
            {sec("5. ACCEPTABLE USE",<>{p("You agree to use MandaStrong Studio only for lawful purposes. The following are strictly prohibited:")}{li(["Producing content that is defamatory, obscene, or harasses individuals","Infringing on third-party intellectual property rights","Attempting to reverse-engineer, copy, or redistribute the platform","Using the platform to generate spam, malware, or fraudulent content","Sharing your account credentials with third parties"])}</>)}
            {sec("6. SOCIAL MISSION",<>{p("A meaningful portion of all subscription proceeds is donated to veterans mental health initiatives and school anti-bullying programmes. These are not marketing statements — they are the founding mission of this platform. Full details available at MandaStrong1.Etsy.com.")}</>)}
            {sec("7. LIMITATION OF LIABILITY",<>{p("MandaStrong Studio is provided as-is without warranties of any kind, express or implied. To the maximum extent permitted by law, MandaStrong Studio LLC shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid in the 30 days prior to the claim.")}</>)}
            {sec("8. TERMINATION",<>{p("We reserve the right to suspend or terminate your account at any time if you violate these Terms. You may cancel your subscription at any time via your account settings. Cancellation takes effect at the end of the current billing period.")}</>)}
            {sec("9. GOVERNING LAW",<>{p("These Terms are governed by the laws of the jurisdiction in which MandaStrong Studio LLC is registered. Any disputes shall be resolved by binding arbitration or the courts of that jurisdiction.")}</>)}
            {sec("10. CONTACT",<>{p("For support, billing enquiries, or legal notices contact us at MandaStrong1.Etsy.com or through Agent Grok on Page 21 of the platform.")}</>)}

            <div style={{background:"#050500",border:`1px solid ${GOLDDIM}`,padding:"12px 16px",marginTop:8}}>
              <p style={{color:GOLDDIM,fontSize:11,margin:0,letterSpacing:1}}>MANDASTRONG STUDIO LLC · AMANDA WOOLLEY, FOUNDER · MARCH 2026</p>
            </div>
          </div>
        )}

        {tab==="disc"&&(
          <div>
            <div style={{background:"#050500",border:`2px solid ${GOLD}`,padding:"14px 20px",marginBottom:20,textAlign:"center"}}>
              <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900}}>IMPORTANT — PLEASE READ BEFORE USING THIS PLATFORM</div>
              <div style={{color:WHITE,fontSize:12,marginTop:4}}>This disclaimer governs your use of all AI-generated content and platform services.</div>
            </div>

            {sec("AI-GENERATED CONTENT",<>{p("MandaStrong Studio is an AI-assisted creative platform. All outputs — including scripts, narrations, images, and video — are generated algorithmically and must be reviewed by the user before publication or commercial use. The platform does not guarantee the accuracy, completeness, or appropriateness of any AI-generated material.")}{p("AI-generated content may occasionally contain inaccuracies, unintended bias, outdated information, or incomplete details. You are solely responsible for fact-checking, editing, and ensuring compliance before publishing or distributing any content created on this platform.")}</>)}
            {sec("NO PROFESSIONAL ADVICE",<>{p("Nothing generated by MandaStrong Studio constitutes legal, medical, financial, psychological, or any other form of professional advice. The platform is a creative production tool only. Always consult a qualified professional before acting on any information produced by AI tools.")}</>)}
            {sec("THIRD-PARTY SERVICES",<>{p("MandaStrong Studio integrates with third-party services including payment processors and AI providers. We are not responsible for the availability, accuracy, or conduct of these services. Your use of third-party services is governed by their own terms and privacy policies.")}</>)}
            {sec("INTELLECTUAL PROPERTY",<>{p("You are responsible for ensuring that content you upload, reference, or incorporate into your productions does not infringe third-party intellectual property rights. MandaStrong Studio accepts no liability for copyright infringement arising from user-generated or user-directed content.")}</>)}
            {sec("PLATFORM AVAILABILITY",<>{p("MandaStrong Studio is provided on an 'as available' basis. We do not guarantee uninterrupted access, error-free operation, or permanent data retention. We recommend downloading and backing up all completed productions regularly. We are not liable for loss of data or creative work.")}</>)}
            {sec("SOCIAL MISSION COMMITMENT",<>{p("A meaningful portion of all subscription revenue is directed to veterans mental health programmes and school anti-bullying initiatives. This commitment is a founding principle of MandaStrong Studio and is carried out in good faith. It does not constitute a legally binding charitable obligation under these terms.")}</>)}
            {sec("USER RESPONSIBILITY",<>{p("All responsibility for how content created on MandaStrong Studio is deployed, distributed, monetised, or shared rests entirely with the user. MandaStrong Studio shall not be held liable for any consequences arising from the publication or use of platform-generated content.")}</>)}
            {sec("CHANGES TO THIS DISCLAIMER",<>{p("MandaStrong Studio reserves the right to update this disclaimer at any time. Continued use of the platform following any update constitutes your acceptance of the revised terms.")}</>)}

            <div style={{background:"#050500",border:`1px solid ${GOLDDIM}`,padding:"12px 16px",marginTop:8}}>
              <p style={{color:GOLDDIM,fontSize:11,margin:0,letterSpacing:1}}>— AMANDA WOOLLEY · FOUNDER · MANDASTRONG STUDIO LLC · MARCH 2026 · mandastrongstudio.bolt.host</p>
            </div>
          </div>
        )}
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
      const r=await fetch("https://yrshnpjvplkwbpmmzwvb.supabase.co/functions/v1/claude-proxy",{method:"POST",headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:"You are Agent Grok, 24/7 assistant for MandaStrong Studio — professional cinema AI platform, 600+ tools, 8K export, films up to 3 hours, plans $20/$30/$50/mo with 7-day free trial. Be helpful and concise.",messages:[...msgs.filter(m=>m.role!=="system"),{role:"user",content:q}]})});
      const d=await r.json();setMsgs(p=>[...p,{role:"assistant",content:d.content&&d.content[0]?d.content[0].text:"Let me help!"}]);
    }catch(e){setMsgs(p=>[...p,{role:"assistant",content:"Unable to connect — check your connection and try again."}]);}
    setLoading(false);
  };
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{width:52,height:52,background:`linear-gradient(135deg,${GOLDDIM},${GOLD})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontFamily:"'Cinzel',serif",fontSize:26,fontWeight:900,color:"#000"}}>G</div>
          <h1 style={{...H1,fontSize:24}}>AGENT GROK</h1>
          <div style={{color:"#22c55e",fontSize:11,letterSpacing:3,marginTop:4,fontWeight:900}}>● ONLINE</div>
        </div>
        <div style={{...Card(),height:290,overflowY:"auto",marginBottom:10,display:"flex",flexDirection:"column",gap:8,padding:12}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{padding:"10px 14px",background:m.role==="user"?"rgba(232,201,109,0.08)":"rgba(26,82,118,0.2)",borderLeft:`2px solid ${m.role==="user"?GOLD:"#2980b9"}`}}>
              <span style={{fontSize:11,color:GOLD,display:"block",marginBottom:4,fontWeight:900,letterSpacing:2}}>{m.role==="user"?"YOU":"AGENT GROK"}</span>
              <span style={{color:WHITE,fontSize:14,lineHeight:1.7}}>{m.content}</span>
            </div>
          ))}
          {loading&&<div style={{padding:"10px 14px",background:"rgba(26,82,118,0.2)",borderLeft:"2px solid #2980b9",color:WHITE,fontSize:13}}>Thinking...</div>}
          <div ref={bot}/>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
          {qs.map(q=><button key={q} onClick={()=>setInp(q)} style={{...G("out",true),fontSize:11}}>{q}</button>)}
        </div>
        <div style={{display:"flex",gap:8}}>
          <textarea value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder="Ask Agent Grok anything..."
            style={{flex:1,height:50,resize:"none",padding:"10px 12px",fontSize:14,background:"#0a0a0a",border:`1px solid ${GOLDDIM}`,color:WHITE,outline:"none",lineHeight:1.5,fontFamily:"'Rajdhani',sans-serif"}}/>
          <button onClick={send} disabled={loading||!inp.trim()} style={{...G("gold",false),height:50,padding:"0 22px",opacity:loading||!inp.trim()?0.5:1}}>SEND</button>
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
        <div style={{fontSize:11,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>CREATOR NETWORK</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h1 style={{...H1,fontSize:28,margin:0}}>COMMUNITY HUB</h1>
          <button style={{...G("gold",false)}}>UPLOAD YOUR MOVIE</button>
        </div>
        {posts.map(p=>(
          <div key={p.id} style={{...Card(),marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:24}}>{p.icon}</span>
              <div>
                <div style={{color:GOLD,fontWeight:900,fontSize:14}}>{p.title}</div>
                <div style={{color:WHITE,fontSize:12}}>by {p.user}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{color:WHITE,fontSize:12}}>👁 {p.views.toLocaleString()}</span>
              <span style={{color:WHITE,fontSize:12}}>❤️ {p.likes.toLocaleString()}</span>
              <button onClick={()=>setPosts(ps=>ps.map(x=>x.id===p.id?{...x,likes:x.likes+1}:x))} style={{...G("out",true)}}>LIKE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function P23({ go }) {
  const [guideOpen,setGuideOpen]=useState(false);
  return (
    <div style={{...Sp,padding:"26px 40px 80px"}}>
      <div style={{maxWidth:820,margin:"0 auto",textAlign:"center"}}>
        <div style={{fontSize:10,color:GOLD,letterSpacing:6,marginBottom:10,fontWeight:700}}>MANDASTRONG STUDIO · CINEMA INTELLIGENCE PLATFORM · 2026</div>
        <h1 style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:"clamp(22px,3vw,32px)",fontWeight:900,letterSpacing:5,textShadow:`0 0 30px ${GOLD}99`,marginBottom:6}}>THAT'S ALL FOLKS</h1>
        <div style={{color:WHITE,fontSize:13,letterSpacing:3,marginBottom:14}}>THANK YOU FOR CREATING WITH US</div>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`,marginBottom:20}}/>
        <video autoPlay loop playsInline preload="auto" style={{width:"100%",aspectRatio:"16/9",background:"#000",border:`1px solid ${GOLD}`,marginBottom:20,display:"block"}} onError={e=>{e.currentTarget.style.display="none";}}>  
          <source src="/background.mp4" type="video/mp4"/>
          <source src="background.mp4" type="video/mp4"/>
        </video>
        <div style={{...Card(),textAlign:"left",marginBottom:14,background:"#050500",border:`2px solid ${GOLD}`}}>
          <div style={{color:GOLD,fontWeight:900,fontSize:14,letterSpacing:3,marginBottom:14,textAlign:"center"}}>✦ OUR MISSION</div>
          <p style={{color:WHITE,fontSize:14,lineHeight:2,margin:0}}>MandaStrong Studio was built with one belief — <strong style={{color:GOLD}}>that every person deserves the tools to tell their story.</strong> Not just the wealthy. Not just the technically gifted. Everyone.</p>
          <p style={{color:WHITE,fontSize:14,lineHeight:2,marginTop:12}}>We are a professional cinema intelligence platform giving creators access to <strong style={{color:GOLD}}>600+ AI filmmaking tools</strong>, a full production pipeline from script to screen, and the ability to produce films up to 3 hours long — all from a single platform.</p>
          <p style={{color:WHITE,fontSize:14,lineHeight:2,marginTop:12}}>Every subscription directly funds two causes close to our heart: <strong style={{color:GOLD}}>veterans mental health support</strong> and <strong style={{color:GOLD}}>school anti-bullying programmes</strong>. These are not marketing lines. They are the reason this platform exists.</p>
          <p style={{color:WHITE,fontSize:14,lineHeight:2,marginTop:12}}>I am Amanda Woolley — author, creative producer, and founder of MandaStrong Studio. I built this because I believe technology should serve humanity, and art should serve truth.</p>
          <p style={{color:GOLD,fontWeight:900,fontSize:13,letterSpacing:2,marginTop:12,marginBottom:4}}>— AMANDA WOOLLEY · FOUNDER · MANDASTRONG STUDIO</p>
          <p style={{color:WHITE,fontSize:11,letterSpacing:1,margin:0}}>MandaStrong1.Etsy.com · mandastrongstudio.bolt.host</p>
        </div>
        <div onClick={()=>setGuideOpen(g=>!g)}
          style={{...Card(),marginBottom:guideOpen?0:14,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",border:`1px solid ${GOLD}`}}>
          <span style={{color:GOLD,fontWeight:900,fontSize:14,letterSpacing:3}}>📖 MANDASTRONG HOW TO USE APP GUIDE</span>
          <span style={{color:GOLD,fontSize:18}}>{guideOpen?"▲":"▼"}</span>
        </div>
        {guideOpen&&(
          <div style={{...Card(),textAlign:"left",marginBottom:14,borderTop:"none"}}>
            <div style={{color:GOLD,fontWeight:900,fontSize:14,letterSpacing:3,marginBottom:4,textAlign:"center"}}>MANDASTRONG STUDIO — COMPLETE USER GUIDE</div>
            <div style={{color:DIM,fontSize:11,textAlign:"center",marginBottom:16,letterSpacing:2}}>23 PAGES · 600+ AI TOOLS · FULL CINEMA PIPELINE</div>
            {[
              ["🏠 GETTING STARTED","Use ☰ (top left) to open the Quick Access menu — jump to any of the 23 pages instantly. BACK / NEXT buttons in the footer navigate page by page. Hit 💾 SAVE PROJECT anytime to save your session. Hit 📂 MY PROJECTS to restore it."],
              ["🔑 PAGE 4 — LOGIN & PRICING","Sign in with your email, create a free account, or hit BROWSE AS GUEST to explore first. Plans: Creator $20/mo · Pro $30/mo · Studio $50/mo. Studio includes a 7-day free trial. Payments via Stripe."],
              ["✍ PAGE 5 — WRITING TOOLS","50+ AI writing tools. Click any card — Script to Movie, Beat Sheet Builder, Logline Generator, Character Arc Builder etc. Type your idea and hit AI CREATE. Results save to your Media Library."],
              ["🎙 PAGE 6 — VOICE ENGINE","55 cinematic voice characters. Select a voice from the left panel (filter by gender, age, origin). Paste your script in the SPEAK tab. Use sliders: Speed · Pitch · Volume · Pause. Hit PREPARE & SPEAK for AI-enhanced delivery. Documentary narrator: James — Speed 0.62, Pitch 0.86, Pause 1600ms."],
              ["🎬 PAGE 6 — MUSIC VIDEO STUDIO","Hit 🎬 MUSIC VIDEO STUDIO button on Page 6. Four steps: (1) Song title, artist, genre, mood, tempo — upload your audio track MP3/WAV. (2) Choose video style, colour grade, effects. (3) Describe your scene. (4) UPLOAD YOUR PHOTO — this is required for photorealistic output. Your photo becomes the video with Ken Burns zoom, candle glow, moonlight shimmer and atmospheric effects. Hit GENERATE MUSIC VIDEO."],
              ["🎨 PAGE 7 — IMAGE TOOLS","48 AI image tools. Text to Image, Portrait Generator, Character Design, Background Generator and more. Describe your image, hit AI CREATE, save to library."],
              ["🎥 PAGE 8 — VIDEO GENERATOR","The core scene engine. Type a scene description. Upload a reference image or video to match its style. Set duration (30–60s). Hit GENERATE SCENE. Each clip saves to IndexedDB and persists across sessions. Generate multiple clips to build your full film."],
              ["✨ PAGES 9 & 10 — MOTION & ENHANCEMENT","47+ VFX and enhancement tools including upscaling, colour grading, stabilisation, noise reduction. Select a tool, adjust intensity sliders, apply."],
              ["⬆ PAGE 11 — UPLOAD MEDIA","Drag and drop or browse to upload your own video, audio and image files. Everything goes to your Media Library. Clips generated on Page 8 also appear here automatically."],
              ["🗂 PAGE 12 — EDITOR SUITE","Central hub linking to all post-production tools: Media Library, Timeline Editor, Enhancement Studio, Audio Mixer, Render Engine, Preview Player."],
              ["⏱ PAGE 13 — TIMELINE EDITOR","Drag clips from the bottom panel onto VIDEO TRACK, AUDIO TRACK or TEXT/TITLES tracks. Hit ⚡ SYNC ALL TRACKS to auto-populate from your Media Library. Add tracks with + ADD TRACK. Hit → RENDER to proceed to the Render Engine."],
              ["🎚 PAGE 15 — AUDIO MIXER","4-channel mixing console. Drag sliders for VOICE, MUSIC, EFX and MASTER channels. Recommended documentary mix: VOICE 85 · MUSIC 40 · EFX 50 · MASTER 85. Hit SAVE PRESET to store your settings."],
              ["⚡ PAGE 16 — RENDER ENGINE","Loads all clips from IndexedDB storage. Checks video clips and audio track. Choose output quality (480p, 720p, 1080p, 4K), frame rate (24/30/60fps) and codec (VP9/VP8). Hit START RENDER — your complete film renders in-browser. Download or go to Preview when done."],
              ["▶ PAGE 17 — FILM PREVIEW","Full-screen video player with play/pause, seek bar, skip controls and time display. Watch your completed render before export."],
              ["📤 PAGE 18 — EXPORT & DISTRIBUTE","Download your film to device as WebM. Share directly to YouTube, Instagram, TikTok, Facebook, X/Twitter, LinkedIn, Vimeo and WhatsApp via direct upload links."],
              ["📚 PAGE 19 — TUTORIALS","Step-by-step guide for every feature with direct page links. Click any tutorial to jump straight to that part of the app."],
              ["⚖ PAGE 20 — TERMS & DISCLAIMER","Full Terms of Service and platform disclaimer. Read before commercial use."],
              ["G PAGE 21 — AGENT GROK","Your 24/7 AI studio assistant. Ask anything: how to use a tool, production advice, pricing, export settings. Access from Page 21 or the gold G button in the top-right header at any time."],
              ["👥 PAGE 22 — COMMUNITY HUB","See what other creators are making. Like films, upload your own work."],
              ["🎞 FULL PRODUCTION WORKFLOW","Complete pipeline: Page 8 (generate scenes) → Page 6 (record narration) → Page 13 (build timeline) → Page 15 (mix audio) → Page 16 (render film) → Page 17 (preview) → Page 18 (export & share)."],
              ["💾 SAVING & RESTORING PROJECTS","Hit 💾 SAVE PROJECT in the footer bar at any time. Name your session and add a note. Hit 📂 MY PROJECTS to see all saved sessions. Click CONTINUE PROJECT to restore your timeline, clips and settings exactly where you left off. All video clips persist in browser IndexedDB — they survive page refreshes."],
              ["📸 PHOTOREALISTIC VIDEO TIP","To get real human images in your music video, you MUST upload a reference photo. Canvas rendering cannot produce real people. Upload your photo in Music Video Studio Step 4 — it becomes your cinematic video background."],
            ].map(([t,d])=>(
              <div key={t} style={{borderBottom:`1px solid ${GOLDDIM}22`,paddingBottom:10,marginBottom:10}}>
                <div style={{color:GOLD,fontWeight:900,fontSize:12,letterSpacing:1,marginBottom:5}}>{t}</div>
                <div style={{color:WHITE,fontSize:12,lineHeight:1.8}}>{d}</div>
              </div>
            ))}
            <div style={{marginTop:8,textAlign:"center"}}>
              <button onClick={()=>go&&go(19)} style={{...G("gold",true),marginRight:8}}>📚 FULL TUTORIALS PAGE</button>
              <button onClick={()=>go&&go(21)} style={{...G("out",true)}}>ASK AGENT GROK</button>
            </div>
          </div>
        )}
        <div style={{...Card(),textAlign:"left",marginBottom:16,border:`1px solid ${GOLDDIM}`}}>
          <h2 style={{color:GOLD,fontWeight:900,fontSize:15,textAlign:"center",marginBottom:14,letterSpacing:3}}>✦ A SPECIAL THANK YOU ✦</h2>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9}}>From the bottom of my heart — <strong style={{color:GOLD}}>thank you.</strong> Whether you are here to capture precious family memories, tell a story that has lived in your head for years, or simply explore what is possible when creativity meets technology — you chose to do it with MandaStrong Studio.</p>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9}}>Every subscription supports <strong style={{color:GOLD}}>veterans mental health initiatives</strong> and <strong style={{color:GOLD}}>school anti-bullying programs</strong> — causes deeply personal to me as the author of <em>Doxy the School Bully.</em></p>
          <p style={{color:GOLD,fontWeight:900,fontSize:14,letterSpacing:2,marginBottom:4}}>— AMANDA WOOLLEY</p>
          <p style={{color:WHITE,fontSize:12,letterSpacing:1}}>Founder · MandaStrong Studio · MandaStrong1.Etsy.com</p>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>go(1)} style={{...G("out",false)}}>⬅ BACK TO HOME</button>
          <button onClick={()=>window.open("https://MandaStrong1.Etsy.com","_blank")} style={{...G("out",false)}}>VISIT ETSY STORE</button>
          <button onClick={()=>go(4)} style={{...G("gold",false)}}>START CREATING ✦</button>
        </div>
      </div>
    </div>
  );
}


const getPlanDuration=(plan)=>{const limits={"Creator":60,"Pro":120,"Studio":180,"Enterprise":180,"Studio Trial":180};return limits[plan]||60;};

export default function App() {
  const [page,setPage]=useState(1);
  const [menu,setMenu]=useState(false);
  const [visited,setVisited]=useState(()=>new Set([1]));

  useEffect(()=>{
    // Fonts
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Rajdhani:wght@400;600;700;800;900&display=swap";
    document.head.appendChild(link);
    // Viewport — responsive for all devices
    let vp=document.querySelector("meta[name=viewport]");
    if(!vp){vp=document.createElement("meta");vp.name="viewport";document.head.appendChild(vp);}
    vp.content="width=device-width,initial-scale=1,maximum-scale=5,user-scalable=yes,viewport-fit=cover";
    // Global responsive + Bolt badge suppression
    const style=document.createElement("style");
    style.textContent=`
      *{box-sizing:border-box!important;}
      html,body{margin:0;padding:0;width:100%;overflow-x:hidden;-webkit-text-size-adjust:100%;text-size-adjust:100%;}
      img,video,canvas{max-width:100%;height:auto;}
      input,button,textarea,select{font-family:inherit;max-width:100%;}

      /* Hide Bolt badge */
      [data-bolt-badge],a[href*='bolt.new'],.bolt-badge,[class*='bolt'],[id*='bolt'],
      div[style*='bolt'],iframe[src*='bolt'],a[href*='stackblitz'],[class*='stackblitz']
      {display:none!important;opacity:0!important;pointer-events:none!important;width:0!important;height:0!important;overflow:hidden!important;}

      /* ── TABLET 600–900px ── */
      @media(max-width:900px){
        div[style*="grid-template-columns: repeat(4"]{grid-template-columns:1fr 1fr!important;}
        div[style*="grid-template-columns: repeat(3"]{grid-template-columns:1fr 1fr!important;}
        div[style*="gridTemplateColumns: repeat(4"]{grid-template-columns:1fr 1fr!important;}
        div[style*="gridTemplateColumns: repeat(3"]{grid-template-columns:1fr 1fr!important;}
        div[style*="grid-template-columns: 1fr 1fr 1fr"]{grid-template-columns:1fr 1fr!important;}
        div[style*="gridTemplateColumns: 1fr 1fr 1fr"]{grid-template-columns:1fr 1fr!important;}
        div[style*="290px 1fr"]{grid-template-columns:1fr!important;}
        div[style*="1fr 420px"]{grid-template-columns:1fr!important;}
        div[style*="1fr 320px"]{grid-template-columns:1fr!important;}
      }

      /* ── MOBILE ≤600px ── */
      @media(max-width:600px){
        div[style*="grid-template-columns"]{grid-template-columns:1fr!important;}
        div[style*="gridTemplateColumns"]{grid-template-columns:1fr!important;}
        div[style*="display: grid"]{grid-template-columns:1fr!important;}
        div[style*="padding: 40px"]{padding:16px!important;}
        div[style*="padding:40px"]{padding:16px!important;}
        div[style*="padding: 20px"]{padding:12px!important;}
        div[style*="padding:20px"]{padding:12px!important;}
        h1[style]{font-size:clamp(18px,5vw,28px)!important;}
        div[style*="fontSize: 28"]{font-size:20px!important;}
        div[style*="fontSize:28"]{font-size:20px!important;}
        div[style*="fontSize: 30"]{font-size:22px!important;}
        div[style*="fontSize:30"]{font-size:22px!important;}
        /* Footer wraps nicely */
        footer > div:last-child{flex-wrap:wrap!important;gap:6px!important;}
        footer > div:last-child > *{font-size:10px!important;padding:4px 8px!important;}
        /* Header */
        header{height:auto!important;padding:8px 12px!important;flex-wrap:wrap!important;}
        /* Modals full width */
        div[style*="min(580px"]{width:98vw!important;}
        div[style*="min(600px"]{width:98vw!important;}
        div[style*="min(960px"]{width:100vw!important;height:100vh!important;}
        div[style*="min(400px"]{width:96vw!important;}
        /* Voice page sidebar stacks */
        div[style*="290px 1fr"]{display:block!important;}
        div[style*="gridTemplateColumns: 290px"]{display:block!important;}
      }

      /* ── TOUCH targets ── */
      @media(hover:none){
        button,a,[role=button]{min-height:44px;min-width:44px;}
      }

      /* ── SAFE AREA for notched phones ── */
      @supports(padding:max(0px)){
        body{
          padding-left:env(safe-area-inset-left);
          padding-right:env(safe-area-inset-right);
          padding-bottom:env(safe-area-inset-bottom);
        }
      }
    `;
    document.head.appendChild(style);
    return()=>{try{document.head.removeChild(link);}catch{}};
  },[]);
  const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem("ms_user")||'{"name":"Guest","plan":"Guest","isAdmin":false}');}catch{return {name:"Guest",plan:"Guest",isAdmin:false};}});
  const [mediaLib,setMediaLib]=useState([]);
  const [timeline,setTimeline]=useState(()=>{try{return JSON.parse(localStorage.getItem("ms_timeline")||"{}");}catch{return {};}});
  const [rendered,setRendered]=useState(null);
  const [filmDuration,setFilmDuration]=useState(60);
  const [savedNotice,setSavedNotice]=useState(false);
  const [showHistory,setShowHistory]=useState(false);
  const [showSaveModal,setShowSaveModal]=useState(false);

  const go=p=>{setPage(p);setVisited(v=>{const n=new Set(v);n.add(p);return n;});window.scrollTo(0,0);try{localStorage.setItem("ms_page",JSON.stringify(p));}catch{}};

  // Auto-restore last session on app load + restore clips from IndexedDB
  useEffect(()=>{
    const restore=async()=>{
      try{
        const t=JSON.parse(localStorage.getItem("ms_timeline")||"{}");
        if(Object.keys(t).length>0)setTimeline(t);
      }catch(e){}
      // Restore video clips from IndexedDB — survives page refresh
      try{
        const dbClips=await getAllClipsFromDB();
        if(dbClips.length>0){
          const restored=dbClips.map(c2=>({
            id:c2.id,name:c2.name,type:c2.type||"video/webm",
            url:URL.createObjectURL(c2.blob),file:new File([c2.blob],c2.name,{type:c2.type||"video/webm"}),
            dbId:c2.id
          }));
          setMediaLib(restored);
        } else {
          // Fallback to localStorage
          try{
            const m=JSON.parse(localStorage.getItem("ms_medialib")||"[]");
            if(m.length>0)setMediaLib(m);
          }catch(e){}
        }
      }catch(e){
        try{
          const m=JSON.parse(localStorage.getItem("ms_medialib")||"[]");
          if(m.length>0)setMediaLib(m);
        }catch(e2){}
      }
    };
    restore();
    // Listen for open history event from child components
    const handler=()=>setShowHistory(true);
    window.addEventListener("ms_open_history",handler);
    return()=>window.removeEventListener("ms_open_history",handler);
  },[]);
  const saveAsset=async(a)=>{
    // Save to IndexedDB if it has a file blob
    if(a.file instanceof File||a.file instanceof Blob){
      try{
        const blob=a.file instanceof File?a.file:a.file;
        const dbId=a.id||("asset_"+Date.now());
        await saveClipToDB(dbId,blob,a.name||"asset",a.type||"video/webm");
        setMediaLib(p=>[...p,{...a,dbId}]);
      }catch(e){setMediaLib(p=>[...p,a]);}
    } else {
      setMediaLib(p=>[...p,a]);
    }
  };

  const saveProject=()=>setShowSaveModal(true);

  const doSave=(name,note)=>{
    try{
      localStorage.setItem("ms_page",JSON.stringify(page));
      localStorage.setItem("ms_user",JSON.stringify(user));
      localStorage.setItem("ms_timeline",JSON.stringify(timeline));
      localStorage.setItem("ms_medialib",JSON.stringify(mediaLib.map(a=>({...a,file:undefined}))));
      const entry={name,note,page,assetCount:mediaLib.length,date:new Date().toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),savedPage:page,savedTimeline:JSON.parse(JSON.stringify(timeline)),savedUser:user};
      const existing=JSON.parse(localStorage.getItem("ms_project_history")||"[]");
      existing.push(entry);
      if(existing.length>20)existing.shift();
      localStorage.setItem("ms_project_history",JSON.stringify(existing));
      setShowSaveModal(false);setSavedNotice(true);setTimeout(()=>setSavedNotice(false),2500);
    }catch(e){setShowSaveModal(false);alert("Saved!");}
  };

  const resumeProject=async(h)=>{
    try{
      // Restore timeline
      if(h.savedTimeline&&Object.keys(h.savedTimeline).length>0){
        setTimeline(h.savedTimeline);
        localStorage.setItem("ms_timeline",JSON.stringify(h.savedTimeline));
      }
      // Restore user
      if(h.savedUser&&h.savedUser.name){
        setUser(h.savedUser);
        localStorage.setItem("ms_user",JSON.stringify(h.savedUser));
      }
      // Always restore clips from IndexedDB — fresh blob URLs
      try{
        const dbClips=await getAllClipsFromDB();
        if(dbClips.length>0){
          const restored=dbClips.map(c2=>({
            id:c2.id,name:c2.name,type:c2.type||"video/webm",
            url:URL.createObjectURL(c2.blob),
            file:new File([c2.blob],c2.name,{type:c2.type||"video/webm"}),
            dbId:c2.id
          }));
          setMediaLib(restored);
        }
      }catch(e){}
      const targetPage=h.savedPage||h.page||8;
      go(targetPage);
      setShowHistory(false);
      setSavedNotice(true);
      setTimeout(()=>setSavedNotice(false),2500);
    }catch(e){
      console.error("Resume error:",e);
      setShowHistory(false);
    }
  };

const allPages=[
    {p:1,el:<P1 go={go}/>},
    {p:2,el:<P2 go={go}/>},
    {p:3,el:<P3 onSave={saveAsset}/>},
    {p:4,el:<P4 go={go} setUser={setUser}/>},
    {p:5,el:<ToolPage title="WRITING TOOLS" subtitle="AI WORKSTATION 01 — WRITING" tools={WRITING} onSave={saveAsset}/>},
    {p:6,el:<P6Voice onSave={saveAsset}/>},
    {p:7,el:<ToolPage title="IMAGE TOOLS" subtitle="AI WORKSTATION 03 — IMAGE" tools={IMAGE_T} onSave={saveAsset}/>},
    {p:8,el:<P8VideoGenerator key="p8vg" onSave={saveAsset} user={user} filmDuration={filmDuration} setFilmDuration={setFilmDuration}/>},
    {p:9,el:<ToolPage title="MOTION & VFX" subtitle="AI WORKSTATION 05 — MOTION" tools={MOTION} onSave={saveAsset}/>},
    {p:10,el:<ToolPage title="ENHANCEMENT STUDIO" subtitle="AI WORKSTATION 06 — ENHANCE" tools={MOTION} onSave={saveAsset}/>},
    {p:11,el:<P11 mediaLib={mediaLib} setMediaLib={setMediaLib}/>},
    {p:12,el:<P12 go={go} mediaLib={mediaLib}/>},
    {p:13,el:<P13 go={go} mediaLib={mediaLib} timeline={timeline} setTimeline={setTimeline} user={user} filmDuration={filmDuration} setFilmDuration={setFilmDuration}/>},
    {p:14,el:<P14/>},
    {p:15,el:<P15/>},
    {p:16,el:<P16 go={go} timeline={timeline} setRendered={setRendered} mediaLib={mediaLib} setMediaLib={setMediaLib} user={user} filmDuration={filmDuration} setFilmDuration={setFilmDuration}/>},
    {p:17,el:<P17 go={go} rendered={rendered} mediaLib={mediaLib}/>},
    {p:18,el:<P18 rendered={rendered} mediaLib={mediaLib}/>},
    {p:19,el:<P19 go={go}/>},
    {p:20,el:<P20/>},
    {p:21,el:<P21/>},
    {p:22,el:<P22/>},
    {p:23,el:<P23 go={go}/>},
  ];

  return (
    <div style={{background:"#000",minHeight:"100vh",fontFamily:"'Rajdhani',sans-serif"}}>
      <Header go={go} setMenu={setMenu}/>
      {menu&&<QAMenu go={go} onClose={()=>setMenu(false)} user={user}/>}
      {showHistory&&<ProjectHistoryModal onClose={()=>setShowHistory(false)} onResume={resumeProject}/>}
      {showSaveModal&&<SaveSessionModal onClose={()=>setShowSaveModal(false)} onSave={doSave} currentPage={page} assetCount={mediaLib.length}/>}
      {savedNotice&&<div style={{position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",background:GOLDDIM,color:"#000",padding:"10px 24px",fontWeight:900,fontSize:13,letterSpacing:2,zIndex:999}}>✓ PROJECT SAVED</div>}
      <div style={{minHeight:"calc(100vh - 116px)"}}>
        {allPages.map(({p,el})=>(
          page===p ? (
            <div key={p} style={{display:"block"}}>{el}</div>
          ) : visited.has(p) ? (
            <div key={p} style={{display:"none"}}>{el}</div>
          ) : null
        ))}
      </div>
      <Footer page={page} go={go} onSave={saveProject} onHistory={()=>setShowHistory(true)}/>
    </div>
  );
}
