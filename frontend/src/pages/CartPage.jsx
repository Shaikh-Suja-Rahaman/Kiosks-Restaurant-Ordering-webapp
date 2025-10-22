import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import all our actions
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

  // Get all the state slices we need
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { loading, error, success, order } = useSelector((state) => state.order);

  // Calculate the total price
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  // This useEffect handles what happens AFTER an order is placed
  useEffect(() => {
    if (success) {
      alert('Order placed successfully!');
      navigate('/');
      dispatch(clearCart());
      dispatch(orderReset());
    }
  }, [success, navigate, dispatch, order]);

  // This handler runs when "Place Order" is clicked
  const placeOrderHandler = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    dispatch(orderCreateRequest());

    try {
      const { token } = userInfo;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const orderData = {
        orderItems: cartItems,
        totalPrice: totalPrice,
      };

      const { data } = await axios.post(
        'http://localhost:5001/api/orders',
        orderData,
        config
      );

      dispatch(orderCreateSuccess(data));

    } catch (err) {
      dispatch(orderCreateFail(err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <a href="/menu">Go to Menu</a></p>
      ) : (
        <div>
          {/* --- Cart Items List --- */}
          <div>
            {cartItems.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center', // Helps align items vertically
                  margin: '10px',
                  borderBottom: '1Gpx solid #eee',
                  paddingBottom: '10px'
                }}
              >
                {/* --- ADD THIS SECTION --- */}
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                      marginRight: '10px'
                    }}
                  />
                )}
                {/* --- END OF NEW SECTION --- */}

                <span style={{ flex: 1 }}>{item.name}</span>

                {/* Quantity Selector */}
                <select
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch(
                      addToCart({ ...item, quantity: Number(e.target.value) })
                    )
                  }
                  style={{ margin: '0 10px' }}
                >
                  {[...Array(10).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>

                <span style={{ margin: '0 10px' }}>${(item.price * item.quantity).toFixed(2)}</span>

                {/* Remove Button */}
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
