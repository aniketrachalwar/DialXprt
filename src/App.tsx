import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SearchBar } from './components/SearchBar';
import { VendorCard } from './components/VendorCard';
import { VendorRegistrationModal } from './components/VendorRegistrationModal';
import { AccountView } from './components/AccountView';
import { VendorDetailModal } from './components/VendorDetailModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { FloatingSupportWidget } from './components/FloatingSupportWidget';
import { AuthModal } from './components/AuthModal';
import { NotificationToast } from './components/NotificationToast';

import { Vendor, Category, Neighborhood, UserRole, NotificationItem } from './types';
import { INITIAL_CATEGORIES, HYDERABAD_NEIGHBORHOODS } from './data/mockVendors';
import { AppLanguage, getTranslation } from './lib/translations';
import {
  fetchNearbyVendors,
  registerVendor,
  updateVendorStatus,
  updateVendorDetails,
  trackInteraction,
  calculateDistanceKm,
} from './lib/supabase';
import { CategoryGrid } from './components/CategoryGrid';
import { MapPin, Search, ArrowLeft } from 'lucide-react';

export default function App() {
  // Global Language State
  const [currentLang, setCurrentLang] = useState<AppLanguage>('en');

  // Core Directory State
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);

  // User Geolocation State (Defaulting to Madhapur, Hyderabad)
  const [userLat, setUserLat] = useState<number>(17.4483);
  const [userLng, setUserLng] = useState<number>(78.3915);
  const [currentNeighborhood, setCurrentNeighborhood] = useState<string>('Madhapur');
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState<boolean>(false);

  // Search & Clean 3-Tab Bottom Navigation
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'home' | 'add' | 'account'>('home');

  // Modals
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);

  // Role & User Context
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [userPhone, setUserPhone] = useState<string>('9849012345');
  const [userName, setUserName] = useState<string>('Rahul Sharma');
  const [userEmail, setUserEmail] = useState<string>('rahul.sharma@example.com');

  // Helper for app translations
  const t = (key: string) => getTranslation(currentLang, key);

  const handleUpdateUserProfile = (name: string, phone: string, email: string, neighborhood: string) => {
    setUserName(name);
    setUserPhone(phone);
    setUserEmail(email);
    if (neighborhood) {
      setCurrentNeighborhood(neighborhood);
    }
    addNotification({
      title: 'Profile Updated!',
      message: `Your account details for ${name} have been updated successfully.`,
      type: 'system',
    });
  };

  const handleUpdateVendorDetailsSubmit = (updatedVendor: Vendor) => {
    updateVendorDetails(updatedVendor);
    loadVendors();
    addNotification({
      title: 'Business Details Updated!',
      message: `Listing details for '${updatedVendor.name}' were saved.`,
      type: 'approval',
      storeId: updatedVendor.id,
    });
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out of your session?')) {
      setUserPhone('');
      setUserName('Guest User');
      setUserEmail('');
      setCurrentRole('customer');
      setActiveTab('home');
      setIsAuthModalOpen(true);
    }
  };

  // System Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Welcome to DialXprt Hyderabad!',
      message: 'Find local plumbers, electricians & verified Kirana stores near you instantly.',
      type: 'system',
      createdAt: new Date().toISOString(),
      read: false,
    },
  ]);

  // Load Vendors on Mount & Filter Change
  useEffect(() => {
    loadVendors();
  }, [userLat, userLng, selectedCategory, searchQuery]);

  const loadVendors = async () => {
    setLoading(true);
    try {
      const data = await fetchNearbyVendors(
        userLat,
        userLng,
        selectedCategory,
        searchQuery,
        true // Include pending for volunteer review visibility
      );
      setVendors(data);
    } catch (err) {
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  // HTML5 GPS Auto-Detection
  const handleAutoDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGPS(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLat(latitude);
        setUserLng(longitude);
        setIsAutoDetected(true);
        setIsDetectingGPS(false);

        let closest = HYDERABAD_NEIGHBORHOODS[0];
        let minDist = 999999;
        HYDERABAD_NEIGHBORHOODS.forEach((n) => {
          const dist = calculateDistanceKm(latitude, longitude, n.lat, n.lng);
          if (dist < minDist) {
            minDist = dist;
            closest = n;
          }
        });

        setCurrentNeighborhood(closest.name);

        addNotification({
          title: 'Location Auto-Detected',
          message: `Position centered at ${closest.name}, Hyderabad (${minDist.toFixed(1)} km away).`,
          type: 'system',
        });
      },
      (error) => {
        setIsDetectingGPS(false);
        alert('Location access denied or unavailable. Defaulting to Madhapur, Hyderabad.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSelectNeighborhood = (n: Neighborhood) => {
    setUserLat(n.lat);
    setUserLng(n.lng);
    setCurrentNeighborhood(n.name);
    setIsAutoDetected(false);
  };

  // Business Onboarding Submission
  const handleRegisterVendorSubmit = async (
    vendorData: Omit<
      Vendor,
      'id' | 'slug' | 'createdAt' | 'updatedAt' | 'status' | 'isVerified' | 'rating' | 'reviewsCount' | 'viewsCount' | 'callsCount' | 'whatsappClicksCount'
    >
  ) => {
    const newVendor = await registerVendor(vendorData);
    await loadVendors();

    addNotification({
      title: 'Store Submitted for Verification!',
      message: `Your business '${newVendor.name}' is registered. DialXprt volunteer will verify offline shortly.`,
      type: 'new_store',
      storeId: newVendor.id,
    });
  };

  // Volunteer / Admin Status Action
  const handleUpdateVendorStatus = (
    vendorId: string,
    status: 'approved' | 'pending' | 'rejected',
    volunteerName: string,
    notes: string
  ) => {
    const updated = updateVendorStatus(vendorId, status, volunteerName, notes);
    if (updated) {
      loadVendors();
      if (status === 'approved') {
        addNotification({
          title: 'Store Verified & Live!',
          message: `Store '${updated.name}' was verified by ${volunteerName} and is now live on DialXprt!`,
          type: 'approval',
          storeId: updated.id,
        });
      }
    }
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleCloseNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleTrackCall = (id: string) => {
    trackInteraction(id, 'call');
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, callsCount: (v.callsCount || 0) + 1 } : v))
    );
  };

  const handleTrackWhatsApp = (id: string) => {
    trackInteraction(id, 'whatsapp');
    setVendors((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, whatsappClicksCount: (v.whatsappClicksCount || 0) + 1 } : v
      )
    );
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Owner', 'Phone', 'Neighborhood', 'Status', 'Verified'];
    const rows = vendors.map((v) => [
      v.id,
      `"${v.name}"`,
      `"${v.category}"`,
      `"${v.ownerName}"`,
      v.phone,
      `"${v.neighborhood}"`,
      v.status,
      v.isVerified ? 'Yes' : 'No',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DialXprt_Vendors_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingCount = vendors.filter((v) => v.status === 'pending').length;
  const approvedVendors = vendors.filter((v) => v.status === 'approved');

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-gray-900 font-sans pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-10">
      {/* 1. STICKY TOP HEADER */}
      <Header
        currentNeighborhood={currentNeighborhood}
        isAutoDetected={isAutoDetected}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenAccount={() => setActiveTab('account')}
        onGoHome={() => {
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentRole={currentRole}
        onToggleRole={(role) => {
          setCurrentRole(role);
          setActiveTab('account');
        }}
        unreadNotificationsCount={unreadCount}
        userPhone={userPhone}
        currentLang={currentLang}
        onLanguageChange={(lang) => setCurrentLang(lang)}
      />

      {/* 2. SEARCH & QUICK FILTERS */}
      {activeTab === 'home' && (
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
          vendors={approvedVendors}
          onSelectVendor={(v) => setSelectedVendor(v)}
          onTrackCall={handleTrackCall}
          onTrackWhatsApp={handleTrackWhatsApp}
          totalVendorsCount={approvedVendors.length}
          currentLang={currentLang}
          onLanguageChange={(lang) => setCurrentLang(lang)}
        />
      )}

      {/* MAIN BODY DISPLAY */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
        {/* VIEW 1: ROLE-TAILORED ACCOUNT DASHBOARD */}
        {activeTab === 'account' ? (
          <AccountView
            currentRole={currentRole}
            onRoleChange={(role) => setCurrentRole(role)}
            userPhone={userPhone}
            userName={userName}
            userEmail={userEmail}
            onUpdateUserProfile={handleUpdateUserProfile}
            onUpdateVendorDetails={handleUpdateVendorDetailsSubmit}
            onLogout={handleLogout}
            vendors={vendors}
            categories={categories}
            currentNeighborhood={currentNeighborhood}
            onUpdateVendorStatus={handleUpdateVendorStatus}
            onOpenRegistration={() => setIsRegistrationOpen(true)}
            onExportCSV={handleExportCSV}
            onSelectVendor={(vendor) => setSelectedVendor(vendor)}
            currentLang={currentLang}
          />
        ) : (
          /* VIEW 2: PUBLIC DIRECTORY HOMEPAGE GRID */
          <div className="space-y-6">
            {selectedCategory === 'all' && searchQuery === '' ? (
              /* ALL SERVICES CATEGORIES GRID (PRIMARY LANDING VIEW) */
              <CategoryGrid
                categories={categories}
                onSelectCategory={(slug) => setSelectedCategory(slug)}
                currentNeighborhood={currentNeighborhood}
                currentLang={currentLang}
              />
            ) : (
              /* SPECIFIC CATEGORY / SEARCH RESULTS VIEW - SORTED BY PROXIMITY */
              <div className="space-y-5 animate-fade-in">
                {/* Location & Category Results Header Bar with Back Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                      className="p-2.5 bg-gray-100 hover:bg-[#2B3990] hover:text-white text-gray-700 rounded-xl transition-all shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center font-bold"
                      title="Back to All Services Grid"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F36F21] bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                          {selectedCategory !== 'all'
                            ? categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory
                            : 'Search Results'}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#F36F21]" /> {currentNeighborhood}, Hyderabad
                        </span>
                      </div>

                      <h2 className="font-extrabold text-base sm:text-lg text-gray-900 mt-0.5">
                        {selectedCategory !== 'all'
                          ? `Nearest ${categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory} Experts`
                          : `Search results for "${searchQuery}"`}
                      </h2>

                      <p className="text-xs text-indigo-900 font-semibold mt-0.5 flex items-center gap-1">
                        <span>📍 Sorted by nearest distance first in sequence</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3.5 py-2 rounded-xl text-xs transition-all min-h-[44px]"
                    >
                      ← All Services
                    </button>

                    <button
                      onClick={() => setIsRegistrationOpen(true)}
                      className="bg-[#F36F21] hover:bg-orange-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all min-h-[44px]"
                    >
                      <span>+ {t('addBusiness')}</span>
                    </button>
                  </div>
                </div>

                {/* Vendor Cards Grid */}
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border p-4 space-y-3">
                        <div className="bg-gray-200 h-40 rounded-xl w-full"></div>
                        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                        <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                        <div className="bg-gray-200 h-10 rounded-xl w-full mt-4"></div>
                      </div>
                    ))}
                  </div>
                ) : approvedVendors.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center space-y-3 max-w-lg mx-auto shadow-sm">
                    <Search className="w-12 h-12 text-[#F36F21] mx-auto" />
                    <h3 className="text-lg font-bold text-gray-900">{t('noVerifiedExpertsTitle')}</h3>
                    <p className="text-xs text-gray-500">
                      {t('noMatchingListingsMsg')}
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="bg-[#2B3990] text-white font-bold px-4 py-2.5 rounded-xl text-xs min-h-[44px]"
                    >
                      {t('clearFiltersShowAll')}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
                    {approvedVendors.map((vendor) => (
                      <VendorCard
                        key={vendor.id}
                        vendor={vendor}
                        onSelectVendor={(v) => setSelectedVendor(v)}
                        onTrackCall={handleTrackCall}
                        onTrackWhatsApp={handleTrackWhatsApp}
                        currentLang={currentLang}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. CLEAN 3-TAB BOTTOM NAVIGATION BAR */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'add') {
            setIsRegistrationOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        currentRole={currentRole}
        pendingCount={pendingCount}
        currentLang={currentLang}
      />

      {/* 4. FLOATING SUPPORT WIDGET */}
      <FloatingSupportWidget currentLang={currentLang} />

      {/* 5. MODALS */}
      <VendorRegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        categories={categories}
        userLat={userLat}
        userLng={userLng}
        currentNeighborhood={currentNeighborhood}
        onSubmit={handleRegisterVendorSubmit}
        currentLang={currentLang}
      />

      <VendorDetailModal
        vendor={selectedVendor}
        onClose={() => setSelectedVendor(null)}
        onTrackCall={handleTrackCall}
        onTrackWhatsApp={handleTrackWhatsApp}
        currentLang={currentLang}
      />

      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentNeighborhood={currentNeighborhood}
        onSelectNeighborhood={handleSelectNeighborhood}
        onAutoDetectGPS={handleAutoDetectGPS}
        isDetecting={isDetectingGPS}
        currentLang={currentLang}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(phone, role) => {
          setUserPhone(phone);
          setCurrentRole(role);
          setActiveTab('account');
        }}
        currentLang={currentLang}
      />

      <NotificationToast
        notifications={notifications}
        onCloseNotification={handleCloseNotification}
        isOpenModal={isNotificationsModalOpen}
        onCloseModal={() => setIsNotificationsModalOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}
