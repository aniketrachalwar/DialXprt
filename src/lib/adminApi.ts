import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_CATEGORIES } from '../data/mockVendors';
import { Category, FeedbackEntry } from '../types';

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
let memoryB2BProducts: B2BProduct[] = [];
let memoryFeedback: FeedbackEntry[] = [];

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

export async function removeUserRole(email: string) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('user_roles').delete().eq('email', email);
      if (!error) {
        memoryUserRoles = memoryUserRoles.filter(r => r.email !== email);
        return true;
      }
    } catch (e) {
      console.warn('Supabase delete failed, using memory state.');
    }
  }
  
  memoryUserRoles = memoryUserRoles.filter(r => r.email !== email);
  return true;
}

export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data && data.length > 0) {
        // Merge Supabase categories with local INITIAL_CATEGORIES to retain emoji and group
        const merged = [...INITIAL_CATEGORIES];
        data.forEach((d: any) => {
           const existingIndex = merged.findIndex(c => 
             c.slug === d.slug || 
             (c.name && d.name && c.name.toLowerCase().trim() === d.name.toLowerCase().trim())
           );
           if (existingIndex >= 0) {
              merged[existingIndex] = { ...merged[existingIndex], ...d, emoji: merged[existingIndex].emoji || d.emoji, group: merged[existingIndex].group || d.group };
           } else {
              merged.push(d as Category);
           }
        });
        return merged;
      }
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

export async function saveFeedback(entry: Omit<FeedbackEntry, 'id' | 'createdAt'>): Promise<void> {
  const newEntry: FeedbackEntry = {
    ...entry,
    id: `fb_${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('feedback').insert([newEntry]);
    } catch (e) {
      console.error('Error saving feedback', e);
    }
  } else {
    // Save to local storage memory
    const existing = localStorage.getItem('dialxprt_feedback');
    const existingData = existing ? JSON.parse(existing) : [];
    const updated = [newEntry, ...existingData];
    localStorage.setItem('dialxprt_feedback', JSON.stringify(updated));
    memoryFeedback = updated;
  }
}

export async function fetchFeedback(): Promise<FeedbackEntry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('feedback').select('*').order('createdAt', { ascending: false });
      if (!error && data) return data as FeedbackEntry[];
    } catch (e) {
      console.error('Error fetching feedback', e);
    }
  }
  
  // Fallback to local storage
  const existing = localStorage.getItem('dialxprt_feedback');
  if (existing) {
    return JSON.parse(existing) as FeedbackEntry[];
  }
  
  return memoryFeedback;
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
