import { useState } from 'react';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Lock, Mail, UserPlus, LogIn } from 'lucide-react';

interface PageProps {
  onNavigate: (page: number) => void;
}

const STRIPE_LINKS = {
  basic: import.meta.env.VITE_STRIPE_BASIC_LINK || '',
  pro: import.meta.env.VITE_STRIPE_PRO_LINK || '',
  studio: import.meta.env.VITE_STRIPE_STUDIO_LINK || '',
};

export default function Page3({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
      setLoginMessage('Login successful! Welcome back.');
      setTimeout(() => onNavigate(4), 1500);
    } catch (error: any) {
      setLoginMessage(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterMessage('');

    try {
      const { error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
      });
      if (error) throw error;
      setRegisterMessage('Registration successful! You can now login.');
      setRegisterEmail('');
      setRegisterPassword('');
    } catch (error: any) {
      setRegisterMessage(error.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const openStripeLink = (url: string) => {
    if (url) {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (!newWindow) {
        alert('Pop-up blocked! Please allow pop-ups for this site to open the Stripe payment page.');
      }
    } else {
      alert('Payment link not configured. Please contact support.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-7xl">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {user ? 'SUBSCRIPTION PLANS' : 'GET STARTED WITH MANDASTRONG'}
            </h2>
            <p className="text-center text-white/70 text-lg">
              {user ? 'Choose the plan that fits your creative vision' : 'Create your account or sign in to start creating movies'}
            </p>
          </div>

          {!user && (
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-blue-500/40 rounded-2xl p-8 shadow-2xl hover:border-blue-400/60 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <LogIn className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Sign In</h3>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-blue-500/30 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-blue-500/30 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                      />
                    </div>
                  </div>

                  {loginMessage && (
                    <div className={`p-3 rounded-lg ${loginMessage.includes('successful') ? 'bg-green-500/20 border border-green-500/40 text-green-300' : 'bg-red-500/20 border border-red-500/40 text-red-300'}`}>
                      <p className="text-sm font-medium">{loginMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                  >
                    {loginLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing In...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>
              </div>

              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/40 rounded-2xl p-8 shadow-2xl hover:border-cyan-400/60 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-cyan-500/20 rounded-lg">
                    <UserPlus className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Create Account</h3>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-cyan-500/30 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-cyan-500/30 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                    </div>
                    <p className="text-xs text-white/50 mt-1">Must be at least 6 characters long</p>
                  </div>

                  {registerMessage && (
                    <div className={`p-3 rounded-lg ${registerMessage.includes('successful') ? 'bg-green-500/20 border border-green-500/40 text-green-300' : 'bg-red-500/20 border border-red-500/40 text-red-300'}`}>
                      <p className="text-sm font-medium">{registerMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30"
                  >
                    {registerLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-3xl font-bold text-center mb-4 text-white">Choose Your Plan</h3>
            <p className="text-center text-white/60 mb-2">Subscribe via Stripe for secure payment processing</p>
            <p className="text-center text-sm text-yellow-400/80">Allow pop-ups if prompted to complete your subscription</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
            <button
              onClick={() => openStripeLink(STRIPE_LINKS.basic)}
              className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-blue-500/40 hover:border-blue-400 hover:from-slate-800 hover:to-slate-900 hover:scale-105 text-white font-bold py-8 px-6 rounded-2xl transition-all shadow-xl hover:shadow-blue-500/20 cursor-pointer"
            >
              <div className="text-center">
                <div className="inline-block px-4 py-1 bg-blue-500/20 rounded-full mb-4">
                  <span className="text-sm font-semibold text-blue-300">BASIC</span>
                </div>
                <div className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">$10</div>
                <div className="text-xl font-bold mb-4 text-white/90">30 Minutes</div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">Perfect for short films, music videos, and quick creative projects</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-blue-300 font-semibold group-hover:text-blue-200 transition-colors">Click to Subscribe Securely</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => openStripeLink(STRIPE_LINKS.pro)}
              className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/40 hover:border-cyan-400 hover:from-slate-800 hover:to-slate-900 hover:scale-105 text-white font-bold py-8 px-6 rounded-2xl transition-all shadow-xl hover:shadow-cyan-500/20 cursor-pointer relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                  POPULAR
                </span>
              </div>
              <div className="text-center">
                <div className="inline-block px-4 py-1 bg-cyan-500/20 rounded-full mb-4">
                  <span className="text-sm font-semibold text-cyan-300">PRO</span>
                </div>
                <div className="text-5xl font-black mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">$20</div>
                <div className="text-xl font-bold mb-4 text-white/90">1 Hour</div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">Ideal for documentaries, corporate videos, and feature-length content</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-cyan-300 font-semibold group-hover:text-cyan-200 transition-colors">Click to Subscribe Securely</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => openStripeLink(STRIPE_LINKS.studio)}
              className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-purple-500/40 hover:border-purple-400 hover:from-slate-800 hover:to-slate-900 hover:scale-105 text-white font-bold py-8 px-6 rounded-2xl transition-all shadow-xl hover:shadow-purple-500/20 cursor-pointer"
            >
              <div className="text-center">
                <div className="inline-block px-4 py-1 bg-purple-500/20 rounded-full mb-4">
                  <span className="text-sm font-semibold text-purple-300">STUDIO</span>
                </div>
                <div className="text-5xl font-black mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$30</div>
                <div className="text-xl font-bold mb-4 text-white/90">2.5 Hours</div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">Complete cinematic experience with full-length film capabilities</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-purple-300 font-semibold group-hover:text-purple-200 transition-colors">Click to Subscribe Securely</p>
                </div>
              </div>
            </button>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => onNavigate(1)}
              className="bg-slate-800 text-white font-bold px-10 py-4 rounded-xl text-lg hover:bg-slate-700 transition-all border border-slate-600"
            >
              Back
            </button>
            <button
              onClick={() => onNavigate(3)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold px-10 py-4 rounded-xl text-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/30"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
