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
  "Text to Voice","Text to Speech","Text to Narration","Text to Audiobook","Text to Voiceover",
  "AI Voice Actor","Neural Voice Generator","Emotion Voice Synth","Documentary Voice","Trailer Voice Generator",
  "Commercial Voice","Character Voice Creator","Audiobook Creator","Podcast Voice"
];

// Global voice assignments
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
      const isMale = ["james", "marcus", "river"].includes(voiceId);
      const femalePat = /samantha|zira|victoria|moira|karen|susan|lisa|fiona|serena|tessa|heather|hazel|allison|ava|nora|siri|female/i;
      const malePat = /david|daniel|oliver|arthur|george|harry|lee|ryan|eric|reed|liam|aaron|rishi|wayne|brian|derek|steven|alan|albert|andy|tom|bruce|fred|mark|paul|peter|john|james|gordon|alex|eddy|bobby|ralph|male/i;
      if (isMale) {
        picked = allVoices.find(x => malePat.test(x.name)) ||
                allVoices.find(x => x.lang === "en-GB" && !femalePat.test(x.name)) ||
                allVoices.find(x => x.lang.startsWith("en") && !femalePat.test(x.name)) ||
                allVoices[0];
      } else {
        picked = voiceId === "aurora" ? (allVoices.find(x => /kate|serena|emily/i.test(x.name)) || allVoices.find(x => x.lang === "en-GB")) :
                voiceId === "sophia" ? (allVoices.find(x => /karen/i.test(x.name)) || allVoices.find(x => x.lang === "en-AU")) :
                allVoices.find(x => /samantha|victoria|zira/i.test(x.name));
        picked = picked || allVoices.find(x => x.lang.startsWith("en")) || allVoices[0];
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

// Your full arrays (WRITING, VOICE, IMAGE_T, VIDEO_T, MOTION, NAV) go here
// ... (paste them from your previous version if needed)

function QAMenu({ go, onClose, user }) {
  // Your full QAMenu code here (unchanged)
}

function Header({ go, setMenu }) {
  // Your full Header code here (unchanged)
}

function Footer({ page, go, onSave }) {
  // Your full Footer code here (unchanged)
}

function ToolCard({ name, onOpen }) {
  // Your full ToolCard code here (unchanged)
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

  const inp = { width: "100%", background: "#000", border: `1px solid ${GOLDDIM}`, padding: "9px 12px", color: WHITE, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'Rajdhani',sans-serif" };

  const speak = (vid, txt) => speakText(vid, txt, () => setPlaying(vid), () => setPlaying(null));

  const runAI = async () => {
    if (!describe.trim()) return;
    setLoading(true); setSaved(false); setResult("");
    try {
      let prompt = ""; // ← your full prompt logic here (from previous version)
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const d = await res.json();
      const txt = d.content?.[0]?.text || "Generated!";
      setResult(txt);
      if (isVoice) speak(selVoice, txt);
    } catch (e) {
      setResult("Error — check API key in Bolt settings.");
    }
    setLoading(false);
  };

  const saveAsset = () => {
    const content = result || describe;
    if (!content.trim()) return;
    if (onSave) onSave({
      id: Date.now() + Math.random(),
      name: `${tool} — ${isVoice ? STOCK_VOICES.find(x => x.id === selVoice)?.name : "Result"}`,
      type: isVoice ? "audio/narration" : "text/plain",
      url: "",
      content
    });
    setSaved(true);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "min(600px,95vw)", background: "#050505", border: `1px solid ${GOLD}`, padding: 26, maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ ...H1, fontSize: 16, margin: 0, letterSpacing: 4 }}>{tool}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: GOLD, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        {/* 6-button row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 20 }}>
          <button onClick={() => setMode("upload")} style={{ ...G(mode === "upload" ? "gold" : "out", true), fontSize: 11 }}>UPLOAD</button>
          <button onClick={() => setMode("paste")} style={{ ...G(mode === "paste" ? "gold" : "out", true), fontSize: 11 }}>PASTE</button>
          <button onClick={() => setMode("ai")} style={{ ...G(mode === "ai" ? "gold" : "out", true), fontSize: 11 }}>PROMPT</button>
          <button onClick={() => setMode("ai")} style={{ ...G(mode === "ai" ? "gold" : "out", true), fontSize: 11 }}>TIMELINE</button>
          <button onClick={saveAsset} style={{ ...G("gold", true), fontSize: 11 }}>SAVE</button>
          <button onClick={runAI} disabled={loading} style={{ ...G("gold", true), fontSize: 11, opacity: loading ? 0.6 : 1 }}>AI ✦</button>
        </div>

        {/* Rest of your ToolPanel content (voice mode, upload, paste, ai, etc.) */}
        {/* Paste the rest from your previous version here */}
      </div>
    </div>
  );
}

function MusicVideoStudio({ onClose, onSave }) {
  // Your full MusicVideoStudio code here, with added video at top:
  // Add this right after the header div:
  <video
    autoPlay
    loop
    muted
    playsInline
    style={{
      width: "100%",
      maxHeight: "240px",
      objectFit: "cover",
      background: "#000",
      border: `1px solid ${GOLD}`,
      marginBottom: 16,
    }}
  >
    <source src="/music-studio-preview.mp4" type="video/mp4" /> {/* ← your added video */}
    <source src="/background.mp4" type="video/mp4" />
    Your browser does not support video.
  </video>

  // ... rest of your MusicVideoStudio code
}

function P6Voice({ onSave }) {
  // Your full P6Voice code here (unchanged except selVoice safety)
}

function P20() {
  return (
    <div style={{ ...Sp, padding: 40 }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: GOLD, letterSpacing: 4, marginBottom: 4, fontWeight: 700 }}>LEGAL</div>
        <h1 style={{ ...H1, fontSize: 28, marginBottom: 20 }}>TERMS OF SERVICE & DISCLAIMER</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ ...Card(), flex: 1 }}>
            <h2 style={{ color: GOLD, fontWeight: 900, fontSize: 18, marginBottom: 12, letterSpacing: 2 }}>TERMS OF SERVICE</h2>
            <p style={{ color: WHITE, fontSize: 14, lineHeight: 1.8 }}>
              By accessing or using MandaStrong Studio, you agree to be legally bound by these Terms of Service. Subscriptions bill monthly and auto-renew unless cancelled. All payments processed via Stripe. Studio Plan subscribers receive full commercial rights. You retain ownership of all media you upload. For support contact MandaStrong1.Etsy.com or Agent Grok on Page 21.
            </p>
          </div>

          <div style={{ ...Card(), flex: 1 }}>
            <h2 style={{ color: GOLD, fontWeight: 900, fontSize: 18, marginBottom: 12, letterSpacing: 2 }}>DISCLAIMER</h2>
            <p style={{ color: WHITE, fontSize: 14, lineHeight: 1.8 }}>
              MandaStrong Studio is provided as is without warranties. AI-generated content is produced algorithmically — users are solely responsible for reviewing all outputs. A significant portion of all proceeds supports veterans mental health and anti-bullying education.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function P23({ go }) {
  return (
    <div style={{ ...Sp, padding: "26px 40px 80px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            maxHeight: "50vh",
            objectFit: "cover",
            background: "#000",
            border: `1px solid ${GOLDDIM}`,
            marginBottom: 24,
          }}
        >
          <source src="/background.mp4" type="video/mp4" />
          <source src="/thatsallfolks.mp4" type="video/mp4" />
          <source src="/ocean.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <h1 style={{ fontFamily: "'Cinzel',serif", color: GOLD, fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, letterSpacing: 5, textShadow: `0 0 30px ${GOLD}99`, marginBottom: 14 }}>
          THAT'S ALL FOLKS
        </h1>

        {/* Rest of page 23 content */}
      </div>
    </div>
  );
}

// ... rest of your pages (P1 to P19, P21, P22) go here unchanged

export default function App() {
  const [page, setPage] = useState(() => { try { return JSON.parse(localStorage.getItem("ms_page") || "1"); } catch { return 1; } });
  const [menu, setMenu] = useState(false);
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("ms_user") || '{"name":"Guest","plan":"Guest","isAdmin":false}'); } catch { return { name: "Guest", plan: "Guest", isAdmin: false }; } });
  const [mediaLib, setMediaLib] = useState([]);
  const [timeline, setTimeline] = useState(() => { try { return JSON.parse(localStorage.getItem("ms_timeline") || "{}"); } catch { return {}; } });
  const [rendered, setRendered] = useState(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const go = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
    try { localStorage.setItem("ms_page", JSON.stringify(p)); } catch {}
  };

  const saveAsset = (a) => setMediaLib(p => [...p, a]);

  const saveProject = () => {
    try {
      localStorage.setItem("ms_page", JSON.stringify(page));
      localStorage.setItem("ms_user", JSON.stringify(user));
      localStorage.setItem("ms_timeline", JSON.stringify(timeline));
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    } catch (e) { alert("Project saved!"); }
  };

  const pages = {
    1: <P1 go={go} />,
    // ... all your page mappings here (5: ToolPage Writing, 6: P6Voice, etc.)
    20: <P20 />,
    23: <P23 go={go} />,
    // etc.
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Rajdhani',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Rajdhani:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <Header go={go} setMenu={setMenu} />
      {menu && <QAMenu go={go} onClose={() => setMenu(false)} user={user} />}
      {savedNotice && (
        <div style={{ position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", background: GOLDDIM, color: "#000", padding: "10px 24px", fontWeight: 900, fontSize: 13, letterSpacing: 2, zIndex: 999 }}>
          ✓ PROJECT SAVED
        </div>
      )}
      <div style={{ minHeight: "calc(100vh - 116px)" }}>{pages[page] || <P1 go={go} />}</div>
      <Footer page={page} go={go} onSave={saveProject} />
    </div>
  );
}