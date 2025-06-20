
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { useOrders } from '../contexts/OrderContext';
import { useVehicles } from '../contexts/VehicleContext';
import { PaymentOption } from '../types';
import { ChevronLeft, CreditCard, Tag, Landmark } from 'lucide-react'; // Landmark for UPI-like icon

const CheckoutScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentOrder, placeOrder, isLoading: orderLoading, updateCurrentOrder } = useOrders();
  const { getVehicleById } = useVehicles();
  
  const [promoCode, setPromoCode] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentOption | ''>('UPI'); // Default to UPI

  const vehicle = currentOrder?.vehicleId ? getVehicleById(currentOrder.vehicleId) : null;

  if (!currentOrder || !vehicle) {
    // Should not happen, redirect if order data is missing
    navigate('/home');
    return null;
  }

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
        alert("Please select a payment method.");
        return;
    }
    updateCurrentOrder({ paymentMethod: selectedPaymentMethod });
    
    // Simulate payment processing here (e.g. Razorpay integration)
    // For now, directly place order
    const placedOrder = await placeOrder();
    if (placedOrder) {
      navigate(`/order-placed`, { state: { orderId: placedOrder.id } });
    } else {
      alert("Failed to place order. Please try again.");
    }
  };
  
  const paymentOptions: { id: PaymentOption; name: string; icon: React.ReactNode }[] = [
    { id: 'UPI', name: 'UPI / BHIM', icon: <Landmark size={24} className="text-blue-600" /> },
    { id: 'Card', name: 'Credit/Debit Card', icon: <CreditCard size={24} className="text-green-600" /> },
    // Add more options like NetBanking if needed
  ];

  return (
    <div className="py-2">
      <div className="bg-white p-6 rounded-lg shadow-xl relative">
        <button onClick={() => navigate('/order-config')} className="absolute top-4 left-4 text-primary hover:text-orange-700 p-2 z-10 bg-white rounded-full shadow">
             <ChevronLeft size={24} />
        </button>
        {/* Order Summary */}
        <div className="mb-6 border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Order Summary</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Vehicle:</strong> {vehicle.nickname} ({currentOrder.fuelType})</p>
            <p><strong>Quantity:</strong> {currentOrder.quantityLiters?.toFixed(2)} Litres</p>
            <p><strong>Delivery Address:</strong> {currentOrder.deliveryAddress}</p>
            <p className="text-lg font-bold text-primary mt-2">Total Amount: ₹{currentOrder.totalAmount?.toFixed(2)}</p>
          </div>
        </div>

        {/* Apply Promo Code */}
        <div className="mb-6">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer text-sm font-medium text-primary hover:text-orange-700">
              Apply Promo Code
              <Tag size={18} className="group-open:rotate-90 transition-transform"/>
            </summary>
            <div className="mt-3 flex space-x-2">
              <Input 
                name="promoCode" 
                placeholder="Enter promo code" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                containerClassName="flex-grow !mb-0"
                className="!py-2"
              />
              <Button variant="outline" size="md" onClick={() => alert("Promo code functionality not implemented.")}>Apply</Button>
            </div>
          </details>
        </div>

        {/* Payment Options */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Select Payment Method</h4>
          <div className="space-y-3">
            {paymentOptions.map(option => (
              <label
                key={option.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-150 ${
                  selectedPaymentMethod === option.id 
                    ? 'border-primary bg-orange-50 ring-2 ring-primary' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.id}
                  checked={selectedPaymentMethod === option.id}
                  onChange={() => setSelectedPaymentMethod(option.id)}
                  className="form-radio h-4 w-4 text-primary focus:ring-primary mr-3"
                />
                {option.icon}
                <span className="ml-2 text-sm font-medium text-gray-700">{option.name}</span>
              </label>
            ))}
          </div>
        </div>

        <Button 
            onClick={handlePayment} 
            fullWidth 
            size="lg" 
            isLoading={orderLoading}
            disabled={!selectedPaymentMethod || orderLoading}
        >
          Pay ₹{currentOrder.totalAmount?.toFixed(2)} & Place Order
        </Button>
         <p className="text-xs text-gray-500 mt-4 text-center">
            By placing this order, you agree to our terms and conditions. Payment processing is simulated.
        </p>
      </div>
    </div>
  );
};

export default CheckoutScreen;
