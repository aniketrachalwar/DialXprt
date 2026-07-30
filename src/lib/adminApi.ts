import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_CATEGORIES } from '../data/mockVendors';
import { Category } from '../types';

export interface UserRoleAssignment {
  id?: string;
  email: string;
  role: 'admin' | 'volunteer' | 'vendor' | 'customer';
}

export interface B2BProduct {
  id?: string;
  name: string;
  category_slug: string;
  image_url: string;
}

// Memory fallback for demo purposes if Supabase tables don't exist
let memoryUserRoles: UserRoleAssignment[] = [
  { email: 'aniketrachalwar073@gmail.com', role: 'admin' }
];
let memoryCategories: Category[] = [...INITIAL_CATEGORIES];
let memoryB2BProducts: B2BProduct[] = [
  { name: 'Sports T Shirt', category_slug: 'sports', image_url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=150&h=150' },
  { name: 'Swimming Pools', category_slug: 'sports', image_url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=150&h=150' },
  { name: 'Exercise Equipment', category_slug: 'sports', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=150&h=150' },
  { name: 'Flute', category_slug: 'sports', image_url: 'https://images.unsplash.com/photo-1562215801-4470559eb41e?auto=format&fit=crop&q=80&w=150&h=150' },
];

export async function fetchUserRoles(): Promise<UserRoleAssignment[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('user_roles').select('*');
      if (!error && data) return data as UserRoleAssignment[];
    } catch (e) {
      console.warn('Supabase fetch failed, using memory state.');
    }
  }
  return memoryUserRoles;
}

export async function grantUserRole(email: string, role: 'admin' | 'volunteer' | 'vendor' | 'customer') {
  if (isSupabaseConfigured && supabase) {
    try {
      // Upsert
      const { error } = await supabase.from('user_roles').upsert({ email, role }, { onConflict: 'email' });
      if (!error) {
        // Also update memory in case of mixed usage
        const existing = memoryUserRoles.find(r => r.email === email);
        if (existing) existing.role = role; else memoryUserRoles.push({ email, role });
        return true;
      }
    } catch (e) {
      console.warn('Supabase write failed, using memory state.');
    }
  }
  
  // Memory fallback
  const existing = memoryUserRoles.find(r => r.email === email);
  if (existing) {
    existing.role = role;
  } else {
    memoryUserRoles.push({ email, role });
  }
  return true;
}

export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data && data.length > 0) return data as Category[];
    } catch (e) {
      console.warn('Supabase fetch failed, using memory state.');
    }
  }
  return memoryCategories;
}

export async function addCategory(category: Category) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('categories').insert(category);
      if (!error) {
         memoryCategories = [...memoryCategories, category];
         return true;
      }
    } catch (e) {
      console.warn('Supabase write failed, using memory state.');
    }
  }
  memoryCategories = [...memoryCategories, category];
  return true;
}

export async function fetchB2BProducts(): Promise<B2BProduct[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('b2b_products').select('*');
      if (!error && data && data.length > 0) return data as B2BProduct[];
    } catch (e) {
      console.warn('Supabase fetch failed, using memory state.');
    }
  }
  return memoryB2BProducts;
}

export async function addB2BProduct(product: B2BProduct) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('b2b_products').insert(product);
      if (!error) {
         memoryB2BProducts = [...memoryB2BProducts, product];
         return true;
      }
    } catch (e) {
      console.warn('Supabase write failed, using memory state.');
    }
  }
  memoryB2BProducts = [...memoryB2BProducts, product];
  return true;
}
