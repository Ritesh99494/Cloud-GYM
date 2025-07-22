import React from 'react';
import { MapPin, Star, Users, Clock, Wifi, Car, Dumbbell, Zap } from 'lucide-react';
import { Gym } from '../../types';

interface GymCardProps {
  gym: Gym;
  onSelect?: (gym: Gym) => void;
  onBook?: (gym: Gym) => void;
  showDistance?: boolean;
}

export const GymCard: React.FC<GymCardProps> = ({ 
  gym, 
  onSelect, 
  onBook, 
  showDistance = true 
}) => {
  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'WiFi': <Wifi className="h-4 w-4" />,
      'Parking': <Car className="h-4 w-4" />,
      'Equipment': <Dumbbell className="h-4 w-4" />,
      'Sauna': <Zap className="h-4 w-4" />,
    };
    return icons[amenity] || <Zap className="h-4 w-4" />;
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600 bg-green-100';
    if (percentage < 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const occupancyPercentage = Math.round((gym.currentOccupancy / gym.capacity) * 100);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={gym.images[0] || 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg'}
          alt={gym.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{gym.rating}</span>
            <span className="text-xs text-gray-500">({gym.reviewCount})</span>
          </div>
        </div>
        {showDistance && gym.distance && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {gym.distance.toFixed(1)} km
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{gym.name}</h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{gym.address}</span>
          </div>
        </div>

        {/* Occupancy */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Current Occupancy</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getOccupancyColor(occupancyPercentage)}`}>
              {occupancyPercentage}% Full
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                occupancyPercentage < 50 ? 'bg-green-500' :
                occupancyPercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
            <span>{gym.currentOccupancy} people</span>
            <span>Capacity: {gym.capacity}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
  {(gym.amenities ?? []).slice(0, 4).map((amenity, index) => (
    <div
      key={index}
      className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700"
    >
      {getAmenityIcon(amenity)}
      <span>{amenity}</span>
    </div>
  ))}
  {(gym.amenities ?? []).length > 4 && (
    <div className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700">
      +{(gym.amenities ?? []).length - 4} more
    </div>
  )}
</div>
        </div>

        {/* Operating Hours */}
        <div className="mb-4 flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>
            Open: {gym.operatingHours.monday?.open || '6:00'} - {gym.operatingHours.monday?.close || '22:00'}
          </span>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <span className="text-lg font-bold text-blue-600">{gym.priceRange}</span>
          <span className="text-sm text-gray-500 ml-1">per visit</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={() => onSelect?.(gym)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onBook?.(gym)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all transform hover:scale-105"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};