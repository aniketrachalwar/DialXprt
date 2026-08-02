import { createClient } from '@supabase/supabase-js';
import { Vendor, Category, VendorStatus } from '../types';
import { INITIAL_VENDORS, INITIAL_CATEGORIES } from '../data/mockVendors';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

import { calculateDistanceKm } from './geo';

const STORAGE_KEY_VENDORS = 'dialxprt_vendors_db_v2';
const STORAGE_KEY_ANALYTICS = 'dialxprt_analytics';

// Local storage persistent database helper
export function getStoredVendors(): Vendor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VENDORS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading local vendor store:', err);
  }
  // Save initial seed data if empty
  saveStoredVendors(INITIAL_VENDORS);
  return INITIAL_VENDORS;
}

export function saveStoredVendors(vendors: Vendor[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(vendors));
  } catch (err) {
    console.error('Error saving local vendor store:', err);
  }
}

/**
 * High-Concurrency Nearby Vendor Fetcher
 * Tries Supabase RPC `get_nearby_vendors` if connected, else uses Haversine spatial search
 */
export async function fetchNearbyVendors(
  userLat: number,
  userLng: number,
  categoryFilter: string = 'all',
  searchQuery: string = '',
  includePending: boolean = false,
  subCategoryFilter: string | null = null,
  radiusKm: number = 50.0
): Promise<Vendor[]> {
  // 1. Try Supabase RPC if configured
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('get_nearby_vendors', {
        user_lat: userLat,
        user_lng: userLng,
        radius_km: radiusKm,
        cat_filter: categoryFilter || null,
        search_query: searchQuery || null,
        only_approved: !includePending,
      });

      if (!error && data && Array.isArray(data) && data.length > 0) {
        return data.map((v: any) => ({
          id: v.id,
          slug: v.slug,
          name: v.name,
          category: v.category_slug,
          categorySlug: v.category_slug,
          ownerName: v.owner_name,
          phone: v.phone,
          whatsapp: v.whatsapp,
          address: v.address,
          neighborhood: v.neighborhood,
          city: v.city,
          pincode: v.pincode,
          lat: v.lat,
          lng: v.lng,
          imageUrl: v.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
          isVerified: v.is_verified,
          status: v.status as VendorStatus,
          rating: v.rating || 4.8,
          reviewsCount: v.reviews_count || 10,
          description: v.description || '',
          createdAt: v.created_at,
          updatedAt: v.created_at,
          distanceKm: v.distance_km,
          viewsCount: v.views_count,
          callsCount: v.calls_count,
          whatsappClicksCount: v.whatsapp_clicks_count,
        }));
      }
    } catch (e) {
      console.warn('Supabase query failed, falling back to local PostGIS engine:', e);
    }
  }

  // 2. Client-side fallback engine using Haversine calculation
  const allVendors = getStoredVendors();
  const q = searchQuery.trim().toLowerCase();
  const cat = categoryFilter.trim().toLowerCase();

  // First try filtering with category + query
  let filtered = allVendors.filter((v) => {
    // Filter by status
    if (!includePending && v.status !== 'approved') {
      return false;
    }
    // Filter by category
    if (cat && cat !== 'all' && v.categorySlug.toLowerCase() !== cat) {
      return false;
    }
    // Filter by subcategory
    if (subCategoryFilter && v.subCategorySlug !== subCategoryFilter) {
      return false;
    }
    // Filter by search query
    if (q) {
      const matchesName = v.name.toLowerCase().includes(q);
      const matchesCat = v.category.toLowerCase().includes(q) || v.categorySlug.toLowerCase().includes(q);
      const matchesLoc = v.neighborhood.toLowerCase().includes(q) || v.address.toLowerCase().includes(q) || (v.pincode || '').includes(q);
      const matchesOwner = v.ownerName.toLowerCase().includes(q);
      const matchesPhone = (v.phone || '').includes(q) || (v.whatsapp || '').includes(q);
      const matchesDesc = (v.description || '').toLowerCase().includes(q);
      return matchesName || matchesCat || matchesLoc || matchesOwner || matchesPhone || matchesDesc;
    }
    return true;
  });

  // Fallback: If user searched with query but strict category filter yielded 0, search across ALL categories
  if (q && filtered.length === 0 && cat && cat !== 'all') {
    filtered = allVendors.filter((v) => {
      if (!includePending && v.status !== 'approved') return false;
      const matchesName = v.name.toLowerCase().includes(q);
      const matchesCat = v.category.toLowerCase().includes(q) || v.categorySlug.toLowerCase().includes(q);
      const matchesLoc = v.neighborhood.toLowerCase().includes(q) || v.address.toLowerCase().includes(q) || (v.pincode || '').includes(q);
      const matchesOwner = v.ownerName.toLowerCase().includes(q);
      const matchesPhone = (v.phone || '').includes(q) || (v.whatsapp || '').includes(q);
      const matchesDesc = (v.description || '').toLowerCase().includes(q);
      return matchesName || matchesCat || matchesLoc || matchesOwner || matchesPhone || matchesDesc;
    });
  }

  return filtered
    .map((v) => {
      const distance = calculateDistanceKm(userLat, userLng, v.lat, v.lng);
      return {
        ...v,
        distanceKm: distance,
      };
    })
    .filter((v) => v.distanceKm <= radiusKm)
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
}

/**
 * Register a new Store for Volunteer Verification
 */
export async function registerVendor(vendorData: Omit<Vendor, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'status' | 'isVerified' | 'rating' | 'reviewsCount' | 'viewsCount' | 'callsCount' | 'whatsappClicksCount'>): Promise<Vendor> {
  const slug = `${vendorData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${vendorData.neighborhood.toLowerCase()}-${Date.now().toString().slice(-4)}`;
  const now = new Date().toISOString();

  const newVendor: Vendor = {
    ...vendorData,
    id: `v-${Date.now()}`,
    slug,
    isVerified: false,
    status: 'pending',
    rating: 0,
    reviewsCount: 0,
    viewsCount: 0,
    callsCount: 0,
    whatsappClicksCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  if (supabase) {
    try {
      const insertPromise = supabase.from('vendors').insert([
        {
          slug: newVendor.slug,
          name: newVendor.name,
          category_slug: newVendor.categorySlug,
          owner_name: newVendor.ownerName,
          phone: newVendor.phone,
          whatsapp: newVendor.whatsapp,
          address: newVendor.address,
          neighborhood: newVendor.neighborhood,
          city: newVendor.city,
          pincode: newVendor.pincode,
          lat: newVendor.lat,
          lng: newVendor.lng,
          image_url: newVendor.imageUrl,
          description: newVendor.description,
          experience: newVendor.experience,
          suggestions: newVendor.suggestions,
          reference_name: newVendor.referenceName,
          reference_number: newVendor.referenceNumber,
          status: 'pending',
          is_verified: false,
        },
      ]);
      // Timeout after 2.5 seconds to prevent hanging if Supabase is down or slow
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase request timed out')), 2500));
      await Promise.race([insertPromise, timeoutPromise]);
    } catch (e) {
      console.warn('Failed to insert into Supabase directly:', e);
    }
  }

  // Update local store
  const existing = getStoredVendors();
  saveStoredVendors([newVendor, ...existing]);

  return newVendor;
}

export async function fetchAllVendors(): Promise<Vendor[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data && Array.isArray(data) && data.length > 0) {
        return data.map((v: any) => ({
          id: v.id,
          slug: v.slug,
          name: v.name,
          category: v.category_slug,
          categorySlug: v.category_slug,
          ownerName: v.owner_name,
          phone: v.phone,
          whatsapp: v.whatsapp,
          address: v.address,
          neighborhood: v.neighborhood,
          city: v.city,
          pincode: v.pincode,
          lat: v.lat,
          lng: v.lng,
          imageUrl: v.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
          isVerified: v.is_verified,
          status: v.status as VendorStatus,
          rating: v.rating || 4.8,
          reviewsCount: v.reviews_count || 10,
          description: v.description || '',
          createdAt: v.created_at,
          updatedAt: v.created_at,
          distanceKm: 0,
          viewsCount: v.views_count,
          callsCount: v.calls_count,
          whatsappClicksCount: v.whatsapp_clicks_count,
        }));
      }
    } catch (e) {
      console.warn('Supabase fetchAllVendors failed, falling back:', e);
    }
  }
  
  return getStoredVendors();
}

/**
 * Update full vendor details (Owner / Admin Edit)
 */
export async function updateVendorDetails(updatedVendor: Vendor): Promise<Vendor> {
  const existing = getStoredVendors();
  const updatedList = existing.map((v) => {
    if (v.id === updatedVendor.id || v.slug === updatedVendor.slug) {
      return {
        ...updatedVendor,
        updatedAt: new Date().toISOString(),
      };
    }
    return v;
  });

  saveStoredVendors(updatedList);

  if (supabase) {
    try {
      const updatePromise = supabase
        .from('vendors')
        .update({
          name: updatedVendor.name,
          owner_name: updatedVendor.ownerName,
          phone: updatedVendor.phone,
          whatsapp: updatedVendor.whatsapp,
          address: updatedVendor.address,
          neighborhood: updatedVendor.neighborhood,
          city: updatedVendor.city,
          pincode: updatedVendor.pincode,
          lat: updatedVendor.lat,
          lng: updatedVendor.lng,
          image_url: updatedVendor.imageUrl,
          description: updatedVendor.description,
          experience: updatedVendor.experience,
          suggestions: updatedVendor.suggestions,
          reference_name: updatedVendor.referenceName,
          reference_number: updatedVendor.referenceNumber,
        })
        .eq('id', updatedVendor.id);
        
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase request timed out')), 2500));
      await Promise.race([updatePromise, timeoutPromise]);
    } catch (e) {
      console.warn('Failed to update Supabase directly:', e);
    }
  }

  return updatedVendor;
}

/**
 * Volunteer / Admin Status Approval Function
 */
export function updateVendorStatus(
  vendorId: string,
  newStatus: VendorStatus,
  volunteerName: string,
  notes: string
): Vendor | null {
  const existing = getStoredVendors();
  let updatedVendor: Vendor | null = null;

  const updatedList = existing.map((v) => {
    if (v.id === vendorId || v.slug === vendorId) {
      updatedVendor = {
        ...v,
        status: newStatus,
        isVerified: newStatus === 'approved',
        verifiedByVolunteer: volunteerName,
        volunteerNotes: notes,
        updatedAt: new Date().toISOString(),
      };
      return updatedVendor;
    }
    return v;
  });

  if (updatedVendor) {
    saveStoredVendors(updatedList);
  }

  return updatedVendor;
}

/**
 * Event analytics tracking for Call / WhatsApp / View
 */
export function trackInteraction(vendorId: string, eventType: 'call' | 'whatsapp' | 'view') {
  const existing = getStoredVendors();
  const updated = existing.map((v) => {
    if (v.id === vendorId) {
      return {
        ...v,
        viewsCount: eventType === 'view' ? (v.viewsCount || 0) + 1 : v.viewsCount,
        callsCount: eventType === 'call' ? (v.callsCount || 0) + 1 : v.callsCount,
        whatsappClicksCount: eventType === 'whatsapp' ? (v.whatsappClicksCount || 0) + 1 : v.whatsappClicksCount,
      };
    }
    return v;
  });
  saveStoredVendors(updated);
}
