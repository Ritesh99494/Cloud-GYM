import React, { useEffect, useState } from 'react';
import { SubscriptionStatus } from '../subscription/SubscriptionStatus';
import { SubscriptionPlans } from '../subscription/SubscriptionPlans';
import { apiService } from '../../services/api';

interface Subscription {
  id: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  active: boolean;
  daysRemaining: number;
}

export const SubscriptionPage: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchSubscription();
    fetchPlans();
  }, []);

  const fetchSubscription = async () => {
    try {
      const result = await apiService.getActiveSubscription();
      setSubscription(result);
    } catch (error: any) {
      setSubscription(null); // No active plan
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await apiService.getSubscriptionPlans();
      setPlans(response);
    } catch (err) {
      console.error('Failed to load plans');
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {subscription ? (
        <SubscriptionStatus />
      ) : (
        <SubscriptionPlans plans={plans} />
      )}
    </div>
  );
};
