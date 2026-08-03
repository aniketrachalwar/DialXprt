import React from 'react';
import { Heart, ArrowLeft, Search } from 'lucide-react';
import { Vendor } from '../types';
import { VendorCard } from './VendorCard';

interface FavoritesViewProps {
  vendors: Vendor[];
  favoriteVendorIds: string[];
  onToggleFavorite: (vendorId: string, e?: React.MouseEvent) => void;
  onSelectVendor: (vendor: Vendor) => void;
  onBack: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  vendors,
  favoriteVendorIds,
  onToggleFavorite,
  onSelectVendor,
  onBack
}) => {
  const favoriteVendors = vendors.filter(v => favoriteVendorIds.includes(v.id));

  return (
    <div className="bg-[#F4F7FA] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center px-4 py-4 gap-3 max-w-lg mx-auto">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              My Favorites
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto p-4 pt-6">
        {favoriteVendors.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center space-y-4 shadow-sm border border-gray-100 mt-10">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="w-10 h-10 text-rose-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Favorites Yet</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[250px] mx-auto">
              Save your favorite service providers here for quick access later. Just tap the heart icon on any business!
            </p>
            <button 
              onClick={onBack}
              className="mt-6 bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-8 rounded-xl transition-all active:scale-95 shadow-md"
            >
              Discover Services
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-bold text-gray-500 mb-2 px-1">
              You have {favoriteVendors.length} saved {favoriteVendors.length === 1 ? 'business' : 'businesses'}
            </p>
            {favoriteVendors.map(vendor => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onSelectVendor={onSelectVendor}
                onGetBestDeal={(v) => {
                  const waMessage = encodeURIComponent(
                    `Hi ${v.ownerName}, I found your business '${v.name}' on DialXprt. I need your ${v.category} service.`
                  );
                  window.open(`https://wa.me/${v.whatsapp}?text=${waMessage}`, "_blank");
                }}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
