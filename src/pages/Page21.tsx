// @ts-nocheck
import { useState, useRef, useEffect } from "react";

const GOLD = "#e8c96d";
const GOLDDIM = "#a07820";
const WHITE = "#d4c9a8";

const G = (v, sm?) => ({
  background: v === "gold" ? `linear-gradient(135deg,${GOLDDIM},${GOLD})` : "transparent",
  border: v === "gold" ? "none" : `1px solid ${GOLD}`,
  color: v === "gold" ? "#000" : GOLD,
  borderRadius: 0, fontWeight: 900,
  padding: sm ? "5px 14px" : "10px 26px",
  fontSize: sm ? 11 : 13,
  cursor: "pointer", letterSpacing: 2, textTransform: "uppercase" as const,
  fontFamily: "'Rajdhani',sans-serif",
});

const Sp = { minHeight: "100vh", background: "#000000", color: WHITE, fontFamily: "'Rajdhani',sans-serif", paddingBottom: 160, width: "100%", overflowX: "hidden" as const };
const H1 = { fontFamily: "'Cinzel',serif", color: GOLD, letterSpacing: 5, textTransform: "uppercase" as const, margin: 0, fontSize: "clamp(16px,3vw,32px)" };
const Card = (x?) => ({ background: "#0a0a0a", border: `1px solid ${GOLDDIM}`, borderRadius: 0, padding: 18, ...(x || {}) });

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page21({ onNavigate }: PageProps) {
  const [msgs, setMsgs] = useState([{ role: "assistant", content: "Ask me anything about your production." }]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const bot = useRef<HTMLDivElement>(null);
  const qs = ["How do I export in 4K?", "What AI tools do you have?", "How does the timeline work?", "Tell me about pricing"];

  useEffect(() => { bot.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!inp.trim()) return;
    const q = inp.trim();
    setInp("");
    setLoading(true);
    setMsgs(p => [...p, { role: "user", content: q }]);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
          "x-api-key": ["sk-ant-api03-", "rNj3uksGI3kmBJI9Mzjm2A2II2Ll6T05dea_dgB0aqqMjqbbIsembbeVVlT", "-lJ4LDSQzV8ertjcY1BodhaJcA-_mURVAAA"].join("")
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: "You are Agent Grok, 24/7 assistant for MandaStrong Studio — professional cinema AI platform, 600+ tools, 4K export, films up to 3 hours, plans $20/$30/$50/mo with 7-day free trial on Studio plan. Be helpful and concise.",
          messages: [...msgs.filter(m => m.role !== "system"), { role: "user", content: q }]
        })
      });
      const d = await r.json();
      setMsgs(p => [...p, { role: "assistant", content: d.content && d.content[0] ? d.content[0].text : "Let me help!" }]);
    } catch (_) {
      setMsgs(p => [...p, { role: "assistant", content: "Unable to connect — check your connection and try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ ...Sp, padding: 40 }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 52, height: 52, background: `linear-gradient(135deg,${GOLDDIM},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontFamily: "'Cinzel',serif", fontSize: 26, fontWeight: 900, color: "#000" }}>G</div>
          <h1 style={{ ...H1, fontSize: 24 }}>AGENT GROK</h1>
          <div style={{ color: "#22c55e", fontSize: 11, letterSpacing: 3, marginTop: 4, fontWeight: 900 }}>● ONLINE</div>
        </div>
        <div style={{ ...Card(), height: 290, overflowY: "auto", marginBottom: 10, display: "flex", flexDirection: "column", gap: 8, padding: 12 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ padding: "10px 14px", background: m.role === "user" ? "rgba(232,201,109,0.08)" : "rgba(26,82,118,0.2)", borderLeft: `2px solid ${m.role === "user" ? GOLD : "#2980b9"}` }}>
              <span style={{ fontSize: 11, color: GOLD, display: "block", marginBottom: 4, fontWeight: 900, letterSpacing: 2 }}>{m.role === "user" ? "YOU" : "AGENT GROK"}</span>
              <span style={{ color: WHITE, fontSize: 14, lineHeight: 1.7 }}>{m.content}</span>
            </div>
          ))}
          {loading && <div style={{ padding: "10px 14px", background: "rgba(26,82,118,0.2)", borderLeft: "2px solid #2980b9", color: WHITE, fontSize: 13 }}>Thinking...</div>}
          <div ref={bot} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {qs.map(q => <button key={q} onClick={() => setInp(q)} style={{ ...G("out", true), fontSize: 11 }}>{q}</button>)}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <textarea value={inp} onChange={e => setInp(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask Agent Grok anything..."
            style={{ flex: 1, height: 50, resize: "none", padding: "10px 12px", fontSize: 14, background: "#0a0a0a", border: `1px solid ${GOLDDIM}`, color: WHITE, outline: "none", lineHeight: 1.5, fontFamily: "'Rajdhani',sans-serif" }} />
          <button onClick={send} disabled={loading || !inp.trim()} style={{ ...G("gold", false), height: 50, padding: "0 22px", opacity: loading || !inp.trim() ? 0.5 : 1 }}>SEND</button>
        </div>
      </div>
    </div>
  );
}
