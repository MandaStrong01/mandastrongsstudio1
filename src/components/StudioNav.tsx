import { Folder, Wand2, Video, Image, Upload } from 'lucide-react';

interface StudioNavProps {
  activeView: 'projects' | 'ai-tools' | 'editor' | 'assets';
  onViewChange: (view: 'projects' | 'ai-tools' | 'editor' | 'assets') => void;
}

export default function StudioNav({ activeView, onViewChange }: StudioNavProps) {
  const navItems = [
    { id: 'projects' as const, label: 'My Projects', icon: Folder },
    { id: 'ai-tools' as const, label: 'AI Tools', icon: Wand2 },
    { id: 'editor' as const, label: 'Video Editor', icon: Video },
    { id: 'assets' as const, label: 'Asset Library', icon: Image },
  ];

  return (
    <nav className="bg-black/30 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all ${
                  isActive
                    ? 'border-blue-400 text-blue-400 bg-blue-500/10'
                    : 'border-transparent text-white/60 hover:text-white/90 hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
