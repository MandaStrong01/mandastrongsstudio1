import React, { useState, useEffect, Suspense, lazy } from 'react';

// Dynamic Loader to prevent "Blank Screen" by fetching your .tsx pages correctly
const PageProjector = ({ pageNumber }: { pageNumber: number }) => {
  const fileName = pageNumber === 21 ? 'Page21st' : `Page${pageNumber}`;
  const PageComponent = lazy(() => import(`./${fileName}.tsx`).catch(() => import('./Page1.tsx')));
  
  return (
    <Suspense fallback={<div style={{ color: '#8a2be2', textAlign: 'center', paddingTop: '20vh' }}>LOADING STUDIO...</div>}>
      <PageComponent />
    </Suspense>
  );
};

export default function App() {
  const [page, setPage] = useState(1);
  const [mins, setMins] = useState(90);
  const [showStudio, setShowStudio] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const next = () => { if (page < 21) setPage(p => p + 1); };
  const back = () => { if (page > 1) setPage(p => p - 1); };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      
      {/* 1. MASTER NAVIGATION */}
      <div style={{ position: 'fixed', top: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: '35px', padding: '15px 0', background: 'rgba(5,5,5,0.98)', zIndex: 1000, borderBottom: '2px solid #8a2be2' }}>
        <button onClick={back} style={{ background: '#8a2be2', color: 'white', border: 'none', padding: '12px 35px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>BACK</button>
        <div style={{ alignSelf: 'center', color: '#8a2be2', fontWeight: 'bold' }}>PAGE {page} / 21</div>
        <button onClick={next} style={{ background: '#8a2be2', color: 'white', border: 'none', padding: '12px 35px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>NEXT</button>
      </div>

      <div style={{ paddingTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '1400px' }}>
          
          {/* THE WORKING DESIGN FROM YOUR PROJECT */}
          <PageProjector pageNumber={page} />

          {/* PAGE 3: OVERLAY STRIPE PLANS ($20, $30, $50) */}
          {page === 3 && (
            <div style={{ position: 'absolute', bottom: '10%', width: '100%', display: 'flex', justifyContent: 'center', gap: '20px', zIndex: 50 }}>
              <a href="https://buy.stripe.com/your_20_link" target="_blank" style={{ textDecoration: 'none' }}>
                <div style={{ background: '#111', border: '2px solid #8a2be2', padding: '18px 30px', borderRadius: '15px', color: 'white', fontWeight: '900' }}>$20 Monthly</div>
              </a>
              <a href="https://buy.stripe.com/your_30_link" target="_blank" style={{ textDecoration: 'none' }}>
                <div style={{ background: '#111', border: '2px solid #ff00ff', padding: '18px 30px', borderRadius: '15px', color: 'white', fontWeight: '900', transform: 'scale(1.1)' }}>$30 Monthly</div>
              </a>
              <a href="https://buy.stripe.com/your_50_link" target="_blank" style={{ textDecoration: 'none' }}>
                <div style={{ background: '#111', border: '2px solid #00ffff', padding: '18px 30px', borderRadius: '15px', color: 'white', fontWeight: '900' }}>$50 Monthly</div>
              </a>
            </div>
          )}

          {/* PAGE 11: ENHANCEMENT STUDIO TRIGGER */}
          {page === 11 && (
            <div style={{ position: 'absolute', top: '15%', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 50 }}>
               <button onClick={() => setShowStudio(true)} style={{ background: 'linear-gradient(45deg, #ff00ff, #8a2be2)', color: 'white', padding: '20px 50px', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>OPEN ENHANCEMENT STUDIO</button>
            </div>
          )}
        </div>
      </div>

      {/* ENHANCEMENT STUDIO SLIDER (0-180 MIN) */}
      {showStudio && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.99)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0a0a0a', border: '3px solid #8a2be2', borderRadius: '45px', padding: '60px', width: '90%', maxWidth: '850px', textAlign: 'center' }}>
            <h2 style={{ color: '#8a2be2', fontSize: '2.5rem', fontWeight: '900' }}>ENHANCEMENT STUDIO</h2>
            <p style={{ fontSize: '10rem', fontWeight: '900', color: '#8a2be2', margin: '20px 0' }}>{mins}<span style={{fontSize: '2rem'}}>m</span></p>
            <input 
              type="range" min="0" max="180" value={mins} 
              onChange={(e) => setMins(Number(e.target.value))} 
              style={{ width: '100%', accentColor: '#8a2be2', cursor: 'pointer', height: '25px' }} 
            />
            <button onClick={() => setShowStudio(false)} style={{ marginTop: '50px', background: '#8a2be2', color: 'white', padding: '15px 60px', borderRadius: '15px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>CLOSE STUDIO</button>
          </div>
        </div>
      )}

      <footer style={{ background: '#050505', padding: '50px 0', textAlign: 'center', borderTop: '2px solid #8a2be2', marginTop: '100px', color: '#8a2be2' }}>
        <p style={{ fontWeight: '900' }}>MANDASTRONG1 2025 ~ AUTHOR OF "DOXY THE SCHOOL BULLY"</p>
      </footer>
    </div>
  );
}