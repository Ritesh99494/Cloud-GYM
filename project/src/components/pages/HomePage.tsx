import React from 'react';
import { MapPin, Star, Users, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const featuredGyms = [
    {
      id: '1',
      name: 'FitZone Downtown',
      image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg',
      rating: 4.5,
      distance: '0.8 km',
      price: '$29/month',
    },
    {
      id: '2',
      name: 'PowerHouse Gym',
      image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg',
      rating: 4.2,
      distance: '1.2 km',
      price: '$35/month',
    },
    {
      id: '3',
      name: 'Zen Fitness Studio',
      image: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg',
      rating: 4.8,
      distance: '2.1 km',
      price: '$25/month',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Workout Space
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              One subscription, unlimited access to premium gyms near you. 
              Discover, book, and workout anywhere with Cloud GYM.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
                <MapPin className="inline h-5 w-5 mr-2" />
                Find Gyms Near Me
              </button>
              {!isAuthenticated && (
                <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-all">
                  Start Free Trial
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Cloud GYM?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience fitness freedom with our innovative platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Location-Based Discovery</h3>
              <p className="text-gray-600">
                Find gyms near you with real-time location tracking and smart recommendations
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 border border-green-100">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">One Subscription</h3>
              <p className="text-gray-600">
                Access hundreds of partner gyms with a single monthly subscription
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Easy Booking</h3>
              <p className="text-gray-600">
                Book workout slots, check-in with QR codes, and manage your fitness schedule
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gyms */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Gyms
            </h2>
            <p className="text-xl text-gray-600">
              Discover popular fitness centers in your area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredGyms.map((gym) => (
              <div key={gym.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2">
                <img
                  src={gym.image}
                  alt={gym.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{gym.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{gym.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">{gym.distance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">{gym.price}</span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of fitness enthusiasts who've discovered the freedom of Cloud GYM
          </p>
          {!isAuthenticated ? (
            <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
              Get Started Today
            </button>
          ) : (
            <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
              <MapPin className="inline h-5 w-5 mr-2" />
              Find Gyms Near Me
            </button>
          )}
        </div>
      </section>
    </div>
  );
};