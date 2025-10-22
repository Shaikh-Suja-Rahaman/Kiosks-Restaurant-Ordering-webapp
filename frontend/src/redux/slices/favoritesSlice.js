import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [], // Will hold the user's favorite MenuItem objects
  loading: false,
  error: null,
  // We need loading state for add/remove
  loadingAdd: false,
  loadingRemove: false,
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // --- Fetching all favorites ---
    favoritesRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    favoritesSuccess(state, action) {
      state.loading = false;
      state.favorites = action.payload; // Payload is the array of items
    },
    favoritesFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Adding a favorite ---
    favoriteAddRequest(state, action) {
      state.loadingAdd = true;
    },
    favoriteAddSuccess(state, action) {
      state.loadingAdd = false;
      // Add the new item to the favorites list
      state.favorites.push(action.payload);
    },
    favoriteAddFail(state, action) {
      state.loadingAdd = false;
      state.error = action.payload;
    },

    // --- Removing a favorite ---
    favoriteRemoveRequest(state, action) {
      state.loadingRemove = true;
    },
    favoriteRemoveSuccess(state, action) {
      state.loadingRemove = false;
      // Remove the item from the list
      const idToRemove = action.payload;
      state.favorites = state.favorites.filter(
        (item) => item._id !== idToRemove
      );
    },
    favoriteRemoveFail(state, action) {
      state.loadingRemove = false;
      state.error = action.payload;
    },

    // --- Clear on Logout ---
    favoritesClear(state, action) {
      state.favorites = [];
      state.loading = false;
      state.error = null;
    }
  },
});

export const {
  favoritesRequest,
  favoritesSuccess,
  favoritesFail,
  favoriteAddRequest,
  favoriteAddSuccess,
  favoriteAddFail,
  favoriteRemoveRequest,
  favoriteRemoveSuccess,
  favoriteRemoveFail,
  favoritesClear,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;