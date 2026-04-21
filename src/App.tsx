#// @ts-nocheck
import { useState, useRef, useEffect } from "react";

const DB_NAME = "mandastrong_db";
const DB_VER = 1;
const STORE = "clips";

const openDB = () =>
  new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, DB_VER);
    r.onupgradeneeded = (e) => e.target.result.createObjectStore(STORE, { keyPath: "id" });
    r.onsuccess = (e) => res(e.target.result);
    r.onerror = rej;
  });

const saveClipToDB = async (id, blob, name, type) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ id, blob, name, type });
    await new Promise((r, j) => {
      tx.oncomplete = r;
      tx.onerror = j;
    });
  } catch (e) {
    console.warn("DB save failed", e);
  }
};

const getAllClipsFromDB = async () => {
  try {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => res(req.result || []);
      req.onerror = rej;
    });
  } catch (e) {
    return [];
  }
};

// ─── STYLING CONSTANTS ─────────────────────────────────────
const GOLD = "#e8c96d";
const GOLDDIM = "#a07820";
const BG = "#000000";
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
  fontFamily: "'Rajdhani', sans-serif",
});

const Sp = {
  minHeight: "100vh",
  background: BG,
  color: WHITE,
  fontFamily: "'Rajdhani', sans-serif",
  paddingBottom: 160,
  width: "100%",
  overflowX: "hidden",
};

const H1 = {
  fontFamily: "'Cinzel', serif",
  color: GOLD,
  letterSpacing: 5,
  textTransform: "uppercase",
  margin: 0,
  fontSize: "clamp(16px, 3vw, 32px)",
};

const Card = (x = {}) => ({
  background: "#0a0a0a",
  border: `1px solid ${GOLDDIM}`,
  borderRadius: 0,
  padding: 18,
  ...x,
});

// ─── VOICE & TOOLS DATA ─────────────────────────────────────
const STOCK_VOICES = [
  { id: "aurora", name: "Aurora", desc: "Warm British Female", style: "Documentary · Narrator", accent: "British RP" },
  { id: "marcus", name: "Marcus", desc: "Deep American Male", style: "Cinematic · Authoritative", accent: "American" },
  { id: "sophia", name: "Sophia", desc: "Bright Australian Female", style: "Upbeat · Engaging", accent: "Australian" },
  { id: "james", name: "James", desc: "Dry British Male", style: "Sarcastic · Witty", accent: "British" },
  { id: "nova", name: "Nova", desc: "Neutral AI Female", style: "Clean · Professional", accent: "Neutral" },
  { id: "river", name: "River", desc: "Warm American Male", style: "Friendly · Intimate", accent: "American South" },
];

const VOICE_TOOLS = ["Text to Voice", "Text to Speech", "Text to Narration", "Text to Audiobook", "Text to Voiceover", "AI Voice Actor", "Neural Voice Generator", "Emotion Voice Synth", "Documentary Voice", "Trailer Voice Generator", "Commercial Voice", "Character Voice Creator", "Audiobook Creator", "Podcast Voice"];

let VOICE_ASSIGNMENTS = {};
const loadVoiceAssignments = () => {
  try {
    VOICE_ASSIGNMENTS = JSON.parse(localStorage.getItem("ms_voice_assign") || "{}");
  } catch {}
};
if (typeof window !== "undefined") loadVoiceAssignments();

let currentUtterance = null;

function speakText(voiceId, txt, onStart, onEnd) {
  if (!txt || !txt.trim()) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;

  const clean = txt.replace(/\[pause\]/g, ". ").replace(/[*\/]/g, " ").slice(0, 5000);

  const doSpeak = () => {
    const allVoices = window.speechSynthesis.getVoices();
    const utt = new SpeechSynthesisUtterance(clean);
    utt.pitch = 1.0;
    utt.rate = 0.9;

    let picked = allVoices.find((v) => v.name === VOICE_ASSIGNMENTS[voiceId]);

    if (!picked) {
      const isMale = ["james", "marcus", "river"].includes(voiceId);
      const femalePat = /samantha|zira|victoria|moira|karen|susan|lisa|fiona|serena|tessa|heather|hazel|allison|ava|nora|siri|female/i;
      const malePat = /david|daniel|oliver|arthur|george|harry|lee|ryan|eric|reed|liam|aaron|rishi|wayne|brian|derek|steven|alan|albert|andy|tom|bruce|fred|mark|paul|peter|john|james|gordon|alex|eddy|bobby|ralph|male/i;

      if (isMale) {
        picked = allVoices.find((x) => malePat.test(x.name)) ||
                 allVoices.find((x) => x.lang === "en-GB" && !femalePat.test(x.name)) ||
                 allVoices.find((x) => x.lang.startsWith("en") && !femalePat.test(x.name)) ||
                 allVoices[0];
      } else {
        picked = voiceId === "aurora"
          ? (allVoices.find((x) => /kate|serena|emily/i.test(x.name)) || allVoices.find((x) => x.lang === "en-GB"))
          : voiceId === "sophia"
          ? (allVoices.find((x) => /karen/i.test(x.name)) || allVoices.find((x) => x.lang === "en-AU"))
          : allVoices.find((x) => /samantha|victoria|zira/i.test(x.name));
        picked = picked || allVoices.find((x) => x.lang.startsWith("en")) || allVoices[0];
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

// Tool lists (unchanged)
const WRITING = [ /* ... your full array ... */ ];
const IMAGE_T = [ /* ... your full array ... */ ];
const VIDEO_T = [ /* ... your full array ... */ ];
const MOTION = [ /* ... your full array ... */ ];

const NAV = [
  { p: 1, l: "Home" }, { p: 2, l: "Platform" }, { p: 3, l: "Examples" }, { p: 4, l: "Login / Pricing" },
  { p: 5, l: "Writing Tools" }, { p: 6, l: "Voice Tools" }, { p: 7, l: "Image Tools" }, { p: 8, l: "Video Tools" },
  { p: 9, l: "Motion & VFX" }, { p: 10, l: "Enhancement" }, { p: 11, l: "Upload Media" }, { p: 12, l: "Editor Suite" },
  { p: 13, l: "Timeline Editor" }, { p: 14, l: "Enhancement Studio" }, { p: 15, l: "Audio Mixer" },
  { p: 16, l: "Render Engine" }, { p: 17, l: "Film Preview" }, { p: 18, l: "Export & Distribute" },
  { p: 19, l: "Tutorials" }, { p: 20, l: "Terms & Disclaimer" }, { p: 21, l: "Agent Grok" },
  { p: 22, l: "Community Hub" }, { p: 23, l: "That's All Folks" },
];

// Keep all your rendering functions: windowsillRenderFilm, renderPhotoFilm, ProjectHistoryModal, SaveSessionModal, QAMenu, Header, Footer, ToolCard, ToolPanel, ToolPage, MusicVideoStudio, VOICE_CHARACTERS, P6Voice, P8VideoGenerator, P1–P23 etc.

export default function App() {
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState(false);
  const [visited, setVisited] = useState(() => new Set([1]));

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ms_user") || '{"name":"Guest","plan":"Guest","isAdmin":false}'); }
    catch { return { name: "Guest", plan: "Guest", isAdmin: false }; }
  });

  const [mediaLib, setMediaLib] = useState([]);
  const [timeline, setTimeline] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ms_timeline") || "{}"); }
    catch { return {}; }
  });

  const [rendered, setRendered] = useState(null);
  const [filmDuration, setFilmDuration] = useState(60);
  const [savedNotice, setSavedNotice] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const go = (p) => {
    setPage(p);
    setVisited((v) => { const n = new Set(v); n.add(p); return n; });
    window.scrollTo(0, 0);
    try { localStorage.setItem("ms_page", JSON.stringify(p)); } catch {}
  };

  // Restore from DB + localStorage on mount
  useEffect(() => {
    const restore = async () => {
      try {
        const dbClips = await getAllClipsFromDB();
        if (dbClips.length > 0) {
          const restored = dbClips.map(c => ({
            id: c.id,
            name: c.name,
            type: c.type || "video/webm",
            url: URL.createObjectURL(c.blob),
            file: new File([c.blob], c.name, { type: c.type || "video/webm" }),
            dbId: c.id,
          }));
          setMediaLib(restored);
        }
      } catch (e) {
        try {
          const m = JSON.parse(localStorage.getItem("ms_medialib") || "[]");
          if (m.length > 0) setMediaLib(m);
        } catch {}
      }
    };

    restore();

    const handler = () => setShowHistory(true);
    window.addEventListener("ms_open_history", handler);
    return () => window.removeEventListener("ms_open_history", handler);
  }, []);

  const saveAsset = async (a) => {
    if (a.file instanceof File || a.file instanceof Blob) {
      try {
        const blob = a.file instanceof File ? a.file : a.file;
        const dbId = a.id || "asset_" + Date.now();
        await saveClipToDB(dbId, blob, a.name || "asset", a.type || "video/webm");
        setMediaLib((p) => [...p, { ...a, dbId }]);
      } catch (e) {
        setMediaLib((p) => [...p, a]);
      }
    } else {
      setMediaLib((p) => [...p, a]);
    }
  };

  const saveProject = () => setShowSaveModal(true);

  const doSave = (name, note) => {
    try {
      localStorage.setItem("ms_page", JSON.stringify(page));
      localStorage.setItem("ms_user", JSON.stringify(user));
      localStorage.setItem("ms_timeline", JSON.stringify(timeline));
      localStorage.setItem("ms_medialib", JSON.stringify(mediaLib.map(a => ({ ...a, file: undefined }))));

      const entry = {
        name,
        note,
        page,
        assetCount: mediaLib.length,
        date: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        savedPage: page,
        savedTimeline: JSON.parse(JSON.stringify(timeline)),
        savedUser: user,
      };

      const existing = JSON.parse(localStorage.getItem("ms_project_history") || "[]");
      existing.push(entry);
      if (existing.length > 20) existing.shift();
      localStorage.setItem("ms_project_history", JSON.stringify(existing));

      setShowSaveModal(false);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } catch (e) {
      setShowSaveModal(false);
      alert("Project saved!");
    }
  };

  const resumeProject = async (h) => {
    try {
      if (h.savedTimeline && Object.keys(h.savedTimeline).length > 0) {
        setTimeline(h.savedTimeline);
        localStorage.setItem("ms_timeline", JSON.stringify(h.savedTimeline));
      }
      if (h.savedUser && h.savedUser.name) {
        setUser(h.savedUser);
        localStorage.setItem("ms_user", JSON.stringify(h.savedUser));
      }
      const targetPage = h.savedPage || h.page || 8;
      go(targetPage);
      setShowHistory(false);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } catch (e) {
      console.error("Resume error:", e);
      setShowHistory(false);
    }
  };

  // All your page components (P1 to P23, MusicVideoStudio, P6Voice, P8VideoGenerator, etc.) go here unchanged

  const allPages = [
    { p: 1, el: <P1 go={go} /> },
    { p: 2, el: <P2 go={go} /> },
    { p: 3, el: <P3 /> },
    { p: 4, el: <P4 go={go} setUser={setUser} /> },
    { p: 5, el: <ToolPage title="WRITING TOOLS" subtitle="AI WORKSTATION 01 — WRITING" tools={WRITING} onSave={saveAsset} /> },
    { p: 6, el: <P6Voice onSave={saveAsset} /> },
    { p: 7, el: <ToolPage title="IMAGE TOOLS" subtitle="AI WORKSTATION 03 — IMAGE" tools={IMAGE_T} onSave={saveAsset} /> },
    { p: 8, el: <P8VideoGenerator onSave={saveAsset} user={user} filmDuration={filmDuration} setFilmDuration={setFilmDuration} /> },
    { p: 9, el: <ToolPage title="MOTION & VFX" subtitle="AI WORKSTATION 05 — MOTION" tools={MOTION} onSave={saveAsset} /> },
    { p: 10, el: <ToolPage title="ENHANCEMENT STUDIO" subtitle="AI WORKSTATION 06 — ENHANCE" tools={MOTION} onSave={saveAsset} /> },
    { p: 11, el: <P11 mediaLib={mediaLib} setMediaLib={setMediaLib} /> },
    { p: 12, el: <P12 go={go} mediaLib={mediaLib} /> },
    { p: 13, el: <P13 go={go} mediaLib={mediaLib} timeline={timeline} setTimeline={setTimeline} user={user} filmDuration={filmDuration} setFilmDuration={setFilmDuration} /> },
    { p: 14, el: <P14 /> },
    { p: 15, el: <P15 /> },
    { p: 16, el: <P16 go={go} timeline={timeline} setRendered={setRendered} mediaLib={mediaLib} setMediaLib={setMediaLib} user={user} filmDuration={filmDuration} setFilmDuration={setFilmDuration} /> },
    { p: 17, el: <P17 go={go} rendered={rendered} mediaLib={mediaLib} /> },
    { p: 18, el: <P18 rendered={rendered} mediaLib={mediaLib} /> },
    { p: 19, el: <P19 /> },
    { p: 20, el: <P20 /> },
    { p: 21, el: <P21 /> },
    { p: 22, el: <P22 /> },
    { p: 23, el: <P23 go={go} /> },
  ];

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Rajdhani', sans-serif" }}>
      <Header go={go} setMenu={setMenu} />

      {menu && <QAMenu go={go} onClose={() => setMenu(false)} user={user} />}
      {showHistory && <ProjectHistoryModal onClose={() => setShowHistory(false)} onResume={resumeProject} />}
      {showSaveModal && <SaveSessionModal onClose={() => setShowSaveModal(false)} onSave={doSave} currentPage={page} assetCount={mediaLib.length} />}

      {savedNotice && (
        <div style={{ position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", background: GOLDDIM, color: "#000", padding: "10px 24px", fontWeight: 900, fontSize: 13, letterSpacing: 2, zIndex: 999 }}>
          ✓ PROJECT SAVED
        </div>
      )}

      <div style={{ minHeight: "calc(100vh - 116px)" }}>
        {allPages.map(({ p, el }) => (
          <div key={p} style={{ display: page === p ? "block" : "none" }}>
            {el}
          </div>
        ))}
      </div>

      <Footer page={page} go={go} onSave={saveProject} onHistory={() => setShowHistory(true)} />
    </div>
  );
}