@@ .. @@
 import { AboutPage } from './components/pages/AboutPage';
 import { GymFinderPage } from './components/pages/GymFinderPage';
 import {GymManagementForm} from './components/admin/GymManagementForm';
+import { SubscriptionPlans } from './components/subscription/SubscriptionPlans';
+import { SubscriptionStatus } from './components/subscription/SubscriptionStatus';
+import { BookingHistory } from './components/booking/BookingHistory';
+import { PaymentRedirect } from './components/payment/PaymentRedirect';

 import { useGeolocation } from './hooks/useGeolocation';
@@ .. @@
             <Route path="/" element={<HomePage />} />
             <Route path="/about" element={<AboutPage />} />
             <Route path="/gyms" element={<GymFinderPage />} />
+            <Route path="/subscriptions" element={<SubscriptionPlans />} />
+            <Route path="/subscription-status" element={<SubscriptionStatus />} />
+            <Route path="/bookings" element={<BookingHistory />} />
+            <Route path="/payment/redirect" element={<PaymentRedirect />} />
             <Route 
               path="/admin/gyms" 
               element={