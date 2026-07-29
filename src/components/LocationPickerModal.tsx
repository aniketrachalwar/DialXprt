import React, { useState } from 'react';
import { X, Navigation, MapPin, Check, Search, Compass } from 'lucide-react';
import { HYDERABAD_NEIGHBORHOODS } from '../data/mockVendors';
import { Neighborhood } from '../types';
import { AppLanguage, getTranslation } from '../lib/translations';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNeighborhood: string;
  onSelectNeighborhood: (neighborhood: Neighborhood) => void;
  onAutoDetectGPS: () => void;
  isDetecting: boolean;
  currentLang?: AppLanguage;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentNeighborhood,
  onSelectNeighborhood,
  onAutoDetectGPS,
  isDetecting,
  currentLang = 'en',
}) => {
  const t = (key: string) => getTranslation(currentLang, key);
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredNeighborhoods = HYDERABAD_NEIGHBORHOODS.filter(
    (n) =>
      n.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      n.pincode.includes(filterQuery)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-[28px] sm:rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-slide-up sm:animate-fade-in pb-safe sm:pb-0">
        {/* iOS Drag Indicator Handle */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-2 shrink-0 sm:hidden"></div>

        {/* Header */}
        <div className="bg-[#0F5C5C] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#F36F21]" />
            <h2 className="font-bold text-base">{t('selectLocationTitle')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-indigo-200 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {/* Auto-Detect GPS Location Button */}
          <button
            id="auto-detect-gps-btn"
            onClick={onAutoDetectGPS}
            disabled={isDetecting}
            className="w-full bg-[#F36F21] hover:bg-orange-600 text-white font-bold p-3.5 rounded-xl flex items-center justify-center gap-2 shadow transition-all min-h-[48px]"
          >
            <Navigation className={`w-5 h-5 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? t('detectingGps') : t('useGps')}</span>
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400 font-semibold">{t('orSelectNeighborhood')}</span>
            </div>
          </div>

          {/* Filter Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={t('filterNeighborhoodPlaceholder')}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none min-h-[40px]"
            />
          </div>

          {/* Neighborhood List */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {filteredNeighborhoods.map((area) => {
              const isSelected = currentNeighborhood === area.name;
              return (
                <button
                  key={area.id}
                  id={`area-select-${area.id}`}
                  onClick={() => {
                    onSelectNeighborhood(area);
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between min-h-[48px] ${
                    isSelected
                      ? 'bg-indigo-50 border-[#0F5C5C] text-[#0F5C5C] font-bold shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#F36F21]' : 'text-gray-400'}`} />
                    <div className="truncate">
                      <div className="text-xs truncate">{area.name}</div>
                      <div className="text-[10px] text-gray-400">{area.pincode}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#0F5C5C] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
