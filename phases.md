# Project Phases & Roadmap: DialXprt

This document outlines the strategic rollout plan for the DialXprt platform. It breaks down the development lifecycle from the initial Minimum Viable Product (MVP) to long-term scaling and monetization.

---

## Phase 1: Minimum Viable Product (MVP) - *Current Phase*
**Goal:** Establish a functional, mobile-friendly platform for hyperlocal service discovery in Hyderabad and validate market demand.

- [x] **Core UI/UX Design:** Develop a responsive, mobile-first interface using Tailwind CSS and React.
- [x] **Static Data Population:** Create comprehensive mock datasets for initial categories and neighborhood vendors to demonstrate app capabilities.
- [x] **Smart Search & Filtering:** Implement search functionality allowing users to filter by category, relevance, and distance.
- [x] **Direct Lead Generation:** Enable users to contact experts directly via WhatsApp and Phone Call buttons without intermediate friction.
- [x] **Multi-Language UI:** Provide English, Telugu, and Hindi UI localization for broader accessibility.
- [x] **Production Readiness:** Ensure zero TypeScript errors, optimized Vite builds, and robust scroll behaviors.

---

## Phase 2: Full Backend Integration & User Growth
**Goal:** Transition from static/mock data to a fully dynamic database, enabling user-generated content and live vendor management.

- [ ] **Database Migration:** Replace `mockVendors.ts` with live queries to the Supabase PostgreSQL database.
- [ ] **Authentication & Security:** Implement Supabase Auth (OTP/Password) for Vendors, Customers, and Volunteers.
- [ ] **Vendor Onboarding Flow:** Launch the live vendor registration form, allowing small businesses to create and edit their profiles dynamically.
- [ ] **Review System:** Enable authenticated customers to leave verified star ratings and written reviews for experts.
- [ ] **Volunteer Dashboard:** Activate the Volunteer admin tools for field agents to physically verify offline vendors and mark them as "Shield Checked."
- [ ] **SEO Optimization:** Implement server-side rendering (SSR) or dynamic meta-tags for individual vendor profile pages to rank on Google.

---

## Phase 3: Monetization & Advanced Features
**Goal:** Introduce revenue streams and enhance the convenience factor for customers.

- [ ] **Premium Placements (Ads):** Allow vendors to pay for "Sponsored" or top-tier placements in category search results (e.g., Category Ad Banners).
- [ ] **In-App Booking System:** Shift from "call-only" to scheduled booking slots, allowing customers to book exact times for services (e.g., AC Repair at 4:00 PM).
- [ ] **Lead Bidding / Distribution:** Introduce a system where "Emergency Repair" leads can be broadcasted to multiple verified vendors who can accept the job.
- [ ] **Analytics Dashboard:** Provide vendors with metrics on how many profile views, calls, and WhatsApp clicks they received this month.

---

## Phase 4: Expansion & Ecosystem
**Goal:** Scale the application beyond the initial test market and deploy native mobile applications.

- [ ] **Multi-City Launch:** Expand service categories and neighborhood mapping to additional major cities across India.
- [ ] **Native Mobile Apps:** Wrap the responsive PWA into native Android (Play Store) and iOS (App Store) applications using React Native or Capacitor.
- [ ] **Payment Gateway Escrow:** For high-value services (e.g., Event Catering, Contractors), introduce an escrow payment system to ensure trust between the customer and vendor.
- [ ] **AI-Powered Recommendations:** Implement smart search that understands complex natural language queries (e.g., "My sink is leaking and I need someone right now").
