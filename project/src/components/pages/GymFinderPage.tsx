import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Navigation, AlertCircle, Loader2 } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { apiService } from '../../services/api';
import { Gym, Location } from '../../types';
import { GymCard } from '../gym/GymCard';
import { GymMap } from '../gym/GymMap';
import { LocationDisplay } from '../location/LocationDisplay';

export const GymFinderPage: React.FC = () => {
  const { location, loading: locationLoading, error: locationError, refreshLocation } = useGeolocation(true, true);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchRadius, setSearchRadius] = useState(5);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);

  useEffect(() => {
    if (location && !locationLoading) {
      fetchNearbyGyms();
    }
  }, [location, locationLoading, searchRadius]);

  const fetchNearbyGyms = async () => {
    if (!location) {
      console.warn('No location available for gym search');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Calling API with:', {
        latitude: location.latitude,
        longitude: location.longitude,
        radius: searchRadius,
      });

      const response = await apiService.getNearbyGyms(
        location.latitude,
        location.longitude,
        searchRadius
      );

      const nearbyGyms = Array.isArray(response) ? response : [];
      console.log('API response:', nearbyGyms);
      console.log('Number of gyms found:', nearbyGyms.length);

      const gymsWithDistance = nearbyGyms.map((gym: any) => ({
        ...gym,
        distance: gym.distance ?? calculateDistance(
          location.latitude,
          location.longitude,
          gym.latitude,
          gym.longitude
        ),
      }));

      setGyms(gymsWithDistance);
    } catch (err) {
      console.error('Error fetching gyms:', err);
      setError('Failed to load nearby gyms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleRadiusChange = (newRadius: number) => {
    setSearchRadius(newRadius);
  };

  const handleGymSelect = (gym: Gym) => {
    setSelectedGym(gym);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Gyms Near You</h1>
          <p className="text-xl text-gray-600">Discover and book fitness centers in your area</p>
        </div>

        <div className="mb-6">
          <LocationDisplay
            location={location}
            loading={locationLoading}
            error={locationError}
            onRefresh={refreshLocation}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Settings
            </h3>
            <button
              onClick={fetchNearbyGyms}
              disabled={!location || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              <span>Search Gyms</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Search Radius:</label>
              <select
                value={searchRadius}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 km</option>
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {gyms.length > 0 && <span>Found {gyms.length} gym{gyms.length !== 1 ? 's' : ''}</span>}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Searching for nearby gyms...</p>
          </div>
        )}

        {!loading && location && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1">
              <GymMap
                gyms={gyms}
                userLocation={location}
                selectedGym={selectedGym}
                onGymSelect={handleGymSelect}
              />
            </div>

            <div className="order-1 lg:order-2">
              <div className="space-y-4">
                {gyms.length === 0 && !loading && (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No gyms found</h3>
                    <p className="text-gray-600">
                      Try increasing your search radius or check your location.
                    </p>
                  </div>
                )}

                {gyms.map((gym) => (
                  <GymCard
                    key={gym.id}
                    gym={gym}
                    onSelect={handleGymSelect}
                    showDistance={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {!location && !locationLoading && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Location Required</h3>
            <p className="text-gray-600 mb-4">
              Please enable location services to find gyms near you.
            </p>
            <button
              onClick={refreshLocation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Enable Location
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
