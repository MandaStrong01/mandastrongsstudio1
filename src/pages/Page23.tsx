import BatchUpload from '../components/BatchUpload';
import { ArrowLeft } from 'lucide-react';

interface Page23Props {
  onNavigate: (page: number) => void;
}

export default function Page23({ onNavigate }: Page23Props) {
  return (
    <div className="relative">
      <button
        onClick={() => onNavigate(3)}
        className="absolute top-8 left-8 z-10 flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-xl hover:bg-white/20 transition-all border border-white/20"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to AI Tools
      </button>
      <BatchUpload />
    </div>
  );
}
