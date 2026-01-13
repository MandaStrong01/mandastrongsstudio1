import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

interface User { id: number; email: string; subscription?: string; }

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [duration, setDuration] = useState(90);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-black italic">
        <Routes>
          {/* PAGE 1: SPLASH */}
          <Route path="/" element={
            <div className="relative h-screen flex flex-col items-center justify-center">
              <div className="ocean-video-container">
                <video autoPlay loop muted className="ocean-video">
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-ocean-waves-in-the-sunset-4119-large.mp4" />
                </video>
              </div>
              <h1 className="relative z-10 text-6xl md:text-8xl mb-4">MANDASTRONG STUDIO</h1>
              <div className="relative z-10 flex gap-4">
                <Link to="/login" className="border-2 border-purple-600 px-8 py-2 hover:bg-purple-600">LOGIN</Link>
                <Link to="/register" className="border-2 border-purple-600 px-8 py-2 hover:bg-purple-600">GET STARTED</Link>
              </div>
            </div>
          } />

          {/* PAGE 3: UPDATED PRICING */}
          <Route path="/pricing" element={
            <div className="p-10 text-center">
              <h2 className="text-5xl mb-12">CHOOSE YOUR PLAN</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="border-2 border-purple-600 p-8">
                  <h3 className="text-3xl">BONUS</h3>
                  <div className="text-4xl my-4">$10</div>
                  <button className="w-full bg-purple-600 py-2">SELECT</button>
                </div>
                <div className="border-2 border-white p-8 bg-purple-600">
                  <h3 className="text-3xl">PRO</h3>
                  <div className="text-4xl my-4">$20</div>
                  <button className="w-full bg-black py-2">SELECT</button>
                </div>
                <div className="border-2 border-purple-600 p-8">
                  <h3 className="text-3xl">STUDIO</h3>
                  <div className="text-4xl my-4">$30</div>
                  <button className="w-full bg-purple-600 py-2">SELECT</button>
                </div>
              </div>
              <Link to="/editor" className="mt-12 inline-block text-purple-600">CONTINUE TO STUDIO →</Link>
            </div>
          } />

          {/* PAGE 11: EDITOR SUITE WITH ENHANCEMENT BUTTON */}
          <Route path="/editor" element={
            <div className="p-6">
              <h2 className="text-4xl mb-6">EDITOR SUITE</h2>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 border-2 border-purple-600 p-4">
                  <div className="aspect-video bg-gray-900 mb-4 flex items-center justify-center">PREVIEW</div>
                  <div className="flex flex-wrap gap-4">
                    <button className="border-2 border-purple-600 px-4 py-2">TIMELINE</button>
                    <button className="border-2 border-purple-600 px-4 py-2">MEDIA</button>
                    {/* NEW ENHANCEMENT BUTTON */}
                    <Link to="/enhancements" className="bg-purple-600 px-4 py-2 text-white">OPEN ENHANCEMENT STUDIO</Link>
                  </div>
                </div>
                <div className="border-2 border-purple-600 p-4">
                  <h3 className="mb-4">QUICK TOOLS</h3>
                  <button className="w-full border border-purple-600 mb-2 py-1">CUT</button>
                  <button className="w-full border border-purple-600 mb-2 py-1">TRIM</button>
                </div>
              </div>
            </div>
          } />

          {/* PAGE 13: 180-MINUTE DURATION SLIDER */}
          <Route path="/timeline" element={
            <div className="p-10 max-w-4xl mx-auto">
              <h2 className="text-4xl mb-8">TIMELINE PREVIEW</h2>
              <div className="bg-gray-900 h-64 border-2 border-purple-600 flex items-center justify-center mb-8">
                <span className="text-6xl text-purple-600">▶</span>
              </div>
              <div className="border-2 border-purple-600 p-6 text-center">
                <h3 className="text-xl mb-4">MOVIE DURATION</h3>
                <div className="text-5xl text-purple-600 mb-4">{duration} MINUTES</div>
                <input 
                  type="range" min="0" max="180" value={duration} 
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full h-4 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span>0 MIN</span>
                  <span>180 MIN</span>
                </div>
              </div>
            </div>
          } />

          <Route path="/enhancements" element={<div className="p-20 text-center text-4xl">ALL ENHANCEMENTS YOU WILL EVER NEED LOADED</div>} />
          <Route path="/login" element={<div className="p-20 text-center">LOGIN PAGE</div>} />
          <Route path="/register" element={<div className="p-20 text-center">REGISTER PAGE</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;