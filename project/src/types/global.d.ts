// Global type declarations for Google Maps API
declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps?: () => void;
  }
}

export {};