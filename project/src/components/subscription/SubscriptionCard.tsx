import React from 'react';
import { Check, Crown, Zap, Star } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
  current?: boolean;
}

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  onSelect: (planId: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ plan, onSelect }) => {
  const getIcon = () => {
    switch (plan.name.toLowerCase()) {
      case 'basic':
        return <Zap className="h-6 w-6" />;
      case 'premium':
        return <Star className="h-6 w-6" />;
      case 'elite':
        return <Crown className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  const getGradient = () => {
    switch (plan.name.toLowerCase()) {
      case 'basic':
        return 'from-green-500 to-emerald-600';
      case 'premium':
        return 'from-blue-500 to-purple-600';
      case 'elite':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      plan.popular ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    } ${plan.current ? 'ring-2 ring-green-200 border-green-500' : ''}`}>
      
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}

      {/* Current Plan Badge */}
      {plan.current && (
        <div className="absolute -top-3 right-4">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Current Plan
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${getGradient()} text-white mb-4`}>
            {getIcon()}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
            <span className="text-gray-600 ml-1">/{plan.period}</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
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
          onClick={() => onSelect(plan.id)}
          disabled={plan.current}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            plan.current
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : plan.popular
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transform hover:scale-105'
              : 'bg-gray-900 hover:bg-gray-800 text-white transform hover:scale-105'
          }`}
        >
          {plan.current ? 'Current Plan' : `Choose ${plan.name}`}
        </button>
      </div>
    </div>
  );
};