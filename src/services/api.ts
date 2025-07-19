@@ .. @@
-const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
+const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

 class ApiService {
   private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
@@ .. @@
     console.log('Final request config:', { 
-      url: `${API_BASE_URL}/api${endpoint}`,
+      url: `${API_BASE_URL}${endpoint}`,
       method: config.method || 'GET',
       headers: config.headers
     });

-    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);
+    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
     
     console.log('Response status:', response.status);
@@ .. @@
   // Auth endpoints
   async login(email: string, password: string) {
     console.log('API: Login request for email:', email);
-    return this.request('/auth/login', {
+    return this.request('/api/auth/login', {
       method: 'POST',
       body: JSON.stringify({ email, password }),
     });
   }

   async register(userData: any) {
     console.log('API: Register request for user:', userData.email);
-    return this.request('/auth/register', {
+    return this.request('/api/auth/register', {
       method: 'POST',
       body: JSON.stringify(userData),
     });
   }

   async validateToken(token: string) {
     console.log('API: Token validation request');
-    return this.request('/auth/validate', {
+    return this.request('/api/auth/validate', {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });
   }
   // User endpoints
   async getCurrentUser() {
     console.log('API: Get current user request');
-    return this.request('/users/me');
+    return this.request('/api/users/me');
   }

   async updateProfile(userData: any) {
     console.log('API: Update profile request');
-    return this.request('/users/me', {
+    return this.request('/api/users/me', {
       method: 'PUT',
       body: JSON.stringify(userData),
     });
   }

   // Gym endpoints
   async getNearbyGyms(latitude: number, longitude: number, radius: number = 10) {
@@ .. @@
     }
     
-    return this.request(`/gyms/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
+    return this.request(`/api/gyms/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
   }

   async getGymById(id: string) {
-    return this.request(`/gyms/${id}`);
+    return this.request(`/api/gyms/${id}`);
   }

   async searchGyms(query: string, filters: any) {
     const params = new URLSearchParams({
       q: query,
       ...filters,
     });
-    return this.request(`/gyms/search?${params}`);
+    return this.request(`/api/gyms/search?${params}`);
   }

   async createGym(gymData: any) {
@@ .. @@
     }
     
-    return this.request('/gyms', {
+    return this.request('/api/gyms', {
       method: 'POST',
       body: JSON.stringify(gymData),
     });
   }
   // Booking endpoints
   async getAvailableSlots(gymId: string, date: string) {
-    return this.request(`/gyms/${gymId}/slots?date=${date}`);
+    return this.request(`/api/gyms/${gymId}/slots?date=${date}`);
   }

   async createBooking(bookingData: any) {
-    return this.request('/bookings', {
+    return this.request('/api/bookings', {
       method: 'POST',
       body: JSON.stringify(bookingData),
     });
   }

   async getUserBookings() {
-    return this.request('/bookings/my-bookings');
+    return this.request('/api/bookings/my-bookings');
   }

   async cancelBooking(bookingId: string) {
-    return this.request(`/bookings/${bookingId}/cancel`, {
+    return this.request(`/api/bookings/${bookingId}/cancel`, {
       method: 'PUT',
     });
   }

   async checkIn(bookingId: string, qrCode: string) {
-    return this.request(`/bookings/${bookingId}/check-in`, {
+    return this.request(`/api/bookings/${bookingId}/check-in`, {
       method: 'POST',
       body: JSON.stringify({ qrCode }),
     });
   }

   // AI Recommendations
   async getAIRecommendations(latitude: number, longitude: number, fitnessGoals: string[]) {
-    return this.request('/ai/recommendations', {
+    return this.request('/api/ai/recommendations', {
       method: 'POST',
       body: JSON.stringify({ latitude, longitude, fitnessGoals }),
     });
   }

   // Subscription endpoints
   async getSubscriptionPlans() {
-    return this.request('/subscriptions/plans');
+    return this.request('/api/subscriptions/plans');
   }

   async upgradeSubscription(planId: string) {
-    return this.request('/subscriptions/upgrade', {
+    return this.request('/api/subscriptions/upgrade', {
       method: 'POST',
       body: JSON.stringify({ planId }),
     });
   }
 }