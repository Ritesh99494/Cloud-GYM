import { useState, useEffect } from 'react';
import { Location } from '../types';

interface GeolocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
  accuracy: number | null;
  timestamp: number | null;
}

export const useGeolocation = (enableHighAccuracy = true, watchPosition = false) => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
    accuracy: null,
    timestamp: null,
  });

  useEffect(() => {
    if (!watchPosition) return;

    console.log('=== GEOLOCATION HOOK INITIALIZED ===');
    console.log('Options:', { enableHighAccuracy, watchPosition });
    
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported by browser');
      setState({
        location: null,
        loading: false,
        error: 'Geolocation is not supported by this browser.',
        accuracy: null,
        timestamp: null,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const options: PositionOptions = {
      enableHighAccuracy,
      timeout: 15000,
      maximumAge: watchPosition ? 60000 : 300000,
    };

    const handleSuccess = (position: GeolocationPosition) => {
      console.log('=== GEOLOCATION SUCCESS ===');
      console.log('Position:', {
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
      console.warn('=== GEOLOCATION ERROR ===');
      console.warn('Error code:', error.code);
      console.warn('Error message:', error.message);
      
      let errorMessage = 'Unable to retrieve your location.';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. To enable location services, click the location icon in your browser\'s address bar or go to your browser settings and allow location access for this site.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
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
    
    if (watchPosition) {
      console.log('Starting position watch...');
      watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        { ...options, maximumAge: 30000 }
      );
      console.log('Position watch started with ID:', watchId);
    }

    return () => {
      if (watchId !== undefined) {
        console.log('Clearing position watch:', watchId);
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [enableHighAccuracy, watchPosition]);

  const refreshLocation = () => {
    console.log('=== MANUAL LOCATION REFRESH ===');
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null 
    }));
    
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by this browser.',
      }));
      return;
    }
    
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
        let errorMessage = 'Failed to refresh location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
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
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = (targetLat - state.location.latitude) * Math.PI / 180;
    const dLng = (targetLng - state.location.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(state.location.latitude * Math.PI / 180) * Math.cos(targetLat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
  };

  return {
    ...state,
    refreshLocation,
    getLocationString,
    getDistanceFromLocation,
  };
};