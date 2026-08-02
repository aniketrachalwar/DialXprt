import React, { useState } from 'react';
import { ChevronLeft, User, Camera, Save } from 'lucide-react';
import { HYDERABAD_NEIGHBORHOODS } from '../data/mockVendors';
import { AppLanguage, getTranslation } from '../lib/translations';

interface UserProfileEditViewProps {
  onBack: () => void;
  userName: string;
  userPhone: string;
  userEmail: string;
  userAvatar: string;
  currentNeighborhood: string;
  onUpdateUserProfile: (name: string, phone: string, email: string, neighborhood: string, avatar?: string) => void;
  currentLang?: AppLanguage;
}

export const UserProfileEditView: React.FC<UserProfileEditViewProps> = ({
  onBack,
  userName,
  userPhone,
  userEmail,
  userAvatar,
  currentNeighborhood,
  onUpdateUserProfile,
  currentLang = 'en',
}) => {
  const t = (key: string) => getTranslation(currentLang, key);

  const [editName, setEditName] = useState(userName);
  const [editPhone, setEditPhone] = useState(userPhone);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [editAvatar, setEditAvatar] = useState(userAvatar);
  const [editNeighborhood, setEditNeighborhood] = useState(currentNeighborhood);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserProfile(editName, editPhone, editEmail, editNeighborhood, editAvatar);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans animate-fade-in flex flex-col">
      {/* Header */}
      <div className="bg-cyan-500 text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-40 shadow-md">
        <button 
          onClick={onBack}
          className="p-1.5 -ml-1.5 hover:bg-white/10 rounded-full transition-colors active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight">Edit Account Profile</h1>
          <p className="text-xs text-teal-100">Update your personal details</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-lg mx-auto w-full p-4 sm:p-6 bg-white shadow-sm sm:my-4 sm:rounded-2xl sm:border sm:border-gray-100">
        <form onSubmit={handleSaveProfileEdit} className="space-y-4">
          <div className="flex flex-col items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              {editAvatar ? (
                <img src={editAvatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleProfileImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-xs font-bold text-cyan-500 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              Change Photo
            </span>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Display Name</label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">10-Digit Mobile Phone</label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-gray-100 border px-3 py-2.5 rounded-xl text-gray-600 min-h-[44px] flex items-center">+91</span>
              <input
                type="tel"
                required
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="9849012345"
                className="flex-1 px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address (Optional)</label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="rahul.sharma@example.com"
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Primary Neighborhood in Hyderabad</label>
            <select
              value={editNeighborhood}
              onChange={(e) => setEditNeighborhood(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold min-h-[44px]"
            >
              {HYDERABAD_NEIGHBORHOODS.map((n) => (
                <option key={n.id} value={n.name}>{n.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-5">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl min-h-[44px] bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 min-h-[44px] transition-transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

