
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, VehicleContextType } from '../types';
import { useAuth } from './AuthContext';

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      // Simulate fetching vehicles from local storage for the logged-in user
      const storedVehicles = localStorage.getItem(`vehicles_${user.id}`);
      if (storedVehicles) {
        setVehicles(JSON.parse(storedVehicles));
      } else {
        setVehicles([]); // Ensure it's an empty array if nothing stored
      }
      setIsLoading(false);
    } else {
      setVehicles([]); // Clear vehicles if no user
    }
  }, [user]);

  const saveVehiclesToStorage = (updatedVehicles: Vehicle[]) => {
    if (user) {
      localStorage.setItem(`vehicles_${user.id}`, JSON.stringify(updatedVehicles));
    }
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newVehicle: Vehicle = { ...vehicleData, id: Date.now().toString() };
        const updatedVehicles = [...vehicles, newVehicle];
        setVehicles(updatedVehicles);
        saveVehiclesToStorage(updatedVehicles);
        setIsLoading(false);
        resolve();
      }, 500);
    });
  };

  const updateVehicle = async (updatedVehicle: Vehicle): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedVehicles = vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v);
        setVehicles(updatedVehicles);
        saveVehiclesToStorage(updatedVehicles);
        setIsLoading(false);
        resolve();
      }, 500);
    });
  };

  const removeVehicle = async (vehicleId: string): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
        setVehicles(updatedVehicles);
        saveVehiclesToStorage(updatedVehicles);
        setIsLoading(false);
        resolve();
      }, 500);
    });
  };
  
  const getVehicleById = (vehicleId: string): Vehicle | undefined => {
    return vehicles.find(v => v.id === vehicleId);
  };

  return (
    <VehicleContext.Provider value={{ vehicles, addVehicle, updateVehicle, removeVehicle, getVehicleById, isLoading }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = (): VehicleContextType => {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
};
