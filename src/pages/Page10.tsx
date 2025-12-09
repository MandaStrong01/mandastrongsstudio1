import { ArrowLeft, ArrowRight, Play, Pause, SkipBack, SkipForward, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import Footer from '../components/Footer';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page10({ onNavigate }: PageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full">
          <h1 className="text-4xl font-black text-purple-400 mb-6 text-center">DOXY THE SCHOOL BULLY</h1>

          <div className="mb-6 text-center">
            <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-semibold transition-all">
              <Upload className="w-5 h-5" />
              upload
            </button>
          </div>

          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 mb-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden border border-purple-500/30 mb-4">
              <video
                ref={videoRef}
                className="w-full h-full"
                src="/static/video/packageDTSBexpscript.mp4"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={skipBackward}
                className="p-3 bg-purple-900/50 hover:bg-purple-900/70 rounded-lg transition-all border border-purple-500/30"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={togglePlay}
                className="p-4 bg-purple-600 hover:bg-purple-500 rounded-lg transition-all"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>

              <button
                onClick={skipForward}
                className="p-3 bg-purple-900/50 hover:bg-purple-900/70 rounded-lg transition-all border border-purple-500/30"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate(9)}
              className="flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-900 transition-all border border-purple-500"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => onNavigate(11)}
              className="flex items-center gap-2 bg-purple-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-500 transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
