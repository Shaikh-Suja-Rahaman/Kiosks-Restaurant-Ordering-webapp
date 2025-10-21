import { createSlice } from '@reduxjs/toolkit';

// 1. Define the initial state
const initialState = {
  loading: false,
  order: null, // This will hold the successfully created order
  error: null,
  success: false, // We can use this to know when to redirect
};

// 2. Create the slice
export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    orderCreateRequest(state, action) {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    orderCreateSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.order = action.payload; // The new order from the backend
      state.error = null;
    },
    orderCreateFail(state, action) {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    orderReset(state, action) {
      // This will reset the state after the order is placed
      // so the user doesn't see the old success message
      state.loading = false;
      state.order = null;
      state.error = null;
      state.success = false;
    },
  },
});

// 3. Export the actions
export const {
  orderCreateRequest,
  orderCreateSuccess,
  orderCreateFail,
  orderReset,
} = orderSlice.actions;

// 4. Export the reducer
export default orderSlice.reducer;