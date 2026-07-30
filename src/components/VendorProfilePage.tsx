import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, CheckCircle2, Star, Share2, ShieldCheck, Clock, Building2, User } from 'lucide-react';
import { Vendor } from '../types';
import { WhatsAppLogo } from './WhatsAppLogo';
import { AppLanguage, getTranslation } from '../lib/translations';
import { SEOHead } from './SEOHead';

interface VendorProfilePageProps {
  vendor: Vendor | null;
  onTrackCall: (vendorId: string) => void;
  onTrackWhatsApp: (vendorId: string) => void;
  currentLang?: AppLanguage;
}

export const VendorProfilePage: React.FC<VendorProfilePageProps> = ({
  vendor,
  onTrackCall,
  onTrackWhatsApp,
  currentLang = 'en',
}) => {
  const t = (key: string) => getTranslation(currentLang, key);
  const navigate = useNavigate();

  if (!vendor) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Expert Not Found</h1>
        <p className="text-gray-500 mb-6">The business you are looking for may have been removed or the link is invalid.</p>
        <button onClick={() => navigate('/')} className="bg-[#1A9E9E] text-white px-6 py-2.5 rounded-xl font-bold">Go Back Home</button>
      </div>
    </div>
  );

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
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-[#F4F7FA] min-h-screen pb-24">
      <SEOHead
        title={`${vendor.name} - ${vendor.category} in ${vendor.neighborhood}, Hyderabad | DialXprt`}
        description={`Contact ${vendor.ownerName} at ${vendor.name} for ${vendor.keywords || vendor.category} services in ${vendor.neighborhood}, Hyderabad. Call ${vendor.phone}. ${vendor.description.substring(0, 50)}...`}
        vendors={[vendor]}
      />

      <div className="max-w-4xl mx-auto bg-white min-h-screen sm:min-h-0 sm:mt-6 sm:rounded-3xl shadow-sm overflow-hidden animate-fade-in">
        {/* Header / Hero */}
        <div className="relative h-64 sm:h-80 w-full bg-gray-900 shrink-0">
          <img
            src={vendor.imageUrl}
            alt={`${vendor.name}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button onClick={handleShare} className="bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              {isApproved && (
                <span className="bg-[#22C55E] text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm uppercase tracking-wide">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Verified
                </span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-2 text-white drop-shadow-md">
              {vendor.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base font-medium text-gray-200">
              <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30 text-white">
                {vendor.category}
              </span>
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-white text-lg">{vendor.rating}</span>
                <span className="opacity-80">({vendor.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Quick Actions */}
          <div className="flex gap-3">
            <a
              href={callUrl}
              onClick={() => onTrackCall(vendor.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl flex flex-col items-center justify-center gap-1 shadow-md shadow-green-600/20 transition-all active:scale-95"
            >
              <Phone className="w-6 h-6 mb-1" />
              <span className="font-bold text-sm">Call Now</span>
            </a>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onTrackWhatsApp(vendor.id)}
              className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl flex flex-col items-center justify-center gap-1 shadow-md shadow-[#25D366]/20 transition-all active:scale-95"
            >
              <WhatsAppLogo className="w-7 h-7 mb-0.5" />
              <span className="font-bold text-sm">WhatsApp</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#1A9E9E]" /> About Business
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {vendor.description}
                </p>
                {vendor.keywords && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {vendor.keywords.split(',').map((kw, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-xs font-medium border border-gray-200">
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{vendor.neighborhood}, Hyderabad</h4>
                    <p className="text-gray-500 text-sm mt-0.5">{vendor.fullAddress || vendor.address}</p>
                    <p className="text-gray-500 text-sm">{vendor.city} - {vendor.pincode}</p>
                    <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-[#1A9E9E] text-sm font-bold mt-2 inline-block hover:underline">Get Directions</a>
                  </div>
                </div>

                <div className="h-px bg-gray-200 w-full my-4"></div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Operating Hours</h4>
                    <p className="text-gray-600 text-sm mt-0.5">{vendor.operatingHours || 'Contact for timings'}</p>
                  </div>
                </div>

                <div className="h-px bg-gray-200 w-full my-4"></div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Contact Person</h4>
                    <p className="text-gray-600 text-sm mt-0.5">{vendor.ownerName}</p>
                  </div>
                </div>
              </div>

              {isApproved && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3 items-start">
                  <ShieldCheck className="w-6 h-6 text-green-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-green-900 text-sm">DialXprt Verified Guarantee</h4>
                    <p className="text-green-800 text-xs mt-1 leading-relaxed">
                      This expert's shop and identity have been physically verified by our ground volunteers. 
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
