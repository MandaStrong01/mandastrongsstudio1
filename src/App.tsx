"use client";
import React, { useEffect, useRef } from 'react';

export default function MandaStrongStudio() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        console.log("Click anywhere to enable background sound.");
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      
      {/* BACKGROUND: Ocean video with sound (Page 1-2) */}
      <div className="fixed inset-0 z-0">
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-70"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
      </div>

      {/* HEADER & TAGLINE: Bold black cinematic style */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="font-black uppercase tracking-tighter text-black bg-white px-6 py-3 text-6xl md:text-8xl shadow-2xl mb-4">
          MandaStrong Studio
        </h1>
        <p className="font-bold italic text-black bg-white px-4 py-1 text-xl md:text-3xl">
          An All In One Make A Movie App!
        </p>
        
        {/* BUTTONS: Black background with white text */}
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          <button className="bg-black text-white border-2 border-white px-10 py-4 font-black uppercase tracking-widest hover:bg-[#39FF14] hover:text-black hover:border-[#39FF14] transition-all duration-300">
            Next
          </button>
          <button className="bg-black text-white border-2 border-white px-10 py-4 font-black uppercase tracking-widest hover:bg-[#39FF14] hover:text-black hover:border-[#39FF14] transition-all duration-300">
            Login
          </button>
          <button className="bg-black text-white border-2 border-white px-10 py-4 font-black uppercase tracking-widest hover:bg-[#39FF14] hover:text-black hover:border-[#39FF14] transition-all duration-300">
            Register
          </button>
        </div>
      </div>

      {/* OVAL AVATAR: Bottom-right with white play button (Page 1) */}
      <div className="fixed bottom-10 right-10 w-48 h-32 md:w-64 md:h-40 rounded-[50%] overflow-hidden border-4 border-white shadow-2xl z-50 group cursor-pointer">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/avatar.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
            <div className="ml-1 w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-black border-b-[12px] border-b-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}