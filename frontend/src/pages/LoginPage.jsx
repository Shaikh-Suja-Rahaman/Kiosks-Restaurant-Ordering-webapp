import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setLoading, setError } from '../redux/slices/authSlice';

const LoginPage = () => {
  // 1. We only need email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  // This useEffect is identical
  useEffect(() => {
    if (userInfo) {
      navigate('/'); // Redirect to homepage
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading());

    try {
      // 2. Make the API call to the login endpoint
      const res = await axios.post(
        'http://localhost:5001/api/auth/login', // <-- CHANGED
        { email, password } // <-- CHANGED (no username)
      );

      dispatch(setCredentials(res.data));
      navigate('/');

    } catch (err) {
      dispatch(setError(err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h1>Login</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={submitHandler}>
        {/* 3. Removed the username input field */}
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
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;


