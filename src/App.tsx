import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SEOHead } from "./components/SEOHead";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { SearchBar } from "./components/SearchBar";
import { VendorCard } from "./components/VendorCard";
import { LocationPickerModal } from "./components/LocationPickerModal";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { SidebarPages } from "./components/SidebarPages";
import { LanguageModal } from "./components/LanguageModal";
import { StaticPage } from "./components/StaticPages";
import { FloatingSupportWidget } from "./components/FloatingSupportWidget";
import { AuthModal } from "./components/AuthModal";
import { NotificationToast } from "./components/NotificationToast";
import { Footer } from "./components/Footer";
import { RightStickyBar } from "./components/RightStickyBar";
import { fetchUserRoles } from "./lib/adminApi";

import {
  Vendor,
  Category,
  Neighborhood,
  UserRole,
  NotificationItem,
  Collection,
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
  deleteVendor,
  supabase,
} from "./lib/supabase";
import { calculateDistanceKm } from "./lib/geo";
import { fetchCategories } from "./lib/adminApi";
import { HomeDashboard } from "./components/HomeDashboard";
import { CollectionsModal } from "./components/CollectionsModal";
import { MapPin, Search, ArrowLeft, ChevronDown, Zap, Wrench, Car, Hammer, Snowflake } from "lucide-react";

import { LoadingSpinner } from "./components/LoadingSpinner";

// Lazy-loaded views
const VendorRegistrationView = React.lazy(() => import('./components/VendorRegistrationView').then(m => ({ default: m.VendorRegistrationView })));
const AccountView = React.lazy(() => import('./components/AccountView').then(m => ({ default: m.AccountView })));
const UserProfileEditView = React.lazy(() => import('./components/UserProfileEditView').then(m => ({ default: m.UserProfileEditView })));
const AdminPanelView = React.lazy(() => import('./components/AdminPanelView').then(m => ({ default: m.AdminPanelView })));
const VendorProfilePage = React.lazy(() => import('./components/VendorProfilePage').then(m => ({ default: m.VendorProfilePage })));
const AllCategoriesView = React.lazy(() => import('./components/AllCategoriesView').then(m => ({ default: m.AllCategoriesView })));
const FavoritesView = React.lazy(() => import('./components/FavoritesView').then(m => ({ default: m.FavoritesView })));
const SavedCollectionsView = React.lazy(() => import('./components/SavedCollectionsView').then(m => ({ default: m.SavedCollectionsView })));
const CustomerServiceView = React.lazy(() => import('./components/CustomerServiceView').then(m => ({ default: m.CustomerServiceView })));
const PolicyView = React.lazy(() => import('./components/PolicyView').then(m => ({ default: m.PolicyView })));
const FeedbackView = React.lazy(() => import('./components/FeedbackView').then(m => ({ default: m.FeedbackView })));
const HelpCenterView = React.lazy(() => import('./components/HelpCenterView').then(m => ({ default: m.HelpCenterView })));
const SubCategoryView = React.lazy(() => import('./components/SubCategoryView').then(m => ({ default: m.SubCategoryView })));
const OffersView = React.lazy(() => import('./components/OffersView').then(m => ({ default: m.OffersView })));

const CATEGORY_BANNERS: Record<string, { imageUrl: string; title: string; subtitle: string }> = {
  'gym': {
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200',
    title: 'Transform Your Body Today',
    subtitle: 'Get 50% off on premium annual gym memberships.'
  },
  'mechanic': {
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1200',
    title: 'Expert Auto Care',
    subtitle: 'Trusted mechanics for all your car and bike repair needs.'
  },
  'plumber': {
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=1200',
    title: '24/7 Emergency Plumbing',
    subtitle: 'Fast and reliable plumbing services at your doorstep.'
  },
  'electrician': {
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200',
    title: 'Safe Electrical Repairs',
    subtitle: 'Certified electricians for homes and businesses.'
  }
};

export default function App() {
  // Global Language State
  const switchGoogleTranslate = (lang: string) => {
    try {
      const domain = window.location.hostname;
      if (lang === 'en') {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; path=/;`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      } else {
        document.cookie = `googtrans=/en/${lang}; domain=${domain}; path=/`;
        document.cookie = `googtrans=/en/${lang}; path=/`;
      }
      
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = lang === 'en' ? 'en' : lang;
        select.dispatchEvent(new Event('change'));
      }
      if (lang === 'en') {
        // Force reload to completely remove Google Translate spans if switching back to English
        setTimeout(() => window.location.reload(), 300);
      }
    } catch (e) {
      console.error("Failed to switch Google Translate language", e);
    }
  };

  const [currentLang, setCurrentLang] = useState<AppLanguage>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem('dialxprt_lang') as AppLanguage;
    if (savedLang) {
      setCurrentLang(savedLang);
      if (savedLang !== 'en') {
        switchGoogleTranslate(savedLang);
      }
    } else {
      setCurrentLang('en');
    }
  }, []);

  const handleLanguageChange = (lang: AppLanguage) => {
    setCurrentLang(lang);
    localStorage.setItem('dialxprt_lang', lang);
    switchGoogleTranslate(lang);
  };

  // Helper for app translations
  const t = (key: string) => getTranslation(currentLang, key);

  // Core Directory State
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);

  // User Geolocation State (Defaulting to Madhapur, Hyderabad)
  const [userLat, setUserLat] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dialxprt_selected_location_v1');
      if (saved) return JSON.parse(saved).lat || 17.4483;
    } catch (_) {}
    return 17.4483;
  });
  const [userLng, setUserLng] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dialxprt_selected_location_v1');
      if (saved) return JSON.parse(saved).lng || 78.3915;
    } catch (_) {}
    return 78.3915;
  });
  const [currentNeighborhood, setCurrentNeighborhood] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dialxprt_selected_location_v1');
      if (saved) return JSON.parse(saved).name || "Madhapur";
    } catch (_) {}
    return "Madhapur";
  });
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState<boolean>(false);

  // Search & Clean 3-Tab Bottom Navigation
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(() => sessionStorage.getItem('selectedCategory') || "all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(() => sessionStorage.getItem('selectedSubCategory') || null);
  const [activeTab, setActiveTab] = useState<any>(() => sessionStorage.getItem('activeTab') || "home");
  const isInitialMount = useRef(true);

  useEffect(() => {
    sessionStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    sessionStorage.setItem('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubCategory) {
      sessionStorage.setItem('selectedSubCategory', selectedSubCategory);
    } else {
      sessionStorage.removeItem('selectedSubCategory');
    }
  }, [selectedSubCategory]);

  // UI/UX Filter & Sort State
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "popular">(
    "distance",
  );
  const [searchRadius, setSearchRadius] = useState<number>(5);
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  // Router hooks for SEO URLs
  const location = useLocation();
  const navigate = useNavigate();
  const [staticRoute, setStaticRoute] = useState<string | null>(null);
  const [selectedVendorSlug, setSelectedVendorSlug] = useState<string | null>(null);

  // Role & User Context
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('dialxprt_mock_session_v1');
      if (saved) return JSON.parse(saved).currentRole || "customer";
    } catch (_) {}
    return "customer";
  });
  const [userPhone, setUserPhone] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dialxprt_mock_session_v1');
      if (saved) return JSON.parse(saved).userPhone || "";
    } catch (_) {}
    return "";
  });
  const [userName, setUserName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dialxprt_mock_session_v1');
      if (saved) return JSON.parse(saved).userName || "Guest User";
    } catch (_) {}
    return "Guest User";
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dialxprt_mock_session_v1');
      if (saved) return JSON.parse(saved).userEmail || "";
    } catch (_) {}
    return "";
  });
  const [userAvatar, setUserAvatar] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dialxprt_mock_session_v1');
      if (saved) return JSON.parse(saved).userAvatar || "";
    } catch (_) {}
    return "";
  });
  const [selectedVendorToEdit, setSelectedVendorToEdit] = useState<Vendor | null>(null);
  
  // Favorites State
  const [favoriteVendorIds, setFavoriteVendorIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('dialxprt_favorites_v1');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Collections State
  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      const stored = localStorage.getItem('dialxprt_collections_v1');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  
  // Collections Modal State
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);
  const [vendorForCollection, setVendorForCollection] = useState<string | null>(null);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleOpenRegistration = () => {
    setActiveTab("register-vendor");
  };

  // URL State Synchronization
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCategory, selectedSubCategory, activeTab, staticRoute, selectedVendorSlug]);

  useEffect(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length >= 1 && parts[0] === "hyderabad") {
      setStaticRoute(null);
      setSelectedVendorSlug(null);
      setActiveTab("home");
      
      if (parts.length >= 2) {
        const decodedNeighborhood = decodeURIComponent(parts[1]);
        const foundNeighborhood = HYDERABAD_NEIGHBORHOODS.find(
          (n) => n.name.toLowerCase() === decodedNeighborhood.toLowerCase(),
        );

        if (foundNeighborhood && currentNeighborhood !== foundNeighborhood.name) {
          setCurrentNeighborhood(foundNeighborhood.name);
          setUserLat(foundNeighborhood.lat);
          setUserLng(foundNeighborhood.lng);
        }
      } else {
        // Defaults for /hyderabad/
        setCurrentNeighborhood("Madhapur");
        const found = HYDERABAD_NEIGHBORHOODS.find(n => n.name === "Madhapur");
        if (found) {
          setUserLat(found.lat);
          setUserLng(found.lng);
        }
      }

      if (parts.length >= 3) {
        const decodedCategory = decodeURIComponent(parts[2]);
        if (selectedCategory !== decodedCategory) {
          setSelectedCategory(decodedCategory);
        }
      } else {
        if (selectedCategory !== "all") {
          setSelectedCategory("all");
        }
      }
    } else if (parts.length >= 2 && parts[0] === 'expert') {
      setSelectedVendorSlug(decodeURIComponent(parts[1]));
      setStaticRoute(null);
      setActiveTab("home");
    } else if (parts.length === 1 && ['about', 'investor-relations', 'careers', 'contact', 'privacy', 'terms'].includes(parts[0])) {
      setSelectedVendorSlug(null);
      setStaticRoute(parts[0]);
    } else if (parts.length === 1 && parts[0] === 'list-business') {
      setStaticRoute(null);
      setSelectedVendorSlug(null);
      setActiveTab("register-vendor");
    } else if (parts.length === 1 && ['account', 'categories', 'offers', 'admin'].includes(parts[0])) {
      setStaticRoute(null);
      setSelectedVendorSlug(null);
      if (parts[0] === 'categories') setActiveTab('all-categories');
      else setActiveTab(parts[0] as any);
    } else if (parts.length === 0 || location.pathname === '/') {
      setStaticRoute(null);
      setSelectedVendorSlug(null);
      
      const savedTab = sessionStorage.getItem('activeTab');
      const savedCategory = sessionStorage.getItem('selectedCategory');
      
      // Only restore internal non-routed tabs from session, otherwise use home
      if (savedTab && !['home', 'register-vendor', 'account', 'all-categories', 'offers', 'admin'].includes(savedTab)) {
        setActiveTab(savedTab as any);
        if (savedCategory) setSelectedCategory(savedCategory);
      } else {
        setSelectedCategory("all");
        setActiveTab("home");
      }
    }
  }, [location.pathname]);

  // Update URL when state changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const isExpertRoute = location.pathname.startsWith('/expert/');
    const isStaticRoute = ['/about', '/contact', '/careers', '/investor-relations', '/privacy', '/terms'].includes(location.pathname);
    const isKnownTabRoute = ['/list-business', '/account', '/categories', '/offers', '/admin'].includes(location.pathname);
    
    if (activeTab === 'home' && !staticRoute && !selectedVendorSlug && !isExpertRoute && !isStaticRoute && !isKnownTabRoute) {
      if (currentNeighborhood && selectedCategory && selectedCategory !== "all") {
        const newPath = `/hyderabad/${encodeURIComponent(currentNeighborhood.toLowerCase())}/${encodeURIComponent(selectedCategory)}`;
        if (location.pathname !== newPath) {
          navigate(newPath);
        }
      } else if (selectedCategory === "all" && location.pathname !== "/" && !location.pathname.startsWith("/hyderabad")) {
        navigate("/");
      }
    } else if (activeTab === 'register-vendor' && location.pathname !== '/list-business' && !isKnownTabRoute) {
      navigate('/list-business');
    } else if (activeTab === 'account' && location.pathname !== '/account' && !isKnownTabRoute) {
      navigate('/account');
    } else if (activeTab === 'all-categories' && location.pathname !== '/categories' && !isKnownTabRoute) {
      navigate('/categories');
    } else if (activeTab === 'offers' && location.pathname !== '/offers' && !isKnownTabRoute) {
      navigate('/offers');
    } else if (activeTab === 'admin' && location.pathname !== '/admin' && !isKnownTabRoute) {
      navigate('/admin');
    }
  }, [currentNeighborhood, selectedCategory, activeTab, staticRoute, selectedVendorSlug, location.pathname, navigate]);

  // Dynamic SEO Service Name
  const serviceName = useMemo(() => {
    if (searchQuery) return searchQuery;
    if (selectedCategory !== "all") {
      const cat = INITIAL_CATEGORIES.find((c) => c.slug === selectedCategory);
      return cat ? getTranslation(currentLang, cat.name) : selectedCategory;
    }
    return t("services");
  }, [searchQuery, selectedCategory, currentLang]);

  // UI/UX Modals & Sidebars
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState<boolean>(false);
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
        const userEmail = session.user.email || "";
        setUserEmail(userEmail);

        // Load profile from local storage if available
        const savedProfilesStr = localStorage.getItem('dialxprt_profiles_v1');
        const profiles = savedProfilesStr ? JSON.parse(savedProfilesStr) : {};
        const savedProfile = profiles[userEmail];

        if (savedProfile) {
          setUserPhone(savedProfile.phone || session.user.phone || userEmail);
          setUserName(savedProfile.name || session.user.user_metadata?.full_name || userEmail.split("@")[0] || "User");
          if (savedProfile.avatar) setUserAvatar(savedProfile.avatar);
          if (savedProfile.neighborhood) setCurrentNeighborhood(savedProfile.neighborhood);
        } else {
          setUserPhone(session.user.phone || userEmail);
          setUserName(session.user.user_metadata?.full_name || userEmail.split("@")[0] || "User");
        }

        // Sync Favorites from Supabase
        if (session.user.user_metadata?.favorites && Array.isArray(session.user.user_metadata.favorites)) {
          setFavoriteVendorIds(session.user.user_metadata.favorites);
          localStorage.setItem('dialxprt_favorites_v1', JSON.stringify(session.user.user_metadata.favorites));
        }

        // Sync Collections from Supabase
        if (session.user.user_metadata?.collections && Array.isArray(session.user.user_metadata.collections)) {
          setCollections(session.user.user_metadata.collections);
          localStorage.setItem('dialxprt_collections_v1', JSON.stringify(session.user.user_metadata.collections));
        }

        if (userEmail === "aniketrachalwar073@gmail.com" || userEmail === "aniketrachalwar1@gmail.com") {
          setCurrentRole("admin");
        } else {
          const rolesStr = localStorage.getItem('dialxprt_roles_v1');
          if (rolesStr) {
            const savedRoles = JSON.parse(rolesStr);
            const userRole = savedRoles.find((r: any) => r.email === userEmail || (session.user.phone && r.email === session.user.phone));
            if (userRole) {
              setCurrentRole(userRole.role);
            }
          }
        }
      }
    });

    // Listen for auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Supabase Auth Event:", event);
      
      // Clear hash from URL if it contains access_token to make it clean
      if (window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      
      if (session?.user) {
        const userEmail = session.user.email || "";
        setUserEmail(userEmail);

        // Load profile from local storage if available
        const savedProfilesStr = localStorage.getItem('dialxprt_profiles_v1');
        const profiles = savedProfilesStr ? JSON.parse(savedProfilesStr) : {};
        const savedProfile = profiles[userEmail];

        if (savedProfile) {
          setUserPhone(savedProfile.phone || session.user.phone || userEmail);
          setUserName(savedProfile.name || session.user.user_metadata?.full_name || userEmail.split("@")[0] || "User");
          if (savedProfile.avatar) setUserAvatar(savedProfile.avatar);
          if (savedProfile.neighborhood) setCurrentNeighborhood(savedProfile.neighborhood);
        } else {
          setUserPhone(session.user.phone || userEmail);
          setUserName(session.user.user_metadata?.full_name || userEmail.split("@")[0] || "User");
        }
        
        // Sync Favorites from Supabase
        if (session.user.user_metadata?.favorites && Array.isArray(session.user.user_metadata.favorites)) {
          setFavoriteVendorIds(session.user.user_metadata.favorites);
          localStorage.setItem('dialxprt_favorites_v1', JSON.stringify(session.user.user_metadata.favorites));
        }

        // Sync Collections from Supabase
        if (session.user.user_metadata?.collections && Array.isArray(session.user.user_metadata.collections)) {
          setCollections(session.user.user_metadata.collections);
          localStorage.setItem('dialxprt_collections_v1', JSON.stringify(session.user.user_metadata.collections));
        }

        if (userEmail === "aniketrachalwar073@gmail.com" || userEmail === "aniketrachalwar1@gmail.com") {
          setCurrentRole("admin");
        } else {
          // Check if they were granted a role by the admin (fetch from API)
          fetchUserRoles().then((savedRoles) => {
            const userRole = savedRoles.find((r: any) => r.email === userEmail || (session.user.phone && r.email === session.user.phone));
            if (userRole) {
              setCurrentRole(userRole.role);
            } else {
              setCurrentRole("customer");
            }
          }).catch(() => {
            setCurrentRole("customer");
          });
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
    avatar?: string
  ) => {
    setUserName(name);
    setUserPhone(phone);
    setUserEmail(email);
    if (avatar !== undefined) {
      setUserAvatar(avatar);
    }
    if (neighborhood) {
      setCurrentNeighborhood(neighborhood);
    }

    // Save profile to local storage keyed by email so it persists
    if (email) {
      const savedProfilesStr = localStorage.getItem('dialxprt_profiles_v1');
      const profiles = savedProfilesStr ? JSON.parse(savedProfilesStr) : {};
      profiles[email] = {
        name,
        phone,
        neighborhood,
        avatar: avatar !== undefined ? avatar : userAvatar
      };
      localStorage.setItem('dialxprt_profiles_v1', JSON.stringify(profiles));
    }
    addNotification({
      title: "Profile Updated!",
      message: `Your account details for ${name} have been updated successfully.`,
      type: "system",
    });
  };

  const handleUpdateVendorDetailsSubmit = async (updatedVendor: Vendor) => {
    await updateVendorDetails(updatedVendor);
    loadData();
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
    localStorage.removeItem('dialxprt_mock_session_v1');
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Supabase logout error:", err);
      }
    }
  };

  const handleToggleFavorite = async (vendorId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    let newFavorites: string[];
    if (favoriteVendorIds.includes(vendorId)) {
      newFavorites = favoriteVendorIds.filter(id => id !== vendorId);
    } else {
      newFavorites = [...favoriteVendorIds, vendorId];
    }
    
    setFavoriteVendorIds(newFavorites);
    localStorage.setItem('dialxprt_favorites_v1', JSON.stringify(newFavorites));
    
    // Sync with Supabase if logged in
    if (supabase && userEmail) {
      try {
        await supabase.auth.updateUser({
          data: { favorites: newFavorites }
        });
      } catch (err) {
        console.error("Error syncing favorites to Supabase:", err);
      }
    }
  };

  const handleCreateCollection = async (name: string) => {
    const newCollection: Collection = {
      id: `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      vendorIds: [],
      createdAt: new Date().toISOString()
    };
    const newCollections = [...collections, newCollection];
    setCollections(newCollections);
    localStorage.setItem('dialxprt_collections_v1', JSON.stringify(newCollections));
    
    if (supabase && userEmail) {
      try {
        await supabase.auth.updateUser({ data: { collections: newCollections } });
      } catch (err) {
        console.error("Error syncing collections:", err);
      }
    }
  };

  const handleToggleVendorInCollection = async (collectionId: string, vendorId: string) => {
    const newCollections = collections.map(col => {
      if (col.id === collectionId) {
        const hasVendor = col.vendorIds.includes(vendorId);
        return {
          ...col,
          vendorIds: hasVendor ? col.vendorIds.filter(id => id !== vendorId) : [...col.vendorIds, vendorId]
        };
      }
      return col;
    });
    setCollections(newCollections);
    localStorage.setItem('dialxprt_collections_v1', JSON.stringify(newCollections));
    
    if (supabase && userEmail) {
      try {
        await supabase.auth.updateUser({ data: { collections: newCollections } });
      } catch (err) {
        console.error("Error syncing collections:", err);
      }
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    const newCollections = collections.filter(col => col.id !== collectionId);
    setCollections(newCollections);
    localStorage.setItem('dialxprt_collections_v1', JSON.stringify(newCollections));
    
    if (supabase && userEmail) {
      try {
        await supabase.auth.updateUser({ data: { collections: newCollections } });
      } catch (err) {
        console.error("Error syncing collections:", err);
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
  }, [userLat, userLng, selectedCategory, selectedSubCategory, searchRadius, currentRole]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchNearbyVendors(
        userLat,
        userLng,
        selectedCategory,
        "", // Client-side search filtering is used instead
        currentRole === "admin" || currentRole === "volunteer", // ONLY include pending if admin or volunteer
        selectedSubCategory,
        1000 // Always fetch a large radius (1000km) so we don't limit results, we just sort/group them
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

        if (minDist > 50) {
          const defaultHood = HYDERABAD_NEIGHBORHOODS.find(n => n.name === 'Madhapur') || HYDERABAD_NEIGHBORHOODS[0];
          setUserLat(defaultHood.lat);
          setUserLng(defaultHood.lng);
          setCurrentNeighborhood(defaultHood.name);
          localStorage.setItem('dialxprt_selected_location_v1', JSON.stringify({
            name: defaultHood.name,
            lat: defaultHood.lat,
            lng: defaultHood.lng
          }));
          addNotification({
            title: "Out of Service Area",
            message: "We currently only serve Hyderabad. Defaulting to Madhapur.",
            type: "system",
          });
        } else {
          setUserLat(latitude);
          setUserLng(longitude);
          setCurrentNeighborhood(closest.name);
          localStorage.setItem('dialxprt_selected_location_v1', JSON.stringify({
            name: closest.name,
            lat: latitude,
            lng: longitude
          }));
          addNotification({
            title: "Location Auto-Detected",
            message: `Position centered at ${closest.name}, Hyderabad (${minDist.toFixed(1)} km away).`,
            type: "system",
          });
        }
      },
      (error) => {
        setIsDetectingGPS(false);
        console.warn(
          "Location access denied or unavailable. Defaulting to Madhapur, Hyderabad.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // Auto-detect on category selection if not already detected
  useEffect(() => {
    if (!isAutoDetected && navigator.geolocation && selectedCategory !== "all") {
      handleAutoDetectGPS();
    }
  }, [selectedCategory, isAutoDetected]);

  const handleSelectNeighborhood = (n: Neighborhood) => {
    setUserLat(n.lat);
    setUserLng(n.lng);
    setCurrentNeighborhood(n.name);
    setIsAutoDetected(false);
    localStorage.setItem('dialxprt_selected_location_v1', JSON.stringify({
      name: n.name,
      lat: n.lat,
      lng: n.lng
    }));
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
    const finalVendorData = { ...vendorData };
    if (userEmail) {
      finalVendorData.email = userEmail;
    }
    const newVendor = await registerVendor(finalVendorData);
    
    // Do NOT await loadData, let it run in background so UI unblocks instantly
    loadData();

    addNotification({
      title: "Store Live Successfully!",
      message: `Your business '${newVendor.name}' is registered and is now live on DialXprt instantly!`,
      type: "approval",
      storeId: newVendor.id,
    });
  };

  // Volunteer / Admin Status Action
  const handleUpdateVendorStatus = async (
    vendorId: string,
    status: "approved" | "pending" | "rejected",
    volunteerName: string,
    notes: string,
  ) => {
    const updated = await updateVendorStatus(vendorId, status, volunteerName, notes);
    if (updated) {
      loadData();
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

  const handleDeleteVendor = async (vendorId: string) => {
    await deleteVendor(vendorId);
    setVendors(vendors.filter(v => v.id !== vendorId && v.slug !== vendorId));
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

    // Fuzzy Search & Relevance Scoring
    let scoredResult = result.map(v => ({ ...v, relevanceScore: 0 }));
    
    if (searchQuery.trim()) {
      const qTokens = searchQuery.trim().toLowerCase().split(/\s+/);
      
      scoredResult = scoredResult.map(v => {
        let score = 0;
        const name = (v.name || '').toLowerCase();
        const catName = (v.category || '').toLowerCase();
        const catSlug = (v.categorySlug || '').toLowerCase();
        const tags = (v.description || '').toLowerCase();
        const address = (v.address || '').toLowerCase();
        const neighborhood = (v.neighborhood || '').toLowerCase();

        qTokens.forEach(token => {
          if (name.includes(token)) score += 10;
          else if (catName.includes(token) || catSlug.includes(token)) score += 5;
          else if (tags.includes(token)) score += 3;
          else if (neighborhood.includes(token) || address.includes(token)) score += 2;
        });

        return { ...v, relevanceScore: score };
      });

      // Filter out those with 0 score (no matches)
      scoredResult = scoredResult.filter(v => v.relevanceScore > 0);
    }

    // Split vendors into 'within radius' and 'outside radius' based on searchRadius
    // This ensures vendors within the selected radius are shown first.
    const withinRadius = scoredResult.filter(v => (v.distanceKm || 0) <= searchRadius);
    const outsideRadius = scoredResult.filter(v => (v.distanceKm || 0) > searchRadius);

    // Sorting function
    const sortFn = (a: any, b: any) => {
      // 1. If searching, sort by relevance first
      if (searchQuery.trim()) {
        if (b.relevanceScore !== a.relevanceScore) {
          return (b.relevanceScore || 0) - (a.relevanceScore || 0);
        }
      }
      
      // 2. Fallback to normal sort
      if (sortBy === "distance") return (a.distanceKm || 0) - (b.distanceKm || 0);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "popular") return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      return 0;
    };

    withinRadius.sort(sortFn);
    outsideRadius.sort(sortFn);

    return [...withinRadius, ...outsideRadius];
  }, [vendors, verifiedOnly, openNowOnly, sortBy, searchRadius, searchQuery]);

  const approvedVendors = processedVendors;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-10">
      <SEOHead
        title={
          selectedCategory === "all" && !searchQuery
            ? "DialXprt - Local Service Experts in Hyderabad"
            : `Best ${serviceName} in ${currentNeighborhood}, Hyderabad | DialXprt`
        }
        description={`Find the best ${serviceName} in ${currentNeighborhood}. Get quotes, chat on WhatsApp, or call now.`}
      />
      {/* 1. STICKY TOP HEADER */}
      {activeTab !== "all-categories" && (
      <Header
        currentNeighborhood={currentNeighborhood}
        isAutoDetected={isAutoDetected}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenRegistration={handleOpenRegistration}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenAccount={() => {
          setIsProfileSidebarOpen(true);
        }}
        onOpenLanguage={() => setIsLangModalOpen(true)}
        onGoHome={() => {
          setActiveTab("home");
          setSearchQuery("");
          setSelectedCategory("all");
          window.scrollTo({ top: 0, behavior: "smooth" });
          if (location.pathname !== "/") {
            navigate("/");
          }
        }}
        currentRole={currentRole}
        onToggleRole={(role) => {
          setCurrentRole(role);
          setActiveTab("account");
        }}
        unreadNotificationsCount={unreadCount}
        userPhone={userPhone}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        renderCompactSearch={undefined}
      >
        {activeTab === "home" && (
          <div className="space-y-4 px-3 sm:px-0">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                if (q.trim().length > 0 && selectedCategory !== "all") {
                  setSelectedCategory("all");
                  setSelectedSubCategory(null);
                }
              }}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setSelectedSubCategory(null);
                if (cat !== "all") {
                  setSearchQuery("");
                }
              }}
              categories={categories}
              vendors={approvedVendors}
              onSelectVendor={(v) => navigate(`/expert/${v.slug}`)}
              onTrackCall={handleTrackCall}
              onTrackWhatsApp={handleTrackWhatsApp}
              totalVendorsCount={approvedVendors.length}
              currentLang={currentLang}
              onLanguageChange={handleLanguageChange}
              currentNeighborhood={currentNeighborhood}
              onOpenLocation={() => setIsLocationModalOpen(true)}
            />


          </div>
        )}
      </Header>
      )}


      {/* MAIN BODY DISPLAY */}
      <main className="w-full max-w-6xl mx-auto py-5 sm:px-6">
        <Suspense fallback={<LoadingSpinner />}>
        {/* VIEW 1: ROLE-TAILORED ACCOUNT DASHBOARD */}
        {selectedVendorSlug ? (() => {
          const profileVendor = vendors.find((v) => v.slug === selectedVendorSlug) || null;
          return (
            <VendorProfilePage
              vendor={profileVendor}
              onTrackCall={handleTrackCall}
              onTrackWhatsApp={handleTrackWhatsApp}
              currentLang={currentLang}
              isFavorite={profileVendor ? favoriteVendorIds.includes(profileVendor.id) : false}
              onToggleFavorite={handleToggleFavorite}
              onBookmarkClick={(vId) => {
                setVendorForCollection(vId);
                setIsCollectionsModalOpen(true);
              }}
            />
          );
        })() : staticRoute ? (
          <StaticPage route={staticRoute} />
        ) : activeTab === "account" ? (
          <AccountView
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            userPhone={userPhone}
            userName={userName}
            userEmail={userEmail}
            userAvatar={userAvatar}
            onUpdateUserProfile={handleUpdateUserProfile}
            onOpenEditProfile={() => setActiveTab("edit-profile")}
            onOpenEditVendor={(vendor) => {
              setSelectedVendorToEdit(vendor);
              setActiveTab("edit-vendor");
            }}
            onUpdateVendorDetails={handleUpdateVendorDetailsSubmit}
            onLogout={handleLogout}
            vendors={vendors}
            categories={categories}
            currentNeighborhood={currentNeighborhood}
            onUpdateVendorStatus={handleUpdateVendorStatus}
            onDeleteVendor={handleDeleteVendor}
            onOpenRegistration={handleOpenRegistration}
            onExportCSV={handleExportCSV}
            onSelectVendor={(v) => navigate(`/expert/${v.slug}`)}
            currentLang={currentLang}
          />
        ) : activeTab === "admin" ? (
          <AdminPanelView 
            vendors={vendors}
            currentRole={currentRole}
            onUpdateVendorStatus={handleUpdateVendorStatus}
            onDeleteVendor={handleDeleteVendor}
            onOpenEditVendor={(v) => {
              setSelectedVendorToEdit(v);
              setActiveTab("edit-vendor");
            }}
            onExportCSV={handleExportCSV}
          />
        ) : activeTab === "offers" ? (
          <OffersView />
        ) : activeTab === "all-categories" ? (
          <AllCategoriesView
            categories={categories}
            onSelectCategory={(slug) => {
              setSelectedCategory(slug);
              setActiveTab("home");
            }}
            onBack={() => setActiveTab("home")}
            currentLang={currentLang}
          />
        ) : activeTab === "register-vendor" ? (
          <VendorRegistrationView
            onBack={() => setActiveTab("home")}
            categories={categories}
            userLat={userLat}
            userLng={userLng}
            currentNeighborhood={currentNeighborhood}
            onSubmit={async (vendorData) => {
              await handleRegisterVendorSubmit(vendorData);
              setActiveTab('home');
            }}
            currentLang={currentLang}
          />
        ) : activeTab === "edit-vendor" && selectedVendorToEdit ? (
          <VendorRegistrationView
            onBack={() => {
              setActiveTab(currentRole === 'admin' || currentRole === 'volunteer' ? 'admin' : 'account');
              setSelectedVendorToEdit(null);
            }}
            categories={categories}
            userLat={userLat}
            userLng={userLng}
            currentNeighborhood={currentNeighborhood}
            initialData={selectedVendorToEdit}
            isEditMode={true}
            onSubmit={async (vendorData) => {
              // Call the existing update handler
              handleUpdateVendorDetailsSubmit({ ...selectedVendorToEdit, ...vendorData } as Vendor);
              setActiveTab(currentRole === 'admin' || currentRole === 'volunteer' ? 'admin' : 'account');
              setSelectedVendorToEdit(null);
            }}
            currentLang={currentLang}
          />
        ) : activeTab === "edit-profile" ? (
          <UserProfileEditView
            onBack={() => setActiveTab("account")}
            userName={userName}
            userPhone={userPhone}
            userEmail={userEmail}
            userAvatar={userAvatar}
            currentNeighborhood={currentNeighborhood}
            onUpdateUserProfile={handleUpdateUserProfile}
            currentLang={currentLang}
          />
        ) : activeTab === "favorites" ? (
          <FavoritesView 
            vendors={vendors}
            favoriteVendorIds={favoriteVendorIds}
            onToggleFavorite={handleToggleFavorite}
            onSelectVendor={(v) => navigate(`/expert/${v.slug}`)}
            onBack={() => setActiveTab("home")}
          />
        ) : activeTab === "saved" ? (
          <SavedCollectionsView
            vendors={vendors}
            collections={collections}
            favoriteVendorIds={favoriteVendorIds}
            onToggleFavorite={handleToggleFavorite}
            onSelectVendor={(v) => navigate(`/expert/${v.slug}`)}
            onBack={() => setActiveTab("home")}
            onOpenCollectionsModal={(vId) => {
              setVendorForCollection(vId);
              setIsCollectionsModalOpen(true);
            }}
            onDeleteCollection={handleDeleteCollection}
          />
        ) : activeTab === "customer_service" ? (
          <CustomerServiceView onBack={() => setActiveTab("home")} />
        ) : activeTab === "policy" ? (
          <PolicyView onBack={() => setActiveTab("home")} />
        ) : activeTab === "feedback" ? (
          <FeedbackView onBack={() => setActiveTab("home")} />
        ) : activeTab === "help" ? (
          <HelpCenterView 
            onBack={() => setActiveTab("home")} 
            onNavigateToCustomerService={() => setActiveTab("customer_service")}
          />
        ) : (
          /* VIEW 2: PUBLIC DIRECTORY HOMEPAGE GRID */
          <div className="space-y-6">
            {/* Quick Link Category Pills moved OUT of the sticky header */}
            {selectedCategory === "all" && !searchQuery && (
              <div className="grid grid-cols-3 gap-2 mb-2 px-3 sm:px-0">
                {[
                  { label: 'AC Repair & Services', slug: 'ac-repair', icon: Snowflake },
                  { label: 'Car Mechanic', slug: 'mechanic', icon: Car },
                  { label: 'Carpenter', slug: 'carpenter', icon: Hammer },
                  { label: 'Electrician', slug: 'electrician', icon: Zap },
                  { label: 'Plumber', slug: 'plumber', icon: Wrench },
                  { label: 'Show More', slug: 'all-categories', icon: null }
                ].map(link => (
                  <button
                    key={link.slug}
                    onClick={() => {
                      if (link.slug === 'all-categories') {
                        setActiveTab('all-categories');
                      } else {
                        setSelectedCategory(link.slug);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all text-gray-900 font-extrabold text-[11px] sm:text-xs leading-tight py-2 px-1 rounded-xl shadow-sm flex items-center justify-center min-h-[44px] gap-1"
                  >
                    {link.icon && <link.icon className="w-4 h-4 text-cyan-500 shrink-0" />}
                    <span className="line-clamp-2">{link.label}</span>
                    {link.slug === 'all-categories' && (
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                        <ChevronDown className="w-3 h-3" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {selectedCategory === "all" && searchQuery === "" ? (
              /* HOME DASHBOARD WITH PROMO & QUICK FILTERS */
              <HomeDashboard
                categories={categories}
                onSelectCategory={(slug) => {
                  setSelectedCategory(slug);
                  setSelectedSubCategory(null);
                  if (slug !== "all") {
                    setSearchQuery("");
                  }
                }}
                onSearchQuery={(q) => {
                  setSearchQuery(q);
                  if (q.trim().length > 0 && selectedCategory !== "all") {
                    setSelectedCategory("all");
                    setSelectedSubCategory(null);
                  }
                }}
                currentLang={currentLang}
                onShowAllCategories={() => setActiveTab("all-categories")}
              />
            ) : (
              /* SPECIFIC CATEGORY / SEARCH RESULTS VIEW - SORTED BY PROXIMITY */
              <div className="space-y-4 animate-fade-in">
                {/* Category Ad Banner */}
                {selectedCategory !== "all" && !searchQuery && CATEGORY_BANNERS[selectedCategory] && (
                  <div className="w-full h-32 sm:h-40 rounded-2xl overflow-hidden relative shadow-sm">
                    <img src={CATEGORY_BANNERS[selectedCategory].imageUrl} alt="Category Ad" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-5 sm:p-6">
                      <div className="text-white max-w-xs sm:max-w-sm">
                        <span className="text-[10px] font-bold bg-[#F36F21] px-2 py-1 rounded mb-2 inline-block uppercase tracking-wider">Sponsored</span>
                        <h3 className="text-lg sm:text-xl font-extrabold leading-tight mb-1">{CATEGORY_BANNERS[selectedCategory].title}</h3>
                        <p className="text-xs sm:text-sm text-gray-200">{CATEGORY_BANNERS[selectedCategory].subtitle}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Location & Category Results Header Bar */}
                <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedSubCategory(null);
                        setSearchQuery("");
                      }}
                      className="p-2.5 bg-gray-100 hover:bg-[#1A9E9E] hover:text-white text-gray-700 rounded-xl transition-all shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center font-bold"
                      title={searchQuery ? "Back to All Services Grid" : "Back to Subcategories"}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2 mt-2">
                        {selectedCategory !== "all" && (
                          <>
                            <span className="text-xs font-bold text-[#F36F21] bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                              {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                          </>
                        )}
                        <button 
                          onClick={() => setIsLocationModalOpen(true)}
                          className="text-xs text-gray-500 font-semibold flex items-center gap-1 hover:text-gray-900 transition-colors bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#F36F21]" />{" "}
                          {currentNeighborhood}, Hyderabad
                        </button>
                      </div>
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
                      <option value="popular">Sort by: Popularity</option>
                    </select>

                    <select
                      value={searchRadius}
                      onChange={(e) => setSearchRadius(Number(e.target.value))}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#1A9E9E] shrink-0"
                    >
                      <option value={2}>2 km</option>
                      <option value={5}>5 km</option>
                      <option value={10}>10 km</option>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-3 sm:px-0">
                    {approvedVendors.filter(v => v.distanceKm === undefined || v.distanceKm <= searchRadius).map((vendor) => (
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
                        isFavorite={favoriteVendorIds.includes(vendor.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onBookmarkClick={(vId, e) => {
                          if (e) e.stopPropagation();
                          setVendorForCollection(vId);
                          setIsCollectionsModalOpen(true);
                        }}
                      />
                    ))}

                    {approvedVendors.filter(v => v.distanceKm !== undefined && v.distanceKm > searchRadius).length > 0 && (
                      <>
                        <div className="flex items-center gap-4 py-4 opacity-60">
                          <div className="flex-1 h-px bg-gray-300"></div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Further Away</span>
                          <div className="flex-1 h-px bg-gray-300"></div>
                        </div>

                        {approvedVendors.filter(v => v.distanceKm !== undefined && v.distanceKm > searchRadius).map((vendor) => (
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
                            isFavorite={favoriteVendorIds.includes(vendor.id)}
                            onToggleFavorite={handleToggleFavorite}
                            onBookmarkClick={(vId, e) => {
                              if (e) e.stopPropagation();
                              setVendorForCollection(vId);
                              setIsCollectionsModalOpen(true);
                            }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <Footer />
        </Suspense>
      </main>

      {/* 3. CLEAN 3-TAB BOTTOM NAVIGATION BAR */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "add" || tab === "register-vendor") {
            handleOpenRegistration();
          } else {
            setActiveTab(tab);
            if (tab === "home") {
              setSelectedCategory("all");
              if (location.pathname !== "/") {
                navigate("/");
              }
            }
          }
        }}
        currentRole={currentRole}
        pendingCount={vendors.filter(v => v.status === "pending").length}
        currentLang={currentLang}
      />

      {/* 4. FLOATING SUPPORT WIDGET */}
      <FloatingSupportWidget currentLang={currentLang} />

      {/* 4.5 RIGHT STICKY ACTION BAR */}
      <RightStickyBar onOpenRegistration={handleOpenRegistration} />

      {/* Collections Modal */}
      <CollectionsModal
        isOpen={isCollectionsModalOpen}
        onClose={() => setIsCollectionsModalOpen(false)}
        vendorId={vendorForCollection}
        collections={collections}
        onToggleVendor={handleToggleVendorInCollection}
        onCreateCollection={handleCreateCollection}
      />

      {/* 5. MODALS */}

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
        onLoginSuccess={(email, role, name) => {
          const resolvedName = name || email.split("@")[0] || "User";
          setUserPhone(email);
          setUserEmail(email);
          setUserName(resolvedName);
          setCurrentRole(role);
          setActiveTab("account");
          localStorage.setItem('dialxprt_mock_session_v1', JSON.stringify({
            userEmail: email,
            userPhone: email,
            userName: resolvedName,
            currentRole: role
          }));
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
        userName={userPhone ? userName : ''}
        onLogout={handleLogout}
        onEditProfile={() => {
          setActiveTab('account');
        }}
        onChangeLanguage={() => setIsLangModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onNavigate={(tab: any) => {
          setIsProfileSidebarOpen(false);
          setActiveTab(tab);
        }}
        isAdmin={currentRole === 'admin'}
        currentRole={currentRole}
        onLogin={() => {
          setIsProfileSidebarOpen(false);
          setIsAuthModalOpen(true);
        }}
        onInstallApp={deferredPrompt ? handleInstallApp : undefined}
      />

      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}







