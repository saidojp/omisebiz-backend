# Frontend Development Roadmap

**Project:** OmiseBiz - Restaurant Management Platform  
**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Material UI (MUI)  
**Backend API:** http://localhost:4000

---

## 🎯 Overview

This roadmap covers the complete frontend development for the restaurant management platform. The backend MVP is fully complete with all necessary endpoints implemented.

---

## 🛠️ Tech Stack Justification

- **Next.js 14+** - App Router for modern React with RSC, optimized for SEO
- **TypeScript** - Type safety across the application
- **Tailwind CSS** - Utility-first styling alongside MUI
- **Material UI (MUI)** - Production-ready React components with Material Design
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
- [ ] Install Material UI and configure
  ```bash
  npm install @mui/material @emotion/react @emotion/styled
  npm install @mui/icons-material
  ```
- [ ] Setup project structure
  ```
  /app
    /(auth)         # Auth pages
    /(dashboard)    # Protected admin pages
    /r/[slug]       # Public restaurant pages
  /components
    /ui             # Custom UI components
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
  ```
- [ ] Configure MUI theme
  - Create `theme.ts` with custom colors and typography
  - Wrap app with `ThemeProvider` in root layout

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
  - MUI `TextField` for email and password
  - MUI `Button` with loading state (`CircularProgress`)
  - MUI `Alert` for error handling
- [ ] **RegisterForm**
  - MUI `TextField` components
  - Client-side validation with Zod
  - MUI `Snackbar` for success/error messages

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
  - MUI `Drawer` for sidebar navigation
    - Logo
    - MUI `List` with `ListItem` for menu
    - MUI `Avatar` + `Menu` for user dropdown
  - Mobile responsive (MUI `AppBar` + hamburger)
  - MUI `Breadcrumbs` in header

### Navigation
- [ ] `/dashboard` - Dashboard home (redirect to `/dashboard/restaurants`)
- [ ] `/dashboard/restaurants` - Restaurant list
- [ ] `/dashboard/restaurants/new` - Create restaurant
- [ ] `/dashboard/restaurants/[id]/edit` - Edit restaurant
- [ ] `/dashboard/settings` - User settings

### Components
- [ ] **Sidebar** (MUI `Drawer`)
- [ ] **Header** (MUI `AppBar`)
- [ ] **UserMenu** (MUI `Avatar` + `Menu`)
- [ ] **MobileNav** (MUI responsive `Drawer`)

---

## Phase 4: Restaurant List & Management (Week 2-3)

### Restaurant List Page
- [ ] **GET /restaurants** integration
- [ ] MUI `Grid` layout with `Card` components
  - MUI `CardMedia` for cover image
  - MUI `CardContent` for name, category, address
  - MUI `Chip` for Published/Draft badge
  - MUI `IconButton` for quick actions
- [ ] Empty state with MUI `Box` and `Typography`
- [ ] MUI `Skeleton` components for loading
- [ ] MUI `TextField` with `InputAdornment` for search

### Components
- [ ] **RestaurantCard** (MUI `Card`)
  - MUI `CardMedia` for image
  - MUI `Chip` for status
  - MUI `IconButton` for actions
- [ ] **EmptyState** (MUI `Box` + `Typography`)
- [ ] **DeleteConfirmDialog** (MUI `Dialog`)

---

## Phase 5: Create/Edit Restaurant Form (Week 3-4)

This is the most complex part - full Google Business Profile imitation.

### Multi-Step Form Structure
Use MUI **Tabs** for organization:
1. Basic Info
2. Contacts & Location
3. Hours
4. Attributes
5. Media
6. Social Media

### Tab 1: Basic Info
- [ ] Name - MUI `TextField` (required, validation)  
- [ ] Category - MUI `Select` with `MenuItem`
- [ ] Description - MUI `TextField` multiline (750 char limit with counter)  
- [ ] Price Range - MUI `RadioGroup` with `Radio` buttons

### Tab 2: Contacts & Location
- [ ] Phone number - MUI `TextField` with input mask
- [ ] Email - MUI `TextField` with validation
- [ ] Website URL - MUI `TextField`
- [ ] Address fields - MUI `TextField` grid layout
- [ ] **Map picker** (Google Maps or Mapbox API)
  - Visual map with draggable marker
  - Auto-geocoding from address
  - Display lat/lng in MUI `Typography`

### Tab 3: Hours of Operation
- [ ] Day-by-day schedule builder
  - MUI `Switch` for each day (open/closed)
  - MUI `TimePicker` for open/close times
  - MUI `Checkbox` for "24 hours"
  - MUI `Checkbox` for "Temporarily closed"
- [ ] MUI `Button` to copy to all days
- [ ] Visual preview with MUI `Chip` showing status

### Tab 4: Attributes
Group MUI `Checkbox` by category with `FormGroup`:
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
  MUI `Button` with file input, drag-and-drop area
  Use `POST /api/upload/image`
- [ ] **Cover Image Upload**  
  MUI upload button
- [ ] **Gallery** (multiple images)  
  Upload with `POST /api/upload/images` (max 10 at once)  
  MUI drag-and-drop zone with `Box`
  MUI `ImageList` for preview with `IconButton` delete
  MUI `Select` for category tags

### Tab 6: Social Media
- [ ] Instagram URL - MUI `TextField`
- [ ] Facebook URL - MUI `TextField`
- [ ] TikTok URL (optional) - MUI `TextField`
- [ ] YouTube URL (optional) - MUI `TextField`

### Form Features
- [ ] **Auto-save drafts** (every 30 seconds)  
- [ ] **Progress indicator** - MUI `LinearProgress` (show completion %)
- [ ] **Real-time validation** with Zod  
- [ ] **Preview mode** - MUI `Dialog` showing public page  
- [ ] Publish/Unpublish - MUI `Switch`
- [ ] Save button - MUI `Button` with `CircularProgress`

### Components
- [ ] **RestaurantFormContainer** (MUI `Box` wrapper)
- [ ] **BasicInfoTab** (MUI form fields)
- [ ] **ContactsTab** (MUI form fields)
- [ ] **HoursTab** (with **DayScheduleInput** using MUI components)
- [ ] **AttributesTab** (MUI `FormGroup` with `Checkbox`)
- [ ] **MediaTab** (with **ImageUploader**, **ImageGallery** using MUI)
- [ ] **SocialTab** (MUI form fields)
- [ ] **FormProgress** (MUI `LinearProgress`)
- [ ] **PreviewDialog** (MUI `Dialog`)

---

## Phase 6: Public Restaurant Page (Week 4-5)

### Page Structure
`/r/[slug]` - Dynamic route

### Sections (in order)
1. **Hero Section**  
   - Cover image background
   - Logo overlay (MUI `Avatar`)
   - Restaurant name (MUI `Typography` variant="h2")
   - Current status (MUI `Chip` with color variants)
   
2. **Action Buttons Bar**  
   - MUI `Button` with `PhoneIcon` (tel: link)
   - MUI `Button` with `DirectionsIcon` (Google Maps)
   - MUI `Button` with `LanguageIcon` (website)
   - MUI `IconButton` with `ShareIcon`

3. **Description**  
   Full description text

4. **Photo Gallery**  
   MUI `ImageList` with lightbox on click

5. **Info Cards**  
   - **Hours** - MUI `Accordion` showing all days
   - **Address** - MUI `Card` with embedded map
   - **Contact** - MUI `Card` with phone, email
   - **Attributes** - MUI `Chip` array for Wi-Fi, parking, etc.

6. **Menu Section** (if available)  
   Display PDF or images

7. **Social Media Links**  
   MUI `IconButton` with brand icons

### SEO Requirements
- [ ] Dynamic `<title>` and `<meta>` tags
- [ ] Open Graph tags for social sharing
- [ ] Schema.org/Restaurant structured data (JSON-LD)
- [ ] Sitemap generation (all public restaurants)

### Components
- [ ] **PublicRestaurantPage** (MUI `Container`)
- [ ] **HeroSection** (MUI `Box` with background)
- [ ] **ActionBar** (MUI `Stack` of buttons)
- [ ] **PhotoGallery** (MUI `ImageList` with lightbox)
- [ ] **InfoCard** (MUI `Card`)
- [ ] **HoursDisplay** (MUI `Accordion`)
- [ ] **MapEmbed** (iframe in MUI `Card`)
- [ ] **SocialLinks** (MUI `IconButton` group)

---

## Phase 7: Polish & Optimization (Week 5-6)

### UI/UX Improvements
- [ ] MUI `CircularProgress` for loading states
- [ ] MUI `Skeleton` components
- [ ] Error boundaries
- [ ] MUI `Snackbar` for toast notifications
- [ ] MUI `Dialog` for confirmations
- [ ] MUI `FormHelperText` for hints
- [ ] MUI responsive breakpoints testing
- [ ] MUI dark mode with `ThemeProvider`

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
  "@mui/material": "^5.14.0",
  "@mui/icons-material": "^5.14.0",
  "@emotion/react": "^11.11.0",
  "@emotion/styled": "^11.11.0",
  "axios": "^1.6.0",
  "zustand": "^4.4.0",
  "react-hook-form": "^7.48.0",
  "@hookform/resolvers": "^3.3.0",
  "zod": "^3.22.0",
  "date-fns": "^2.30.0"
}
```

---

## 🎨 Design Guidelines

- **Color Palette:** MUI theme with custom primary/secondary colors
- **Typography:** MUI default (Roboto) or customize in theme
- **Spacing:** MUI spacing system (theme.spacing)
- **Animations:** MUI transitions and animations
- **Forms:** MUI form components with `FormHelperText`
- **Buttons:** MUI `Button` variants (contained, outlined, text)
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
