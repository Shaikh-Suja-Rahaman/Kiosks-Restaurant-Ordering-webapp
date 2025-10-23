import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- Import Your Existing Pages ---
// Added .jsx extensions to fix resolution errors
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
// We no longer import MenuPage, CartPage etc. here

// --- Import Your Admin Pages ---
import AdminRoute from './components/AdminRoute.jsx';
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
          {/* --- Customer Tabbed App --- */}
          {/* All customer tabs live inside MainLayout now */}
          <Route path="/" element={<MainLayout />} />

          {/* --- Auth Routes --- */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* --- Admin Routes (Untouched) --- */}
          <Route path="" element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/menumanager" element={<AdminMenuManager />} />
            <Route path="/admin/ordermanager" element={<AdminOrderManager />} />
            <Route path="/admin/menu/:id/edit" element={<AdminMenuEditPage />} />
            <Route path="/admin/menu/create" element={<AdminMenuCreatePage />} />
          </Route>

          {/* NOTE: We've removed /menu, /cart, /myorders, /favorites
            because they are now handled by MainLayout.
            If you want to keep them (e.g., for bookmarks), you can
            add them back and have MainLayout optionally take a "defaultTab" prop.
            But for your "no navigation" request, this is the cleanest way.
          */}

        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

