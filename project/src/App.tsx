import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { GymCard } from './components/gym/GymCard';
import { GymMap } from './components/gym/GymMap';
import { BookingModal } from './components/booking/BookingModal';
import { SubscriptionCard } from './components/subscription/SubscriptionCard';
import { AIRecommendations } from './components/ai/AIRecommendations';
import { useGeolocation } from './hooks/useGeolocation';
import { Gym, User, MapFilters, AIRecommendation } from './types';
import { Search, Filter, MapPin, Calendar, Brain, Crown } from 'lucide-react';

function App() {
  const { location, loading: locationLoading, error: locationError, refreshLocation } = useGeolocation();
  const [user] = useState<User>({
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    subscriptionStatus: 'active',
    subscriptionPlan: 'premium',
    fitnessGoals: ['Weight Loss', 'Strength Training', 'Cardio'],
    joinDate: '2024-01-15',
  });

  const [gyms, setGyms] = useState<Gym[]>([]);
  const [filteredGyms, setFilteredGyms] = useState<Gym[]>([]);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'ai' | 'subscription'>('map');
  const [filters, setFilters] = useState<MapFilters>({
    radius: 10,
    amenities: [],
    rating: 0,
    priceRange: [],
    availability: 'all',
  });
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Mock gym data
  useEffect(() => {
    const mockGyms: Gym[] = [
      {
        id: '1',
        name: 'FitZone Downtown',
        address: '123 Main St, Downtown',
        latitude: 40.7128,
        longitude: -74.0060,
        distance: 0.8,
        rating: 4.5,
        reviewCount: 324,
        amenities: ['WiFi', 'Parking', 'Equipment', 'Sauna'],
        images: ['https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg'],
        operatingHours: {
          monday: { open: '06:00', close: '22:00' },
          tuesday: { open: '06:00', close: '22:00' },
          wednesday: { open: '06:00', close: '22:00' },
          thursday: { open: '06:00', close: '22:00' },
          friday: { open: '06:00', close: '22:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '08:00', close: '20:00' },
        },
        capacity: 150,
        currentOccupancy: 45,
        priceRange: '$25-35',
        description: 'Modern fitness center with state-of-the-art equipment',
        contactInfo: {
          phone: '+1-555-0123',
          email: 'info@fitzone.com',
        },
      },
      {
        id: '2',
        name: 'PowerHouse Gym',
        address: '456 Oak Ave, Midtown',
        latitude: 40.7589,
        longitude: -73.9851,
        distance: 2.3,
        rating: 4.2,
        reviewCount: 189,
        amenities: ['Equipment', 'Parking', 'Personal Training'],
        images: ['https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg'],
        operatingHours: {
          monday: { open: '05:00', close: '23:00' },
          tuesday: { open: '05:00', close: '23:00' },
          wednesday: { open: '05:00', close: '23:00' },
          thursday: { open: '05:00', close: '23:00' },
          friday: { open: '05:00', close: '23:00' },
          saturday: { open: '07:00', close: '21:00' },
          sunday: { open: '07:00', close: '21:00' },
        },
        capacity: 200,
        currentOccupancy: 180,
        priceRange: '$30-45',
        description: 'Serious training facility for dedicated athletes',
        contactInfo: {
          phone: '+1-555-0456',
          email: 'contact@powerhouse.com',
        },
      },
      {
        id: '3',
        name: 'Zen Fitness Studio',
        address: '789 Pine St, Uptown',
        latitude: 40.7831,
        longitude: -73.9712,
        distance: 1.5,
        rating: 4.8,
        reviewCount: 267,
        amenities: ['WiFi', 'Yoga', 'Meditation', 'Sauna'],
        images: ['https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg'],
        operatingHours: {
          monday: { open: '06:00', close: '21:00' },
          tuesday: { open: '06:00', close: '21:00' },
          wednesday: { open: '06:00', close: '21:00' },
          thursday: { open: '06:00', close: '21:00' },
          friday: { open: '06:00', close: '21:00' },
          saturday: { open: '08:00', close: '19:00' },
          sunday: { open: '08:00', close: '19:00' },
        },
        capacity: 80,
        currentOccupancy: 25,
        priceRange: '$20-30',
        description: 'Holistic wellness center focusing on mind-body connection',
        contactInfo: {
          phone: '+1-555-0789',
          email: 'hello@zenfitness.com',
        },
      },
    ];
    setGyms(mockGyms);
    setFilteredGyms(mockGyms);
  }, []);

  // Load AI recommendations when location is available
  useEffect(() => {
    if (location && user.fitnessGoals.length > 0) {
      loadAIRecommendations();
    }
  }, [location, user.fitnessGoals]);

  const loadAIRecommendations = async () => {
    if (!location) return;
    
    setLoadingRecommendations(true);
    try {
      // Mock AI recommendations
      const mockRecommendations: AIRecommendation[] = [
        {
          gym: gyms[2], // Zen Fitness Studio
          score: 0.92,
          reasons: [
            'Perfect for weight loss with specialized cardio equipment',
            'Offers meditation classes that complement your wellness goals',
            'Low current occupancy for comfortable workouts',
          ],
          matchedGoals: ['Weight Loss', 'Cardio'],
        },
        {
          gym: gyms[0], // FitZone Downtown
          score: 0.85,
          reasons: [
            'Excellent strength training equipment and free weights',
            'Convenient downtown location',
            'Modern facilities with great amenities',
          ],
          matchedGoals: ['Strength Training'],
        },
        {
          gym: gyms[1], // PowerHouse Gym
          score: 0.78,
          reasons: [
            'Serious training environment for strength building',
            'Professional-grade equipment',
            'Extended hours for flexible scheduling',
          ],
          matchedGoals: ['Strength Training'],
        },
      ];
      setAIRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = gyms.filter(gym =>
      gym.name.toLowerCase().includes(query.toLowerCase()) ||
      gym.address.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredGyms(filtered);
  };

  const handleGymSelect = (gym: Gym) => {
    setSelectedGym(gym);
  };

  const handleBookGym = (gym: Gym) => {
    setSelectedGym(gym);
    setShowBookingModal(true);
  };

  const handleBookingConfirm = (bookingData: any) => {
    console.log('Booking confirmed:', bookingData);
    setShowBookingModal(false);
    // Here you would typically call your booking API
  };

  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      period: 'month',
      features: [
        'Access to 50+ partner gyms',
        'Basic workout tracking',
        'Mobile app access',
        'Email support',
      ],
      current: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 49,
      period: 'month',
      features: [
        'Access to 200+ partner gyms',
        'Advanced workout analytics',
        'AI-powered recommendations',
        'Priority booking',
        'Guest passes (2/month)',
        'Priority support',
      ],
      popular: true,
      current: true,
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 79,
      period: 'month',
      features: [
        'Access to ALL partner gyms',
        'Personal trainer consultations',
        'Nutrition planning',
        'Unlimited guest passes',
        'Premium equipment access',
        '24/7 phone support',
        'Exclusive events',
      ],
      current: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        location={location} 
        onLocationRefresh={refreshLocation}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Workout
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            One subscription, unlimited access to premium gyms near you
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search gyms by name or location..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
            />
          </div>
        </div>

        {/* Location Status */}
        {locationLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-800">Detecting your location...</span>
            </div>
          </div>
        )}

        {locationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{locationError}</span>
              <button
                onClick={refreshLocation}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
              activeTab === 'map'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Map</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
              activeTab === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>List</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
              activeTab === 'ai'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Brain className="h-4 w-4" />
            <span>AI</span>
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
              activeTab === 'subscription'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Crown className="h-4 w-4" />
            <span>Plans</span>
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <GymMap
                gyms={filteredGyms}
                userLocation={location}
                selectedGym={selectedGym}
                onGymSelect={handleGymSelect}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
            <div className="space-y-6">
              {filteredGyms.slice(0, 3).map((gym) => (
                <GymCard
                  key={gym.id}
                  gym={gym}
                  onSelect={handleGymSelect}
                  onBook={handleBookGym}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGyms.map((gym) => (
              <GymCard
                key={gym.id}
                gym={gym}
                onSelect={handleGymSelect}
                onBook={handleBookGym}
              />
            ))}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="max-w-4xl mx-auto">
            <AIRecommendations
              recommendations={aiRecommendations}
              onGymSelect={(gymId) => {
                const gym = gyms.find(g => g.id === gymId);
                if (gym) handleGymSelect(gym);
              }}
              loading={loadingRecommendations}
            />
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-lg text-gray-600">
                Unlock access to premium gyms with our flexible subscription plans
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {subscriptionPlans.map((plan) => (
                <SubscriptionCard
                  key={plan.id}
                  plan={plan}
                  onSelect={(planId) => console.log('Selected plan:', planId)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        gym={selectedGym}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleBookingConfirm}
      />
    </div>
  );
}

export default App;