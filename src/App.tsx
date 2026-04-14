// @ts-nocheck
import { useState, useRef, useEffect } from "react";

const GOLD = "#e8c96d";
const SUPA_URL = "https://njqfexhltjwpgvctmyaw.supabase.co";
const SUPA_KEY = "sb_publishable_wqRnYf5pnp68Qo6-McfwyA_JNYrh2VC";
const EDGE_FN = SUPA_URL + "/functions/v1/claude-proxy";
const GOLDDIM = "#a07820";
const BG = "#000000";
const WHITE = "#d4c9a8";
const DIM = "#aaaaaa";
const TOTAL = 23;

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

const Sp = { minHeight: "100vh", background: BG, color: WHITE, fontFamily: "'Rajdhani',sans-serif", paddingBottom: 160 };
const H1 = { fontFamily: "'Cinzel',serif", color: GOLD, letterSpacing: 5, textTransform: "uppercase", margin: 0 };

// ====================== PAGE 1 (Fixed - no longer white) ======================
function P1({ go }) {
  return (
    <div style={{...Sp}}>
      <div style={{background:"#000",padding:"100px 40px",textAlign:"center"}}>
        <div style={{fontSize:12,color:DIM,letterSpacing:6,marginBottom:20}}>CINEMA INTELLIGENCE PLATFORM — 2026</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:68,fontWeight:900,color:GOLD,letterSpacing:8}}>MANDA STRONG</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:68,fontWeight:900,color:GOLD,letterSpacing:8,marginBottom:30}}>STUDIO</div>
        <div style={{color:WHITE,fontSize:18,letterSpacing:4,marginBottom:50}}>600+ AI TOOLS • 8K EXPORT • UP TO 3-HOUR FILMS</div>
        <button 
          onClick={() => go(8)} 
          style={{...G("gold",false),fontSize:18,padding:"18px 60px",letterSpacing:4}}
        >
          START CREATING
        </button>
      </div>
    </div>
  );
}

// ====================== FIXED P8VideoGenerator ======================
function P8VideoGenerator({ onSave, mediaLib }) {
  const canvasRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [colorGrade, setColorGrade] = useState("gold");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [showText, setShowText] = useState(false);
  const [refImageUrl, setRefImageUrl] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);
  const [fps, setFps] = useState(30);
  const [resolution, setResolution] = useState("1080p");
  const [genre, setGenre] = useState("cinematic");
  const [aiScene, setAiScene] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const refImgRef = useRef(null);
  const videoRef = useRef(null);
  const addLog = (msg) => setLog(p => [...p, msg]);

  const GRADES = [
    {id:"gold",label:"Gold & Black",bg:"#000000",fg:"#e8c96d",accent:"#a07820"},
    {id:"teal",label:"Teal & Dark",bg:"#0a1a1a",fg:"#4dd9c0",accent:"#1a5a52"},
    {id:"crimson",label:"Crimson",bg:"#0a0000",fg:"#ff4444",accent:"#880000"},
    {id:"silver",label:"Silver Screen",bg:"#111",fg:"#cccccc",accent:"#888888"},
  ];

  const GENRES = [
    {id:"cinematic",label:"🎬 Cinematic",desc:"Dark dramatic"},
    {id:"scifi",label:"🚀 Sci-Fi",desc:"Futuristic epic"},
  ];

  const grade = GRADES.find(g => g.id === colorGrade) || GRADES[0];

  const generateVideo = async () => {
    if (!prompt.trim()) { alert("Describe your scene first"); return; }
    setGenerating(true);
    setProgress(0);
    setLog([]);
    setVideoUrl("");
    setSaved(false);

    const canvas = canvasRef.current;
    const dims = resolution === "4K" ? { w: 3840, h: 2160 } : resolution === "720p" ? { w: 1280, h: 720 } : { w: 1920, h: 1080 };
    canvas.width = dims.w;
    canvas.height = dims.h;
    const W = dims.w;
    const H = dims.h;
    const ctx = canvas.getContext("2d");
    const totalFrames = duration * fps;

    addLog("🎬 Engine initialising...");

    const mimeType = "video/webm";
    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.start(100);

    const drawFrame = (frame) => {   // Fixed: frame parameter added
      const t = frame / totalFrames;
      const sec = frame / fps;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      // Simple background
      ctx.fillStyle = "#1a1208";
      ctx.fillRect(0, H * 0.6, W, H * 0.4);

      // Title text
      ctx.fillStyle = "#e8c96d";
      ctx.font = "bold 80px Arial";
      ctx.textAlign = "center";
      ctx.fillText(title || "YOUR SCENE", W / 2, H / 2);

      ctx.font = "400 28px Arial";
      ctx.fillStyle = "#aaaaaa";
      ctx.fillText(prompt.substring(0, 60) + "...", W / 2, H / 2 + 80);
    };

    for (let frame = 0; frame < totalFrames; frame++) {
      drawFrame(frame);
      if (frame % 10 === 0) setProgress(Math.round((frame / totalFrames) * 88));
    }

    recorder.stop();
    await new Promise(r => recorder.onstop = r);

    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    setVideoUrl(url);
    setProgress(100);
    addLog("✅ Render complete");
    setGenerating(false);
  };

  const saveToLibrary = () => {
    if (!videoUrl) return;
    if (onSave) onSave({ id: Date.now(), name: (title || "Scene") + ".webm", type: "video/webm", url: videoUrl });
    setSaved(true);
  };

  return (
    <div style={{...Sp}}>
      <canvas ref={canvasRef} style={{display:"none"}} />

      <div style={{padding:"20px",borderBottom:`2px solid ${GOLD}`,background:"#020200"}}>
        <h1 style={{...H1,fontSize:24}}>🎬 VIDEO GENERATOR</h1>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,padding:20}}>
        <div>
          <textarea 
            value={prompt} 
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe your scene here..."
            style={{width:"100%",height:200,background:"#111",border:`1px solid ${GOLDDIM}`,color:WHITE,padding:12}}
          />
          <button 
            onClick={generateVideo} 
            disabled={generating || !prompt.trim()}
            style={{...G("gold",false),width:"100%",marginTop:10,padding:14}}
          >
            {generating ? `RENDERING ${progress}%` : "GENERATE CLIP"}
          </button>
        </div>

        <div>
          {videoUrl ? (
            <video src={videoUrl} controls style={{width:"100%"}} />
          ) : (
            <div style={{height:300,background:"#111",display:"flex",alignItems:"center",justifyContent:"center",color:DIM}}>
              Preview will appear here
            </div>
          )}
          {videoUrl && (
            <button onClick={saveToLibrary} style={{...G("gold",false),width:"100%",marginTop:10}}>
              {saved ? "✓ SAVED" : "SAVE TO LIBRARY"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ====================== FIXED P13 WITH SYNC ======================
function P13({ go, mediaLib, timeline, setTimeline }) {
  return (
    <div style={{...Sp, padding:25}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h1 style={{...H1,fontSize:28}}>TIMELINE EDITOR</h1>
        <div style={{display:"flex",gap:12}}>
          <button onClick={() => {}} style={{...G("out",true)}}>+ ADD TRACK</button>
          <button 
            onClick={() => {
              const allAssets = Object.values(timeline || {}).flat();
              if (allAssets.length === 0) {
                alert("Add clips to tracks first.");
                return;
              }
              const synced = {};
              Object.keys(timeline || {}).forEach(k => {
                synced[k] = (timeline[k] || []).map(a => ({ ...a, startTime: 0 }));
              });
              setTimeline(synced);
              alert("✓ All tracks synced to master timeline");
            }}
            style={{...G("gold",true),fontSize:12,letterSpacing:1}}
          >
            ⚡ SYNC ALL TRACKS
          </button>
          <button onClick={() => go(16)} style={{...G("gold",false)}}>→ RENDER</button>
        </div>
      </div>

      <div style={{color:DIM}}>Timeline area — drag clips here from media library</div>
    </div>
  );
}

// ====================== MAIN APP ======================
export default function App() {
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState(false);
  const [mediaLib, setMediaLib] = useState([]);
  const [timeline, setTimeline] = useState({});

  const go = (p) => setPage(p);

  const saveAsset = (asset) => setMediaLib(prev => [...prev, asset]);

  const pages = {
    1: <P1 go={go} />,
    8: <P8VideoGenerator onSave={saveAsset} mediaLib={mediaLib} />,
    13: <P13 go={go} mediaLib={mediaLib} timeline={timeline} setTimeline={setTimeline} />,
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: WHITE }}>
      <header style={{ padding: "16px 25px", borderBottom: `2px solid ${GOLD}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 24, color: GOLD, letterSpacing: 3 }}>MANDA STRONG STUDIO</div>
        <button 
          onClick={() => setMenu(!menu)} 
          style={{ background: "none", border: `1px solid ${GOLD}`, color: GOLD, padding: "8px 18px", cursor: "pointer" }}
        >
          MENU
        </button>
      </header>

      {menu && (
        <div style={{ position: "fixed", top: 70, left: 30, background: "#111", padding: 20, border: `1px solid ${GOLD}`, zIndex: 1000 }}>
          <button onClick={() => { go(1); setMenu(false); }} style={{display:"block",margin:"8px 0",color:WHITE}}>1 • Home</button>
          <button onClick={() => { go(8); setMenu(false); }} style={{display:"block",margin:"8px 0",color:WHITE}}>8 • Video Generator</button>
          <button onClick={() => { go(13); setMenu(false); }} style={{display:"block",margin:"8px 0",color:WHITE}}>13 • Timeline</button>
        </div>
      )}

      <div style={{ padding: 20 }}>
        {pages[page] || <P1 go={go} />}
      </div>
    </div>
  );
}