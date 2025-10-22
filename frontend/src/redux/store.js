import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice.js';
import menuReducer from './slices/menuSlice.js';
import cartReducer from './slices/cartSlice.js';
import orderReducer from './slices/orderSlice.js';
import myOrdersReducer from './slices/myOrdersSlice.js';
import menuAdminReducer from './slices/menuAdminSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    cart: cartReducer,
    order: orderReducer,
    myOrders: myOrdersReducer,
    menuAdmin: menuAdminReducer, // 2. Add it here
  },
  devTools: true,
});