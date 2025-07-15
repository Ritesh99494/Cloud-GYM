import { useState, useEffect } from 'react';
import { Location } from '../types';

interface GeolocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
  accuracy: number | null;
  timestamp: number | null;
}

export const useGeolocation = (enableHighAccuracy = true, watchPosition = true) => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
    accuracy: null,
    timestamp: null,
  });

  useEffect(() => {
    console.log('=== GEOLOCATION DEBUG START ===');
    console.log('Geolocation hook initialized with:', { enableHighAccuracy, watchPosition });
    
    if (!navigator.geolocation) {
      console.error('Geolocation not supported by browser');
      setState({
        location: null,
        loading: false,
        error: 'Geolocation is not supported by this browser.',
        accuracy: null,
        timestamp: null,
      });
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy,
      timeout: 15000,
      maximumAge: watchPosition ? 60000 : 300000, // 1 minute for watch, 5 minutes for single request
    };
    
    console.log('Geolocation options:', options);

    const handleSuccess = (position: GeolocationPosition) => {
      console.log('=== GEOLOCATION SUCCESS ===');
      console.log('Position received:', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(position.timestamp).toISOString()
      });
      
      setState({
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        loading: false,
        error: null,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error('=== GEOLOCATION ERROR ===');
      console.error('Geolocation error code:', error.code);
      console.error('Geolocation error message:', error.message);
      
      let errorMessage = 'Unable to retrieve your location.';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location services.';
          console.error('User denied location permission');
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          console.error('Location information unavailable');
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          console.error('Location request timeout');
          break;
      }

      setState({
        location: null,
        loading: false,
        error: errorMessage,
        accuracy: null,
        timestamp: null,
      });
    };

    console.log('Requesting current position...');
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    let watchId: number | undefined;
    
    // Watch position for real-time updates if enabled
    if (watchPosition) {
      console.log('Starting position watch...');
      watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        { ...options, maximumAge: 30000 } // More frequent updates for watching
      );
      console.log('Position watch started with ID:', watchId);
    }

    return () => {
      if (watchId !== undefined) {
        console.log('Clearing position watch:', watchId);
        navigator.geolocation.clearWatch(watchId);
      }
      console.log('=== GEOLOCATION DEBUG END ===');
    };
  }, [enableHighAccuracy, watchPosition]);

  const refreshLocation = () => {
    console.log('=== MANUAL LOCATION REFRESH ===');
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null 
    }));
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Manual refresh successful:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.error('Manual refresh failed:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to refresh location.',
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const getLocationString = () => {
    if (!state.location) return null;
    return `${state.location.latitude.toFixed(6)}, ${state.location.longitude.toFixed(6)}`;
  };

  const getDistanceFromLocation = (targetLat: number, targetLng: number): number | null => {
    if (!state.location) return null;
    
    console.log('Calculating distance from current location to:', { targetLat, targetLng });
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = (targetLat - state.location.latitude) * Math.PI / 180;
    const dLng = (targetLng - state.location.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(state.location.latitude * Math.PI / 180) * Math.cos(targetLat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    console.log('Calculated distance:', distance, 'km');
    return distance;
  };

  return {
    ...state,
    refreshLocation,
    getLocationString,
    getDistanceFromLocation,
  };
};