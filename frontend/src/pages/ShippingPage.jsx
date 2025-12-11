import React from 'react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3] text-[#2B1B1F]">
      <div className="max-w-4xl mx-auto px-6 py-14 space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8B4049] font-semibold">Policy</p>
          <h1 className="text-4xl font-serif font-bold text-[#8B4049]">Shipping & Delivery Policy</h1>
          <p className="text-gray-700">Effective Date: 11 Dec 2025</p>
        </header>

        <section className="space-y-4 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-[#8B4049]/10">
          <p>
            This service is a kiosk / in-restaurant ordering system. We do not provide any shipping or home delivery of
            products.
          </p>
          <p>
            All orders placed through this application must be picked up directly at the restaurant counter. No physical
            goods are shipped to customers.
          </p>
          <p>
            Since this is not an e-commerce shipping service, traditional shipping timelines, courier delivery, and
            logistics are not applicable.
          </p>
          <p>
            Order fulfillment happens instantly at the restaurant premises once the order is accepted.
          </p>
          <p>
            If you have any questions about order pickup or service delivery, please contact us using the details on our
            Contact Us page.
          </p>
        </section>
      </div>
    </div>
  );
}
