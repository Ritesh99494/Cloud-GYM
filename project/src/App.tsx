import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { GymFinderPage } from './components/pages/GymFinderPage';
import { GymManagementForm } from './components/admin/GymManagementForm';
import { SubscriptionPlans } from './components/subscription/SubscriptionPlans';
import { SubscriptionStatus } from './components/subscription/SubscriptionStatus';
import { BookingHistory } from './components/booking/BookingHistory';
import { PaymentRedirect } from './components/payment/PaymentRedirect';

import { useGeolocation } from './hooks/useGeolocation';

function App() {
  const { location, refreshLocation } = useGeolocation(true, true);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header location={location} onLocationRefresh={refreshLocation} />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gyms" element={<GymFinderPage />} />
            <Route path="/subscriptions" element={<SubscriptionPlans />} />
            <Route path="/subscription-status" element={<SubscriptionStatus />} />
            <Route path="/bookings" element={<BookingHistory />} />
            <Route path="/payment/redirect" element={<PaymentRedirect />} />
            <Route 
              path="/admin/gyms" 
              element={
                <ProtectedRoute requireAdmin>
                  <GymManagementForm />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;