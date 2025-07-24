import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, CreditCard } from 'lucide-react';
import { apiService } from '../../services/api';

export const PaymentRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const paymentId = searchParams.get('paymentId');
    const paymentStatus = searchParams.get('status') || 'success'; // Simulate success for demo
    const transactionId = searchParams.get('transactionId') || 'TXN_' + Date.now();

    if (paymentId) {
      processPaymentCallback(paymentId, paymentStatus, transactionId);
    } else {
      setStatus('failed');
      setMessage('Invalid payment information');
    }
  }, [searchParams]);

  const processPaymentCallback = async (paymentId: string, paymentStatus: string, transactionId: string) => {
    try {
      const callbackData = {
        paymentId,
        status: paymentStatus.toUpperCase(),
        transactionId,
        paymentMethod: 'CARD'
      };

      await apiService.paymentCallback(callbackData);

      if (paymentStatus.toLowerCase() === 'success') {
        setStatus('success');
        setMessage('Payment completed successfully!');
        
        // Redirect to appropriate page after 3 seconds
        setTimeout(() => {
          navigate('/subscriptions');
        }, 3000);
      } else {
        setStatus('failed');
        setMessage('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment callback:', error);
      setStatus('failed');
      setMessage('Error processing payment. Please contact support.');
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-600" />;
      case 'failed':
        return <XCircle className="h-16 w-16 text-red-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'processing':
        return 'bg-blue-50';
      case 'success':
        return 'bg-green-50';
      case 'failed':
        return 'bg-red-50';
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-800';
      case 'success':
        return 'text-green-800';
      case 'failed':
        return 'text-red-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className={`${getBackgroundColor()} rounded-2xl p-8 text-center shadow-lg border-2 ${
          status === 'success' ? 'border-green-200' : 
          status === 'failed' ? 'border-red-200' : 'border-blue-200'
        }`}>
          <div className="mb-6">
            {getIcon()}
          </div>
          
          <h1 className={`text-2xl font-bold mb-4 ${getTextColor()}`}>
            {status === 'processing' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'failed' && 'Payment Failed'}
          </h1>
          
          <p className={`text-lg mb-6 ${getTextColor()}`}>
            {message}
          </p>

          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Your subscription is now active</span>
                </div>
              </div>
              <p className="text-sm text-green-600">
                Redirecting to your subscription dashboard...
              </p>
            </div>
          )}

          {status === 'failed' && (
            <div className="space-y-4">
              <button
                onClick={() => navigate('/subscriptions')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Go Home
              </button>
            </div>
          )}

          {status === 'processing' && (
            <div className="text-sm text-blue-600">
              Please do not close this window...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};