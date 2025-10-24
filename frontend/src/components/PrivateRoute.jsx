import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Get the 'userInfo' from the Redux state
  const { userInfo } = useSelector((state) => state.auth);

  // Check if user is logged in
  // If yes, render the child route using <Outlet />
  // If no, redirect them to the /login page
  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;