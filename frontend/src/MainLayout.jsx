import React, { useState } from 'react';

// Import your page components
// (We will style these next)
import MenuPage from './pages/MenuPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import CartPage from './pages/CartPage.jsx';

// Import the new Navbar
import BottomNavbar from './components/BottomNavbar.jsx';

/**
 * This component replaces your old App.js logic.
 * It holds the tab state and renders the correct "page"
 * without changing the URL.
 */
export default function MainLayout() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' is the default

  // This function renders the correct page component
  // based on the active tab state.
  const renderActivePage = () => {
    switch (activeTab) {
      case 'menu':
        return <MenuPage />;
      case 'orders':
        return <OrderHistoryPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'cart':
        return <CartPage />;
      default:
        return <MenuPage />;
    }
  };

  return (
    // The bg-gray-50 provides the "cream" background
    <div className="min-h-screen bg-gray-50 pb-15">

      {/* Main content area */}
      <main>
        {renderActivePage()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
