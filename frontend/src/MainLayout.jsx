import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from './redux/slices/navigationSlice';

import MenuPage from './pages/MenuPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import CartPage from './pages/CartPage.jsx';
import BottomNavbar from './components/BottomNavbar.jsx';

export default function MainLayout() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.navigation.activeTab);

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
    <div className="min-h-screen bg-gray-50 pb-15">
      <main>
        {renderActivePage()}
      </main>
      <BottomNavbar
        activeTab={activeTab}
        setActiveTab={(tab) => dispatch(setActiveTab(tab))}
      />
    </div>
  );
}
