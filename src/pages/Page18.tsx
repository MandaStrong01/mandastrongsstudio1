import { ArrowLeft, ArrowRight, FileText, Shield, Play } from 'lucide-react';
import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';

interface PageProps {
  onNavigate: (page: number) => void;
}

const VIDEO_PATH = '/static/video/thatsallfolks.mp4';

export default function Page18({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 text-white flex flex-col">
      <button className="fixed top-6 right-6 z-50 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 transition-all hover:scale-110">
        <Play className="w-6 h-6 text-white" />
      </button>
      <div className="flex-1 flex flex-col px-4 py-12">
        <div className="max-w-4xl w-full mx-auto">
          <div className="aspect-video bg-black rounded-lg overflow-hidden border border-purple-500/30 mb-8">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={VIDEO_PATH} type="video/mp4" />
            </video>
          </div>
          <h1 className="text-5xl font-black text-purple-400 mb-8 text-center">Terms of Service & Disclaimer</h1>

          <div className="grid gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold">Terms of Service</h2>
              </div>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  By using MandaStrong Studio, you agree to these terms. This platform is provided "as is" for
                  creative filmmaking purposes. All content created using this platform is the intellectual
                  property of the creator.
                </p>
                <p>
                  Users are responsible for ensuring their content does not violate copyright, trademark, or
                  other intellectual property rights. MandaStrong Studio provides tools and services but does
                  not claim ownership of user-generated content.
                </p>
                <p>
                  Subscription plans are billed monthly. Users may cancel at any time. Refunds are provided
                  within 30 days of purchase if no projects have been rendered or exported.
                </p>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold">Disclaimer</h2>
              </div>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  MandaStrong Studio is not liable for any content created by users using this platform.
                  Users are solely responsible for the content they create, distribute, and publish.
                </p>
                <p>
                  AI-generated content may require human review and editing. MandaStrong Studio does not
                  guarantee the accuracy, quality, or suitability of AI-generated assets for any specific
                  purpose.
                </p>
                <p>
                  The platform may experience downtime for maintenance or technical issues. We strive to
                  provide reliable service but do not guarantee uninterrupted access.
                </p>
                <p className="font-semibold text-purple-400">
                  By clicking "Next" you acknowledge that you have read and agree to these terms.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate(16)}
              className="flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-900 transition-all border border-purple-500"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => onNavigate(18)}
              className="flex items-center gap-2 bg-purple-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-purple-500 transition-all"
            >
              I Agree - Next
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
