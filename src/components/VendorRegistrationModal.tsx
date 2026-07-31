import React, { useState, useEffect } from 'react';
import { X, Camera, Mic, MapPin, CheckCircle2, ChevronRight, ChevronLeft, Building2, User, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { Category, Vendor } from '../types';
import { HYDERABAD_NEIGHBORHOODS } from '../data/mockVendors';
import { AppLanguage, getTranslation, getCategoryName } from '../lib/translations';

interface VendorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  userLat?: number;
  userLng?: number;
  currentNeighborhood?: string;
  onSubmit: (vendorData: Omit<Vendor, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'status' | 'isVerified' | 'rating' | 'reviewsCount' | 'viewsCount' | 'callsCount' | 'whatsappClicksCount'>) => Promise<void>;
  currentLang?: AppLanguage;
}

export const VendorRegistrationModal: React.FC<VendorRegistrationModalProps> = ({
  isOpen,
  onClose,
  categories,
  userLat = 17.4483,
  userLng = 78.3915,
  currentNeighborhood = 'Madhapur',
  onSubmit,
  currentLang = 'en',
}) => {
  const t = (key: string) => getTranslation(currentLang, key);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [categorySlug, setCategorySlug] = useState('electrician');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [pincode, setPincode] = useState('');
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [referenceName, setReferenceName] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [keywords, setKeywords] = useState('');
  const [operatingHours, setOperatingHours] = useState('9:00 AM - 8:00 PM');
  const [imageUrl, setImageUrl] = useState('');
  const [lat, setLat] = useState(userLat);
  const [lng, setLng] = useState(userLng);

  useEffect(() => {
    if (currentNeighborhood) {
      setNeighborhood(currentNeighborhood);
    }
  }, [currentNeighborhood]);

  if (!isOpen) return null;

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
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsePresetPhoto = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !categorySlug || !experience || !neighborhood || !pincode || !phone || !whatsapp) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    setLoading(true);

    const categoryObj = categories.find((c) => c.slug === categorySlug);
    const categoryName = categoryObj ? categoryObj.name : 'Electrician';

    const finalImage =
      imageUrl ||
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600';

    try {
      await onSubmit({
        name: name || ownerName,
        ownerName,
        category: categoryName,
        categorySlug,
        phone,
        whatsapp: whatsapp || phone,
        address: address || neighborhood,
        neighborhood,
        city: 'Hyderabad',
        pincode,
        lat,
        lng,
        imageUrl: finalImage,
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
      onClose();
    } catch (err) {
      setLoading(false);
      alert('Error submitting store registration.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-t-[28px] sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slide-up sm:animate-fade-in pb-safe sm:pb-0">
        {/* iOS Drag Indicator Handle */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-2 shrink-0 sm:hidden"></div>

        {/* Modal Header */}
        <div className="bg-[#0F5C5C] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F36F21] flex items-center justify-center font-bold text-white text-sm">
              {step}
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">{t('registerStoreTitle')}</h2>
              <p className="text-xs text-indigo-200">Step {step} of 3: Onboarding Form</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-indigo-200 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Volunteer Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200 p-2.5 px-4 text-xs text-amber-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#F36F21] shrink-0 mt-0.5" />
          <span>{t('registerSubTitle')}</span>
        </div>

        {/* Step Form Content */}
        <form onSubmit={handleSubmitForm} className="p-4 overflow-y-auto space-y-4 flex-1">
        {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-3 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Name/పేరు/नाम *
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

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Profession/వృత్తి/वृत्ति *
                </label>
                <input
                  type="text"
                  required
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  placeholder="For example Electrician, Tours And Travels, Wholesale Textiles, Plumber, AC Mechanic etc..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none min-h-[48px]"
                />
              </div>

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

              <div className="pt-3">
                <button
                  type="button"
                  disabled={!ownerName || !categorySlug || !experience}
                  onClick={() => setStep(2)}
                  className="w-full bg-[#0F5C5C] hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all min-h-[48px] disabled:opacity-50"
                >
                  <span>Next: Location Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shop Photo & Address */}
          {step === 2 && (
            <div className="space-y-3 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Shop Photo / Board Photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  {imageUrl ? (
                    <div className="relative h-32 w-full rounded-lg overflow-hidden">
                      <img src={imageUrl} alt="Shop preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center py-2">
                      <Camera className="w-8 h-8 text-[#F36F21] mb-1" />
                      <span className="text-xs font-bold text-gray-700">Take Photo or Upload Image</span>
                      <span className="text-[10px] text-gray-500">Tap to open phone camera</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {!imageUrl && (
                  <div className="mt-2">
                    <p className="text-[11px] text-gray-500 mb-1 font-medium">Or pick sample shop image:</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUsePresetPhoto('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600')}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 p-1.5 rounded border font-medium truncate"
                      >
                        Electrical Store
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUsePresetPhoto('https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=600')}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 p-1.5 rounded border font-medium truncate"
                      >
                        Kirana Store
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUsePresetPhoto('https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600')}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 p-1.5 rounded border font-medium truncate"
                      >
                        Plumbing Shop
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Area/ప్రాంతం/क्षेत्र *
                </label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Business/Shop Located or Service Provide From. ( Example :- Goshamahal, Kachiguda, Attapur.)"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none min-h-[48px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
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

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1 min-h-[48px]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-2 bg-[#0F5C5C] hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>Next: Phone & Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Phone Numbers & Voice Description */}
          {step === 3 && (
            <div className="space-y-3 animate-fade-in">
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



              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1 min-h-[48px]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={loading || !phone || !ownerName || !categorySlug || !experience || !neighborhood || !pincode}
                  className="flex-2 bg-[#F36F21] hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg min-h-[48px] disabled:opacity-50"
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
          )}
        </form>
      </div>
    </div>
  );
};
