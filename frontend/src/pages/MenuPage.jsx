import React, { useEffect, useState } from 'react'; // <-- 1. Import useState
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Loader2, Plus, Minus } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;
// Import actions (all of this is unchanged)
import { menuRequest, menuSuccess, menuFail } from '../redux/slices/menuSlice';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import {
  favoritesRequest,
  favoritesSuccess,
  favoritesFail,
  favoriteAddRequest,
  favoriteAddSuccess,
  favoriteAddFail,
  favoriteRemoveRequest,
  favoriteRemoveSuccess,
  favoriteRemoveFail,
} from '../redux/slices/favoritesSlice';

// MenuCard Component
const MenuCard = ({
  item,
  isFavorited,
  onAddToCart,
  onIncreaseQty,
  onDecreaseQty,
  onToggleFavorite,
  isLoading,
  userInfo,
  cartQuantity = 0
}) => {
  return (
    <div className="bg-[#FFF8F0] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-[#8B4049]">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            // Add a fallback in case the image is broken
            onError={(e) => { e.target.src = 'https://placehold.co/600x400/EED8C6/8B4513?text=Image+Broken'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8B4049] to-[#6B3039]">
            <span className="text-[#FFF8F0] text-6xl font-serif">
              {item.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Favorite Button Overlay */}
        {userInfo && (
          <button
            onClick={() => onToggleFavorite(item)}
            disabled={isLoading}
            className="absolute top-3 right-3 bg-[#FFF8F0] rounded-full p-2 shadow-md hover:scale-110 transition-transform disabled:opacity-50"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorited ? 'fill-[#8B4049] stroke-[#8B4049]' : 'stroke-[#8B4049]'
              }`}
            />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-2xl font-serif text-[#8B4049] mb-2 font-bold">
          {item.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-3xl font-bold text-[#8B4049]">
            Rs {item.price.toFixed(2)}
          </span>

          {/* Conditional rendering: Show quantity controls if in cart, otherwise show Add to Cart button */}
          {cartQuantity > 0 ? (
            <div className="flex items-center gap-2 bg-[#8B4049] text-[#FFF8F0] px-3 py-2 rounded-full shadow-md">
              <button
                onClick={() => onDecreaseQty(item)}
                className="w-7 h-7 rounded-full bg-[#FFF8F0]/20 hover:bg-[#FFF8F0]/30 transition-colors flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-8 text-center font-semibold text-lg">
                {cartQuantity}
              </span>

              <button
                onClick={() => onIncreaseQty(item)}
                disabled={cartQuantity >= 10}
                className="w-7 h-7 rounded-full bg-[#FFF8F0]/20 hover:bg-[#FFF8F0]/30 transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(item)}
              className="bg-[#8B4049] text-[#FFF8F0] px-5 py-2.5 rounded-full font-semibold hover:bg-[#6B3039] transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 2. ADD A CATEGORY LIST ---
// (I corrected "sandwhich" to "sandwich")
const categories = [
  'All',
  'Burgers',
  'Meals',
  'Pizzas',
  'Biryanis',
  'Sandwich',
  'Hot Beverages',
  'Cold Beverages',
];

// Main MenuPage Component
const MenuPage = () => {
  const dispatch = useDispatch();

  // --- 3. ADD STATE FOR THE SELECTED CATEGORY ---
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get state from slices
    const { items, loading, error } = useSelector((state) => state.menu);
    // Ensure items is always an array
    const safeItems = Array.isArray(items) ? items : [];
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const {
    favorites,
    loading: loadingFav,
    error: errorFav,
    loadingAdd,
    loadingRemove,
  } = useSelector((state) => state.favorites);

  // All useEffects and handlers are unchanged
  // ... (useEffect: Fetch menu) ...
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        dispatch(menuRequest());
        const res = await axios.get(`${apiUrl}/api/menu`);
        dispatch(menuSuccess(res.data));
      } catch (err) {
        dispatch(menuFail(err.response?.data?.message || err.message));
      }
    };
    fetchMenuItems();
  }, [dispatch]);

  // ... (useEffect: Fetch favorites) ...
  useEffect(() => {
    if (userInfo) {
      const fetchFavorites = async () => {
        try {
          dispatch(favoritesRequest());
          const { token } = userInfo;
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const { data } = await axios.get(
            `${apiUrl}/api/favorites`,
            config
          );
          dispatch(favoritesSuccess(data));
        } catch (err) {
          dispatch(favoritesFail(err.response?.data?.message || err.message));
        }
      };
      fetchFavorites();
    }
  }, [dispatch, userInfo]);

  // ... (addToCartHandler) ...
  const addToCartHandler = (item) => {
    const qty = 1;
    dispatch(addToCart({ ...item, quantity: qty }));
  };

  // Handler to increase quantity
  const increaseQtyHandler = (item) => {
    const cartItem = cartItems.find((x) => x._id === item._id);
    if (cartItem && cartItem.quantity < 10) {
      dispatch(addToCart({ ...item, quantity: cartItem.quantity + 1 }));
    }
  };

  // Handler to decrease quantity or remove if quantity becomes 0
  const decreaseQtyHandler = (item) => {
    const cartItem = cartItems.find((x) => x._id === item._id);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        dispatch(addToCart({ ...item, quantity: cartItem.quantity - 1 }));
      } else {
        // Remove from cart if quantity is 1
        dispatch(removeFromCart(item._id));
      }
    }
  };

  // ... (addFavoriteHandler) ...
  const addFavoriteHandler = async (item) => {
    dispatch(favoriteAddRequest());
    try {
      const { token } = userInfo;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(
        `${apiUrl}/api/favorites`,
        { menuItemId: item._id },
        config
      );
      dispatch(favoriteAddSuccess(item));
    } catch (err) {
      dispatch(favoriteAddFail(err.response?.data?.message || err.message));
    }
  };

  // ... (removeFavoriteHandler) ...
  const removeFavoriteHandler = async (itemId) => {
    dispatch(favoriteRemoveRequest());
    try {
      const { token } = userInfo;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(
        `${apiUrl}/api/favorites/${itemId}`,
        config
      );
      dispatch(favoriteRemoveSuccess(itemId));
    } catch (err) {
      dispatch(favoriteRemoveFail(err.response?.data?.message || err.message));
    }
  };

  // ... (toggleFavoriteHandler) ...
  const toggleFavoriteHandler = (item) => {
    const isFavorited = favorites.some((favItem) => favItem._id === item._id);
    if (isFavorited) {
      removeFavoriteHandler(item._id);
    } else {
      addFavoriteHandler(item);
    }
  };

  // --- 4. CREATE THE FILTERED LIST ---
  // This logic runs before rendering
  const filteredItems =
    selectedCategory === 'All'
      ? safeItems
      : safeItems.filter(
          (item) =>
            item.category &&
            item.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3]">
      {/* Header (unchanged) */}
      <div className="bg-[#8B4049] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="text-5xl font-serif font-bold text-[#FFF8F0] mb-2">
            Our Menu
          </h1>
          <p className="text-[#FFF8F0] text-lg opacity-90">
            Discover our exquisite selection of culinary delights
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* --- 5. ADD THE CATEGORY FILTER BAR --- */}
        <div className="mb-8 flex justify-center flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md
                ${
                  selectedCategory === category
                    ? 'bg-[#8B4049] text-[#FFF8F0] ring-2 ring-offset-2 ring-[#8B4049]'
                    : 'bg-[#FFF8F0] text-[#8B4049] hover:bg-[#8B4049] hover:text-[#FFF8F0] hover:shadow-lg'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
        {/* --- END OF NEW SECTION --- */}

        {/* 6. UPDATE THE RENDER LOGIC --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#8B4049] animate-spin mb-4" />
            <p className="text-[#8B4049] text-lg">Loading our delicious menu...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 text-lg font-semibold">{error}</p>
          </div>
        ) : (
          // Check if the *filtered* list is empty
          filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#8B4049] text-lg">
                No items found in the "{selectedCategory}" category.
              </p>
            </div>
          ) : (
            // Map over *filteredItems* instead of *items*
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => {
                const isFavorited = favorites.some(
                  (favItem) => favItem._id === item._id
                );

                // Find the quantity of this item in cart
                const cartItem = cartItems.find((cartItem) => cartItem._id === item._id);
                const cartQuantity = cartItem ? cartItem.quantity : 0;

                return (
                  <MenuCard
                    key={item._id}
                    item={item}
                    isFavorited={isFavorited}
                    onAddToCart={addToCartHandler}
                    onIncreaseQty={increaseQtyHandler}
                    onDecreaseQty={decreaseQtyHandler}
                    onToggleFavorite={toggleFavoriteHandler}
                    isLoading={loadingAdd || loadingRemove}
                    userInfo={userInfo}
                    cartQuantity={cartQuantity}
                  />
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MenuPage;
