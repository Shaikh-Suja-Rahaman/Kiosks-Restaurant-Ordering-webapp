import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, DollarSign, Loader2, ShoppingBag } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;
// Import the actions for this page
import {
  myOrdersRequest,
  myOrdersSuccess,
  myOrdersFail,
} from '../redux/slices/myOrdersSlice';

// OrderCard Component
const OrderCard = ({ order }) => {
  // Status styling helper
  const getStatusStyle = (status) => {
    const statusLower = status.toLowerCase();

    if (statusLower === 'delivered' || statusLower === 'completed') {
      return 'bg-green-100 text-green-700 border-green-300';
    } else if (statusLower === 'pending' || statusLower === 'processing') {
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    } else if (statusLower === 'cancelled' || statusLower === 'failed') {
      return 'bg-red-100 text-red-700 border-red-300';
    } else if (statusLower === 'shipped' || statusLower === 'out for delivery') {
      return 'bg-blue-100 text-blue-700 border-blue-300';
    } else {
      return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="bg-[#FFF8F0] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-[#8B4049]/10">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#8B4049] to-[#6B3039] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-[#FFF8F0]" />
          <div>
            <p className="text-[#FFF8F0] text-sm opacity-80">Order ID</p>
            <p className="text-[#FFF8F0] font-semibold font-mono text-sm">
              #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusStyle(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#8B4049]/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#8B4049]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
              <p className="text-[#8B4049] font-semibold">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className='text-gray-500 font-medium'>
                {new Date(order.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true // set to false for 24-hour format
                })}
              </p>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#8B4049]/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#8B4049]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
              <p className="text-[#8B4049] font-bold text-xl">
                Rs {order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items Summary (if available) */}
        {order.orderItems && order.orderItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#8B4049]/10">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold text-[#8B4049]">{order.orderItems.length}</span> item(s) in this order
            </p>
            <div className="flex flex-wrap gap-2">
              {order.orderItems.slice(0, 3).map((item, idx) => (
                <span key={idx} className="px-3 py-1 bg-[#8B4049]/5 text-[#8B4049] text-xs rounded-full">
                  {item.name || 'Item'} {item.quantity > 1 && `(x${item.quantity})`}
                </span>
              ))}
              {order.orderItems.length > 3 && (
                <span className="px-3 py-1 bg-[#8B4049]/5 text-[#8B4049] text-xs rounded-full">
                  +{order.orderItems.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* View Details Button */}

      </div>
    </div>
  );
};

// Main OrderHistoryPage Component
const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the state slices we need
  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { userInfo } = useSelector((state) => state.auth);

  // This useEffect runs once to fetch orders
  useEffect(() => {
    // Define the async function
    const fetchMyOrders = async () => {
      try {
        dispatch(myOrdersRequest());

        // Get the token from the user's state
        const { token } = userInfo;

        // Create the all-important config object
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Make the PROTECTED API call
        const { data } = await axios.get(
          `${apiUrl}/api/orders/myorders`,
          config
        );

        // On success, dispatch the orders
        dispatch(myOrdersSuccess(data));
      } catch (err) {
        // On failure, dispatch the error
        dispatch(myOrdersFail(err.response?.data?.message || err.message));
      }
    };

    // Security Check!
    if (!userInfo) {
      navigate('/login');
    } else {
      fetchMyOrders();
    }
  }, [dispatch, navigate, userInfo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3]">
      {/* Header */}
      <div className="bg-[#8B4049] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ShoppingBag className="w-10 h-10 text-[#FFF8F0]" />
            <h1 className="text-5xl font-serif font-bold text-[#FFF8F0]">
              Order History
            </h1>
          </div>
          <p className="text-[#FFF8F0] text-lg opacity-90">
            Track and review all your previous orders
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#8B4049] animate-spin mb-4" />
            <p className="text-[#8B4049] text-lg">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#8B4049] text-[#FFF8F0] px-6 py-3 rounded-lg font-semibold hover:bg-[#6B3039] transition-colors"
            >
              Return to Home
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#FFF8F0] rounded-lg shadow-lg p-12 text-center">
            <Package className="w-20 h-20 text-[#8B4049] mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-serif font-bold text-[#8B4049] mb-3">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start exploring our menu!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#8B4049] text-[#FFF8F0] px-8 py-3 rounded-full font-semibold hover:bg-[#6B3039] transition-colors shadow-md hover:shadow-lg"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[#8B4049] font-semibold text-lg">
                Total Orders: <span className="text-2xl">{orders.length}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              )).reverse()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;