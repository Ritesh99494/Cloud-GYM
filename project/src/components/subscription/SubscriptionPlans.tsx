import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { SubscriptionPlan } from '../../types';

interface SubscriptionPlansProps {
  onPlanSelect?: (plan: SubscriptionPlan) => void;
  plans?: SubscriptionPlan[];
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onPlanSelect, plans = [] }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGradient = (type: string) => {
    switch (type) {
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
    setError(null);

    try {
      // Use the new public method from apiService
      interface PaymentResponse {
        redirectUrl: string;
      }
      const paymentResponse = await apiService.initiateSubscriptionPayment(plan.type) as PaymentResponse;

      // Redirect to payment gateway
      if (paymentResponse.redirectUrl) {
        window.location.href = paymentResponse.redirectUrl;
      }

      onPlanSelect?.(plan);
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.type}
            className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${getGradient(plan.type)} text-white cursor-pointer transition-transform transform hover:scale-105 ${
              selectedPlan === plan.type ? 'ring-4 ring-blue-300' : ''
            }`}
            onClick={() => handlePlanSelect(plan)}
          >
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="mb-4">{plan.description}</p>
            <div className="text-2xl font-semibold mb-2">₹{plan.price}</div>
            <div className="text-sm">{plan.duration}</div>
            {processing && selectedPlan === plan.type && (
              <div className="mt-2 text-blue-200">Processing...</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};