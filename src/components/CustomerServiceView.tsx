import React, { useState } from 'react';
import { ArrowLeft, Headphones, PhoneCall, Mail, ChevronDown, CheckCircle2 } from 'lucide-react';
import { WhatsAppLogo } from './WhatsAppLogo';

interface CustomerServiceViewProps {
  onBack: () => void;
}

export const CustomerServiceView: React.FC<CustomerServiceViewProps> = ({ onBack }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const adminPhone = '7878616178';
  const adminEmail = 'dialxprt@gmail.com';
  const waSupportUrl = `https://wa.me/917878616178?text=${encodeURIComponent('Hi DialXprt Support, I need help.')}`;

  const faqs = [
    {
      q: "How do I list my business on DialXprt?",
      a: "Listing your business is completely free! Just tap the 'List Business' button at the top right of the screen or in the bottom navigation menu, fill in your shop details, and submit. Our volunteer team will review it shortly."
    },
    {
      q: "Is DialXprt free to use?",
      a: "Yes! DialXprt is a 100% free platform for both customers looking for services and vendors listing their businesses. We do not charge any commission."
    },
    {
      q: "How do you verify the experts?",
      a: "We have a dedicated network of local volunteers in Hyderabad who physically or digitally verify the businesses before they are approved to appear in search results."
    },
    {
      q: "How can I update my business details?",
      a: "You can update your business details by logging in with your registered phone number, going to the 'Account' tab, and selecting 'Edit My Business Profile'."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    // Construct email content
    const subject = encodeURIComponent(`New Support Ticket from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\n\nMessage:\n${message}`);
    
    // Open email client
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
    
    // Show success state briefly then reset form
    setTimeout(() => {
      setFormState('success');
      setTimeout(() => {
        setFormState('idle');
        setName('');
        setPhone('');
        setMessage('');
      }, 5000);
    }, 800);
  };

  return (
    <div className="bg-[#F4F7FA] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
        <div className="flex items-center px-4 py-4 max-w-lg mx-auto gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-blue-500" />
            Customer Service
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6 mt-2">
        {/* Intro */}
        <div className="text-center space-y-2">
          <p className="text-gray-600 text-sm">
            Our 24/7 support team is here to help resolve any issues you might have.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-3 gap-3">
          <a href={`tel:+91${adminPhone}`} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-cyan-200 transition-colors active:scale-95 text-center">
            <div className="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-500">
              <PhoneCall className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-gray-700">Call Us</span>
          </a>
          
          <a href={waSupportUrl} target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-[#25D366]/30 transition-colors active:scale-95 text-center">
            <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center text-[#25D366]">
              <WhatsAppLogo size="md" />
            </div>
            <span className="text-xs font-bold text-gray-700">WhatsApp</span>
          </a>

          <a href={`mailto:${adminEmail}`} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-indigo-200 transition-colors active:scale-95 text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-gray-700">Email Us</span>
          </a>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800 text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === idx ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Send us a Message</h2>
          
          {formState === 'success' ? (
            <div className="bg-emerald-50 rounded-2xl p-6 text-center space-y-3 border border-emerald-100 animate-fade-in">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-bold text-emerald-900">Message Sent!</h3>
              <p className="text-sm text-emerald-700 leading-relaxed">
                Thank you for reaching out. Our support team will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">How can we help?</label>
                <textarea 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Describe your issue..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={formState === 'submitting'}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md disabled:opacity-70 flex justify-center items-center h-[52px]"
              >
                {formState === 'submitting' ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Submit Ticket'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
