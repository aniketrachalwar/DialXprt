import React, { useEffect } from 'react';
import { X, Phone, MapPin, CheckCircle2, Star, Navigation2, Share2, ShieldCheck, Clock, Building2, User } from 'lucide-react';
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

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: vendor.name,
    image: vendor.imageUrl,
    telephone: `+91${vendor.phone}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: vendor.address,
      addressLocality: vendor.neighborhood,
      addressRegion: 'Telangana',
      postalCode: vendor.pincode,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: vendor.lat,
      longitude: vendor.lng,
    },
    url: window.location.href,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: vendor.rating,
      reviewCount: vendor.reviewsCount,
    },
    priceRange: '₹₹',
  };

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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <div className="bg-white w-full max-w-xl rounded-t-[28px] sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-slide-up sm:animate-fade-in pb-safe sm:pb-0">
        {/* iOS Drag Indicator Handle */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-2 shrink-0 sm:hidden"></div>

        {/* Header Photo Container */}
        <div className="relative h-56 sm:h-64 w-full bg-gray-900 shrink-0">
          <img
            src={vendor.imageUrl}
            alt={`${vendor.name} - ${vendor.category} in ${vendor.neighborhood}, Hyderabad`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white p-2 rounded-full backdrop-blur-md min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-3 right-14 bg-black/60 hover:bg-black text-white p-2 rounded-full backdrop-blur-md min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Verification Badge */}
          <div className="absolute top-3 left-3">
            {isApproved ? (
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>{t('verifiedStore')}</span>
              </span>
            ) : (
              <span className="bg-amber-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                <Clock className="w-4 h-4" />
                <span>{t('pendingOfflineCheck')}</span>
              </span>
            )}
          </div>

          {/* Bottom Title Bar Overlay */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="bg-[#F36F21] text-white font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded">
              {getCategoryName(vendor.categorySlug, vendor.category, currentLang)}
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-1 leading-tight">
              {vendor.name}
            </h1>
            <div className="flex items-center gap-3 text-xs text-gray-200 mt-1">
              <div className="flex items-center gap-1 font-bold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{vendor.rating}</span>
                <span className="text-gray-300">({vendor.reviewsCount} {t('reviewsCountLabel')})</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#F36F21]" />
                <span>{vendor.neighborhood}, {t('hyderabad')}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Details Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-gray-800">
          {/* Volunteer Verification Proof Banner */}
          {vendor.verifiedByVolunteer && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{t('offlineVerificationConfirmed')}:</p>
                <p className="text-emerald-800">{vendor.verifiedByVolunteer}: {vendor.volunteerNotes}</p>
              </div>
            </div>
          )}

          {/* Address & Owner Info Box */}
          <div className="bg-gray-50 rounded-xl p-3.5 space-y-2 border border-gray-100 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-[#2B3990] shrink-0 mt-0.5" />
              <div>
                <span className="text-gray-500 text-xs">{t('ownerNameLabel')}:</span>
                <p className="font-bold text-gray-900">{vendor.ownerName}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 border-t border-gray-200/60 pt-2">
              <Building2 className="w-4 h-4 text-[#2B3990] shrink-0 mt-0.5" />
              <div>
                <span className="text-gray-500 text-xs">{t('fullAddressLabel')}:</span>
                <p className="font-medium text-gray-900">{vendor.address}</p>
                <p className="text-gray-500 text-xs mt-0.5">{t('pincodeLabel')}: {vendor.pincode}, {t('hyderabad')}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {vendor.description && (
            <div className="space-y-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">{t('aboutBusinessServices')}:</h3>
              <p className="text-sm text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-200">
                {vendor.description}
              </p>
            </div>
          )}

          {/* Google Maps Link */}
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 p-3 rounded-xl text-xs sm:text-sm text-[#2B3990] font-bold transition-colors"
          >
            <div className="flex items-center gap-2">
              <Navigation2 className="w-4 h-4 text-[#F36F21]" />
              <span>{t('getDirectionsGoogleMaps')}</span>
            </div>
            <span>→</span>
          </a>
        </div>

        {/* Bottom Action Footer with Massive Call & WhatsApp Buttons */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200 grid grid-cols-2 gap-3 shrink-0">
          <a
            id={`detail-call-btn-${vendor.id}`}
            href={callUrl}
            onClick={() => onTrackCall(vendor.id)}
            className="flex items-center justify-center gap-2 bg-[#2B3990] hover:bg-indigo-900 text-white font-black py-3.5 px-3 rounded-xl shadow-lg active:scale-95 transition-all text-sm min-h-[52px]"
          >
            <Phone className="w-5 h-5 text-emerald-300 fill-emerald-300" />
            <span>{t('callNow')} {vendor.phone}</span>
          </a>

          <a
            id={`detail-wa-btn-${vendor.id}`}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onTrackWhatsApp(vendor.id)}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-emerald-600 text-white font-black py-3.5 px-3 rounded-xl shadow-lg active:scale-95 transition-all text-sm min-h-[52px]"
          >
            <WhatsAppLogo size="md" />
            <span>{t('whatsapp')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
