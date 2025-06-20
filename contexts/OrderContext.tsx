import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Order, OrderContextType, PastOrder, OrderStatus, DeliveryCaptain } from '../types';
import { useAuth } from './AuthContext';
import { MOCK_DELIVERY_CAPTAIN_PHOTO } from '../constants';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<Partial<Order> | null>(null);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const { user } = useAuth();

  const updateCurrentOrder = (details: Partial<Order>) => {
    setCurrentOrder(prev => ({ ...prev, ...details }));
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  const placeOrder = async (): Promise<Order | null> => {
    if (!currentOrder || !user || !currentOrder.vehicleId || !currentOrder.totalAmount || !currentOrder.deliveryAddress) {
      console.error("Missing order details or user not logged in.");
      return null;
    }
    setIsLoading(true);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder: Order = {
          ...currentOrder,
          id: Date.now().toString(),
          userId: user.id,
          orderDate: new Date().toISOString(),
          status: OrderStatus.SEARCHING_CAPTAIN, // Initial status after placement
        } as Order; // Type assertion as we've checked required fields
        
        const updatedPastOrders = [newOrder, ...pastOrders];
        setPastOrders(updatedPastOrders);
        savePastOrdersToStorage(updatedPastOrders);
        setActiveOrder(newOrder); // Set as active order for tracking
        setCurrentOrder(null); // Clear current order draft
        setIsLoading(false);
        resolve(newOrder);
      }, 1500);
    });
  };

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    setIsLoading(true);
    // Simulate API call or local search
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundOrder = pastOrders.find(o => o.id === orderId) || null;
        setIsLoading(false);
        resolve(foundOrder);
      }, 500);
    });
  };

  const fetchPastOrders = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    // Simulate fetching orders from local storage for the logged-in user
    const storedOrders = localStorage.getItem(`orders_${user.id}`);
    if (storedOrders) {
      setPastOrders(JSON.parse(storedOrders));
    } else {
      setPastOrders([]);
    }
    setIsLoading(false);
  }, [user]);


  const savePastOrdersToStorage = (updatedOrders: PastOrder[]) => {
    if (user) {
      localStorage.setItem(`orders_${user.id}`, JSON.stringify(updatedOrders));
    }
  };

  useEffect(() => {
    if (user) {
      fetchPastOrders();
    } else {
      setPastOrders([]); // Clear orders if no user
      setActiveOrder(null);
      setCurrentOrder(null);
    }
  }, [user, fetchPastOrders]);

  // Simulate order tracking updates
  const trackOrder = (orderId: string) => {
    const orderToTrack = pastOrders.find(o => o.id === orderId);
    if (orderToTrack && orderToTrack.status !== OrderStatus.COMPLETED && orderToTrack.status !== OrderStatus.CANCELLED) {
      setActiveOrder(orderToTrack);
    } else {
      setActiveOrder(null);
    }
  };
  
  // Effect to simulate captain assignment and arrival for activeOrder
  useEffect(() => {
    let intervalId: number | undefined;
    if (activeOrder && activeOrder.status === OrderStatus.SEARCHING_CAPTAIN) {
      intervalId = setTimeout(() => {
        const captain: DeliveryCaptain = {
          id: 'capt001',
          name: 'Ramesh Kumar',
          rating: 4.8,
          vehicleNumber: 'MH 01 DR 1234',
          photoUrl: MOCK_DELIVERY_CAPTAIN_PHOTO,
          currentLocation: { lat: activeOrder.location?.lat || 0 + 0.01, lng: activeOrder.location?.lng || 0 + 0.01 },
        };
        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setActiveOrder(prev => prev ? { ...prev, status: OrderStatus.CAPTAIN_ASSIGNED, deliveryCaptain: captain, otp: newOtp } : null);
        // Persist change to pastOrders as well
        setPastOrders(prevOrders => prevOrders.map(o => 
            o.id === activeOrder.id 
            ? {...o, status: OrderStatus.CAPTAIN_ASSIGNED, deliveryCaptain: captain, otp: newOtp } 
            : o
        ));

      }, 5000); // 5 seconds to find captain
    } else if (activeOrder && activeOrder.status === OrderStatus.CAPTAIN_ASSIGNED) {
       intervalId = setTimeout(() => {
        setActiveOrder(prev => prev ? { ...prev, status: OrderStatus.EN_ROUTE } : null);
         setPastOrders(prevOrders => prevOrders.map(o => o.id === activeOrder.id ? {...o, status: OrderStatus.EN_ROUTE } : o));
      }, 3000); // 3 seconds to start moving
    } else if (activeOrder && activeOrder.status === OrderStatus.EN_ROUTE) {
       intervalId = setTimeout(() => {
        setActiveOrder(prev => prev ? { ...prev, status: OrderStatus.ARRIVED } : null);
         setPastOrders(prevOrders => prevOrders.map(o => o.id === activeOrder.id ? {...o, status: OrderStatus.ARRIVED } : o));
      }, 10000); // 10 seconds to arrive (simulated)
    } else if (activeOrder && activeOrder.status === OrderStatus.ARRIVED) {
       intervalId = setTimeout(() => {
        setActiveOrder(prev => prev ? { ...prev, status: OrderStatus.FUELLING } : null);
         setPastOrders(prevOrders => prevOrders.map(o => o.id === activeOrder.id ? {...o, status: OrderStatus.FUELLING } : o));
      }, 4000); // 4 seconds to start fuelling (simulated)
    } else if (activeOrder && activeOrder.status === OrderStatus.FUELLING) {
       intervalId = setTimeout(() => {
        setActiveOrder(prev => prev ? { ...prev, status: OrderStatus.COMPLETED } : null);
         setPastOrders(prevOrders => prevOrders.map(o => o.id === activeOrder.id ? {...o, status: OrderStatus.COMPLETED } : o));
      }, 6000); // 6 seconds to complete fuelling (simulated)
    }

    return () => clearTimeout(intervalId);
  }, [activeOrder]);


  return (
    <OrderContext.Provider value={{ currentOrder, updateCurrentOrder, placeOrder, getOrderById, pastOrders, fetchPastOrders, isLoading, activeOrder, trackOrder, clearCurrentOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};