import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3] text-[#2B1B1F]">
      <div className="max-w-4xl mx-auto px-6 py-14 space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8B4049] font-semibold">Support</p>
          <h1 className="text-4xl font-serif font-bold text-[#8B4049]">Contact Us</h1>
          <p className="text-gray-700">We are here to help</p>
        </header>

        <section className="space-y-4 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-[#8B4049]/10">
          <p className="text-gray-700">
            For any questions about orders, payments, or policies, reach out using the details below.
          </p>
          <div className="space-y-3">
            <p><span className="font-semibold text-[#8B4049]">Email:</span> support@kiosks-restaurant.com</p>
            <p><span className="font-semibold text-[#8B4049]">Phone:</span> +91-90000-00000 (10 AM - 8 PM IST)</p>
            <p><span className="font-semibold text-[#8B4049]">Address:</span> 123 Food Street, Bengaluru, India</p>
          </div>
          <p className="text-gray-600 text-sm">
            We typically respond within one business day. For urgent issues with live orders, call the support number
            above.
          </p>
        </section>
      </div>
    </div>
  );
}
