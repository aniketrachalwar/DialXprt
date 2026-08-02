# Product Requirements Document (PRD): DialXprt

## 1. Product Overview
**Name:** DialXprt
**Tagline:** Search Local Service Expert.
**Description:** DialXprt is a hyperlocal service discovery and connection platform. It helps users easily find and directly contact verified local service providers (electricians, plumbers, AC repair, tailors, caterers, etc.) in their immediate neighborhood without middleman fees.

## 2. Target Audience
- **Customers (End Users):** People looking for quick, reliable local services in their neighborhood (currently focused on Hyderabad).
- **Service Experts (Vendors):** Local business owners, freelancers, and tradespeople wanting to list their business to get direct leads.
- **Volunteers:** Community members who help onboard and verify offline local vendors onto the platform.

## 3. Core Features & Capabilities

### 3.1 Customer Features
- **Hyperlocal Search & Discovery:** A robust search bar with smart categorization and quick-link chips for immediate service lookup.
- **Location Auto-Detection:** Automatically detect user location (or manual entry) to show nearby verified experts.
- **Direct Contact:** Customers can connect with service experts directly via Phone Call or WhatsApp (no built-in chat, encouraging direct business).
- **Multi-language Support:** Accessible in English, Telugu, and Hindi for broader local reach.
- **Reviews & Ratings:** Ability to view expert ratings and leave reviews based on past service interactions.
- **Account Management:** Track past interactions, saved/favorite workers, and booking history.

### 3.2 Vendor (Service Expert) Features
- **Business Listing:** Easy registration process to list services, location, photos, and contact details.
- **Lead Generation:** Direct incoming leads (Calls/WhatsApp) without platform commission per lead.
- **Profile Management:** Dashboard to update service status, availability, and business portfolio.
- **Verification Badges:** Badges for background-verified and top-rated experts to build customer trust.

### 3.3 Volunteer & Admin Features
- **Volunteer Dashboard:** Tools for community volunteers to add and verify local vendors who may not be tech-savvy.
- **Admin Panel:** Global oversight to approve listings, manage reported users, monitor search trends, and manage promotional banners.

## 4. User Interface (UI) & User Experience (UX)
- **Mobile-First Design:** The application is built entirely as a responsive, mobile-first web app (PWA ready).
- **Sticky Header & Smart Scroll:** The top search bar remains sticky on scroll for easy access, while quick links hide dynamically to maximize screen space for results.
- **Dynamic Grid Layout:** Visual category grids with emojis and intuitive icons for fast navigation.
- **Performance:** Fast load times with Vite & React, optimized image loading, and smooth CSS transitions.

## 5. Technical Stack
- **Frontend Framework:** React 18, Vite
- **Styling:** Tailwind CSS (utility-first, fully responsive)
- **Icons & Typography:** Lucide-React icons, Inter/system fonts.
- **Backend/Database:** Node.js (via server.cjs), Supabase (for authentication and PostgreSQL database).
- **Language Support:** Custom built-in translation dictionary mapping (`translations.ts`).

## 6. Future Scope / Roadmap
- **In-App Booking System:** Allow users to schedule exact time slots instead of just direct calls.
- **Payment Gateway Integration:** Optional escrow payments for larger contracts (e.g., catering, events).
- **Expansion:** Launching in more cities beyond Hyderabad.
- **Native Mobile Apps:** Deploying Android and iOS native wrappers for app store presence.

## 7. Launch Criteria
- [x] Functional Search and Filtering
- [x] Working Vendor Registration Flow
- [x] Mobile Responsive Layout Finalized
- [x] Zero TypeScript compilation errors (`npm run lint` passes)
- [x] Successful production build (`npm run build` passes)
- [x] Refined UI scrolling behaviors
