import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // 1. Get user info to display their name
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Welcome, {userInfo.username}!</h2>

      <p>From here you can manage your kiosk:</p>

      {/* 2. Add links to the other admin pages */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <Link to="/admin/menumanager" style={linkStyle}>
          Manage Menu
        </Link>
        <Link to="/admin/ordermanager" style={linkStyle}>
          Manage Orders
        </Link>
      </div>
    </div>
  );
};

// Just some basic styling for the links
const linkStyle = {
  display: 'inline-block',
  padding: '10px 15px',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ccc',
  borderRadius: '5px',
  textDecoration: 'none',
  color: 'black',
  fontWeight: 'bold',
};

export default AdminDashboard;