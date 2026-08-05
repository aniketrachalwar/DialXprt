import React from 'react';
import { Phone, MapPin, CheckCircle2, Star, MessageCircle, Navigation, Share2, Heart, Bookmark } from 'lucide-react';
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
  isFavorite?: boolean;
  onToggleFavorite?: (vendorId: string, e?: React.MouseEvent) => void;
  onBookmarkClick?: (vendorId: string, e?: React.MouseEvent) => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  onSelectVendor,
  onGetBestDeal,
  onTrackCall,
  onTrackWhatsApp,
  currentLang = 'en',
  isFavorite = false,
  onToggleFavorite,
  onBookmarkClick,
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
      className="bg-white/90 backdrop-blur-md rounded-[20px] shadow-md border border-white/60 p-3.5 mb-4 flex flex-col gap-3 cursor-pointer hover:shadow-xl transition-all overflow-hidden relative"
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
        <div className="w-28 sm:w-36 h-28 sm:h-32 shrink-0 rounded-xl overflow-hidden relative bg-gray-100 shadow-inner group">
          {/* Action Buttons Overlay */}
          <div className="absolute top-1.5 right-1.5 flex flex-col gap-1.5 z-20">
            {onToggleFavorite && (
              <button
                onClick={(e) => onToggleFavorite(vendor.id, e)}
                className="p-1.5 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full transition-all active:scale-90"
              >
                <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              </button>
            )}
            {onBookmarkClick && (
              <button
                onClick={(e) => onBookmarkClick(vendor.id, e)}
                className="p-1.5 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full transition-all active:scale-90"
              >
                <Bookmark className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          {vendor.images && vendor.images.length > 1 ? (
            <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {vendor.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${vendor.name} - ${i + 1}`}
                  className="w-full h-full object-cover shrink-0 snap-center"
                  loading="lazy"
                />
              ))}
            </div>
          ) : (
            <img
              src={vendor.imageUrl || (vendor.images && vendor.images[0])}
              alt={`${vendor.name} - ${vendor.category}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
          {vendor.images && vendor.images.length > 1 && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-black/30 px-2 py-0.5 rounded-full pointer-events-none">
              <span className="text-[8px] text-white font-bold">{vendor.images.length} Photos</span>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex-1 flex flex-col justify-start pt-1">
          {/* Title */}
          <h3 className="font-extrabold text-gray-900 text-[14px] sm:text-[16px] leading-tight mb-1 line-clamp-2">
            {vendor.name}
            {isApproved && (
              <CheckCircle2 className="w-3.5 h-3.5 fill-[#22C55E] text-white inline-block ml-1.5 -mt-0.5" />
            )}
          </h3>

          {/* Ratings & Reviews - Hidden per user request */}
          <div className="flex items-center gap-1.5 mb-1.5">
            {vendor.isVerified && (
              <span className="text-[10px] font-bold bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 rounded-full uppercase tracking-wider">VERIFIED</span>
            )}
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
            {vendor.operatingHours ? (
              (vendor.operatingHours || "").toLowerCase().includes('24/7') ? (
                <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-green-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> {vendor.operatingHours}
                </span>
              ) : (
                <span className="bg-gray-50 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-gray-200 line-clamp-1 max-w-[120px]">
                  {vendor.operatingHours}
                </span>
              )
            ) : null}
          </div>
        </div>
      </div>

      {/* Interaction Icons Row */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 px-2 sm:px-6">
        {/* Call Now */}
        <a 
          href={callUrl} 
          onClick={(e) => { e.stopPropagation(); if (onTrackCall) onTrackCall(vendor.id); }}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-[40px] h-[40px] rounded-2xl bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
            <Phone className="w-4 h-4 fill-white text-white" />
          </div>
          <span className="text-[10px] font-bold text-gray-800">Call Now</span>
        </a>

        {/* WhatsApp */}
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => { e.stopPropagation(); if (onTrackWhatsApp) onTrackWhatsApp(vendor.id); }}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-[40px] h-[40px] rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shadow-sm group-hover:bg-gray-50 transition-colors">
            <WhatsAppLogo className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-gray-800">WhatsApp</span>
        </a>

        {/* Direction */}
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.address + ' ' + (vendor.neighborhood || ''))}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-[40px] h-[40px] rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shadow-sm group-hover:bg-gray-50 transition-colors">
            <Navigation className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-[10px] font-bold text-gray-800">Direction</span>
        </a>

        {/* Share */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (navigator.share) {
              navigator.share({
                title: `${vendor.name} - ${vendor.category} in ${vendor.neighborhood}`,
                text: `Contact ${vendor.name} (${vendor.category}) in ${vendor.neighborhood}, Hyderabad: Call ${vendor.phone}`,
                url: `${window.location.origin}/expert/${vendor.id}`,
              }).catch(() => {});
            } else {
              navigator.clipboard.writeText(`Check out ${vendor.name} on DialXprt: Call ${vendor.phone}`);
              alert('Link copied to clipboard!');
            }
          }}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-[40px] h-[40px] rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shadow-sm group-hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-[10px] font-bold text-gray-800">Share</span>
        </button>
      </div>

      {/* Enquire Now Button */}
      <div className="mt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onGetBestDeal(vendor);
          }}
          className="w-full bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 shadow-md shadow-blue-500/30 text-white font-bold py-3.5 rounded-xl flex items-center justify-center shadow-sm transition-colors text-[14px]"
        >
          Enquire Now
        </button>
      </div>
    </article>
  );
};



