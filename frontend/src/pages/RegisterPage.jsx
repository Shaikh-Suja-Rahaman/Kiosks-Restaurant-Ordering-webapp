import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- REDUX IMPORTS ---
// 1. 'useDispatch' is how you "call" or "trigger" a Redux action
// 2. 'useSelector' is how you "read" data from the Redux state
import { useDispatch, useSelector } from 'react-redux';
// 3. We import the specific actions we made in our authSlice
import { setCredentials, setLoading, setError } from '../redux/slices/authSlice';

// --- END REDUX IMPORTS ---

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- REDUX HOOKS ---
  const dispatch = useDispatch(); // This is our "remote control"
  const navigate = useNavigate(); // This is for redirecting after login

  // 4. We "select" (read) the auth state from our global store
  const { userInfo, loading, error } = useSelector((state) => state.auth);
  // --- END REDUX HOOKS ---

  // 5. This 'useEffect' will run if 'userInfo' changes
  // If we log in successfully, userInfo will have data, and we'll redirect
  useEffect(() => {
    if (userInfo) {
      navigate('/'); // Redirect to homepage
    }
  }, [userInfo, navigate]);

  // 6. Update the submit handler to be 'async'
  const submitHandler = async (e) => {
    e.preventDefault();

    // --- DISPATCH ACTIONS ---
    dispatch(setLoading()); // Tell Redux "we are now loading"

    try {
      // 7. Make the API call with axios
      const res = await axios.post(
        'http://localhost:5001/api/auth/register', // <-- Your backend URL
        { username, email, password }
      );
       console.log({res});
       

      // 8. ON SUCCESS: Dispatch 'setCredentials' with the user data
      // 'res.data' is the payload: { _id, username, email, token, ... }
      dispatch(setCredentials(res.data));
      navigate('/'); // Redirect to homepage

    } catch (err) {
      // 9. ON FAILURE: Dispatch 'setError' with the error message
      // This 'err.response.data.message' is the
      // "User already exists" message from your backend!
      dispatch(setError(err.response?.data?.message || err.message));
    }
    // --- END DISPATCH ---
  };

  return (
    <div>
      <h1>Register</h1>

      {/* 10. Show loading or error messages from Redux state */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={submitHandler}>
        {/* ... (Your form inputs are the same) ... */}
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;