import { Film, ArrowLeft, ArrowRight } from 'lucide-react';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page10({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-12 h-12 text-red-500" />
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              DOXY: THE SCHOOL BULLY
            </h1>
          </div>
          <p className="text-xl text-slate-400 italic">
            Your completed film is now live!
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-8">
          <div className="aspect-video bg-black rounded-lg overflow-hidden border border-white/20">
            <video
              controls
              className="w-full h-full"
              poster="/static/video/doxy-poster.jpg"
            >
              <source src="/static/video/packageDTSBexpscript.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="mt-6 p-4 bg-black/50 rounded-lg border border-white/10">
            <h3 className="font-bold text-lg mb-2">About This Film</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Experience the powerful story of Doxy, a young student navigating the challenges
              of school bullying. This film explores themes of courage, friendship, and standing
              up for what's right. Free to watch - no payment required.
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(9)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => onNavigate(11)}
            className="flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-slate-200 transition-all"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
