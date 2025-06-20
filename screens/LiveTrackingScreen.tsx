import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MapPlaceholder from '../components/MapPlaceholder';
import Button from '../components/Button';
import { useOrders } from '../contexts/OrderContext';
import { OrderStatus, DeliveryCaptain } from '../types';
import { Phone, Info, ShieldCheck, Bike as BikeIcon, Star } from 'lucide-react';
import { MOCK_DELIVERY_CAPTAIN_PHOTO } from '../constants';

const LiveTrackingScreen: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { activeOrder, trackOrder, isLoading: orderLoading, getOrderById } = useOrders();
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState(10); // Initial ETA in minutes

  useEffect(() => {
    if (orderId) {
      trackOrder(orderId);
    } else {
      navigate('/my-orders'); // or home
    }
  }, [orderId, trackOrder, navigate]);

  // If activeOrder is not set by trackOrder (e.g. page refresh), try fetching it
  useEffect(() => {
    const fetchOrderIfNeeded = async () => {
      if (!activeOrder && orderId && !orderLoading) {
        const fetchedOrder = await getOrderById(orderId);
        if (fetchedOrder) {
          trackOrder(orderId); // This will set activeOrder
        } else {
          // Handle order not found
          // navigate('/my-orders');
        }
      }
    };
    fetchOrderIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrder, orderId, orderLoading, getOrderById]);
  
  // Simulate ETA countdown
  useEffect(() => {
    let timer: number | undefined;
    if (activeOrder && (activeOrder.status === OrderStatus.CAPTAIN_ASSIGNED || activeOrder.status === OrderStatus.EN_ROUTE) && estimatedArrivalTime > 0) {
      timer = setInterval(() => {
        setEstimatedArrivalTime(prev => Math.max(0, prev - 1));
      }, 60000); // Decrease every minute
    }
    if (activeOrder && activeOrder.status === OrderStatus.ARRIVED) {
        setEstimatedArrivalTime(0);
    }
    return () => clearInterval(timer);
  }, [activeOrder, estimatedArrivalTime]);

  const captain: DeliveryCaptain | undefined = activeOrder?.deliveryCaptain;

  const statusMessages = useMemo(() => ({
    [OrderStatus.SEARCHING_CAPTAIN]: "Finding a Delivery Captain for you...",
    [OrderStatus.CAPTAIN_ASSIGNED]: `${captain?.name || 'Your Captain'} is assigned.`,
    [OrderStatus.EN_ROUTE]: `${captain?.name || 'Your Captain'} is on the way!`,
    [OrderStatus.ARRIVED]: `${captain?.name || 'Your Captain'} has arrived! Share OTP to start fuelling.`,
    [OrderStatus.FUELLING]: "Fuelling in progress...",
    [OrderStatus.COMPLETED]: "Order Completed. Thank you!",
    [OrderStatus.CANCELLED]: "Order Cancelled.",
    [OrderStatus.PENDING]: "Order is pending confirmation."
  }), [captain?.name]);

  const currentStatusMessage = activeOrder ? statusMessages[activeOrder.status] || "Tracking order..." : "Loading order details...";

  if (orderLoading && !activeOrder) {
    return <div className="p-8 text-center">Loading tracking information...</div>;
  }

  if (!activeOrder) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Could not load order details. Please try again or check 'My Orders'.</p>
        <Button onClick={() => navigate('/my-orders')}>Go to My Orders</Button>
      </div>
    );
  }
  
  const handleOrderComplete = () => {
     // This would typically be triggered by the driver's app.
     // For simulation, we can add a button if needed, or navigate directly after ARRIVED status.
     // For now, let's assume it leads to rating after a while or if OTP is "used".
     navigate(`/rate-experience/${orderId}`);
  };


  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]"> {/* Adjust if no main layout header */}
      {/* ETA Banner */}
      {(activeOrder.status === OrderStatus.CAPTAIN_ASSIGNED || activeOrder.status === OrderStatus.EN_ROUTE) && (
        <div className="bg-primary text-white p-4 text-center sticky top-0 z-20 shadow-md">
          <h2 className="text-2xl font-bold">
            Arriving in {estimatedArrivalTime} Min{estimatedArrivalTime !== 1 ? 's' : ''}
          </h2>
          <p className="text-sm opacity-90">{currentStatusMessage}</p>
        </div>
      )}
      {activeOrder.status === OrderStatus.ARRIVED && (
         <div className="bg-green-500 text-white p-4 text-center sticky top-0 z-20 shadow-md">
          <h2 className="text-2xl font-bold">Captain Has Arrived!</h2>
          <p className="text-sm opacity-90">{currentStatusMessage}</p>
        </div>
      )}


      {/* Map View */}
      <div className="flex-grow relative">
        <MapPlaceholder 
          height="100%" 
          centerMessage={activeOrder.status === OrderStatus.EN_ROUTE || activeOrder.status === OrderStatus.ARRIVED ? "Captain's approximate location" : "Waiting for captain..."}
          showPin={true}
        />
        {/* Simulated bike icon - could be animated */}
        {(activeOrder.status === OrderStatus.CAPTAIN_ASSIGNED || activeOrder.status === OrderStatus.EN_ROUTE || activeOrder.status === OrderStatus.ARRIVED) && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-1000 ease-in-out">
            {/* Example: Bike moves slightly randomly when EN_ROUTE */}
            <BikeIcon size={36} className={`text-primary ${activeOrder.status === OrderStatus.EN_ROUTE ? 'animate-pulse' : ''}`} 
              style={{
                transform: activeOrder.status === OrderStatus.EN_ROUTE ? `translate(${Math.random()*10-5}px, ${Math.random()*10-5}px)`: ''
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom Sheet - Driver & Order Info */}
      <div className="bg-white p-4 shadow-t-xl rounded-t-2xl">
        {activeOrder.status === OrderStatus.SEARCHING_CAPTAIN && (
            <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-700">{currentStatusMessage}</p>
            </div>
        )}
        {captain && (activeOrder.status === OrderStatus.CAPTAIN_ASSIGNED || activeOrder.status === OrderStatus.EN_ROUTE || activeOrder.status === OrderStatus.ARRIVED) && (
          <>
            <div className="flex items-center mb-4">
              <img 
                src={captain.photoUrl || MOCK_DELIVERY_CAPTAIN_PHOTO} 
                alt={captain.name} 
                className="w-16 h-16 rounded-full mr-4 border-2 border-primary object-cover" 
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{captain.name} is on the way!</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" /> {captain.rating.toFixed(1)}
                  <span className="mx-2">|</span>
                  <span>{captain.vehicleNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
                <Button 
                    variant="outline" 
                    fullWidth 
                    leftIcon={<Phone size={18} />}
                    onClick={() => alert(`Calling ${captain.name}... (Feature not implemented)`)}
                >
                    Call Delivery Captain
                </Button>
            </div>

            {activeOrder.otp && (activeOrder.status === OrderStatus.ARRIVED || activeOrder.status === OrderStatus.EN_ROUTE /* Show OTP when en-route too */ ) && (
              <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
                <p className="text-sm text-orange-700 mb-1">Share this OTP with {captain.name} to start fuelling:</p>
                <p className="text-4xl font-bold text-primary tracking-widest">{activeOrder.otp}</p>
              </div>
            )}
            
            {/* Simulate order completion after arrival, e.g. if OTP is "used" */}
            {activeOrder.status === OrderStatus.ARRIVED && (
              <Button fullWidth onClick={handleOrderComplete} className="mt-4">
                Mark as Fuelled & Complete (Simulated)
              </Button>
            )}
          </>
        )}

         {activeOrder.status === OrderStatus.COMPLETED && (
            <div className="text-center py-8">
                <ShieldCheck size={60} className="mx-auto text-green-500 mb-4" />
                <p className="text-xl font-medium text-green-700">{currentStatusMessage}</p>
                <Button onClick={() => navigate(`/rate-experience/${orderId}`)} className="mt-6">Rate Your Experience</Button>
            </div>
        )}
        {activeOrder.status === OrderStatus.CANCELLED && (
             <div className="text-center py-8">
                <Info size={60} className="mx-auto text-red-500 mb-4" />
                <p className="text-xl font-medium text-red-700">{currentStatusMessage}</p>
                <Button onClick={() => navigate('/home')} className="mt-6" variant="outline">Order Again</Button>
            </div>
        )}
      </div>
    </div>
  );
};

export default LiveTrackingScreen;