import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PageProps {
  onNavigate: (page: number) => void;
  pageNumber: number;
  title: string;
  description?: string;
}

export default function PageTemplate({ onNavigate, pageNumber, title, description }: PageProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="text-xl md:text-2xl text-white mb-12">
            {description}
          </p>
        )}

        <div className="flex gap-4 justify-center mt-12">
          {pageNumber > 1 && (
            <button
              onClick={() => onNavigate(pageNumber - 1)}
              className="flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-900 transition-all border border-purple-500"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}
          {pageNumber < 21 && (
            <button
              onClick={() => onNavigate(pageNumber + 1)}
              className="flex items-center gap-2 bg-purple-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-500 transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
