import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [], // This will hold the user's order list
  loading: false,
  error: null,
};

export const myOrdersSlice = createSlice({
  name: 'myOrders',
  initialState,
  reducers: {
    myOrdersRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    myOrdersSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload; // Set to the array of orders from API
    },
    myOrdersFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    myOrdersReset(state, action) {
      // Good for logging out
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { myOrdersRequest, myOrdersSuccess, myOrdersFail, myOrdersReset } =
  myOrdersSlice.actions;

export default myOrdersSlice.reducer;