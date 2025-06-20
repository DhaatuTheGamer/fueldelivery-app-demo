
import { useState, useEffect } from 'react';
import { DEFAULT_LOCATION } from '../constants';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string; // Optional: if reverse geocoding is implemented
  error?: string;
}

const useLocation = (requestPermissionOnMount: boolean = false) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const fetchLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Simulate fetching address based on lat/lng
          setTimeout(() => { // Simulate delay for address fetch
            setLocation({
              latitude,
              longitude,
              address: `Approx. near ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`, // Dummy address
            });
            setPermissionGranted(true);
            setIsLoading(false);
          }, 500);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation({
            latitude: DEFAULT_LOCATION.lat,
            longitude: DEFAULT_LOCATION.lng,
            address: "Default Location (Permission Denied/Error)",
            error: error.message,
          });
          setPermissionGranted(false);
          setIsLoading(false);
        }
      );
    } else {
      setLocation({
        latitude: DEFAULT_LOCATION.lat,
        longitude: DEFAULT_LOCATION.lng,
        address: "Default Location (Geolocation not supported)",
        error: "Geolocation not supported by this browser.",
      });
      setPermissionGranted(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (requestPermissionOnMount) {
      fetchLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestPermissionOnMount]);

  return { location, isLoading, fetchLocation, permissionGranted };
};

export default useLocation;
