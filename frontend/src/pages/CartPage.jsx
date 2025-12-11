import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Trash2, Plus, Minus, Loader2, ShoppingBag, Package } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;
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
import { setActiveTab } from '../redux/slices/navigationSlice';


// CartItem Component
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const decreaseQty = () => {
    if (item.quantity > 1) {
      // Just pass the new quantity directly
      onUpdateQuantity(item._id, item.quantity - 1);
    }
  };

  const increaseQty = () => {
    if (item.quantity < 10) {
      // Just pass the new quantity directly
      onUpdateQuantity(item._id, item.quantity + 1);
    }
  };

  return (
    <div className="bg-[#FFF8F0] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-2 border-[#8B4049]/10">
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="flex-shrink-0">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-[#8B4049] to-[#6B3039] rounded-lg flex items-center justify-center">
              <span className="text-[#FFF8F0] text-3xl font-serif">
                {item.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#8B4049] mb-1">
              {item.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-1">
              {item.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={decreaseQty}
                disabled={item.quantity <= 1}
                className="w-8 h-8 rounded-full bg-[#8B4049]/10 text-[#8B4049] hover:bg-[#8B4049]/20 transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-12 text-center font-semibold text-[#8B4049] text-lg">
                {item.quantity}
              </span>

              <button
                onClick={increaseQty}
                disabled={item.quantity >= 10}
                className="w-8 h-8 rounded-full bg-[#8B4049]/10 text-[#8B4049] hover:bg-[#8B4049]/20 transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Rs {item.price.toFixed(2)} each
              </p>
              <p className="text-2xl font-bold text-[#8B4049]">
                Rs {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <div className="flex-shrink-0">
          <button
            onClick={() => onRemove(item._id)}
            className="w-10 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center border-2 border-red-200"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// OrderSummary Component
const OrderSummary = ({ cartItems, totalPrice, onPlaceOrder, loading, error }) => {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-[#FFF8F0] rounded-lg shadow-lg p-6 border-2 border-[#8B4049]/10 sticky top-6">
      <h2 className="text-2xl font-serif font-bold text-[#8B4049] mb-6 flex items-center gap-2">
        <Package className="w-6 h-6" />
        Order Summary
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center pb-3 border-b border-[#8B4049]/10">
          <span className="text-gray-600">Total Items:</span>
          <span className="font-semibold text-[#8B4049] text-lg">{totalItems}</span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-[#8B4049]/10">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold text-[#8B4049] text-lg">Rs {totalPrice}</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-xl font-serif font-bold text-[#8B4049]">Total:</span>
          <span className="text-3xl font-bold text-[#8B4049]">Rs {totalPrice}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm font-semibold">{error}</p>
        </div>
      )}

      <button
        onClick={onPlaceOrder}
        disabled={loading}
        className="w-full bg-[#8B4049] text-[#FFF8F0] py-4 rounded-lg font-bold text-lg hover:bg-[#6B3039] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Placing Order...
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            Place Order
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        You will be redirected after placing your order
      </p>
    </div>
  );
};

// Main CartPage Component
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
      navigate('/');
      dispatch(clearCart());
      dispatch(orderReset());
    }
  }, [success, navigate, dispatch]);

  // Update quantity handler
  const updateQuantityHandler = (itemId, newQuantity) => {
    const existingItem = cartItems.find(item => item._id === itemId);
    if (existingItem) {
      dispatch(addToCart({
        ...existingItem,
        quantity: newQuantity
      }));
    }
  };

  // Remove item handler
  const removeItemHandler = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

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
        `${apiUrl}/api/orders`,
        orderData,
        config
      );

      dispatch(orderCreateSuccess(data));

    } catch (err) {
      dispatch(orderCreateFail(err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3]">
      {/* Header */}
      <div className="bg-[#8B4049] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ShoppingCart className="w-10 h-10 text-[#FFF8F0]" />
            <h1 className="text-5xl font-serif font-bold text-[#FFF8F0]">
              Shopping Cart
            </h1>
          </div>
          <p className="text-[#FFF8F0] text-lg opacity-90">
            Review your items and place your order
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {cartItems.length === 0 ? (
          <div className="bg-[#FFF8F0] rounded-lg shadow-lg p-12 text-center max-w-2xl mx-auto">
            <ShoppingCart className="w-20 h-20 text-[#8B4049] mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-serif font-bold text-[#8B4049] mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet. Start exploring our delicious menu!
            </p>
            <button
              onClick={() => dispatch(setActiveTab('menu'))}
              className="bg-[#8B4049] text-[#FFF8F0] px-8 py-3 rounded-full font-semibold hover:bg-[#6B3039] transition-colors shadow-md hover:shadow-lg"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Takes up 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              <div className="mb-4">
                <h2 className="text-2xl font-serif font-bold text-[#8B4049]">
                  Cart Items ({cartItems.length})
                </h2>
              </div>

              {cartItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onUpdateQuantity={updateQuantityHandler}
                  onRemove={removeItemHandler}
                />
              ))}
            </div>

            {/* Order Summary - Takes up 1 column */}
            <div className="lg:col-span-1">
              <OrderSummary
                cartItems={cartItems}
                totalPrice={totalPrice}
                onPlaceOrder={placeOrderHandler}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;