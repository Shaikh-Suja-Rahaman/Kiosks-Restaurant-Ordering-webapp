import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// 1. Import the actions for this page
import {
  myOrdersRequest,
  myOrdersSuccess,
  myOrdersFail,
} from '../redux/slices/myOrdersSlice';

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 2. Get the state slices we need
  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { userInfo } = useSelector((state) => state.auth); // <-- We need this for the token!

  // 3. This useEffect runs once to fetch orders

  useEffect(() => {
    // Define the async function
    const fetchMyOrders = async () => {
      try {
        dispatch(myOrdersRequest()); // Start loading

        // 4. Get the token from the user's state
        const { token } = userInfo;

        // 5. Create the all-important config object
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // <-- This proves who we are
          },
        };

        // 6. Make the PROTECTED API call
        const { data } = await axios.get(
          'http://localhost:5001/api/orders/myorders',
          config // Pass the config object
        );

        // 7. On success, dispatch the orders
        dispatch(myOrdersSuccess(data));
      } catch (err) {
        // 8. On failure, dispatch the error
        dispatch(myOrdersFail(err.response?.data?.message || err.message));
      }
    };

    // 9. Security Check!
    if (!userInfo) { //to even view this page, i would need to be logged in
      navigate('/login'); // If not logged in, go to login page
    } else {
      fetchMyOrders(); // If logged in, fetch the orders
    }
  }, [dispatch, navigate, userInfo]); // Re-run if any of these change

  return (
    <div>
      <h1>My Orders</h1>
      {loading ? (
        <p>Loading your orders...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : orders.length === 0 ? (
        <p>You have no past orders. <a href="/">Go to Home</a></p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice}</td>
                <td>{order.status}</td>
                {/* Later, you can make this a Link:
                  <td><a href={`/order/${order._id}`}>Details</a></td>
                */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistoryPage;