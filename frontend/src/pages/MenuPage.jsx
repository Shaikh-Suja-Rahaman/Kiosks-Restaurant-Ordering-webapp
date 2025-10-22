import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

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
    console.log(`${item.name} added to cart`);
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
                {/* --- ADD THIS SECTION --- */}
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                    }}
                  />
                )}
                {/* --- END OF NEW SECTION --- */}

                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <h3>${item.price}</h3>

                <button
                  onClick={() =>
                    isFavorited
                      ? removeFavoriteHandler(item._id)
                      : addFavoriteHandler(item)
                  }
                  disabled={!userInfo || loadingAdd || loadingRemove}
                >
                  {isFavorited ? '❤️' : '🤍'}
                </button>

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
