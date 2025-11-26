# Frontend Development Roadmap

**Project:** OmiseBiz - Restaurant Management Platform  
**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui  
**Backend API:** http://localhost:4000

---

## 🎯 Overview

This roadmap covers the complete frontend development for the restaurant management platform. The backend MVP is fully complete with all necessary endpoints implemented.

---

## 🛠️ Tech Stack Justification

- **Next.js 14+** - App Router for modern React with RSC, optimized for SEO
- **TypeScript** - Type safety across the application
- **Tailwind CSS** - Utility-first styling for rapid development
- **shadcn/ui** - High-quality, customizable components based on Radix UI
- **React Hook Form** - Performant forms with validation
- **Zod** - Schema validation matching backend
- **Axios** - HTTP client for API calls
- **Zustand** - Lightweight state management for auth

---

## Phase 1: Project Setup & Infrastructure (Week 1)

### Initialization
- [ ] Create Next.js project with TypeScript
  ```bash
  npx create-next-app@latest omisebiz-frontend --typescript --tailwind --app
  ```
- [ ] Install shadcn/ui and configure
  ```bash
  npx shadcn-ui@latest init
  ```
- [ ] Setup project structure
  ```
  /app
    /(auth)         # Auth pages
    /(dashboard)    # Protected admin pages
    /r/[slug]       # Public restaurant pages
  /components
    /ui             # shadcn components
    /forms          # Form components
    /restaurant     # Restaurant-specific
    /layout         # Layout components
  /lib
    /api.ts         # API client
    /auth.ts        # Auth utilities
    /validations.ts # Zod schemas
  ```

### Dependencies
- [ ] Install core dependencies
  ```bash
  npm install axios zustand react-hook-form @hookform/resolvers zod
  npm install date-fns clsx tailwind-merge
  npm install lucide-react  # Icons
  ```
- [ ] Install shadcn/ui components
  ```bash
  npx shadcn-ui@latest add button input form card dialog textarea select
  npx shadcn-ui@latest add dropdown-menu avatar badge tabs switch
  ```

### Configuration
- [ ] Setup environment variables (`.env.local`)
  ```
  NEXT_PUBLIC_API_URL=http://localhost:4000
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ```
- [ ] Configure Tailwind with custom theme
- [ ] Setup API client with interceptors
- [ ] Create auth store with Zustand
- [ ] Setup middleware for protected routes

---

## Phase 2: Authentication & User Management (Week 1-2)

### Pages
- [ ] `/login` - Login page
- [ ] `/register` - Registration page
- [ ] `/forgot-password` - Password recovery (future)

### Components
- [ ] **LoginForm**
  - Email input (validation)
  - Password input (6 digits)
  - Submit button with loading state
  - Error handling
- [ ] **RegisterForm**
  - Email, username, password fields
  - Client-side validation with Zod
  - Success/error messages

### API Integration
- [ ] `POST /auth/register`
- [ ] `POST /auth/login`
- [ ] `GET /auth/me`
- [ ] Token storage (localStorage + auth store)
- [ ] Auto-refresh logic

### State Management
- [ ] Auth store (Zustand)
  - User state
  - Token management
  - Login/logout actions
  - Session persistence

---

## Phase 3: Dashboard Layout & Navigation (Week 2)

### Layout
- [ ] **DashboardLayout**
  - Sidebar navigation
    - Logo
    - Menu items (Restaurants, Settings)
    - User avatar + dropdown
  - Mobile responsive (hamburger menu)
  - Header with breadcrumbs

### Navigation
- [ ] `/dashboard` - Dashboard home (redirect to `/dashboard/restaurants`)
- [ ] `/dashboard/restaurants` - Restaurant list
- [ ] `/dashboard/restaurants/new` - Create restaurant
- [ ] `/dashboard/restaurants/[id]/edit` - Edit restaurant
- [ ] `/dashboard/settings` - User settings

### Components
- [ ] **Sidebar**
- [ ] **Header**
- [ ] **UserMenu** (avatar + dropdown)
- [ ] **MobileNav**

---

## Phase 4: Restaurant List & Management (Week 2-3)

### Restaurant List Page
- [ ] **GET /restaurants** integration
- [ ] Restaurant cards grid
  - Cover image
  - Name, category, address
  - Published/Draft badge
  - Quick actions (Edit, View, Delete)
- [ ] Empty state (no restaurants)
- [ ] Loading skeletons
- [ ] Search/filter functionality

### Components
- [ ] **RestaurantCard**
  - Preview image
  - Status badge
  - Action buttons
- [ ] **EmptyState**
- [ ] **DeleteConfirmDialog**

---

## Phase 5: Create/Edit Restaurant Form (Week 3-4)

This is the most complex part - full Google Business Profile imitation.

### Multi-Step Form Structure
Use **Tabs** for organization:
1. Basic Info
2. Contacts & Location
3. Hours
4. Attributes
5. Media
6. Social Media

### Tab 1: Basic Info
- [ ] Name (required, validation)  
- [ ] Category/Type (select dropdown)  
- [ ] Description (textarea, 750 char limit with counter)  
- [ ] Price Range ($, $$, $$$, $$$$) - radio buttons

### Tab 2: Contacts & Location
- [ ] Phone number (formatted input)  
- [ ] Email  
- [ ] Website URL  
- [ ] Address fields (street, city, zip, country)  
- [ ] **Map picker** (Google Maps or Mapbox API)
  - Visual map with draggable marker
  - Auto-geocoding from address
  - Display lat/lng

### Tab 3: Hours of Operation
- [ ] Day-by-day schedule builder
  - Toggle for each day (open/closed)
  - Time pickers (open/close)
  - "24 hours" checkbox
  - "Temporarily closed" option
- [ ] Copy to all days button
- [ ] Visual preview of current status

### Tab 4: Attributes
Group checkboxes by category:
- [ ] **Accessibility**  
  Wheelchair entrance, parking, restroom
- [ ] **Amenities**  
  Wi-Fi, Parking, Terrace, Kids zone, Live music, Hookah
- [ ] **Payment Methods**  
  Cash, Cards, Apple Pay, Google Pay
- [ ] **Atmosphere**  
  Casual, Cozy, Romantic, Family-friendly
- [ ] **Services**  
  Dine-in, Takeout, Delivery, Reservations, Outdoor seating

### Tab 5: Media
- [ ] **Logo Upload**  
  Square image, drag-and-drop  
  Use `POST /api/upload/image`
- [ ] **Cover Image Upload**  
  Wide image
- [ ] **Gallery** (multiple images)  
  Upload with `POST /api/upload/images` (max 10 at once)  
  Drag-and-drop zone  
  Image preview grid with delete buttons  
  Category tags (Interior, Exterior, Food, Team, Other)

### Tab 6: Social Media
- [ ] Instagram URL  
- [ ] Facebook URL  
- [ ] TikTok URL (optional)  
- [ ] YouTube URL (optional)

### Form Features
- [ ] **Auto-save drafts** (every 30 seconds)  
- [ ] **Progress indicator** (show completion %)  
- [ ] **Real-time validation** with Zod  
- [ ] **Preview mode** - show how public page will look  
- [ ] Publish/Unpublish toggle  
- [ ] Save button with loading state

### Components
- [ ] **RestaurantFormContainer** (main form wrapper)
- [ ] **BasicInfoTab**
- [ ] **ContactsTab**
- [ ] **HoursTab** (with **DayScheduleInput** component)
- [ ] **AttributesTab**
- [ ] **MediaTab** (with **ImageUploader**, **ImageGallery**)
- [ ] **SocialTab**
- [ ] **FormProgress** indicator
- [ ] **PreviewDialog**

---

## Phase 6: Public Restaurant Page (Week 4-5)

### Page Structure
`/r/[slug]` - Dynamic route

### Sections (in order)
1. **Hero Section**  
   - Cover image background
   - Logo overlay
   - Restaurant name
   - Current status ("Open Now" / "Closed" with color)
   
2. **Action Buttons Bar**  
   - 📞 Call (tel: link)
   - 🗺️ Get Directions (Google Maps)
   - 🌐 Visit Website
   - Share button

3. **Description**  
   Full description text

4. **Photo Gallery**  
   Grid layout with lightbox on click

5. **Info Cards**  
   - **Hours** - expandable list showing all days
   - **Address** - with embedded map
   - **Contact** - phone, email
   - **Attributes** - icons for Wi-Fi, parking, etc.

6. **Menu Section** (if available)  
   Display PDF or images

7. **Social Media Links**  
   Icon buttons

### SEO Requirements
- [ ] Dynamic `<title>` and `<meta>` tags
- [ ] Open Graph tags for social sharing
- [ ] Schema.org/Restaurant structured data (JSON-LD)
- [ ] Sitemap generation (all public restaurants)

### Components
- [ ] **PublicRestaurantPage**
- [ ] **HeroSection**
- [ ] **ActionBar**
- [ ] **PhotoGallery** (with lightbox)
- [ ] **InfoCard**
- [ ] **HoursDisplay**
- [ ] **MapEmbed**
- [ ] **SocialLinks**

---

## Phase 7: Polish & Optimization (Week 5-6)

### UI/UX Improvements
- [ ] Loading states everywhere
- [ ] Skeleton loaders
- [ ] Error boundaries
- [ ] Toast notifications (success/error)
- [ ] Confirmation dialogs
- [ ] Form field hints and examples
- [ ] Responsive design testing
- [ ] Dark mode support (optional)

### Performance
- [ ] Image optimization (Next.js Image)
- [ ] Lazy loading for images
- [ ] Route prefetching
- [ ] Bundle size analysis
- [ ] Lighthouse audit (score >90)

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Focus management
- [ ] ARIA labels

---

## Phase 8: Testing & Deployment (Week 6)

### Testing
- [ ] Manual testing all flows
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile testing (iOS, Android)
- [ ] Form validation edge cases

### Deployment
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Custom domain setup
- [ ] SSL certificate
- [ ] Analytics setup (optional)

---

## 📦 Key Libraries Summary

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0",
  "shadcn/ui": "latest",
  "axios": "^1.6.0",
  "zustand": "^4.4.0",
  "react-hook-form": "^7.48.0",
  "@hookform/resolvers": "^3.3.0",
  "zod": "^3.22.0",
  "date-fns": "^2.30.0",
  "lucide-react": "^0.292.0"
}
```

---

## 🎨 Design Guidelines

- **Color Palette:** Use Tailwind default or customize
- **Typography:** Inter or system fonts
- **Spacing:** Consistent 4px/8px grid
- **Animations:** Subtle, fast (duration-200)
- **Forms:** Clear labels, inline validation, helpful errors
- **Buttons:** Primary/Secondary hierarchy
- **Images:** WebP format, lazy loaded, with fallbacks

---

## 🔗 Integration with Backend

All API endpoints documented in `backend-api-reference.md`.

**Base URL:** `NEXT_PUBLIC_API_URL`

**Auth Header:**
```
Authorization: Bearer <token>
```

**Error Handling:**
- 401 → Redirect to login
- 404 → Show not found page
- 500 → Show error toast

---

## 📝 Post-MVP Features (Future)

- **Reviews & Ratings** - User-generated reviews
- **Reservation System** - Table booking
- **Analytics Dashboard** - Views, clicks tracking
- **Multi-language** - i18n support
- **Team Management** - Role-based access
- **Notification System** - Email/push notifications

---

**Estimated Timeline:** 6-8 weeks for full MVP
