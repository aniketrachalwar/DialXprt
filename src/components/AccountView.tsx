import React, { useState } from 'react';
import {
  UserRole,
  Vendor,
  VolunteerUser,
  Category,
  CustomerWorkerInteraction,
  CustomerSavedWorker,
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
              <Pencil className="w-3.5 h-3.5 text-[#2B3990]" />
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

        {/* ROLE PERSONA SWITCHER BAR */}
        <div className="mt-4 pt-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            {t('switchAccountMode')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Admin Switch */}
            <button
              onClick={() => onRoleChange('admin')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                currentRole === 'admin'
                  ? 'bg-purple-50 border-purple-600 shadow-sm ring-1 ring-purple-500'
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Crown className={`w-4 h-4 ${currentRole === 'admin' ? 'text-purple-700' : 'text-gray-400'}`} />
                {currentRole === 'admin' && <span className="w-2 h-2 rounded-full bg-purple-600"></span>}
              </div>
              <p className="font-extrabold text-xs text-gray-900 mt-1">{t('adminRole')}</p>
              <p className="text-[10px] text-gray-500">Full System Control</p>
            </button>

            {/* Volunteer Switch */}
            <button
              onClick={() => onRoleChange('volunteer')}
              className={`p-3 rounded-2xl border text-left transition-all relative ${
                currentRole === 'volunteer'
                  ? 'bg-amber-50 border-amber-500 shadow-sm ring-1 ring-amber-500'
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <ShieldCheck className={`w-4 h-4 ${currentRole === 'volunteer' ? 'text-amber-700' : 'text-gray-400'}`} />
                {pendingVendors.length > 0 && (
                  <span className="bg-amber-500 text-gray-900 font-extrabold text-[9px] px-1.5 py-0.2 rounded-full">
                    {pendingVendors.length}
                  </span>
                )}
              </div>
              <p className="font-extrabold text-xs text-gray-900 mt-1">{t('volunteerRole')}</p>
              <p className="text-[10px] text-gray-500">Field Verification</p>
            </button>

            {/* Shop Owner Switch */}
            <button
              onClick={() => onRoleChange('vendor')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                currentRole === 'vendor'
                  ? 'bg-blue-50 border-blue-600 shadow-sm ring-1 ring-blue-500'
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Store className={`w-4 h-4 ${currentRole === 'vendor' ? 'text-blue-700' : 'text-gray-400'}`} />
                {currentRole === 'vendor' && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
              </div>
              <p className="font-extrabold text-xs text-gray-900 mt-1">{t('shopOwnerRole')}</p>
              <p className="text-[10px] text-gray-500">My Shop Leads</p>
            </button>

            {/* Customer Switch */}
            <button
              onClick={() => onRoleChange('customer')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                currentRole === 'customer'
                  ? 'bg-emerald-50 border-emerald-600 shadow-sm ring-1 ring-emerald-500'
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <User className={`w-4 h-4 ${currentRole === 'customer' ? 'text-emerald-700' : 'text-gray-400'}`} />
                {currentRole === 'customer' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
              </div>
              <p className="font-extrabold text-xs text-gray-900 mt-1">{t('customer')}</p>
              <p className="text-[10px] text-gray-500">Directory Resident</p>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION A: SUPER ADMIN DASHBOARD VIEW */}
      {currentRole === 'admin' && (
        <div className="space-y-6 animate-fade-in">
          {/* Admin Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold">{t('totalShops')}</span>
                <Store className="w-4 h-4 text-[#2B3990]" />
              </div>
              <p className="text-2xl font-black text-gray-900 mt-1">{vendors.length}</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                {approvedVendors.length} Verified & Live
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold">{t('pendingReview')}</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-amber-600 mt-1">{pendingVendors.length}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Requires offline check</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold">{t('phoneLeads')}</span>
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-blue-900 mt-1">
                {vendors.reduce((acc, v) => acc + (v.callsCount || 0), 42)}
              </p>
              <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Direct buyer calls</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold">{t('activeVolunteers')}</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-black text-purple-900 mt-1">{volunteersList.length}</p>
              <p className="text-[10px] text-purple-600 font-semibold mt-0.5">Hyderabad ground squad</p>
            </div>
          </div>

          {/* VOLUNTEER ACCESS & PERMISSION MANAGEMENT */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-700" />
                  <span>{t('volunteerManager')}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Admin delegates verification power to local volunteers to physically inspect Kirana & trade shops.
                </p>
              </div>

              <button
                onClick={() => setIsAddingVolunteer(!isAddingVolunteer)}
                className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ {t('appointVolunteer')}</span>
              </button>
            </div>

            {/* Add Volunteer Form */}
            {isAddingVolunteer && (
              <form onSubmit={handleAddVolunteer} className="bg-purple-50 border border-purple-200 p-4 rounded-2xl space-y-3">
                <h3 className="font-extrabold text-xs text-purple-900 uppercase tracking-wider">
                  {t('appointVolunteer')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newVolName}
                      onChange={(e) => setNewVolName(e.target.value)}
                      placeholder="e.g. Rahul Reddy"
                      className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      value={newVolPhone}
                      onChange={(e) => setNewVolPhone(e.target.value)}
                      placeholder="9849012345"
                      className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">Assigned Area/District</label>
                    <select
                      value={newVolDistrict}
                      onChange={(e) => setNewVolDistrict(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-bold"
                    >
                      <option value="Madhapur & HITEC City">Madhapur & HITEC City</option>
                      <option value="Gachibowli & Financial Dist">Gachibowli & Financial Dist</option>
                      <option value="Kukatpally & KPHB">Kukatpally & KPHB</option>
                      <option value="Banjara Hills & Jubilee Hills">Banjara Hills & Jubilee Hills</option>
                      <option value="Secunderabad">Secunderabad</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingVolunteer(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow hover:bg-purple-800"
                  >
                    Confirm Access Appointment
                  </button>
                </div>
              </form>
            )}

            {/* Volunteer List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {volunteersList.map((vol) => (
                <div key={vol.id} className="border border-gray-200 rounded-2xl p-3.5 bg-gray-50/50 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-extrabold text-sm text-gray-900">{vol.name}</p>
                      <p className="text-[11px] text-gray-500">+91 {vol.phone}</p>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                      vol.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {vol.status}
                    </span>
                  </div>

                  <div className="text-[11px] bg-white p-2 rounded-xl border border-gray-200 text-gray-700 space-y-1">
                    <p className="font-semibold text-purple-900 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F36F21]" /> {vol.district}
                    </p>
                    <p className="text-gray-500">{vol.verifiedShopsCount} Shops Verified</p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => toggleVolunteerStatus(vol.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                        vol.status === 'active'
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {vol.status === 'active' ? 'Revoke Access' : 'Reactivate'}
                    </button>
                    <span className="text-[10px] text-gray-400 font-semibold">Can Approve Shops</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MASTER SHOP DIRECTORY & APPROVALS */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#2B3990]" />
                  <span>{t('masterDirectory')}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Review, approve, or verify all submitted Kirana stores, plumbers, and technicians.
                </p>
              </div>

              <button
                onClick={onExportCSV}
                className="bg-[#2B3990] hover:bg-indigo-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>{t('exportData')}</span>
              </button>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search store name, category or phone..."
                  className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                />
              </div>

              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold capitalize ${
                      statusFilter === st ? 'bg-white text-[#2B3990] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {st} {st === 'pending' && `(${pendingVendors.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Vendor List */}
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto no-scrollbar">
              {filteredAdminVendors.map((vendor) => (
                <div key={vendor.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 px-2 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img
                      src={vendor.imageUrl}
                      alt={vendor.name}
                      className="w-12 h-12 rounded-xl object-cover border shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-gray-900">{vendor.name}</h4>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          vendor.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : vendor.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {vendor.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {vendor.category} • {vendor.neighborhood} • Phone: +91 {vendor.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditVendorModal(vendor)}
                      className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg text-xs font-bold flex items-center gap-1"
                      title="Edit Business Details"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectVendor(vendor)}
                      className="p-2 text-gray-600 hover:text-[#2B3990] hover:bg-indigo-50 rounded-lg text-xs font-bold"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {vendor.status !== 'approved' && (
                      <button
                        onClick={() => onUpdateVendorStatus(vendor.id, 'approved', 'Super Admin', 'Approved directly by Admin')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}

                    {vendor.status !== 'rejected' && (
                      <button
                        onClick={() => onUpdateVendorStatus(vendor.id, 'rejected', 'Super Admin', 'Rejected by Admin')}
                        className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-2.5 py-1.5 rounded-lg text-xs border border-red-200"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: VOLUNTEER DASHBOARD VIEW */}
      {currentRole === 'volunteer' && (
        <div className="space-y-6 animate-fade-in">
          {/* Volunteer Banner */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-5 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Assigned District: Madhapur & HITEC City
              </span>
              <h2 className="text-xl font-black">{t('volunteerPortalTitle')}</h2>
              <p className="text-xs text-amber-100">
                You have admin-delegated access to physically/virtually verify local Kirana stores, plumbers, and technicians.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl text-center shrink-0 border border-white/20">
              <p className="text-2xl font-black">{pendingVendors.length}</p>
              <p className="text-[10px] font-bold text-amber-200">Shops Awaiting Your Visit</p>
            </div>
          </div>

          {/* Pending Verification Queue */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 space-y-4">
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>{t('pendingVerificationQueue')} ({pendingVendors.length})</span>
            </h3>

            {pendingVendors.length === 0 ? (
              <div className="text-center py-8 text-gray-500 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-bold text-gray-800">{t('noPendingShops')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingVendors.map((vendor) => (
                  <div key={vendor.id} className="border border-amber-200 bg-amber-50/40 rounded-2xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900">{vendor.name}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">{vendor.category} • Owner: {vendor.ownerName}</p>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-[#F36F21]" /> {vendor.address}, {vendor.neighborhood}
                        </p>
                      </div>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border text-xs space-y-1">
                      <p className="font-bold text-gray-800">Phone: +91 {vendor.phone}</p>
                      <p className="text-gray-500 text-[11px]">{vendor.description}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          const notes = prompt(`Enter offline verification field notes for ${vendor.name}:`, 'Visited store in-person. Verified shop photo and phone number.');
                          if (notes) {
                            onUpdateVendorStatus(vendor.id, 'approved', 'Volunteer Assessor', notes);
                          }
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('verifyAndMarkLive')}</span>
                      </button>

                      <button
                        onClick={() => {
                          const notes = prompt(`Reason for rejecting ${vendor.name}:`, 'Address unverified or shop inactive.');
                          if (notes) {
                            onUpdateVendorStatus(vendor.id, 'rejected', 'Volunteer Assessor', notes);
                          }
                        }}
                        className="bg-white text-red-600 hover:bg-red-50 border border-red-200 font-bold px-3 py-2 rounded-xl text-xs"
                      >
                        {t('reject')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION C: SHOP OWNER DASHBOARD VIEW */}
      {currentRole === 'vendor' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="bg-blue-500/30 text-blue-200 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-blue-400/30">
                Shop Owner Portal
              </span>
              <h2 className="text-xl font-black mt-1">{t('shopOwnerPortalTitle')}</h2>
              <p className="text-xs text-indigo-200">
                Track phone calls, WhatsApp leads, and request official DialXprt offline verification badges.
              </p>
            </div>

            <button
              onClick={onOpenRegistration}
              className="bg-[#F36F21] hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ {t('registerShopFree')}</span>
            </button>
          </div>

          <div className="space-y-4">
            {myOwnedShops.map((shop) => (
              <div key={shop.id} className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div className="flex items-center gap-3">
                    <img src={shop.imageUrl} alt={shop.name} className="w-14 h-14 rounded-2xl object-cover border" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-gray-900">{shop.name}</h3>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {t('verifiedBadge')} & Live
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Category: {shop.category} • Location: {shop.neighborhood}, {t('hyderabad')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => openEditVendorModal(shop)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-[#2B3990] font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-indigo-200 min-h-[44px]"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Business</span>
                    </button>

                    <button
                      onClick={() => onSelectVendor(shop)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 min-h-[44px]"
                    >
                      <Eye className="w-4 h-4 text-[#2B3990]" />
                      <span>View Public Storefront</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-indigo-50/60 p-3 rounded-2xl border border-indigo-100 text-center">
                    <p className="text-xs font-bold text-indigo-900">{t('storeViews')}</p>
                    <p className="text-xl font-black text-[#2B3990] mt-1">{shop.viewsCount || 128}</p>
                  </div>
                  <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-100 text-center">
                    <p className="text-xs font-bold text-blue-900">{t('phoneLeads')}</p>
                    <p className="text-xl font-black text-blue-700 mt-1">{shop.callsCount || 19}</p>
                  </div>
                  <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 text-center">
                    <p className="text-xs font-bold text-emerald-900">{t('whatsappLeads')}</p>
                    <p className="text-xl font-black text-emerald-700 mt-1">{shop.whatsappClicksCount || 14}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Award className="w-4 h-4 text-[#F36F21]" /> Direct customer connections with zero commission.
                  </p>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => alert('Printable QR Code Poster generator triggered!')}
                      className="flex-1 sm:flex-none border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
                    >
                      <QrCode className="w-4 h-4 text-[#2B3990]" />
                      <span>{t('downloadQR')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION D: DEDICATED CUSTOMER ACCOUNT HUB */}
      {currentRole === 'customer' && (
        <div className="space-y-6 animate-fade-in">
          {/* Customer Overview Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold">{t('contactedWorkers')}</span>
                <History className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-gray-900 mt-1">{customerHistory.length}</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Calls & Worker Visits</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold">{t('lastWorkerVisit')}</span>
                <Clock className="w-4 h-4 text-[#F36F21]" />
              </div>
              <p className="text-xs font-black text-gray-900 mt-2 truncate">
                {customerHistory[0]?.vendorName.split('&')[0] || 'None yet'}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">{customerHistory[0]?.timestamp || 'No recent visit'}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold">{t('savedFavoriteWorkers')}</span>
                <Bookmark className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-blue-900 mt-1">{savedWorkers.length}</p>
              <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Bookmarked Pros</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold">Location</span>
                <MapPin className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-sm font-black text-gray-900 mt-2 truncate">{currentNeighborhood}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Hyderabad Area</p>
            </div>
          </div>

          {/* Customer Sub-Navigation Tabs */}
          <div className="bg-white rounded-2xl p-1.5 border border-gray-200 shadow-xs flex items-center gap-1">
            <button
              onClick={() => setCustomerSubTab('history')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                customerSubTab === 'history'
                  ? 'bg-[#2B3990] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{t('pastHistoryTitle')} ({customerHistory.length})</span>
            </button>

            <button
              onClick={() => setCustomerSubTab('saved')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                customerSubTab === 'saved'
                  ? 'bg-[#2B3990] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{t('savedFavoriteWorkers')} ({savedWorkers.length})</span>
            </button>

            <button
              onClick={() => setCustomerSubTab('profile')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                customerSubTab === 'profile'
                  ? 'bg-[#2B3990] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t('customerAccountTitle')}</span>
            </button>
          </div>

          {/* SUB-VIEW 1: PAST HISTORY & WORKER VISITS */}
          {customerSubTab === 'history' && (
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#F36F21]" />
                    <span>{t('pastHistoryTitle')}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Complete record of plumbers, electricians & Kirana stores contacted or visited.
                  </p>
                </div>

                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto">
                  ✓ Verified Account History
                </span>
              </div>

              {customerHistory.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <History className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="font-bold text-gray-700">{t('noHistoryYet')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerHistory.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-2xl p-4 hover:border-indigo-300 transition-all bg-gray-50/40 space-y-3 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={item.vendorImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400'}
                            alt={item.vendorName}
                            className="w-14 h-14 rounded-2xl object-cover border shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-black text-base text-gray-900">{item.vendorName}</h4>
                              <span className="bg-indigo-100 text-[#2B3990] text-[10px] font-black px-2 py-0.5 rounded-full">
                                {item.vendorCategory}
                              </span>
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                  item.status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : item.status === 'Scheduled'
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>

                            <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-[#F36F21]" />
                              <span>{item.vendorAddress || item.vendorNeighborhood}</span>
                            </p>

                            <p className="text-[11px] text-gray-500 flex items-center gap-2 mt-1">
                              <span className="font-semibold text-gray-700">
                                🕒 {t('lastVisitedOn')}: {item.timestamp}
                              </span>
                              {item.serviceProvided && (
                                <>
                                  <span>•</span>
                                  <span>{item.serviceProvided}</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Rating Stars Badge */}
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl self-start sm:self-center shrink-0">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-black text-xs text-amber-900">
                            {item.ratingGiven ? `${item.ratingGiven}/5` : 'Not rated'}
                          </span>
                        </div>
                      </div>

                      {/* Customer feedback comment if exists */}
                      {item.customerNotes && (
                        <div className="bg-white p-2.5 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-0.5">
                          <span className="font-bold text-gray-900">Your Review Note:</span>
                          <p className="text-gray-600 italic">"{item.customerNotes}"</p>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200/80">
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={`tel:${item.vendorPhone}`}
                            className="bg-[#2B3990] hover:bg-indigo-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{t('callAgain')}</span>
                          </a>

                          <a
                            href={`https://wa.me/91${item.vendorPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                          >
                            <WhatsAppLogo size="sm" />
                            <span>{t('whatsAppAgain')}</span>
                          </a>

                          <button
                            onClick={() => handleRepeatBooking(item)}
                            className="bg-orange-50 hover:bg-orange-100 text-[#F36F21] border border-orange-200 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{t('bookRepeatVisit')}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedRatingItem(item);
                              setRatingStars(item.ratingGiven || 5);
                              setRatingComment(item.customerNotes || '');
                            }}
                            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                            <span>{item.ratingGiven ? 'Update Rating' : t('rateWorker')}</span>
                          </button>

                          <button
                            onClick={() => toggleSaveWorker(item)}
                            className={`p-1.5 rounded-lg border text-xs ${
                              savedWorkers.some((s) => s.vendorId === item.vendorId)
                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900'
                            }`}
                            title="Save/Bookmark Expert"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW 2: SAVED FAVORITE EXPERTS */}
          {customerSubTab === 'saved' && (
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-blue-600" />
                    <span>{t('savedFavoriteWorkers')}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Your bookmarked plumbers, electricians and trusted Kirana stores in Hyderabad.
                  </p>
                </div>
              </div>

              {savedWorkers.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Bookmark className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="font-bold text-gray-700">No favorite workers saved yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedWorkers.map((sw) => (
                    <div key={sw.vendorId} className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={sw.vendorImage}
                            alt={sw.vendorName}
                            className="w-12 h-12 rounded-xl object-cover border"
                          />
                          <div>
                            <h4 className="font-extrabold text-sm text-gray-900">{sw.vendorName}</h4>
                            <p className="text-xs text-gray-500">{sw.vendorCategory} • {sw.vendorNeighborhood}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const updated = savedWorkers.filter((s) => s.vendorId !== sw.vendorId);
                            setSavedWorkers(updated);
                            localStorage.setItem('dialxprt_saved_workers', JSON.stringify(updated));
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t">
                        <a
                          href={`tel:${sw.vendorPhone}`}
                          className="flex-1 bg-[#2B3990] text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{t('callNow')}</span>
                        </a>

                        <a
                          href={`https://wa.me/91${sw.vendorPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-[#25D366] text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <WhatsAppLogo size="sm" />
                          <span>{t('chatWhatsApp')}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW 3: PROFILE DETAILS & COMMUNITY */}
          {customerSubTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 space-y-4">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span>{t('customerAccountTitle')}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">{t('primaryLocation')}</span>
                    <p className="font-black text-gray-900 text-base">{currentNeighborhood}, {t('hyderabad')}</p>
                    <p className="text-xs text-emerald-700">Sorted dynamically by GPS proximity</p>
                  </div>

                  <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-800 uppercase">{t('registeredMobile')}</span>
                    <p className="font-black text-gray-900 text-base">+91 {userPhone || '9849012345'}</p>
                    <p className="text-xs text-indigo-700">Verified via SMS OTP</p>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2">
                    Join DialXprt Community:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100/80 transition-all flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-[#F36F21] text-white shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900">{t('areYouShopOwner')}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">List your Kirana shop or service trade for free.</p>
                        <button
                          onClick={onOpenRegistration}
                          className="mt-2 text-xs font-extrabold text-[#F36F21] hover:underline flex items-center gap-1"
                        >
                          <span>{t('registerShopFree')}</span> →
                        </button>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100/80 transition-all flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-[#2B3990] text-white shrink-0">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900">{t('becomeVolunteer')}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Help verify offline stores in your locality.</p>
                        <button
                          onClick={() => onRoleChange('volunteer')}
                          className="mt-2 text-xs font-extrabold text-[#2B3990] hover:underline flex items-center gap-1"
                        >
                          <span>{t('switchToVolunteer')}</span> →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 space-y-4">
                <h3 className="text-base font-black text-gray-900">{t('needSupport')}</h3>
                <p className="text-xs text-gray-600">
                  Our Hyderabad DialXprt team is available 24/7 on WhatsApp or Phone hotline.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://wa.me/919849012345"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow"
                  >
                    <WhatsAppLogo size="md" />
                    <span>WhatsApp DialXprt Support</span>
                  </a>

                  <a
                    href="tel:+919849012345"
                    className="bg-[#2B3990] hover:bg-indigo-900 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t('callHotline')} +91 9849012345</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RATING & REVIEW MODAL */}
      {selectedRatingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Rate & Review Expert</span>
              </h3>
              <button
                onClick={() => setSelectedRatingItem(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="font-black text-sm text-gray-900">{selectedRatingItem.vendorName}</p>
              <p className="text-xs text-gray-500">{selectedRatingItem.vendorCategory} • {selectedRatingItem.vendorNeighborhood}</p>
            </div>

            <form onSubmit={handleRateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Star Rating:</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRatingStars(s)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          s <= ratingStars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Service Review Comments:</label>
                <textarea
                  rows={3}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Mention how prompt the service was, work quality, pricing..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRatingItem(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2B3990] hover:bg-indigo-900 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm"
                >
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROFILE EDIT MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar border border-gray-200">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto sm:hidden mb-2" />
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-[#2B3990]" />
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
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990] font-bold min-h-[44px]"
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
                    className="flex-1 px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990] font-bold min-h-[44px]"
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
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990] font-bold min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primary Neighborhood in Hyderabad</label>
                <select
                  value={editNeighborhood}
                  onChange={(e) => setEditNeighborhood(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990] font-bold min-h-[44px]"
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
                  className="bg-[#2B3990] hover:bg-indigo-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 min-h-[44px]"
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
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990] font-bold min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Service Category</label>
                  <select
                    value={editCategorySlug}
                    onChange={(e) => setEditCategorySlug(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990] font-bold min-h-[44px]"
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
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990] font-bold min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editShopPhone}
                    onChange={(e) => setEditShopPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990] font-bold min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={editShopWhatsapp}
                    onChange={(e) => setEditShopWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990] font-bold min-h-[44px]"
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
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990] font-bold min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Neighborhood Area</label>
                  <select
                    value={editShopNeighborhood}
                    onChange={(e) => setEditShopNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990] font-bold min-h-[44px]"
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
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B3990] min-h-[44px]"
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
