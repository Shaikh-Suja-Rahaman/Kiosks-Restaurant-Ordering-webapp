import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import AdminRoute from './components/AdminRoute';
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenuManager from './pages/admin/AdminMenuManager';
import AdminOrderManager from './pages/admin/AdminOrderManager'
import AdminMenuEditPage from './pages/admin/AdminMenuEditPage'
import AdminMenuCreatePage from './pages/admin/AdminMenuCreatePage'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      {/* nav bar goes here */}
      <main>

      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/myorders" element={<OrderHistoryPage />} />


          <Route path="" element={<AdminRoute />}>


                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/menumanager" element={<AdminMenuManager />} />
                <Route path="/admin/ordermanager" element={<AdminOrderManager />} />
                <Route path="/admin/menu/:id/edit" element={<AdminMenuEditPage />} />
                <Route path="/admin/menu/create" element={<AdminMenuCreatePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
          </Route>

      </Routes>

      </main>
    </BrowserRouter>
  )
}

export default App
