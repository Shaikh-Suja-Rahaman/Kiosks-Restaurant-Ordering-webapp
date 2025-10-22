import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  success: false, // We can use this to know when an action is done
  item: null, //
  loadingItem: false, //
  errorItem: null,
};

// This slice will handle Create, Update, AND Delete
export const menuAdminSlice = createSlice({
  name: 'menuAdmin',
  initialState,
  reducers: {
    // --- Delete Reducers ---
    menuDeleteRequest(state, action) {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    menuDeleteSuccess(state, action) {
      state.loading = false;
      state.success = true; // We'll watch for this to refetch the list
    },
    menuDeleteFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Create Reducers (we'll use these later) ---
    menuCreateRequest(state, action) {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    menuCreateSuccess(state, action) {
      state.loading = false;
      state.success = true;
    },
    menuCreateFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    menuUpdateRequest(state, action) {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    menuUpdateSuccess(state, action) {
      state.loading = false;
      state.success = true;
    },
    menuUpdateFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    menuItemRequest(state, action) {
      state.loadingItem = true;
      state.item = null;
      state.errorItem = null;
    },
    menuItemSuccess(state, action) {
      state.loadingItem = false;
      state.item = action.payload;
    },
    menuItemFail(state, action) {
      state.loadingItem = false;
      state.errorItem = action.payload;
    },

    // A reset action
    menuAdminReset(state, action) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.item = null; //
      state.loadingItem = false; //
      state.errorItem = null; //
    }
  },
});

export const {
  menuDeleteRequest,
  menuDeleteSuccess,
  menuDeleteFail,
  menuCreateRequest,
  menuCreateSuccess,
  menuCreateFail,
  menuAdminReset,
  menuUpdateRequest,
  menuUpdateSuccess,
  menuUpdateFail,
  menuItemRequest,
  menuItemSuccess,
  menuItemFail,
} = menuAdminSlice.actions;

export default menuAdminSlice.reducer;