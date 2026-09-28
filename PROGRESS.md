# Aperture & Ash — Project Roadmap & Progress Tracker

## Project Overview
- **Aesthetic:** Vintage Film Photography Studio (Portraits, Weddings, Products)
- **Stack:** Full-Stack (React 18 + Vite, Node.js + Express, MongoDB + Mongoose, Vercel)
- **Data Persistence:** In-code fixtures + MongoDB dual-mode (graceful offline fallback)
- **Design Tokens:** Warm Parchment `#f6f1e8`, Dark Ink `#2a231d`, Rust Red `#a2432a`, Gold Ochre `#bd8624`, Olive Green `#566443`
- **Typography:** Fraunces (Headings), Libre Baskerville (Body), Courier Prime (Typewriter stamps/captions)
- **Dark Mode:** Automatic darkroom theme via `@media (prefers-color-scheme: dark)`

---

## Phases & Milestones

### [x] Phase 1: Architecture & Workspace Setup
- [x] Monorepo workspace setup (`package.json`, `.gitignore`, `.env.example`)
- [x] Vercel serverless deployment routing (`vercel.json`)
- [x] Backend initialization (`backend/package.json`, `backend/server.js`, `backend/config/db.js`)
- [x] Frontend initialization (`frontend/package.json`, `frontend/vite.config.js`, `frontend/index.html`, `frontend/src/main.jsx`, `frontend/src/App.jsx`)

### [x] Phase 2: Backend API, In-Code Data Fixtures, Models & Middleware
- [x] In-Code data fixtures (`galleryData.js`, `pricingData.js`, `studioData.js`, `inMemoryStore.js`)
- [x] MongoDB Mongoose models (`Booking.js`, `GalleryItem.js`, `PricingTier.js`)
- [x] Centralized middlewares: request validator (`validator.js`), custom error handler (`errorHandler.js`), CORS
- [x] Modular controllers & Express REST endpoints (`GET /api/gallery`, `GET /api/pricing`, `GET /api/studio`, `POST /api/bookings`)

### [x] Phase 3: Frontend Design System & Shared Components
- [x] Global styling & custom properties (`variables.css`, `global.css`)
- [x] Responsive vintage Header & Navigation with active route indicators (`Navbar.jsx`, `Navbar.css`)
- [x] Artisanal Footer (`Footer.jsx`, `Footer.css`)
- [x] Reusable `FilmPrint` photo component with loose-print borders, stamps, and 1-line image swap (`FilmPrint.jsx`, `FilmPrint.css`)
- [x] Helper UI components: `PageHeader.jsx`, `Stamp.jsx`
- [x] Centralized API client service layer with in-code fallbacks (`frontend/src/services/api.js`)

### [x] Phase 4: Frontend Pages & API Integration
- [x] **Home Page (`/`)**: Hero story, 3-print angled teaser gallery, direct Work & Pricing CTAs (`Home.jsx`, `Home.css`)
- [x] **Gallery Page (`/gallery`)**: Contact-sheet irregular photo grid with frame metadata (`EXP 01` to `EXP 06`), category filter tabs, and film emulsion specs (`Gallery.jsx`, `Gallery.css`)
- [x] **Pricing Page (`/pricing`)**: 3 Service tiers (Portrait, Wedding [featured badge], Commercial), turnaround times, and travel policy note (`Pricing.jsx`, `Pricing.css`)
- [x] **Studio Page (`/studio`)**: Natural light story, medium-format film craft, 4-stat metrics counter, and camera apparatus specs (`Studio.jsx`, `Studio.css`)

### [x] Phase 5: Booking Inquiry System, Full-Stack Testing & Polish
- [x] **Contact Page (`/contact`)**: Booking form with live validation, query param pre-selection (`?session=wedding`), and API submission (`Contact.jsx`, `Contact.css`)
- [x] Typewriter receipt confirmation display (`ENTRY REF`, `COMMISSION TYPE`, `STATUS`)
- [x] 404 Blank Negative page (`NotFound.jsx`)

### [x] Phase 6: Passkey-Protected Admin Dashboard & Photo Visuals
- [x] High-resolution authentic analog film photography wired across Home, Gallery, and Studio pages
- [x] Backend passkey auth middleware (`adminAuth`) protecting `/api/bookings` & `/api/gallery` CRUD
- [x] Administrative Verification API (`POST /api/admin/verify`, `GET /api/admin/stats`)
- [x] Full-featured vintage Admin Dashboard (`/admin`):
  - Passkey lock gate with default `aperture2026`
  - Sittings ledger table with search, status filters (`inquiry`, `contacted`, `confirmed`, `completed`, `archived`)
  - Status updates and delete actions
  - Full client message inspection modal & direct email reply links
  - CSV export & Print capabilities
  - Gallery curation manager (Add new frames, live image preview, edit settings, delete frames)
  - Studio capacity gauge (6 sittings/mo cap) & rate card overview
  - Direct lock/logout controls
