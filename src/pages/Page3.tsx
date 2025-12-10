import Footer from '../components/Footer';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page3({ onNavigate }: PageProps) {
  const openStripeLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl flex flex-col">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-400">SUBSCRIPTION PLANS</h2>
          <p className="text-center text-white/70 mb-8">Choose the plan that fits your creative vision</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <button
            onClick={() => openStripeLink('https://buy.stripe.com/fZubJ35BE3B53oH00')}
            className="bg-gradient-to-br from-purple-900/30 to-black/50 backdrop-blur-xl border-2 border-purple-500/60 hover:border-purple-400 hover:from-purple-900/40 hover:to-black/60 text-white font-bold py-6 px-6 rounded-3xl transition-all shadow-lg shadow-purple-900/30"
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
            className="bg-gradient-to-br from-purple-900/30 to-black/50 backdrop-blur-xl border-2 border-purple-500/60 hover:border-purple-400 hover:from-purple-900/40 hover:to-black/60 text-white font-bold py-6 px-6 rounded-3xl transition-all shadow-lg shadow-purple-900/30"
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
            className="bg-gradient-to-br from-purple-900/30 to-black/50 backdrop-blur-xl border-2 border-purple-500/60 hover:border-purple-400 hover:from-purple-900/40 hover:to-black/60 text-white font-bold py-6 px-6 rounded-3xl transition-all shadow-lg shadow-purple-900/30"
          >
            <div className="text-center">
              <div className="text-3xl font-black mb-2">STUDIO</div>
              <div className="text-4xl font-black mb-2 text-purple-400">$30</div>
              <div className="text-lg font-semibold mb-2">2.5 Hours</div>
              <p className="text-sm text-white/80">Complete cinematic experience with full-length film capabilities and unlimited creative freedom</p>
            </div>
          </button>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => onNavigate(2)}
            className="bg-black text-white font-bold px-10 py-4 rounded-lg text-lg hover:bg-purple-900 transition-all border border-purple-500"
          >
            Back
          </button>
          <button
            onClick={() => onNavigate(4)}
            className="bg-purple-600 text-white font-bold px-10 py-4 rounded-lg text-lg hover:bg-purple-500 transition-all border border-purple-500"
          >
            Next
          </button>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
