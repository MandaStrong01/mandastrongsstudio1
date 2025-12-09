import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page3({ onNavigate }: PageProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(loginEmail, loginPassword);
      onNavigate(4);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedPlan) {
      setError('Please select a plan to continue');
      return;
    }

    setLoading(true);

    try {
      await signUp(registerEmail, registerPassword);
      onNavigate(4);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const openStripeLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl">
        <h1 className="text-5xl md:text-6xl font-black text-center mb-12 tracking-tight">
          LOGIN / REGISTER / CHOOSE PLAN
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          <div className="bg-purple-900/20 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/50">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <LogIn className="w-6 h-6" />
              <h2 className="text-2xl font-bold">LOGIN</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-black border border-purple-500/50 text-white placeholder-white/60 focus:outline-none focus:border-purple-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-black border border-purple-500/50 text-white placeholder-white/60 focus:outline-none focus:border-purple-400"
              />
              {error && (
                <div className="text-white text-sm bg-purple-600/30 px-4 py-2 rounded-lg border border-purple-500">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-500 transition-all disabled:opacity-50"
              >
                {loading ? 'Please wait...' : 'LOGIN'}
              </button>
            </form>
          </div>

          <div className="bg-purple-900/20 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/50">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <UserPlus className="w-6 h-6" />
              <h2 className="text-2xl font-bold">REGISTER</h2>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-black border border-purple-500/50 text-white placeholder-white/60 focus:outline-none focus:border-purple-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-black border border-purple-500/50 text-white placeholder-white/60 focus:outline-none focus:border-purple-400"
              />
              <div>
                <label className="block text-sm font-bold mb-2 text-white/80">Select Plan *</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-black border border-purple-500/50 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="">Choose a plan...</option>
                  <option value="basic">BASIC - $10/month (30 min films)</option>
                  <option value="pro">PRO - $20/month (1 hour films)</option>
                  <option value="studio">STUDIO - $30/month (2.5 hour films)</option>
                </select>
              </div>
              {error && (
                <div className="text-white text-sm bg-purple-600/30 px-4 py-2 rounded-lg border border-purple-500">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-500 transition-all disabled:opacity-50"
              >
                {loading ? 'Please wait...' : 'REGISTER'}
              </button>
            </form>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-6">SUBSCRIPTION PLANS</h2>
          <p className="text-center text-white/70 mb-8">Choose the plan that fits your creative vision</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <button
            onClick={() => openStripeLink('https://buy.stripe.com/fZubJ35BE3B53oH00')}
            className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/50 hover:bg-purple-900/40 text-white font-bold py-6 px-6 rounded-2xl transition-all"
          >
            <div className="text-center">
              <div className="text-3xl font-black mb-2">BASIC</div>
              <div className="text-4xl font-black mb-2 text-purple-400">$10</div>
              <div className="text-lg font-semibold mb-2">30 Minutes</div>
              <p className="text-sm text-white/80">Perfect for short films, music videos, and quick creative projects</p>
            </div>
          </button>

          <button
            onClick={() => openStripeLink('https://buy.stripe.com/14A00l8NQ0oT01')}
            className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/50 hover:bg-purple-900/40 text-white font-bold py-6 px-6 rounded-2xl transition-all"
          >
            <div className="text-center">
              <div className="text-3xl font-black mb-2">PRO</div>
              <div className="text-4xl font-black mb-2 text-purple-400">$20</div>
              <div className="text-lg font-semibold mb-2">1 Hour</div>
              <p className="text-sm text-white/80">Ideal for standard documentaries, corporate videos, and feature-length content</p>
            </div>
          </button>

          <button
            onClick={() => openStripeLink('https://buy.stripe.com/4gM5kFaVY02')}
            className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/50 hover:bg-purple-900/40 text-white font-bold py-6 px-6 rounded-2xl transition-all"
          >
            <div className="text-center">
              <div className="text-3xl font-black mb-2">STUDIO</div>
              <div className="text-4xl font-black mb-2 text-purple-400">$30</div>
              <div className="text-lg font-semibold mb-2">2.5 Hours</div>
              <p className="text-sm text-white/80">Complete cinematic experience with full-length film capabilities and unlimited creative freedom</p>
            </div>
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => onNavigate(2)}
            className="bg-black text-white font-bold px-10 py-4 rounded-lg text-lg hover:bg-purple-900 transition-all border border-purple-500"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
