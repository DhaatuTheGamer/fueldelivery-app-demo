
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Zap } from 'lucide-react';
import { APP_NAME } from '../constants';

const OrderPlacedScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = (location.state as { orderId: string })?.orderId;

  useEffect(() => {
    if (!orderId) {
      // If no orderId, something went wrong, redirect home.
      navigate('/home');
      return;
    }

    // Simulate searching for captain and then navigate to tracking
    const timer = setTimeout(() => {
      navigate(`/tracking/${orderId}`);
    }, 4000); // Simulate 4 seconds of searching

    return () => clearTimeout(timer);
  }, [navigate, orderId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-teal-400 text-white p-6 text-center">
      <CheckCircle size={80} className="mb-6 text-white animate-bounce" />
      <h1 className="text-4xl font-bold mb-3">Order Confirmed!</h1>
      <p className="text-xl text-green-100 mb-8">
        Your {APP_NAME} order <span className="font-semibold">#{orderId?.slice(-6)}</span> has been placed successfully.
      </p>
      
      <div className="flex items-center justify-center space-x-3 mb-2">
        <div className="w-5 h-5 bg-white rounded-full animate-ping delay-100"></div>
        <div className="w-5 h-5 bg-white rounded-full animate-ping delay-300"></div>
        <div className="w-5 h-5 bg-white rounded-full animate-ping delay-500"></div>
      </div>
      <p className="text-lg text-green-50 font-medium">Looking for the nearest Delivery Captain...</p>

      <div className="mt-12">
        <Zap size={40} className="mx-auto text-yellow-300 opacity-80" />
        <p className="text-sm text-green-200 mt-2">Get ready for super-fast delivery!</p>
      </div>
    </div>
  );
};

export default OrderPlacedScreen;
