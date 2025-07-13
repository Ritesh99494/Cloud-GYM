import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
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

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        setError('Google Maps API key not found. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
        setLoading(false);
        return;
      }

      try {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();

        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: userLocation
              ? { lat: userLocation.latitude, lng: userLocation.longitude }
              : { lat: 40.7128, lng: -74.0060 }, // Default to NYC
            zoom: 13,
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
          });

          setMap(mapInstance);
        }
      } catch (err) {
        setError('Failed to load Google Maps. Please check your API key and internet connection.');
        console.error('Google Maps loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    initMap();
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!map || !userLocation) return;

    // Remove existing user marker
    if (userMarker) {
      userMarker.setMap(null);
    }

    // Create new user marker
    const marker = new google.maps.Marker({
      position: { lat: userLocation.latitude, lng: userLocation.longitude },
      map,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
      zIndex: 1000,
    });

    // Add pulsing animation
    const pulseMarker = new google.maps.Marker({
      position: { lat: userLocation.latitude, lng: userLocation.longitude },
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 20,
        fillColor: '#4285F4',
        fillOpacity: 0.3,
        strokeColor: '#4285F4',
        strokeWeight: 1,
      },
      zIndex: 999,
    });

    setUserMarker(marker);

    // Center map on user location
    map.setCenter({ lat: userLocation.latitude, lng: userLocation.longitude });

    // Create info window for user location
    const userInfoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <div class="flex items-center space-x-2 mb-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span class="font-semibold text-gray-900">Your Location</span>
          </div>
          <p class="text-sm text-gray-600">
            ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}
          </p>
        </div>
      `
    });

    marker.addListener('click', () => {
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

    // Clear existing gym markers
    gymMarkers.forEach(marker => marker.setMap(null));

    // Create new gym markers
    const newMarkers = gyms.map((gym) => {
      const marker = new google.maps.Marker({
        position: { lat: gym.latitude, lng: gym.longitude },
        map,
        title: gym.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#DC2626" stroke="white" stroke-width="3"/>
              <path d="M12 10h8v2h-8v-2zm0 4h8v2h-8v-2zm0 4h8v2h-8v-2z" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
        },
        zIndex: selectedGym?.id === gym.id ? 999 : 500,
      });

      // Create info window for gym
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <div class="flex items-start space-x-3 mb-3">
              <img src="${gym.images[0] || 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg'}" 
                   alt="${gym.name}" class="w-16 h-16 rounded-lg object-cover">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 mb-1">${gym.name}</h3>
                <div class="flex items-center space-x-1 mb-1">
                  <span class="text-yellow-500">★</span>
                  <span class="text-sm font-medium">${gym.rating}</span>
                  <span class="text-xs text-gray-500">(${gym.reviewCount})</span>
                </div>
                <p class="text-xs text-gray-600">${gym.address}</p>
              </div>
            </div>
            
            <div class="mb-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-gray-700">Occupancy</span>
                <span class="text-xs text-gray-600">${gym.currentOccupancy}/${gym.capacity}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5">
                <div class="bg-${Math.round((gym.currentOccupancy / gym.capacity) * 100) < 50 ? 'green' : Math.round((gym.currentOccupancy / gym.capacity) * 100) < 80 ? 'yellow' : 'red'}-500 h-1.5 rounded-full" 
                     style="width: ${Math.round((gym.currentOccupancy / gym.capacity) * 100)}%"></div>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-blue-600">${gym.priceRange}</span>
              ${gym.distance ? `<span class="text-xs text-gray-500">${gym.distance.toFixed(1)} km away</span>` : ''}
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        // Close other info windows
        gymMarkers.forEach(m => {
          const iw = (m as any).infoWindow;
          if (iw) iw.close();
        });
        
        infoWindow.open(map, marker);
        onGymSelect?.(gym);
      });

      // Store info window reference
      (marker as any).infoWindow = infoWindow;

      return marker;
    });

    setGymMarkers(newMarkers);

    // Auto-fit bounds to show all markers
    if (newMarkers.length > 0 || userLocation) {
      const bounds = new google.maps.LatLngBounds();
      
      if (userLocation) {
        bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude });
      }
      
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition()!);
      });
      
      map.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom()! > 15) map.setZoom(15);
        google.maps.event.removeListener(listener);
      });
    }

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, gyms, selectedGym]);

  // Highlight selected gym
  useEffect(() => {
    if (!selectedGym || !map) return;

    gymMarkers.forEach(marker => {
      const gym = gyms.find(g => 
        g.latitude === marker.getPosition()?.lat() && 
        g.longitude === marker.getPosition()?.lng()
      );
      
      if (gym?.id === selectedGym.id) {
        marker.setZIndex(999);
        // Open info window for selected gym
        const infoWindow = (marker as any).infoWindow;
        if (infoWindow) {
          infoWindow.open(map, marker);
        }
        // Center map on selected gym
        map.setCenter(marker.getPosition()!);
      } else {
        marker.setZIndex(500);
      }
    });
  }, [selectedGym, gymMarkers, gyms, map]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-100 rounded-xl flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-red-50 border border-red-200 rounded-xl flex items-center justify-center p-6`}>
        <div className="text-center">
          <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 font-medium mb-1">Map Loading Error</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} rounded-xl overflow-hidden shadow-lg border border-gray-200`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};