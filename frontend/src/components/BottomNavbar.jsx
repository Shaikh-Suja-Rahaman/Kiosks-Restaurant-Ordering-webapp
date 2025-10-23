import React from 'react';
import { LayoutGrid, ScrollText, Heart, ShoppingCart } from 'lucide-react';

export default function BottomNavbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'menu', label: 'Menu', icon: LayoutGrid },
    { id: 'orders', label: 'My Orders', icon: ScrollText },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
      {/* max-w-lg and mx-auto are great for mobile-first apps */}
      <div className="flex justify-around items-center h-full max-w-lg mx-auto px-4 py-2">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              // Base styling for the button
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
                w-20 h-16
                ${isActive ? 'text-red-800' : 'text-gray-500 hover:text-gray-800'}
              `}
            >
              <Icon
                className={`w-6 h-6`}
                // Fill the icon if it's active (especially for Heart)
                fill={isActive && (item.id === 'favorites' || item.id === 'cart') ? 'currentColor' : 'none'}
              />
              {/* Show label for active tab */}
              <span className={`
                text-xs font-medium mt-1 transition-all
                ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
              `}>
                {item.label}
              </span>
              {/* Active tab indicator dot */}
              
            </button>
          );
        })}
      </div>
    </nav>
  );
}
