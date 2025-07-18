import React, { useEffect, useRef, useState } from 'react';

interface Gym {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

const GymManagementForm: React.FC = () => {
  const [gym, setGym] = useState<Gym>({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
  });

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      const initialPosition = { lat: 19.0760, lng: 72.8777 }; // Default to Mumbai

      const newMap = new google.maps.Map(mapRef.current, {
        center: initialPosition,
        zoom: 12,
        mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
      });

      newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();

        if (lat && lng) {
          setGym(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));

          if (marker) {
            marker.setMap(null);
          }

          const newMarker = new google.maps.Marker({
            position: { lat, lng },
            map: newMap,
            title: 'Gym Location',
          });

          setMarker(newMarker);
        }
      });

      setMap(newMap);
    }
  }, [map, marker]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGym({ ...gym, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!gym.name || !gym.latitude || !gym.longitude) {
      alert('Please fill in name and select a location on map.');
      return;
    }

    try {
      const res = await fetch('/api/gyms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gym),
      });

      if (!res.ok) throw new Error('Failed to submit');

      alert('Gym saved successfully!');
      setGym({ name: '', address: '', latitude: 0, longitude: 0 });

      if (marker) {
        marker.setMap(null);
        setMarker(null);
      }
    } catch (err) {
      console.error('Error saving gym:', err);
      alert('Error saving gym.');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Gym Location</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={gym.name}
          onChange={handleChange}
          placeholder="Gym Name"
          className="w-full border p-2 rounded"
        />
        <input
          name="address"
          value={gym.address}
          onChange={handleChange}
          placeholder="Address (optional)"
          className="w-full border p-2 rounded"
        />

        <div>
          <p className="text-sm text-gray-600 mb-2">
            Click on the map below to pick location
          </p>
          <div
            ref={mapRef}
            style={{ width: '100%', height: '400px', borderRadius: '12px' }}
            className="shadow"
          />
        </div>

        <p className="text-sm">
          Selected Coordinates: {gym.latitude.toFixed(6)}, {gym.longitude.toFixed(6)}
        </p>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Gym
        </button>
      </form>
    </div>
  );
};

export default GymManagementForm;
