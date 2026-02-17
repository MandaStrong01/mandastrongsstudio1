import { ArrowLeft, ArrowRight, MessageCircle, Clock, Headphones, Send } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';
import GrokChat from '../components/GrokChat';

interface PageProps {
  onNavigate: (page: number) => void;
}

interface ChatMessage {
  id: string;
  message: string;
  is_user: boolean;
  created_at: string;
}

export default function Page19({ onNavigate }: PageProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello there! Welcome to MandaStrong Studio! I'm here to help you create amazing movies. What can I assist you with today?";
    } else if (lowerMessage.includes('help')) {
      return "I'm happy to help! I can assist with uploading media, using our AI tools, editing videos, and navigating the platform. What would you like to learn about?";
    } else if (lowerMessage.includes('upload')) {
      return "Great question! To upload media, visit Page 10 (Timeline Editor) or Page 11 (Media Box) and click the 'Upload' button. You can upload videos, images, and audio files. They'll appear in your Media Box automatically!";
    } else if (lowerMessage.includes('ai tool')) {
      return "Wonderful! MandaStrong Studio has over 720 AI tools across Pages 4-9. Each tool helps you create amazing content - just click any tool to get started. Your creations are automatically saved to your Media Box!";
    } else if (lowerMessage.includes('edit')) {
      return "Excellent! You can view your media on the Editor Dashboard (Page 11). For advanced editing, explore the Timeline Editor (Page 10), Audio Studio (Page 13), Text Creator (Page 14), Animation Lab (Page 15), and Visual FX (Page 16).";
    } else if (lowerMessage.includes('export') || lowerMessage.includes('download')) {
      return "Perfect! To export your project, go to the Visual FX page (Page 16) and use the Export button. You can choose different quality settings and formats that work best for you!";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('plan')) {
      return "Great question! We have three wonderful plans: Basic ($40/month), Pro ($39/month), and Studio ($50/month). Each plan gives you full access to all our AI tools!";
    } else {
      return "Thank you for reaching out! I'm here to help make your creative journey fun and easy. Feel free to ask me anything about MandaStrong Studio - I'm always happy to assist!";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user || sending) return;

    setSending(true);
    try {
      const { error: userError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: inputMessage.trim(),
          is_user: true,
        });

      if (userError) throw userError;

      const aiResponse = generateAIResponse(inputMessage);

      const { error: aiError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: aiResponse,
          is_user: false,
        });

      if (aiError) throw aiError;

      setInputMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c1d95]/20 via-black to-[#4c1d95]/20 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-12">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-5xl font-black text-[#a78bfa] mb-4 text-center">Agent Grok 24/7 Help Desk</h1>
          <p className="text-xl text-white/70 text-center mb-8">Online Now - Ready to Assist You</p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-[#6d28d9]/30 p-6 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-[#a78bfa]" />
              <h3 className="text-xl font-bold mb-2">24/7 Availability</h3>
              <p className="text-white/70">Get help anytime, day or night</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-[#6d28d9]/30 p-6 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-[#a78bfa]" />
              <h3 className="text-xl font-bold mb-2">Instant Responses</h3>
              <p className="text-white/70">Quick answers to your questions</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-[#6d28d9]/30 p-6 text-center">
              <Headphones className="w-12 h-12 mx-auto mb-4 text-[#a78bfa]" />
              <h3 className="text-xl font-bold mb-2">Expert Support</h3>
              <p className="text-white/70">AI-powered assistance</p>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-[#6d28d9]/30 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-[#a78bfa]">Live Chat</h2>

            <div className="bg-black/50 rounded-lg border border-[#6d28d9]/30 p-6 mb-4 h-96 overflow-y-auto">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#5b21b6] flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="bg-[#4c1d95]/30 rounded-lg p-4 flex-1">
                      <p className="font-semibold mb-1">Agent Grok</p>
                      <p className="text-white/80">
                        Hello! I'm Agent Grok, your 24/7 assistant for MandaStrong Studio. How can I help you today?
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.is_user ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.is_user ? 'bg-[#5b21b6]' : 'bg-[#5b21b6]'
                      }`}>
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div className={`rounded-lg p-4 flex-1 ${
                        msg.is_user ? 'bg-[#5b21b6]/30' : 'bg-[#4c1d95]/30'
                      }`}>
                        <p className="font-semibold mb-1">{msg.is_user ? 'You' : 'Agent Grok'}</p>
                        <p className="text-white/80">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                disabled={sending}
                className="flex-1 px-4 py-3 bg-black border border-[#6d28d9]/50 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#a78bfa] disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || !inputMessage.trim()}
                className="bg-[#5b21b6] hover:bg-[#6d28d9] disabled:bg-[#4c1d95] disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-lg transition-all flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate(18)}
              className="flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#4c1d95] transition-all border border-[#6d28d9]"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => onNavigate(20)}
              className="flex items-center gap-2 bg-[#5b21b6] text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#6d28d9] transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <QuickAccess onNavigate={onNavigate} />
      <GrokChat onNavigate={onNavigate} />
      <Footer />
    </div>
  );
}
