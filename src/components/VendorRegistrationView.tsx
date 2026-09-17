import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Building2, User, Phone, MessageSquare, ShieldCheck, CheckCircle2, Sparkles, MapPin, Briefcase, Award, Compass, Hash, FileText, UserCheck, Lightbulb, Camera, Mic, X, PlusCircle } from 'lucide-react';
import { Category, Vendor, Neighborhood, UserRole } from '../types';
import { HYDERABAD_NEIGHBORHOODS } from '../data/mockVendors';
import { AppLanguage, getTranslation, getCategoryName } from '../lib/translations';

interface VendorRegistrationViewProps {
  onBack: () => void;
  categories: Category[];
  userLat?: number;
  userLng?: number;
  currentNeighborhood?: string;
  onSubmit: (vendorData: Omit<Vendor, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'status' | 'isVerified' | 'rating' | 'reviewsCount' | 'viewsCount' | 'callsCount' | 'whatsappClicksCount'>) => Promise<void>;
  currentLang?: AppLanguage;
  initialData?: Vendor;
  isEditMode?: boolean;
  currentRole?: UserRole;
}

const CITIES_LIST = [
  'Hyderabad'
];

export const VendorRegistrationView: React.FC<VendorRegistrationViewProps> = ({
  onBack,
  categories,
  userLat = 17.4483,
  userLng = 78.3915,
  currentNeighborhood = 'Madhapur',
  onSubmit,
  currentLang = 'en',
  initialData,
  isEditMode = false,
  currentRole = 'vendor',
}) => {
  const t = (key: string) => getTranslation(currentLang, key);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Form Fields (Matching exact Google Form specifications)
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [name, setName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categorySearchRef = useRef<HTMLDivElement>(null);

  const [experience, setExperience] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [referenceName, setReferenceName] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [description, setDescription] = useState('');

  // Additional optional & GPS location states
  const [images, setImages] = useState<string[]>([]);
  const [lat, setLat] = useState<number>(initialData?.lat || userLat);
  const [lng, setLng] = useState<number>(initialData?.lng || userLng);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(Boolean(initialData?.lat && initialData?.lng));
  const [locations, setLocations] = useState<[number, number][]>([[userLat, userLng]]);

  // Click outside category dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categorySearchRef.current && !categorySearchRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pre-fill initial data if editing
  useEffect(() => {
    if (initialData) {
      setOwnerName(initialData.ownerName || '');
      setPhone(initialData.phone || '');
      setWhatsapp(initialData.whatsapp || '');
      setName(initialData.name || '');

      if (initialData.categorySlug) {
        const slugs = initialData.categorySlug.split(',').map(s => s.trim().toLowerCase());
        const found = categories.filter(c => slugs.includes(c.slug.toLowerCase()));
        setSelectedCategories(found);
      } else if (initialData.category) {
        const cats = initialData.category.split(',').map(s => s.trim().toLowerCase());
        const found = categories.filter(c => cats.includes(c.name.toLowerCase()) || cats.includes(c.slug.toLowerCase()));
        setSelectedCategories(found);
      }

      setExperience(initialData.experience || '');
      setCity(initialData.city || 'Hyderabad');
      setNeighborhoodSearch(initialData.neighborhood || '');
      setPincode(initialData.pincode || '');
      setAddress(initialData.address || '');
      setReferenceName(initialData.referenceName || '');
      setReferenceNumber(initialData.referenceNumber || '');
      setSuggestions(initialData.suggestions || '');
      setDescription(initialData.description || '');

      if (initialData.lat && initialData.lng) {
        setLat(initialData.lat);
        setLng(initialData.lng);
        setLocations([[initialData.lat, initialData.lng]]);
        setLocationSuccess(true);
      }

      if (initialData.images && initialData.images.length > 0) {
        setImages(initialData.images);
      } else if (initialData.imageUrl) {
        setImages([initialData.imageUrl]);
      }
    }
  }, [initialData, isEditMode, categories]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const capturedLat = position.coords.latitude;
        const capturedLng = position.coords.longitude;
        setLat(capturedLat);
        setLng(capturedLng);
        setLocations([[capturedLat, capturedLng]]);
        setIsLocating(false);
        setLocationSuccess(true);
      },
      (error) => {
        setIsLocating(false);
        alert('Unable to capture exact GPS location: ' + error.message + '. Please ensure location permission is allowed.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleVoiceDescription = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recording not supported on this device browser. Please type details manually.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLang === 'te' ? 'te-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };

    recognition.start();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ownerName.trim()) {
      alert('Please enter your Name.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      alert('Please enter a valid 10-digit Phone Number.');
      return;
    }

    if (!name.trim()) {
      alert('Please enter your Business / Shop Name.');
      return;
    }

    setLoading(true);

    const categoryName = selectedCategories.map(c => c?.name || '').filter(Boolean).join(', ') || categorySearch || 'General Service';
    const categorySlug = selectedCategories.map(c => c?.slug || '').filter(Boolean).join(', ') || categorySearch.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general';
    const finalNeighborhood = neighborhoodSearch || currentNeighborhood || 'Madhapur';

    const finalImage =
      images[0] ||
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600';

    try {
      await onSubmit({
        name: name.trim(),
        ownerName: ownerName.trim(),
        category: categoryName,
        categorySlug,
        phone: phone.trim(),
        email: `${phone.trim()}@dialxprt.com`,
        whatsapp: whatsapp.trim() || phone.trim(),
        address: address.trim() || finalNeighborhood,
        neighborhood: finalNeighborhood,
        city: city || 'Hyderabad',
        pincode: pincode.trim() || '500081',
        lat: lat || locations[0]?.[0] || userLat,
        lng: lng || locations[0]?.[1] || userLng,
        additionalLocations: locations.length > 1 ? locations.slice(1).map(pos => ({ lat: pos[0], lng: pos[1] })) : [],
        imageUrl: finalImage,
        images,
        keywords: `${name} ${categoryName} ${finalNeighborhood} ${city}`,
        operatingHours: '9:00 AM - 8:00 PM',
        fullAddress: address,
        description,
        experience: experience.trim() || 'N/A',
        suggestions: suggestions.trim(),
        referenceName: referenceName.trim(),
        referenceNumber: referenceNumber.trim(),
      });
      setLoading(false);
    } catch (err: any) {
      console.error('Registration error:', err);
      setLoading(false);
      alert(`Error submitting store registration: ${err.message || String(err)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-slate-50 to-blue-50/50 pb-24 font-sans animate-fade-in flex flex-col">
      <div className="bg-gradient-to-r from-[#0F5C5C] via-[#1E3A8A] to-[#0F5C5C] text-white px-4 py-4 sticky top-0 z-40 shadow-lg border-b border-orange-400/30">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button 
            type="button"
            onClick={onBack}
            className="p-2 -ml-1 hover:bg-white/10 rounded-full transition-colors active:scale-95 text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black leading-tight flex items-center gap-2">
              <span>{isEditMode ? 'Edit Business Listing' : 'Register Your Shop or Service'}</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </h1>
            <p className="text-xs text-orange-200 font-medium">Free 100% Instant Business Verification & Leads</p>
          </div>
        </div>
      </div>

      {/* Hero Announcement Badge */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-3 px-4 shadow-md flex items-center justify-center gap-2 text-xs font-extrabold text-center">
        <ShieldCheck className="w-4 h-4 text-yellow-200 shrink-0" />
        <span>Direct Website Registration — Submissions are verified and listed instantly on DialXprt!</span>
      </div>

      {/* Main Form Container: Orange, Blue & White Card */}
      <div className="flex-1 max-w-xl mx-auto w-full p-4 sm:p-6 my-4">
        <div className="bg-white rounded-3xl shadow-xl border-2 border-orange-200/80 overflow-hidden">
          
          {/* Card Title Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 border-b border-orange-100 p-5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F36F21] to-amber-500 text-white flex items-center justify-center shadow-lg shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0F5C5C]">Official Registration Form</h2>
              <p className="text-xs text-gray-600">Fill all the required details (* marked) to list your business</p>
            </div>
          </div>

          <form onSubmit={handleSubmitForm} className="p-5 sm:p-7 space-y-6">
            
            {/* 1. NAME (Required) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <span>Name. / పేరు / नाम</span>
                <span className="text-red-500 text-sm">*</span>
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-orange-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-11 pr-4 py-3 text-sm font-semibold border-2 border-slate-200 rounded-2xl focus:border-[#F36F21] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-slate-50/50 focus:bg-white min-h-[50px]"
                />
              </div>
            </div>

            {/* 2. NUMBER (Required) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <span>Number / ఫోన్ నంబర్</span>
                <span className="text-red-500 text-sm">*</span>
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-blue-600 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  className="w-full pl-11 pr-4 py-3 text-sm font-bold border-2 border-slate-200 rounded-2xl focus:border-[#0F5C5C] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 focus:bg-white min-h-[50px]"
                />
              </div>
            </div>

            {/* 3. WHATSAPP NUMBER (Required) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <span>WhatsApp Number / వాట్సాప్ నంబర్</span>
                <span className="text-red-500 text-sm">*</span>
              </label>
              <div className="relative">
                <MessageSquare className="w-5 h-5 text-emerald-600 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                  placeholder="WhatsApp number (same as phone if empty)"
                  className="w-full pl-11 pr-4 py-3 text-sm font-semibold border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-slate-50/50 focus:bg-white min-h-[50px]"
                />
              </div>
            </div>

            {/* 4. BUSINESS/SHOP NAME (Required) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <span>Business/Shop Name / వ్యాపారం/షాప్ పేరు</span>
                <span className="text-red-500 text-sm">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-5 h-5 text-orange-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sri Balaji Electricals & Hardware"
                  className="w-full pl-11 pr-4 py-3 text-sm font-bold border-2 border-slate-200 rounded-2xl focus:border-[#F36F21] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-slate-50/50 focus:bg-white min-h-[50px]"
                />
              </div>
            </div>

            {/* 5. PROFESSION (Required) */}
            <div className="space-y-1.5" ref={categorySearchRef}>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <span>Profession. / వృత్తి / वृत्ति</span>
                <span className="text-red-500 text-sm">*</span>
              </label>

              <div className="relative">
                <Briefcase className="w-5 h-5 text-blue-600 absolute left-3.5 top-3.5 z-10" />
                
                <div 
                  className="w-full pl-11 pr-3 py-2.5 border-2 border-slate-200 rounded-2xl bg-slate-50/50 focus-within:bg-white focus-within:border-[#0F5C5C] focus-within:ring-4 focus-within:ring-blue-500/10 min-h-[50px] flex flex-wrap gap-1.5 items-center cursor-text transition-all"
                  onClick={() => setIsCategoryDropdownOpen(true)}
                >
                  {selectedCategories.map(cat => (
                    <span key={cat?.slug || Math.random().toString()} className="bg-orange-500 text-white px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-bold text-xs shadow-sm">
                      <span>{cat?.emoji || '🏷️'}</span>
                      <span>{cat?.name || 'Custom'}</span>
                      <X 
                        className="w-3.5 h-3.5 cursor-pointer hover:bg-orange-600 rounded-full p-0.5" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategories(prev => prev.filter(c => c?.slug !== cat?.slug));
                        }} 
                      />
                    </span>
                  ))}
                  
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => {
                      setCategorySearch(e.target.value);
                      setIsCategoryDropdownOpen(true);
                    }}
                    placeholder={selectedCategories.length === 0 ? "Choose or type profession (e.g. Electrician, Plumber...)" : "Add more..."}
                    className="flex-1 min-w-[140px] focus:outline-none text-sm font-semibold bg-transparent py-1"
                    onFocus={() => setIsCategoryDropdownOpen(true)}
                  />
                </div>

                {isCategoryDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1.5 bg-white border-2 border-orange-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                    {(categories || []).filter(cat => {
                      if (!cat) return false;
                      if (selectedCategories.some(c => c?.slug === cat.slug)) return false;
                      if (!categorySearch) return true;
                      return (cat?.name || "").toLowerCase().includes((categorySearch || "").toLowerCase()) || 
                             (cat?.slug || "").toLowerCase().includes((categorySearch || "").toLowerCase());
                    }).length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 font-medium">No matching profession found. Type custom profession below.</div>
                    ) : (
                      (categories || []).filter(cat => {
                        if (!cat) return false;
                        if (selectedCategories.some(c => c?.slug === cat.slug)) return false;
                        if (!categorySearch) return true;
                        return (cat?.name || "").toLowerCase().includes((categorySearch || "").toLowerCase()) || 
                               (cat?.slug || "").toLowerCase().includes((categorySearch || "").toLowerCase());
                      }).map(cat => (
                        <div 
                          key={cat?.slug || Math.random().toString()}
                          className="px-4 py-3 hover:bg-orange-50 cursor-pointer flex items-center gap-2.5 text-sm text-gray-800 font-bold border-b border-gray-100 last:border-none transition-colors"
                          onClick={() => {
                            if (cat) {
                              setSelectedCategories(prev => [...prev, cat]);
                              setCategorySearch('');
                            }
                          }}
                        >
                          <span className="text-xl">{cat?.emoji || '🏷️'}</span>
                          <span>{getCategoryName(cat?.slug || '', cat?.name || '', currentLang)}</span>
                        </div>
                      ))
                    )}

                    {categorySearch && !(categories || []).some(c => c && (c.name || "").toLowerCase() === categorySearch.toLowerCase()) && (
                      <div 
                        className="px-4 py-3 border-t border-orange-100 bg-orange-50/70 hover:bg-orange-100 cursor-pointer flex items-center gap-2 text-sm text-[#F36F21] font-black"
                        onClick={() => {
                          setSelectedCategories(prev => [...prev, {
                            id: `custom-${Date.now()}`,
                            name: categorySearch.trim(),
                            slug: categorySearch.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                            emoji: '🏷️'
                          }]);
                          setCategorySearch('');
                        }}
                      >
                        <PlusCircle className="w-5 h-5 text-orange-500" /> Use custom: "{categorySearch}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 6. EXPERIENCE (Required) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <span>Experience. / అనుభవం</span>
                <span className="text-red-500 text-sm">*</span>
              </label>
              <div className="relative">
                <Award className="w-5 h-5 text-orange-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="For Example :- 1yr, 10yr, 6 Months etc..."
                  className="w-full pl-11 pr-4 py-3 text-sm font-semibold border-2 border-slate-200 rounded-2xl focus:border-[#F36F21] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-slate-50/50 focus:bg-white min-h-[50px]"
                />
              </div>
            </div>

            {/* 7. CITY (Required Dropdown matching Google Form) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <span>City. / నగరం</span>
                <span className="text-red-500 text-sm">*</span>
              </label>
              <div className="relative">
                <Compass className="w-5 h-5 text-blue-600 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 text-sm font-extrabold border-2 border-slate-200 rounded-2xl focus:border-[#0F5C5C] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 focus:bg-white min-h-[50px] appearance-none cursor-pointer text-slate-900"
                >
                  {CITIES_LIST.map((cityName) => (
                    <option key={cityName} value={cityName} className="font-semibold text-gray-800">
                      {cityName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-4 text-slate-500">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>
            {/* EXACT SHOP GPS LOCATION CAPTURE (ACCESSIBLE ONLY TO ADMIN & VOLUNTEER) */}
            {(currentRole === 'admin' || currentRole === 'volunteer') && (
              <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 border-2 border-teal-300 rounded-2xl p-4 space-y-3 shadow-md my-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-teal-200/60 pb-2.5">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs font-black text-[#0F5C5C] uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-orange-500 animate-bounce" />
                        <span>Exact Shop GPS Location (Field Verification)</span>
                      </h3>
                      <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-purple-300 flex items-center gap-1 uppercase tracking-wider shadow-xs">
                        <ShieldCheck className="w-3 h-3 text-purple-700" /> Admin & Volunteer Only
                      </span>
                    </div>
                    <p className="text-[11px] text-teal-800 font-medium mt-1">
                      When visiting the shop, tap below to auto-detect live GPS coordinates so customers discover the exact location on the map.
                    </p>
                  </div>

                  {locationSuccess && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase shrink-0 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> GPS Saved
                    </span>
                  )}
                </div>

                <button 
                  type="button" 
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="w-full bg-[#0F5C5C] hover:bg-teal-800 text-white font-black py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 text-xs uppercase tracking-wide min-h-[48px]"
                >
                  <Compass className={`w-4 h-4 text-amber-300 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Capturing Live GPS Coordinates...' : 'Auto-Detect Live Shop GPS Location'}</span>
                </button>

                {locationSuccess && lat && lng && (
                  <div className="bg-white/90 border border-teal-200 rounded-xl p-2.5 text-[11px] text-slate-700 font-bold flex items-center justify-between shadow-xs">
                    <span className="flex items-center gap-1 text-teal-900">
                      📍 Coordinates: <strong className="text-orange-600">{lat.toFixed(6)}, {lng.toFixed(6)}</strong>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Live Verified
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 8. AREA (Required) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <span>Area. / ప్రాంతం / क्षेत्र</span>
                <span className="text-red-500 text-sm">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-orange-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={neighborhoodSearch}
                  onChange={(e) => setNeighborhoodSearch(e.target.value)}
                  placeholder="e.g. Madhapur, Gachibowli, Kachiguda"
                  className="w-full pl-11 pr-4 py-3 text-sm font-semibold border-2 border-slate-200 rounded-2xl focus:border-[#F36F21] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-slate-50/50 focus:bg-white min-h-[50px]"
                />
              </div>
            </div>

            {/* 9. PINCODE (Required) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <span>Pincode. / పిన్‌కోడ్</span>
                <span className="text-red-500 text-sm">*</span>
              </label>
              <div className="relative">
                <Hash className="w-5 h-5 text-blue-600 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 500081"
                  className="w-full pl-11 pr-4 py-3 text-sm font-bold border-2 border-slate-200 rounded-2xl focus:border-[#0F5C5C] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 focus:bg-white min-h-[50px]"
                />
              </div>
            </div>

            <hr className="border-orange-100 my-6" />

            {/* 10. ADDRESS WITH LANDMARK (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <span>Address with landmark. ( Optional )</span>
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="In detail with landmark (e.g. Shivaji Nagar, Opposite Hanuman Temple)"
                className="w-full p-3 text-sm font-medium border-2 border-slate-200 rounded-2xl focus:border-[#F36F21] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-slate-50/50 focus:bg-white"
              />
            </div>

            {/* 11. REFERENCE NAME (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <span>Reference Name ( Optional )</span>
              </label>
              <div className="relative">
                <UserCheck className="w-5 h-5 text-indigo-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={referenceName}
                  onChange={(e) => setReferenceName(e.target.value)}
                  placeholder="Name of the person who referred you"
                  className="w-full pl-11 pr-4 py-3 text-sm font-medium border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-slate-50/50 focus:bg-white min-h-[50px]"
                />
              </div>
            </div>

            {/* 12. REFERENCE NUMBER (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <span>Reference Number ( Optional )</span>
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-indigo-500 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  maxLength={10}
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Phone number of the referee"
                  className="w-full pl-11 pr-4 py-3 text-sm font-medium border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-slate-50/50 focus:bg-white min-h-[50px]"
                />
              </div>
            </div>

            {/* 13. SUGGESTIONS (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <span>Suggestions ( Optional )</span>
              </label>
              <div className="relative">
                <textarea
                  rows={2}
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="Any feedback or suggestions for DialXprt"
                  className="w-full p-3 text-sm font-medium border-2 border-slate-200 rounded-2xl focus:border-[#F36F21] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* OPTIONAL SHOP PHOTOS / VOICE RECORDING ACCORDION (ACCESSIBLE ONLY TO ADMIN & VOLUNTEER) */}
            {(currentRole === 'admin' || currentRole === 'volunteer') && (
              <div className="bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200 rounded-2xl p-4 space-y-3 animate-fade-in my-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-orange-500" />
                      <span>Shop Photos & Voice Note (Optional)</span>
                    </span>
                    <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-300 uppercase tracking-wider shadow-xs">
                      Admin & Volunteer Only
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleVoiceDescription}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all shadow-sm ${
                      isListening
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'bg-white text-[#0F5C5C] border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5 text-orange-500" />
                    <span>{isListening ? 'Listening...' : 'Voice Record Details'}</span>
                  </button>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img, i) => (
                      <div key={i} className="relative h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <img src={img} alt={`Shop ${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs shadow-md"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="cursor-pointer flex items-center justify-center gap-2 py-2.5 bg-white border border-dashed border-orange-300 hover:border-orange-500 rounded-xl transition-colors">
                  <Camera className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold text-slate-700">Upload Shop / Board Photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {description && (
                  <p className="text-xs text-slate-600 italic bg-white p-2 rounded-xl border border-blue-100">
                    "{description}"
                  </p>
                )}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#F36F21] via-orange-500 to-[#F36F21] hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:shadow-orange-500/20 min-h-[54px] disabled:opacity-50 text-base active:scale-98 transition-all uppercase tracking-wide border-b-4 border-orange-700"
              >
                {loading ? (
                  <span>Registering Business...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-yellow-200 animate-bounce" />
                    <span>{isEditMode ? 'Save Changes' : 'Submit Business Registration'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
