
import React, { useEffect, useState } from 'react';
import { SubscriptionStatus } from '../subscription/SubscriptionStatus';
import { SubscriptionPlans } from '../subscription/SubscriptionPlans';
import { apiService } from '../../services/api';
// ✅ Define Subscription type
interface Subscription {
  id: number;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  active: boolean;
  daysRemaining: number;
}

// ✅ Define SubscriptionPlan type
interface SubscriptionPlan {
  type: string;
  name: string;
  price: number;
  duration: string;
}

export const SubscriptionPage: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch active subscription
      try {
        const result = await apiService.getActiveSubscription() as Subscription;
        setSubscription(result);
      } catch (err) {
        console.warn('No active subscription found.');
        setSubscription(null); // If 404 or no plan, that's okay
      }

      // Fetch available plans
      const response = await apiService.getSubscriptionPlans() as SubscriptionPlan[];
      setPlans(response);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-600 font-medium text-lg">
        Loading your subscription...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {subscription ? (
        <SubscriptionStatus />
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose a Subscription Plan</h2>
          <SubscriptionPlans plans={plans} />
        </>
      )}
    </div>
  );
};
