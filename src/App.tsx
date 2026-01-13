import { useState } from 'react';
import './App.css';

export default function App() {
  const [page, setPage] = useState('home');
  const [duration, setDuration] = useState(90);

  // Navigation without needing react-router-dom
  const goTo = (p: string) => { setPage(p); window.scrollTo(0, 0); };

  return (
    <div className="min-h-screen bg-black text-white font-black italic">
      
      {/* PAGE 1: SPLASH */}
      {page === 'home' && (
        <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
          <div className="ocean-video-container">
            <video autoPlay loop muted playsInline className="ocean-video">
              <source src="https://assets.mixkit.co/videos/preview/mixkit-ocean-waves-in-the-sunset-4119-large.mp4" type="video/mp4" />
            </video>
          </div>
          <h1 className="relative z-10 text-6xl md:text-9xl mb-8 text-center">MANDASTRONG STUDIO</h1>
          <button onClick={() => goTo('pricing')} className="relative z-10 border-4 border-purple-600 px-16 py-4 text-3xl hover:bg-purple-600 transition-all">GET STARTED</button>
        </div>
      )}

      {/* PAGE 3: PRICING ($20, $40, $80) */}
      {page === 'pricing' && (
        <div className="p-10 text-center">
          <h2 className="text-6xl mb-16 underline decoration-purple-600 uppercase">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="border-4 border-purple-600 p-10">
              <h3 className="text-4xl">BASIC</h3>
              <div className="text-6xl my-6 text-purple-500">$20</div>
              <button onClick={() => goTo('editor')} className="w-full bg-purple-600 py-4 text-2xl font-bold">SELECT</button>
            </div>
            <div className="border-8 border-white p-10 bg-purple-600">
              <h3 className="text-4xl text-black">PRO</h3>
              <div className="text-6xl my-6 text-white">$40</div>
              <button onClick={() => goTo('editor')} className="w-full bg-black py-4 text-2xl font-bold">SELECT</button>
            </div>
            <div className="border-4 border-purple-600 p-10">
              <h3 className="text-4xl">STUDIO</h3>
              <div className="text-6xl my-6 text-purple-500">$80</div>
              <button onClick={() => goTo('editor')} className="w-full bg-purple-600 py-4 text-2xl font-bold">SELECT</button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 11: EDITOR SUITE */}
      {page === 'editor' && (
        <div className="p-8">
          <div className="flex justify-between items-center mb-10 border-l-8 border-purple-600 pl-4">
            <h2 className="text-5xl uppercase">Editor Suite</h2>
            <button onClick={() => goTo('media')} className="bg-white text-black px-10 py-3 font-bold uppercase hover:bg-purple-600 hover:text-white text-xl">Media Library</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 border-4 border-purple-600 p-6 bg-zinc-900">
              <div className="aspect-video bg-black mb-6 flex items-center justify-center border-2 border-zinc-700">
                <span className="text-4xl opacity-50">VIDEO PREVIEW</span>
              </div>
            </div>
            <div className="border-4 border-purple-600 p-6 bg-black">
              <h3 className="text-2xl mb-6 underline decoration-purple-600 uppercase">Tools</h3>
              {['CUT', 'TRIM', 'SPLIT', 'FX'].map(t => (
                <button key={t} className="w-full border-2 border-purple-600 mb-4 py-3">{t}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MEDIA LIBRARY PAGE (WITH BUTTON TOP RIGHT) */}
      {page === 'media' && (
        <div className="p-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-5xl border-l-8 border-purple-600 pl-4 uppercase">Media Library</h2>
            <div className="flex gap-4">
               <button onClick={() => goTo('enhancement-editor')} className="bg-purple-600 border-4 border-white px-8 py-3 text-xl font-bold uppercase">
                 Open Enhancement Editor
               </button>
               <button onClick={() => goTo('editor')} className="border-2 border-white px-8 py-3 text-xl font-bold uppercase">BACK</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square bg-zinc-900 border-2 border-purple-600 flex items-center justify-center text-7xl">📁</div>
            ))}
          </div>
        </div>
      )}

      {/* ENHANCEMENT EDITOR (180-MIN SLIDER) */}
      {page === 'enhancement-editor' && (
        <div className="p-10 max-w-6xl mx-auto text-center">
          <h2 className="text-6xl mb-12 text-purple-600 uppercase underline decoration-white font-black italic">Enhancement Editor</h2>
          <div className="border-4 border-purple-600 p-12 bg-zinc-950 flex flex-col justify-center text-center">
            <h3 className="text-3xl mb-4 uppercase">Duration Enhancement</h3>
            <div className="text-9xl text-purple-600 mb-8 font-black">{duration} <span className="text-3xl text-white">MIN</span></div>
            <input 
              type="range" min="0" max="180" value={duration} 
              onChange={(e) => setDuration(parseInt(e.target.value))} 
              className="w-full h-10 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between mt-6 text-xl font-bold opacity-50 uppercase">
              <span>0 MIN</span>
              <span>180 MIN Limit</span>
            </div>
          </div>
          <button onClick={() => goTo('media')} className="mt-10 text-2xl border-4 border-white px-20 py-5 hover:bg-white hover:text-black transition-all uppercase font-bold">Exit</button>
        </div>
      )}
    </div>
  );
}