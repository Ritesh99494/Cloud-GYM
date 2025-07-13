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
    if (!navigator.geolocation) {
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

    const handleSuccess = (position: GeolocationPosition) => {
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
      let errorMessage = 'Unable to retrieve your location.';
      
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

      setState({
        location: null,
        loading: false,
        error: errorMessage,
        accuracy: null,
        timestamp: null,
      });
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    let watchId: number | undefined;
    
    // Watch position for real-time updates if enabled
    if (watchPosition) {
      watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        { ...options, maximumAge: 30000 } // More frequent updates for watching
      );
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [enableHighAccuracy, watchPosition]);

  const refreshLocation = () => {
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null 
    }));
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
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
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = (targetLat - state.location.latitude) * Math.PI / 180;
    const dLng = (targetLng - state.location.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(state.location.latitude * Math.PI / 180) * Math.cos(targetLat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return {
    ...state,
    refreshLocation,
    getLocationString,
    getDistanceFromLocation,
  };
};