import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Loader2 } from 'lucide-react';

// Import actions from ALL THREE slices
import { menuRequest, menuSuccess, menuFail } from '../redux/slices/menuSlice';
import { addToCart } from '../redux/slices/cartSlice';
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
const MenuCard = ({ item, isFavorited, onAddToCart, onToggleFavorite, isLoading, userInfo }) => {
  return (
    <div className="bg-[#FFF8F0] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-[#8B4049]">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
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

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-3xl font-bold text-[#8B4049]">
            ${item.price.toFixed(2)}
          </span>

          <button
            onClick={() => onAddToCart(item)}
            className="bg-[#8B4049] text-[#FFF8F0] px-5 py-2.5 rounded-full font-semibold hover:bg-[#6B3039] transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// Main MenuPage Component
const MenuPage = () => {
  const dispatch = useDispatch();

  // Get state from ALL THREE slices
  const { items, loading, error } = useSelector((state) => state.menu);
  const { userInfo } = useSelector((state) => state.auth);
  const {
    favorites,
    loading: loadingFav,
    error: errorFav,
    loadingAdd,
    loadingRemove,
  } = useSelector((state) => state.favorites);

  // useEffect: Fetch menu
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        dispatch(menuRequest());
        const res = await axios.get('http://localhost:5001/api/menu');
        dispatch(menuSuccess(res.data));
      } catch (err) {
        dispatch(menuFail(err.response?.data?.message || err.message));
      }
    };
    fetchMenuItems();
  }, [dispatch]);

  // useEffect: Fetch favorites
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
            'http://localhost:5001/api/favorites',
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

  // Add to Cart handler
  const addToCartHandler = (item) => {
    const qty = 1;
    dispatch(addToCart({ ...item, quantity: qty }));
  };

  // Add a favorite handler
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
        'http://localhost:5001/api/favorites',
        { menuItemId: item._id },
        config
      );
      dispatch(favoriteAddSuccess(item));
    } catch (err) {
      dispatch(favoriteAddFail(err.response?.data?.message || err.message));
    }
  };

  // Remove a favorite handler
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
        `http://localhost:5001/api/favorites/${itemId}`,
        config
      );
      dispatch(favoriteRemoveSuccess(itemId));
    } catch (err) {
      dispatch(favoriteRemoveFail(err.response?.data?.message || err.message));
    }
  };

  // Toggle favorite handler
  const toggleFavoriteHandler = (item) => {
    const isFavorited = favorites.some((favItem) => favItem._id === item._id);
    if (isFavorited) {
      removeFavoriteHandler(item._id);
    } else {
      addFavoriteHandler(item);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3]">
      {/* Header */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const isFavorited = favorites.some(
                (favItem) => favItem._id === item._id
              );

              return (
                <MenuCard
                  key={item._id}
                  item={item}
                  isFavorited={isFavorited}
                  onAddToCart={addToCartHandler}
                  onToggleFavorite={toggleFavoriteHandler}
                  isLoading={loadingAdd || loadingRemove}
                  userInfo={userInfo}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;