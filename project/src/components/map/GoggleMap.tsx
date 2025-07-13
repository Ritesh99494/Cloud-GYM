import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Loader2, MapPin } from 'lucide-react';
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
  className = 'h-96'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMarker, setUserMarker] = useState<any>(null);
  const [gymMarkers, setGymMarkers] = useState<any[]>([]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

    if (!apiKey || !mapId) {
      setError('Google Maps API key or Map ID not found. Please add VITE_GOOGLE_MAPS_API_KEY and VITE_GOOGLE_MAP_ID to your .env file.');
      setLoading(false);
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'marker']
    });

    loader.load().then(() => {
      if (mapRef.current && userLocation) {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: userLocation.latitude, lng: userLocation.longitude },
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
          mapId: mapId
        });
        setMap(mapInstance);
      }
    }).catch(err => {
      setError('Failed to load Google Maps.');
      console.error(err);
    }).finally(() => setLoading(false));
  }, [userLocation]);

  useEffect(() => {
    if (!map || !userLocation || !google.maps.marker?.AdvancedMarkerElement) return;

    userMarker?.map && userMarker.setMap(null);

    const userDOM = document.createElement('div');
    userDOM.style.backgroundColor = '#4285F4';
    userDOM.style.border = '2px solid white';
    userDOM.style.borderRadius = '50%';
    userDOM.style.width = '16px';
    userDOM.style.height = '16px';

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: new google.maps.LatLng(userLocation.latitude, userLocation.longitude),
      title: 'Your Location',
      content: userDOM
    });

    setUserMarker(marker);
    map.setCenter(marker.position!);
  }, [map, userLocation]);

  useEffect(() => {
    if (!map || !google.maps.marker?.AdvancedMarkerElement) return;

    gymMarkers.forEach(marker => marker.map && marker.setMap(null));

    const newMarkers = gyms.map(gym => {
      const gymDOM = document.createElement('div');
      gymDOM.style.backgroundColor = '#DC2626';
      gymDOM.style.border = '2px solid white';
      gymDOM.style.borderRadius = '50%';
      gymDOM.style.width = '16px';
      gymDOM.style.height = '16px';

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: new google.maps.LatLng(gym.latitude, gym.longitude),
        title: gym.name,
        content: gymDOM
      });

      marker.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${gym.name}</strong><br/>${gym.address}</div>`
        });
        infoWindow.open(map, marker);
        onGymSelect?.(gym);
      });

      return marker;
    });

    setGymMarkers(newMarkers);

    const bounds = new google.maps.LatLngBounds();
    if (userLocation) bounds.extend(new google.maps.LatLng(userLocation.latitude, userLocation.longitude));
    newMarkers.forEach(marker => bounds.extend(marker.position!));
    map.fitBounds(bounds);
  }, [map, gyms]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-md`}>
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-700">Loading map...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-red-100 text-red-700 rounded-md p-4`}>
        <MapPin className="h-6 w-6 mr-2" />
        {error}
      </div>
    );
  }

  return <div ref={mapRef} className={`w-full ${className} rounded-lg`} />;
};
