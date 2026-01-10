import React, { useState } from 'react';
import { Scissors, CheckCircle, X, Play, Settings } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState(1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [duration, setDuration] = useState(10);

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', fontWeight: '900', fontStyle: 'italic' }}>
      
      {/* PAGE 1 */}
      {page === 1 && (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '5rem', margin: 0 }}>MANDASTRONG STUDIO</h1>
          <button onClick={() => setPage(3)} style={{ marginTop: '20px', padding: '20px 40px', fontSize: '1.5rem', cursor: 'pointer', borderRadius: '10px' }}>ENTER STUDIO</button>
        </div>
      )}

      {/* PAGE 3: PRICING */}
      {page === 3 && (
        <div style={{ padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '40px' }}>SELECT PLAN</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%', maxWidth: '1000px' }}>
            {[{t:"BASIC", p:"20"}, {t:"PRO", p:"40"}, {t:"STUDIO", p:"80"}].map((plan) => (
              <div key={plan.t} style={{ background: '#111', padding: '40px', borderRadius: '20px', textAlign: 'center', border: '1px solid #333' }}>
                <div style={{ fontSize: '5rem', marginBottom: '20px' }}>${plan.p}</div>
                <button onClick={() => setPage(11)} style={{ width: '100%', padding: '15px', fontWeight: 'bold', cursor: 'pointer' }}>SELECT</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 11: MEDIA + ATTACHMENT */}
      {page === 11 && (
        <div style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '3rem' }}>MEDIA LIBRARY</h2>
            <button onClick={() => setIsEditorOpen(true)} style={{ background: '#00ffff', color: 'black', padding: '15px 30px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
              OPEN VIDEO EDITOR
            </button>
          </div>

          {isEditorOpen && (
            <div style={{ position: 'fixed', inset: 0, background: 'black', padding: '40px', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '4rem', color: '#00ffff' }}>ADVANCED ENHANCER</h2>
                <button onClick={() => setIsEditorOpen(false)} style={{ background: '#222', color: 'white', padding: '20px', borderRadius: '50%', cursor: 'pointer' }}>X</button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '40px' }}>
                <div style={{ background: '#111', padding: '40px', borderRadius: '30px' }}>
                  <div style={{ marginBottom: '40px' }}>
                    <p>AUDIO GAIN: {volume}%</p>
                    <input type="range" min="0" max="200" value={volume} onChange={(e)=>setVolume(parseInt(e.target.value))} style={{ width: '100%' }} />
                  </div>
                  <div style={{ marginBottom: '40px' }}>
                    <p>DURATION: {duration}m (0-180)</p>
                    <input type="range" min="0" max="180" value={duration} onChange={(e)=>setDuration(parseInt(e.target.value))} style={{ width: '100%' }} />
                  </div>
                </div>
                <div style={{ background: '#111', borderRadius: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={100} color="#00ffff" style={{ opacity: 0.3, marginBottom: '20px' }} />
                  <button style={{ padding: '20px 40px', fontSize: '1.5rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer' }}>FINALIZE EXPORT</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}