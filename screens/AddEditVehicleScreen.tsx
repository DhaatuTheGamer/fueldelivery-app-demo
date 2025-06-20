
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useVehicles } from '../contexts/VehicleContext';
import { Vehicle, FuelType, VehicleType } from '../types';
import { Car, Bike, Droplet, Save, Trash2 } from 'lucide-react';

const AddEditVehicleScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id: vehicleId } = useParams<{ id: string }>();
  const { addVehicle, updateVehicle, removeVehicle, getVehicleById, isLoading } = useVehicles();

  const [nickname, setNickname] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [fuelType, setFuelType] = useState<FuelType | ''>('');
  const [vehicleType, setVehicleType] = useState<VehicleType | ''>('');
  const [error, setError] = useState('');

  const isEditing = Boolean(vehicleId);

  useEffect(() => {
    if (isEditing && vehicleId) {
      const existingVehicle = getVehicleById(vehicleId);
      if (existingVehicle) {
        setNickname(existingVehicle.nickname);
        setRegistrationNumber(existingVehicle.registrationNumber);
        setFuelType(existingVehicle.fuelType);
        setVehicleType(existingVehicle.vehicleType);
      } else {
        setError("Vehicle not found.");
        // Consider navigating back or showing a more prominent error
      }
    }
  }, [isEditing, vehicleId, getVehicleById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname.trim() || !registrationNumber.trim() || !fuelType || !vehicleType) {
      setError('All fields are required.');
      return;
    }
    
    // Basic registration number format validation (example, can be more complex)
    // MH 12 AB 1234
    const regEx = /^[A-Z]{2}[\s-]?[0-9]{1,2}[\s-]?[A-Z]{1,2}[\s-]?[0-9]{1,4}$/i;
    if(!regEx.test(registrationNumber.trim())){
        setError('Invalid registration number format. (e.g., MH 12 AB 1234)');
        return;
    }


    const vehicleData: Omit<Vehicle, 'id'> = {
      nickname: nickname.trim(),
      registrationNumber: registrationNumber.trim().toUpperCase(),
      fuelType,
      vehicleType,
    };

    try {
      if (isEditing && vehicleId) {
        await updateVehicle({ ...vehicleData, id: vehicleId });
      } else {
        await addVehicle(vehicleData);
      }
      navigate('/home'); // Or to a vehicle list screen
    } catch (err) {
      setError((err as Error).message || 'Failed to save vehicle.');
    }
  };
  
  const handleDelete = async () => {
    if (!isEditing || !vehicleId) return;
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await removeVehicle(vehicleId);
        navigate('/home');
      } catch (err) {
        setError((err as Error).message || 'Failed to delete vehicle.');
      }
    }
  };
  
  const FormOptionButton: React.FC<{
      value: FuelType | VehicleType;
      currentValue: FuelType | VehicleType | '';
      onClick: (value: FuelType | VehicleType) => void;
      children: React.ReactNode;
      icon?: React.ReactNode;
    }> = ({ value, currentValue, onClick, children, icon }) => (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`flex-1 p-3 rounded-lg border-2 text-sm sm:text-base font-medium transition-all duration-150 flex items-center justify-center space-x-2
        ${currentValue === value ? 'bg-primary text-white border-primary ring-2 ring-primary-focus' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'}`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );


  return (
    <div className="py-2">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-xl">
        <Input
          label="Vehicle Nickname"
          name="nickname"
          placeholder="e.g., My Office Car, Mom's Activa"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={50}
          required
        />
        <Input
          label="Registration Number"
          name="registrationNumber"
          placeholder="e.g., MH 12 AB 1234"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type *</label>
          <div className="flex space-x-2 sm:space-x-3">
            <FormOptionButton value={FuelType.PETROL} currentValue={fuelType} onClick={(v) => setFuelType(v as FuelType)} icon={<Droplet size={18}/>}>
              Petrol
            </FormOptionButton>
            <FormOptionButton value={FuelType.DIESEL} currentValue={fuelType} onClick={(v) => setFuelType(v as FuelType)} icon={<Droplet size={18}/>}>
              Diesel
            </FormOptionButton>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
          <div className="flex space-x-2 sm:space-x-3">
            <FormOptionButton value={VehicleType.CAR} currentValue={vehicleType} onClick={(v) => setVehicleType(v as VehicleType)} icon={<Car size={20}/>}>
              Car
            </FormOptionButton>
            <FormOptionButton value={VehicleType.BIKE} currentValue={vehicleType} onClick={(v) => setVehicleType(v as VehicleType)} icon={<Bike size={20}/>}>
              Bike
            </FormOptionButton>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 pt-2">
           {isEditing && (
            <Button 
              type="button" 
              variant="danger" 
              onClick={handleDelete} 
              isLoading={isLoading}
              leftIcon={<Trash2 size={18}/>}
              className="sm:flex-1"
            >
              Delete
            </Button>
          )}
          <Button 
            type="submit" 
            isLoading={isLoading} 
            leftIcon={<Save size={18}/>}
            className="sm:flex-1"
            fullWidth={!isEditing}
          >
            {isEditing ? 'Save Changes' : 'Add Vehicle'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEditVehicleScreen;
