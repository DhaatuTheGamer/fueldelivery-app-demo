import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapPlaceholder from '../components/MapPlaceholder';
import VehicleCard from '../components/VehicleCard';
import Button from '../components/Button';
import { useVehicles } from '../contexts/VehicleContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import useLocation from '../hooks/useLocation';
import { PlusCircle, Search, Edit3 } from 'lucide-react';
import { DEFAULT_LOCATION, APP_NAME } from '../constants';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { updateCurrentOrder } = useOrders();
  const { location: userLocation, isLoading: locationLoading, fetchLocation, permissionGranted } = useLocation();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("Detecting location...");
  const [showLocationPermissionModal, setShowLocationPermissionModal] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get location only once when component mounts if not already available or denied
    if (permissionGranted === null) { // null means not yet requested or determined
        fetchLocation();
    }
  }, [fetchLocation, permissionGranted]);
  
  useEffect(() => {
    if(permissionGranted === false && userLocation?.error){
        setShowLocationPermissionModal(true); // Show modal if permission denied
    } else {
        setShowLocationPermissionModal(false);
    }
  }, [permissionGranted, userLocation?.error]);

  useEffect(() => {
    if (userLocation && userLocation.address) {
      setDeliveryAddress(userLocation.address);
    } else if (userLocation && !userLocation.address && !userLocation.error) {
       setDeliveryAddress(`Lat: ${userLocation.latitude.toFixed(4)}, Lng: ${userLocation.longitude.toFixed(4)}`);
    } else if (userLocation?.error) {
       setDeliveryAddress("Location unavailable. Tap to set.");
    }
  }, [userLocation]);

  useEffect(() => {
    // Auto-select first vehicle if available and none selected
    if (vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  const handleOrderFuel = () => {
    setOrderError(null); // Clear previous errors

    if (!selectedVehicleId) {
      setOrderError("Please select a vehicle.");
      return;
    }
    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
    if (!selectedVehicle) {
      setOrderError("Selected vehicle not found. Please try again.");
      return;
    }
    if (!userLocation || (!userLocation.latitude && !userLocation.longitude)) {
      setOrderError("Delivery location is not set. Please enable location or set manually.");
      return;
    }

    updateCurrentOrder({
      vehicleId: selectedVehicle.id,
      fuelType: selectedVehicle.fuelType,
      deliveryAddress: deliveryAddress,
      location: { lat: userLocation?.latitude || DEFAULT_LOCATION.lat, lng: userLocation?.longitude || DEFAULT_LOCATION.lng },
    });
    navigate('/order-config');
  };
  
  const handleLocationPermissionRequest = () => {
    fetchLocation();
    setShowLocationPermissionModal(false);
  };

  const currentMapCenterMessage = locationLoading ? "Fetching your location..." : 
                                   (userLocation?.error ? userLocation.error : "Drag pin or search to set location");

  return (
    <div className="flex flex-col h-[calc(100vh-4rem-4rem)] sm:h-[calc(100vh-4rem)]"> {/* Adjust for nav and potential header */}
      {/* Top Bar - Delivery Address */}
      <div className="p-3 bg-white shadow mb-1 sticky top-0 z-10">
        <div
          className="w-full text-left p-3 border border-gray-300 rounded-lg flex items-center justify-between cursor-default"
        >
          <div className="flex items-center"> {/* Wrap Search and text */}
            <Search size={20} className="text-gray-500 mr-2 flex-shrink-0" />
            <div className="flex-grow">
              <span className="text-xs text-gray-500 block">Deliver to:</span>
              <span className={`text-sm font-medium ${locationLoading ? 'text-gray-400 animate-pulse' : 'text-gray-800'}`}>
                {locationLoading ? 'Loading address...' : deliveryAddress}
              </span>
            </div>
          </div>
          <Edit3 size={16} className="text-gray-400 ml-2 flex-shrink-0" /> {/* Added icon */}
        </div>
      </div>

      {/* Map View */}
      <div className="flex-grow relative">
        <MapPlaceholder 
            height="100%" 
            centerMessage={currentMapCenterMessage}
            showPin={!!(userLocation && !userLocation.error)}
        />
      </div>

      {/* Vehicle Dock & Order Button Area */}
      <div className="bg-white p-4 shadow-t-lg">
        <h3 className="text-md font-semibold text-gray-700 mb-3">Select Vehicle</h3>
        {vehiclesLoading && <p className="text-center text-gray-500">Loading vehicles...</p>}
        {!vehiclesLoading && vehicles.length === 0 && (
          <Button variant="outline" fullWidth onClick={() => navigate('/add-vehicle')} leftIcon={<PlusCircle size={20}/>}>
            Add Your First Vehicle
          </Button>
        )}
        {!vehiclesLoading && vehicles.length > 0 && (
          <div className="flex overflow-x-auto space-x-3 pb-3 mb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {vehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isSelected={selectedVehicleId === vehicle.id}
                onClick={() => {
                    setSelectedVehicleId(vehicle.id);
                    setOrderError(null); // Clear error when a vehicle is selected
                }}
                className="flex-shrink-0 w-52"
              />
            ))}
             <button 
                onClick={() => navigate('/add-vehicle')} 
                className="flex-shrink-0 w-32 h-full flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg p-4 border-2 border-dashed border-gray-300 transition-colors"
             >
                <PlusCircle size={28} className="mb-1"/>
                <span className="text-sm font-medium">Add New</span>
            </button>
          </div>
        )}
        
        {orderError && (
          <p className="text-red-500 text-sm text-center mb-3">{orderError}</p>
        )}

        <Button 
          onClick={handleOrderFuel} 
          fullWidth 
          size="lg"
          disabled={!selectedVehicleId || locationLoading || (userLocation?.error && !userLocation?.latitude)} // Disable if no vehicle or location issue
        >
          Order Fuel
        </Button>
      </div>

      {/* Location Permission Modal */}
      {showLocationPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Location Access</h3>
            <p className="text-sm text-gray-600 mb-4">
              {APP_NAME} needs your location to deliver fuel accurately. Please enable location services in your browser/system settings, then tap "Try Again".
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setShowLocationPermissionModal(false)}>Maybe Later</Button>
              <Button onClick={handleLocationPermissionRequest}>Try Again</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;