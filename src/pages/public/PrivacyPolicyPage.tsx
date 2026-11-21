import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 bg-ivory min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-luxury uppercase text-forest/70 hover:text-forest transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-2xl p-8 sm:p-14 border border-sand-dark/30 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-luxury uppercase text-bronze mb-2">
              <Shield className="w-4 h-4" />
              <span>LEGAL NOTICE & PRIVACY</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-forest-deep">
              Privacy Policy & Platform Disclaimer
            </h1>
            <p className="text-xs text-charcoal/50 mt-2">
              Last updated: November 2026
            </p>
          </div>

          <div className="prose prose-sm text-charcoal/80 space-y-6 text-sm font-light leading-relaxed">
            <div className="p-4 rounded-lg bg-sand/30 border border-sand-dark/30 text-xs">
              <strong className="text-charcoal block mb-1">Demonstration Notice:</strong>
              Havenora is a conceptual demonstration boutique retreat website and proprietary hotel management platform developed by Anuj Digital. It does not represent an active commercial enterprise accepting live financial transactions or room bookings.
            </div>

            <h3 className="font-serif text-xl text-forest-deep font-normal pt-4">
              1. Information Collection
            </h3>
            <p>
              When visitors submit booking enquiries through this website, we collect contact details (full name, email address, phone number, requested dates, and notes) solely to demonstrate the operations of the owner management portal.
            </p>

            <h3 className="font-serif text-xl text-forest-deep font-normal pt-4">
              2. Data Storage & Local Persistence
            </h3>
            <p>
              By default in demonstration mode, all enquiry submissions and owner modifications are stored in the user’s local browser storage (LocalStorage). No sensitive financial data, credit cards, or payment credentials are collected or requested.
            </p>

            <h3 className="font-serif text-xl text-forest-deep font-normal pt-4">
              3. Security & Owner Portal
            </h3>
            <p>
              The owner management portal is restricted to authorized administrative users. Public website visitors do not have access to private guest enquiry records, phone numbers, or internal operational notes.
            </p>

            <h3 className="font-serif text-xl text-forest-deep font-normal pt-4">
              4. Contact
            </h3>
            <p>
              For questions regarding this demonstration platform or digital agency services, please contact info@anujdigital.com.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
