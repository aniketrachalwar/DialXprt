import React from 'react';
import { Phone, MapPin, CheckCircle2, Star, Navigation2, Share2, ShieldCheck, Clock } from 'lucide-react';
import { Vendor } from '../types';
import { WhatsAppLogo } from './WhatsAppLogo';
import { AppLanguage, getTranslation, getCategoryName } from '../lib/translations';

interface VendorCardProps {
  vendor: Vendor;
  onSelectVendor: (vendor: Vendor) => void;
  onTrackCall: (vendorId: string) => void;
  onTrackWhatsApp: (vendorId: string) => void;
  currentLang?: AppLanguage;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  onSelectVendor,
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
    `Hi ${vendor.ownerName}, I found your business '${vendor.name}' on DialXprt Hyderabad. I need your ${vendor.category} service.`
  );
  const whatsappUrl = `https://wa.me/${vendor.whatsapp}?text=${waMessage}`;

  // Google Maps directions URL
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${vendor.lat},${vendor.lng}`;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${vendor.name} - ${vendor.category} in ${vendor.neighborhood}`,
        text: `Contact ${vendor.name} (${vendor.category}) in ${vendor.neighborhood}, Hyderabad via DialXprt: Call ${vendor.phone}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Check out ${vendor.name} on DialXprt: Call ${vendor.phone}`);
      alert(t('vendorCopiedClipboard'));
    }
  };

  return (
    <article
      id={`vendor-card-${vendor.id}`}
      onClick={() => onSelectVendor(vendor)}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image & Badge Header */}
      <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
        <img
          src={vendor.imageUrl}
          alt={`${vendor.name} - ${vendor.category} in ${vendor.neighborhood}, Hyderabad`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Verification Status Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
          {isApproved ? (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
              <span>{t('verifiedBadge')}</span>
            </span>
          ) : (
            <span className="bg-amber-500/95 backdrop-blur-md text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
              <Clock className="w-3.5 h-3.5 text-gray-900" />
              <span>{t('pendingReview')}</span>
            </span>
          )}
        </div>

        {/* Dynamic Distance Pill */}
        <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
          <MapPin className="w-3.5 h-3.5 text-[#F57C00]" />
          <span>{vendor.distanceKm !== undefined ? `${vendor.distanceKm} ${t('distanceKm')}` : vendor.neighborhood}</span>
        </div>

        {/* Bottom Image Overlay Details */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
          <span className="bg-[#1A237E]/90 text-indigo-100 font-bold text-xs px-2 py-0.5 rounded-md backdrop-blur-sm">
            {getCategoryName(vendor.categorySlug, vendor.category, currentLang)}
          </span>
          <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md text-xs font-semibold backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{vendor.rating}</span>
            <span className="text-gray-300">({vendor.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-[#1A237E] transition-colors line-clamp-1">
              {vendor.name}
            </h3>
            <button
              onClick={handleShare}
              className="text-gray-400 hover:text-gray-700 p-1 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-gray-100"
              title={t('shareVendor')}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs font-medium text-gray-600 mt-0.5 line-clamp-1">
            {t('ownerLabel')}: <span className="text-gray-900 font-semibold">{vendor.ownerName}</span>
          </p>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{vendor.address}</span>
          </div>

          {vendor.description && (
            <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
              {vendor.description}
            </p>
          )}
        </div>

        {/* Volunteer Notes Banner if verified */}
        {vendor.verifiedByVolunteer && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-1.5 text-[11px] text-emerald-800 flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{vendor.verifiedByVolunteer}</span>
          </div>
        )}

        {/* Action Buttons Section */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          {/* Two Massive Side-by-Side Call & WhatsApp Action Buttons */}
          <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
            {/* Call Now Button */}
            <a
              id={`call-vendor-${vendor.id}`}
              href={callUrl}
              onClick={() => onTrackCall(vendor.id)}
              className="flex items-center justify-center gap-2 bg-[#1A237E] hover:bg-indigo-900 text-white font-bold py-3 px-2 rounded-xl shadow-md active:scale-95 transition-all text-sm min-h-[48px]"
            >
              <Phone className="w-4 h-4 text-emerald-300 fill-emerald-300" />
              <span>{t('callNow')}</span>
            </a>

            {/* WhatsApp Direct Link Button */}
            <a
              id={`whatsapp-vendor-${vendor.id}`}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onTrackWhatsApp(vendor.id)}
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-emerald-600 text-white font-bold py-3 px-2 rounded-xl shadow-md active:scale-95 transition-all text-sm min-h-[48px]"
            >
              <WhatsAppLogo size="sm" />
              <span>{t('chatWhatsApp')}</span>
            </a>
          </div>

          {/* Navigation link to Google Maps */}
          <div className="flex items-center justify-between text-xs pt-1 px-1 text-gray-500">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-indigo-700 hover:text-indigo-900 font-semibold text-[11px]"
            >
              <Navigation2 className="w-3 h-3 text-[#F57C00]" />
              <span>{t('openInGoogleMaps')}</span>
            </a>
            <span className="text-[10px] text-gray-400">
              {vendor.callsCount || 0} {t('callsLabel')}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
