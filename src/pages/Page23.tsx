import BatchUpload from '../components/BatchUpload';
import { ArrowLeft, Play } from 'lucide-react';
import { useState } from 'react';

interface Page23Props {
  onNavigate: (page: number) => void;
}

export default function Page23({ onNavigate }: Page23Props) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20">
      <button
        onClick={() => onNavigate(3)}
        className="absolute top-8 left-8 z-10 flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-xl hover:bg-white/20 transition-all border border-white/20"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to AI Tools
      </button>
      <BatchUpload />

      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setShowVideo(!showVideo)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/50 transition-all"
        >
          <Play className="w-5 h-5" />
          {showVideo ? 'Hide' : 'Show'} Closing Video
        </button>
      </div>

      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
            >
              Close
            </button>
            <video
              className="w-full rounded-xl shadow-2xl"
              controls
              autoPlay
              src="/thatsallfolks.mp4"
              onError={(e) => {
                console.error('Video failed to load');
                alert('Video file not found. Please add thatsallfolks.mp4 to the public folder.');
              }}
            >
              Your browser does not support the video tag.
            </video>
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">That's All Folks!</h2>
              <p className="text-white/70">Thank you for using MandaStrong Movie Studio</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
