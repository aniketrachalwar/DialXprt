import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Mic, MapPin, CheckCircle2, ChevronRight, ChevronLeft, Building2, User, Phone, MessageSquare, ShieldCheck, PlusCircle } from 'lucide-react';
import { Category, Vendor, Neighborhood } from '../types';
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
}

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
}) => {
  const t = (key: string) => getTranslation(currentLang, key);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categorySearchRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categorySearchRef.current && !categorySearchRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (neighborhoodSearchRef.current && !neighborhoodSearchRef.current.contains(event.target as Node)) {
        setIsNeighborhoodDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<Neighborhood[]>([]);
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  const [isNeighborhoodDropdownOpen, setIsNeighborhoodDropdownOpen] = useState(false);
  const neighborhoodSearchRef = useRef<HTMLDivElement>(null);
  const [pincode, setPincode] = useState('');
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [referenceName, setReferenceName] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [keywords, setKeywords] = useState('');
  const [operatingHours, setOperatingHours] = useState('9:00 AM - 8:00 PM');
  const [images, setImages] = useState<string[]>([]);
  const [imageInputUrl, setImageInputUrl] = useState('');
  const [locations, setLocations] = useState<[number, number][]>([[userLat, userLng]]);

  useEffect(() => {
    if (initialData && isEditMode) {
      setName(initialData.name || '');
      setOwnerName(initialData.ownerName || '');
      
      const foundCategory = categories.find(c => c.slug === initialData.categorySlug);
      if (foundCategory) setSelectedCategories([foundCategory]);
      
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
      setWhatsapp(initialData.whatsapp || '');
      setAddress(initialData.address || '');
      
      const foundNeighborhood = HYDERABAD_NEIGHBORHOODS.find(n => n.name === initialData.neighborhood);
      if (foundNeighborhood) setSelectedNeighborhoods([foundNeighborhood]);
      
      setPincode(initialData.pincode || '');
      setDescription(initialData.description || '');
      setKeywords(initialData.keywords || '');
      setOperatingHours(initialData.operatingHours || '9:00 AM - 8:00 PM');
      
      if (initialData.images && initialData.images.length > 0) {
        setImages(initialData.images);
      } else if (initialData.imageUrl) {
        setImages([initialData.imageUrl]);
      }
      
      if (initialData.lat && initialData.lng) {
        setLocations([[initialData.lat, initialData.lng], ...(initialData.additionalLocations?.map(l => [l.lat, l.lng] as [number, number]) || [])]);
      }
    }
  }, [initialData, isEditMode, categories]);



  useEffect(() => {
    if (selectedNeighborhoods.length > 0) {
      const uniquePincodes = Array.from(new Set(selectedNeighborhoods.map(n => n.pincode))).join(', ');
      setPincode(uniquePincodes);
    }
  }, [selectedNeighborhoods]);

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

  const handleUsePresetPhoto = (url: string) => {
    setImages(prev => [...prev, url]);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ownerName || selectedCategories.length === 0 || !experience || selectedNeighborhoods.length === 0 || !pincode || !phone) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    setLoading(true);

    const categoryName = selectedCategories.map(c => c.name).join(', ');
    const categorySlug = selectedCategories.map(c => c.slug).join(', ');
    const finalNeighborhood = selectedNeighborhoods.map(n => n.name).join(', ');

    const finalImage =
      images[0] ||
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600';

    try {
      await onSubmit({
        name: name || ownerName,
        ownerName,
        category: categoryName,
        categorySlug,
        phone,
        email,
        whatsapp: whatsapp || phone,
        address: address || finalNeighborhood,
        neighborhood: finalNeighborhood,
        city: 'Hyderabad',
        pincode,
        lat: locations[0]?.[0] || userLat,
        lng: locations[0]?.[1] || userLng,
        additionalLocations: locations.length > 1 ? locations.slice(1).map(pos => ({ lat: pos[0], lng: pos[1] })) : [],
        imageUrl: finalImage,
        images,
        keywords,
        operatingHours,
        fullAddress: address,
        description,
        experience,
        suggestions,
        referenceName,
        referenceNumber,
      });
      setLoading(false);
    } catch (err: any) {
      console.error('Registration error:', err);
      setLoading(false);
      alert(`Error submitting store registration: ${err.message || String(err)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans animate-fade-in flex flex-col">
      {/* Header */}
      <div className="bg-[#0F5C5C] text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-40 shadow-md">
        <button 
          onClick={onBack}
          className="p-1.5 -ml-1.5 hover:bg-white/10 rounded-full transition-colors active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight">
            {isEditMode ? 'Edit Business Details' : t('registerStoreTitle')}
          </h1>
          <p className="text-xs text-indigo-200">Complete all details to list your business</p>
        </div>
      </div>

      {/* Volunteer Notice Banner */}
      <div className="bg-amber-50 border-b border-amber-200 p-2.5 px-4 text-xs text-amber-900 flex items-start gap-2 shadow-sm">
        <ShieldCheck className="w-4 h-4 text-[#F36F21] shrink-0 mt-0.5" />
        <span>{t('registerSubTitle')}</span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-lg mx-auto w-full p-4 sm:p-6 bg-white shadow-sm sm:my-4 sm:rounded-2xl sm:border sm:border-gray-100">
        <form onSubmit={handleSubmitForm} className="space-y-6">
          <div className="space-y-4 animate-fade-in">
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Business Name *
                </label>
                <div className="relative mb-3">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Business Name"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none min-h-[48px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name/పేరు/नाम *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none min-h-[48px]"
                  />
                </div>
              </div>

              {isEditMode ? (
                <div ref={categorySearchRef} className="relative">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Profession/వృత్తి/वृत्ति *
                  </label>
                  
                  <div 
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white min-h-[48px] flex flex-wrap gap-1.5 items-center cursor-text"
                    onClick={() => setIsCategoryDropdownOpen(true)}
                  >
                    {selectedCategories.map(cat => (
                      <span key={cat?.slug || Math.random().toString()} className="bg-orange-100 text-[#F36F21] px-2 py-1 rounded-md flex items-center gap-1 font-bold text-[11px]">
                        {cat?.name || 'Custom'}
                        <X 
                          className="w-3.5 h-3.5 cursor-pointer hover:text-orange-700" 
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
                      placeholder={selectedCategories.length === 0 ? "Search for Electrician, Plumber, etc..." : "Add more..."}
                      className="flex-1 min-w-[120px] focus:outline-none text-sm bg-transparent my-1"
                      onFocus={() => setIsCategoryDropdownOpen(true)}
                    />
                  </div>

                  {isCategoryDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {(categories || []).filter(cat => {
                        if (!cat) return false;
                        if (selectedCategories.some(c => c?.slug === cat.slug)) return false;
                        if (!categorySearch) return true;
                        return (cat?.name || "").toLowerCase().includes((categorySearch || "").toLowerCase()) || 
                               (cat?.slug || "").toLowerCase().includes((categorySearch || "").toLowerCase());
                      }).length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">No matching professions found.</div>
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
                            className="px-4 py-2.5 hover:bg-orange-50 cursor-pointer flex items-center gap-2 text-sm text-gray-700 font-semibold"
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
                          className="px-4 py-3 border-t border-gray-100 hover:bg-orange-50 cursor-pointer flex items-center gap-2 text-sm text-[#F36F21] font-bold"
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
                          <PlusCircle className="w-4 h-4" /> Add "{categorySearch}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Profession/వృత్తి/वृत्ति *
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedCategories[0]?.name || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) {
                        setSelectedCategories([]);
                      } else {
                        setSelectedCategories([{
                          id: `custom-${Date.now()}`,
                          name: val,
                          slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                          emoji: '🏷️'
                        }]);
                      }
                    }}
                    placeholder="For Example :- Electrician, Plumber, etc..."
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none min-h-[48px]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Experience *
                </label>
                <input
                  type="text"
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="For Example :- 1yr, 10yr, 6 Months etc..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none min-h-[48px]"
                />
              </div>

              <hr className="border-gray-100 my-6" />
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Shop Photos / Board Photos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {images.map((img, i) => (
                        <div key={i} className="relative h-24 w-full rounded-lg overflow-hidden border border-gray-200">
                          <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs shadow-md active:scale-95"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <label className="cursor-pointer flex flex-col items-center justify-center py-2 border-t border-gray-200 mt-2">
                    <Camera className="w-6 h-6 text-[#F36F21] mb-1" />
                    <span className="text-xs font-bold text-gray-700">Take Photos or Upload Images</span>
                    <span className="text-[10px] text-gray-500">You can upload multiple files</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="mt-2">
                  <p className="text-[11px] text-gray-500 mb-1 font-medium">Or pick sample shop images:</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUsePresetPhoto('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600')}
                      className="text-[10px] bg-gray-100 hover:bg-gray-200 p-1.5 rounded border font-medium truncate active:scale-95"
                    >
                      Electrical Store
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUsePresetPhoto('https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=600')}
                      className="text-[10px] bg-gray-100 hover:bg-gray-200 p-1.5 rounded border font-medium truncate active:scale-95"
                    >
                      Kirana Store
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUsePresetPhoto('https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600')}
                      className="text-[10px] bg-gray-100 hover:bg-gray-200 p-1.5 rounded border font-medium truncate active:scale-95"
                    >
                      Plumbing Shop
                    </button>
                  </div>
                </div>
              </div>

              <div ref={neighborhoodSearchRef} className="relative">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Area/ప్రాంతం/क्षेत्र *
                </label>
                
                <div 
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white min-h-[48px] flex flex-wrap gap-1.5 items-center cursor-text"
                  onClick={() => setIsNeighborhoodDropdownOpen(true)}
                >
                  {selectedNeighborhoods.map(n => (
                    <span key={n.id} className="bg-teal-50 text-[#0F5C5C] px-2 py-1 rounded-md flex items-center gap-1 font-bold text-[11px]">
                      {n.name}
                      <X 
                        className="w-3.5 h-3.5 cursor-pointer hover:text-teal-700" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNeighborhoods(prev => prev.filter(item => item.id !== n.id));
                        }} 
                      />
                    </span>
                  ))}
                  
                  <input
                    type="text"
                    value={neighborhoodSearch}
                    onChange={(e) => {
                      setNeighborhoodSearch(e.target.value);
                      setIsNeighborhoodDropdownOpen(true);
                    }}
                    placeholder={selectedNeighborhoods.length === 0 ? "Search Area or Pincode..." : "Add more areas..."}
                    className="flex-1 min-w-[120px] focus:outline-none text-sm bg-transparent my-1"
                    onFocus={() => setIsNeighborhoodDropdownOpen(true)}
                  />
                </div>

                {isNeighborhoodDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {HYDERABAD_NEIGHBORHOODS.filter(n => {
                      if (selectedNeighborhoods.some(item => item.id === n.id)) return false;
                      const search = neighborhoodSearch.toLowerCase();
                      const pinSearch = pincode.toLowerCase();
                      
                      if (search) {
                        return n.name.toLowerCase().includes(search) || n.pincode.includes(search);
                      }
                      
                      if (pinSearch && pinSearch.length >= 3) {
                        return n.pincode.includes(pinSearch);
                      }
                      
                      return true;
                    }).length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">No matching areas found.</div>
                    ) : (
                      HYDERABAD_NEIGHBORHOODS.filter(n => {
                        if (selectedNeighborhoods.some(item => item.id === n.id)) return false;
                        const search = neighborhoodSearch.toLowerCase();
                        const pinSearch = pincode.toLowerCase();
                        if (search) {
                          return n.name.toLowerCase().includes(search) || n.pincode.includes(search);
                        }
                        if (pinSearch && pinSearch.length >= 3) {
                          return n.pincode.includes(pinSearch);
                        }
                        return true;
                      }).map(n => (
                        <div 
                          key={n.id}
                          className="px-4 py-2.5 hover:bg-teal-50 cursor-pointer flex items-center justify-between text-sm text-gray-700 font-medium"
                          onClick={() => {
                            setSelectedNeighborhoods(prev => [...prev, n]);
                            setNeighborhoodSearch('');
                            setIsNeighborhoodDropdownOpen(false);
                          }}
                        >
                          <span>{n.name}</span>
                          <span className="text-xs text-gray-400">{n.pincode}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    if (e.target.value.length >= 3) {
                      setIsNeighborhoodDropdownOpen(true);
                    }
                  }}
                  placeholder="e.g. 500081"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none min-h-[48px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Business or Shop Name ( OPTIONAL )
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Better if you provide Name."
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none min-h-[48px]"
                  />
                </div>
              </div>

              {isEditMode && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Exact Shop Location (GPS) *
                  </label>
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-3">
                    <p className="text-xs text-teal-800 mb-3 font-medium">Please stand inside or right outside your shop/business and click the auto-detect button to capture your exact location.</p>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition((pos) => {
                            setLocations([[pos.coords.latitude, pos.coords.longitude]]);
                            alert('Location detected successfully!');
                          }, (err) => {
                            alert('Unable to detect location: ' + err.message);
                          }, { enableHighAccuracy: true });
                        } else {
                          alert('Geolocation is not supported by your browser');
                        }
                      }}
                      className="w-full bg-[#0F5C5C] hover:bg-teal-700 text-white py-2.5 rounded-lg font-bold active:scale-95 flex items-center justify-center gap-2 transition-transform shadow-sm min-h-[48px]"
                    >
                      <MapPin className="w-5 h-5" />
                      Auto Detect Exact Location
                    </button>
                    {locations.length > 0 && (
                      <p className="text-[11px] text-center text-teal-700 mt-3 font-bold bg-teal-100/50 py-1.5 rounded-md flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Location captured successfully
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Address/చిరునామా/पता ( OPTIONAL )
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="In detail with Landmark. ( Example :- Shivaji Nagar Opposite Hanuman Temple etc...)"
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none"
                />
              </div>

              <hr className="border-gray-100 my-6" />

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t('phoneLabel')} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 9849012345"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none font-semibold min-h-[48px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-emerald-600 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Same as phone number if empty"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none min-h-[48px]"
                  />
                </div>
              </div>

              {/* Speak to Fill Description Feature for low-literacy shop owners */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">
                    Profession Discription ( OPTIONAL )
                  </label>
                  <button
                    type="button"
                    onClick={handleVoiceDescription}
                    className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border transition-all ${
                      isListening
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'bg-indigo-50 text-[#0F5C5C] border-indigo-200 hover:bg-indigo-100'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5 text-[#F36F21]" />
                    <span>{isListening ? 'Listening...' : 'Speak Details (Voice)'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Better if you provide discription."
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Any Suggestions ( OPTIONAL )
                </label>
                <textarea
                  rows={2}
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="Your suggestions"
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Reference Name ( OPTIONAL )
                </label>
                <input
                  type="text"
                  value={referenceName}
                  onChange={(e) => setReferenceName(e.target.value)}
                  placeholder="Name of the person who referred you"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none min-h-[48px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Reference Number ( OPTIONAL )
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Number of the person who referred you"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none min-h-[48px]"
                />
              </div>



              <div className="flex pt-4 mt-2">
                <button
                  type="submit"
                  disabled={loading || !phone || !ownerName || selectedCategories.length === 0 || !experience || selectedNeighborhoods.length === 0 || !pincode}
                  className="w-full bg-[#F36F21] hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg min-h-[48px] disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Store...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{t('submitRegister')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
        </form>
      </div>
    </div>
  );
};

