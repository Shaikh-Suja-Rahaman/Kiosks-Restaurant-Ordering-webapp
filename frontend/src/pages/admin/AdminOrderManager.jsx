// ============================================
// ADMIN ORDER MANAGER
// ============================================
const apiUrl = import.meta.env.VITE_API_URL;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { ShoppingBag, Loader2, AlertCircle, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  orderListRequest,
  orderListSuccess,
  orderListFail,
  orderUpdateRequest,
  orderUpdateSuccess,
  orderUpdateFail,
  orderUpdateReset,
} from '../../redux/slices/adminOrderSlice';

const AdminOrderManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error, loadingUpdate, errorUpdate, successUpdate } =
    useSelector((state) => state.adminOrders);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        dispatch(orderListRequest());
        const { token } = userInfo;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(
          `${apiUrl}/api/orders`,
          config
        );
        dispatch(orderListSuccess(data));
      } catch (err) {
        dispatch(orderListFail(err.response?.data?.message || err.message));
      }
    };
    fetchAllOrders();
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (successUpdate) {
      dispatch(orderUpdateReset());
    }
  }, [successUpdate, dispatch]);

  const updateStatusHandler = async (orderId, newStatus) => {
    if (window.confirm(`Mark this order as "${newStatus}"?`)) {
      try {
        dispatch(orderUpdateRequest());
        const { token } = userInfo;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.put(
          `http://localhost:5001/api/orders/${orderId}/status`,
          { status: newStatus },
          config
        );
        dispatch(orderUpdateSuccess(data));
      } catch (err) {
        dispatch(orderUpdateFail(err.response?.data?.message || err.message));
      }
    }
  };

  const getStatusStyle = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed') {
      return 'bg-green-100 text-green-700 border-green-300';
    } else if (statusLower === 'pending') {
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    } else if (statusLower === 'in-progress') {
      return 'bg-blue-100 text-blue-700 border-blue-300';
    } else if (statusLower === 'cancelled') {
      return 'bg-red-100 text-red-700 border-red-300';
    } else {
      return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3]">
      {/* Header */}
      <div className="bg-[#8B4049] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Add Back Button */}
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="mb-6 flex items-center gap-2 text-[#FFF8F0] hover:text-[#FFF8F0]/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          {/* Existing header content */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#FFF8F0] rounded-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-[#8B4049]" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-[#FFF8F0]">
                Manage Orders
              </h1>
              <p className="text-[#FFF8F0] opacity-90">
                View and update order statuses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Status Messages */}
        {loadingUpdate && (
          <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <p className="text-blue-600 font-semibold">Updating order status...</p>
          </div>
        )}
        {errorUpdate && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600 font-semibold">{errorUpdate}</p>
          </div>
        )}
        {successUpdate && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-600 font-semibold">Order status updated successfully!</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#8B4049] animate-spin mb-4" />
            <p className="text-[#8B4049] text-lg">Loading all orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 text-lg font-semibold">{error}</p>
          </div>
        ) : (
          <div className="bg-[#FFF8F0] rounded-lg shadow-lg overflow-hidden border-2 border-[#8B4049]/10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#8B4049] to-[#6B3039]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#FFF8F0] uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#FFF8F0] uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#FFF8F0] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#FFF8F0] uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#FFF8F0] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-[#FFF8F0] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8B4049]/10">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#8B4049]/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-[#8B4049] font-semibold">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#8B4049]">
                          {order.user ? order.user.username : 'Deleted User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#8B4049] text-lg">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusStyle(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateStatusHandler(order._id, 'in-progress')}
                              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-semibold text-sm border-2 border-blue-200 flex items-center gap-1"
                            >
                              <Clock className="w-4 h-4" />
                              In Progress
                            </button>
                          )}
                          {order.status === 'in-progress' && (
                            <button
                              onClick={() => updateStatusHandler(order._id, 'completed')}
                              className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-semibold text-sm border-2 border-green-200 flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Complete
                            </button>
                          )}
                          {(order.status === 'pending' || order.status === 'in-progress') && (
                            <button
                              onClick={() => updateStatusHandler(order._id, 'cancelled')}
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm border-2 border-red-200 flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel
                            </button>
                          )}
                          {(order.status === 'completed' || order.status === 'cancelled') && (
                            <span className="text-gray-400 text-sm font-semibold">
                              No actions available
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderManager;