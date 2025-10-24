import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Import Your Existing Pages ---
// Added .jsx extensions to fix resolution errors
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
// We no longer import MenuPage, CartPage etc. here

// --- Import Your Admin Pages ---
import AdminRoute from './components/AdminRoute.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminMenuManager from './pages/admin/AdminMenuManager.jsx';
import AdminOrderManager from './pages/admin/AdminOrderManager.jsx';
import AdminMenuEditPage from './pages/admin/AdminMenuEditPage.jsx';
import AdminMenuCreatePage from './pages/admin/AdminMenuCreatePage.jsx';

// --- Import Your NEW Main Layout ---
import MainLayout from './MainLayout.jsx';

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          {/* --- Auth Routes (Public) --- */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* --- Protected Customer Routes --- */}
          <Route path="" element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout />} />
          </Route>

          {/* --- Admin Routes (Untouched) --- */}
          <Route path="" element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/menumanager" element={<AdminMenuManager />} />
            <Route path="/admin/ordermanager" element={<AdminOrderManager />} />
            <Route path="/admin/menu/:id/edit" element={<AdminMenuEditPage />} />
            <Route path="/admin/menu/create" element={<AdminMenuCreatePage />} />
          </Route>

          {/* Catch-all route - redirect to login for any undefined routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
