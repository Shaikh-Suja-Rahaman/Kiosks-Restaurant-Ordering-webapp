import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  loading: false,
  error: null,
  loadingUpdate: false, // For when we update a status
  errorUpdate: null,
  successUpdate: false,
};

export const adminOrderSlice = createSlice({
  name: 'adminOrders',
  initialState,
  reducers: {
    // --- Fetching All Orders ---
    orderListRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    orderListSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload;
    },
    orderListFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    // --- Updating Order Status ---
    orderUpdateRequest(state, action) {
      state.loadingUpdate = true;
      state.errorUpdate = null;
      state.successUpdate = false;
    },
    orderUpdateSuccess(state, action) {
      state.loadingUpdate = false;
      state.successUpdate = true;
      // We'll replace the order in the list
      const updatedOrder = action.payload;
      state.orders = state.orders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      );
    },
    orderUpdateFail(state, action) {
      state.loadingUpdate = false;
      state.errorUpdate = action.payload;
    },
    orderUpdateReset(state, action) {
      state.loadingUpdate = false;
      state.errorUpdate = null;
      state.successUpdate = false;
    }
  },
});

export const {
  orderListRequest,
  orderListSuccess,
  orderListFail,
  orderUpdateRequest,
  orderUpdateSuccess,
  orderUpdateFail,
  orderUpdateReset,
} = adminOrderSlice.actions;

export default adminOrderSlice.reducer;