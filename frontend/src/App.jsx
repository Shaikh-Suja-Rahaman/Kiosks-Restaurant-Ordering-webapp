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

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenuManager from './pages/admin/AdminMenuManager';
import AdminOrderManager from './pages/admin/AdminOrderManager'
import AdminMenuEditPage from './pages/admin/AdminMenuEditPage'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      {/* nav bar goes here */}
      <main>

      <Routes>
       {/* <Route path="/" element={<HomePage />} />  will add these later*/}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/myorders" element={<OrderHistoryPage />} />


          <Route path="" element={<AdminRoute />}>


                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/menumanager" element={<AdminMenuManager />} />
                <Route path="/admin/ordermanager" element={<AdminOrderManager />} />
                <Route path="/admin/menu/:id/edit" element={<AdminMenuEditPage />} />
          </Route>

      </Routes>

      </main>
    </BrowserRouter>
  )
}

export default App
