import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import  menuReducer from './slices/menuSlice.js'
import cartReducer from './slices/cartSlice.js'
import orderReducer from './slices/orderSlice.js';

export const store = configureStore({
  reducer : {
    //all my reducers will go here
    auth: authReducer,
    menu: menuReducer,
    cart : cartReducer,
    order: orderReducer,
  },
  devTools: true, //so that i can use my browser extension
})