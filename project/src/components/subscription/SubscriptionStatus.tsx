import React, { useState, useEffect } from 'react';
import { Crown, Calendar, AlertCircle, CheckCircle, CreditCard, RefreshCw } from 'lucide-react';
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

export const SubscriptionStatus: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
    // eslint-disable-next-line
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await apiService.getActiveSubscription();
      setSubscription(response as Subscription); // <-- Fix: cast to Subscription
    } catch (err: any) {
      if (err?.message?.includes('404')) {
        setSubscription(null); // No active subscription
      } else {
        setError('Failed to load subscription status');
      }
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionName = (type: string) => {
    switch (type) {
      case 'ONE_MONTH': return '1 Month Plan';
      case 'SIX_MONTHS': return '6 Months Plan';
      case 'ONE_YEAR': return '1 Year Plan';
      default: return type;
    }
  };

  const getStatusColor = (status: string, active: boolean) => {
    if (active) return 'text-green-600 bg-green-100';
    switch (status.toLowerCase()) {
      case 'expired': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    try {
     // await apiService.cancelSubscription(subscription.id);
      fetchSubscriptionStatus();
    } catch (err) {
      console.error('Error cancelling subscription:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">Error Loading Subscription</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchSubscriptionStatus}
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="text-center">
          <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-6">
            Subscribe to get unlimited access to premium gyms
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all">
            <CreditCard className="inline h-4 w-4 mr-2" />
            Choose a Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-bold">Your Subscription</h2>
              <p className="text-blue-100">{getSubscriptionName(subscription.type)}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status, subscription.active)}`}>
            {subscription.active ? (
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>Active</span>
              </div>
            ) : (
              <span className="capitalize">{subscription.status}</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">${subscription.amount}</div>
            <div className="text-sm text-gray-600">Total Paid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{subscription.daysRemaining}</div>
            <div className="text-sm text-gray-600">Days Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">∞</div>
            <div className="text-sm text-gray-600">Gym Access</div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900">Start Date</div>
                <div className="text-sm text-gray-600">{formatDate(subscription.startDate)}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900">End Date</div>
                <div className="text-sm text-gray-600">{formatDate(subscription.endDate)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {subscription.active && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Subscription Progress</span>
              <span className="text-sm text-gray-600">{subscription.daysRemaining} days left</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.max(0, Math.min(100, (subscription.daysRemaining / 365) * 100))}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {subscription.active ? (
              <span>✓ Unlimited gym access included</span>
            ) : (
              <span>Subscription is not active</span>
            )}
          </div>
          
          {subscription.active && (
            <button
              onClick={handleCancelSubscription}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>
    </div>
  );
};