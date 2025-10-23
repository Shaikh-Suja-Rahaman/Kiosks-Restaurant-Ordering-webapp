import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Loader2, Trash2, HeartOff } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;
// Import all the actions we need
import {
  favoritesRequest,
  favoritesSuccess,
  favoritesFail,
  favoriteRemoveRequest,
  favoriteRemoveSuccess,
  favoriteRemoveFail,
} from '../redux/slices/favoritesSlice';
import { addToCart } from '../redux/slices/cartSlice';

// FavoriteCard Component
const FavoriteCard = ({ item, onRemoveFavorite, onAddToCart, isLoadingRemove }) => {
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

        {/* Favorite Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-[#FFF8F0] rounded-full p-2 shadow-lg">
            <Heart className="w-5 h-5 fill-[#8B4049] stroke-[#8B4049]" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-2xl font-serif text-[#8B4049] mb-2 font-bold">
          {item.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {item.description}
        </p>

        {/* Price */}
        <div className="mb-4">
          <span className="text-3xl font-bold text-[#8B4049]">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onAddToCart(item)}
            className="flex-1 bg-[#8B4049] text-[#FFF8F0] px-4 py-2.5 rounded-full font-semibold hover:bg-[#6B3039] transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>

          <button
            onClick={() => onRemoveFavorite(item._id)}
            disabled={isLoadingRemove}
            className="bg-red-50 text-red-600 px-4 py-2.5 rounded-full font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-200"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

// Main FavoritesPage Component
const FavoritesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the state slices
  const { userInfo } = useSelector((state) => state.auth);
  const {
    favorites,
    loading,
    error,
    loadingRemove,
  } = useSelector((state) => state.favorites);

  // This useEffect fetches favorites on page load
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      // Only fetch if the list isn't already loaded
      if (favorites.length === 0) {
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
    }
  }, [dispatch, navigate, userInfo, favorites.length]);

  // Remove handler
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

  // Add to Cart handler
  const addToCartHandler = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3]">
      {/* Header */}
      <div className="bg-[#8B4049] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Heart className="w-10 h-10 text-[#FFF8F0] fill-[#FFF8F0]" />
            <h1 className="text-5xl font-serif font-bold text-[#FFF8F0]">
              My Favorites
            </h1>
          </div>
          <p className="text-[#FFF8F0] text-lg opacity-90">
            Your most loved dishes, all in one place
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#8B4049] animate-spin mb-4" />
            <p className="text-[#8B4049] text-lg">Loading your favorites...</p>
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
        ) : favorites.length === 0 ? (
          <div className="bg-[#FFF8F0] rounded-lg shadow-lg p-12 text-center max-w-2xl mx-auto">
            <HeartOff className="w-20 h-20 text-[#8B4049] mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-serif font-bold text-[#8B4049] mb-3">
              No Favorites Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding dishes to your favorites by clicking the heart icon on any menu item!
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
                <span className="text-2xl">{favorites.length}</span> {favorites.length === 1 ? 'Favorite' : 'Favorites'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((item) => (
                <FavoriteCard
                  key={item._id}
                  item={item}
                  onRemoveFavorite={removeFavoriteHandler}
                  onAddToCart={addToCartHandler}
                  isLoadingRemove={loadingRemove}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;