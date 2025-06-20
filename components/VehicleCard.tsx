
import React from 'react';
import { Vehicle, FuelType, VehicleType } from '../types';
import { Droplet, Car, Bike } from 'lucide-react'; // Using lucide-react for icons

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const FuelIcon: React.FC<{ type: FuelType }> = ({ type }) => {
  return <Droplet size={18} className={type === FuelType.PETROL ? 'text-orange-500' : 'text-blue-500'} />;
};

const VehicleTypeIcon: React.FC<{ type: VehicleType }> = ({ type }) => {
  if (type === VehicleType.CAR) return <Car size={18} className="text-gray-600" />;
  if (type === VehicleType.BIKE) return <Bike size={18} className="text-gray-600" />;
  return null;
};


const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, isSelected, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 rounded-lg shadow-md min-w-[200px] cursor-pointer border-2 transition-all duration-200 ${
        isSelected ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:shadow-lg'
      } ${className || ''}`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{vehicle.nickname}</h3>
        <VehicleTypeIcon type={vehicle.vehicleType} />
      </div>
      <p className="text-sm text-gray-600 mb-1">{vehicle.registrationNumber}</p>
      <div className="flex items-center text-sm text-gray-600">
        <FuelIcon type={vehicle.fuelType} />
        <span className="ml-1.5">{vehicle.fuelType}</span>
      </div>
    </div>
  );
};

export default VehicleCard;
