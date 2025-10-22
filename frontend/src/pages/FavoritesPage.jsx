import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// 1. Import all the actions we need
import {
  favoritesRequest,
  favoritesSuccess,
  favoritesFail,
  favoriteRemoveRequest,
  favoriteRemoveSuccess,
  favoriteRemoveFail,
} from '../redux/slices/favoritesSlice';
import { addToCart } from '../redux/slices/cartSlice';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 2. Get the state slices
  const { userInfo } = useSelector((state) => state.auth);
  const {
    favorites,
    loading,
    error,
    loadingRemove,
  } = useSelector((state) => state.favorites);

  // 3. This useEffect fetches favorites on page load
  // We do this *again* (like on MenuPage) to ensure this
  // page works even if the user bookmarks it directly.
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      // Only fetch if the list isn't already loaded
      // This is a small optimization
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
    }
  }, [dispatch, navigate, userInfo, favorites.length]); // Re-run if user logs in

  // 4. Remove handler (copied from MenuPage)
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

  // 5. Add to Cart handler (copied from MenuPage)
  const addToCartHandler = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
    alert(`${item.name} added to cart`);
  };

  return (
    <div>
      <h1>My Favorites</h1>
      {loading ? (
        <p>Loading favorites...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : favorites.length === 0 ? (
        <p>You have no favorites. <a href="/">Go to Home</a></p>
      ) : (
        <div>
          {/* 6. Map over the 'favorites' array */}
          {favorites.map((item) => (
            <div
              key={item._id}
              style={{
                border: '1px solid black',
                margin: '10px',
                padding: '10px',
              }}
            >
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <h3>${item.price}</h3>

              {/* Remove Favorite Button */}
              <button
                onClick={() => removeFavoriteHandler(item._id)}
                disabled={loadingRemove}
              >
                ❤️ Remove
              </button>

              {/* Add to Cart Button */}
              <button onClick={() => addToCartHandler(item)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;