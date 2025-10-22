import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';


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

const MenuPage = () => {
  const dispatch = useDispatch();

  // Get state from ALL THREE slices
  const { items, loading, error } = useSelector((state) => state.menu);
  const { userInfo } = useSelector((state) => state.auth);
  // We alias loading/error to avoid conflicts
  const {
    favorites,
    loading: loadingFav,
    error: errorFav,
    loadingAdd,
    loadingRemove,
  } = useSelector((state) => state.favorites);

  // This useEffect (for fetching the menu) is stilll needed
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

  //  NEW useEffect: Fetch favorites *if* the user is logged in
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
          // 'data' is the populated list of favorite items
          dispatch(favoritesSuccess(data));
        } catch (err) {
          dispatch(favoritesFail(err.response?.data?.message || err.message));
        }
      };
      fetchFavorites();
    }
  }, [dispatch, userInfo]); // Re-run if user logs in

  // 5. Add to Cart handler (no change)
  const addToCartHandler = (item) => {
    const qty = 1;
    dispatch(addToCart({ ...item, quantity: qty }));
    console.log(`${item.name} added to cart`);
  };

  // 6. NEW handler: Add a favorite
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
      // We only need to send the ID
      await axios.post(
        'http://localhost:5001/api/favorites',
        { menuItemId: item._id },
        config
      );
      // We add the full 'item' to our state so the UI updates
      dispatch(favoriteAddSuccess(item));
    } catch (err) {
      dispatch(favoriteAddFail(err.response?.data?.message || err.message));
    }
  };

  // 7. NEW handler: Remove a favorite
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
      // We just send the 'itemId' to the reducer to filter it out
      dispatch(favoriteRemoveSuccess(itemId));
    } catch (err) {
      dispatch(favoriteRemoveFail(err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h1>Menu</h1>
      {loading ? (
        <p>Loading menu...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div>
          {items.map((item) => {
            // 8. Check if this item is in our favorites array
            const isFavorited = favorites.some(
              (favItem) => favItem._id === item._id
            );

            return (
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

                {/* 9. The new Favorite button */}
                <button
                  onClick={() =>
                    isFavorited
                      ? removeFavoriteHandler(item._id)
                      : addFavoriteHandler(item)
                  }
                  // Disable if not logged in, or if add/remove is loading
                  disabled={!userInfo || loadingAdd || loadingRemove}
                >
                  {isFavorited ? '❤️' : '🤍'} {/* Filled vs. Empty Heart */}
                </button>

                {/* Add to Cart button (no change) */}
                <button onClick={() => addToCartHandler(item)}>
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MenuPage;