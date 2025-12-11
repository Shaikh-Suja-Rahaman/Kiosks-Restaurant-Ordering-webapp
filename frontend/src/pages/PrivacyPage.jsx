import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3] text-[#2B1B1F]">
      <div className="max-w-4xl mx-auto px-6 py-14 space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8B4049] font-semibold">Policy</p>
          <h1 className="text-4xl font-serif font-bold text-[#8B4049]">Privacy Policy</h1>
          <p className="text-gray-700">Effective Date: 11 Dec 2025</p>
        </header>

        <section className="space-y-4 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-[#8B4049]/10">
          <p>
            We value your privacy. This policy explains how we collect, use, and protect your personal data when you use
            our website or place orders.
          </p>
          <h2 className="text-xl font-semibold text-[#8B4049]">Data We Collect</h2>
          <p>
            We collect contact details, delivery addresses, and order information. Payment details are processed by our
            payment partners and are not stored on our servers.
          </p>
          <h2 className="text-xl font-semibold text-[#8B4049]">How We Use Data</h2>
          <p>
            We use your data to process orders, provide support, and improve our services. We do not sell your personal
            data to third parties.
          </p>
          <h2 className="text-xl font-semibold text-[#8B4049]">Your Choices</h2>
          <p>
            You can request corrections or deletion of your data by contacting support@kiosks-restaurant.com. Some data
            may be retained as required by law or for fraud prevention.
          </p>
        </section>

        <footer className="text-sm text-gray-600">
          For privacy questions, email us at privacy@kiosks-restaurant.com.
        </footer>
      </div>
    </div>
  );
}
