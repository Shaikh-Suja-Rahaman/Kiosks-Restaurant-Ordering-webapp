import React from 'react';

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3] text-[#2B1B1F]">
      <div className="max-w-4xl mx-auto px-6 py-14 space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8B4049] font-semibold">Policy</p>
          <h1 className="text-4xl font-serif font-bold text-[#8B4049]">Cancellation & Refunds</h1>
          <p className="text-gray-700">Effective Date: 11 Dec 2025</p>
        </header>

        <section className="space-y-4 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-[#8B4049]/10">
          <p>
            We aim to provide a great ordering experience. Please review our cancellation and refund terms below.
          </p>
          <h2 className="text-xl font-semibold text-[#8B4049]">Cancellations</h2>
          <p>
            Orders can be cancelled before preparation begins. Once preparation starts, cancellation may not be
            possible. To request a cancellation, contact support immediately with your order ID.
          </p>
          <h2 className="text-xl font-semibold text-[#8B4049]">Refunds</h2>
          <p>
            Approved refunds are processed to the original payment method within 5-7 business days. If you do not receive
            the refund within this time, please contact your bank and then reach out to us.
          </p>
          <h2 className="text-xl font-semibold text-[#8B4049]">Quality Issues</h2>
          <p>
            If there is an issue with your order (wrong items, missing items, or quality concerns), notify us within 24
            hours with photos where possible. We will investigate and offer a replacement or refund where appropriate.
          </p>
        </section>

        <footer className="text-sm text-gray-600">
          For cancellations or refunds, email refunds@kiosks-restaurant.com.
        </footer>
      </div>
    </div>
  );
}
