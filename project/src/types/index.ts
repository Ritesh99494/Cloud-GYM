export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  subscriptionStatus: 'active' | 'inactive' | 'expired';
  subscriptionPlan: 'basic' | 'premium' | 'elite';
  fitnessGoals: string[];
  profileImage?: string;
  joinDate: string;
}

export interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  images: string[];
  operatingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  capacity: number;
  currentOccupancy: number;
  priceRange: string;
  description: string;
  contactInfo: {
    phone: string;
    email: string;
  };
}

export interface TimeSlot {
  id: string;
  gymId: string;
  date: string;
  startTime: string;
  endTime: string;
  availableSpots: number;
  totalSpots: number;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  gymId: string;
  gym: Gym;
  timeSlot: TimeSlot;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  qrCode: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface MapFilters {
  radius: number;
  amenities: string[];
  rating: number;
  priceRange: string[];
  availability: 'all' | 'available' | 'low-capacity';
}

export interface AIRecommendation {
  gym: Gym;
  score: number;
  reasons: string[];
  matchedGoals: string[];
}