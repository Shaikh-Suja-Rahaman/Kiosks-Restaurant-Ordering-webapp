import React from 'react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3] text-[#2B1B1F]">
      <div className="max-w-4xl mx-auto px-6 py-14 space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8B4049] font-semibold">Policy</p>
          <h1 className="text-4xl font-serif font-bold text-[#8B4049]">Shipping & Delivery</h1>
          <p className="text-gray-700">Effective Date: 11 Dec 2025</p>
        </header>

        <section className="space-y-4 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-[#8B4049]/10">
          <p>
            We deliver orders to the address provided at checkout. Delivery times depend on location, kitchen load, and
            courier availability.
          </p>
          <h2 className="text-xl font-semibold text-[#8B4049]">Delivery Areas</h2>
          <p>
            We currently serve select areas listed during checkout. Orders outside our coverage may be cancelled with a
            full refund.
          </p>
          <h2 className="text-xl font-semibold text-[#8B4049]">Delays</h2>
          <p>
            Weather, traffic, or unexpected events may cause delays. We will notify you when possible and work to
            deliver your order promptly.
          </p>
          <h2 className="text-xl font-semibold text-[#8B4049]">Wrong Address</h2>
          <p>
            Please ensure your address and contact number are correct. Incorrect details may lead to failed delivery and
            potential cancellation.
          </p>
        </section>

        <footer className="text-sm text-gray-600">
          For delivery questions, email delivery@kiosks-restaurant.com.
        </footer>
      </div>
    </div>
  );
}
