export type VendorStatus = 'approved' | 'pending' | 'rejected';

export type UserRole = 'customer' | 'vendor' | 'volunteer' | 'admin';

export interface VolunteerUser {
  id: string;
  name: string;
  phone: string;
  district: string;
  status: 'active' | 'suspended';
  verifiedShopsCount: number;
  permissions: {
    canApproveShops: boolean;
    canRejectShops: boolean;
    canAssignDistrict: boolean;
  };
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  subCategorySlug?: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  neighborhood: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  imageUrl: string;
  isVerified: boolean;
  isSponsored?: boolean;
  status: VendorStatus;
  rating: number;
  reviewsCount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  distanceKm?: number;
  keywords?: string;
  operatingHours?: string;
  fullAddress?: string;
  verifiedByVolunteer?: string;
  volunteerNotes?: string;
  viewsCount?: number;
  callsCount?: number;
  whatsappClicksCount?: number;
  experience?: string;
  suggestions?: string;
  referenceName?: string;
  referenceNumber?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  imageUrl?: string;
  subcategories?: SubCategory[];
  description: string;
  activeProvidersCount: number;
  popularSearch?: boolean;
}

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  pincode: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  isVerified: boolean;
  avatarUrl?: string;
  volunteerDistrict?: string;
}

export interface PlatformAnalytics {
  totalVendors: number;
  liveVerifiedVendors: number;
  pendingVerifications: number;
  totalCallsGenerated: number;
  totalWhatsAppLeads: number;
  totalStoreViews: number;
  topSearchKeywords: { keyword: string; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'rejection' | 'new_store' | 'system';
  createdAt: string;
  read: boolean;
  targetRole?: UserRole;
  storeId?: string;
}

export interface CustomerWorkerInteraction {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  vendorPhone: string;
  vendorAddress: string;
  vendorNeighborhood: string;
  vendorImage?: string;
  interactionType: 'call' | 'whatsapp' | 'visit' | 'booking';
  timestamp: string;
  serviceProvided?: string;
  visitDate?: string;
  status: 'Completed' | 'Visited' | 'Contacted' | 'Scheduled';
  ratingGiven?: number;
  customerNotes?: string;
}

export interface CustomerSavedWorker {
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  vendorPhone: string;
  vendorNeighborhood: string;
  vendorImage: string;
  rating: number;
  addedAt: string;
}


export interface LocationState {
  lat: number;
  lng: number;
  neighborhood: string;
  city: string;
  isAutoDetected: boolean;
  accuracy?: number;
  error?: string;
}
