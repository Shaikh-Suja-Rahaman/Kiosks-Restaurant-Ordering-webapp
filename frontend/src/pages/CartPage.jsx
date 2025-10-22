import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Import all our actions ---
import {
  addToCart,
  removeFromCart,
  clearCart,
} from '../redux/slices/cartSlice';
import {
  orderCreateRequest,
  orderCreateSuccess,
  orderCreateFail,
  orderReset,
} from '../redux/slices/orderSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Get all the state slices we need
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { loading, error, success, order } = useSelector((state) => state.order);

  // 2. Calculate the total price
  // .reduce() is a standard way to sum up an array
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2); // .toFixed(2) makes it look like $12.50

  // 3. This useEffect handles what happens AFTER an order is placed
  useEffect(() => {
    if (success) {
      // Order was successful!
      // 'order._id' comes from the orderCreateSuccess payload
      alert('Order placed successfully!'); // Simple alert

      // We will create this OrderDetailsPage next
      // navigate(`/order/${order._id}`);

      navigate('/'); // For now, just go to the homepage
      dispatch(clearCart()); // Clear the cart
      dispatch(orderReset()); // Reset the order state
    }
  }, [success, navigate, dispatch, order]);

  // 4. This handler runs when "Place Order" is clicked
  const placeOrderHandler = async () => {
    // Check if user is logged in
    if (!userInfo) {
      navigate('/login'); // Redirect to login if not
      return;
    }

    dispatch(orderCreateRequest()); // Set loading = true

    try {
      // 5. This is our first PROTECTED API call
      // Get the token from the user info
      const { token } = userInfo;

      // Set up the request headers to include the token
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // <-- This is the magic
        },
      };

      // 6. This is the payload for the backend
      const orderData = {
        orderItems: cartItems,
        totalPrice: totalPrice,
        // paymentStatus could be set here if you have a payment system
      };

      // 7. Make the API call
      const { data } = await axios.post(
        'http://localhost:5001/api/orders',
        orderData,
        config
      );

      // 8. On success, dispatch success and clear the cart
      dispatch(orderCreateSuccess(data)); // 'data' is the new order from backend

    } catch (err) {
      // 9. On failure, dispatch the error
      dispatch(orderCreateFail(err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <a href="/">Go to Home</a></p>
      ) : (
        <div>
          {/* --- Cart Items List --- */}
          <div>
            {cartItems.map((item) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
                <span>{item.name}</span>

                {/* --- Quantity Selector --- */}
                {/* This re-uses our addToCart logic! */}
                <select
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch(
                      addToCart({ ...item, quantity: Number(e.target.value) })
                    )
                  }
                >
                  {/* Creates options 1, 2, 3... up to 10 */}
                  {[...Array(10).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>

                <span>${(item.price * item.quantity).toFixed(2)}</span>

                {/* --- Remove Button --- */}
                <button onClick={() => dispatch(removeFromCart(item._id))}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* --- Order Summary --- */}
          <div>
            <h2>Order Summary</h2>
            <p>
              Total Items: {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </p>
            <p>Total Price: ${totalPrice}</p>

            {/* Show error/loading messages */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading && <p>Placing order...</p>}

            <button onClick={placeOrderHandler} disabled={cartItems.length === 0 || loading}>
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;