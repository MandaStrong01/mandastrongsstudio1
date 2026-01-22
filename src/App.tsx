import React, { useState } from 'react';

export default function App() {
  const [page, setPage] = useState(1);
  const [mins, setMins] = useState(90);

  // Precise navigation logic
  const goNext = () => { if (page < 21) setPage(p => p + 1); window.scrollTo(0,0); };
  const goBack = () => { if (page > 1) setPage(p => p - 1); window.scrollTo(0,0); };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', fontStyle: 'italic', fontWeight: 900 }}>
      
      {/* 1. THE BACKGROUND VIDEO (Fixed to fill screen) */}
      <video autoPlay loop muted playsInline style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.6 }}>
        <source src="/backup.mp4 (2)" type="video/mp4" />
      </video>

      {/* 2. THE HEADER (Purple Border Design) */}
      <div style={{ position: 'sticky', top: 0, width: '100%', background: '#050505', padding: '15px', textAlign: 'center', borderBottom: '3px solid #8a2be2', zIndex: 100, display: 'flex', justifyContent: 'center', gap: '30px' }}>
        <button onClick={goBack} style={{ background: '#8a2be2', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>BACK</button>
        <button onClick={goNext} style={{ background: '#8a2be2', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>NEXT</button>
      </div>

      {/* 3. THE 21 IMAGES (Recreating the App Exactly) */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <img 
          src={`/image${page}.png`} 
          style={{ width: '100%', maxWidth: '1200px', display: 'block' }} 
          alt={`Studio Page ${page}`} 
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />

        {/* PAGE 13: THE FUNCTIONAL ENHANCEMENT SLIDER */}
        {page === 13 && (
          <div style={{ position: 'absolute', top: '55%', width: '100%', textAlign: 'center', zIndex: 50, background: 'rgba(0,0,0,0.7)', padding: '20px' }}>
            <div style={{ fontSize: '10vw', color: '#8a2be2', textShadow: '4px 4px 10px #000' }}>{mins} MIN</div>
            <input 
              type="range" min="0" max="180" value={mins} 
              style={{ width: '80%', cursor: 'pointer', accentColor: '#8a2be2' }}
              onChange={(e) => setMins(Number(e.target.value))} 
            />
          </div>
        )}
      </div>

      {/* 4. THE FOOTER */}
      <div style={{ background: '#050505', padding: '30px', textAlign: 'center', borderTop: '3px solid #8a2be2', position: 'relative', zIndex: 100, marginTop: '50px' }}>
        MANDASTRONG1 2025 ~ AUTHOR OF "DOXY THE SCHOOL BULLY"
      </div>
    </div>
  );
}