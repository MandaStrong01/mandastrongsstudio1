import { useState } from 'react';
import { CreditCard, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page3({ onNavigate }: PageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        onNavigate(4);
      } else {
        await signUp(email, password);
        onNavigate(4);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const openStripeLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl">
        <h1 className="text-5xl md:text-6xl font-black text-center mb-12 tracking-tight">
          LOGIN / REGISTER / CHOOSE PLAN
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                  isLogin
                    ? 'bg-white text-black'
                    : 'bg-black/30 text-white/60 hover:text-white'
                }`}
              >
                <LogIn className="w-5 h-5 inline mr-2" />
                LOGIN
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                  !isLogin
                    ? 'bg-white text-black'
                    : 'bg-black/30 text-white/60 hover:text-white'
                }`}
              >
                <UserPlus className="w-5 h-5 inline mr-2" />
                REGISTER
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50"
              />
              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                {loading ? 'Please wait...' : isLogin ? 'LOGIN' : 'REGISTER'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              <p>Test Account:</p>
              <p className="font-mono">test@mandastrong.com / Test1234</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Subscription Plans</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => openStripeLink('https://buy.stripe.com/fZubJ35BE3B53oH00')}
                className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold py-4 px-6 rounded-lg transition-all text-left"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl">BASIC</span>
                  <span className="text-2xl">$10</span>
                </div>
                <p className="text-sm text-slate-300 mt-1">Essential features for beginners</p>
              </button>

              <button
                onClick={() => openStripeLink('https://buy.stripe.com/14A00l8NQ0oT01')}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all text-left"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl">PRO</span>
                  <span className="text-2xl">$20</span>
                </div>
                <p className="text-sm text-blue-200 mt-1">Advanced tools for professionals</p>
              </button>

              <button
                onClick={() => openStripeLink('https://buy.stripe.com/4gM5kFaVY02')}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold py-4 px-6 rounded-lg transition-all text-left"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl">STUDIO</span>
                  <span className="text-2xl">$30</span>
                </div>
                <p className="text-sm text-yellow-900 mt-1">Complete studio experience</p>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => onNavigate(2)}
            className="bg-black/50 backdrop-blur-sm text-white font-bold px-10 py-4 rounded-lg text-lg hover:bg-black/70 transition-all border border-white/30"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
