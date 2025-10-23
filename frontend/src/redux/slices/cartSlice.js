// src/redux/slices/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

// The "Reader"
const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    //  The "Saver"
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(x => x._id === newItem._id);

      if (existingItem) {
        // Update quantity of existing item
        state.cartItems = state.cartItems.map(item =>
          item._id === newItem._id ? { ...item, quantity: newItem.quantity } : item
        );
      } else {
        // Add new item with quantity
        state.cartItems.push({ ...newItem, quantity: 1 });
      }
    },

    // Another "Saver"
    removeFromCart(state, action) {
      const idToRemove = action.payload; // Payload will just be the item's _id
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== idToRemove
      );

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    // The "Deleter"
    clearCart(state, action) {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;