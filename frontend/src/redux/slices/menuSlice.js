import { createSlice } from '@reduxjs/toolkit';

// 1. Define the initial state
const initialState = {
  items: [], // This will hold our menu items
  loading: false,
  error: null,
};

// 2. Create the slice
export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    // These are our actions
    menuRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    menuSuccess(state, action) {
      state.loading = false;
      state.items = action.payload; // Set items to the array from the API
    },
    menuFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// 3. Export the actions
export const { menuRequest, menuSuccess, menuFail } = menuSlice.actions;

// 4. Export the reducer
export default menuSlice.reducer;