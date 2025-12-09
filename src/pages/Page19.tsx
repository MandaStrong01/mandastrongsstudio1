import { ArrowLeft, ArrowRight, MessageCircle, Clock, Headphones } from 'lucide-react';
import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page19({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-12">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-5xl font-black text-purple-400 mb-4 text-center">Agent Grok 24/7 Help Desk</h1>
          <p className="text-xl text-white/70 text-center mb-8">Online Now - Ready to Assist You</p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-2">24/7 Availability</h3>
              <p className="text-white/70">Get help anytime, day or night</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-2">Instant Responses</h3>
              <p className="text-white/70">Quick answers to your questions</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 text-center">
              <Headphones className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-2">Expert Support</h3>
              <p className="text-white/70">AI-powered assistance</p>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Live Chat</h2>

            <div className="bg-black/50 rounded-lg border border-purple-500/30 p-6 mb-4 h-96 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4 flex-1">
                    <p className="font-semibold mb-1">Agent Grok</p>
                    <p className="text-white/80">
                      Hello! I'm Agent Grok, your 24/7 assistant for MandaStrong Studio. How can I help you today?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message here..."
                className="flex-1 px-4 py-3 bg-black border border-purple-500/50 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-purple-400"
              />
              <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3 rounded-lg transition-all">
                Send
              </button>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate(18)}
              className="flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-900 transition-all border border-purple-500"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => onNavigate(20)}
              className="flex items-center gap-2 bg-purple-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-500 transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <QuickAccess onNavigate={onNavigate} />
      <Footer />
    </div>
  );
}
