import React, { useState, useEffect } from 'react';
import { Filter, Search, Navigation, Map } from 'lucide-react';
import { Gym, Location, MapFilters } from '../../types';
import { GoogleMap } from '../map/GoggleMap';

interface GymMapProps {
  gyms: Gym[];
  userLocation: Location | null;
  selectedGym?: Gym | null;
  onGymSelect?: (gym: Gym) => void;
  filters?: MapFilters;
  onFiltersChange?: (filters: MapFilters) => void;
}

export const GymMap: React.FC<GymMapProps> = ({
  gyms,
  userLocation,
  selectedGym,
  onGymSelect,
  filters,
  onFiltersChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [mapCenter, setMapCenter] = useState<Location | null>(userLocation);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  const filteredGyms = gyms.filter(gym =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCenterOnUser = () => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Nearby Gyms</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCenterOnUser}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Center on my location"
            >
              <Navigation className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search gyms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Radius (km)
                </label>
                <select
                  value={filters?.radius || 10}
                  onChange={(e) => onFiltersChange?.({ ...filters!, radius: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={20}>20 km</option>
                  <option value={50}>50 km</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Rating
                </label>
                <select
                  value={filters?.rating || 0}
                  onChange={(e) => onFiltersChange?.({ ...filters!, rating: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Any Rating</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={filters?.availability || 'all'}
                  onChange={(e) => onFiltersChange?.({ ...filters!, availability: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Gyms</option>
                  <option value="available">Available Now</option>
                  <option value="low-capacity">Low Capacity</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Google Map Container */}
      <GoogleMap
        gyms={filteredGyms}
        userLocation={userLocation}
        selectedGym={selectedGym}
        onGymSelect={onGymSelect}
        className="w-full"
        minHeight="400px"
        height="400px"
      />
         
      {/* Map Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredGyms.length} gyms</span>
          {userLocation && (
            <span>
              Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};