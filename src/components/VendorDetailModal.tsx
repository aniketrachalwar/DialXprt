import React, { useEffect, useState } from 'react';
import { X, Phone, MapPin, CheckCircle2, Star, Navigation2, Share2, ShieldCheck, Clock, Building2, User, ChevronDown, MessageCircle, Heart, CreditCard } from 'lucide-react';
import { Vendor } from '../types';
import { WhatsAppLogo } from './WhatsAppLogo';
import { AppLanguage, getTranslation, getCategoryName } from '../lib/translations';

interface VendorDetailModalProps {
  vendor: Vendor | null;
  onClose: () => void;
  onTrackCall: (vendorId: string) => void;
  onTrackWhatsApp: (vendorId: string) => void;
  currentLang?: AppLanguage;
}

export const VendorDetailModal: React.FC<VendorDetailModalProps> = ({
  vendor,
  onClose,
  onTrackCall,
  onTrackWhatsApp,
  currentLang = 'en',
}) => {
  const t = (key: string) => getTranslation(currentLang, key);
  const [hoursExpanded, setHoursExpanded] = useState(false);

  useEffect(() => {
    if (vendor) {
      document.title = `${vendor.name} - ${vendor.category} in ${vendor.neighborhood}, Hyderabad | DialXprt`;
    } else {
      document.title = 'DialXprt - Search Local Service Expert in Hyderabad';
    }
  }, [vendor]);

  if (!vendor) return null;

  const isApproved = vendor.status === 'approved';
  const callUrl = `tel:+91${vendor.phone}`;
  const waMessage = encodeURIComponent(
    `Hi ${vendor.ownerName}, I found your business '${vendor.name}' on DialXprt. I need your ${vendor.category} service in ${vendor.neighborhood}.`
  );
  const whatsappUrl = `https://wa.me/${vendor.whatsapp}?text=${waMessage}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${vendor.lat},${vendor.lng}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vendor.name} - ${vendor.category} in ${vendor.neighborhood}`,
        text: `Contact ${vendor.name} (${vendor.category}) in ${vendor.neighborhood}, Hyderabad: Call ${vendor.phone}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Check out ${vendor.name} on DialXprt: Call ${vendor.phone}`);
      alert('Vendor details link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-t-[28px] sm:rounded-2xl shadow-2xl overflow-hidden h-[95vh] sm:max-h-[90vh] flex flex-col animate-slide-up sm:animate-fade-in pb-safe sm:pb-0 relative">
        
        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 pb-32">
          {/* Hero Section */}
          <div className="relative h-64 sm:h-72 w-full bg-gray-900 shrink-0">
            <img
              src={vendor.imageUrl}
              alt={`${vendor.name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>

            {/* Top Bar Icons */}
            <div className="absolute top-4 right-4 flex items-center gap-3">
              <button onClick={handleShare} className="bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md transition-colors ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Left Content */}
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                {isApproved && (
                  <span className="bg-[#22C55E] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm uppercase tracking-wide">
                    <CheckCircle2 className="w-3 h-3 text-white" /> Verified
                  </span>
                )}
                {vendor.isSponsored && (
                  <span className="bg-[#FFA500] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">
                    Promoted
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black leading-tight mb-2 text-white drop-shadow-md">
                {vendor.name}
              </h1>
              
              <div className="flex items-center gap-3 text-sm font-semibold">
                <div className="flex items-center gap-1 text-[#FFA500]">
                  <Star className="w-4 h-4 fill-[#FFA500]" />
                  <span>{vendor.rating || '4.5'}</span>
                  <span className="text-gray-300 font-medium ml-1">({vendor.reviewsCount || 0} reviews)</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-200">{vendor.neighborhood}</span>
              </div>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="p-5 space-y-5 bg-white">
            
            {/* Operating Hours Accordion */}
            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setHoursExpanded(!hoursExpanded)}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm">Open Now: <span className="text-green-600">10:00 AM – 8:00 PM</span></p>
                    <p className="text-xs text-gray-500">Closes in 2 hours</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${hoursExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              {hoursExpanded && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-sm space-y-2">
                  <div className="flex justify-between font-bold text-gray-900"><p>Monday - Friday</p><p>10:00 AM - 8:00 PM</p></div>
                  <div className="flex justify-between text-gray-600"><p>Saturday</p><p>10:00 AM - 6:00 PM</p></div>
                  <div className="flex justify-between text-red-500 font-medium"><p>Sunday</p><p>Closed</p></div>
                </div>
              )}
            </div>

            {/* Address & Map */}
            <div className="border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 shrink-0 flex items-center justify-center mt-1">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{vendor.address}</p>
                  <p className="text-xs text-gray-500">{vendor.neighborhood}, Hyderabad, {vendor.pincode}</p>
                </div>
              </div>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-50 text-blue-700 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm mt-1 hover:bg-blue-100 transition-colors">
                <Navigation2 className="w-4 h-4" /> View on Google Maps
              </a>
            </div>

            {/* Payment Methods */}
            <div className="border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Payment Methods</p>
                <p className="text-xs text-gray-500">Cash, UPI (GPay, PhonePe), Credit Card</p>
              </div>
            </div>

            {/* About / Description */}
            {vendor.description && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg mb-2">About Us</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {vendor.description}
                </p>
              </div>
            )}
          </div>

          {/* Review & Rating Section */}
          <div className="p-5 border-t-8 border-gray-50 bg-white">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Reviews & Ratings</h3>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              {/* Overall Summary */}
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl sm:w-1/3">
                <span className="text-4xl font-black text-gray-900 mb-1">{vendor.rating || '4.5'}</span>
                <div className="flex items-center gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-[#FFA500] text-[#FFA500]" />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-medium">Based on {vendor.reviewsCount || 0} reviews</span>
              </div>

              {/* Star Breakdown (Mock) */}
              <div className="flex-1 flex flex-col justify-center gap-1.5 text-xs text-gray-500 font-medium">
                {[
                  { stars: 5, pct: '75%' },
                  { stars: 4, pct: '15%' },
                  { stars: 3, pct: '5%' },
                  { stars: 2, pct: '3%' },
                  { stars: 1, pct: '2%' }
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-2">
                    <span className="w-4">{row.stars}★</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FFA500] rounded-full" style={{ width: row.pct }}></div>
                    </div>
                    <span className="w-8 text-right">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
              Write a Review
            </button>
          </div>
        </div>

        {/* Lead Capture Floating Bar (Mobile & Desktop) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] grid grid-cols-[1fr_1fr] sm:grid-cols-[2fr_1fr_1fr] gap-3 z-20">
          <a
            href={callUrl}
            onClick={() => onTrackCall(vendor.id)}
            className="col-span-1 sm:col-span-1 flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-green-600 text-white font-black py-3.5 px-3 rounded-xl shadow-md active:scale-95 transition-all text-sm min-h-[52px]"
          >
            <Phone className="w-5 h-5 fill-white" />
            <span>Call Now</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onTrackWhatsApp(vendor.id)}
            className="col-span-1 sm:col-span-1 flex items-center justify-center gap-2 border-2 border-[#22C55E] text-[#22C55E] hover:bg-green-50 font-black py-3.5 px-3 rounded-xl active:scale-95 transition-all text-sm min-h-[52px]"
          >
            <WhatsAppLogo size="sm" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden">Chat</span>
          </a>

          <button
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-black py-3.5 px-3 rounded-xl active:scale-95 transition-all text-sm min-h-[52px]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Get Quotes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

