import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer : {
    //all my reducers will go here
    auth: authReducer,
  },
  devTools: true, //so that i can use my browser extension
})