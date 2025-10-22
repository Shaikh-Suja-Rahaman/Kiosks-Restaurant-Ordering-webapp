import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // 1. Get the 'userInfo' from the Redux state
  const { userInfo } = useSelector((state) => state.auth);

  // 2. Check if user is logged in AND is an admin
  //    If yes, render the child route using <Outlet />
  //    If no, redirect them to the /login page
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;