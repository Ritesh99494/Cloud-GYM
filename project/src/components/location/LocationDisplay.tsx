import React from 'react';
import { MapPin, Navigation, RefreshCw, AlertCircle } from 'lucide-react';
import { Location } from '../../types';

interface LocationDisplayProps {
  location: Location | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  className?: string;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  location,
  loading,
  error,
  onRefresh,
  className = ""
}) => {
  const formatCoordinate = (coord: number, type: 'lat' | 'lng') => {
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${Math.abs(coord).toFixed(6)}° ${direction}`;
  };

  const getLocationAccuracy = () => {
    // Simulated accuracy - in real app, you'd get this from the geolocation API
    return "±10 meters";
  };

  if (loading) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Navigation className="h-5 w-5 text-blue-600 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
          </div>
          <div>
            <p className="text-blue-800 font-medium">Detecting your location...</p>
            <p className="text-blue-600 text-sm">Please allow location access</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Location Error</p>
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={onRefresh}
              className="inline-flex items-center space-x-2 text-red-700 hover:text-red-800 font-medium text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-gray-700 font-medium">Location not available</p>
              <p className="text-gray-500 text-sm">Enable location services to find nearby gyms</p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Enable
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <MapPin className="h-5 w-5 text-green-600" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div>
            <p className="text-green-800 font-medium mb-1">Location detected</p>
            <div className="space-y-1 text-sm text-green-700">
              <div className="flex items-center space-x-4">
                <span>Lat: {formatCoordinate(location.latitude, 'lat')}</span>
                <span>Lng: {formatCoordinate(location.longitude, 'lng')}</span>
              </div>
              <p className="text-green-600">Accuracy: {getLocationAccuracy()}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="text-xs text-green-600">Last updated</p>
            <p className="text-xs text-green-700 font-medium">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="p-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded transition-colors"
            title="Refresh location"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Location details */}
      <div className="mt-3 pt-3 border-t border-green-200">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-green-600">Decimal Degrees:</span>
            <p className="text-green-800 font-mono">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
          </div>
          <div>
            <span className="text-green-600">Status:</span>
            <p className="text-green-800 font-medium">Active & Tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
};