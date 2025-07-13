import React, { useState } from 'react';
import { MapPin, User, Bell, Menu, X, Dumbbell } from 'lucide-react';

interface HeaderProps {
  user?: any;
  location?: { latitude: number; longitude: number } | null;
  onLocationRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, location, onLocationRefresh }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cloud GYM
              </h1>
              <p className="text-xs text-gray-500">Fitness Everywhere</p>
            </div>
          </div>

          {/* Location Display */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-700">
              {location ? 'Location detected' : 'Detecting location...'}
            </span>
            {onLocationRefresh && (
              <button
                onClick={onLocationRefresh}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Refresh
              </button>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Find Gyms
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              My Bookings
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Subscription
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                {user && (
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.firstName}
                  </span>
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Profile Settings
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Subscription
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Payment Methods
                  </a>
                  <hr className="my-2" />
                  <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                    Sign Out
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                Find Gyms
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                My Bookings
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                Subscription
              </a>
              <div className="flex items-center space-x-2 pt-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700">
                  {location ? 'Location detected' : 'Detecting location...'}
                </span>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};