import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SEOHead } from "./components/SEOHead";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { SearchBar } from "./components/SearchBar";
import { VendorCard } from "./components/VendorCard";
import { VendorRegistrationModal } from "./components/VendorRegistrationModal";
import { B2BView } from "./components/B2BView";
import { LocationPickerModal } from "./components/LocationPickerModal";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { SidebarPages } from "./components/SidebarPages";
import { LanguageModal } from "./components/LanguageModal";
import { AdminPanelView } from "./components/AdminPanelView";
import { StaticPage } from "./components/StaticPages";
import { VendorProfilePage } from "./components/VendorProfilePage";
import { LocationModal } from "./components/LocationModal";
import { FloatingSupportWidget } from "./components/FloatingSupportWidget";
import { AuthModal } from "./components/AuthModal";
import { NotificationsModal } from "./components/NotificationsModal";
import { NotificationToast } from "./components/NotificationToast";
import { Footer } from "./components/Footer";
import { RightStickyBar } from "./components/RightStickyBar";

import {
  Vendor,
  Category,
  Neighborhood,
  UserRole,
  NotificationItem,
} from "./types";
import {
  INITIAL_CATEGORIES,
  HYDERABAD_NEIGHBORHOODS,
} from "./data/mockVendors";
import { AppLanguage, getTranslation } from "./lib/translations";
import {
  fetchNearbyVendors,
  registerVendor,
  updateVendorStatus,
  updateVendorDetails,
  trackInteraction,
  calculateDistanceKm,
  supabase,
} from "./lib/supabase";
import { fetchCategories } from "./lib/adminApi";
import { HomeDashboard } from "./components/HomeDashboard";
import { SubCategoryView } from "./components/SubCategoryView";
import { MapPin, Search, ArrowLeft } from "lucide-react";

export default function App() {
  // Global Language State
  const [currentLang, setCurrentLang] = useState<AppLanguage>("en");
  // Helper for app translations
  const t = (key: string) => getTranslation(currentLang, key);

  // Core Directory State
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);

  // User Geolocation State (Defaulting to Madhapur, Hyderabad)
  const [userLat, setUserLat] = useState<number>(17.4483);
  const [userLng, setUserLng] = useState<number>(78.3915);
  const [currentNeighborhood, setCurrentNeighborhood] =
    useState<string>("Madhapur");
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState<boolean>(false);

  // Search & Clean 3-Tab Bottom Navigation
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    | "home"
    | "add"
    | "account"
    | "favorites"
    | "saved"
    | "transactions"
    | "customer_service"
    | "investor_relations"
    | "policy"
    | "feedback"
    | "help"
  >("home");

  // UI/UX Filter & Sort State
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "popular">(
    "distance",
  );
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  // Router hooks for SEO URLs
  const location = useLocation();
  const navigate = useNavigate();
  const [staticRoute, setStaticRoute] = useState<string | null>(null);
  const [selectedVendorSlug, setSelectedVendorSlug] = useState<string | null>(null);

  // Role & User Context
  const [currentRole, setCurrentRole] = useState<UserRole>("customer");
  const [userPhone, setUserPhone] = useState<string>("");
  const [userName, setUserName] = useState<string>("Guest User");
  const [userEmail, setUserEmail] = useState<string>("");

  const handleOpenRegistration = () => {
    if (!userPhone && !userEmail) {
      setIsAuthModalOpen(true);
    } else {
      setIsRegistrationOpen(true);
    }
  };

  // URL State Synchronization
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCategory, selectedSubCategory, activeTab, staticRoute, selectedVendorSlug]);

  useEffect(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length >= 2 && parts[0] === "hyderabad") {
      setStaticRoute(null);
      setSelectedVendorSlug(null);
      const decodedNeighborhood = decodeURIComponent(parts[1]);

      const foundNeighborhood = HYDERABAD_NEIGHBORHOODS.find(
        (n) => n.name.toLowerCase() === decodedNeighborhood.toLowerCase(),
      );

      if (foundNeighborhood && currentNeighborhood !== foundNeighborhood.name) {
        setCurrentNeighborhood(foundNeighborhood.name);
        setUserLat(foundNeighborhood.lat);
        setUserLng(foundNeighborhood.lng);
      }

      if (parts.length >= 3) {
        const decodedCategory = decodeURIComponent(parts[2]);
        if (selectedCategory !== decodedCategory) {
          setSelectedCategory(decodedCategory);
        }
      }
    } else if (parts.length >= 2 && parts[0] === 'expert') {
      setSelectedVendorSlug(decodeURIComponent(parts[1]));
      setStaticRoute(null);
    } else if (parts.length === 1 && ['about', 'investor-relations', 'careers', 'contact', 'free-listing', 'privacy', 'terms', 'b2b'].includes(parts[0])) {
      setSelectedVendorSlug(null);
      if (parts[0] === 'b2b') {
        setActiveTab('account');
      } else if (parts[0] === 'free-listing') {
        handleOpenRegistration();
        navigate('/');
      } else {
        setStaticRoute(parts[0]);
      }
    } else if (parts.length === 0 || location.pathname === '/') {
      setStaticRoute(null);
      setSelectedVendorSlug(null);
    }
  }, [location.pathname]);

  // Update URL when state changes
  useEffect(() => {
    if (currentNeighborhood && selectedCategory && selectedCategory !== "all") {
      const newPath = `/hyderabad/${encodeURIComponent(currentNeighborhood.toLowerCase())}/${encodeURIComponent(selectedCategory)}`;
      if (location.pathname !== newPath) {
        navigate(newPath, { replace: true });
      }
    }
  }, [currentNeighborhood, selectedCategory]);

  // Dynamic SEO Service Name
  const serviceName = useMemo(() => {
    if (searchQuery) return searchQuery;
    if (selectedCategory !== "all") {
      const cat = INITIAL_CATEGORIES.find((c) => c.slug === selectedCategory);
      return cat ? getTranslation(currentLang, cat.name) : selectedCategory;
    }
    return t("services");
  }, [searchQuery, selectedCategory, currentLang]);

  // Modals
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] =
    useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState<boolean>(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] =
    useState<boolean>(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Scroll listener for sticky search bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync with Supabase Auth Session
  useEffect(() => {
    if (!supabase) {
      console.warn("Supabase client not initialized. Auth sync disabled.");
      return;
    }

    // Get initial session on load
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting Supabase session:", error);
      }
      if (session?.user) {
        console.log(
          "Active Supabase session found on load for:",
          session.user.email,
        );
        setUserEmail(session.user.email || "");
        setUserPhone(session.user.phone || session.user.email || "");
        setUserName(
          session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0] ||
            "User",
        );
        if (session.user.email === "aniketrachalwar073@gmail.com") {
          setCurrentRole("admin");
        }
      }
    });

    // Listen for auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Supabase Auth Event:", event);
      if (session?.user) {
        setUserEmail(session.user.email || "");
        setUserPhone(session.user.phone || session.user.email || "");
        setUserName(
          session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0] ||
            "User",
        );
        if (session.user.email === "aniketrachalwar073@gmail.com") {
          setCurrentRole("admin");
        } else {
          setCurrentRole("customer"); // reset if different user logs in
        }
      } else {
        setUserEmail("");
        setUserPhone("");
        setUserName("Guest User");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUpdateUserProfile = (
    name: string,
    phone: string,
    email: string,
    neighborhood: string,
  ) => {
    setUserName(name);
    setUserPhone(phone);
    setUserEmail(email);
    if (neighborhood) {
      setCurrentNeighborhood(neighborhood);
    }
    addNotification({
      title: "Profile Updated!",
      message: `Your account details for ${name} have been updated successfully.`,
      type: "system",
    });
  };

  const handleUpdateVendorDetailsSubmit = (updatedVendor: Vendor) => {
    updateVendorDetails(updatedVendor);
    loadVendors();
    addNotification({
      title: "Business Details Updated!",
      message: `Listing details for '${updatedVendor.name}' were saved.`,
      type: "approval",
      storeId: updatedVendor.id,
    });
  };

  const handleLogout = async () => {
    setUserPhone("");
    setUserName("Guest User");
    setUserEmail("");
    setCurrentRole("customer");
    setActiveTab("home");
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Supabase logout error:", err);
      }
    }
  };

  // System Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n1",
      title: "Welcome to DialXprt Hyderabad!",
      message:
        "Find local plumbers, electricians & verified Kirana stores near you instantly.",
      type: "system",
      createdAt: new Date().toISOString(),
      read: false,
    },
  ]);

  // Load Vendors on Mount & Filter Change
  useEffect(() => {
    loadData();
  }, [userLat, userLng, selectedCategory, selectedSubCategory, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchNearbyVendors(
        userLat,
        userLng,
        selectedCategory,
        searchQuery,
        true, // Include pending for volunteer review visibility
        selectedSubCategory
      );
      setVendors(data);
      
      const dynamicCats = await fetchCategories();
      setCategories(dynamicCats);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  // HTML5 GPS Auto-Detection
  const handleAutoDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
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
          title: "Location Auto-Detected",
          message: `Position centered at ${closest.name}, Hyderabad (${minDist.toFixed(1)} km away).`,
          type: "system",
        });
      },
      (error) => {
        setIsDetectingGPS(false);
        alert(
          "Location access denied or unavailable. Defaulting to Madhapur, Hyderabad.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // Auto-detect on initial load if not already detected
  useEffect(() => {
    if (!isAutoDetected && navigator.geolocation) {
      handleAutoDetectGPS();
    }
  }, []);

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
      | "id"
      | "slug"
      | "createdAt"
      | "updatedAt"
      | "status"
      | "isVerified"
      | "rating"
      | "reviewsCount"
      | "viewsCount"
      | "callsCount"
      | "whatsappClicksCount"
    >,
  ) => {
    const newVendor = await registerVendor(vendorData);
    await loadVendors();

    addNotification({
      title: "Store Submitted for Verification!",
      message: `Your business '${newVendor.name}' is registered. DialXprt volunteer will verify offline shortly.`,
      type: "new_store",
      storeId: newVendor.id,
    });
  };

  // Volunteer / Admin Status Action
  const handleUpdateVendorStatus = (
    vendorId: string,
    status: "approved" | "pending" | "rejected",
    volunteerName: string,
    notes: string,
  ) => {
    const updated = updateVendorStatus(vendorId, status, volunteerName, notes);
    if (updated) {
      loadVendors();
      if (status === "approved") {
        addNotification({
          title: "Store Verified & Live!",
          message: `Store '${updated.name}' was verified by ${volunteerName} and is now live on DialXprt!`,
          type: "approval",
          storeId: updated.id,
        });
      }
    }
  };

  const addNotification = (
    item: Omit<NotificationItem, "id" | "createdAt" | "read">,
  ) => {
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
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleTrackCall = (id: string) => {
    trackInteraction(id, "call");
    setVendors((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, callsCount: (v.callsCount || 0) + 1 } : v,
      ),
    );
  };

  const handleTrackWhatsApp = (id: string) => {
    trackInteraction(id, "whatsapp");
    setVendors((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, whatsappClicksCount: (v.whatsappClicksCount || 0) + 1 }
          : v,
      ),
    );
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Category",
      "Owner",
      "Phone",
      "Neighborhood",
      "Status",
      "Verified",
    ];
    const rows = vendors.map((v) => [
      v.id,
      `"${v.name}"`,
      `"${v.category}"`,
      `"${v.ownerName}"`,
      v.phone,
      `"${v.neighborhood}"`,
      v.status,
      v.isVerified ? "Yes" : "No",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DialXprt_Vendors_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingCount = vendors.filter((v) => v.status === "pending").length;

  const processedVendors = useMemo(() => {
    let result = vendors.filter((v) => v.status === "approved");

    // UI Filters
    if (verifiedOnly) {
      result = result.filter((v) => v.isVerified);
    }
    if (openNowOnly) {
      // Mock open now logic (just an example, maybe limit to those with > 4 rating to simulate "open")
      // In a real app this would check current time vs operating hours
      result = result.filter((v) => (v.rating || 4.5) > 4.2);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "distance")
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "popular")
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      return 0;
    });

    return result;
  }, [vendors, verifiedOnly, openNowOnly, sortBy]);

  const approvedVendors = processedVendors;

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-gray-900 font-sans pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-10">
      <SEOHead
        title={
          selectedCategory === "all" && !searchQuery
            ? "DialXprt - Local Service Experts in Hyderabad"
            : `Best ${serviceName} in ${currentNeighborhood}, Hyderabad | DialXprt`
        }
        description={`Find the best ${serviceName} in ${currentNeighborhood}. Get quotes, chat on WhatsApp, or call now.`}
      />
      {/* 1. STICKY TOP HEADER */}
      <Header
        currentNeighborhood={currentNeighborhood}
        isAutoDetected={isAutoDetected}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenRegistration={handleOpenRegistration}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenAccount={() => {
          if (!userPhone) {
            setIsAuthModalOpen(true);
          } else {
            setIsProfileSidebarOpen(true);
          }
        }}
        onOpenLanguage={() => setIsLangModalOpen(true)}
        onGoHome={() => {
          setActiveTab("home");
          setSearchQuery("");
          setSelectedCategory("all");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        currentRole={currentRole}
        onToggleRole={(role) => {
          setCurrentRole(role);
          setActiveTab("account");
        }}
        unreadNotificationsCount={unreadCount}
        userPhone={userPhone}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        renderCompactSearch={undefined}
      >
        {activeTab === "home" && (
          <div className="space-y-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categories={categories}
              vendors={approvedVendors}
              onSelectVendor={(v) => navigate(`/expert/${v.slug}`)}
              onTrackCall={handleTrackCall}
              onTrackWhatsApp={handleTrackWhatsApp}
              totalVendorsCount={approvedVendors.length}
              currentLang={currentLang}
              onLanguageChange={(lang) => setCurrentLang(lang)}
              currentNeighborhood={currentNeighborhood}
              onOpenLocation={() => setIsLocationModalOpen(true)}
            />

          </div>
        )}
      </Header>


      {/* MAIN BODY DISPLAY */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
        {/* VIEW 1: ROLE-TAILORED ACCOUNT DASHBOARD */}
        {selectedVendorSlug ? (
          <VendorProfilePage
            vendor={vendors.find((v) => v.slug === selectedVendorSlug) || null}
            onTrackCall={handleTrackCall}
            onTrackWhatsApp={handleTrackWhatsApp}
            currentLang={currentLang}
          />
        ) : staticRoute ? (
          <StaticPage route={staticRoute} />
        ) : activeTab === "account" ? (
          <B2BView />
        ) : activeTab === "admin" ? (
          <AdminPanelView />
        ) : ["favorites", "saved", "transactions", "customer_service", "investor_relations", "policy", "feedback", "help"].includes(activeTab) ? (
          <SidebarPages activeTab={activeTab} onBack={() => setActiveTab("home")} />
        ) : (
          /* VIEW 2: PUBLIC DIRECTORY HOMEPAGE GRID */
          <div className="space-y-6">
            {selectedCategory === "all" && searchQuery === "" ? (
              /* HOME DASHBOARD WITH PROMO & QUICK FILTERS */
              <HomeDashboard
                categories={categories}
                onSelectCategory={(slug) => {
                  if (slug === 'b2b') {
                    setActiveTab('account');
                  } else {
                    setSelectedCategory(slug);
                    setSelectedSubCategory(null);
                  }
                }}
                onSearchQuery={(q) => setSearchQuery(q)}
                currentLang={currentLang}
              />
            ) : selectedCategory !== "all" && !selectedSubCategory && searchQuery === "" ? (
              /* SUBCATEGORY SELECTION VIEW */
              <SubCategoryView 
                category={categories.find(c => c.slug === selectedCategory) || categories[0]}
                currentNeighborhood={currentNeighborhood}
                onSelectSubCategory={(slug) => setSelectedSubCategory(slug)}
                onBack={() => {
                  setSelectedCategory("all");
                  setSelectedSubCategory(null);
                }}
              />
            ) : (
              /* SPECIFIC CATEGORY / SEARCH RESULTS VIEW - SORTED BY PROXIMITY */
              <div className="space-y-4 animate-fade-in">
                {/* Location & Category Results Header Bar */}
                <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (searchQuery) {
                          setSelectedCategory("all");
                          setSelectedSubCategory(null);
                          setSearchQuery("");
                        } else {
                          setSelectedSubCategory(null);
                        }
                      }}
                      className="p-2.5 bg-gray-100 hover:bg-[#1A9E9E] hover:text-white text-gray-700 rounded-xl transition-all shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center font-bold"
                      title={searchQuery ? "Back to All Services Grid" : "Back to Subcategories"}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F36F21] bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                          {selectedCategory !== "all"
                            ? categories.find(
                                (c) => c.slug === selectedCategory,
                              )?.name || selectedCategory
                            : "Search Results"}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#F36F21]" />{" "}
                          {currentNeighborhood}, Hyderabad
                        </span>
                      </div>

                      <h1 className="font-extrabold text-base sm:text-lg text-gray-900 mt-0.5">
                        {selectedCategory !== "all"
                          ? `Nearest ${categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory} Experts`
                          : `Search results for "${searchQuery}"`}
                      </h1>
                    </div>
                  </div>

                  {/* Filter & Sort Toolbar */}
                  <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pt-2 border-t border-gray-100">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#1A9E9E] shrink-0"
                    >
                      <option value="distance">Sort by: Distance</option>
                      <option value="rating">Sort by: Rating</option>
                      <option value="popular">Sort by: Popularity</option>
                    </select>

                    <button
                      onClick={() => setOpenNowOnly(!openNowOnly)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 transition-colors border ${
                        openNowOnly
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${openNowOnly ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                      ></span>
                      Open Now
                    </button>

                    <button
                      onClick={() => setVerifiedOnly(!verifiedOnly)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors border ${
                        verifiedOnly
                          ? "bg-[#1A9E9E]/10 border-[#1A9E9E]/30 text-[#1A9E9E]"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      ✓ Verified
                    </button>

                    <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50 shrink-0 flex items-center gap-1 ml-auto">
                      Filter
                    </button>
                  </div>
                </div>

                {/* Vendor Cards Grid */}
                {loading ? (
                  <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl h-48 animate-pulse border p-4 flex gap-4"
                      >
                        <div className="bg-gray-200 h-full w-32 sm:w-40 rounded-xl shrink-0"></div>
                        <div className="flex-1 space-y-3 pt-2">
                          <div className="bg-gray-200 h-6 rounded w-3/4"></div>
                          <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                          <div className="bg-gray-200 h-10 rounded-xl w-full mt-auto"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : approvedVendors.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center space-y-3 max-w-lg mx-auto shadow-sm">
                    <Search className="w-12 h-12 text-[#F36F21] mx-auto" />
                    <h3 className="text-lg font-bold text-gray-900">
                      {t("noVerifiedExpertsTitle")}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {t("noMatchingListingsMsg")}
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}
                      className="bg-[#1A9E9E] text-white font-bold px-4 py-2.5 rounded-xl text-xs min-h-[44px]"
                    >
                      {t("clearFiltersShowAll")}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 sm:gap-5 max-w-4xl mx-auto w-full">
                    {approvedVendors.map((vendor) => (
                      <VendorCard
                        key={vendor.id}
                        vendor={vendor}
                        onSelectVendor={(v) => navigate(`/expert/${v.slug}`)}
                        onGetBestDeal={(v) => {
                          const waMessage = encodeURIComponent(
                            `Hi ${v.ownerName}, I'd like to get a quote for ${v.category} services.`,
                          );
                          window.open(
                            `https://wa.me/${v.whatsapp}?text=${waMessage}`,
                            "_blank",
                          );
                        }}
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

        <Footer />
      </main>

      {/* 3. CLEAN 3-TAB BOTTOM NAVIGATION BAR */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "add") {
            handleOpenRegistration();
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

      {/* 4.5 RIGHT STICKY ACTION BAR */}
      <RightStickyBar onOpenRegistration={handleOpenRegistration} />

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
          setActiveTab("account");
        }}
      />

      <NotificationToast
        notifications={notifications}
        onCloseNotification={handleCloseNotification}
        isOpenModal={isNotificationsModalOpen}
        onCloseModal={() => setIsNotificationsModalOpen(false)}
        currentLang={currentLang}
      />

      <ProfileSidebar
        isOpen={isProfileSidebarOpen}
        onClose={() => setIsProfileSidebarOpen(false)}
        userName={userName}
        onLogout={handleLogout}
        onEditProfile={() => {
          setActiveTab('account');
        }}
        onChangeLanguage={() => setIsLangModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onNavigate={(tab: any) => setActiveTab(tab)}
        isAdmin={currentRole === 'admin'}
      />

      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
      />
    </div>
  );
}
