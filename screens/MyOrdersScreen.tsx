
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';
import { PastOrder, OrderStatus, FuelType } from '../types';
import Button from '../components/Button';
import { ChevronRight, FileText, RefreshCw, ListFilter } from 'lucide-react';

const OrderItem: React.FC<{ order: PastOrder; onClick: () => void }> = ({ order, onClick }) => {
  const isOngoing = ![OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(order.status);

  return (
    <div 
      onClick={onClick} 
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500">Order ID: #{order.id.slice(-6)}</p>
          <p className="text-sm font-medium text-gray-700">
            {new Date(order.orderDate).toLocaleDateString()} - {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-sm text-gray-600">{order.quantityLiters?.toFixed(1)}L {order.fuelType}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-primary">₹{order.totalAmount.toFixed(2)}</p>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            isOngoing ? 'bg-yellow-100 text-yellow-700' : 
            order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {order.status}
          </span>
        </div>
      </div>
      {/* For ongoing orders, a "Track Order" prompt might be good */}
      {isOngoing && (
        <div className="mt-3 text-right">
            <span className="text-primary text-sm font-medium inline-flex items-center">
                Track Order <ChevronRight size={16} className="ml-1"/>
            </span>
        </div>
      )}
      {order.status === OrderStatus.COMPLETED && order.invoiceUrl && (
        <div className="mt-3 text-right">
             <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); alert(`Downloading invoice... ${order.invoiceUrl}`);}} leftIcon={<FileText size={14}/>}>
                Invoice
            </Button>
        </div>
      )}
    </div>
  );
};


const MyOrdersScreen: React.FC = () => {
  const navigate = useNavigate();
  const { pastOrders, fetchPastOrders, isLoading } = useOrders();
  const [activeTab, setActiveTab] = useState<'ongoing' | 'past'>('ongoing');

  useEffect(() => {
    fetchPastOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch on mount

  const ongoingOrders = pastOrders.filter(o => ![OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(o.status));
  const completedOrCancelledOrders = pastOrders.filter(o => [OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(o.status));

  const ordersToDisplay = activeTab === 'ongoing' ? ongoingOrders : completedOrCancelledOrders;
  
  const handleOrderClick = (order: PastOrder) => {
    if (![OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(order.status)) {
      navigate(`/tracking/${order.id}`);
    } else if (order.status === OrderStatus.COMPLETED) {
      // Potentially navigate to a detailed order summary or invoice view
      // For now, if already rated, nothing, else rate
      // Let's assume rating screen is shown after tracking leads to completion
      alert(`Viewing details for completed order #${order.id.slice(-6)}`);
    } else {
      alert(`Order #${order.id.slice(-6)} was cancelled.`);
    }
  };

  return (
    <div className="pb-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4 sticky top-[64px] bg-gray-50 z-10"> {/* Assuming header is 64px */}
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2
            ${activeTab === 'ongoing' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
        >
          Ongoing ({ongoingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2
            ${activeTab === 'past' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
        >
          Past Orders ({completedOrCancelledOrders.length})
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-10">
          <RefreshCw size={32} className="mx-auto animate-spin text-primary mb-2" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      )}

      {!isLoading && ordersToDisplay.length === 0 && (
        <div className="text-center py-10 px-4">
          <ListFilter size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 text-lg">
            {activeTab === 'ongoing' ? "No ongoing orders right now." : "You haven't placed any orders yet."}
          </p>
          {activeTab === 'past' && (
            <Button onClick={() => navigate('/home')} className="mt-6">
              Order Fuel Now
            </Button>
          )}
        </div>
      )}

      {!isLoading && ordersToDisplay.length > 0 && (
        <div className="space-y-4">
          {ordersToDisplay.map(order => (
            <OrderItem key={order.id} order={order} onClick={() => handleOrderClick(order)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersScreen;
