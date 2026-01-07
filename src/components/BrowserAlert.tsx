import { useState, useEffect } from 'react';
import { AlertTriangle, X, Download } from 'lucide-react';
import { isFirefox, getBrowserName } from '../lib/browserDetection';

export default function BrowserAlert() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const hasBeenDismissed = localStorage.getItem('browser-alert-dismissed');
    if (!isFirefox() && !hasBeenDismissed) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
  };

  const handleDismissPermanently = () => {
    localStorage.setItem('browser-alert-dismissed', 'true');
    setShow(false);
    setDismissed(true);
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-orange-500/50 rounded-3xl shadow-2xl max-w-lg w-full p-10 relative animate-in zoom-in-95 fade-in duration-500">
        <button
          onClick={handleDismiss}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center border-2 border-orange-500/50">
            <AlertTriangle className="w-10 h-10 text-orange-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic text-white tracking-tighter">Browser Alert</h2>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Performance Optimization</p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <p className="text-white/90 text-lg font-bold italic">
            You're using <span className="font-black text-orange-400 uppercase">{getBrowserName()}</span>.
          </p>

          <p className="text-white/80 font-medium">
            MandaStrong Studio's proprietary engine is optimized for <span className="font-black text-purple-400">Firefox</span> to ensure maximum performance with our 600+ AI modules and neural rendering system.
          </p>

          <div className="bg-purple-900/20 border-2 border-purple-500/30 rounded-2xl p-6">
            <h3 className="text-purple-400 font-black uppercase text-sm mb-3 flex items-center gap-2 tracking-widest">
              <Download className="w-5 h-5" />
              Firefox Advantages
            </h3>
            <ul className="text-zinc-400 text-sm space-y-2 ml-7 font-medium">
              <li>• Superior video codec support (VP9, AV1, H.264)</li>
              <li>• Enhanced WebAssembly performance</li>
              <li>• Optimized neural processing</li>
              <li>• 4K rendering stability</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="https://www.mozilla.org/firefox/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-8 py-4 bg-purple-600 hover:bg-white hover:text-black text-white rounded-2xl font-black uppercase text-sm text-center transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            <Download className="w-5 h-5" />
            Download Firefox
          </a>

          <button
            onClick={handleDismiss}
            className="w-full px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black uppercase text-xs transition-all"
          >
            Continue with {getBrowserName()}
          </button>

          <button
            onClick={handleDismissPermanently}
            className="text-zinc-600 hover:text-zinc-400 text-xs font-black uppercase tracking-widest transition-colors"
          >
            Don't Show Again
          </button>
        </div>
      </div>
    </div>
  );
}
