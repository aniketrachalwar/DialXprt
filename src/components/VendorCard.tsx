import React from 'react';
import { Phone, MapPin, CheckCircle2, Star, MessageCircle } from 'lucide-react';
import { Vendor } from '../types';
import { WhatsAppLogo } from './WhatsAppLogo';
import { AppLanguage, getTranslation } from '../lib/translations';

interface VendorCardProps {
  vendor: Vendor;
  onSelectVendor: (vendor: Vendor) => void;
  onGetBestDeal: (vendor: Vendor) => void;
  onTrackCall?: (vendorId: string) => void;
  onTrackWhatsApp?: (vendorId: string) => void;
  currentLang?: AppLanguage;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  onSelectVendor,
  onGetBestDeal,
  onTrackCall,
  onTrackWhatsApp,
  currentLang = 'en',
}) => {
  const t = (key: string) => getTranslation(currentLang, key);
  const isApproved = vendor.status === 'approved';

  // Construct direct call link
  const callUrl = `tel:+91${vendor.phone}`;

  // Construct WhatsApp direct pre-filled message URL
  const waMessage = encodeURIComponent(
    `Hi ${vendor.ownerName}, I found your business '${vendor.name}' on DialXprt. I need your ${vendor.category} service.`
  );
  const whatsappUrl = `https://wa.me/${vendor.whatsapp}?text=${waMessage}`;

  return (
    <article
      id={`vendor-card-${vendor.id}`}
      onClick={() => onSelectVendor(vendor)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-4 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:border-gray-200 transition-all overflow-hidden relative"
    >
      {/* Promoted Badge */}
      {vendor.isSponsored && (
        <div className="absolute top-0 left-0 bg-[#FFA500] text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg z-10 shadow-sm uppercase tracking-wider">
          Promoted
        </div>
      )}

      {/* Top Section: Image + Details */}
      <div className="flex gap-4">
        {/* Left: Image (3:2 ratio style) */}
        <div className="w-28 sm:w-36 h-28 sm:h-32 shrink-0 rounded-xl overflow-hidden relative bg-gray-100 shadow-inner">
          <img
            src={vendor.imageUrl}
            alt={`${vendor.name} - ${vendor.category}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Right: Details */}
        <div className="flex-1 flex flex-col justify-start pt-1">
          {/* Title */}
          <h3 className="font-extrabold text-gray-900 text-[16px] sm:text-[18px] leading-tight mb-1 line-clamp-2">
            {vendor.name}
            {isApproved && (
              <CheckCircle2 className="w-4 h-4 fill-[#22C55E] text-white inline-block ml-1.5 -mt-0.5" />
            )}
          </h3>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-3.5 h-3.5 ${s <= (vendor.rating || 4.5) ? 'fill-[#FFA500] text-[#FFA500]' : 'fill-gray-200 text-gray-200'}`} />
              ))}
            </div>
            <span className="font-bold text-gray-800 text-sm ml-1">{vendor.rating || '4.5'}</span>
            <span className="text-gray-500 text-xs">({vendor.reviewsCount || 0})</span>
          </div>

          {/* Location / Distance */}
          <div className="flex items-start gap-1 text-gray-600 text-[12px] mb-2 leading-snug line-clamp-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" />
            <span>
              {vendor.address}, {vendor.neighborhood}
              {vendor.distanceKm !== undefined && (
                <span className="font-semibold text-gray-800 ml-1">• {vendor.distanceKm} km</span>
              )}
            </span>
          </div>

          {/* Key Tags */}
          <div className="flex flex-wrap gap-1 mt-auto">
            <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Open Now
            </span>
            <span className="bg-gray-50 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-gray-100">
              24/7 Service
            </span>
          </div>
        </div>
      </div>

      {/* CTA Buttons Hierarchy */}
      <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-3 border-t border-gray-50">
        <div className="flex gap-2 w-full">
          {/* Primary CTA: Call Now */}
          <a 
            href={callUrl} 
            onClick={(e) => { e.stopPropagation(); if (onTrackCall) onTrackCall(vendor.id); }} 
            className="flex-1 bg-[#22C55E] hover:bg-green-600 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors min-h-[44px]"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span className="text-[14px]">Call Now</span>
          </a>

          {/* Secondary CTA: WhatsApp */}
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => { e.stopPropagation(); if (onTrackWhatsApp) onTrackWhatsApp(vendor.id); }} 
            className="flex-1 bg-white border border-[#22C55E] text-[#22C55E] hover:bg-green-50 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors min-h-[44px]"
          >
            <WhatsAppLogo size="sm" />
            <span className="text-[14px]">WhatsApp</span>
          </a>
        </div>

        {/* Tertiary CTA: Get Quote */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onGetBestDeal(vendor);
          }}
          className="w-full sm:w-auto px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors border border-gray-200 min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-[14px]">Get Quote</span>
        </button>
      </div>
    </article>
  );
};
