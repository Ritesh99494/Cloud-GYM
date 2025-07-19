import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Building2, Phone, Mail, Clock, Users, Wifi, Car, Dumbbell, Save, X } from 'lucide-react';

interface FormData {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  capacity: number;
  amenities: string[];
  operatingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
}

const AMENITY_OPTIONS = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'equipment', label: 'Modern Equipment', icon: Dumbbell },
  { id: 'locker', label: 'Lockers', icon: Building2 },
  { id: 'shower', label: 'Showers', icon: Building2 },
  { id: 'sauna', label: 'Sauna', icon: Building2 },
];

export const GymManagementForm: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    latitude: null,
    longitude: null,
    capacity: 100,
    amenities: [],
    operatingHours: {
      monday: '06:00-22:00',
      tuesday: '06:00-22:00',
      wednesday: '06:00-22:00',
      thursday: '06:00-22:00',
      friday: '06:00-22:00',
      saturday: '08:00-20:00',
      sunday: '08:00-20:00',
    },
    contactInfo: {
      phone: '',
      email: '',
    },
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    try {
      setIsMapLoading(true);
      setMapError(null);

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

      if (!apiKey) {
        throw new Error('Google Maps API key not found');
      }

      const loader = new Loader({
        apiKey,
        version: 'weekly',
        libraries: ['places'],
        ...(mapId && { mapIds: [mapId] }),
      });

      await loader.load();

      if (!mapRef.current) {
        throw new Error('Map container not found');
      }

      const initialPosition = { lat: 19.0760, lng: 72.8777 }; // Default to Mumbai

      const newMap = new google.maps.Map(mapRef.current, {
        center: initialPosition,
        zoom: 12,
        ...(mapId && { mapId }),
      });

      let newMarker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement;

      // Use AdvancedMarkerElement if available and mapId is provided
      if (mapId && google.maps.marker?.AdvancedMarkerElement) {
        newMarker = new google.maps.marker.AdvancedMarkerElement({
          map: newMap,
          position: initialPosition,
        });
      } else {
        newMarker = new google.maps.Marker({
          map: newMap,
          position: initialPosition,
          draggable: true,
        });
      }

      // Add click listener to map
      newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
        const clickedLat = e.latLng?.lat();
        const clickedLng = e.latLng?.lng();

        if (clickedLat && clickedLng) {
          updateMarkerPosition(clickedLat, clickedLng, newMarker);
          reverseGeocode(clickedLat, clickedLng);
        }
      });

      // Add Places Autocomplete
      const input = document.getElementById('address-input') as HTMLInputElement;
      if (input) {
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', newMap);

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            newMap.setCenter({ lat, lng });
            newMap.setZoom(15);
            updateMarkerPosition(lat, lng, newMarker);
            
            setFormData(prev => ({
              ...prev,
              address: place.formatted_address || '',
              latitude: lat,
              longitude: lng,
            }));
          }
        });
      }

      setMap(newMap);
      setMarker(newMarker);
      setIsMapLoading(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(error instanceof Error ? error.message : 'Failed to load map');
      setIsMapLoading(false);
    }
  };

  const updateMarkerPosition = (
    lat: number, 
    lng: number, 
    markerInstance: google.maps.Marker | google.maps.marker.AdvancedMarkerElement
  ) => {
    const position = { lat, lng };
    
    if ('setPosition' in markerInstance) {
      markerInstance.setPosition(position);
    } else {
      markerInstance.position = position;
    }

    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));

    // Clear location-related errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.latitude;
      return newErrors;
    });
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      
      if (response.results[0]) {
        setFormData(prev => ({
          ...prev,
          address: response.results[0].formatted_address,
        }));
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedInputChange = (parent: keyof FormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value,
      },
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Gym name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.latitude === null || formData.longitude === null) {
      newErrors.latitude = 'Please select a location on the map';
    }

    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    if (!formData.contactInfo.phone.trim()) {
      newErrors.contactInfo = 'Phone number is required';
    }

    if (!formData.contactInfo.email.trim()) {
      newErrors.contactInfo = 'Email is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitMessage({ type: 'error', text: 'Please fix the errors above' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/gyms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create gym');
      }

      setSubmitMessage({ type: 'success', text: 'Gym created successfully!' });
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        latitude: null,
        longitude: null,
        capacity: 100,
        amenities: [],
        operatingHours: {
          monday: '06:00-22:00',
          tuesday: '06:00-22:00',
          wednesday: '06:00-22:00',
          thursday: '06:00-22:00',
          friday: '06:00-22:00',
          saturday: '08:00-20:00',
          sunday: '08:00-20:00',
        },
        contactInfo: {
          phone: '',
          email: '',
        },
      });

      // Reset map to initial position
      if (map && marker) {
        const initialPosition = { lat: 19.0760, lng: 72.8777 };
        map.setCenter(initialPosition);
        map.setZoom(12);
        
        if ('setPosition' in marker) {
          marker.setPosition(initialPosition);
        } else {
          marker.position = initialPosition;
        }
      }

    } catch (error) {
      console.error('Error creating gym:', error);
      setSubmitMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to create gym' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-hide success message
  useEffect(() => {
    if (submitMessage?.type === 'success') {
      const timer = setTimeout(() => {
        setSubmitMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Add New Gym</h2>
      </div>

      {submitMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          submitMessage.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {submitMessage.type === 'success' ? (
            <Save className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gym Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter gym name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity *
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.capacity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Maximum capacity"
              min="1"
            />
            {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <input
            id="address-input"
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter gym address or search"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        {/* Location on Map */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location on Map *
          </label>
          <div className="border rounded-lg overflow-hidden">
            {isMapLoading && (
              <div className="h-96 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
            
            {mapError && (
              <div className="h-96 flex items-center justify-center bg-red-50">
                <div className="text-center text-red-600">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p>Error loading map: {mapError}</p>
                </div>
              </div>
            )}
            
            <div 
              ref={mapRef} 
              className={`h-96 ${isMapLoading || mapError ? 'hidden' : ''}`}
            />
          </div>
          
          {formData.latitude && formData.longitude && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
            </div>
          )}
          
          {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>}
          
          <p className="mt-1 text-sm text-gray-500">
            Click on the map to set the gym location or use the address search above
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.contactInfo.phone}
              onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.contactInfo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              value={formData.contactInfo.email}
              onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.contactInfo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="gym@example.com"
            />
          </div>
        </div>
        
        {errors.contactInfo && <p className="text-sm text-red-600">{errors.contactInfo}</p>}

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AMENITY_OPTIONS.map((amenity) => {
              const Icon = amenity.icon;
              const isSelected = formData.amenities.includes(amenity.id);
              
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{amenity.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Operating Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Clock className="w-4 h-4 inline mr-1" />
            Operating Hours
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData.operatingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-3">
                <label className="w-20 text-sm text-gray-600 capitalize">
                  {day}:
                </label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => handleNestedInputChange('operatingHours', day, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="09:00-21:00"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Gym
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GymManagementForm;