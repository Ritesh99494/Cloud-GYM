import React, { useState, useEffect } from 'react';
import { Crown, Check, Zap, Star, CreditCard, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';

interface SubscriptionPlan {
  type: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

interface SubscriptionPlansProps {
  onPlanSelect?: (plan: SubscriptionPlan) => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onPlanSelect }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await apiService.request('/subscriptions/plans');
      
      const plansWithFeatures = response.map((plan: any) => ({
        ...plan,
        features: getPlanFeatures(plan.type),
        popular: plan.type === 'SIX_MONTHS'
      }));
      
      setPlans(plansWithFeatures);
    } catch (err) {
      setError('Failed to load subscription plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlanFeatures = (type: string): string[] => {
    const baseFeatures = [
      'Unlimited gym access',
      'Mobile app access',
      'Basic customer support'
    ];

    switch (type) {
      case 'ONE_MONTH':
        return [
          ...baseFeatures,
          'Access to 50+ partner gyms',
          'Basic workout tracking'
        ];
      case 'SIX_MONTHS':
        return [
          ...baseFeatures,
          'Access to 100+ partner gyms',
          'Advanced workout tracking',
          'Priority booking',
          'Guest passes (2/month)'
        ];
      case 'ONE_YEAR':
        return [
          ...baseFeatures,
          'Access to all partner gyms',
          'Premium workout tracking',
          'Priority booking',
          'Guest passes (5/month)',
          'Personal trainer consultations',
          'Nutrition guidance'
        ];
      default:
        return baseFeatures;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ONE_MONTH':
        return <Zap className="h-6 w-6" />;
      case 'SIX_MONTHS':
        return <Star className="h-6 w-6" />;
      case 'ONE_YEAR':
        return <Crown className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case 'ONE_MONTH':
        return 'from-green-500 to-emerald-600';
      case 'SIX_MONTHS':
        return 'from-blue-500 to-purple-600';
      case 'ONE_YEAR':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handlePlanSelect = async (plan: SubscriptionPlan) => {
    setSelectedPlan(plan.type);
    setProcessing(true);

    try {
      // Initiate payment process
      const paymentResponse = await apiService.request('/payments/subscription/initiate', {
        method: 'POST',
        body: JSON.stringify({ type: plan.type }),
      });

      // Redirect to payment gateway
      if (paymentResponse.redirectUrl) {
        window.location.href = paymentResponse.redirectUrl;
      }

      onPlanSelect?.(plan);
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading subscription plans...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchPlans}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Fitness Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to premium gyms with our flexible subscription plans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.type}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getGradient(plan.type)} text-white mb-4`}>
                    {getIcon(plan.type)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.duration}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    ${(plan.price / getDurationMonths(plan.type)).toFixed(2)}/month
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={processing && selectedPlan === plan.type}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {processing && selectedPlan === plan.type ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <span>Choose {plan.name}</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            All plans include a 7-day money-back guarantee
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>✓ Cancel anytime</span>
            <span>✓ No hidden fees</span>
            <span>✓ Secure payments</span>
          </div>
        </div>
      </div>
    </div>
  );

  function getDurationMonths(type: string): number {
    switch (type) {
      case 'ONE_MONTH': return 1;
      case 'SIX_MONTHS': return 6;
      case 'ONE_YEAR': return 12;
      default: return 1;
    }
  }
};