import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3] text-[#2B1B1F]">
      <div className="max-w-4xl mx-auto px-6 py-14 space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8B4049] font-semibold">Policy</p>
          <h1 className="text-4xl font-serif font-bold text-[#8B4049]">Terms and Conditions</h1>
          <p className="text-gray-700">Effective Date: 11 Dec 2025</p>
        </header>

        <section className="space-y-4 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-[#8B4049]/10">
          <p>
            By using our website or placing an order, you agree to these Terms and Conditions. If you do not
            agree, please do not use the service.
          </p>
          <h2 className="text-xl font-semibold text-[#8B4049]">Use of Service</h2>
          <p>
            You must be at least 18 years old to place orders. You are responsible for the accuracy of delivery details
            and ensuring secure access to your account.
          </p>
          <h2 className="text-xl font-semibold text-[#8B4049]">Orders and Payments</h2>
          <p>
            Prices are displayed in Rs. Orders are confirmed upon successful payment. We reserve the right to refuse or
            cancel orders in cases of suspected fraud or inventory issues.
          </p>
          <h2 className="text-xl font-semibold text-[#8B4049]">Changes to Terms</h2>
          <p>
            We may update these Terms periodically. Continued use of the website after changes means you accept the
            revised Terms.
          </p>
        </section>

        <footer className="text-sm text-gray-600">
          For questions about these Terms, email us at support@kiosks-restaurant.com.
        </footer>
      </div>
    </div>
  );
}
