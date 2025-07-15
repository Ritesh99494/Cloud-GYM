const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    console.log('=== API REQUEST DEBUG ===');
    console.log('Endpoint:', endpoint);
    console.log('Options:', { ...options, body: options.body ? '[BODY_PRESENT]' : undefined });
    
    const token = localStorage.getItem('authToken');
    console.log('Auth token present:', !!token);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('Final request config:', { 
      url: `${API_BASE_URL}${endpoint}`,
      method: config.method || 'GET',
      headers: config.headers
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    console.log('=== API REQUEST DEBUG END ===');
    return data;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    console.log('API: Login request for email:', email);
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    console.log('API: Register request for user:', userData.email);
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async validateToken(token: string) {
    console.log('API: Token validation request');
    return this.request('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // User endpoints
  async getCurrentUser() {
    console.log('API: Get current user request');
    return this.request('/users/me');
  }

  async updateProfile(userData: any) {
    console.log('API: Update profile request');
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Gym endpoints
  async getNearbyGyms(latitude: number, longitude: number, radius: number = 10) {
    console.log('API: Get nearby gyms request:', { latitude, longitude, radius });
    return this.request(`/gyms/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
  }

  async getGymById(id: string) {
    return this.request(`/gyms/${id}`);
  }

  async searchGyms(query: string, filters: any) {
    const params = new URLSearchParams({
      q: query,
      ...filters,
    });
    return this.request(`/gyms/search?${params}`);
  }

  async createGym(gymData: any) {
    return this.request('/gyms', {
      method: 'POST',
      body: JSON.stringify(gymData),
    });
  }
  // Booking endpoints
  async getAvailableSlots(gymId: string, date: string) {
    return this.request(`/gyms/${gymId}/slots?date=${date}`);
  }

  async createBooking(bookingData: any) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getUserBookings() {
    return this.request('/bookings/my-bookings');
  }

  async cancelBooking(bookingId: string) {
    return this.request(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
  }

  async checkIn(bookingId: string, qrCode: string) {
    return this.request(`/bookings/${bookingId}/check-in`, {
      method: 'POST',
      body: JSON.stringify({ qrCode }),
    });
  }

  // AI Recommendations
  async getAIRecommendations(latitude: number, longitude: number, fitnessGoals: string[]) {
    return this.request('/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude, fitnessGoals }),
    });
  }

  // Subscription endpoints
  async getSubscriptionPlans() {
    return this.request('/subscriptions/plans');
  }

  async upgradeSubscription(planId: string) {
    return this.request('/subscriptions/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  }
}

export const apiService = new ApiService();