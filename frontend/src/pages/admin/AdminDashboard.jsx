// ============================================
// ADMIN DASHBOARD - Main Page
// ============================================
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, TrendingUp, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dashboardCards = [
    {
      title: 'Manage Menu',
      description: 'Add, edit, and delete menu items',
      icon: UtensilsCrossed,
      link: '/admin/menumanager',
      color: 'from-[#8B4049] to-[#6B3039]',
    },
    {
      title: 'Manage Orders',
      description: 'View and update order statuses',
      icon: ShoppingBag,
      link: '/admin/ordermanager',
      color: 'from-[#6B3039] to-[#8B4049]',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3]">
      {/* Header */}
      <div className="bg-[#8B4049] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#FFF8F0] rounded-full flex items-center justify-center">
              <LayoutDashboard className="w-8 h-8 text-[#8B4049]" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-[#FFF8F0]">
                Admin Dashboard
              </h1>
              <p className="text-[#FFF8F0] text-lg opacity-90">
                Welcome back, {userInfo.username}!
              </p>
            </div>
          </div>
          <p className="text-[#FFF8F0] opacity-80">
            Manage your restaurant operations from here
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={index}
                to={card.link}
                className="block group"
              >
                <div className="bg-[#FFF8F0] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-[#8B4049]/10 transform hover:-translate-y-2">
                  <div className={`bg-gradient-to-br ${card.color} p-6`}>
                    <Icon className="w-12 h-12 text-[#FFF8F0] mb-3" />
                    <h2 className="text-2xl font-serif font-bold text-[#FFF8F0] mb-2">
                      {card.title}
                    </h2>
                    <p className="text-[#FFF8F0] opacity-90 text-sm">
                      {card.description}
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-[#8B4049] font-semibold group-hover:translate-x-2 transition-transform">
                      <span>Manage Now</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats Section (Optional) */}
        <div className="mt-12 bg-[#FFF8F0] rounded-xl shadow-lg p-8 border-2 border-[#8B4049]/10">
          <h3 className="text-2xl font-serif font-bold text-[#8B4049] mb-6">
            Quick Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-[#8B4049]/5 to-[#8B4049]/10 rounded-lg">
              <TrendingUp className="w-8 h-8 text-[#8B4049] mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-[#8B4049]">Coming Soon</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-[#8B4049]/5 to-[#8B4049]/10 rounded-lg">
              <ShoppingBag className="w-8 h-8 text-[#8B4049] mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-1">Active Orders</p>
              <p className="text-3xl font-bold text-[#8B4049]">Coming Soon</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-[#8B4049]/5 to-[#8B4049]/10 rounded-lg">
              <Users className="w-8 h-8 text-[#8B4049] mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-[#8B4049]">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

