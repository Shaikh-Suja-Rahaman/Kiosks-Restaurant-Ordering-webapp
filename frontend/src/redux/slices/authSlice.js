import { createSlice } from '@reduxjs/toolkit';

// 1. Get user info (and token) from localStorage, if it exists
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// 2. Define the initial state of this slice
const initialState = {
  userInfo: userInfoFromStorage, // This is our user object
  loading: false,
  error: null,
};

// 3. Create the slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // 'reducers' are functions that can change the state
  reducers: {
    // We'll dispatch this when the user logs in/registers
    setCredentials(state, action) { //my payload is my token along with my other details, info in general
      state.userInfo = action.payload; // Set user info
      state.loading = false;
      state.error = null;
      // Also save it to localStorage
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // We'll dispatch this when the user logs out
    logout(state, action) {
      state.userInfo = null; // Clear user info
      localStorage.removeItem('userInfo'); // Remove from localStorage
    },
    // We can use these for loading spinners
    setLoading(state, action) {
      state.loading = true;
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// 4. Export the 'actions' (the functions)
export const { setCredentials, logout, setLoading, setError } = authSlice.actions;

// 5. Export the 'reducer' (the whole slice)
export default authSlice.reducer;
