import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { apiService } from '../../services/api';
import { Gym, Location } from '../../types';
import { GymCard } from '../gym/GymCard';
import { GymMap } from '../gym/GymMap';
import { LocationDisplay } from '../location/LocationDisplay';

export const GymFinderPage: React.FC = () => {
  const { location, loading: locationLoading, error: locationError, refreshLocation } = useGeolocation(false, false);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchRadius, setSearchRadius] = useState(5);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchNearbyGyms = async (userLocation?: Location) => {
    const searchLocation = userLocation || location;
    
    if (!searchLocation) {
      setError('Location is required to find nearby gyms');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      console.log('=== FETCHING NEARBY GYMS ===');
      console.log('Location:', searchLocation);
      console.log('Radius:', searchRadius);

      const response = await apiService.getNearbyGyms(
        searchLocation.latitude,
        searchLocation.longitude,
        searchRadius
      );

      const nearbyGyms = Array.isArray(response) ? response : [];
      console.log('API Response:', nearbyGyms);
      console.log('Number of gyms found:', nearbyGyms.length);

      const gymsWithDistance = nearbyGyms.map((gym: any) => ({
        ...gym,
        distance: gym.distance ?? calculateDistance(
          searchLocation.latitude,
          searchLocation.longitude,
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
    const R = 6371; // Earth's radius in kilometers
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

  const handleFindGymsNearMe = async () => {
    console.log('=== FIND GYMS NEAR ME CLICKED ===');
    
    if (location) {
      console.log('Using existing location:', location);
      await fetchNearbyGyms(location);
    } else {
      console.log('Requesting new location...');
      try {
        const newLocation = await requestUserLocation();
        if (newLocation) {
          await fetchNearbyGyms(newLocation);
        }
      } catch (err) {
        console.error('Failed to get location:', err);
        setError('Unable to get your location. Please enable location services and try again.');
      }
    }
  };

  const requestUserLocation = (): Promise<Location | null> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log('New location obtained:', newLocation);
          resolve(newLocation);
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Unable to retrieve your location.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        options
      );
    });
  };

  const handleRadiusChange = (newRadius: number) => {
    setSearchRadius(newRadius);
    if (location && hasSearched) {
      fetchNearbyGyms();
    }
  };

  const handleGymSelect = (gym: Gym) => {
    setSelectedGym(gym);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Gyms Near You</h1>
          <p className="text-xl text-gray-600">Discover and explore fitness centers in your area</p>
        </div>

        {/* Location Display */}
        <div className="mb-6">
          <LocationDisplay
            location={location}
            loading={locationLoading}
            error={locationError}
            onRefresh={refreshLocation}
          />
        </div>

        {/* Search Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Search Radius:</label>
                <select
                  value={searchRadius}
                  onChange={(e) => handleRadiusChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 km</option>
                  <option value={2}>2 km</option>
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={20}>20 km</option>
                </select>
              </div>

              {gyms.length > 0 && (
                <div className="text-sm text-gray-600">
                  Found {gyms.length} gym{gyms.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleFindGymsNearMe}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="h-5 w-5" />
                    <span>Find Gyms Near Me</span>
                  </>
                )}
              </button>

              {hasSearched && (
                <button
                  onClick={() => fetchNearbyGyms()}
                  disabled={loading || !location}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={handleFindGymsNearMe}
              className="mt-3 text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Searching for nearby gyms...</p>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="order-2 lg:order-1">
              <GymMap
                gyms={gyms}
                userLocation={location}
                selectedGym={selectedGym}
                onGymSelect={handleGymSelect}
              />
            </div>

            {/* Gym List */}
            <div className="order-1 lg:order-2">
              <div className="space-y-4">
                {gyms.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No gyms found</h3>
                    <p className="text-gray-600 mb-4">
                      Try increasing your search radius or check a different location.
                    </p>
                    <button
                      onClick={() => handleRadiusChange(searchRadius * 2)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Expand Search Radius
                    </button>
                  </div>
                ) : (
                  gyms.map((gym) => (
                    <GymCard
                      key={gym.id}
                      gym={gym}
                      onSelect={handleGymSelect}
                      showDistance={true}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && !loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find Gyms?</h3>
              <p className="text-gray-600 mb-6">
                Click the "Find Gyms Near Me" button to discover fitness centers in your area.
              </p>
              <button
                onClick={handleFindGymsNearMe}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                <Navigation className="inline h-5 w-5 mr-2" />
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};