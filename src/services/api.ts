@@ .. @@
   // Subscription endpoints
+  async getSubscriptionPlans() {
+    return this.request('/subscriptions/plans');
+  }
+
+  async getUserSubscriptions() {
+    return this.request('/subscriptions/my-subscriptions');
+  }
+
+  async getActiveSubscription() {
+    return this.request('/subscriptions/active');
+  }
+
+  async getSubscriptionStatus() {
+    return this.request('/subscriptions/status');
+  }
+
+  async createSubscription(type: string) {
+    return this.request('/subscriptions/create', {
+      method: 'POST',
+      body: JSON.stringify({ type }),
+    });
+  }
+
+  async cancelSubscription(subscriptionId: string) {
+    return this.request(`/subscriptions/${subscriptionId}/cancel`, {
+      method: 'PUT',
+    });
+  }
+
+  // Payment endpoints
+  async getUserPayments() {
+    return this.request('/payments/my-payments');
+  }
+
+  async initiateSubscriptionPayment(type: string) {
+    return this.request('/payments/subscription/initiate', {
+      method: 'POST',
+      body: JSON.stringify({ type }),
+    });
+  }
+
+  async initiateBookingPayment(bookingId: string) {
+    return this.request('/payments/booking/initiate', {
+      method: 'POST',
+      body: JSON.stringify({ bookingId }),
+    });
+  }
+
+  async processPaymentCallback(callbackData: any) {
+    return this.request('/payments/callback', {
+      method: 'POST',
+      body: JSON.stringify(callbackData),
+    });
+  }
+
+  async getPaymentByPaymentId(paymentId: string) {
+    return this.request(`/payments/${paymentId}`);
+  }
+
   async getSubscriptionPlans() {