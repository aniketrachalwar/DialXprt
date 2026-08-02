# Project Memory & Context: DialXprt

> **Note to AI Agents and Developers:** Read this file to immediately understand the current context, recent changes, and ongoing tasks for the DialXprt project.

## 1. Project Identity
- **Name:** DialXprt
- **Purpose:** A hyperlocal, mobile-first web application connecting users in Hyderabad with local service experts (plumbers, electricians, tailors, etc.) via direct Phone/WhatsApp.
- **Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, Node.js (esbuild).
- **Core Philosophies:** Zero TypeScript errors (`npm run lint` must pass), mobile-first responsive design, highly performant UI with CSS micro-interactions.

## 2. Current State & Recent Major Changes
*Last Updated: August 2026*

- **TypeScript Strictness:** The project was recently hardened to be 100% "Production Ready". All TypeScript compilation errors were fixed (e.g., missing interfaces in `AccountView.tsx`, file upload blob types in `VendorRegistrationView.tsx`, and `vite.config.ts` allowedHosts typing).
- **UI Header Scroll Logic:** The `Header.tsx` and `App.tsx` were recently modified to implement a smart sticky header. Only the Search Bar stays sticky on scroll, while the Quick Link category pills (`group-[.is-scrolled]:hidden`) disappear to save vertical space for search results.
- **Category Grid Updates:** The top 11 categories on the home screen were manually curated in `src/data/mockVendors.ts` to reflect the exact business requirements (Tours & Travels, Dairy Products, Events, Contractors, Fashion, Fitness, Restaurants, Caterers, Tailor, Jhatka Meat & Poultry, AC Repair). Old duplicate entries for these categories were removed to prevent UI clutter.
- **Font & Size Scaling:** Font sizes and button dimensions across `VendorProfilePage.tsx` and `VendorCard.tsx` were recently reduced to meet the client's preference for a denser, more compact UI.

## 3. Active Architecture Notes
- The app relies on a heavy `mockVendors.ts` file for static data to demonstrate functionality before transitioning fully to Supabase PostgreSQL.
- State is managed extensively in `App.tsx` (acting as the orchestrator) and passed down via props.
- Translations (English, Telugu, Hindi) are handled by a custom dictionary in `src/lib/translations.ts`.

## 4. Pending / Next Steps (Roadmap)
- **Database Migration:** Replace the mock static data with live queries from the Supabase database.
- **Live Vendor Onboarding:** Connect the `VendorRegistrationView.tsx` form directly to the backend to allow real businesses to list themselves.
- **Authentication Implementation:** Connect the `AuthModal.tsx` to Supabase Auth so customers and vendors can log in securely.
- **Native Deployment:** Prepare the web bundle for native wrapping (Capacitor/React Native) for App Store/Play Store launch.

## 5. Important Commands
- `npm run dev` - Start local development server.
- `npm run lint` - Run strict TypeScript compiler checks. **MUST PASS before commits.**
- `npm run build` - Create the production optimized Vite bundle and `server.cjs` via esbuild.
