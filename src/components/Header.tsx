import { Film, LogOut, User, Crown, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onShowAuth?: () => void;
  onShowAdmin?: () => void;
}

export default function Header({ onShowAuth, onShowAdmin }: HeaderProps) {
  const { user, signOut, isAdmin, subscription } = useAuth();

  return (
    <header className="bg-black/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Film className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Manda Strong Studio
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {isAdmin && (
                <button
                  onClick={onShowAdmin}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors font-bold border border-yellow-500/30"
                >
                  <Crown className="w-4 h-4" />
                  Admin Panel
                </button>
              )}
              {subscription && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-xs font-bold">
                  <Star className="w-4 h-4" />
                  {subscription.tier}
                </div>
              )}
              <div className="flex items-center gap-2 text-white/70">
                <User className="w-5 h-5" />
                <span className="text-sm">{user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={onShowAuth}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
