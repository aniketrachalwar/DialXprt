import React, { useState } from 'react';
import {
  UserRole,
  Vendor,
  VolunteerUser,
  Category,
  } from '../types';
import {
  ShieldCheck,
  Crown,
  Store,
  User,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
  PlusCircle,
  Clock,
  Eye,
  Users,
  Search,
  FileSpreadsheet,
  Award,
  QrCode,
  History,
  Calendar,
  Star,
  RotateCcw,
  Bookmark,
  Trash2,
  X,
  MessageSquare,
  ChevronRight,
  Pencil,
  LogOut,
  Save,
  Building,
  Mail,
} from 'lucide-react';
import { WhatsAppLogo } from './WhatsAppLogo';
import { AppLanguage, getTranslation } from '../lib/translations';
import { HYDERABAD_NEIGHBORHOODS } from '../data/mockVendors';

interface AccountViewProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  userPhone: string;
  userName?: string;
  userEmail?: string;
  onUpdateUserProfile?: (name: string, phone: string, email: string, neighborhood: string) => void;
  onUpdateVendorDetails?: (updatedVendor: Vendor) => void;
  onLogout?: () => void;
  vendors: Vendor[];
  categories: Category[];
  currentNeighborhood: string;
  onUpdateVendorStatus: (
    vendorId: string,
    status: 'approved' | 'pending' | 'rejected',
    volunteerName: string,
    notes: string
  ) => void;
  onOpenRegistration: () => void;
  onExportCSV: () => void;
  onSelectVendor: (vendor: Vendor) => void;
  currentLang?: AppLanguage;
}

export const AccountView: React.FC<AccountViewProps> = ({
  currentRole,
  onRoleChange,
  userPhone,
  userName = 'Rahul Sharma',
  userEmail = 'rahul.sharma@example.com',
  onUpdateUserProfile,
  onUpdateVendorDetails,
  onLogout,
  vendors,
  categories,
  currentNeighborhood,
  onUpdateVendorStatus,
  onOpenRegistration,
  onExportCSV,
  onSelectVendor,
  currentLang = 'en',
}) => {
  const t = (key: string) => getTranslation(currentLang, key);

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editPhone, setEditPhone] = useState(userPhone);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [editNeighborhood, setEditNeighborhood] = useState(currentNeighborhood);

  // Business editing state
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editShopName, setEditShopName] = useState('');
  const [editCategorySlug, setEditCategorySlug] = useState('');
  const [editOwnerName, setEditOwnerName] = useState('');
  const [editShopPhone, setEditShopPhone] = useState('');
  const [editShopWhatsapp, setEditShopWhatsapp] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editShopNeighborhood, setEditShopNeighborhood] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  const openEditVendorModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setEditShopName(vendor.name);
    setEditCategorySlug(vendor.categorySlug);
    setEditOwnerName(vendor.ownerName);
    setEditShopPhone(vendor.phone);
    setEditShopWhatsapp(vendor.whatsapp || vendor.phone);
    setEditAddress(vendor.address);
    setEditShopNeighborhood(vendor.neighborhood);
    setEditDescription(vendor.description);
    setEditImageUrl(vendor.imageUrl);
  };

  const handleSaveVendorEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor) return;

    const matchedCat = categories.find((c) => c.slug === editCategorySlug);
    const updated: Vendor = {
      ...editingVendor,
      name: editShopName,
      categorySlug: editCategorySlug,
      category: matchedCat ? matchedCat.name : editingVendor.category,
      ownerName: editOwnerName,
      phone: editShopPhone,
      whatsapp: editShopWhatsapp,
      address: editAddress,
      neighborhood: editShopNeighborhood,
      description: editDescription,
      imageUrl: editImageUrl || editingVendor.imageUrl,
      updatedAt: new Date().toISOString(),
    };

    if (onUpdateVendorDetails) {
      onUpdateVendorDetails(updated);
    }
    setEditingVendor(null);
  };

  const handleSaveProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUserProfile) {
      onUpdateUserProfile(editName, editPhone, editEmail, editNeighborhood);
    }
    setIsEditingProfile(false);
  };

  // Customer History & Worker Interactions State
  const [customerHistory, setCustomerHistory] = useState<CustomerWorkerInteraction[]>(() => {
    try {
      const saved = localStorage.getItem('dialxprt_customer_history_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'hist-1',
        vendorId: 'v-101',
        vendorName: 'Raju Plumber & Drainage Works',
        vendorCategory: 'Plumber',
        vendorPhone: '9849012345',
        vendorAddress: 'Plot 42, Near Metro Pillar 108, Madhapur',
        vendorNeighborhood: 'Madhapur',
        vendorImage: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=400',
        interactionType: 'visit',
        timestamp: 'Yesterday at 4:30 PM',
        visitDate: '2026-07-25 16:30',
        serviceProvided: 'Kitchen Sink Leakage Repair & Valve Replacement',
        status: 'Completed',
        ratingGiven: 5,
        customerNotes: 'Arrived within 20 mins. Fixed water leak efficiently.',
      },
      {
        id: 'hist-2',
        vendorId: 'v-102',
        vendorName: 'Sri Venkateswara Kirana & General Store',
        vendorCategory: 'Kirana Store',
        vendorPhone: '9876543210',
        vendorAddress: 'Shop 4, Main Road, Gachibowli',
        vendorNeighborhood: 'Gachibowli',
        vendorImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=400',
        interactionType: 'whatsapp',
        timestamp: '2 days ago',
        visitDate: '2026-07-24 10:15',
        serviceProvided: 'Monthly Household Grocery Delivery',
        status: 'Completed',
        ratingGiven: 5,
        customerNotes: 'Fresh groceries delivered at doorstep within 30 mins.',
      },
      {
        id: 'hist-3',
        vendorId: 'v-103',
        vendorName: 'Srinivas Electrician & AC Service',
        vendorCategory: 'Electrician',
        vendorPhone: '9123456789',
        vendorAddress: 'Block B, KPHB Colony, Kukatpally',
        vendorNeighborhood: 'Kukatpally',
        vendorImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
        interactionType: 'call',
        timestamp: '5 days ago',
        visitDate: '2026-07-21 14:00',
        serviceProvided: 'AC Filter Cleaning & Main Switchboard Wiring Check',
        status: 'Completed',
        ratingGiven: 4,
        customerNotes: 'Prompt electrical troubleshooting and polite service.',
      },
    ];
  });

  // Saved Favorite Workers State
  const [savedWorkers, setSavedWorkers] = useState<CustomerSavedWorker[]>(() => {
    try {
      const saved = localStorage.getItem('dialxprt_saved_workers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        vendorId: 'v-101',
        vendorName: 'Raju Plumber & Drainage Works',
        vendorCategory: 'Plumber',
        vendorPhone: '9849012345',
        vendorNeighborhood: 'Madhapur',
        vendorImage: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=400',
        rating: 4.9,
        addedAt: '2026-07-20',
      },
      {
        vendorId: 'v-102',
        vendorName: 'Sri Venkateswara Kirana & General Store',
        vendorCategory: 'Kirana Store',
        vendorPhone: '9876543210',
        vendorNeighborhood: 'Gachibowli',
        vendorImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=400',
        rating: 4.8,
        addedAt: '2026-07-22',
      },
    ];
  });

  // Customer sub-tab state
  const [customerSubTab, setCustomerSubTab] = useState<'history' | 'saved' | 'profile'>('history');

  // Rating Modal state
  const [selectedRatingItem, setSelectedRatingItem] = useState<CustomerWorkerInteraction | null>(null);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState<string>('');

  // Helper to save customer history
  const saveCustomerHistory = (list: CustomerWorkerInteraction[]) => {
    setCustomerHistory(list);
    try {
      localStorage.setItem('dialxprt_customer_history_v2', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to repeat a worker booking
  const handleRepeatBooking = (item: CustomerWorkerInteraction) => {
    const newInteraction: CustomerWorkerInteraction = {
      id: `hist-${Date.now()}`,
      vendorId: item.vendorId,
      vendorName: item.vendorName,
      vendorCategory: item.vendorCategory,
      vendorPhone: item.vendorPhone,
      vendorAddress: item.vendorAddress,
      vendorNeighborhood: item.vendorNeighborhood,
      vendorImage: item.vendorImage,
      interactionType: 'booking',
      timestamp: 'Just now',
      visitDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      serviceProvided: `Repeat Service Request: ${item.vendorCategory} Visit`,
      status: 'Scheduled',
    };

    saveCustomerHistory([newInteraction, ...customerHistory]);
    alert(`Repeat visit requested with ${item.vendorName}! The worker will call +91 ${userPhone || '9849012345'} shortly to confirm arrival time.`);
  };

  // Helper to submit star rating
  const handleRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRatingItem) return;

    const updated = customerHistory.map((h) => {
      if (h.id === selectedRatingItem.id) {
        return {
          ...h,
          ratingGiven: ratingStars,
          customerNotes: ratingComment || h.customerNotes,
        };
      }
      return h;
    });

    saveCustomerHistory(updated);
    setSelectedRatingItem(null);
    setRatingComment('');
    alert(`Thank you! ${ratingStars}-star rating submitted for ${selectedRatingItem.vendorName}.`);
  };

  // Helper to toggle favorite worker
  const toggleSaveWorker = (item: CustomerWorkerInteraction) => {
    const isSaved = savedWorkers.some((s) => s.vendorId === item.vendorId);
    let updated: CustomerSavedWorker[];
    if (isSaved) {
      updated = savedWorkers.filter((s) => s.vendorId !== item.vendorId);
    } else {
      updated = [
        ...savedWorkers,
        {
          vendorId: item.vendorId,
          vendorName: item.vendorName,
          vendorCategory: item.vendorCategory,
          vendorPhone: item.vendorPhone,
          vendorNeighborhood: item.vendorNeighborhood,
          vendorImage: item.vendorImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400',
          rating: 4.9,
          addedAt: new Date().toISOString().slice(0, 10),
        },
      ];
    }
    setSavedWorkers(updated);
    try {
      localStorage.setItem('dialxprt_saved_workers', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // State for Admin Volunteer Management
  const [volunteersList, setVolunteersList] = useState<VolunteerUser[]>([
    {
      id: 'vol-1',
      name: 'Aniket Rachalwar',
      phone: '9849012345',
      district: 'Madhapur & HITEC City',
      status: 'active',
      verifiedShopsCount: 14,
      permissions: {
        canApproveShops: true,
        canRejectShops: true,
        canAssignDistrict: true,
      },
    },
    {
      id: 'vol-2',
      name: 'Priya Sharma',
      phone: '9876543210',
      district: 'Gachibowli & Financial District',
      status: 'active',
      verifiedShopsCount: 9,
      permissions: {
        canApproveShops: true,
        canRejectShops: false,
        canAssignDistrict: false,
      },
    },
    {
      id: 'vol-3',
      name: 'Suresh Kumar',
      phone: '9123456789',
      district: 'Kukatpally & KPHB',
      status: 'active',
      verifiedShopsCount: 21,
      permissions: {
        canApproveShops: true,
        canRejectShops: true,
        canAssignDistrict: false,
      },
    },
  ]);

  const [newVolName, setNewVolName] = useState('');
  const [newVolPhone, setNewVolPhone] = useState('');
  const [newVolDistrict, setNewVolDistrict] = useState('Banjara Hills');
  const [isAddingVolunteer, setIsAddingVolunteer] = useState(false);

  // Admin filter for store approvals
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Add volunteer function (Admin only)
  const handleAddVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVolName || !newVolPhone) return;

    const newVol: VolunteerUser = {
      id: `vol-${Date.now()}`,
      name: newVolName,
      phone: newVolPhone,
      district: newVolDistrict,
      status: 'active',
      verifiedShopsCount: 0,
      permissions: {
        canApproveShops: true,
        canRejectShops: false,
        canAssignDistrict: false,
      },
    };

    setVolunteersList((prev) => [...prev, newVol]);
    setNewVolName('');
    setNewVolPhone('');
    setIsAddingVolunteer(false);
    alert(`Volunteer access granted to ${newVolName} for ${newVolDistrict}!`);
  };

  const toggleVolunteerStatus = (volId: string) => {
    setVolunteersList((prev) =>
      prev.map((v) =>
        v.id === volId ? { ...v, status: v.status === 'active' ? 'suspended' : 'active' } : v
      )
    );
  };

  // Filtered vendors for Admin / Volunteer
  const pendingVendors = vendors.filter((v) => v.status === 'pending');
  const approvedVendors = vendors.filter((v) => v.status === 'approved');

  const filteredAdminVendors = vendors.filter((v) => {
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Shop Owner registered vendors
  const myOwnedShops = vendors.slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8 animate-fade-in">
      {/* 1. TOP ACCOUNT ROLE SWITCHER & PROFILE HEADER */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
          <div className="flex items-center gap-3.5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md ${
              currentRole === 'admin'
                ? 'bg-gradient-to-tr from-purple-700 to-indigo-900'
                : currentRole === 'volunteer'
                ? 'bg-gradient-to-tr from-amber-500 to-orange-600'
                : currentRole === 'vendor'
                ? 'bg-gradient-to-tr from-blue-600 to-cyan-700'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-800'
            }`}>
              {currentRole === 'admin' ? (
                <Crown className="w-8 h-8 text-amber-300" />
              ) : currentRole === 'volunteer' ? (
                <ShieldCheck className="w-8 h-8 text-white" />
              ) : currentRole === 'vendor' ? (
                <Store className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  {userName}
                </h1>
                <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                  currentRole === 'admin'
                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                    : currentRole === 'volunteer'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : currentRole === 'vendor'
                    ? 'bg-blue-100 text-blue-900 border border-blue-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}>
                  {currentRole === 'admin'
                    ? t('superAdmin')
                    : currentRole === 'volunteer'
                    ? t('volunteerAssessor')
                    : currentRole === 'vendor'
                    ? t('businessOwner')
                    : t('customerResident')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                <span>📱 +91 {userPhone || '9849012345'}</span>
                {userEmail && (
                  <>
                    <span>•</span>
                    <span>✉️ {userEmail}</span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1 text-gray-700 font-semibold">
                  <MapPin className="w-3 h-3 text-[#F36F21]" /> {currentNeighborhood}, {t('hyderabad')}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => {
                setEditName(userName);
                setEditPhone(userPhone);
                setEditEmail(userEmail);
                setEditNeighborhood(currentNeighborhood);
                setIsEditingProfile(true);
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3.5 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 min-h-[44px]"
            >
              <Pencil className="w-3.5 h-3.5 text-[#1A9E9E]" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={onOpenRegistration}
              className="bg-[#F36F21] hover:bg-orange-600 text-white font-bold px-3.5 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ {t('registerShopFree')}</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-3 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 min-h-[44px]"
                title="Log Out / Switch Account"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PROFILE EDIT MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar border border-gray-200">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto sm:hidden mb-2" />
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-[#1A9E9E]" />
                <span>Edit Account Profile</span>
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Display Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A9E9E] font-bold min-h-[44px]"
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
                    className="flex-1 px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A9E9E] font-bold min-h-[44px]"
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
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A9E9E] font-bold min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primary Neighborhood in Hyderabad</label>
                <select
                  value={editNeighborhood}
                  onChange={(e) => setEditNeighborhood(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A9E9E] font-bold min-h-[44px]"
                >
                  {HYDERABAD_NEIGHBORHOODS.map((n) => (
                    <option key={n.id} value={n.name}>{n.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1A9E9E] hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 min-h-[44px]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BUSINESS EDIT MODAL */}
      {editingVendor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar border border-gray-200">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto sm:hidden mb-2" />

            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#F36F21]" />
                <span>Edit Business / Store Details</span>
              </h3>
              <button
                onClick={() => setEditingVendor(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVendorEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={editShopName}
                    onChange={(e) => setEditShopName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A9E9E] font-bold min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Service Category</label>
                  <select
                    value={editCategorySlug}
                    onChange={(e) => setEditCategorySlug(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A9E9E] font-bold min-h-[44px]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    required
                    value={editOwnerName}
                    onChange={(e) => setEditOwnerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A9E9E] font-bold min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editShopPhone}
                    onChange={(e) => setEditShopPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A9E9E] font-bold min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={editShopWhatsapp}
                    onChange={(e) => setEditShopWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A9E9E] font-bold min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A9E9E] font-bold min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Neighborhood Area</label>
                  <select
                    value={editShopNeighborhood}
                    onChange={(e) => setEditShopNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A9E9E] font-bold min-h-[44px]"
                  >
                    {HYDERABAD_NEIGHBORHOODS.map((n) => (
                      <option key={n.id} value={n.name}>{n.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Business Description & Services</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A9E9E]"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A9E9E] min-h-[44px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingVendor(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#F36F21] hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 min-h-[44px]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Business Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
