import { useState, useEffect } from "react";

/* ================== THEME ================== */
const GOLD = "#e8c96d";
const GOLDDIM = "#a07820";
const BG = "#000";
const WHITE = "#d4c9a8";
const DIM = "#aaa";

/* ================== BUTTON ================== */
const G = (variant: "gold" | "outline", small = false) => ({
  background:
    variant === "gold"
      ? `linear-gradient(135deg, ${GOLDDIM}, ${GOLD})`
      : "transparent",
  border: variant === "gold" ? "none" : `1px solid ${GOLD}`,
  color: variant === "gold" ? "#000" : GOLD,
  padding: small ? "6px 16px" : "10px 24px",
  fontWeight: 900,
  cursor: "pointer",
  letterSpacing: 1.5,
  textTransform: "uppercase" as const,
  boxShadow:
    variant === "gold"
      ? "0 0 12px rgba(232,201,109,0.6)"
      : "none",
});

/* ================== NAV ================== */
const NAV = [
  "Home","Platform","Examples","Login","Writing Tools","Voice Tools",
  "Image Tools","Video Tools","Motion","Enhancement","Upload",
  "Editor","Timeline","Studio","Audio","Render","Preview","Export",
  "Tutorials","Terms","Grok","Community","Finish"
];

/* ================== SPEAK ================== */
function speak(text: string, onEnd: () => void) {
  const u = new SpeechSynthesisUtterance(text.slice(0, 4000));
  u.rate = 0.92;
  u.onend = onEnd;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

/* ================== APP ================== */
export default function App() {
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [uploads, setUploads] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<string[]>([]);

  /* ===== LOAD ===== */
  useEffect(() => {
    const t = localStorage.getItem("ms_text");
    const p = localStorage.getItem("ms_page");
    const u = localStorage.getItem("ms_uploads");
    const tl = localStorage.getItem("ms_timeline");

    if (t) setText(t);
    if (p) setPage(Number(p));
    if (u) setUploads(JSON.parse(u));
    if (tl) setTimeline(JSON.parse(tl));
  }, []);

  /* ===== SAVE ===== */
  useEffect(() => {
    localStorage.setItem("ms_text", text);
    localStorage.setItem("ms_page", String(page));
    localStorage.setItem("ms_uploads", JSON.stringify(uploads));
    localStorage.setItem("ms_timeline", JSON.stringify(timeline));
  }, [text, page, uploads, timeline]);

  /* ================== UI ================== */
  return (
    <div style={{ background: BG, minHeight: "100vh", color: WHITE, padding: 20 }}>
      
      <h1 style={{ color: GOLD, letterSpacing: 4 }}>
        MandaStrong Studio
      </h1>

      {/* NAV */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {NAV.map((n, i) => (
          <button
            key={i}
            style={G(page === i + 1 ? "gold" : "outline", true)}
            onClick={() => setPage(i + 1)}
          >
            {n}
          </button>
        ))}
      </div>

      {/* ================== HOME ================== */}
      {page === 1 && (
        <div>
          <h2 style={{ color: GOLD }}>Full AI Film Studio</h2>
          <p>Script → Voice → Media → Timeline → Export</p>
        </div>
      )}

      {/* ================== WRITING ================== */}
      {page === 5 && (
        <div>
          <h2 style={{ color: GOLD }}>Writing Tools</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: "100%", height: 150, background: "#111", color: WHITE }}
          />
        </div>
      )}

      {/* ================== VOICE ================== */}
      {page === 6 && (
        <div>
          <h2 style={{ color: GOLD }}>Voice Engine</h2>

          <button
            style={G("gold")}
            onClick={() => {
              setIsSpeaking(true);
              speak(text, () => setIsSpeaking(false));
            }}
          >
            PLAY
          </button>

          <button
            style={{ ...G("outline"), marginLeft: 10 }}
            onClick={() => {
              speechSynthesis.cancel();
              setIsSpeaking(false);
            }}
          >
            STOP
          </button>

          {isSpeaking && <p>Speaking...</p>}
        </div>
      )}

      {/* ================== UPLOAD ================== */}
      {page === 11 && (
        <div>
          <h2 style={{ color: GOLD }}>Upload Media</h2>

          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploads([...uploads, file.name]);
            }}
          />

          <ul>
            {uploads.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ================== TIMELINE ================== */}
      {page === 13 && (
        <div>
          <h2 style={{ color: GOLD }}>Timeline Editor</h2>

          <button
            style={G("gold")}
            onClick={() => setTimeline([...timeline, "Scene " + (timeline.length + 1)])}
          >
            Add Scene
          </button>

          <ul>
            {timeline.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ================== EXPORT ================== */}
      {page === 18 && (
        <div>
          <h2 style={{ color: GOLD }}>Export</h2>

          <button
            style={G("gold")}
            onClick={() => {
              const blob = new Blob([text], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "script.txt";
              a.click();
            }}
          >
            Download Script
          </button>
        </div>
      )}

      {/* ================== DEFAULT ================== */}
      {![1,5,6,11,13,18].includes(page) && (
        <div>
          <h2 style={{ color: GOLD }}>{NAV[page - 1]}</h2>
          <p>Module ready for expansion</p>
        </div>
      )}
    </div>
  );
}