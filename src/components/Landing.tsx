import { Play, Sparkles, Film, Zap, Cloud, Shield } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

export default function Landing({ onGetStarted }: LandingProps) {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Creation',
      description: 'Generate videos, images, audio, and scripts with advanced AI tools',
    },
    {
      icon: Film,
      title: 'Professional Editing',
      description: 'Full-featured timeline editor with effects, filters, and transitions',
    },
    {
      icon: Zap,
      title: 'Fast Rendering',
      description: 'Cloud-based rendering engine for quick exports up to 4K quality',
    },
    {
      icon: Cloud,
      title: 'Cloud Storage',
      description: '50GB of cloud storage for all your media assets and projects',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Movie Studio
          </div>

          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Create Amazing Movies
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              With AI Technology
            </span>
          </h1>

          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Professional movie creation studio powered by cutting-edge AI. Generate content, edit videos, and produce cinema-quality films all in one place.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-lg transition-all border border-white/10 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>

        <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden mb-20 border border-white/10 shadow-2xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
                <Play className="w-10 h-10 text-blue-400" />
              </div>
              <p className="text-white/60">Demo Video Preview</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-12 text-center">
          <Shield className="w-16 h-16 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Security</h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Your projects and assets are protected with bank-level encryption and secure cloud storage. Professional tools trusted by creators worldwide.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
          >
            Start Creating Now
          </button>
        </div>
      </div>
    </div>
  );
}
