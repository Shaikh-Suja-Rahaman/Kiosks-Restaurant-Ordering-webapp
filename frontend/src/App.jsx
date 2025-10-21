import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'

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
          {/* <Route path="/menu" element={<MenuPage />} /> */}
      </Routes>

      </main>
    </BrowserRouter>
  )
}

export default App
