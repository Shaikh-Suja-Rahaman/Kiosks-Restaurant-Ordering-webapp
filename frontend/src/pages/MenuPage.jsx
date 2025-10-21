import React, { useEffect, useState } from 'react'; // <-- 1. Import useState
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { menuRequest, menuSuccess, menuFail } from '../redux/slices/menuSlice';
import { addToCart } from '../redux/slices/cartSlice'; // <-- 2. Import addToCart

const MenuPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.menu);
  const cart = useSelector((state) => state.cart);


  // This useEffect (for fetching the menu) is perfect, leave it as is
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

  // 3. Create the handler function
  const addToCartHandler = (item) => {
    // For now, we'll just add 1
    // A more advanced version would use a <select> for quantity
    const qty = 1;
    dispatch(addToCart({ ...item, quantity: qty }));
    console.log(cart);


    // Optional: Add a confirmation
    console.log(`${item.name} added to cart`);
    // Later, you can add a toast/popup notification here
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
          {items.map((item) => (
            <div key={item._id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <h3>${item.price}</h3>

              {/* 4. Wire up the button */}
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

export default MenuPage;