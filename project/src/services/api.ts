const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User endpoints
  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateProfile(userData: any) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Gym endpoints
  async getNearbyGyms(latitude: number, longitude: number, radius: number = 10) {
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