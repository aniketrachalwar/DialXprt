import { Vendor } from '../types';

export const MORE_VENDORS: Vendor[] = [
  // EDUCATION: Schools
  {
    id: 'v101', slug: 'dps-madhapur', name: 'Delhi Public School (DPS)', category: 'Schools', categorySlug: 'schools',
    ownerName: 'Admin', phone: '04023456789', whatsapp: '919876543210', address: 'Plot 10, Hitec City Road',
    neighborhood: 'Madhapur', city: 'Hyderabad', pincode: '500081', lat: 17.4323, lng: 78.3894,
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=600',
    isVerified: true, status: 'approved', rating: 4.8, reviewsCount: 450,
    description: 'Premier CBSE school offering holistic education from Nursery to Class XII. State of the art facilities.',
    createdAt: '2026-01-10T10:00:00.000Z', updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'v102', slug: 'chirec-kondapur', name: 'CHIREC International School', category: 'Schools', categorySlug: 'schools',
    ownerName: 'Admin', phone: '04012345678', whatsapp: '919012345678', address: 'Botanical Garden Road',
    neighborhood: 'Kondapur', city: 'Hyderabad', pincode: '500084', lat: 17.4249, lng: 78.3604,
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600',
    isVerified: true, status: 'approved', rating: 4.9, reviewsCount: 890,
    description: 'IB and CBSE curriculum. Top ranked international school in Hyderabad.',
    createdAt: '2026-01-10T10:00:00.000Z', updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'v103', slug: 'peoples-school-kachiguda', name: "People's School Of Excellence", category: 'Schools', categorySlug: 'schools',
    ownerName: 'Admin', phone: '04098765432', whatsapp: '919876543299', address: 'Street No 1 Ashok Nagar',
    neighborhood: 'Kachiguda', city: 'Hyderabad', pincode: '500027', lat: 17.3817, lng: 78.4769,
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bea4edad646a?auto=format&fit=crop&q=80&w=600',
    isVerified: true, status: 'approved', rating: 4.0, reviewsCount: 76,
    description: 'CBSE and State Board. High call pick up rate. One of the best schools with huge grounds.',
    createdAt: '2026-01-10T10:00:00.000Z', updatedAt: '2026-01-10T10:00:00.000Z',
  },
  
  // GYMS
  {
    id: 'v104', slug: 'cultfit-madhapur', name: 'Cult.fit Gym', category: 'Gyms', categorySlug: 'gyms',
    ownerName: 'Cult Manager', phone: '9876543211', whatsapp: '919876543211', address: '3rd Floor, Ayyappa Society',
    neighborhood: 'Madhapur', city: 'Hyderabad', pincode: '500081', lat: 17.4323, lng: 78.3894,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
    isVerified: true, status: 'approved', rating: 4.7, reviewsCount: 1200,
    description: 'Group workouts, HRX, Boxing, Yoga, and Dance fitness. Best trainers in Madhapur.',
    createdAt: '2026-01-10T10:00:00.000Z', updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'v105', slug: 'sm-fitness-malakpet', name: 'Sm Fitness Club', category: 'Gyms', categorySlug: 'gyms',
    ownerName: 'Sami', phone: '9876543212', whatsapp: '919876543212', address: 'Malakpet Main Road',
    neighborhood: 'Malakpet', city: 'Hyderabad', pincode: '500036', lat: 17.3734, lng: 78.4971,
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600',
    isVerified: true, status: 'approved', rating: 4.1, reviewsCount: 302,
    description: 'Popular Gym in Malakpet. Modern equipment, AC, personal training available.',
    createdAt: '2026-01-10T10:00:00.000Z', updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'v106', slug: 'freedom-fitness-kachiguda', name: 'Freeedom Fitness', category: 'Gyms', categorySlug: 'gyms',
    ownerName: 'Rahul', phone: '9876543213', whatsapp: '919876543213', address: 'Kachi Guda Main Rd',
    neighborhood: 'Kachiguda', city: 'Hyderabad', pincode: '500027', lat: 17.3817, lng: 78.4769,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600',
    isVerified: true, status: 'approved', rating: 4.0, reviewsCount: 134,
    description: 'Freedom Fitness ₹9,990 / 3 months. This gym has all the equipment, very neat and hygiene.',
    createdAt: '2026-01-10T10:00:00.000Z', updatedAt: '2026-01-10T10:00:00.000Z',
  },

  // DOCTORS: Dentists
  {
    id: 'v107', slug: 'apollo-dental-jubilee', name: 'Apollo Dental', category: 'Dentists', categorySlug: 'dentists',
    ownerName: 'Dr. Apollo', phone: '9876543214', whatsapp: '919876543214', address: 'Road No 36',
    neighborhood: 'Jubilee Hills', city: 'Hyderabad', pincode: '500033', lat: 17.4335, lng: 78.3827,
    imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600',
    isVerified: true, status: 'approved', rating: 4.6, reviewsCount: 210,
    description: 'Expert dental care, implants, root canals, and cosmetic dentistry.',
    createdAt: '2026-01-10T10:00:00.000Z', updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'v108', slug: 'smile-care-kachiguda', name: 'Smile Care Dental Clinic', category: 'Dentists', categorySlug: 'dentists',
    ownerName: 'Dr. Sharma', phone: '9876543215', whatsapp: '919876543215', address: 'Near Inox',
    neighborhood: 'Kachiguda', city: 'Hyderabad', pincode: '500027', lat: 17.3817, lng: 78.4769,
    imageUrl: 'https://images.unsplash.com/photo-1598256989800-fea5ce5146f5?auto=format&fit=crop&q=80&w=600',
    isVerified: true, status: 'approved', rating: 4.3, reviewsCount: 45,
    description: 'Affordable and painless dental treatments in Kachiguda.',
    createdAt: '2026-01-10T10:00:00.000Z', updatedAt: '2026-01-10T10:00:00.000Z',
  },

  // BEAUTY: Salons
  {
    id: 'v109', slug: 'naturals-salon-banjara', name: 'Naturals Salon', category: 'Salons', categorySlug: 'salons',
    ownerName: 'Manager', phone: '9876543216', whatsapp: '919876543216', address: 'Road No 12',
    neighborhood: 'Banjara Hills', city: 'Hyderabad', pincode: '500034', lat: 17.4407, lng: 78.3945,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600',
    isVerified: true, status: 'approved', rating: 4.4, reviewsCount: 340,
    description: 'Premium hair styling, facials, and grooming services for men and women.',
    createdAt: '2026-01-10T10:00:00.000Z', updatedAt: '2026-01-10T10:00:00.000Z',
  },

  // REPAIRS: AC Repair
  {
    id: 'v110', slug: 'cool-breeze-ac', name: 'Cool Breeze AC Service', category: 'AC Repair', categorySlug: 'ac-repair',
    ownerName: 'Ramu', phone: '9876543217', whatsapp: '919876543217', address: 'Kondapur Main Road',
    neighborhood: 'Kondapur', city: 'Hyderabad', pincode: '500084', lat: 17.4249, lng: 78.3604,
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=600',
    isVerified: true, status: 'approved', rating: 4.5, reviewsCount: 88,
    description: 'Quick AC repair, gas refilling, and installation. 24/7 service in Hi-tech city area.',
    createdAt: '2026-01-10T10:00:00.000Z', updatedAt: '2026-01-10T10:00:00.000Z',
  },

  // B2B: Packaging Material
  {
    id: 'v111', slug: 'sri-sai-packaging', name: 'Sri Sai Packaging Industry', category: 'Packaging Material', categorySlug: 'packaging',
    ownerName: 'Krishna', phone: '9876543218', whatsapp: '919876543218', address: 'Jeedimetla Industrial Area',
    neighborhood: 'Jeedimetla', city: 'Hyderabad', pincode: '500055', lat: 17.5143, lng: 78.4682,
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600',
    isVerified: true, status: 'approved', rating: 4.2, reviewsCount: 23,
    description: 'Wholesale cardboard boxes, bubble wrap, and packing tapes.',
    createdAt: '2026-01-10T10:00:00.000Z', updatedAt: '2026-01-10T10:00:00.000Z',
  }
];
