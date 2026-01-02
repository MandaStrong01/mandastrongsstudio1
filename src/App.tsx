import { useState } from "react";
import Page11 from "./pages/Page11";

const Page = ({ title }: { title: string }) => (
  <div style={{ padding: 40 }}>
    <h1 style={{ color: "#b388ff" }}>{title}</h1>
    <p>MandaStrong Studios 2025</p>
  </div>
);

export default function App() {
  const [page, setPage] = useState<number>(1);

  return (
    <div style={{ minHeight: "100vh", background: "#0b0618", color: "white" }}>
      
      {/* TOP RIGHT MENU */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          display: "grid",
          gridTemplateColumns: "repeat(4, auto)",
          gap: 8,
          zIndex: 1000,
        }}
      >
        {Array.from({ length: 21 }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            style={{
              background: page === i + 1 ? "#b388ff" : "#1c1238",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* PAGE CONTENT */}
      <div style={{ paddingTop: 80 }}>
        {page === 1 && <Page title="Page 1 – Welcome / Background Video" />}
        {page === 2 && <Page title="Page 2 – Getting Started" />}
        {page === 3 && <Page title="Page 3 – Tool Board" />}
        {page === 4 && <Page title="Page 4 – Script Tools" />}
        {page === 5 && <Page title="Page 5 – Storyboards" />}
        {page === 6 && <Page title="Page 6 – Scene Builder" />}
        {page === 7 && <Page title="Page 7 – Character Creator" />}
        {page === 8 && <Page title="Page 8 – Audio Tools" />}
        {page === 9 && <Page title="Page 9 – Video Tools" />}
        {page === 10 && <Page title="Page 10 – Upload Doxy Movie" />}
        {page === 11 && <Page11 />}
        {page === 12 && <Page title="Page 12 – Timeline Editor" />}
        {page === 13 && <Page title="Page 13 – Effects & Transitions" />}
        {page === 14 && <Page title="Page 14 – Music & Sound" />}
        {page === 15 && <Page title="Page 15 – Voice & Lip Sync" />}
        {page === 16 && <Page title="Page 16 – Legal / Disclaimers" />}
        {page === 17 && <Page title="Page 17 – Terms & Safety" />}
        {page === 18 && <Page title="Page 18 – Community Hub" />}
        {page === 19 && <Page title="Page 19 – Projects" />}
        {page === 20 && <Page title="Page 20 – Export Movie" />}
        {page === 21 && <Page title="Page 21 – Video Demo / User Guide" />}
      </div>

      {/* FOOTER (from Page 3 onward visually) */}
      {page >= 3 && (
        <footer
          style={{
            marginTop: 120,
            padding: 20,
            textAlign: "center",
            color: "#777",
          }}
        >
          © 2025 MandaStrong Studios
        </footer>
      )}
    </div>
  );
}
