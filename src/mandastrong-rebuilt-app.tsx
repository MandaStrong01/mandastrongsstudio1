import React, { useState } from 'react';
import { Film, Sparkles, ArrowLeft, ArrowRight, Play, Upload, Maximize, FileText, Shield, MessageCircle, Clock, Headphones, Send, Users, Share2, Star, Home, BookOpen } from 'lucide-react';

// =============================================================================
// MAIN APP COMPONENT WITH PAGE ROUTING
// =============================================================================

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);

  const navigate = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 0: return <Page1 onNavigate={navigate} />;
      case 1: return <Page2 onNavigate={navigate} />;
      case 2: return <Page3 onNavigate={navigate} />;
      case 3: return <Page4 onNavigate={navigate} />;
      case 4: return <Page5 onNavigate={navigate} />;
      case 5: return <Page6 onNavigate={navigate} />;
      case 6: return <Page7 onNavigate={navigate} />;
      case 7: return <Page8 onNavigate={navigate} />;
      case 8: return <Page9 onNavigate={navigate} />;
      case 9: return <Page10 onNavigate={navigate} />;
      case 10: return <Page11 onNavigate={navigate} />;
      case 11: return <Page12 onNavigate={navigate} />;
      case 12: return <Page13 onNavigate={navigate} />;
      case 13: return <Page14 onNavigate={navigate} />;
      case 14: return <Page15 onNavigate={navigate} />;
      case 15: return <Page16 onNavigate={navigate} />;
      case 16: return <Page17 onNavigate={navigate} />;
      case 17: return <Page18 onNavigate={navigate} />;
      case 18: return <Page19 onNavigate={navigate} />;
      case 19: return <Page20 onNavigate={navigate} />;
      case 20: return <Page21 onNavigate={navigate} />;
      default: return <Page1 onNavigate={navigate} />;
    }
  };

  return <div className="min-h-screen bg-black">{renderPage()}</div>;
}

// =============================================================================
// PAGE 1 - LANDING PAGE
// =============================================================================
function Page1({ onNavigate }: { onNavigate: (page: number) => void }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-black to-slate-900/30 animate-pulse"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:50px_50px]"></div>
        </div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      <div className="relative z-10 text-center max-w-5xl">
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900/30 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/50 shadow-2xl">
            <Film className="w-20 h-20 text-white" />
          </div>
        </div>

        <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
            MANDASTRONG'S
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
            STUDIO
          </span>
        </h1>

        <p className="text-2xl md:text-3xl font-bold italic mb-12 text-blue-400">
          Welcome To The All-In-One Make-A-Movie-With-Two-Hours-Duration App!
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => onNavigate(1)}
            className="bg-blue-600 text-white font-bold px-10 py-4 rounded-lg text-lg hover:bg-blue-500 transition-all transform hover:scale-105 shadow-xl"
          >
            Next
          </button>
          <button
            onClick={() => onNavigate(2)}
            className="bg-black text-white font-bold px-10 py-4 rounded-lg text-lg hover:bg-slate-900 transition-all border border-blue-500 shadow-xl"
          >
            Login
          </button>
          <button
            onClick={() => onNavigate(2)}
            className="bg-black text-white font-bold px-10 py-4 rounded-lg text-lg hover:bg-slate-900 transition-all border border-blue-500 shadow-xl"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PAGE 2 - WELCOME PAGE
// =============================================================================
function Page2({ onNavigate }: { onNavigate: (page: number) => void }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-black to-purple-900/30 animate-pulse"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_purple_1px,_transparent_1px)] bg-[length:50px_50px]"></div>
        </div>
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      <div className="relative z-10 text-center max-w-5xl">
        <div className="flex justify-center mb-8">
          <div className="bg-purple-900/30 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/50 shadow-2xl">
            <Sparkles className="w-20 h-20 text-white" />
          </div>
        </div>

        <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tight text-purple-400">
          MANDASTRONG'S
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
            STUDIO
          </span>
        </h1>

        <p className="text-2xl md:text-3xl font-bold italic mb-6 text-purple-400">
          Welcome!
        </p>

        <p className="text-xl md:text-2xl font-semibold mb-12 text-purple-400">
          Make Awesome Family Movies Or Put Your Dreams Into Film Reality! Enjoy!
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => onNavigate(0)}
            className="bg-black text-white font-bold px-10 py-4 rounded-lg text-lg hover:bg-purple-900 transition-all border border-purple-500 shadow-xl"
          >
            Back
          </button>
          <button
            onClick={() => onNavigate(2)}
            className="bg-purple-600 text-white font-bold px-10 py-4 rounded-lg text-lg hover:bg-purple-500 transition-all transform hover:scale-105 shadow-xl"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PAGE 3 - LOGIN/REGISTER & PRICING
// =============================================================================
function Page3({ onNavigate }: { onNavigate: (page: number) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Login</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-black/50 border border-purple-500/50 rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:border-purple-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-black/50 border border-purple-500/50 rounded-lg px-4 py-3 mb-6 text-white focus:outline-none focus:border-purple-400"
            />
            <button className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-lg font-bold text-lg">
              Login
            </button>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Register</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full bg-black/50 border border-purple-500/50 rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:border-purple-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-black/50 border border-purple-500/50 rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:border-purple-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-black/50 border border-purple-500/50 rounded-lg px-4 py-3 mb-6 text-white focus:outline-none focus:border-purple-400"
            />
            <button className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-lg font-bold text-lg">
              Create Account
            </button>
          </div>
        </div>

        <h2 className="text-5xl font-black text-center mb-12 text-purple-400">Choose Your Plan</h2>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 text-center">
            <h3 className="text-3xl font-bold mb-4 text-purple-400">Basic</h3>
            <p className="text-5xl font-black mb-6">$20<span className="text-xl text-gray-400">/mo</span></p>
            <ul className="text-left space-y-2 mb-8">
              <li>✓ 100 AI Tools</li>
              <li>✓ 30-minute films</li>
              <li>✓ HD Export</li>
            </ul>
            <button onClick={() => onNavigate(3)} className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-lg font-bold">
              Select Plan
            </button>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border-2 border-purple-400 p-8 text-center transform scale-105">
            <div className="bg-purple-600 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">POPULAR</div>
            <h3 className="text-3xl font-bold mb-4 text-purple-400">Pro</h3>
            <p className="text-5xl font-black mb-6">$30<span className="text-xl text-gray-400">/mo</span></p>
            <ul className="text-left space-y-2 mb-8">
              <li>✓ 400 AI Tools</li>
              <li>✓ 1-hour films</li>
              <li>✓ 4K Export</li>
            </ul>
            <button onClick={() => onNavigate(3)} className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-lg font-bold">
              Select Plan
            </button>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 text-center">
            <h3 className="text-3xl font-bold mb-4 text-purple-400">Studio</h3>
            <p className="text-5xl font-black mb-6">$50<span className="text-xl text-gray-400">/mo</span></p>
            <ul className="text-left space-y-2 mb-8">
              <li>✓ 720 AI Tools</li>
              <li>✓ 3-hour films</li>
              <li>✓ 8K Export</li>
            </ul>
            <button onClick={() => onNavigate(3)} className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-lg font-bold">
              Select Plan
            </button>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(1)}
            className="bg-black text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-900 border border-purple-500"
          >
            ← Back
          </button>
          <button
            onClick={() => onNavigate(3)}
            className="bg-purple-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-500"
          >
            Next →
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}

// =============================================================================
// PAGES 4-9 - AI TOOLS BOARDS
// =============================================================================
function AIToolsPage({ pageNumber, onNavigate }: { pageNumber: number; onNavigate: (page: number) => void }) {
  const categories = ['Writing', 'Voice', 'Image', 'Video', 'Animation', 'Editing'];
  const category = categories[pageNumber - 4];
  
  const tools = Array.from({ length: 120 }, (_, i) => `${category} Tool ${i + 1}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black mb-8 text-purple-400">{category} Tools</h1>
        
        <input
          type="text"
          placeholder="🔍 Search tools..."
          className="w-full max-w-2xl bg-black/50 border border-purple-500/50 rounded-lg px-6 py-4 mb-8 text-white focus:outline-none focus:border-purple-400"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-h-[60vh] overflow-y-auto">
          {tools.map((tool, i) => (
            <button
              key={i}
              className="bg-black/30 border border-purple-500/30 hover:border-purple-400 rounded-lg p-4 text-left transition-all"
            >
              <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
              <p className="font-semibold text-sm">{tool}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(pageNumber - 1)}
            className="bg-black text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-900 border border-purple-500"
          >
            ← Back
          </button>
          <button
            onClick={() => onNavigate(pageNumber + 1)}
            className="bg-purple-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-500"
          >
            Next →
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}

const Page4 = (props: any) => <AIToolsPage pageNumber={4} {...props} />;
const Page5 = (props: any) => <AIToolsPage pageNumber={5} {...props} />;
const Page6 = (props: any) => <AIToolsPage pageNumber={6} {...props} />;
const Page7 = (props: any) => <AIToolsPage pageNumber={7} {...props} />;
const Page8 = (props: any) => <AIToolsPage pageNumber={8} {...props} />;
const Page9 = (props: any) => <AIToolsPage pageNumber={9} {...props} />;

// =============================================================================
// PAGE 10 - VIDEO STUDIO
// =============================================================================
function Page10({ onNavigate }: { onNavigate: (page: number) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-purple-400 mb-8 text-center">VIDEO STUDIO</h1>

        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 mb-8">
          <div className="aspect-video bg-black rounded-lg border border-purple-500/30 mb-4 flex items-center justify-center">
            <Upload className="w-16 h-16 text-purple-400" />
          </div>
          
          <button className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-lg font-bold text-lg">
            <Upload className="inline w-5 h-5 mr-2" />
            Upload Video
          </button>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(8)}
            className="bg-black text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-900 border border-purple-500"
          >
            ← Back
          </button>
          <button
            onClick={() => onNavigate(10)}
            className="bg-purple-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-500"
          >
            Next →
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}

// =============================================================================
// PAGES 11-16 - EDITOR PAGES
// =============================================================================
function EditorPage({ title, pageNumber, onNavigate }: { title: string; pageNumber: number; onNavigate: (page: number) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-purple-400 mb-8">{title}</h1>

        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 mb-8 min-h-[500px]">
          <div className="text-center text-gray-400 mt-32">
            <Film className="w-20 h-20 mx-auto mb-4 text-purple-400" />
            <p className="text-xl">{title} Interface</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(pageNumber - 1)}
            className="bg-black text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-900 border border-purple-500"
          >
            ← Back
          </button>
          <button
            onClick={() => onNavigate(pageNumber + 1)}
            className="bg-purple-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-500"
          >
            Next →
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}

const Page11 = (props: any) => <EditorPage title="Editor Dashboard" pageNumber={10} {...props} />;
const Page12 = (props: any) => <EditorPage title="Timeline Editor" pageNumber={11} {...props} />;
const Page13 = (props: any) => <EditorPage title="Audio Studio" pageNumber={12} {...props} />;
const Page14 = (props: any) => <EditorPage title="Text Creator" pageNumber={13} {...props} />;
const Page15 = (props: any) => <EditorPage title="Animation Lab" pageNumber={14} {...props} />;
const Page16 = (props: any) => <EditorPage title="Visual FX & Export" pageNumber={15} {...props} />;

// =============================================================================
// PAGE 17 - FULL SCREEN PREVIEW
// =============================================================================
function Page17({ onNavigate }: { onNavigate: (page: number) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-purple-400 mb-8 text-center">FULL SCREEN PREVIEW</h1>

        <div className="bg-black rounded-2xl border-2 border-purple-500/30 aspect-video mb-8 flex items-center justify-center">
          <Maximize className="w-20 h-20 text-purple-400" />
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(15)}
            className="bg-black text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-900 border border-purple-500"
          >
            ← Back
          </button>
          <button
            onClick={() => onNavigate(17)}
            className="bg-purple-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-500"
          >
            Next →
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}

// =============================================================================
// PAGE 18 - TERMS OF SERVICE
// =============================================================================
function Page18({ onNavigate }: { onNavigate: (page: number) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-purple-400 mb-8 text-center">Terms of Service & Disclaimer</h1>

        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-purple-400" />
            <h2 className="text-2xl font-bold">Terms of Service</h2>
          </div>
          <p className="text-white/80 leading-relaxed">
            By using MandaStrong Studio, you agree to these terms. This platform is provided "as is" for
            creative filmmaking purposes. All content created using this platform is the intellectual
            property of the creator.
          </p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-purple-400" />
            <h2 className="text-2xl font-bold">Disclaimer</h2>
          </div>
          <p className="text-white/80 leading-relaxed">
            MandaStrong Studio is not liable for any content created by users using this platform.
            Users are solely responsible for the content they create, distribute, and publish.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(16)}
            className="bg-black text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-900 border border-purple-500"
          >
            ← Back
          </button>
          <button
            onClick={() => onNavigate(18)}
            className="bg-purple-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-500"
          >
            I Agree - Next →
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}

// =============================================================================
// PAGE 19 - AGENT GROK HELP DESK
// =============================================================================
function Page19({ onNavigate }: { onNavigate: (page: number) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black text-purple-400 mb-4 text-center">Agent Grok 24/7 Help Desk</h1>
        <p className="text-xl text-white/70 text-center mb-8">Online Now - Ready to Assist You</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-bold mb-2">24/7 Availability</h3>
            <p className="text-white/70">Get help anytime</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-bold mb-2">Instant Responses</h3>
            <p className="text-white/70">Quick answers</p>
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
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4 flex-1">
                <p className="font-semibold mb-1">Agent Grok</p>
                <p className="text-white/80">Hello! How can I help you today?</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-black border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-400"
            />
            <button className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-lg font-bold">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(17)}
            className="bg-black text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-900 border border-purple-500"
          >
            ← Back
          </button>
          <button
            onClick={() => onNavigate(19)}
            className="bg-purple-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-500"
          >
            Next →
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}

// =============================================================================
// PAGE 20 - COMMUNITY HUB
// =============================================================================
function Page20({ onNavigate }: { onNavigate: (page: number) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black text-purple-400 mb-4 text-center">Community Hub</h1>
        <p className="text-xl text-white/70 text-center mb-8">Connect, Share, and Inspire</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 text-center hover:border-purple-400 transition-all cursor-pointer">
            <Users className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-white/70">Join creators</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 text-center hover:border-purple-400 transition-all cursor-pointer">
            <Share2 className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-bold mb-2">Showcase</h3>
            <p className="text-white/70">Share projects</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 text-center hover:border-purple-400 transition-all cursor-pointer">
            <Star className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-bold mb-2">Featured</h3>
            <p className="text-white/70">Get recognized</p>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-black/50 rounded-lg border border-purple-500/30 p-4">
                <div className="aspect-video bg-purple-900/20 rounded-lg mb-3 flex items-center justify-center">
                  <Star className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="font-semibold mb-1">Project #{i}</h4>
                <p className="text-xs text-white/60">By Creator</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(18)}
            className="bg-black text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-900 border border-purple-500"
          >
            ← Back
          </button>
          <button
            onClick={() => onNavigate(20)}
            className="bg-purple-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-500"
          >
            Next →
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}

// =============================================================================
// PAGE 21 - THANK YOU
// =============================================================================
function Page21({ onNavigate }: { onNavigate: (page: number) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white p-8">
      <div className="max-w-6xl mx-auto text-center">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-12 mb-8">
          <h1 className="text-7xl font-black mb-8 text-purple-400">THAT'S ALL FOLKS!</h1>

          <div className="bg-purple-900/40 rounded-2xl p-12 border-2 border-purple-400/50 mb-8">
            <h2 className="text-3xl text-purple-300 font-bold mb-6">A Special Thank You</h2>
            <p className="text-xl text-white leading-relaxed mb-4">
              To all current and future creators, dreamers, and storytellers...
            </p>
            <p className="text-lg text-white/90 leading-relaxed">
              Your creativity and passion inspire positive change in the world. Thank you for being part of this mission.
            </p>
          </div>

          <div className="bg-black/50 rounded-2xl p-8 border border-purple-500/30 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold text-purple-400">Full User Guide</h2>
            </div>
            <p className="text-white/70">Complete guide to MandaStrong Studio</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(19)}
            className="bg-black text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-900 border border-purple-500"
          >
            ← Back
          </button>
          <button
            onClick={() => onNavigate(0)}
            className="bg-purple-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-purple-500"
          >
            <Home className="inline w-5 h-5 mr-2" />
            Home
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}

// =============================================================================
// FOOTER COMPONENT
// =============================================================================
function Footer() {
  return (
    <div className="mt-16 pt-8 border-t border-purple-500/30 text-center text-sm text-purple-400 font-semibold">
      MandaStrong1 2026 ~ Author Of Doxy The School Bully ~ Pls Find Me On MandaStrong1.Etsy.com
    </div>
  );
}
