import React, { useState, useRef, useEffect } from 'react';
import { Save, MapPin, Clock, Users, DollarSign, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';
import { apiService } from '../../services/api';

interface GymFormData {
  name: string;
  description: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  membershipPrice: number | null;
  capacity: number | null;
  operatingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  amenities: string[];
  contactPhone: string;
  contactEmail: string;
}

const AMENITY_OPTIONS = [
  'WiFi', 'Parking', 'Locker Rooms', 'Showers', 'Sauna', 'Steam Room',
  'Swimming Pool', 'Cardio Equipment', 'Free Weights', 'Weight Machines',
  'Group Classes', 'Personal Training', 'Yoga Studio', 'Pilates',
  'Basketball Court', 'Tennis Court', 'Rock Climbing', 'Juice Bar'
];

export const GymManagementForm: React.FC = () => {
  const [formData, setFormData] = useState<GymFormData>({
    name: '',
    description: '',
    address: '',
    latitude: null,
    longitude: null,
    membershipPrice: null,
    capacity: null,
    operatingHours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '08:00', close: '20:00' },
      sunday: { open: '08:00', close: '20:00' },
    },
    amenities: [],
    contactPhone: '',
    contactEmail: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  
  // Map-related state
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      console.log('=== INITIALIZING GOOGLE MAPS FOR ADMIN ===');
      
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;
      
      if (!apiKey) {
        console.error('Google Maps API key not found');
        setMapError('Google Maps API key not found. Please add VITE_GOOGLE_MAPS_API_KEY to your .env.local file.');
        setMapLoading(false);
        return;
      }

      try {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places'],
          ...(mapId && { mapIds: [mapId] }),
        });

        await loader.load();
        console.log('Google Maps API loaded successfully');

        if (mapRef.current) {
          const initialPosition = { lat: 19.0760, lng: 72.8777 }; // Default to Mumbai

          const newMap = new google.maps.Map(mapRef.current, {
            center: initialPosition,
            zoom: 12,
            ...(mapId && { mapId }),
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
          });

          // Create marker (use AdvancedMarkerElement if mapId is available, otherwise use regular Marker)
          let newMarker: google.maps.marker.AdvancedMarkerElement | google.maps.Marker;
          
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
              console.log('Map clicked at:', { lat: clickedLat, lng: clickedLng });
              
              setFormData(prev => ({
                ...prev,
                latitude: clickedLat,
                longitude: clickedLng,
              }));

             // Update marker position safely depending on marker type
if ('setPosition' in newMarker && typeof newMarker.setPosition === 'function') {
  // Classic Marker
  (newMarker as google.maps.Marker).setPosition({ lat: clickedLat, lng: clickedLng });
} else if ('position' in newMarker) {
  // AdvancedMarkerElement
  newMarker.position = new google.maps.LatLng(clickedLat, clickedLng);
}

              // Reverse geocode to get address
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode({ location: { lat: clickedLat, lng: clickedLng } }, (results, status) => {
                if (status === 'OK' && results?.[0]) {
                  const address = results[0].formatted_address;
                  console.log('Reverse geocoded address:', address);
                  
                  setFormData(prev => ({
                    ...prev,
                    address: address,
                  }));
                  
                  if (addressInputRef.current) {
                    addressInputRef.current.value = address;
                  }
                }
              });
            }
          });

          // Initialize autocomplete for address input
          if (addressInputRef.current) {
            const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
              types: ['establishment', 'geocode'],
            });

            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();
              console.log('Place selected:', place);
              
              if (place.geometry?.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                
                console.log('Coordinates from place:', { lat, lng });
                
                setFormData(prev => ({
                  ...prev,
                  address: place.formatted_address || place.name || '',
                  latitude: lat,
                  longitude: lng,
                }));

                newMap.setCenter({ lat, lng });
                newMap.setZoom(15);

               // Update marker position safely depending on marker type
if ('setPosition' in newMarker && typeof newMarker.setPosition === 'function') {
  // It's a classic google.maps.Marker
  (newMarker as google.maps.Marker).setPosition({ lat, lng });
} else if ('position' in newMarker) {
  // It's an AdvancedMarkerElement
  newMarker.position = new google.maps.LatLng(lat, lng);
}

              }
            });

            autocompleteRef.current = autocomplete;
          }

          setMap(newMap);
          setMarker(newMarker as any);
          setMapLoading(false);
          setMapError(null);
          console.log('Map initialized successfully');
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapError('Failed to load Google Maps API. Please check your API key.');
        setMapLoading(false);
      }
    };

    initializeMap();
  }, []);

  const validateForm = () => {
    console.log('=== VALIDATING FORM ===');
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Gym name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.latitude || !formData.longitude) newErrors.location = 'Please select a location on the map';
    if (!formData.membershipPrice || formData.membershipPrice <= 0) newErrors.membershipPrice = 'Valid membership price is required';
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = 'Valid capacity is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (formData.contactPhone && !phoneRegex.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION START ===');
    console.log('Form data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setErrors({});

    try {
      const gymData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        latitude: formData.latitude!,
        longitude: formData.longitude!,
        priceRange: `$${formData.membershipPrice}`,
        capacity: formData.capacity!,
        amenities: formData.amenities,
        operatingHours: Object.fromEntries(
          Object.entries(formData.operatingHours).map(([day, hours]) => [
            day,
            `${hours.open}-${hours.close}`
          ])
        ),
        contactInfo: {
          phone: formData.contactPhone,
          email: formData.contactEmail,
        },
        images: ['https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg'],
        rating: 0,
        reviewCount: 0,
        currentOccupancy: 0,
      };

      console.log('Sending gym data to API:', gymData);

      const response = await apiService.createGym(gymData);
      console.log('API response:', response);

      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        address: '',
        latitude: null,
        longitude: null,
        membershipPrice: null,
        capacity: null,
        operatingHours: {
          monday: { open: '06:00', close: '22:00' },
          tuesday: { open: '06:00', close: '22:00' },
          wednesday: { open: '06:00', close: '22:00' },
          thursday: { open: '06:00', close: '22:00' },
          friday: { open: '06:00', close: '22:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '08:00', close: '20:00' },
        },
        amenities: [],
        contactPhone: '',
        contactEmail: '',
      });
      
      if (addressInputRef.current) {
        addressInputRef.current.value = '';
      }

      // Reset map marker to initial position
      if (map && marker) {
        const initialPosition = { lat: 19.0760, lng: 72.8777 };
        map.setCenter(initialPosition);
     if ('setPosition' in marker && typeof marker.setPosition === 'function') {
  // Classic Marker
  marker.setPosition(initialPosition);
} else if ('position' in marker) {
  // Advanced Marker
  marker.position = new google.maps.LatLng(initialPosition.lat, initialPosition.lng);
}

      }

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ general: 'Failed to create gym. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleOperatingHoursChange = (day: string, field: 'open' | 'close', value: string) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day as keyof typeof prev.operatingHours],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Gym</h2>
          <p className="text-gray-600 mt-2">Create a new gym location with all necessary details</p>
        </div>

        {success && (
          <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Success!</span>
            </div>
            <p className="text-green-700 mt-1">Gym created successfully and added to the database.</p>
          </div>
        )}

        {errors.general && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gym Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter gym name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membership Price ($/month) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.membershipPrice || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, membershipPrice: Number(e.target.value) }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.membershipPrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                />
              </div>
              {errors.membershipPrice && <p className="mt-1 text-sm text-red-600">{errors.membershipPrice}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the gym facilities and features"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={addressInputRef}
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Search for address or click on map"
              />
            </div>
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Coordinates Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="text"
                value={formData.latitude ?? ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="Click on map to set location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="text"
                value={formData.longitude ?? ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="Click on map to set location"
              />
            </div>
          </div>

          {/* Map */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location on Map *
            </label>
            <div className="w-full h-96 rounded-lg border border-gray-300 overflow-hidden">
              {mapLoading ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              ) : mapError ? (
                <div className="w-full h-full bg-red-50 flex items-center justify-center p-4">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-700 text-sm">{mapError}</p>
                  </div>
                </div>
              ) : (
                <div ref={mapRef} className="w-full h-full" />
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Search for an address above or click on the map to set the gym location
            </p>
            {formData.latitude && formData.longitude && (
              <p className="mt-1 text-xs text-green-600">
                Location set: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Capacity *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.capacity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
                min="1"
              />
            </div>
            {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
          </div>

          {/* Operating Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              <Clock className="inline h-5 w-5 mr-2" />
              Operating Hours
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(formData.operatingHours).map(([day, hours]) => (
                <div key={day} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 capitalize">{day}</h4>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Amenities & Equipment
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {AMENITY_OPTIONS.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
            {formData.amenities.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {formData.amenities.length} amenities
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.contactPhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter contact phone"
                />
              </div>
              {errors.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.contactEmail ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter contact email"
                />
              </div>
              {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Gym...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Create Gym</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};