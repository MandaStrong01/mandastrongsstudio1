import React, { useState, useEffect, Suspense, lazy } from 'react';

// This Fixes the White Screen by pointing directly to your source files
const PageProjector = ({ pageNumber }: { pageNumber: number }) => {
  const fileName = pageNumber === 21 ? 'Page21st' : `Page${pageNumber}`;
  
  // Dynamic import with error boundary to prevent crashing
  const PageComponent = lazy(() => 
    import(`./${fileName}.tsx`).catch(() => {
      console.error(`Missing: ${fileName}.tsx`);
      return import('./Page1.tsx'); // Fallback to Page 1 if a file is missing
    })
  );
  
  return (
    <Suspense fallback={<div style={{ color: '#8a2be2', textAlign: 'center', paddingTop: '30vh', fontSize: '2rem', fontWeight: 'bold' }}>LOADING STUDIO...</div>}>
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
      <div style={{ position: 'fixed', top: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: '35px', padding: '15px 0', background: 'rgba(10,10,10,0.98)', zIndex: 1000, borderBottom: '2px solid #8a2be2' }}>
        <button onClick={back} style={{ background: '#8a2be2', color: 'white', border: 'none', padding: '12px 35px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>BACK</button>
        <div style={{ alignSelf: 'center', color: '#8a2be2', fontWeight: 'bold', letterSpacing: '2px' }}>PAGE {page} / 21</div>
        <button onClick={next} style={{ background: '#8a2be2', color: 'white', border: 'none', padding: '12px 35px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>NEXT</button>
      </div>

      <div style={{ paddingTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '1400px' }}>
          
          <PageProjector pageNumber={page} />

          {/* PAGE 3: PRICING ACTIVATION */}
          {page === 3 && (
            <div style={{ position: 'absolute', bottom: '10%', width: '100%', display: 'flex', justifyContent: 'center', gap: '20px', zIndex: 50 }}>
              <a href="https://buy.stripe.com/14A00l8NQ0oTbVd3HYafS01" target="_blank" rel="noreferrer">
                <div style={{ background: '#111', border: '2px solid #8a2be2', padding: '15px 30px', borderRadius: '12px', color: 'white', fontWeight: '900' }}>$20 Monthly</div>
              </a>
              <a href="https://buy.stripe.com/4gM5kFaVYfjN7EX0vMafS00" target="_blank" rel="noreferrer">
                <div style={{ background: '#111', border: '2px solid #ff00ff', padding: '15px 30px', borderRadius: '12px', color: 'white', fontWeight: '900', transform: 'scale(1.1)' }}>$30 Monthly</div>
              </a>
              <div style={{ background: '#111', border: '2px solid #00ffff', padding: '15px 30px', borderRadius: '12px', color: 'white', fontWeight: '900' }}>$50 Monthly</div>
            </div>
          )}

          {/* PAGE 10: EDITOR'S CHOICE & ADMIN BUTTON */}
          {page === 10 && (
            <div style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <h1 style={{ color: '#8a2be2', fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px' }}>EDITOR'S CHOICE</h1>
               <div style={{ border: '2px dashed #333', padding: '80px', borderRadius: '25px', textAlign: 'center' }}>
                  <button style={{ background: '#8a2be2', color: 'white', padding: '18px 45px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>UPLOAD (ADMIN ONLY)</button>
               </div>
            </div>
          )}

          {/* PAGE 11: ENHANCEMENT STUDIO */}
          {page === 11 && (
            <div style={{ position: 'absolute', top: '15%', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 50 }}>
               <button onClick={() => setShowStudio(true)} style={{ background: 'linear-gradient(45deg, #ff00ff, #8a2be2)', color: 'white', padding: '20px 50px', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>OPEN ENHANCEMENT STUDIO</button>
            </div>
          )}
        </div>
      </div>

      {/* ENHANCEMENT STUDIO MODAL */}
      {showStudio && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.99)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0a0a0a', border: '4px solid #8a2be2', borderRadius: '45px', padding: '60px', width: '90%', maxWidth: '850px', textAlign: 'center' }}>
            <h2 style={{ color: '#8a2be2', fontSize: '2.5rem', fontWeight: '900' }}>ENHANCEMENT STUDIO</h2>
            <p style={{ fontSize: '10rem', fontWeight: '900', color: '#8a2be2', margin: '20px 0' }}>{mins}<span style={{fontSize: '2rem'}}>m</span></p>
            <input type="range" min="0" max="180" value={mins} onChange={(e) => setMins(Number(e.target.value))} style={{ width: '100%', accentColor: '#8a2be2' }} />
            <button onClick={() => setShowStudio(false)} style={{ marginTop: '40px', background: '#8a2be2', color: 'white', padding: '15px 60px', borderRadius: '15px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>CLOSE STUDIO</button>
          </div>
        </div>
      )}

      <footer style={{ background: '#050505', padding: '60px 0', textAlign: 'center', borderTop: '2px solid #8a2be2', marginTop: '100px', color: '#8a2be2' }}>
        <p style={{ fontWeight: '900' }}>MANDASTRONG1 2025 ~ AUTHOR OF "DOXY THE SCHOOL BULLY"</p>
      </footer>
    </div>
  );
}