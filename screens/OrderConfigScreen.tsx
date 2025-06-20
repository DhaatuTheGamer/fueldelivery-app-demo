
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { useOrders } from '../contexts/OrderContext';
import { useVehicles } from '../contexts/VehicleContext';
import { FUEL_PRICES, CONVENIENCE_FEE, GST_RATE_ON_FEE } from '../constants';
import { FuelType } from '../types';
import { Minus, Plus } from 'lucide-react';

type OrderMode = 'Litres' | 'Rupees';

const OrderConfigScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentOrder, updateCurrentOrder } = useOrders();
  const { getVehicleById } = useVehicles();

  const [orderMode, setOrderMode] = useState<OrderMode>('Litres');
  const [quantity, setQuantity] = useState<string>('5'); // Default 5 Litres
  const [amount, setAmount] = useState<string>(''); // For Rupees mode

  const vehicle = currentOrder?.vehicleId ? getVehicleById(currentOrder.vehicleId) : null;
  const fuelPrice = vehicle ? FUEL_PRICES[vehicle.fuelType] : 0;

  useEffect(() => {
    if (!currentOrder || !vehicle) {
      // If no current order or vehicle, navigate back or show error
      navigate('/home');
      return;
    }
    // Initialize amount if in Rupees mode and quantity is set (or vice versa)
    if (orderMode === 'Litres') {
      const numericQuantity = parseFloat(quantity) || 0;
      setAmount((numericQuantity * fuelPrice).toFixed(2));
    } else { // Rupees mode
      const numericAmount = parseFloat(amount) || 0;
      setQuantity((numericAmount / fuelPrice).toFixed(2));
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder, vehicle, fuelPrice]); // Only run when these core details change

  const handleModeChange = (newMode: OrderMode) => {
    setOrderMode(newMode);
    if (newMode === 'Litres') {
        const q = parseFloat(quantity);
        setAmount(q > 0 ? (q * fuelPrice).toFixed(2) : '');
    } else { 
        const a = parseFloat(amount);
        setQuantity(a > 0 ? (a / fuelPrice).toFixed(2) : '');
    }
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    if (orderMode === 'Litres') {
      const numericQuantity = parseFloat(value) || 0;
      setAmount(numericQuantity > 0 ? (numericQuantity * fuelPrice).toFixed(2) : '');
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (orderMode === 'Rupees') {
      const numericAmount = parseFloat(value) || 0;
      setQuantity(numericAmount > 0 ? (numericAmount / fuelPrice).toFixed(2) : '');
    }
  };

  const increment = () => {
    if (orderMode === 'Litres') {
      const currentVal = parseFloat(quantity) || 0;
      handleQuantityChange(Math.max(0, currentVal + 1).toString());
    } else {
      const currentVal = parseFloat(amount) || 0;
      handleAmountChange(Math.max(0, currentVal + 100).toString()); // Increment by 100 Rupees
    }
  };

  const decrement = () => {
    if (orderMode === 'Litres') {
      const currentVal = parseFloat(quantity) || 0;
      handleQuantityChange(Math.max(1, currentVal - 1).toString()); // Min 1 Litre
    } else {
      const currentVal = parseFloat(amount) || 0;
      handleAmountChange(Math.max(fuelPrice, currentVal - 100).toString()); // Min value of 1 litre in rupees
    }
  };

  const calculatedValues = useMemo(() => {
    const qLiters = parseFloat(quantity) || 0;
    const fuelCost = qLiters * fuelPrice;
    const gstOnFee = CONVENIENCE_FEE * GST_RATE_ON_FEE;
    const totalPayable = fuelCost + CONVENIENCE_FEE + gstOnFee;
    return { qLiters, fuelCost, gstOnFee, totalPayable };
  }, [quantity, fuelPrice]);
  
  if (!currentOrder || !vehicle) {
    return (
        <div className="p-4 text-center">
            <p className="text-red-500">Order details not found. Redirecting...</p>
        </div>
    );
  }

  const handleSubmit = () => {
    if (calculatedValues.qLiters <= 0) {
        alert("Please enter a valid quantity/amount.");
        return;
    }
    updateCurrentOrder({
      quantityLiters: calculatedValues.qLiters,
      quantityRupees: parseFloat(amount) || 0,
      pricePerLitre: fuelPrice,
      fuelCost: calculatedValues.fuelCost,
      convenienceFee: CONVENIENCE_FEE,
      gstOnFee: calculatedValues.gstOnFee,
      totalAmount: calculatedValues.totalPayable,
    });
    navigate('/checkout');
  };
  
  return (
    <div className="py-2">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        {/* Selected Vehicle and Address */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">Vehicle: {vehicle.nickname} ({vehicle.registrationNumber}) - {vehicle.fuelType}</h3>
          <p className="text-xs text-gray-600 mt-1">Delivery to: {currentOrder.deliveryAddress}</p>
        </div>

        {/* Quantity/Amount Selector */}
        <div className="mb-6">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-4">
            {(['Litres', 'Rupees'] as OrderMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  orderMode === mode ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                By {mode}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={decrement} variant="outline" size="md" className="p-3 !rounded-full aspect-square">
              <Minus size={20} />
            </Button>
            <Input
              type="number"
              name={orderMode === 'Litres' ? 'quantity' : 'amount'}
              value={orderMode === 'Litres' ? quantity : amount}
              onChange={e => orderMode === 'Litres' ? handleQuantityChange(e.target.value) : handleAmountChange(e.target.value)}
              className="text-center text-xl font-semibold !py-3 !mb-0" // override mb from Input
              placeholder={orderMode === 'Litres' ? '0 L' : '₹0'}
              min="0"
              step={orderMode === 'Litres' ? "0.1" : "10"}
            />
            <Button onClick={increment} variant="outline" size="md" className="p-3 !rounded-full aspect-square">
              <Plus size={20} />
            </Button>
          </div>
        </div>

        {/* Real-time Price Breakdown */}
        <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-2">
          <h4 className="text-md font-semibold text-orange-700 mb-2">Price Breakdown</h4>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Today's {vehicle.fuelType} Price:</span>
            <span className="font-medium text-gray-700">₹{fuelPrice.toFixed(2)} / Litre</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fuel Cost ({calculatedValues.qLiters.toFixed(2)}L x ₹{fuelPrice.toFixed(2)}):</span>
            <span className="font-medium text-gray-700">₹{calculatedValues.fuelCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Convenience Fee:</span>
            <span className="font-medium text-gray-700">₹{CONVENIENCE_FEE.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">GST ({GST_RATE_ON_FEE*100}% on fee):</span>
            <span className="font-medium text-gray-700">₹{calculatedValues.gstOnFee.toFixed(2)}</span>
          </div>
          <hr className="my-2 border-orange-200"/>
          <div className="flex justify-between text-lg font-bold">
            <span className="text-primary">Total Payable:</span>
            <span className="text-primary">₹{calculatedValues.totalPayable.toFixed(2)}</span>
          </div>
        </div>

        <Button onClick={handleSubmit} fullWidth size="lg" disabled={calculatedValues.qLiters <= 0}>
          Select Payment Method
        </Button>
      </div>
    </div>
  );
};

export default OrderConfigScreen;
