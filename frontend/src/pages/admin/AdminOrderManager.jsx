import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// 1. Import all the actions we need
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

  // 2. Get the state from our new slice
  const { orders, loading, error, loadingUpdate, errorUpdate, successUpdate } =
    useSelector((state) => state.adminOrders);

  // 3. Get admin user info for the token
  const { userInfo } = useSelector((state) => state.auth);

  // 4. This useEffect fetches all orders on page load
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

        // 5. Make the protected API call to get ALL orders
        const { data } = await axios.get(
          'http://localhost:5001/api/orders',
          config
        );

        dispatch(orderListSuccess(data));
      } catch (err) {
        dispatch(orderListFail(err.response?.data?.message || err.message));
      }
    };

    fetchAllOrders();
  }, [dispatch, userInfo]); // Run once on load

  // 6. This useEffect watches for a successful status update
  useEffect(() => {
    if (successUpdate) {
      alert('Order status updated!');
      dispatch(orderUpdateReset());
      // No need to refetch, our reducer already updated the single item
    }
  }, [successUpdate, dispatch]);

  // 7. This handler updates the order status
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

        // 8. Make the protected API call to update status
        const { data } = await axios.put(
          `http://localhost:5001/api/orders/${orderId}/status`,
          { status: newStatus }, // The payload
          config
        );

        dispatch(orderUpdateSuccess(data));
      } catch (err) {
        dispatch(orderUpdateFail(err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div>
      <h1>Manage Orders</h1>

      {/* Show loading/error messages for the update action */}
      {loadingUpdate && <p>Updating order status...</p>}
      {errorUpdate && <p style={{ color: 'red' }}>{errorUpdate}</p>}

      {loading ? (
        <p>Loading all orders...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                {/* 'order.user' is populated by our backend! */}
                <td>{order.user ? order.user.username : 'Deleted User'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice}</td>
                <td>
                  <span style={{ fontWeight: 'bold' }}>{order.status}</span>
                </td>
                <td>
                  {/* Show buttons only if the order is not completed/cancelled */}
                  {order.status === 'pending' && (
                    <button
                      onClick={() =>
                        updateStatusHandler(order._id, 'in-progress')
                      }
                    >
                      Mark In Progress
                    </button>
                  )}
                  {order.status === 'in-progress' && (
                    <button
                      onClick={() =>
                        updateStatusHandler(order._id, 'completed')
                      }
                    >
                      Mark Completed
                    </button>
                  )}
                  {/* You could add a "Cancel" button here too */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrderManager;