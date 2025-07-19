const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        const errorText = await response.text();
        console.error('API Error Response (text):', errorText);
      }
      throw new Error(errorMessage);
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    console.log('API: Register request for user:', userData.email);
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async validateToken(token: string) {
    console.log('API: Token validation request');
    return this.request('/api/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // User endpoints
  async getCurrentUser() {
    console.log('API: Get current user request');
    return this.request('/api/users/me');
  }

  async updateProfile(userData: any) {
    console.log('API: Update profile request');
    return this.request('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Gym endpoints
  async getNearbyGyms(latitude: number, longitude: number, radius: number = 10) {
    console.log('API: Get nearby gyms request', { latitude, longitude, radius });
    
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }
    
    return this.request(`/api/gyms/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
  }

  async getGymById(id: string) {
    return this.request(`/api/gyms/${id}`);
  }

  async searchGyms(query: string, filters: any) {
    const params = new URLSearchParams({
      q: query,
      ...filters,
    });
    return this.request(`/api/gyms/search?${params}`);
  }

  async createGym(gymData: any) {
    console.log('API: Create gym request');
    
    if (!gymData.name || !gymData.address) {
      throw new Error('Gym name and address are required');
    }
    
    return this.request('/api/gyms', {
      method: 'POST',
      body: JSON.stringify(gymData),
    });
  }

  // Booking endpoints
  async getAvailableSlots(gymId: string, date: string) {
    return this.request(`/api/gyms/${gymId}/slots?date=${date}`);
  }

  async createBooking(bookingData: any) {
    return this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getUserBookings() {
    return this.request('/api/bookings/my-bookings');
  }

  async cancelBooking(bookingId: string) {
    return this.request(`/api/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
  }

  async checkIn(bookingId: string, qrCode: string) {
    return this.request(`/api/bookings/${bookingId}/check-in`, {
      method: 'POST',
      body: JSON.stringify({ qrCode }),
    });
  }

  // AI Recommendations
  async getAIRecommendations(latitude: number, longitude: number, fitnessGoals: string[]) {
    return this.request('/api/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude, fitnessGoals }),
    });
  }

  // Subscription endpoints
  async getSubscriptionPlans() {
    return this.request('/api/subscriptions/plans');
  }

  async upgradeSubscription(planId: string) {
    return this.request('/api/subscriptions/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  }
}

export default new ApiService();