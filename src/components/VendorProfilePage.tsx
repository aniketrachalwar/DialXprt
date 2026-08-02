import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, CheckCircle2, Star, Share2, ShieldCheck, Clock, Building2, User, Navigation } from 'lucide-react';
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
        <button onClick={() => navigate('/')} className="bg-cyan-500 text-white px-6 py-2.5 rounded-xl font-bold">Go Back Home</button>
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
        description={`Contact ${vendor.ownerName} at ${vendor.name} for ${vendor.keywords || vendor.category} services in ${vendor.neighborhood}, Hyderabad. Call ${vendor.phone}. ${(vendor.description || '').substring(0, 50)}...`}
        vendors={[vendor]}
      />

      <div className="max-w-4xl mx-auto bg-white min-h-screen sm:min-h-0 sm:mt-6 sm:rounded-3xl shadow-sm overflow-hidden animate-fade-in">
        {/* Header / Hero */}
        <div className="relative h-64 sm:h-80 w-full bg-gray-900 shrink-0">
          <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {(vendor.images && vendor.images.length > 0 ? vendor.images : [vendor.imageUrl]).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${vendor.name} - Photo ${idx + 1}`}
                className="w-full h-full object-cover snap-center shrink-0"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button onClick={() => navigate(-1)} className="bg-white/80 hover:bg-white text-gray-900 p-2.5 rounded-full backdrop-blur-md transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button onClick={handleShare} className="bg-white/80 hover:bg-white text-gray-900 p-2.5 rounded-full backdrop-blur-md transition-colors shadow-sm">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Header Info Below Image */}
        <div className="px-5 pt-4 pb-2 space-y-2.5 bg-white">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2 leading-tight">
            {isApproved && <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />}
            {vendor.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            {vendor.reviewsCount === 0 || vendor.rating === 0 ? (
              <div className="flex items-center gap-1 bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 rounded text-xs font-bold shadow-sm uppercase tracking-wider border border-[#22C55E]/20">
                NEW
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 bg-[#22C55E] text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                  {vendor.rating} <Star className="w-3 h-3 fill-white text-white" />
                </div>
                <span>{vendor.reviewsCount} Ratings</span>
              </>
            )}
          </div>

          <div className="text-xs text-gray-700 flex items-start gap-1">
            <MapPin className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" />
            <span>{vendor.neighborhood}{vendor.neighborhood && vendor.address ? ', ' : ''}{vendor.address}</span>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            {vendor.category} • 10 Years in Business
          </div>

          <div className="text-xs">
            {vendor.operatingHours ? (
              (vendor.operatingHours || "").toLowerCase().includes('24/7') ? (
                <span className="text-[#22C55E] font-bold">Open Now: {vendor.operatingHours}</span>
              ) : (
                <span className="text-gray-700 font-medium">Hours: {vendor.operatingHours}</span>
              )
            ) : null}
          </div>
        </div>

        {/* Content Body */}
        <div className="px-5 pb-6 sm:px-8 space-y-8 mt-2">
          
          {/* Quick Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start w-full px-2">
              <a
                href={callUrl}
                onClick={() => onTrackCall(vendor.id)}
                className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <Phone className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[10px] font-bold text-gray-800">Call Now</span>
              </a>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onTrackWhatsApp(vendor.id)}
                className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <WhatsAppLogo className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-gray-800">WhatsApp</span>
              </a>
              
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.address + ' ' + (vendor.neighborhood || ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center shadow-sm">
                  <Navigation className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-800">Direction</span>
              </a>
              
              <button 
                onClick={handleShare}
                className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center shadow-sm">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-800">Share</span>
              </button>
            </div>
            
            <button 
              onClick={() => { window.location.href = callUrl; }} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-sm transition-colors text-xs"
            >
              Enquire Now
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-500" /> About Business
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed whitespace-pre-wrap">
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
                    <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-500 text-sm font-bold mt-2 inline-block hover:underline">Get Directions</a>
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


