import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';
import { LogIn, UserPlus, CheckCircle, Play } from 'lucide-react';

interface PageProps {
  onNavigate: (page: number) => void;
}

const STRIPE_LINKS = {
  basic: import.meta.env.VITE_STRIPE_BASIC_LINK || '',
  pro: import.meta.env.VITE_STRIPE_PRO_LINK || '',
  studio: import.meta.env.VITE_STRIPE_STUDIO_LINK || '',
};

export default function Page3({ onNavigate }: PageProps) {
  const openStripeLink = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white flex flex-col">
      <button className="fixed top-6 right-6 z-50 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 transition-all hover:scale-110">
        <Play className="w-6 h-6 text-white" />
      </button>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-7xl">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              GET STARTED WITH MANDASTRONG
            </h2>
            <p className="text-center text-white/70 text-lg">
              Choose your path to start creating professional movies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-purple-500/40 rounded-2xl p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-purple-500/20 rounded-xl">
                  <LogIn className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold text-white">Login</h3>
              </div>

              <p className="text-white/80 mb-6 text-lg leading-relaxed">
                Already have an account? Select your plan below to access your subscription and continue creating movies.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-white/70">Access your existing projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-white/70">Continue where you left off</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-white/70">Manage your subscription</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-pink-500/40 rounded-2xl p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-3 -right-3">
                <div className="px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg rotate-12">
                  NEW USER
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-pink-500/20 rounded-xl">
                  <UserPlus className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-3xl font-bold text-white">Register</h3>
              </div>

              <p className="text-white/80 mb-6 text-lg leading-relaxed">
                New to MandaStrong? Select a plan below to start your creative journey with our professional movie studio.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <span className="text-white/70">Choose from 3 subscription tiers</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <span className="text-white/70">30 minutes to 2.5 hours of content</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <span className="text-white/70">Full access to AI tools</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold mb-4 text-white">Choose Your Plan</h3>
            <p className="text-white/60 mb-2">All plans include full access to MandaStrong Movie Studio</p>
            <p className="text-sm text-yellow-400/80">Secure payment processing via Stripe • Allow pop-ups when subscribing</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
            <button
              onClick={() => openStripeLink(STRIPE_LINKS.basic)}
              className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-purple-500/40 hover:border-purple-400 hover:from-slate-800 hover:to-slate-900 hover:scale-105 text-white font-bold py-8 px-6 rounded-2xl transition-all shadow-xl hover:shadow-purple-500/20 cursor-pointer"
            >
              <div className="text-center">
                <div className="inline-block px-4 py-1 bg-purple-500/20 rounded-full mb-4">
                  <span className="text-sm font-semibold text-purple-300">BASIC</span>
                </div>
                <div className="text-5xl font-black mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$10</div>
                <div className="text-xl font-bold mb-4 text-white/90">30 Minutes</div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                  Perfect for content creators, social media influencers, and small businesses. Create professional short films, music videos, promotional content, and quick creative projects with ease.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-purple-300 font-semibold group-hover:text-purple-200 transition-colors">Subscribe with Stripe</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => openStripeLink(STRIPE_LINKS.pro)}
              className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-pink-500/40 hover:border-pink-400 hover:from-slate-800 hover:to-slate-900 hover:scale-105 text-white font-bold py-8 px-6 rounded-2xl transition-all shadow-xl hover:shadow-pink-500/20 cursor-pointer relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                  POPULAR
                </span>
              </div>
              <div className="text-center">
                <div className="inline-block px-4 py-1 bg-pink-500/20 rounded-full mb-4">
                  <span className="text-sm font-semibold text-pink-300">PRO</span>
                </div>
                <div className="text-5xl font-black mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">$20</div>
                <div className="text-xl font-bold mb-4 text-white/90">1 Hour</div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                  Ideal for professional videographers, marketing agencies, and corporate communications. Produce documentaries, training videos, webinars, and extended feature-length content with advanced editing capabilities.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-pink-300 font-semibold group-hover:text-pink-200 transition-colors">Subscribe with Stripe</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => openStripeLink(STRIPE_LINKS.studio)}
              className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/40 hover:border-cyan-400 hover:from-slate-800 hover:to-slate-900 hover:scale-105 text-white font-bold py-8 px-6 rounded-2xl transition-all shadow-xl hover:shadow-cyan-500/20 cursor-pointer"
            >
              <div className="text-center">
                <div className="inline-block px-4 py-1 bg-cyan-500/20 rounded-full mb-4">
                  <span className="text-sm font-semibold text-cyan-300">STUDIO</span>
                </div>
                <div className="text-5xl font-black mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">$30</div>
                <div className="text-xl font-bold mb-4 text-white/90">2.5 Hours</div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                  Designed for film studios, production companies, and serious filmmakers. Create full-length feature films, complete cinematic experiences, television episodes, and premium long-form content with unlimited creative potential.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-cyan-300 font-semibold group-hover:text-cyan-200 transition-colors">Subscribe with Stripe</p>
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
              onClick={() => onNavigate(4)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-10 py-4 rounded-xl text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/30"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      <QuickAccess onNavigate={onNavigate} />
      <Footer />
    </div>
  );
}
