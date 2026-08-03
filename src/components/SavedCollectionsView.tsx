import React, { useState } from 'react';
import { Bookmark, ArrowLeft, Trash2, Folder } from 'lucide-react';
import { Vendor, Collection } from '../types';
import { VendorCard } from './VendorCard';

interface SavedCollectionsViewProps {
  vendors: Vendor[];
  collections: Collection[];
  favoriteVendorIds: string[];
  onToggleFavorite: (vendorId: string, e?: React.MouseEvent) => void;
  onSelectVendor: (vendor: Vendor) => void;
  onBack: () => void;
  onOpenCollectionsModal: (vendorId: string) => void;
  onDeleteCollection: (collectionId: string) => void;
}

export const SavedCollectionsView: React.FC<SavedCollectionsViewProps> = ({
  vendors,
  collections,
  favoriteVendorIds,
  onToggleFavorite,
  onSelectVendor,
  onBack,
  onOpenCollectionsModal,
  onDeleteCollection
}) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  const selectedCollection = collections.find(c => c.id === selectedCollectionId);
  const collectionVendors = selectedCollection 
    ? vendors.filter(v => selectedCollection.vendorIds.includes(v.id))
    : [];

  return (
    <div className="bg-[#F4F7FA] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center px-4 py-4 gap-3 max-w-lg mx-auto">
          <button 
            onClick={() => selectedCollectionId ? setSelectedCollectionId(null) : onBack()}
            className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-indigo-500 fill-indigo-500" />
              {selectedCollection ? selectedCollection.name : 'Saved Collections'}
            </h1>
          </div>
          {selectedCollection && (
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this collection?')) {
                  onDeleteCollection(selectedCollection.id);
                  setSelectedCollectionId(null);
                }
              }}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors active:scale-95"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto p-4 pt-6">
        {!selectedCollectionId ? (
          /* List of Collections */
          collections.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center space-y-4 shadow-sm border border-gray-100 mt-10">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <Bookmark className="w-10 h-10 text-indigo-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No Collections Yet</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[250px] mx-auto">
                Organize professionals into custom lists for your upcoming projects. Tap the bookmark icon on any business to get started!
              </p>
              <button 
                onClick={onBack}
                className="mt-6 bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-8 rounded-xl transition-all active:scale-95 shadow-md"
              >
                Discover Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {collections.map(col => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollectionId(col.id)}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-4 hover:shadow-md transition-all active:scale-95 text-left group"
                >
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <Folder className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{col.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {col.vendorIds.length} {col.vendorIds.length === 1 ? 'business' : 'businesses'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )
        ) : (
          /* Viewing a specific collection */
          <div className="flex flex-col gap-4">
            {collectionVendors.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">This collection is empty.</p>
                <button 
                  onClick={onBack}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Find businesses to add
                </button>
              </div>
            ) : (
              collectionVendors.map(vendor => (
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
                  isFavorite={favoriteVendorIds.includes(vendor.id)}
                  onToggleFavorite={onToggleFavorite}
                  onBookmarkClick={(vId, e) => {
                    if (e) e.stopPropagation();
                    onOpenCollectionsModal(vId);
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
