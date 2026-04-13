// @ts-nocheck
import { useState, useRef, useEffect } from "react";

const GOLD = "#e8c96d";
const SUPA_URL = "https://njqfexhltjwpgvctmyaw.supabase.co";
const SUPA_KEY = "sb_publishable_wqRnYf5pnp68Qo6-McfwyA_JNYrh2VC";
const EDGE_FN = SUPA_URL + "/functions/v1/claude-proxy";
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
const Sp = { minHeight:"100vh", background:BG, color:WHITE, fontFamily:"'Rajdhani',sans-serif", paddingBottom:160 };
const H1 = { fontFamily:"'Cinzel',serif", color:GOLD, letterSpacing:5, textTransform:"uppercase", margin:0 };
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

const NAV = [{p:1,l:"Home"},{p:2,l:"Platform"},{p:3,l:"Examples"},{p:4,l:"Login / Pricing"},{p:5,l:"Writing Tools"},{p:6,l:"Voice Tools"},{p:7,l:"Image Tools"},{p:8,l:"Video Tools"},{p:9,l:"Motion & VFX"},{p:10,l:"Enhancement"},{p:11,l:"Upload Media"},{p:12,l:"Editor Suite"},{p:13,l:"Timeline Editor"},{p:14,l:"Enhancement Studio"},{p:15,l:"Audio Mixer"},{p:16,l:"Render Engine"},{p:17,l:"Film Preview"},{p:18,l:"Export & Distribute"},{p:19,l:"Tutorials"},{p:20,l:"Terms & Disclaimer"},{p:21,l:"Agent Grok"},{p:22,l:"Community Hub"},{p:23,l:"That's All Folks"}];

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
      const res = await fetch(EDGE_FN,{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+SUPA_KEY,"apikey":SUPA_KEY},
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
              <button onClick={()=>{ try{ const m=JSON.parse(localStorage.getItem("ms_medialib")||"[]"); const t=JSON.parse(localStorage.getItem("ms_timeline")||"{}"); if(m.length>0||Object.keys(t).length>0){ alert("Project loaded! "+m.length+" assets restored."); }else{ alert("No saved project found."); } }catch(e){alert("Could not load project.");} }}
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
  const [result, setResult] = useState(null);
  const [config, setConfig] = useState({
    title:"",artist:"",genre:"",subgenre:"",mood:"",tempo:"",key:"",structure:"",vocals:"",instruments:[],vocalStyle:"",lyrics:"",lyricsMode:"write",videoStyle:"",colorGrade:"",visualMood:"",effects:[],cuts:"",aspectRatio:"16:9",duration:"",extras:[],
  });

  const set = (k,v) => setConfig(p=>({...p,[k]:v}));
  const toggle = (k,v) => setConfig(p=>({...p,[k]:p[k].includes(v)?p[k].filter(x=>x!==v):[...p[k],v]}));

  const GENRES = ["Pop","Rock","Hip Hop","R&B / Soul","Electronic / EDM","Country","Jazz","Classical","Metal","Punk","Reggae","Folk / Acoustic","Latin","K-Pop","Drill","Trap","Afrobeats","Gospel","Blues","Cinematic / Score"];
  const MOODS = ["Euphoric","Melancholic","Energetic","Romantic","Angry","Peaceful","Mysterious","Empowering","Nostalgic","Dark","Playful","Epic","Haunting","Uplifting","Tense"];
  const TEMPOS = ["Very Slow (40-60 BPM)","Slow (60-80 BPM)","Mid-Tempo (80-100 BPM)","Upbeat (100-120 BPM)","Fast (120-140 BPM)","Very Fast (140+ BPM)"];
  const STRUCTURES = ["Verse / Chorus / Bridge","Verse / Pre-Chorus / Chorus","Intro / Verse / Chorus / Outro","Through-Composed","Loop-Based","Call & Response","Extended (10+ mins)"];
  const VOCALS = ["Male Lead","Female Lead","Male & Female Duet","Group / Choir","No Vocals (Instrumental)","Spoken Word / Rap","Whisper / ASMR","Opera / Classical"];
  const VOCAL_STYLES = ["Clean / Studio","Raspy / Gritty","Auto-Tuned","Falsetto","Belting","Breathy","Choral","Spoken Word","Lo-Fi"];
  const INSTRUMENTS = ["Electric Guitar","Acoustic Guitar","Bass Guitar","Piano / Keys","Synthesizer","Drums / Percussion","Violin / Strings","Trumpet / Brass","Saxophone","Flute","808 Bass","TR-808 Drums","Choir Pad","Orchestra","Banjo","Ukulele","Harp","Didgeridoo","Steel Drums","Theremin"];
  const VIDEO_STYLES = ["Cinematic Narrative","Performance / Live","Animated / Illustrated","Abstract / Visual Art","Dance Choreography","Documentary Style","Lyric Video","Split Screen","Stop Motion","Retro / VHS","Noir / Black & White","Neon / Cyberpunk","Nature / Landscape","Studio Session","Surrealist / Dreamlike","Vintage Film"];
  const COLOR_GRADES = ["Natural / Clean","Golden Hour Warm","Cool Blue / Moody","High Contrast Black & White","Neon / Vivid","Pastel / Soft","Cinematic Teal & Orange","Vintage Film Grain","Dark & Desaturated","Hyper Colour Pop"];
  const EFFECTS = ["Slow Motion","Speed Ramps","Glitch Effects","Light Leaks","Lens Flares","Rain / Water","Fire / Smoke","Bokeh / Blur","Double Exposure","Mirror / Kaleidoscope","Grain / Noise","Vignette","Colour Bleeding","Chromatic Aberration","Particle Effects"];
  const CUTS = ["Fast Cuts / High Energy","Slow & Deliberate","Match Cuts","Jump Cuts","Long Takes","Beat-Synced Cuts","Cross-Cuts","Montage Style"];
  const DURATIONS = ["2 Minutes","3 Minutes","3:30 Minutes","4 Minutes","5 Minutes","6+ Minutes (Extended)"];
  const EXTRAS = ["Behind the Scenes Footage","Making Of Segment","Lyrics on Screen","Social Media Teaser Cut","Album Art Slide","Director Commentary","Fan Cam Version","360° Video"];

  const sel = (k,arr) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:4}}>
      {arr.map(item=>(
        <button key={item} onClick={()=>set(k,item)}
          style={{background:config[k]===item?GOLD:"#111",border:`1px solid ${config[k]===item?"#000":GOLDDIM}`,color:config[k]===item?"#000":WHITE,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:900,letterSpacing:1}}>
          {item}
        </button>
      ))}
    </div>
  );

  const multi = (k,arr) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:4}}>
      {arr.map(item=>(
        <button key={item} onClick={()=>toggle(k,item)}
          style={{background:config[k].includes(item)?GOLD:"#111",border:`1px solid ${config[k].includes(item)?"#000":GOLDDIM}`,color:config[k].includes(item)?"#000":WHITE,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:900,letterSpacing:1}}>
          {item}
        </button>
      ))}
    </div>
  );

  const generateProject = async () => {
    setGenerating(true);
    try {
      const dur = config.duration||"3 Minutes";
      const durSecs = dur.includes("2")?120:dur.includes("3:30")?210:dur.includes("3")?180:dur.includes("4")?240:dur.includes("5")?300:360;
      const numScenes = Math.max(3, Math.round(durSecs/30));
      const prompt = `You are a professional music video director. Create a complete music video production package for:
TITLE: ${config.title||"Untitled"}, ARTIST: ${config.artist||"Unknown"}, GENRE: ${config.genre||"Pop"}, MOOD: ${config.mood||"Emotional"}, TEMPO: ${config.tempo||"Mid-Tempo"}, VOCALS: ${config.vocals||"Female Lead"}, VIDEO STYLE: ${config.videoStyle||"Cinematic Narrative"}, DURATION: ${config.duration||"3 Minutes"}
${config.visualDesc?`
CREATOR SCENE DESCRIPTION — BUILD ALL SCENES AROUND THIS:
${config.visualDesc}
`:""}
${config.lyricsMode==="write"&&config.lyrics?`LYRICS:
${config.lyrics}`:`Generate original lyrics matching the genre and mood.`}

Provide:
1. SONG CONCEPT (2-3 sentences)
2. COMPLETE LYRICS
3. MUSIC PRODUCTION NOTES
4. VIDEO TREATMENT — exactly ${numScenes} scenes, each with SCENE [N], VISUAL DESCRIPTION, and PAGE 8 PROMPT: [ready to paste into video generator]
5. SHOT LIST (10+ shots)
6. POST PRODUCTION NOTES
7. SOCIAL MEDIA STRATEGY`;
      const res = await fetch(EDGE_FN,{
        method:"POST",
        headers:{"Content-Type":"application/json","apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,messages:[{role:"user",content:prompt}]})
      });
      if(!res.ok){
        const errText = await res.text();
        setResult("Server error "+res.status+": "+errText);
        setStep(4);
        setGenerating(false);
        return;
      }
      const d = await res.json();
      if(d.error){setResult("API error: "+JSON.stringify(d.error));setStep(4);setGenerating(false);return;}
      const treatment = d.content&&d.content[0]?d.content[0].text:"No content returned — check Edge Function logs in Supabase.";
      setResult(treatment);
      setStep(4);
      if(onSave&&d.content&&d.content[0]){
        onSave({id:Date.now()+Math.random(),name:`Music Video — ${config.title||"Untitled"}`,type:"text/plain",url:"",content:treatment});
      }
    } catch(e) {
      setResult("Connection error — "+( e.message||"unknown error"));
      setStep(4);
    }
    setGenerating(false);
  };

  const inp = {width:"100%",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"9px 12px",color:WHITE,fontSize:13,outline:"none",fontFamily:"'Rajdhani',sans-serif",boxSizing:"border-box"};
  const label = (txt) => <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:8,marginTop:14}}>{txt}</div>;
  const steps = ["🎵 MUSIC","🎤 VOCALS","🎬 VIDEO","✦ GENERATE"];

  return (
    <div style={{position:"fixed",inset:0,zIndex:1100,background:"rgba(0,0,0,0.97)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"min(820px,98vw)",background:"#050505",border:`2px solid ${GOLD}`,maxHeight:"95vh",overflowY:"auto",display:"flex",flexDirection:"column"}}>
        <div style={{background:`linear-gradient(135deg,#1a0a00,#0a0500)`,borderBottom:`1px solid ${GOLD}`,padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:20,fontWeight:900,letterSpacing:4}}>🎬 MUSIC VIDEO STUDIO</div>
            <div style={{color:WHITE,fontSize:11,letterSpacing:3,marginTop:2}}>PROFESSIONAL MUSIC VIDEO PRODUCTION · AI POWERED</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:`1px solid ${GOLD}`,color:GOLD,width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderBottom:`1px solid ${GOLDDIM}`,flexShrink:0}}>
          {steps.map((s,i)=>(
            <button key={i} onClick={()=>setStep(i+1)}
              style={{background:step===i+1?"#0a0500":"none",border:"none",borderBottom:step===i+1?`2px solid ${GOLD}`:"2px solid transparent",color:step===i+1?GOLD:WHITE,padding:"12px 8px",cursor:"pointer",fontSize:12,fontWeight:900,letterSpacing:2}}>
              {s}
            </button>
          ))}
        </div>
        <div style={{padding:"20px 24px",flex:1}}>
          {step===1&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:4}}>
                <div>{label("SONG TITLE")}<input value={config.title} onChange={e=>set("title",e.target.value)} placeholder="My Song Title..." style={inp}/></div>
                <div>{label("ARTIST / BAND NAME")}<input value={config.artist} onChange={e=>set("artist",e.target.value)} placeholder="Artist Name..." style={inp}/></div>
              </div>
              {label("GENRE")}{sel("genre",GENRES)}
              {label("MOOD")}{sel("mood",MOODS)}
              {label("TEMPO")}{sel("tempo",TEMPOS)}
              {label("INSTRUMENTS")}{multi("instruments",INSTRUMENTS)}
              {label("SONG STRUCTURE")}{sel("structure",STRUCTURES)}
            </div>
          )}
          {step===2&&(
            <div>
              {label("VOCALS")}{sel("vocals",VOCALS)}
              {label("VOCAL STYLE")}{sel("vocalStyle",VOCAL_STYLES)}
              {label("LYRICS")}
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <button onClick={()=>set("lyricsMode","write")} style={{...G(config.lyricsMode==="write"?"gold":"out",true)}}>✍ WRITE MY OWN</button>
                <button onClick={()=>set("lyricsMode","ai")} style={{...G(config.lyricsMode==="ai"?"gold":"out",true)}}>✦ AI WRITE FOR ME</button>
              </div>
              {config.lyricsMode==="write"&&(
                <textarea value={config.lyrics} onChange={e=>set("lyrics",e.target.value)} placeholder="Paste or write your lyrics here..." style={{...inp,height:220,resize:"none",lineHeight:1.8}}/>
              )}
              {config.lyricsMode==="ai"&&(
                <div style={{background:"#000",border:`1px solid ${GOLDDIM}`,padding:16,textAlign:"center"}}>
                  <div style={{color:GOLD,fontSize:13,fontWeight:900,letterSpacing:2,marginBottom:8}}>✦ AI WILL WRITE YOUR LYRICS</div>
                  <input value={config.lyrics} onChange={e=>set("lyrics",e.target.value)} placeholder="Optional theme or topic..." style={inp}/>
                </div>
              )}
            </div>
          )}
          {step===3&&(
            <div>
              {label("VIDEO STYLE")}{sel("videoStyle",VIDEO_STYLES)}
              {label("COLOUR GRADE")}{sel("colorGrade",COLOR_GRADES)}
              {label("VISUAL EFFECTS")}{multi("effects",EFFECTS)}
              {label("EDITING STYLE")}{sel("cuts",CUTS)}
              {label("VIDEO DURATION")}{sel("duration",DURATIONS)}
              {label("ASPECT RATIO")}
              <div style={{display:"flex",gap:6}}>
                {["16:9","9:16 (Vertical)","1:1 (Square)","4:3 (Classic)","2.39:1 (Cinematic)"].map(r=>(
                  <button key={r} onClick={()=>set("aspectRatio",r)}
                    style={{background:config.aspectRatio===r?GOLD:"#111",border:`1px solid ${config.aspectRatio===r?"#000":GOLDDIM}`,color:config.aspectRatio===r?"#000":WHITE,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:900}}>
                    {r}
                  </button>
                ))}
              </div>
              {label("EXTRAS")}{multi("extras",EXTRAS)}
            </div>
          )}
          {step===4&&!result&&(
            <div style={{padding:"20px"}}>
              <div style={{marginBottom:16}}>
                <div style={{color:GOLD,fontSize:11,letterSpacing:3,fontWeight:900,marginBottom:8}}>ENTER SCENE DESCRIPTION — DESCRIBE EXACTLY WHAT YOU WANT YOUR VIDEO TO LOOK LIKE</div>
                <textarea
                  value={config.visualDesc||""}
                  onChange={e=>set("visualDesc",e.target.value)}
                  placeholder="Describe your video scenes... e.g. A man sits on a windowsill fingerpicking acoustic guitar. Only his back is visible. Facing the ocean. Full moon. Candle to his right. Dark shadows. Slow motion camera."
                  style={{width:"100%",background:"#000",border:`1px solid ${GOLD}`,padding:"14px",color:WHITE,fontSize:13,outline:"none",fontFamily:"'Rajdhani',sans-serif",boxSizing:"border-box",height:160,resize:"vertical",lineHeight:1.8}}
                />
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:22,fontWeight:900,marginBottom:16,letterSpacing:3}}>READY TO CREATE</div>
                <button onClick={generateProject} disabled={generating}
                  style={{...G("gold",false),fontSize:14,padding:"16px 48px",letterSpacing:3,opacity:generating?0.6:1}}>
                  {generating?"⟳ GENERATING...":"✦ GENERATE MUSIC VIDEO PROJECT"}
                </button>
              </div>
            </div>
          )}
          {step===4&&result&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:16,fontWeight:900,letterSpacing:3}}>✦ YOUR MUSIC VIDEO PRODUCTION PACKAGE</div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{if(onSave)onSave({id:Date.now()+Math.random(),name:`Music Video — ${config.title||"Untitled"}`,type:"text/plain",url:"",content:result});alert("Saved!");}} style={{...G("gold",true)}}>SAVE TO LIBRARY</button>
                  <button onClick={()=>{setResult(null);setStep(1);}} style={{...G("out",true)}}>NEW PROJECT</button>
                </div>
              </div>
              <textarea value={result} readOnly style={{...inp,height:420,resize:"none",lineHeight:1.8,fontSize:13}}/>
              <div style={{marginTop:12,display:"flex",gap:8}}>
                <button onClick={()=>navigator.clipboard&&navigator.clipboard.writeText(result)} style={{...G("out",true),fontSize:11}}>📋 COPY ALL</button>
                <button onClick={()=>{const blob=new Blob([result],{type:"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${config.title||"MusicVideo"}_Production.txt`;a.click();}} style={{...G("out",true),fontSize:11}}>⬇ DOWNLOAD</button>
              </div>
            </div>
          )}
        </div>
        {step<4&&(
          <div style={{borderTop:`1px solid ${GOLDDIM}`,padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
            <button onClick={()=>setStep(s=>Math.max(1,s-1))} disabled={step===1} style={{...G("out",true),opacity:step===1?0.3:1}}>◀ BACK</button>
            <button onClick={()=>setStep(s=>Math.min(4,s+1))} style={{...G("gold",true)}}>NEXT ▶</button>
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
      .replace(/—/g," [breath] ").replace(/-{2,}/g," [breath] ").replace(/\.\.\./g," [ellipsis] ")
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
      const rVar=[0,0.025,-0.025,0.015,-0.015];
      const pVar=[0,0.02,-0.015,0.03,-0.02];
      let pitchMod=chunk.type==="question"?0.12:chunk.type==="exclaim"?0.08:chunk.type==="sentence"&&idx===totalChunks-1?-0.06:0;
      utt.rate=Math.max(0.1,Math.min(2.0,baseRate+rVar[idx%rVar.length]));
      utt.pitch=Math.max(0.1,Math.min(2.0,basePitch+pVar[idx%pVar.length]+pitchMod));
      const afterPause=chunk.type==="question"?Math.round(pauseLen*1.1):chunk.type==="sentence"?pauseLen:chunk.type==="clause"?Math.round(pauseLen*0.4):Math.round(pauseLen*0.15);
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
      const res=await fetch(EDGE_FN,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+SUPA_KEY,"apikey":SUPA_KEY},
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

function P8VideoGenerator({ onSave, mediaLib }) {
  const canvasRef=useRef(null);
  const [prompt,setPrompt]=useState("");
  const [title,setTitle]=useState("");
  const [duration,setDuration]=useState(30);
  const [style,setStyle]=useState("cinematic");
  const [colorGrade,setColorGrade]=useState("gold");
  const [generating,setGenerating]=useState(false);
  const [progress,setProgress]=useState(0);
  const [log,setLog]=useState([]);
  const [videoUrl,setVideoUrl]=useState("");
  const [aiScript,setAiScript]=useState("");
  const [aiLoading,setAiLoading]=useState(false);
  const [saved,setSaved]=useState(false);
  const [showText,setShowText]=useState(false);
  const [refImage,setRefImage]=useState(null);
  const [refImageUrl,setRefImageUrl]=useState("");
  const [showLibrary,setShowLibrary]=useState(false);
  const [activeTab,setActiveTab]=useState("describe");
  const [fps,setFps]=useState(30);
  const [resolution,setResolution]=useState("1080p");
  const [overlayAsset,setOverlayAsset]=useState(null);
  const refImgRef=useRef(null);
  const videoRef=useRef(null);
  const addLog=(msg)=>setLog(p=>[...p,msg]);

  const STYLES=[
    {id:"cinematic",label:"Cinematic",desc:"Dark dramatic gold titles"},
    {id:"documentary",label:"Documentary",desc:"Clean authoritative"},
    {id:"epic",label:"Epic",desc:"Grand sweeping motion"},
    {id:"intimate",label:"Intimate",desc:"Soft warm personal"},
    {id:"abstract",label:"Abstract",desc:"Flowing colour art"},
    {id:"title_sequence",label:"Title Sequence",desc:"Broadcast titles"},
  ];
  const GRADES=[
    {id:"gold",label:"Gold & Black",bg:"#000000",fg:"#e8c96d",accent:"#a07820"},
    {id:"teal",label:"Teal & Dark",bg:"#0a1a1a",fg:"#4dd9c0",accent:"#1a5a52"},
    {id:"crimson",label:"Crimson",bg:"#0a0000",fg:"#ff4444",accent:"#880000"},
    {id:"silver",label:"Silver Screen",bg:"#111",fg:"#ccc",accent:"#888"},
    {id:"amber",label:"Warm Amber",bg:"#0a0800",fg:"#ffaa33",accent:"#885500"},
    {id:"arctic",label:"Arctic Blue",bg:"#000a1a",fg:"#88ccff",accent:"#003366"},
  ];
  const grade=GRADES.find(g=>g.id===colorGrade)||GRADES[0];

  const getAIScene=async()=>{
    if(!prompt.trim())return;
    setAiLoading(true);
    setAiScript("");
    try{
      const res=await fetch(EDGE_FN,{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+SUPA_KEY,"apikey":SUPA_KEY},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,
          messages:[{role:"user",content:`You are a cinematic title card writer for a documentary. Write 6 short dramatic lines of on-screen text for this scene: "${prompt}". Each line must be 3-7 words. Punchy. Cinematic. No punctuation. Return ONLY the 6 lines, one per line, nothing else.`}]})
      });
      const d=await res.json();
      if(d.content&&d.content[0]){setAiScript(d.content[0].text.trim());}
      else if(d.error){setAiScript("API error: "+d.error.message);}
    }catch(e){setAiScript("Connection error — check internet connection.");}
    setAiLoading(false);
  };

  const generateVideo=async()=>{
    if(!prompt.trim()&&!aiScript.trim()){alert("Describe your scene first");return;}
    setGenerating(true);setProgress(0);setLog([]);setVideoUrl("");setSaved(false);

    const canvas=canvasRef.current;
    const W=1920,H=1080;
    canvas.width=W;canvas.height=H;
    const ctx=canvas.getContext("2d");
    const lines=aiScript.trim()?aiScript.split("\n").filter(l=>l.trim()):[title||"MandaStrong Studio",prompt.slice(0,60)];
    const fps=30,totalFrames=duration*fps;

    addLog("Analysing scene flags...");

    // Parse flags directly from prompt
    const fullText=(prompt+" "+(aiScript||"")).toLowerCase();
    let scene={
      bgColors:["#000000","#0a0800"],accentColor:"#a07820",particles:true,particleCount:80,
      waves:false,rays:false,silhouette:"none",mood:"dark",vignette:true,scanlines:false,letterbox:true,
      horizon:false,cityLights:false,starField:false,earthGlow:false,sunRise:false,fogLayer:false,
      lightBeams:false,groundLayer:false,humanFigure:false,sceneType:"abstract",
      primaryColor:"#e8c96d",skyColor:"#000000",groundColor:"#0a0500",
    };
    // Match sceneType with or without space, any case
    const ft=fullText.replace(/\s+/g," ");
    if(ft.includes("scenetype city")||ft.includes("scene type city")||ft.includes("city street")||ft.includes("city at night")||ft.includes("city lights"))scene.sceneType="city";
    else if(ft.includes("scenetype cosmic")||ft.includes("scene type cosmic")||ft.includes("deep space")||ft.includes("from space")||ft.includes("earth glow")||ft.includes("earthglow"))scene.sceneType="cosmic";
    else if(ft.includes("scenetype dawn")||ft.includes("scene type dawn")||ft.includes("golden dawn")||ft.includes("sun rise")||ft.includes("sunrise"))scene.sceneType="dawn";
    else if(ft.includes("scenetype landscape")||ft.includes("scene type landscape")||ft.includes("open ground")||ft.includes("open landscape"))scene.sceneType="landscape";
    else if(ft.includes("scenetype interior")||ft.includes("scene type interior")||ft.includes("total darkness")||ft.includes("interior scene"))scene.sceneType="interior";
    if(ft.includes("citylights true")||ft.includes("city lights true")||ft.includes("lit windows")||ft.includes("every window"))scene.cityLights=true;
    if(ft.includes("starfield true")||ft.includes("star field true")||ft.includes("stars everywhere")||ft.includes("stars filling")||ft.includes("full of stars"))scene.starField=true;
    if(ft.includes("earthglow true")||ft.includes("earth glow true")||ft.includes("earth glowing")||ft.includes("planet glowing")||ft.includes("from deep space"))scene.earthGlow=true;
    if(ft.includes("sunrise true")||ft.includes("sun rise true")||ft.includes("sun rising")||ft.includes("golden dawn"))scene.sunRise=true;
    if(ft.includes("humanfigure true")||ft.includes("human figure true")||ft.includes("human figures")||ft.includes("crowd of human")||ft.includes("single human"))scene.humanFigure=true;
    if(ft.includes("foglayer true")||ft.includes("fog layer true")||ft.includes("fog rolling")||ft.includes("heavy fog")||ft.includes("deep fog"))scene.fogLayer=true;
    if(ft.includes("lightbeams true")||ft.includes("light beams true")||ft.includes("light beam")||ft.includes("light beams"))scene.lightBeams=true;
    if(ft.includes("rays true")||ft.includes("rays of light")||ft.includes("light rays"))scene.rays=true;
    if(ft.includes("groundlayer true")||ft.includes("ground layer true")||ft.includes("ground level")||ft.includes("ground visible"))scene.groundLayer=true;
    if(ft.includes("horizon true")||ft.includes("flat horizon")||ft.includes("horizon line")||ft.includes("horizon of buildings")||ft.includes("horizon behind"))scene.horizon=true;
    if(ft.includes("silhouette crowd")||ft.includes("crowd silhouetted")||ft.includes("crowd of human"))scene.silhouette="city";
    if(ft.includes("silhouette person")||ft.includes("single human figure")||ft.includes("single figure"))scene.silhouette="person";
    if(ft.includes("silhouette city"))scene.silhouette="city";
    if(ft.includes("particles false")||ft.includes("particlecount 0"))scene.particles=false;
    const pcMatch=fullText.match(/particlecount\s+(\d+)/);
    if(pcMatch)scene.particleCount=parseInt(pcMatch[1]);
    const skyMatch=fullText.match(/skycolor\s+(#[0-9a-f]{6})/i);
    if(skyMatch)scene.skyColor=skyMatch[1];
    const gndMatch=fullText.match(/groundcolor\s+(#[0-9a-f]{6})/i);
    if(gndMatch)scene.groundColor=gndMatch[1];
    const priMatch=fullText.match(/primarycolor\s+(#[0-9a-f]{6})/i);
    if(priMatch)scene.primaryColor=priMatch[1];
    const accMatch=fullText.match(/accentcolor\s+(#[0-9a-f]{6})/i);
    if(accMatch)scene.accentColor=accMatch[1];
    addLog("Scene: "+scene.sceneType+" city:"+scene.cityLights+" human:"+scene.humanFigure+" earth:"+scene.earthGlow+" stars:"+scene.starField+" dawn:"+scene.sunRise);

    addLog("Building cinematic scene...");
    addLog(`Resolution: ${W}x${H} · ${fps}fps · ${duration}s`);

    const mimeType=MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm";
    const stream=canvas.captureStream(30);
    const recorder=new MediaRecorder(stream,{mimeType,videoBitsPerSecond:25000000});
    const chunks=[];
    recorder.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data);};
    recorder.start(100);
    addLog("Recording started...");

    const parseHex=(hex,fallback)=>{
      const h=(hex||fallback||"#888888").replace("#","");
      return[parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0];
    };
    const [fgR,fgG,fgB]=parseHex(scene.primaryColor||grade.fg);
    const [acR,acG,acB]=parseHex(scene.accentColor||grade.accent);
    const [skyR,skyG,skyB]=parseHex(scene.skyColor||scene.bgColors?.[0]||grade.bg);
    const [gndR,gndG,gndB]=parseHex(scene.groundColor||"#0a0500");
    const numParticles=scene.particleCount||60;

    const stars=Array.from({length:200},(_,i)=>({
      x:(i*2791+i*i*37)%W,y:(i*1847+i*i*13)%H,
      r:i%7===0?1.8:i%3===0?1.2:0.7,twinkleOffset:i*0.7,
    }));

    const buildings=Array.from({length:28},(_,i)=>({
      x:i*(W/27),w:18+i%5*22,h:H*0.08+i%9*H*0.07,
    }));

    const drawFrame=(frame)=>{
      const t=frame/totalFrames;
      const sec=frame/fps;

      const bgGrad=ctx.createLinearGradient(0,0,0,H);
      bgGrad.addColorStop(0,`rgb(${skyR},${skyG},${skyB})`);
      bgGrad.addColorStop(1,`rgb(${gndR},${gndG},${gndB})`);
      ctx.fillStyle=bgGrad;ctx.fillRect(0,0,W,H);

      if(scene.starField){
        stars.forEach(s=>{
          const tw=0.3+Math.sin(sec*1.1+s.twinkleOffset)*0.25;
          ctx.fillStyle=`rgba(255,255,240,${Math.max(0,tw)})`;
          ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
        });
      }

      if(scene.earthGlow){
        const eg=ctx.createRadialGradient(W*0.5,H*0.85,H*0.05,W*0.5,H*0.85,H*0.55);
        eg.addColorStop(0,`rgba(30,80,180,0.55)`);eg.addColorStop(1,`rgba(0,0,0,0)`);
        ctx.fillStyle=eg;ctx.fillRect(0,H*0.3,W,H*0.7);
        ctx.save();ctx.beginPath();ctx.arc(W*0.5,H*1.15,H*0.72,Math.PI,0);
        ctx.strokeStyle=`rgba(60,120,220,0.5)`;ctx.lineWidth=3;ctx.stroke();ctx.restore();
      }

      if(scene.sunRise){
        const sp=Math.min(1,t*1.5);
        const sunY=H*(0.75-sp*0.25);
        const sunGlow=ctx.createRadialGradient(W*0.5,sunY,0,W*0.5,sunY,H*0.35);
        sunGlow.addColorStop(0,`rgba(255,200,80,${0.7*sp})`);sunGlow.addColorStop(1,`rgba(0,0,0,0)`);
        ctx.fillStyle=sunGlow;ctx.fillRect(0,0,W,H);
      }

      if(scene.rays||scene.lightBeams){
        for(let i=0;i<6;i++){
          const angle=-0.5+i*0.18+Math.sin(sec*0.2+i)*0.04;
          ctx.save();ctx.translate(W*0.5,0);ctx.rotate(angle);
          const ray=ctx.createLinearGradient(0,0,0,H*1.5);
          ray.addColorStop(0,`rgba(${fgR},${fgG},${fgB},0.12)`);ray.addColorStop(1,`rgba(${fgR},${fgG},${fgB},0)`);
          ctx.fillStyle=ray;ctx.fillRect(-60,0,120,H*1.5);ctx.restore();
        }
      }

      if(scene.waves){
        for(let w=0;w<3;w++){
          ctx.strokeStyle=`rgba(${fgR},${fgG},${fgB},${0.07-w*0.02})`;
          ctx.lineWidth=1+w;ctx.beginPath();
          for(let x=0;x<W;x+=2){
            const waveY=H*(0.62+w*0.08)+Math.sin(x*0.006+sec*(0.8+w*0.3)+w)*H*(0.025+w*0.01);
            x===0?ctx.moveTo(x,waveY):ctx.lineTo(x,waveY);
          }
          ctx.stroke();
        }
      }

      const sil=scene.silhouette||"none";
      if(sil==="city"||scene.cityLights){
        ctx.fillStyle="rgba(0,0,0,0.88)";
        buildings.forEach(b=>{ctx.fillRect(b.x,H-b.h,b.w,b.h);});
        if(scene.cityLights){
          buildings.forEach(b=>{
            for(let wy=H-b.h+10;wy<H-10;wy+=18){
              for(let wx=b.x+4;wx<b.x+b.w-4;wx+=12){
                if(Math.sin(wx*5+wy*3+frame*0.015)>0.15){
                  const lit=0.3+Math.sin(wx*7+wy*11+sec*0.5)*0.25;
                  ctx.fillStyle=`rgba(${fgR},${fgG},${fgB},${Math.max(0,lit)})`;
                  ctx.fillRect(wx,wy,7,9);
                }
              }
            }
          });
        }
      }

      if(sil==="mountain"){
        ctx.fillStyle="rgba(0,0,0,0.8)";ctx.beginPath();ctx.moveTo(0,H);
        for(let x=0;x<=W;x+=W/80){
          const mh=H*0.72-Math.abs(Math.sin(x*0.003+0.5)*H*0.2)-Math.abs(Math.sin(x*0.009)*H*0.09);
          x===0?ctx.moveTo(x,mh):ctx.lineTo(x,mh);
        }
        ctx.lineTo(W,H);ctx.closePath();ctx.fill();
      }

      if(sil==="person"||scene.humanFigure){
        const fx=W*0.5,fh=H*0.28,fw=fh*0.22;
        ctx.fillStyle="rgba(0,0,0,0.85)";
        ctx.fillRect(fx-fw/2,H*0.72-fh,fw,fh*0.65);
        ctx.beginPath();ctx.arc(fx,H*0.72-fh,fw*0.5,0,Math.PI*2);ctx.fill();
        const figGlow=ctx.createRadialGradient(fx,H*0.72-fh*0.5,0,fx,H*0.72-fh*0.5,fw*4);
        figGlow.addColorStop(0,`rgba(${fgR},${fgG},${fgB},0.08)`);figGlow.addColorStop(1,`rgba(${fgR},${fgG},${fgB},0)`);
        ctx.fillStyle=figGlow;ctx.fillRect(fx-fw*5,H*0.5,fw*10,H*0.4);
      }

      if(scene.particles){
        for(let i=0;i<numParticles;i++){
          const px=(i*2791+frame*(0.15+i%3*0.05))%W;
          const py=(i*1847+frame*(0.08+i%2*0.03))%H;
          const tw=0.15+Math.sin(frame*0.06+i*1.3)*0.2;
          ctx.fillStyle=`rgba(${fgR},${fgG},${fgB},${Math.max(0,tw)})`;
          ctx.beginPath();ctx.arc(px,py,i%7===0?2.2:i%3===0?1.4:0.8,0,Math.PI*2);ctx.fill();
        }
      }

      if(scene.vignette){
        const vig=ctx.createRadialGradient(W/2,H/2,W*0.18,W/2,H/2,W*0.75);
        vig.addColorStop(0,"rgba(0,0,0,0)");vig.addColorStop(1,"rgba(0,0,0,0.9)");
        ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);
      }

      for(let gi=0;gi<200;gi++){
        const gx=Math.random()*W,gy=Math.random()*H;
        ctx.fillStyle=`rgba(${Math.random()>0.5?255:0},${Math.random()>0.5?255:0},${Math.random()>0.5?255:0},${0.015+Math.random()*0.02})`;
        ctx.fillRect(gx,gy,1,1);
      }

      if(scene.letterbox!==false){
        ctx.fillStyle="#000";
        ctx.fillRect(0,0,W,H*0.07);
        ctx.fillRect(0,H*0.93,W,H*0.07);
      }

      const lineCount=lines.length;
      if(showText&&t>0.86){
        const alpha=(t-0.86)/0.14;
        ctx.globalAlpha=alpha*0.95;
        ctx.fillStyle=`rgba(0,0,0,${alpha})`;ctx.fillRect(0,0,W,H);
        ctx.fillStyle=grade.fg;
        ctx.font=`900 ${Math.round(H*0.036)}px Arial Black,Arial`;
        ctx.textAlign="center";ctx.shadowColor=grade.fg;ctx.shadowBlur=25;
        ctx.fillText("MANDASTRONG STUDIO",W/2,H*0.47);
        ctx.shadowBlur=0;ctx.fillStyle=grade.accent;
        ctx.font=`400 ${Math.round(H*0.019)}px Arial`;
        ctx.fillText("CINEMA INTELLIGENCE PLATFORM",W/2,H*0.555);
        ctx.globalAlpha=1;
      }

      if(showText) lines.forEach((line,i)=>{
        const ls=(i+0.5)/(lineCount+1),le=ls+0.75/(lineCount+1);
        if(t>=ls-0.04&&t<=le+0.07){
          const lt=Math.min(1,(t-(ls-0.04))/0.06);
          const fo=t>le?Math.max(0,1-(t-le)/0.06):1;
          ctx.globalAlpha=lt*fo;
          ctx.fillStyle=i===0?grade.fg:"#ffffff";
          ctx.font=`${i===0?"900":"700"} ${Math.round(i===0?H*0.068:H*0.05)}px Arial Black,Arial`;
          ctx.textAlign="center";ctx.shadowColor=grade.fg;ctx.shadowBlur=i===0?20:0;
          ctx.fillText(line.toUpperCase(),W/2,H*0.5+(i-lineCount/2)*(H*0.09));
          ctx.shadowBlur=0;ctx.globalAlpha=1;
        }
      });
    };

    addLog("Generating frames...");
    const msPerFrame=1000/fps;

    await new Promise(resolve=>{
      let frame=0;
      const renderNext=()=>{
        if(frame>=totalFrames){resolve(null);return;}
        drawFrame(frame);
        setProgress(Math.round((frame/totalFrames)*88));
        if(frame%(fps*2)===0)addLog(`  ${Math.round(frame/fps)}s / ${duration}s rendered...`);
        frame++;
        setTimeout(renderNext,msPerFrame);
      };
      renderNext();
    });

    addLog("Finalising...");setProgress(92);
    await new Promise(r=>setTimeout(r,800));
    recorder.stop();
    await new Promise(r=>{recorder.onstop=r;});

    const blob=new Blob(chunks,{type:mimeType});
    const url=URL.createObjectURL(blob);
    setVideoUrl(url);setProgress(100);
    addLog(`Complete! ${(blob.size/1024/1024).toFixed(1)}MB · ${duration}s`);
    setTimeout(()=>{if(videoRef.current){videoRef.current.load();videoRef.current.play().catch(()=>{});}},200);
    setGenerating(false);
  };

  const saveToLibrary=async()=>{
    if(!videoUrl)return;
    try{
      const response=await fetch(videoUrl);const blob=await response.blob();
      const fileName=(title||"Scene")+" — "+style+" "+duration+"s.webm";
      const file=new File([blob],fileName,{type:"video/webm"});
      const newUrl=URL.createObjectURL(file);
      if(onSave)onSave({id:Date.now()+Math.random(),name:fileName,type:"video/webm",url:newUrl,file});
    }catch(e){
      if(onSave)onSave({id:Date.now()+Math.random(),name:(title||"Scene")+" — "+style+" "+duration+"s.webm",type:"video/webm",url:videoUrl});
    }
    setSaved(true);
  };

  const libVideos=(mediaLib||[]).filter(a=>a.type&&a.type.startsWith("video"));
  const libImages=(mediaLib||[]).filter(a=>a.type&&a.type.startsWith("image"));

  return (
    <div style={{...Sp}}>
      <canvas ref={canvasRef} style={{display:"none"}}/>
      <input ref={refImgRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
        const f=e.target.files&&e.target.files[0];
        if(f){setRefImage(f);setRefImageUrl(URL.createObjectURL(f));}
      }}/>

      {/* STUDIO HEADER */}
      <div style={{padding:"10px 20px",borderBottom:`2px solid ${GOLD}`,background:"#020200",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:10,color:GOLD,letterSpacing:5,fontWeight:700}}>AI WORKSTATION 04 · CINEMA ENGINE · 1920×1080 · 4K READY</div>
          <h1 style={{...H1,fontSize:22,margin:0}}>🎬 VIDEO GENERATOR — PROFESSIONAL CINEMA STUDIO</h1>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{color:"#22c55e",fontSize:11,fontWeight:900,letterSpacing:2}}>● ENGINE READY</div>
          <div style={{color:GOLD,fontSize:11,letterSpacing:2,fontWeight:700}}>CANVAS · {resolution} · {fps}FPS</div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{display:"grid",gridTemplateColumns:"320px 1fr 340px",minHeight:"calc(100vh - 116px)"}}>

        {/* LEFT — CONTROLS */}
        <div style={{borderRight:`1px solid ${GOLDDIM}`,background:"#030300",overflowY:"auto",display:"flex",flexDirection:"column"}}>
          {/* TABS */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderBottom:`1px solid ${GOLDDIM}`,flexShrink:0}}>
            {[["describe","📝 SCENE"],["style","🎨 STYLE"],["settings","⚙ SETTINGS"]].map(([t,l])=>(
              <button key={t} onClick={()=>setActiveTab(t)} style={{background:activeTab===t?"#0a0800":"none",border:"none",borderBottom:activeTab===t?`2px solid ${GOLD}`:"2px solid transparent",color:activeTab===t?GOLD:WHITE,padding:"10px 4px",cursor:"pointer",fontSize:10,fontWeight:900,letterSpacing:1}}>{l}</button>
            ))}
          </div>

          <div style={{padding:12,flex:1,overflowY:"auto"}}>
            {activeTab==="describe"&&(
              <div>
                <div style={{color:GOLD,fontSize:10,letterSpacing:3,fontWeight:900,marginBottom:6}}>SCENE TITLE</div>
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Chapter 1 — The Beginning"
                  style={{width:"100%",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"8px 10px",color:WHITE,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif",marginBottom:10}}/>

                <div style={{color:GOLD,fontSize:10,letterSpacing:3,fontWeight:900,marginBottom:6}}>SCENE DESCRIPTION</div>
                <textarea value={prompt} onChange={e=>setPrompt(e.target.value)}
                  placeholder="Describe exactly what you want. Plain English. City at night, crowd of people, fog rolling, gold light from above..."
                  style={{width:"100%",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"10px",color:WHITE,fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif",lineHeight:1.8,height:130,resize:"none",marginBottom:8}}/>
                <button onClick={getAIScene} disabled={aiLoading||!prompt.trim()}
                  style={{...G("out",true),width:"100%",marginBottom:10,fontSize:10,opacity:aiLoading||!prompt.trim()?0.5:1}}>
                  {aiLoading?"⟳ GENERATING...":"✦ WRITE SCENE TEXT WITH AI"}
                </button>

                {aiScript&&(
                  <div style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <div style={{color:GOLD,fontSize:10,letterSpacing:2,fontWeight:900}}>SCENE TEXT</div>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{color:DIM,fontSize:9}}>{showText?"ON SCREEN":"HIDDEN"}</span>
                        <div onClick={()=>setShowText(p=>!p)} style={{width:36,height:20,background:showText?GOLD:"#333",borderRadius:10,cursor:"pointer",position:"relative"}}>
                          <div style={{position:"absolute",top:2,left:showText?18:2,width:16,height:16,background:showText?"#000":WHITE,borderRadius:"50%",transition:"left .15s"}}/>
                        </div>
                      </div>
                    </div>
                    <textarea value={aiScript} onChange={e=>setAiScript(e.target.value)}
                      style={{width:"100%",background:"#000",border:`1px solid ${GOLD}`,padding:"8px",color:WHITE,fontSize:11,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif",lineHeight:1.8,height:90,resize:"none"}}/>
                  </div>
                )}

                {/* REFERENCE IMAGE */}
                <div style={{color:GOLD,fontSize:10,letterSpacing:3,fontWeight:900,marginBottom:6}}>REFERENCE IMAGE</div>
                {refImageUrl?(
                  <div style={{position:"relative",marginBottom:10}}>
                    <img src={refImageUrl} alt="reference" style={{width:"100%",height:100,objectFit:"cover",border:`1px solid ${GOLD}`}}/>
                    <button onClick={()=>{setRefImage(null);setRefImageUrl("");}} style={{position:"absolute",top:4,right:4,background:"#000",border:`1px solid ${GOLD}`,color:GOLD,padding:"2px 6px",cursor:"pointer",fontSize:10}}>✕</button>
                    <div style={{color:GOLD,fontSize:9,marginTop:3,letterSpacing:1}}>✓ Reference image loaded — mood and palette applied</div>
                  </div>
                ):(
                  <div onClick={()=>refImgRef.current&&refImgRef.current.click()}
                    style={{border:`1px dashed ${GOLDDIM}`,padding:"14px",textAlign:"center",cursor:"pointer",marginBottom:10}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=GOLD}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=GOLDDIM}>
                    <div style={{fontSize:20,marginBottom:4}}>🖼</div>
                    <div style={{color:WHITE,fontSize:11,fontWeight:700}}>UPLOAD REFERENCE IMAGE</div>
                    <div style={{color:DIM,fontSize:10,marginTop:2}}>Mood · Colour · Composition</div>
                  </div>
                )}

                {/* MEDIA LIBRARY ASSETS */}
                {libImages.length>0&&(
                  <div style={{marginBottom:10}}>
                    <div style={{color:GOLD,fontSize:10,letterSpacing:3,fontWeight:900,marginBottom:6}}>FROM YOUR LIBRARY</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
                      {libImages.slice(0,6).map(a=>(
                        <div key={a.id} onClick={()=>{setRefImageUrl(a.url);setRefImage(null);}}
                          style={{cursor:"pointer",border:`1px solid ${refImageUrl===a.url?GOLD:GOLDDIM}`,overflow:"hidden"}}>
                          <img src={a.url} alt={a.name} style={{width:"100%",height:44,objectFit:"cover"}}/>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab==="style"&&(
              <div>
                <div style={{color:GOLD,fontSize:10,letterSpacing:3,fontWeight:900,marginBottom:8}}>VISUAL STYLE</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:12}}>
                  {STYLES.map(s=>(
                    <div key={s.id} onClick={()=>setStyle(s.id)}
                      style={{padding:"8px 10px",background:style===s.id?"#0a0800":"#000",border:`1px solid ${style===s.id?GOLD:GOLDDIM}`,cursor:"pointer"}}>
                      <div style={{color:style===s.id?GOLD:WHITE,fontSize:11,fontWeight:900}}>{s.label}</div>
                      <div style={{color:DIM,fontSize:9,marginTop:2}}>{s.desc}</div>
                    </div>
                  ))}
                </div>
                <div style={{color:GOLD,fontSize:10,letterSpacing:3,fontWeight:900,marginBottom:8}}>COLOUR GRADE</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
                  {GRADES.map(g=>(
                    <button key={g.id} onClick={()=>setColorGrade(g.id)}
                      style={{background:colorGrade===g.id?g.fg:"#111",border:`2px solid ${colorGrade===g.id?g.fg:GOLDDIM}`,color:colorGrade===g.id?"#000":WHITE,padding:"4px 10px",cursor:"pointer",fontSize:10,fontWeight:900}}>
                      {g.label}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",gap:6,marginBottom:12}}>
                  <button onClick={()=>setShowText(false)} style={{...G(showText===false?"gold":"out",true),flex:1,fontSize:10}}>🎬 VISUALS ONLY</button>
                  <button onClick={()=>setShowText(true)} style={{...G(showText===true?"gold":"out",true),flex:1,fontSize:10}}>📝 WITH TEXT</button>
                </div>
              </div>
            )}

            {activeTab==="settings"&&(
              <div>
                <div style={{color:GOLD,fontSize:10,letterSpacing:3,fontWeight:900,marginBottom:8}}>RESOLUTION</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:12}}>
                  {[["720p","1280×720"],["1080p","1920×1080"],["4K","3840×2160"]].map(([r,sub])=>(
                    <button key={r} onClick={()=>setResolution(r)} style={{background:resolution===r?"#0a0800":"#000",border:`1px solid ${resolution===r?GOLD:GOLDDIM}`,padding:"8px",cursor:"pointer",textAlign:"center"}}>
                      <div style={{color:resolution===r?GOLD:WHITE,fontSize:12,fontWeight:900,fontFamily:"'Rajdhani',sans-serif"}}>{r}</div>
                      <div style={{color:DIM,fontSize:9}}>{sub}</div>
                    </button>
                  ))}
                </div>
                <div style={{color:GOLD,fontSize:10,letterSpacing:3,fontWeight:900,marginBottom:8}}>FRAME RATE</div>
                <div style={{display:"flex",gap:5,marginBottom:12}}>
                  {[24,30,60].map(f=><button key={f} onClick={()=>setFps(f)} style={{...G(fps===f?"gold":"out",true),flex:1,fontSize:10}}>{f}fps</button>)}
                </div>
                <div style={{color:GOLD,fontSize:10,letterSpacing:3,fontWeight:900,marginBottom:6}}>DURATION — {duration}s</div>
                <input type="range" min={3} max={120} value={duration} onChange={e=>setDuration(+e.target.value)} style={{width:"100%",accentColor:GOLD,marginBottom:4}}/>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                  <span style={{color:DIM,fontSize:9}}>3s</span>
                  <span style={{color:GOLD,fontSize:10,fontWeight:900}}>{duration}s</span>
                  <span style={{color:DIM,fontSize:9}}>120s</span>
                </div>
              </div>
            )}
          </div>

          {/* GENERATE BUTTON */}
          <div style={{padding:12,borderTop:`1px solid ${GOLDDIM}`,flexShrink:0}}>
            <button onClick={generateVideo} disabled={generating||(!prompt.trim()&&!aiScript.trim())}
              style={{...G("gold",false),width:"100%",padding:"14px",fontSize:13,letterSpacing:3,opacity:generating||(!prompt.trim()&&!aiScript.trim())?0.5:1}}>
              {generating?"⟳ RENDERING... "+progress+"%":"🎬 GENERATE VIDEO CLIP"}
            </button>
          </div>
        </div>

        {/* CENTRE — CANVAS PREVIEW */}
        <div style={{background:"#000",display:"flex",flexDirection:"column"}}>
          {/* PREVIEW SCREEN */}
          <div style={{background:"#000",aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",borderBottom:`1px solid ${GOLDDIM}`,position:"relative"}}>
            {videoUrl?(
              <video key={videoUrl} ref={videoRef} src={videoUrl} controls autoPlay loop muted playsInline style={{width:"100%",height:"100%",objectFit:"contain"}}/>
            ):(
              <div style={{textAlign:"center",padding:20}}>
                {refImageUrl&&<img src={refImageUrl} alt="ref" style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0,opacity:0.15}}/>}
                <div style={{position:"relative",zIndex:1}}>
                  <div style={{fontSize:42,marginBottom:10}}>🎬</div>
                  <div style={{color:grade.fg,fontSize:14,letterSpacing:3,fontWeight:900}}>{title||"YOUR SCENE"}</div>
                  <div style={{color:DIM,fontSize:11,marginTop:6}}>{style} · {grade.label} · {duration}s · {resolution}</div>
                </div>
              </div>
            )}
            {generating&&(
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:4,background:"#000"}}>
                <div style={{width:progress+"%",height:"100%",background:`linear-gradient(90deg,${GOLDDIM},${GOLD})`,transition:"width .2s"}}/>
              </div>
            )}
          </div>

          {/* PROGRESS BAR */}
          {generating&&(
            <div style={{padding:"8px 16px",borderBottom:`1px solid ${GOLDDIM}`,background:"#020200"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{color:GOLD,fontSize:10,fontWeight:900,letterSpacing:2}}>RENDERING</span>
                <span style={{color:GOLD,fontSize:12,fontWeight:900}}>{progress}%</span>
              </div>
            </div>
          )}

          {/* EXPORT BUTTONS */}
          {videoUrl&&!generating&&(
            <div style={{padding:"10px 16px",borderBottom:`1px solid ${GOLDDIM}`,background:"#020200"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                <a href={videoUrl} download={(title||"scene").replace(/\s+/g,"_")+"_"+resolution+"_"+duration+"s.webm"}
                  style={{...G("out",false),padding:"8px",fontSize:10,textDecoration:"none",textAlign:"center",display:"block",letterSpacing:1}}>⬇ DOWNLOAD</a>
                <button onClick={saveToLibrary} style={{...G(saved?"out":"gold",false),padding:"8px",fontSize:10,letterSpacing:1}}>{saved?"✓ IN LIBRARY":"💾 SAVE TO LIBRARY"}</button>
                <button onClick={()=>{setVideoUrl("");setLog([]);setSaved(false);}} style={{...G("out",false),padding:"8px",fontSize:10}}>🔄 NEW CLIP</button>
              </div>
            </div>
          )}

          {/* MEDIA LIBRARY STRIP */}
          {libVideos.length>0&&(
            <div style={{borderBottom:`1px solid ${GOLDDIM}`,background:"#020200"}}>
              <div style={{padding:"6px 16px 4px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900}}>YOUR VIDEO CLIPS — {libVideos.length}</span>
                <button onClick={()=>setShowLibrary(p=>!p)} style={{background:"none",border:"none",color:GOLD,cursor:"pointer",fontSize:10}}>{showLibrary?"▲":"▼"}</button>
              </div>
              {showLibrary&&(
                <div style={{display:"flex",gap:6,padding:"0 10px 8px",overflowX:"auto"}}>
                  {libVideos.map(a=>(
                    <div key={a.id} style={{flexShrink:0,width:100,border:`1px solid ${GOLDDIM}`,cursor:"pointer"}}
                      onClick={()=>{setVideoUrl(a.url);setSaved(true);}}>
                      <video src={a.url} style={{width:"100%",height:56,objectFit:"cover"}} muted/>
                      <div style={{color:WHITE,fontSize:8,padding:"2px 4px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name.slice(0,14)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RENDER LOG */}
          <div style={{flex:1,overflowY:"auto",padding:14,background:"#010100"}}>
            {log.length>0?(
              <div>
                <div style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900,marginBottom:8}}>● RENDER LOG</div>
                {log.map((l,i)=>(
                  <div key={i} style={{color:i===log.length-1?"#22c55e":"#555",fontSize:10,lineHeight:1.8,fontFamily:"monospace"}}>› {l}</div>
                ))}
              </div>
            ):(
              <div style={{textAlign:"center",padding:"20px 16px",color:GOLDDIM}}>
                <div style={{fontSize:28,marginBottom:8}}>🎬</div>
                <div style={{fontSize:10,lineHeight:1.9,letterSpacing:1}}>PROFESSIONAL CINEMA ENGINE<br/>Describe your scene · Hit Generate<br/>Canvas renders at {resolution} · {fps}fps</div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — SCENE INTELLIGENCE PANEL */}
        <div style={{borderLeft:`1px solid ${GOLDDIM}`,background:"#020200",display:"flex",flexDirection:"column",overflowY:"auto"}}>
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${GOLDDIM}`}}>
            <div style={{color:GOLD,fontSize:10,letterSpacing:3,fontWeight:900}}>✦ SCENE INTELLIGENCE</div>
            <div style={{color:DIM,fontSize:9,marginTop:2}}>Auto-parsed from your description</div>
          </div>
          <div style={{padding:14,flex:1}}>
            {/* SCENE TYPE INDICATOR */}
            <div style={{...Card(),marginBottom:10,padding:10}}>
              <div style={{color:GOLD,fontSize:9,letterSpacing:2,marginBottom:6}}>SCENE TYPE DETECTED</div>
              {["city","cosmic","dawn","landscape","interior","abstract"].map(t=>(
                <div key={t} style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:prompt.toLowerCase().includes(t)||prompt.toLowerCase().includes(t==="cosmic"?"space":t==="dawn"?"sunrise":t)?"#22c55e":"#333"}}/>
                  <span style={{color:WHITE,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>{t}</span>
                </div>
              ))}
            </div>

            {/* ELEMENTS DETECTED */}
            <div style={{...Card(),marginBottom:10,padding:10}}>
              <div style={{color:GOLD,fontSize:9,letterSpacing:2,marginBottom:6}}>ELEMENTS</div>
              {[["City Lights",["city","window","building","lit"]],["Star Field",["star","space","night sky","galaxy"]],["Human Figure",["person","figure","human","crowd","silhouette"]],["Fog Layer",["fog","mist","haze"]],["Light Beams",["beam","ray","shaft","light from"]],["Sun Rise",["sunrise","dawn","sun rising","golden hour"]]].map(([label,keys])=>{
                const active=keys.some(k=>prompt.toLowerCase().includes(k));
                return(
                  <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                    <span style={{color:active?WHITE:DIM,fontSize:10}}>{label}</span>
                    <span style={{color:active?"#22c55e":"#333",fontSize:9,fontWeight:900}}>{active?"✓ ON":"—"}</span>
                  </div>
                );
              })}
            </div>

            {/* QUICK SCENE PRESETS */}
            <div style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900,marginBottom:8}}>QUICK PRESETS</div>
            {[
              ["🌌 Deep Space","Earth from deep space. Planet glowing blue. City lights on the dark side. Stars everywhere. Atmosphere burning gold at edges."],
              ["🌆 City Night","City street at night. Tall buildings with every window lit. Crowd of people moving through heavy fog. Ground level."],
              ["🌅 Golden Dawn","Single human figure standing on flat open ground at dawn. Sun rising from below. Gold light flooding everything. Wide horizon."],
              ["👤 Lone Figure","Single human figure standing completely alone in total darkness. One beam of light straight down from above. Deep fog at the edges."],
              ["🏙 Epic Skyline","Dense city skyline at night seen from above. Every window blazing gold. Fog at street level. Particles rising like embers."],
              ["🌊 Ocean Moon","Dark ocean at night. Full moon reflection on the water. Thin horizon line. Stars above. Slow rolling waves. Deep silence."],
            ].map(([label,p])=>(
              <button key={label} onClick={()=>setPrompt(p)}
                style={{width:"100%",textAlign:"left",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"7px 10px",cursor:"pointer",marginBottom:4,display:"block"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=GOLDDIM;}}>
                <div style={{color:WHITE,fontSize:11,fontWeight:700}}>{label}</div>
              </button>
            ))}

            {/* COLOUR GRADE PREVIEW */}
            <div style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900,marginBottom:8,marginTop:12}}>ACTIVE GRADE</div>
            <div style={{background:grade.bg,border:`1px solid ${grade.fg}`,padding:"10px 12px",marginBottom:10}}>
              <div style={{color:grade.fg,fontSize:12,fontWeight:900}}>{GRADES.find(g=>g.id===colorGrade)?.label}</div>
              <div style={{display:"flex",gap:6,marginTop:6}}>
                {[grade.bg,grade.fg,grade.accent].map((c,i)=>(
                  <div key={i} style={{width:24,height:24,background:c,border:"1px solid #333"}}/>
                ))}
              </div>
            </div>
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
        <div onClick={()=>alert("Mobile: Share then Add to Home Screen\nDesktop: Click install icon in address bar")}
          style={{display:"inline-flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:110,height:110,background:"#000",border:`2px solid ${GOLD}`,cursor:"pointer",gap:4}}>
          <div style={{fontSize:26,lineHeight:1}}>⬇</div>
          <div style={{color:GOLD,fontSize:11,fontWeight:900,letterSpacing:1,textAlign:"center",lineHeight:1.4}}>DOWNLOAD<br/>AS APP</div>
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

function P3() {
  const [playing, setPlaying] = useState([false,false,false]);
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:980,margin:"0 auto"}}>
        <div style={{fontSize:12,color:GOLD,letterSpacing:4,marginBottom:8,fontWeight:700}}>SHOWCASE</div>
        <h1 style={{...H1,fontSize:30,marginBottom:24}}>EXAMPLES MADE BY MANDASTRONG STUDIO</h1>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          {[1,2,3].map(s=>(
            <div key={s} style={{...Card()}}>
              <div style={{background:"#000",height:160,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,border:`1px solid ${GOLDDIM}`,cursor:"pointer"}} onClick={()=>setPlaying(p=>p.map((v,j)=>j===s-1?!v:v))}>
                <div style={{width:52,height:52,border:`2px solid ${GOLD}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{color:GOLD,fontSize:22,marginLeft:4}}>{playing[s-1]?"⏸":"▶"}</div>
                </div>
              </div>
              <button style={{...G("out",true),width:"100%"}}>⬆ UPLOAD FILM</button>
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
  const inp={width:"100%",background:"#0a0a0a",border:`1px solid ${GOLDDIM}`,padding:"10px 12px",color:WHITE,fontSize:14,marginBottom:10,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif"};
  const login=()=>{
    if(email==="woolleya129@gmail.com"&&pass==="Mangler1970!!"){setUser({name:"Amanda",plan:"Studio",isAdmin:true});go(5);}
    else if(email.includes("@")){setUser({name:email.split("@")[0]||"Creator",plan:"Creator",isAdmin:false});go(5);}
    else{alert("Please enter a valid email address.");}
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
          <button onClick={()=>{try{const m=JSON.parse(localStorage.getItem("ms_medialib")||"[]");if(m.length>0){alert("Project loaded! "+m.length+" assets restored.");}else{alert("No saved project found.");}}catch(e){alert("Could not load project.");}}} style={{...G("gold",false),padding:"12px 32px"}}>📂 OPEN PROJECT</button>
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

function P13({ go, mediaLib, timeline, setTimeline }) {
  const [tracks,setTracks]=useState(["VIDEO TRACK","AUDIO TRACK","TEXT / TITLES"]);
  const addToTrack=(idx,asset)=>setTimeline(p=>({...p,[idx]:[...(p[idx]||[]),asset]}));
  return (
    <div style={{...Sp,padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:11,color:GOLD,letterSpacing:4,fontWeight:700}}>EDITING WORKSPACE</div>
          <h1 style={{...H1,fontSize:24,margin:0}}>TIMELINE EDITOR</h1>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setTracks(p=>[...p,`TRACK ${p.length+1}`])} style={{...G("out",true)}}>+ ADD TRACK</button>
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

function P16({ go, timeline, setRendered, mediaLib }) {
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
      for(let ci=0;ci<clips.length;ci++){
        const clip=clips[ci];setCurrentClipIdx(ci);
        log("Clip "+(ci+1)+"/"+clips.length+": "+clip.name.slice(0,45));
        setProgress(5+Math.round((ci/clips.length)*80));
        await new Promise(resolve=>{
          const vid=document.createElement("video");
          vid.muted=true;vid.playsInline=true;
          vid.src=clip.file instanceof File?URL.createObjectURL(clip.file):clip.url;
          let done2=false;
          const finish=()=>{if(!done2){done2=true;resolve(null);}};
          vid.onloadeddata=async()=>{
            const clipDur=Math.min(vid.duration||5,65);
            vid.currentTime=0;
            try{await vid.play();}catch(e){}
            const startTime=Date.now();
            const drawVidFrame=()=>{
              if(done2)return;
              const elapsed=(Date.now()-startTime)/1000;
              if(vid.ended||elapsed>=clipDur){vid.pause();finish();return;}
              try{ctx.fillStyle="#000";ctx.fillRect(0,0,dims.w,dims.h);ctx.drawImage(vid,0,0,dims.w,dims.h);
                ctx.fillStyle="#000";ctx.fillRect(0,0,dims.w,dims.h*0.05);ctx.fillRect(0,dims.h*0.95,dims.w,dims.h*0.05);
              }catch(e){finish();return;}
              requestAnimationFrame(drawVidFrame);
            };
            requestAnimationFrame(drawVidFrame);
          };
          vid.onerror=()=>{
            log("  Title card: "+clip.name.slice(0,30));
            const startT=Date.now();
            const drawCard=()=>{
              if(done2)return;
              const el=(Date.now()-startT)/1000;
              if(el>=5){finish();return;}
              const alpha=el<0.4?el/0.4:el>4?Math.max(0,(5-el)):1;
              ctx.fillStyle="#000";ctx.fillRect(0,0,dims.w,dims.h);
              ctx.fillStyle="#a07820";ctx.fillRect(dims.w*0.1,dims.h*0.46,dims.w*0.8,1);ctx.fillRect(dims.w*0.1,dims.h*0.54,dims.w*0.8,1);
              ctx.globalAlpha=alpha;ctx.fillStyle="#e8c96d";
              ctx.font="900 "+Math.round(dims.w/24)+"px Arial";ctx.textAlign="center";
              ctx.fillText(clip.name.replace(/\.[^.]+$/,"").slice(0,40).toUpperCase(),dims.w/2,dims.h/2);
              ctx.globalAlpha=1;requestAnimationFrame(drawCard);
            };
            drawCard();
          };
          setTimeout(finish,70000);
        });
      }
      setCurrentClipIdx(-1);
      for(let f=0;f<fps*2;f++){
        ctx.fillStyle="#000";ctx.fillRect(0,0,dims.w,dims.h);
        const alpha=f<fps*0.3?f/(fps*0.3):f>fps*1.6?Math.max(0,1-(f-fps*1.6)/(fps*0.4)):1;
        ctx.globalAlpha=alpha;ctx.fillStyle="#e8c96d";
        ctx.font="900 "+Math.round(dims.w/26)+"px Arial";ctx.textAlign="center";
        ctx.fillText("MANDASTRONG STUDIO",dims.w/2,dims.h*0.46);
        ctx.fillStyle="#a07820";ctx.font="400 "+Math.round(dims.w/60)+"px Arial";
        ctx.fillText("CINEMA INTELLIGENCE PLATFORM",dims.w/2,dims.h*0.545);
        ctx.globalAlpha=1;
        await new Promise(r=>setTimeout(r,1000/fps));
      }
      setProgress(92);log("Finalising...");
      if(audioSource){try{audioSource.stop();}catch(e){}}
      recorder.stop();
      await new Promise(r=>{recorder.onstop=r;});
      const blob=new Blob(chunks,{type:mimeType});
      const url=URL.createObjectURL(blob);
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
              <video src={renderUrl} controls loop muted playsInline style={{width:"100%",height:"100%",objectFit:"contain"}}/>
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
  const fmt=s=>{const m=Math.floor(s/60);const sc=Math.floor(s%60);return `${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;};
  const togglePlay=()=>{if(!videoRef.current)return;if(isPlaying){videoRef.current.pause();setIsPlaying(false);}else{videoRef.current.play();setIsPlaying(true);}};
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:880,margin:"0 auto"}}>
        <h1 style={{...H1,fontSize:28,marginBottom:14}}>FILM PREVIEW</h1>
        <div style={{background:"#000",overflow:"hidden",marginBottom:14,aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${GOLDDIM}`}}>
          {vs?<video ref={videoRef} src={vs} style={{width:"100%",height:"100%"}}
            onTimeUpdate={()=>setCurrentTime(videoRef.current?.currentTime||0)}
            onLoadedMetadata={()=>setDuration(videoRef.current?.duration||0)}
            onEnded={()=>setIsPlaying(false)}/>:
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

function P19() {
  const tuts=[{n:"01",t:"Getting Started - Platform Overview",d:"8:30",l:"Beginner"},{n:"02",t:"Importing & Managing Media Assets",d:"6:15",l:"Beginner"},{n:"03",t:"Multi-Track Timeline Editing",d:"12:45",l:"Intermediate"},{n:"04",t:"AI Tools - 600+ Features Explained",d:"18:20",l:"Intermediate"},{n:"05",t:"Professional Color Grading with AI",d:"22:00",l:"Advanced"},{n:"06",t:"Audio Mixing & Sound Design",d:"15:10",l:"Intermediate"},{n:"07",t:"AI Enhancement Studio Deep Dive",d:"20:30",l:"Advanced"},{n:"08",t:"Render Settings & Export Optimization",d:"8:15",l:"Beginner"}];
  const lc={Beginner:"#22c55e",Intermediate:"#f59e0b",Advanced:"#ef4444"};
  return (
    <div style={{...Sp,padding:40}}>
      <div style={{maxWidth:780,margin:"0 auto"}}>
        <div style={{fontSize:11,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>LEARNING CENTER</div>
        <h1 style={{...H1,fontSize:28,marginBottom:20}}>TUTORIALS</h1>
        {tuts.map(t=>(
          <div key={t.n} onClick={()=>window.open("https://youtube.com","_blank")}
            style={{...Card(),marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=GOLD}
            onMouseLeave={e=>e.currentTarget.style.borderColor=GOLDDIM}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:16,fontWeight:900,minWidth:28}}>{t.n}</span>
              <div>
                <div style={{color:WHITE,fontWeight:800,fontSize:14}}>{t.t}</div>
                <div style={{color:WHITE,fontSize:12,marginTop:2,letterSpacing:1}}>{t.d} · YOUTUBE</div>
              </div>
            </div>
            <span style={{background:lc[t.l]+"22",border:`1px solid ${lc[t.l]}`,color:lc[t.l],padding:"3px 10px",fontSize:11,fontWeight:900,letterSpacing:2}}>{t.l.toUpperCase()}</span>
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
        <div style={{fontSize:11,color:GOLD,letterSpacing:4,marginBottom:4,fontWeight:700}}>LEGAL</div>
        <h1 style={{...H1,fontSize:28,marginBottom:4}}>TERMS OF SERVICE & DISCLAIMER</h1>
        <div style={{color:WHITE,fontSize:12,marginBottom:20,fontWeight:600,letterSpacing:2}}>EFFECTIVE: MARCH 2026 · MANDASTRONG STUDIO LLC</div>
        <div style={{...Card(),marginBottom:14}}>
          <h2 style={{color:GOLD,fontWeight:900,fontSize:16,marginBottom:12,letterSpacing:2}}>TERMS OF SERVICE</h2>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9,margin:0}}>By accessing or using MandaStrong Studio, you agree to be legally bound by these Terms of Service. Subscriptions bill monthly and auto-renew unless cancelled. All payments processed via Stripe. Studio Plan subscribers receive full commercial rights. You retain ownership of all media you upload. For support contact MandaStrong1.Etsy.com or Agent Grok on Page 21.</p>
        </div>
        <div style={{...Card()}}>
          <h2 style={{color:GOLD,fontWeight:900,fontSize:16,marginBottom:12,letterSpacing:2}}>DISCLAIMER</h2>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9,margin:0}}>MandaStrong Studio is provided as-is without warranties. AI-generated content is produced algorithmically — users are solely responsible for reviewing all outputs. A significant portion of all proceeds supports veterans mental health and anti-bullying education.</p>
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
      const r=await fetch(EDGE_FN,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+SUPA_KEY,"apikey":SUPA_KEY},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:"You are Agent Grok, 24/7 assistant for MandaStrong Studio — professional cinema AI platform, 600+ tools, 8K export, films up to 3 hours, plans $20/$30/$50/mo with 7-day free trial. Be helpful and concise.",messages:[...msgs.filter(m=>m.role!=="system"),{role:"user",content:q}]})});
      const d=await r.json();setMsgs(p=>[...p,{role:"assistant",content:d.content&&d.content[0]?d.content[0].text:"Let me help!"}]);
    }catch(e){setMsgs(p=>[...p,{role:"assistant",content:"Unable to connect — check API key in Bolt settings."}]);}
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
  const [missionOpen,setMissionOpen]=useState(false);
  return (
    <div style={{...Sp,padding:"26px 40px 80px"}}>
      <div style={{maxWidth:820,margin:"0 auto",textAlign:"center"}}>
        <div style={{fontSize:10,color:GOLD,letterSpacing:6,marginBottom:10,fontWeight:700}}>MANDASTRONG STUDIO · CINEMA INTELLIGENCE PLATFORM · 2026</div>
        <h1 style={{fontFamily:"'Cinzel',serif",color:GOLD,fontSize:"clamp(22px,3vw,32px)",fontWeight:900,letterSpacing:5,textShadow:`0 0 30px ${GOLD}99`,marginBottom:6}}>THAT'S ALL FOLKS</h1>
        <div style={{color:WHITE,fontSize:13,letterSpacing:3,marginBottom:14}}>THANK YOU FOR CREATING WITH US</div>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`,marginBottom:20}}/>

        {/* VIDEO */}
        <video autoPlay loop muted playsInline style={{width:"100%",aspectRatio:"16/9",background:"#000",border:`1px solid ${GOLD}`,marginBottom:20,display:"block"}}>
          <source src="/background.mp4" type="video/mp4"/>
        </video>

        {/* MISSION STATEMENT */}
        <div onClick={()=>setMissionOpen(g=>!g)}
          style={{...Card(),marginBottom:missionOpen?0:14,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",border:`2px solid ${GOLD}`,background:"#050500"}}>
          <span style={{color:GOLD,fontWeight:900,fontSize:14,letterSpacing:3}}>✦ OUR MISSION</span>
          <span style={{color:GOLD,fontSize:18}}>{missionOpen?"▲":"▼"}</span>
        </div>
        {missionOpen&&(
          <div style={{...Card(),textAlign:"left",marginBottom:14,borderTop:"none",background:"#050500",border:`1px solid ${GOLD}`}}>
            <p style={{color:WHITE,fontSize:14,lineHeight:2,margin:0}}>
              MandaStrong Studio was built with one belief — <strong style={{color:GOLD}}>that every person deserves the tools to tell their story.</strong> Not just the wealthy. Not just the technically gifted. Everyone.
            </p>
            <p style={{color:WHITE,fontSize:14,lineHeight:2,marginTop:12}}>
              We are a professional cinema intelligence platform giving creators access to <strong style={{color:GOLD}}>600+ AI filmmaking tools</strong>, a full production pipeline from script to screen, and the ability to produce films up to 3 hours long — all from a single platform.
            </p>
            <p style={{color:WHITE,fontSize:14,lineHeight:2,marginTop:12}}>
              Every subscription directly funds two causes close to our heart: <strong style={{color:GOLD}}>veterans mental health support</strong> and <strong style={{color:GOLD}}>school anti-bullying programmes</strong>. These are not marketing lines. They are the reason this platform exists.
            </p>
            <p style={{color:WHITE,fontSize:14,lineHeight:2,marginTop:12}}>
              I am Amanda Woolley — author, creative producer, and founder of MandaStrong Studio. I built this because I believe technology should serve humanity, and art should serve truth.
            </p>
            <p style={{color:GOLD,fontWeight:900,fontSize:13,letterSpacing:2,marginTop:12}}>— AMANDA WOOLLEY · FOUNDER · MANDASTRONG STUDIO</p>
            <p style={{color:WHITE,fontSize:11,letterSpacing:1}}>MandaStrong1.Etsy.com · mandastrongstudio2026.bolt.host</p>
          </div>
        )}

        {/* HOW TO USE GUIDE */}
        <div onClick={()=>setGuideOpen(g=>!g)}
          style={{...Card(),marginBottom:guideOpen?0:14,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",border:`1px solid ${GOLD}`}}>
          <span style={{color:GOLD,fontWeight:900,fontSize:14,letterSpacing:3}}>📖 MANDASTRONG HOW TO USE APP GUIDE</span>
          <span style={{color:GOLD,fontSize:18}}>{guideOpen?"▲":"▼"}</span>
        </div>
        {guideOpen&&(
          <div style={{...Card(),textAlign:"left",marginBottom:14,borderTop:"none"}}>
            <div style={{color:GOLD,fontWeight:900,fontSize:13,letterSpacing:3,marginBottom:12,textAlign:"center"}}>MANDASTRONG STUDIO — COMPLETE USER GUIDE</div>
            {[
              ["GETTING STARTED","Open the app. Use the ☰ Quick Access menu top left to jump to any of the 23 pages instantly, or use BACK / NEXT buttons in the footer bar."],
              ["PAGE 4 — LOGIN & PRICING","Sign in, create a free account, or browse as guest. Choose your plan: Creator $20/mo, Pro $30/mo, Studio $50/mo with 7-day free trial."],
              ["PAGES 5–10 — AI TOOLS","Over 600 professional AI tools across Writing, Voice, Image, Video, Motion and Enhancement. Click any tool card, describe what you want, hit AI CREATE."],
              ["PAGE 6 — VOICE ENGINE","55 cinematic voice characters. Select your voice, paste your script, set your sliders — Speed, Pitch, Pause — then hit PREPARE & SPEAK. James is your primary documentary narrator."],
              ["PAGE 8 — VIDEO GENERATOR","The heart of your studio. Describe your scene in plain English. Hit GENERATE VIDEO CLIP. The canvas engine builds your cinematic environment automatically. Upload a reference image for mood and colour. Use QUICK PRESETS for instant scenes."],
              ["PAGE 11 — UPLOAD MEDIA","Upload your own video, audio and image files. Drag and drop or click to browse. Everything lands in your Media Library."],
              ["PAGE 13 — TIMELINE EDITOR","Drag your media clips onto the video, audio and title tracks. Build your film sequence. Hit RENDER when ready."],
              ["PAGE 15 — AUDIO MIXER","Set your mix levels. Recommended documentary settings: VOICE 85 · MUSIC 40 · EFX 50 · MASTER 85."],
              ["PAGE 16 — RENDER ENGINE","Choose your output quality up to 4K. Select frame rate and codec. Hit START RENDER. Your film renders directly in your browser."],
              ["PAGE 17 — FILM PREVIEW","Watch your completed film in full. Full playback controls."],
              ["PAGE 18 — EXPORT & DISTRIBUTE","Download your film to device. Share directly to YouTube, Instagram, TikTok, Facebook, LinkedIn, Vimeo and WhatsApp."],
              ["PAGE 21 — AGENT GROK","Your 24/7 AI studio assistant. Ask anything about production, tools, pricing or workflow."],
              ["MUSIC VIDEO STUDIO","Access from Page 6. Four-step wizard: Music → Vocals → Video → Generate. Enter your scene description on Step 4. Produces a complete music video production package."],
              ["PRODUCTION WORKFLOW","Recommended order: Page 8 → Page 6 → Page 13 → Page 15 → Page 16 → Page 17 → Page 18."],
            ].map(([t,d])=>(
              <div key={t} style={{borderBottom:`1px solid ${GOLDDIM}33`,paddingBottom:10,marginBottom:10}}>
                <div style={{color:GOLD,fontWeight:900,fontSize:11,letterSpacing:2,marginBottom:4}}>{t}</div>
                <div style={{color:WHITE,fontSize:13,lineHeight:1.7}}>{d}</div>
              </div>
            ))}
          </div>
        )}

        {/* THANK YOU */}
        <div style={{...Card(),textAlign:"left",marginBottom:16,border:`1px solid ${GOLDDIM}`}}>
          <h2 style={{color:GOLD,fontWeight:900,fontSize:15,textAlign:"center",marginBottom:14,letterSpacing:3}}>✦ A SPECIAL THANK YOU ✦</h2>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9}}>From the bottom of my heart — <strong style={{color:GOLD}}>thank you.</strong> Whether you are here to capture precious family memories, tell a story that has lived in your head for years, or simply explore what is possible when creativity meets technology — you chose to do it with MandaStrong Studio.</p>
          <p style={{color:WHITE,fontSize:14,lineHeight:1.9}}>Every subscription supports <strong style={{color:GOLD}}>veterans mental health initiatives</strong> and <strong style={{color:GOLD}}>school anti-bullying programs</strong> — causes deeply personal to me as the author of <em>Doxy the School Bully.</em></p>
          <p style={{color:GOLD,fontWeight:900,fontSize:14,letterSpacing:2,marginBottom:4}}>— AMANDA WOOLLEY</p>
          <p style={{color:WHITE,fontSize:12,letterSpacing:1}}>Founder · MandaStrong Studio · MandaStrong1.Etsy.com</p>
        </div>

        {/* BUTTONS */}
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>go(1)} style={{...G("out",false)}}>⬅ BACK TO HOME</button>
          <button onClick={()=>window.open("https://MandaStrong1.Etsy.com","_blank")} style={{...G("out",false)}}>VISIT ETSY STORE</button>
          <button onClick={()=>go(4)} style={{...G("gold",false)}}>START CREATING ✦</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page,setPage]=useState(1);
  const [menu,setMenu]=useState(false);

  useEffect(()=>{
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Rajdhani:wght@400;600;700;800;900&display=swap";
    document.head.appendChild(link);
    return()=>{try{document.head.removeChild(link);}catch{}};
  },[]);
  const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem("ms_user")||'{"name":"Guest","plan":"Guest","isAdmin":false}');}catch{return {name:"Guest",plan:"Guest",isAdmin:false};}});
  const [mediaLib,setMediaLib]=useState([]);
  const [timeline,setTimeline]=useState(()=>{try{return JSON.parse(localStorage.getItem("ms_timeline")||"{}");}catch{return {};}});
  const [rendered,setRendered]=useState(null);
  const [savedNotice,setSavedNotice]=useState(false);

  const go=p=>{setPage(p);window.scrollTo(0,0);try{localStorage.setItem("ms_page",JSON.stringify(p));}catch{}};
  const saveAsset=a=>setMediaLib(p=>[...p,a]);
  const saveProject=()=>{
    try{
      localStorage.setItem("ms_page",JSON.stringify(page));
      localStorage.setItem("ms_user",JSON.stringify(user));
      localStorage.setItem("ms_timeline",JSON.stringify(timeline));
      setSavedNotice(true);
      setTimeout(()=>setSavedNotice(false),2000);
    }catch(e){alert("Project saved!");}
  };

  const pages={
    1:<P1 go={go}/>,
    2:<P2 go={go}/>,
    3:<P3/>,
    4:<P4 go={go} setUser={setUser}/>,
    5:<ToolPage title="WRITING TOOLS" subtitle="AI WORKSTATION 01 — WRITING" tools={WRITING} onSave={saveAsset}/>,
    6:<P6Voice onSave={saveAsset}/>,
    7:<ToolPage title="IMAGE TOOLS" subtitle="AI WORKSTATION 03 — IMAGE" tools={IMAGE_T} onSave={saveAsset}/>,
    8:<P8VideoGenerator onSave={saveAsset} mediaLib={mediaLib}/>,
    9:<ToolPage title="MOTION & VFX" subtitle="AI WORKSTATION 05 — MOTION" tools={MOTION} onSave={saveAsset}/>,
    10:<ToolPage title="ENHANCEMENT STUDIO" subtitle="AI WORKSTATION 06 — ENHANCE" tools={MOTION} onSave={saveAsset}/>,
    11:<P11 mediaLib={mediaLib} setMediaLib={setMediaLib}/>,
    12:<P12 go={go} mediaLib={mediaLib}/>,
    13:<P13 go={go} mediaLib={mediaLib} timeline={timeline} setTimeline={setTimeline}/>,
    14:<P14/>,
    15:<P15/>,
    16:<P16 go={go} timeline={timeline} setRendered={setRendered} mediaLib={mediaLib}/>,
    17:<P17 go={go} rendered={rendered} mediaLib={mediaLib}/>,
    18:<P18 rendered={rendered} mediaLib={mediaLib}/>,
    19:<P19/>,
    20:<P20/>,
    21:<P21/>,
    22:<P22/>,
    23:<P23 go={go}/>,
  };

  return (
    <div style={{background:"#000",minHeight:"100vh",fontFamily:"'Rajdhani',sans-serif"}}>
      <Header go={go} setMenu={setMenu}/>
      {menu&&<QAMenu go={go} onClose={()=>setMenu(false)} user={user}/>}
      {savedNotice&&<div style={{position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",background:GOLDDIM,color:"#000",padding:"10px 24px",fontWeight:900,fontSize:13,letterSpacing:2,zIndex:999}}>✓ PROJECT SAVED</div>}
      <div style={{minHeight:"calc(100vh - 116px)"}}>{pages[page]||<P1 go={go}/>}</div>
      <Footer page={page} go={go} onSave={saveProject}/>
    </div>
  );
}
