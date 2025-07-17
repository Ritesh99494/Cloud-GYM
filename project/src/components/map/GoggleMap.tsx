import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Navigation, Loader2, AlertTriangle } from 'lucide-react';
import { Gym, Location } from '../../types';

interface GoogleMapProps {
  gyms: Gym[];
  userLocation: Location | null;
  selectedGym?: Gym | null;
  onGymSelect?: (gym: Gym) => void;
  className?: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  gyms,
  userLocation,
  selectedGym,
  onGymSelect,
  className = "h-96"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
  const [gymMarkers, setGymMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([]);

  // Helper function to convert Location to LatLngLiteral
  const locationToLatLng = (location: Location): google.maps.LatLngLiteral => ({
    lat: location.latitude,
    lng: location.longitude
  });

  // Helper function to convert gym coordinates to LatLngLiteral
  const gymToLatLng = (gym: Gym): google.maps.LatLngLiteral => ({
    lat: gym.latitude,
    lng: gym.longitude
  });

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      console.log('=== GOOGLE MAPS INITIALIZATION START ===');
      
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error('Google Maps API key not found');
        setError('Google Maps API key not found. Please add VITE_GOOGLE_MAPS_API_KEY to your .env.local file.');
        setLoading(false);
        return;
      }

      if (!mapRef.current) {
        console.error('Map container not found');
        setError('Map container not available');
        setLoading(false);
        return;
      }

      try {
        console.log('Loading Google Maps API...');
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();
        console.log('Google Maps API loaded successfully');

        // Convert userLocation to LatLngLiteral or use default
        const defaultCenter: google.maps.LatLngLiteral = { lat: 40.7128, lng: -74.0060 }; // NYC
        const mapCenter = userLocation ? locationToLatLng(userLocation) : defaultCenter;
        
        console.log('Creating map with center:', mapCenter);

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: userLocation ? 13 : 10,
          styles: [
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'poi.medical',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
        });

        console.log('Map created successfully');
        setMap(mapInstance);
        setError(null);
      } catch (err) {
        console.error('Google Maps loading error:', err);
        setError('Failed to load Google Maps. Please check your API key and internet connection.');
      } finally {
        setLoading(false);
      }
    };

    initMap();
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!map || !userLocation) return;

    console.log('=== UPDATING USER LOCATION MARKER ===');
    console.log('User location:', userLocation);

    // Remove existing user marker
    if (userMarker) {
      userMarker.setMap(null);
    }

    // Convert location to LatLngLiteral
    const userPosition = locationToLatLng(userLocation);

    // Create new user marker with pulsing animation
    const marker = new google.maps.Marker({
      position: userPosition,
      map,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
      zIndex: 1000,
    });

    // Add pulsing animation circle
    const pulseMarker = new google.maps.Marker({
      position: userPosition,
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 25,
        fillColor: '#4285F4',
        fillOpacity: 0.2,
        strokeColor: '#4285F4',
        strokeWeight: 1,
      },
      zIndex: 999,
    });

    setUserMarker(marker);

    // Create info window for user location
    const userInfoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-3 min-w-[200px]">
          <div class="flex items-center space-x-2 mb-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span class="font-semibold text-gray-900">Your Location</span>
          </div>
          <p class="text-sm text-gray-600 mb-2">
            ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}
          </p>
          <p class="text-xs text-gray-500">
            Click "Find Gyms Near Me" to discover nearby fitness centers
          </p>
        </div>
      `
    });

    marker.addListener('click', () => {
      // Close other info windows
      infoWindows.forEach(iw => iw.close());
      userInfoWindow.open(map, marker);
    });

    return () => {
      marker.setMap(null);
      pulseMarker.setMap(null);
    };
  }, [map, userLocation]);

  // Update gym markers
  useEffect(() => {
    if (!map) return;

    console.log('=== UPDATING GYM MARKERS ===');
    console.log('Number of gyms:', gyms.length);

    // Clear existing gym markers and info windows
    gymMarkers.forEach(marker => marker.setMap(null));
    infoWindows.forEach(iw => iw.close());

    if (gyms.length === 0) {
      setGymMarkers([]);
      setInfoWindows([]);
      return;
    }

    // Create new gym markers
    const newMarkers: google.maps.Marker[] = [];
    const newInfoWindows: google.maps.InfoWindow[] = [];

    gyms.forEach((gym) => {
      // Convert gym coordinates to LatLngLiteral
      const gymPosition = gymToLatLng(gym);

      const marker = new google.maps.Marker({
        position: gymPosition,
        map,
        title: gym.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40S32 24.837 32 16C32 7.163 24.837 0 16 0Z" fill="#DC2626"/>
              <circle cx="16" cy="16" r="8" fill="white"/>
              <path d="M12 12h8v2h-8v-2zm0 3h8v2h-8v-2zm0 3h8v2h-8v-2z" fill="#DC2626"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 40),
          anchor: new google.maps.Point(16, 40),
        },
        zIndex: selectedGym?.id === gym.id ? 999 : 500,
      });

      // Create info window for gym
      const occupancyPercentage = Math.round((gym.currentOccupancy / gym.capacity) * 100);
      const occupancyColor = occupancyPercentage < 50 ? 'green' : occupancyPercentage < 80 ? 'yellow' : 'red';

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-4 max-w-sm">
            <div class="flex items-start space-x-3 mb-3">
              <img src="${gym.images[0] || 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg'}" 
                   alt="${gym.name}" class="w-16 h-16 rounded-lg object-cover">
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-900 mb-1 truncate">${gym.name}</h3>
                <div class="flex items-center space-x-1 mb-1">
                  <span class="text-yellow-500">★</span>
                  <span class="text-sm font-medium">${gym.rating}</span>
                  <span class="text-xs text-gray-500">(${gym.reviewCount})</span>
                </div>
                <p class="text-xs text-gray-600 truncate">${gym.address}</p>
              </div>
            </div>
            
            <div class="mb-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-gray-700">Occupancy</span>
                <span class="text-xs text-gray-600">${gym.currentOccupancy}/${gym.capacity}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-${occupancyColor}-500 h-2 rounded-full transition-all" 
                     style="width: ${occupancyPercentage}%"></div>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-blue-600">${gym.priceRange}</span>
              ${gym.distance ? `<span class="text-xs text-gray-500">${gym.distance.toFixed(1)} km away</span>` : ''}
            </div>
            
            <div class="mt-3 pt-3 border-t border-gray-200">
              <div class="flex flex-wrap gap-1">
                ${gym.amenities.slice(0, 3).map(amenity => 
                  `<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">${amenity}</span>`
                ).join('')}
                ${gym.amenities.length > 3 ? `<span class="text-xs text-gray-500">+${gym.amenities.length - 3} more</span>` : ''}
              </div>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        // Close other info windows
        newInfoWindows.forEach(iw => iw.close());
        infoWindow.open(map, marker);
        onGymSelect?.(gym);
      });

      newMarkers.push(marker);
      newInfoWindows.push(infoWindow);
    });

    setGymMarkers(newMarkers);
    setInfoWindows(newInfoWindows);

    // Auto-fit bounds to show all markers
    if (newMarkers.length > 0 || userLocation) {
      const bounds = new google.maps.LatLngBounds();
      
      if (userLocation) {
        bounds.extend(locationToLatLng(userLocation));
      }
      
      newMarkers.forEach(marker => {
        const position = marker.getPosition();
        if (position) {
          bounds.extend(position);
        }
      });
      
      map.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom()! > 15) map.setZoom(15);
        google.maps.event.removeListener(listener);
      });
    }
  }, [map, gyms, selectedGym, onGymSelect, userLocation]);

  // Highlight selected gym
  useEffect(() => {
    if (!selectedGym || !map) return;

    console.log('=== HIGHLIGHTING SELECTED GYM ===');
    console.log('Selected gym:', selectedGym.name);

    gymMarkers.forEach((marker, index) => {
      const gym = gyms[index];
      if (gym?.id === selectedGym.id) {
        marker.setZIndex(999);
        // Open info window for selected gym
        const infoWindow = infoWindows[index];
        if (infoWindow) {
          infoWindows.forEach(iw => iw.close());
          infoWindow.open(map, marker);
        }
        // Center map on selected gym
        const position = marker.getPosition();
        if (position) {
          map.setCenter(position);
        }
      } else {
        marker.setZIndex(500);
      }
    });
  }, [selectedGym, gymMarkers, gyms, map, infoWindows]);

  if (loading) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center border border-gray-200`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-700 font-medium">Loading Google Maps...</p>
          <p className="text-gray-500 text-sm mt-1">Please wait while we initialize the map</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-red-50 border border-red-200 rounded-xl flex items-center justify-center p-6`}>
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Map Loading Error</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <div className="space-y-2 text-xs text-red-500">
            <p>• Check your Google Maps API key in .env.local</p>
            <p>• Ensure you have enabled Maps JavaScript API</p>
            <p>• Verify your internet connection</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} rounded-xl overflow-hidden shadow-lg border border-gray-200 relative`}>
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>You</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>Gyms</span>
          </div>
        </div>
      </div>

      {/* Gym Count Badge */}
      {gyms.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white rounded-full shadow-md px-3 py-1">
          <span className="text-sm font-medium text-gray-700">
            {gyms.length} gym{gyms.length !== 1 ? 's' : ''} found
          </span>
        </div>
      )}
    </div>
  );
};