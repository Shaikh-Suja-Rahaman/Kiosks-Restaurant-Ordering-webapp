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
    addToCart(state, action) {
      const itemToAdd = action.payload;

      const existingItem = state.cartItems.find(
        (item) => item._id === itemToAdd._id
      );

      if (existingItem) {
        state.cartItems = state.cartItems.map((item) =>
          item._id === existingItem._id
            ? { ...item, quantity: item.quantity + itemToAdd.quantity }
            : item
        );
      } else {
        state.cartItems = [...state.cartItems, itemToAdd];
      }

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
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