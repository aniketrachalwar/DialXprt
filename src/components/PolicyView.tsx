import React, { useState } from 'react';
import { ArrowLeft, Shield, FileText, Lock, Building2 } from 'lucide-react';

interface PolicyViewProps {
  onBack: () => void;
}

type TabType = 'terms' | 'privacy' | 'vendor';

export const PolicyView: React.FC<PolicyViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('terms');

  return (
    <div className="bg-[#F4F7FA] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
        <div className="flex flex-col max-w-lg mx-auto">
          <div className="flex items-center px-4 py-4 gap-3">
            <button 
              onClick={onBack}
              className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              Policies & Privacy
            </h1>
          </div>
          
          {/* Tabs */}
          <div className="flex px-2 overflow-x-auto no-scrollbar border-t border-gray-50">
            <button 
              onClick={() => setActiveTab('terms')}
              className={`flex-1 min-w-[110px] py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'terms' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <FileText className="w-4 h-4" />
              Terms
            </button>
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 min-w-[110px] py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'privacy' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Lock className="w-4 h-4" />
              Privacy
            </button>
            <button 
              onClick={() => setActiveTab('vendor')}
              className={`flex-1 min-w-[110px] py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'vendor' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Building2 className="w-4 h-4" />
              Vendors
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-lg mx-auto p-4 mt-2">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          
          {/* TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-fade-in text-gray-700 text-sm leading-relaxed">
              <div className="mb-8 border-b pb-4">
                <h2 className="text-2xl font-black text-gray-900">Terms of Service</h2>
                <p className="text-gray-500 mt-1">Last Updated: August 2026</p>
              </div>

              <section>
                <h3 className="text-base font-bold text-gray-900 mb-2">1. Acceptance of Terms</h3>
                <p>By accessing or using the DialXprt platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
              </section>

              <section>
                <h3 className="text-base font-bold text-gray-900 mb-2">2. Role of DialXprt</h3>
                <p>DialXprt operates strictly as a local search directory connecting users with independent local service professionals and businesses in Hyderabad. <strong>DialXprt is not a service provider</strong> itself.</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>We do not employ the vendors listed on the platform.</li>
                  <li>We do not guarantee the quality, safety, or legality of the services provided.</li>
                  <li>All transactions and agreements are strictly between the user and the vendor.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-bold text-gray-900 mb-2">3. User Conduct</h3>
                <p>Users agree to use the platform for lawful purposes only. Spamming vendors, submitting false reviews, or attempting to manipulate the ranking system is strictly prohibited and will result in an immediate ban.</p>
              </section>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fade-in text-gray-700 text-sm leading-relaxed">
              <div className="mb-8 border-b pb-4">
                <h2 className="text-2xl font-black text-gray-900">Privacy Policy</h2>
                <p className="text-gray-500 mt-1">Last Updated: August 2026</p>
              </div>

              <section>
                <h3 className="text-base font-bold text-gray-900 mb-2">1. Information We Collect</h3>
                <p>To provide you with the best local search experience, we collect the following data:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Location Data:</strong> With your permission, we use your device's GPS to show experts near you.</li>
                  <li><strong>Contact Information:</strong> Phone numbers and basic profile details when you register or save a business.</li>
                  <li><strong>Usage Data:</strong> Interaction metrics such as which categories are most searched.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-bold text-gray-900 mb-2">2. How We Use Your Data</h3>
                <p>Your data is used exclusively to improve your experience on DialXprt. We use your phone number for authentication via Supabase and your location to sort vendors by proximity.</p>
              </section>

              <section>
                <h3 className="text-base font-bold text-gray-900 mb-2">3. Data Sharing</h3>
                <p>We <strong>do not sell</strong> your personal information to third parties. When you click "WhatsApp" or "Call", your phone number is exposed to the specific vendor you are contacting, as per standard telecommunication.</p>
              </section>
            </div>
          )}

          {/* VENDOR AGREEMENT */}
          {activeTab === 'vendor' && (
            <div className="space-y-6 animate-fade-in text-gray-700 text-sm leading-relaxed">
              <div className="mb-8 border-b pb-4">
                <h2 className="text-2xl font-black text-gray-900">Vendor Agreement</h2>
                <p className="text-gray-500 mt-1">Last Updated: August 2026</p>
              </div>

              <section>
                <h3 className="text-base font-bold text-gray-900 mb-2">1. Listing Eligibility</h3>
                <p>To list a business on DialXprt, you must be the authorized owner or manager of a legitimate business operating within Hyderabad. All submissions are subject to physical or digital verification by our volunteer network.</p>
              </section>

              <section>
                <h3 className="text-base font-bold text-gray-900 mb-2">2. Accuracy of Information</h3>
                <p>Vendors are responsible for maintaining accurate, up-to-date information on their profile, including operating hours, location, and contact numbers. Misleading information may result in permanent suspension.</p>
              </section>

              <section>
                <h3 className="text-base font-bold text-gray-900 mb-2">3. Zero Commission Policy</h3>
                <p>DialXprt currently operates on a zero-commission model for standard listings. We do not take a cut of the payments you receive from customers. Any future premium or sponsored listing features will be strictly opt-in.</p>
              </section>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};
