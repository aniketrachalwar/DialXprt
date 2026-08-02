# Project Rules & Guidelines: DialXprt

Welcome to the DialXprt codebase. To ensure code quality, maintainability, and a consistent user experience, all developers and contributors must adhere to the following rules and guidelines.

## 1. Coding Standards

### 1.1 TypeScript & Type Safety
- **Strict Typing:** All new code must be written in TypeScript with strict typing enabled (`strict: true` in `tsconfig.json`).
- **No `any`:** Avoid using the `any` type. If a type is temporarily unknown, use `unknown` and perform type checking, or define a proper interface in `src/types.ts`.
- **Zero Errors Policy:** The codebase must ALWAYS pass the TypeScript compiler check. Run `npm run lint` before committing any code to ensure there are zero type errors.

### 1.2 React & Components
- **Functional Components Only:** Use React functional components (`React.FC`) with React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`). Do not use class components.
- **Modularity:** Keep components small, focused, and reusable. If a component file exceeds 300 lines, consider breaking it down into smaller sub-components.
- **Props Interfaces:** Always define an interface for component props immediately above the component declaration.

### 1.3 Styling (Tailwind CSS)
- **Utility-First:** Use Tailwind CSS utility classes for all styling. Avoid writing custom CSS in `.css` files unless absolutely necessary for complex animations or global resets.
- **Responsive Design:** DialXprt is a **mobile-first** application. Always design for mobile screens first, then use Tailwind's `sm:`, `md:`, and `lg:` prefixes to scale the design up for larger screens.
- **Consistent Colors:** Stick to the defined color palette (e.g., `#1E2875` for primary headers, `#F36F21` for primary buttons, `#1A9E9E` for secondary accents). Avoid hardcoding arbitrary hex codes that aren't part of the brand.

## 2. Architecture & File Structure Rules

### 2.1 File Placement
- **Components:** Place all React UI components inside `src/components/`.
- **Data:** Keep all mock data, JSON, and static configurations inside `src/data/`.
- **Types:** Centralize shared TypeScript interfaces in `src/types.ts` so they can be easily imported across the app.
- **Utilities:** Place shared logic, helpers, and configurations (like translations or database clients) in `src/lib/`.

### 2.2 Naming Conventions
- **Files & Folders:** Use PascalCase for React component files (e.g., `CategoryGrid.tsx`). Use camelCase for utility files and data files (e.g., `mockVendors.ts`, `translations.ts`).
- **Variables & Functions:** Use camelCase for standard variables and functions. Use CONSTANT_CASE (all caps with underscores) for global constants or immutable configuration objects.
- **Interfaces & Types:** Use PascalCase for interface names (e.g., `CustomerWorkerInteraction`). Do not prefix with `I` (e.g., avoid `ICustomer`).

## 3. Business & UI Rules

### 3.1 Scroll & Layout Behaviors
- **Sticky Elements:** The top header and search bar should remain sticky (`sticky top-0 z-40`) to ensure users can always search. However, secondary elements (like Quick Links) should hide on scroll to maximize screen real estate for search results.
- **Safe Areas:** Ensure padding accommodates mobile notches and system navigation bars by utilizing `pt-safe` and `pb-safe` (or CSS `env(safe-area-inset-top)`).

### 3.2 Performance & Asset Management
- **Image Handling:** Always use optimized, compressed images. If pulling from Unsplash or external sources, append query parameters (like `?q=80&w=400`) to request smaller image sizes to save bandwidth.
- **Icons:** Use the `lucide-react` library for consistent, lightweight SVG icons instead of importing heavy image files.

## 4. Git & Workflow Rules
- **Commit Messages:** Write clear, concise commit messages detailing *what* changed and *why*. 
- **Build Before Commit:** You must run `npm run lint` and `npm run build` before finalizing any feature to guarantee the production build does not break.
- **Clean up dead code:** Do not leave unused imports, `console.log` statements, or commented-out code blocks in production commits.
