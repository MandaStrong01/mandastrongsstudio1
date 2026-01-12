import { Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PricingPlansProps {
  onNavigate?: (page: number) => void;
}

export default function PricingPlans({ onNavigate }: PricingPlansProps) {
  const { user } = useAuth();

  const handlePlanSelect = (planUrl: string) => {
    if (!user) {
      alert('Please sign in to subscribe');
      return;
    }
    window.open(planUrl, '_blank');
  };

  const plans = [
    {
      name: 'Basic',
      price: '$29',
      period: '/month',
      description: 'Perfect for individuals starting out',
      features: [
        'Up to 10 AI-generated movies per month',
        '5GB storage',
        'HD video quality (1080p)',
        'Basic editing tools',
        'Email support',
        'Watermark-free exports'
      ],
      url: import.meta.env.VITE_STRIPE_BASIC_LINK,
      popular: false
    },
    {
      name: 'Pro',
      price: '$79',
      period: '/month',
      description: 'For creators who need more power',
      features: [
        'Unlimited AI-generated movies',
        '50GB storage',
        '4K video quality',
        'Advanced editing tools',
        'Priority support',
        'Custom branding',
        'Team collaboration (up to 5)',
        'API access'
      ],
      url: import.meta.env.VITE_STRIPE_PRO_LINK,
      popular: true
    },
    {
      name: 'Studio',
      price: '$199',
      period: '/month',
      description: 'Enterprise-grade video production',
      features: [
        'Unlimited everything',
        '500GB storage',
        '8K video quality',
        'Premium editing suite',
        '24/7 dedicated support',
        'White-label solution',
        'Unlimited team members',
        'Advanced API & webhooks',
        'Custom integrations',
        'SLA guarantee'
      ],
      url: import.meta.env.VITE_STRIPE_STUDIO_LINK,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-400">
            Start creating professional videos with AI today
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-slate-900/50 backdrop-blur border ${
                plan.popular
                  ? 'border-cyan-500 shadow-2xl shadow-cyan-500/20'
                  : 'border-slate-700'
              } rounded-2xl p-8 hover:border-cyan-400 transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-black text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-400 ml-2">{plan.period}</span>
                </div>
              </div>

              <button
                onClick={() => handlePlanSelect(plan.url)}
                className={`w-full py-4 rounded-xl font-bold text-lg mb-6 transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                Get Started
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center text-slate-400 text-sm">
          <p>All plans include a 14-day free trial. Cancel anytime.</p>
          <p className="mt-2">Need a custom solution? <a href="mailto:support@mandastrong.com" className="text-cyan-400 hover:text-cyan-300">Contact us</a></p>
        </div>
      </div>
    </div>
  );
}
