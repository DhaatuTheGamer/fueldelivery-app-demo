
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useOrders } from '../contexts/OrderContext';
import { Star, MessageSquare, DollarSign } from 'lucide-react';

const RateExperienceScreen: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById, activeOrder } = useOrders(); // Use activeOrder if already tracked or fetch by ID

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // You might want to fetch order details here if not available, e.g. captain's name
  useEffect(() => {
    if (!activeOrder && orderId) {
      // getOrderById(orderId); // This would set it to activeOrder or allow local fetch
      console.log("Fetching order details for rating:", orderId);
    }
  }, [activeOrder, orderId, getOrderById]);
  
  const orderCaptainName = activeOrder?.deliveryCaptain?.name || "your Delivery Captain";

  const handleSubmitRating = async () => {
    if (rating === 0) {
      alert("Please provide a rating.");
      return;
    }
    setIsLoading(true);
    // Simulate API call to submit rating and tip
    console.log({
      orderId,
      rating,
      comment,
      tip: parseFloat(tipAmount) || 0,
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert("Thank you for your feedback!");
    navigate('/home'); // Or to My Orders
  };

  const tipOptions = [10, 20, 30, 50];

  return (
    <div className="py-2">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <Star size={60} className="mx-auto text-yellow-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Rate Your Experience</h2>
        <p className="text-gray-600 mb-6">
          How was your fuel delivery experience with {orderCaptainName}?
          (Order ID: #{orderId?.slice(-6)})
        </p>

        {/* Star Rating */}
        <div className="flex justify-center items-center mb-6 space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={40}
              className={`cursor-pointer transition-colors duration-150 
                ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>

        {/* Comment Box */}
        <div className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary resize-none"
          />
        </div>

        {/* Tip Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Add a Tip for {orderCaptainName} (Optional)</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {tipOptions.map(tip => (
              <Button 
                key={tip}
                variant={tipAmount === tip.toString() ? 'primary' : 'outline'}
                onClick={() => setTipAmount(tip.toString())}
                className="w-20"
              >
                ₹{tip}
              </Button>
            ))}
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary">
            <span className="px-3 py-2 bg-gray-100 text-gray-600"><DollarSign size={20}/></span>
            <input
              type="number"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              placeholder="Custom Amount"
              className="w-full p-2.5 focus:outline-none"
            />
          </div>
        </div>

        <Button onClick={handleSubmitRating} fullWidth size="lg" isLoading={isLoading} disabled={rating === 0 || isLoading}>
          Submit Feedback
        </Button>
      </div>
    </div>
  );
};

export default RateExperienceScreen;
