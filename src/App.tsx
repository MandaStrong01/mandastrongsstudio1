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
  basic: "https://buy.stripe.com/4gM5kFaVYfjN7EX0vMafS00",
  pro: "https://buy.stripe.com/14A00l8NQ0oTbVd3HYafS01",
  studio: "https://buy.stripe.com/fZubJ35BE3B53oHdiyafS02",
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

const Sp = { minHeight: "100vh", background: BG, color: WHITE, fontFamily: "'Rajdhani',sans-serif", paddingBottom: 160 };
const H1 = { fontFamily: "'Cinzel',serif", color: GOLD, letterSpacing: 5, textTransform: "uppercase", margin: 0 };
const Card = (x) => ({ background: "#0a0a0a", border: `1px solid ${GOLDDIM}`, borderRadius: 0, padding: 18, ...(x || {}) });

// STOCK_VOICES, VOICE_TOOLS, speakText, stopSpeaking, WRITING, VOICE, IMAGE_T, VIDEO_T, MOTION, NAV
const STOCK_VOICES = [ /* your original STOCK_VOICES array */ ];
const VOICE_TOOLS = [ /* your original */ ];
// ... (keep all your original helper functions: speakText, stopSpeaking, loadVoiceAssignments, etc.)

// NAV array
const NAV = [ /* your original NAV */ ];

// QAMenu, Header, Footer, ToolCard, ToolPanel, ToolPage, MusicVideoStudio, P6Voice, P1, P2, P3, P4, P11, P12
// (Copy these from your previous working version - they are unchanged)

function QAMenu({ go, onClose, user }) { /* your original */ }
function Header({ go, setMenu }) { /* your original */ }
function Footer({ page, go, onSave }) { /* your original */ }
function ToolCard({ name, onOpen }) { /* your original */ }
function ToolPanel({ tool, onClose, onSave }) { /* your original */ }
function ToolPage({ title, subtitle, tools, onSave }) { /* your original */ }
function MusicVideoStudio({ onClose, onSave }) { /* your original */ }
function P6Voice({ onSave }) { /* your original */ }
function P1({ go }) { /* your original */ }
function P2({ go }) { /* your original */ }
function P3() { /* your original */ }
function P4({ go, setUser }) { /* your original */ }
function P11({ mediaLib, setMediaLib }) { /* your original */ }
function P12({ go, mediaLib }) { /* your original */ }

// ====================== FIXED P8 VIDEO GENERATOR ======================
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
  const addLog = (msg) => setLog((p) => [...p, msg]);

  const GRADES = [
    { id: "gold", label: "Gold & Black", bg: "#000000", fg: "#e8c96d", accent: "#a07820" },
    { id: "teal", label: "Teal & Dark", bg: "#0a1a1a", fg: "#4dd9c0", accent: "#1a5a52" },
    { id: "crimson", label: "Crimson", bg: "#0a0000", fg: "#ff4444", accent: "#880000" },
    { id: "silver", label: "Silver Screen", bg: "#111", fg: "#cccccc", accent: "#888888" },
    { id: "amber", label: "Warm Amber", bg: "#0a0800", fg: "#ffaa33", accent: "#885500" },
    { id: "arctic", label: "Arctic Blue", bg: "#000a1a", fg: "#88ccff", accent: "#003366" },
    { id: "neon", label: "Neon Night", bg: "#000000", fg: "#ff00ff", accent: "#00ffff" },
    { id: "forest", label: "Forest Green", bg: "#000a00", fg: "#44ff88", accent: "#004420" },
  ];

  const GENRES = [
    { id: "cinematic", label: "🎬 Cinematic", desc: "Dark dramatic" },
    { id: "documentary", label: "📽 Documentary", desc: "Clean authoritative" },
    { id: "horror", label: "👁 Horror", desc: "Dark disturbing" },
    { id: "romance", label: "💛 Romance", desc: "Warm intimate" },
    { id: "scifi", label: "🚀 Sci-Fi", desc: "Futuristic epic" },
    { id: "comedy", label: "😄 Comedy", desc: "Bright energetic" },
    { id: "action", label: "⚡ Action", desc: "Fast intense" },
    { id: "animation", label: "✨ Animation", desc: "Vivid stylised" },
    { id: "musical", label: "🎵 Musical", desc: "Rhythmic vibrant" },
    { id: "thriller", label: "🔪 Thriller", desc: "Tense atmospheric" },
    { id: "nature", label: "🌿 Nature", desc: "Organic flowing" },
    { id: "historical", label: "🏛 Historical", desc: "Epic period" },
  ];

  const grade = GRADES.find((g) => g.id === colorGrade) || GRADES[0];

  const analyseWithClaude = async () => {
    if (!prompt.trim()) return;
    setAiLoading(true); setAiScene(null);
    try {
      const res = await fetch(EDGE_FN, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + SUPA_KEY, "apikey": SUPA_KEY },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [{ role: "user", content: `You are a professional cinema director analysing a scene prompt to build a canvas-rendered film clip.

PROMPT: "${prompt}"
GENRE: ${genre}
COLOUR GRADE: ${colorGrade}

Return ONLY valid JSON, no markdown, no explanation:
{
  "sceneType": "cosmic|city|dawn|landscape|interior|abstract",
  "skyColor": "#hex",
  "groundColor": "#hex",
  "primaryColor": "#hex",
  "accentColor": "#hex",
  "starField": true|false,
  "earthGlow": true|false,
  "cityLights": true|false,
  "humanFigure": true|false,
  "silhouette": "none|person|city",
  "fogLayer": true|false,
  "lightBeams": true|false,
  "rays": true|false,
  "sunRise": true|false,
  "groundLayer": true|false,
  "horizon": true|false,
  "particles": true|false,
  "particleCount": 60,
  "waves": false,
  "titleLines": ["line 1","line 2"],
  "mood": "description of mood",
  "cinematicNote": "one sentence director note"
}` }]
        })
      });
      const d = await res.json();
      if (d.content && d.content[0]) {
        try {
          const txt = d.content[0].text.trim().replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(txt);
          setAiScene(parsed);
          addLog("✦ Claude analysed: " + parsed.sceneType + " · " + parsed.mood);
          addLog("  " + parsed.cinematicNote);
        } catch (e) { addLog("Scene analysed — using smart defaults"); }
      }
    } catch (e) { addLog("Analysing from prompt directly..."); }
    setAiLoading(false);
  };

  const generateVideo = async () => {
    if (!prompt.trim()) { alert("Describe your scene first"); return; }
    setGenerating(true); setProgress(0); setLog([]); setVideoUrl(""); setSaved(false);

    const canvas = canvasRef.current;
    const dims = resolution === "4K" ? { w: 3840, h: 2160 } : resolution === "720p" ? { w: 1280, h: 720 } : { w: 1920, h: 1080 };
    canvas.width = dims.w; canvas.height = dims.h;
    const W = dims.w; const H = dims.h;
    const ctx = canvas.getContext("2d");
    const totalFrames = duration * fps;

    addLog("🎬 MandaStrong Cinema Engine initialising...");
    addLog(`📐 ${W}×${H} · ${fps}fps · ${duration}s · ${genre}`);

    let scene = aiScene || {};
    if (!aiScene) {
      const ft = prompt.toLowerCase();
      scene.sceneType = ft.includes("space") || ft.includes("planet") || ft.includes("galaxy") || ft.includes("cosmos") ? "cosmic" :
        ft.includes("city") || ft.includes("street") || ft.includes("building") || ft.includes("urban") ? "city" :
        ft.includes("dawn") || ft.includes("sunrise") || ft.includes("golden hour") || ft.includes("morning") ? "dawn" :
        ft.includes("dark") || ft.includes("alone") || ft.includes("interior") || ft.includes("room") || ft.includes("spotlight") ? "interior" :
        ft.includes("landscape") || ft.includes("field") || ft.includes("horizon") ? "landscape" : "abstract";

      scene.starField = ft.includes("star") || ft.includes("space") || ft.includes("galaxy") || ft.includes("night sky");
      scene.earthGlow = ft.includes("earth") || ft.includes("planet") || ft.includes("globe") || ft.includes("from space");
      scene.cityLights = ft.includes("window") || ft.includes("city light") || ft.includes("lit building");
      scene.humanFigure = ft.includes("person") || ft.includes("figure") || ft.includes("human") || ft.includes("crowd") || ft.includes("people") || ft.includes("man ") || ft.includes("woman ");
      scene.silhouette = ft.includes("crowd") || ft.includes("people") ? "city" : ft.includes("alone") || ft.includes("single") || ft.includes("one person") ? "person" : "none";
      scene.fogLayer = ft.includes("fog") || ft.includes("mist") || ft.includes("haze") || ft.includes("smoke");
      scene.lightBeams = ft.includes("beam") || ft.includes("shaft") || ft.includes("spotlight") || ft.includes("ray");
      scene.rays = ft.includes("ray") || ft.includes("radiating") || ft.includes("light expand");
      scene.sunRise = ft.includes("dawn") || ft.includes("sunrise") || ft.includes("golden dawn") || ft.includes("golden hour");
      scene.groundLayer = ft.includes("ground") || ft.includes("earth") || ft.includes("floor") || ft.includes("field") || ft.includes("garden");
      scene.horizon = ft.includes("horizon") || ft.includes("skyline");
      scene.particles = true;
      scene.particleCount = ft.includes("dense") ? 100 : ft.includes("sparse") ? 20 : 60;
      scene.waves = ft.includes("ocean") || ft.includes("sea") || ft.includes("water") || ft.includes("wave");

      const genreColors = { /* your original genreColors object */ };
      const gc = genreColors[genre] || genreColors.cinematic;
      scene.skyColor = gc.sky; scene.groundColor = gc.ground;
      scene.primaryColor = grade.fg; scene.accentColor = grade.accent;
    }

    addLog("Scene: " + scene.sceneType + " · human:" + scene.humanFigure + " · city:" + scene.cityLights + " · stars:" + scene.starField);

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: resolution === "4K" ? 40000000 : 12000000 });
    const chunks = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.start(100);
    addLog("● Recording...");

    const parseHex = (hex) => {
      const h = (hex || "#888888").replace("#", "");
      return [parseInt(h.slice(0,2),16)||0, parseInt(h.slice(2,4),16)||0, parseInt(h.slice(4,6),16)||0];
    };
    const [fgR, fgG, fgB] = parseHex(scene.primaryColor || grade.fg);
    const [skyR, skyG, skyB] = parseHex(scene.skyColor || grade.bg);
    const [gndR, gndG, gndB] = parseHex(scene.groundColor || "#0a0500");
    const numP = Math.min(200, scene.particleCount || 60);

    let refImg = null;
    if (refImageUrl) {
      try { refImg = new Image(); await new Promise(r => { refImg.onload = r; refImg.onerror = r; refImg.src = refImageUrl; }); } catch (e) { refImg = null; }
    }

    const stars = Array.from({length:300}, (_,i) => ({x:(i*2791+i*i*37)%W, y:(i*1847+i*i*13)%H, r:i%7===0?2.2:i%3===0?1.4:0.8, tw:i*0.7, speed:0.3+i%3*0.2}));
    const buildings = Array.from({length:40}, (_,i) => ({x:i*(W/39), w:14+i%7*28, h:H*0.06+i%11*H*0.09}));

    const grainCanvas = document.createElement("canvas"); grainCanvas.width = W; grainCanvas.height = H;
    const grainCtx = grainCanvas.getContext("2d");
    const grainData = grainCtx.createImageData(W, H);
    for (let i = 0; i < grainData.data.length; i += 4) {
      const v = Math.random() * 30 - 15;
      grainData.data[i] = 128 + v; grainData.data[i+1] = 128 + v; grainData.data[i+2] = 128 + v; grainData.data[i+3] = 22;
    }
    grainCtx.putImageData(grainData, 0, 0);

    // FIXED drawFrame - frame is properly passed
    const drawFrame = (frame) => {
      const t = frame / totalFrames;
      const sec = frame / fps;
      const ease = (x) => x < 0.5 ? 2*x*x : 1 - Math.pow(-2*x+2, 2)/2;

      const bgGrad = ctx.createLinearGradient(0,0,0,H);
      bgGrad.addColorStop(0, `rgb(${skyR},${skyG},${skyB})`);
      bgGrad.addColorStop(1, `rgb(${gndR},${gndG},${gndB})`);
      ctx.fillStyle = bgGrad; ctx.fillRect(0,0,W,H);

      if (refImg) { ctx.save(); ctx.globalAlpha = 0.18; ctx.drawImage(refImg,0,0,W,H); ctx.restore(); }

      if (scene.starField) { /* your stars + nebula code */ }
      if (scene.earthGlow) { /* your earth glow code */ }
      if (scene.sunRise) { /* your sunrise code */ }
      if (scene.rays || scene.lightBeams) { /* your rays code */ }
      if (scene.waves) { /* your waves code */ }

      // City lights - now safe because frame is in scope
      if (scene.sceneType === "city" || scene.cityLights || scene.silhouette === "city") {
        ctx.fillStyle = "rgba(0,0,0,0.92)";
        buildings.forEach(b => {
          ctx.fillRect(b.x, H - b.h, b.w, b.h);
          if (scene.cityLights) {
            for (let wy = H - b.h + 8; wy < H - 8; wy += 16) {
              for (let wx = b.x + 4; wx < b.x + b.w - 6; wx += 10) {
                if (Math.sin(wx * 7 + wy * 5 + frame * 0.012) > 0.05) {
                  const lit = 0.25 + Math.sin(wx * 11 + wy * 7 + sec * 0.4) * 0.3;
                  const flicker = Math.random() > 0.998 ? 0 : 1;
                  ctx.fillStyle = `rgba(${fgR},${fgG},${fgB},${Math.max(0, lit) * flicker})`;
                  ctx.fillRect(wx, wy, 6, 8);
                }
              }
            }
          }
        });
        if (scene.groundLayer) {
          const sg = ctx.createLinearGradient(0, H*0.88, 0, H);
          sg.addColorStop(0, `rgba(${fgR},${fgG},${fgB},0.06)`);
          sg.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = sg; ctx.fillRect(0, H*0.88, W, H*0.12);
        }
      }

      // Continue with the rest of your drawFrame code (groundLayer, humanFigure, crowd, fog, particles, vignette, grain, letterbox, text, fade)
      // ... (paste the rest of your original drawing code here)
    };

    addLog("🎞 Rendering " + totalFrames + " frames...");
    const msPerFrame = 1000 / fps;

    await new Promise(resolve => {
      let frame = 0;
      const renderNext = () => {
        if (frame >= totalFrames) { resolve(null); return; }
        drawFrame(frame);
        setProgress(Math.round((frame / totalFrames) * 88));
        if (frame % (fps * 3) === 0 && frame > 0) addLog("  " + Math.round(frame / fps) + "s / " + duration + "s");
        frame++;
        setTimeout(renderNext, msPerFrame);
      };
      renderNext();
    });

    addLog("⬛ Finalising..."); setProgress(94);
    await new Promise(r => setTimeout(r, 600));
    recorder.stop();
    await new Promise(r => { recorder.onstop = r; });

    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    setVideoUrl(url); setProgress(100);
    addLog("✅ COMPLETE — " + (blob.size / 1024 / 1024).toFixed(1) + "MB · " + duration + "s · " + resolution);

    setTimeout(() => { if (videoRef.current) { videoRef.current.load(); videoRef.current.play().catch(() => {}); } }, 200);
    setGenerating(false);
  };

  const saveToLibrary = async () => { /* your original saveToLibrary */ };

  const libVideos = (mediaLib || []).filter(a => a.type && a.type.startsWith("video"));
  const libImages = (mediaLib || []).filter(a => a.type && a.type.startsWith("image"));

  return (
    <div style={{ ...Sp }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <input ref={refImgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
        const f = e.target.files && e.target.files[0];
        if (f) setRefImageUrl(URL.createObjectURL(f));
      }} />

      {/* Your full UI JSX for P8 goes here - header, 3-column layout, left controls, center preview, right intelligence panel */}
      {/* Copy your original return JSX from the last working version and paste it here */}
      {/* The important part is that generateVideo now uses the fixed drawFrame */}
    </div>
  );
}

// ====================== UPDATED P13 WITH SYNC BUTTON ======================
function P13({ go, mediaLib, timeline, setTimeline }) {
  const [tracks, setTracks] = useState(["VIDEO TRACK", "AUDIO TRACK", "TEXT / TITLES"]);

  return (
    <div style={{ ...Sp, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 11, color: GOLD, letterSpacing: 4, fontWeight: 700 }}>EDITING WORKSPACE</div>
          <h1 style={{ ...H1, fontSize: 24, margin: 0 }}>TIMELINE EDITOR</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setTracks(p => [...p, `TRACK ${p.length + 1}`])} style={{ ...G("out", true) }}>+ ADD TRACK</button>
          <button onClick={() => {
            const allAssets = Object.values(timeline).flat();
            if (allAssets.length === 0) { alert("Add clips to tracks first."); return; }
            const synced = {};
            Object.keys(timeline).forEach(k => {
              synced[k] = (timeline[k] || []).map(a => ({ ...a, startTime: 0, syncGroup: "master" }));
            });
            setTimeline(synced);
            alert("✓ All tracks synced to master timeline. Same start point. Ready to render.");
          }} style={{ ...G("gold", true), fontSize: 11, letterSpacing: 1 }}>⚡ SYNC ALL TRACKS</button>
          <button onClick={() => go(16)} style={{ ...G("gold", false) }}>→ RENDER</button>
          <button onClick={() => setTimeline({})} style={{ ...G("out", true) }}>CLEAR ALL</button>
        </div>
      </div>

      {/* Rest of your original P13 code (preview area, track rendering, drag & drop, media library strip, etc.) */}
      {/* Paste the rest of your P13 here from your previous version */}
    </div>
  );
}

// P14 to P23 - keep your original code for these pages

export default function App() {
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState(false);

  // your original useEffect for fonts, user, mediaLib, timeline, rendered, savedNotice, go, saveAsset, saveProject

  const pages = {
    1: <P1 go={go} />,
    // ... all other pages
    8: <P8VideoGenerator onSave={saveAsset} mediaLib={mediaLib} />,
    13: <P13 go={go} mediaLib={mediaLib} timeline={timeline} setTimeline={setTimeline} />,
    // ... rest
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Rajdhani',sans-serif" }}>
      <Header go={go} setMenu={setMenu} />
      {menu && <QAMenu go={go} onClose={() => setMenu(false)} user={user} />}
      {savedNotice && <div style={{ position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", background: GOLDDIM, color: "#000", padding: "10px 24px", fontWeight: 900, fontSize: 13, letterSpacing: 2, zIndex: 999 }}>✓ PROJECT SAVED</div>}
      <div style={{ minHeight: "calc(100vh - 116px)" }}>{pages[page] || <P1 go={go} />}</div>
      <Footer page={page} go={go} onSave={saveProject} />
    </div>
  );
}