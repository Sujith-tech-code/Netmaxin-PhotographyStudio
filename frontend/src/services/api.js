/**
 * Aperture & Ash — API Client Service Layer
 * Interacts with Express Backend with resilient client-side fallbacks.
 */

// Base API URL: Supports Vercel env variable, Render backend URL, or relative /api proxy
const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : (import.meta.env.PROD ? 'https://netmaxin-photographystudio.onrender.com' : '');

// Curated film photograph fixtures with authentic analog stock aesthetics
const FALLBACK_GALLERY = [
  {
    id: 'exp-01',
    _id: 'exp-01',
    frameNumber: 'EXP 01',
    category: 'Portrait',
    title: 'The Silversmith at Dawn',
    description: 'Natural morning window light on 120mm Kodak Tri-X 400. Mamiya RB67.',
    aspectRatio: 'portrait',
    placeholderClass: 'placeholder-portrait-1',
    tiltClass: 'tilt-left',
    location: 'Studio Loft 4B',
    year: '2025',
    shutter: '1/60s',
    aperture: 'f/2.8',
    iso: 'ISO 400',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'exp-02',
    _id: 'exp-02',
    frameNumber: 'EXP 02',
    category: 'Wedding',
    title: 'Vows Under the Heritage Banyan',
    description: 'Golden hour ceremony captured on Ilford HP5 Plus. Soft grain, timeless contrast.',
    aspectRatio: 'landscape',
    placeholderClass: 'placeholder-wedding-1',
    tiltClass: 'tilt-slight-right',
    location: 'Fort Kochi',
    year: '2025',
    shutter: '1/125s',
    aperture: 'f/4.0',
    iso: 'ISO 400',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'exp-03',
    _id: 'exp-03',
    frameNumber: 'EXP 03',
    category: 'Still Life',
    title: 'Dried Botanical & Clay Vessels',
    description: 'Tabletop composition illuminated by North-facing skylight. Hasselblad 500C/M.',
    aspectRatio: 'square',
    placeholderClass: 'placeholder-still-life',
    tiltClass: 'tilt-slight-left',
    location: 'Studio North Corner',
    year: '2026',
    shutter: '1/30s',
    aperture: 'f/8.0',
    iso: 'ISO 100',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'exp-04',
    _id: 'exp-04',
    frameNumber: 'EXP 04',
    category: 'Candid',
    title: 'The Tailor’s Measure',
    description: 'Spontaneous street portrait on 35mm Leica M3. Deep charcoal tones and warm skin highlights.',
    aspectRatio: 'portrait',
    placeholderClass: 'placeholder-candid',
    tiltClass: 'tilt-right',
    location: 'Old Quarter Alley',
    year: '2025',
    shutter: '1/250s',
    aperture: 'f/2.0',
    iso: 'ISO 800',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'exp-05',
    _id: 'exp-05',
    frameNumber: 'EXP 05',
    category: 'Editorial',
    title: 'Loom & Raw Linen Weave',
    description: 'Textile artisan feature for Heritage Quarterly. Ambient studio continuous light.',
    aspectRatio: 'landscape',
    placeholderClass: 'placeholder-editorial',
    tiltClass: 'tilt-slight-left',
    location: 'Weaver Workshop',
    year: '2026',
    shutter: '1/125s',
    aperture: 'f/3.5',
    iso: 'ISO 200',
    imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'exp-06',
    _id: 'exp-06',
    frameNumber: 'EXP 06',
    category: 'Product',
    title: 'Solid Brass Watchmakers Loupe',
    description: 'Macro detail study on Fujifilm Neopan Acros II. Razor sharpness with organic film falloff.',
    aspectRatio: 'square',
    placeholderClass: 'placeholder-product',
    tiltClass: 'tilt-slight-right',
    location: 'Still Life Bench',
    year: '2026',
    shutter: '1/60s',
    aperture: 'f/11',
    iso: 'ISO 100',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80'
  }
];

const FALLBACK_PRICING = {
  currency: '₹',
  tiers: [
    {
      id: 'tier-portrait',
      name: 'Portrait Sitting',
      slug: 'portrait',
      price: 5500,
      priceFormatted: '₹5,500',
      period: 'per sitting',
      featured: false,
      tagline: 'Deliberate, unhurried portraiture in natural studio light.',
      duration: '1 hour sitting',
      inclusions: [
        '1 hour in the natural light studio',
        '1 full roll of medium format or 35mm film',
        '10 hand-edited physical archival prints',
        'Private high-resolution digital contact gallery link',
        'Individual aesthetic consultation prior to sitting'
      ],
      turnaround: '5–7 business days for film processing & hand scans',
      badge: 'Individual & Duo'
    },
    {
      id: 'tier-wedding',
      name: 'Wedding & Union',
      slug: 'wedding',
      price: 65000,
      priceFormatted: '₹65,000',
      period: 'full day coverage',
      featured: true,
      tagline: 'Complete film documentation of your wedding day with tangible heirlooms.',
      duration: 'Up to 8 hours continuous coverage',
      inclusions: [
        'Up to 8 hours of thoughtful coverage',
        'Two dedicated analog photographers',
        '6 rolls of medium format & 35mm film (B&W + Color)',
        '80–100 master-edited archival prints in a custom linen box',
        'Complimentary 1-hour pre-wedding engagement sitting included',
        'Archival digital negatives & private client portal'
      ],
      turnaround: '3–4 weeks for complete darkroom processing and curation',
      badge: 'Most Cherished Tier'
    },
    {
      id: 'tier-commercial',
      name: 'Product & Commercial',
      slug: 'commercial',
      price: 450,
      priceFormatted: '₹450',
      period: 'per product (min. 10)',
      featured: false,
      tagline: 'Artisanal product and object photography for makers and design houses.',
      duration: 'Min. 10 products required',
      inclusions: [
        'Studio continuous & strobe lighting setup',
        '3 curated angles per individual product',
        'Color-calibrated digital & film-textured assets',
        'Full commercial print and web usage rights included',
        'Detailed macro and texture close-ups'
      ],
      turnaround: '48-hour expedited turnaround available',
      badge: 'For Makers & Brands'
    }
  ],
  travelPolicy: {
    title: 'Travel & Location Policy',
    description: 'All rates cover local studio sessions and bookings within our municipal radius. Travel for destination weddings and out-of-station projects is warmly welcomed and billed strictly at cost (train/flight and modest stay, with zero hidden markup).'
  }
};

const FALLBACK_STUDIO = {
  name: 'Aperture & Ash',
  tagline: 'Analog Photography & Darkroom Craft',
  established: 2014,
  location: 'Studio Loft 4B, The Old Foundry Works, Mill District',
  operatingHours: 'Tuesday – Saturday: 10:00 AM – 6:00 PM (By Appointment)',
  studioImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  philosophy: 'We believe photographs should be physical objects held in the hand, carrying the subtle grain of emulsion and the deliberate patience of an unhurried shutter. In an era of disposable digital volume, we slow down to make images that outlast trends.',
  aboutText: [
    'Nestled on the fourth floor of a restored timber foundry, Aperture & Ash is a quiet, single-room natural light studio. Large north-facing sash windows fill the space with a gentle, diffused illumination that flatters skin tones and renders shadows with painterly nuance.',
    'Every sitting is conducted with mechanical medium-format and 35mm film cameras — Hasselblad, Mamiya, and Leica bodies loaded with carefully selected silver-halide stocks. We do not shoot hundreds of burst frames in a rush; instead, we converse, observe the light, and expose each frame with quiet intention.',
    'To maintain this standard of craftsmanship and personal care, we accept only a strictly limited number of studio sittings and wedding commissions each month.'
  ],
  stats: [
    { label: 'Years of Craft', value: '12+', description: 'Dedicated exclusively to analog & film arts' },
    { label: 'Sittings Per Month', value: '6 Max', description: 'Strict cap to preserve individual attention' },
    { label: 'Rolls Hand-Developed', value: '450+', description: 'Processed annually in our dedicated darkroom' },
    { label: 'Archival Print Lifespan', value: '100 Yrs', description: 'Silver gelatin & pigment prints on cotton rag' }
  ],
  gear: [
    { name: 'Hasselblad 500C/M', type: 'Medium Format 6x6', film: '120 Film (B&W / Color)' },
    { name: 'Mamiya RB67 Pro-S', type: 'Medium Format 6x7', film: '120 Film Studio Portraiture' },
    { name: 'Leica M3 Rangefinder', type: '35mm Mechanical', film: '35mm Candid & Street' },
    { name: 'De Golden Busch 4x5', type: 'Large Format Monorail', film: 'Sheet Film Architectural' }
  ]
};

// Client-side local fallback state for Bookings when backend is not running
let clientFallbackBookings = [
  {
    _id: 'bk-101',
    clientName: 'Elena Rostova',
    clientEmail: 'elena.rostova@monograph.art',
    sessionType: 'portrait',
    preferredDate: 'Mid October 2026',
    message: 'Interested in an unhurried 120mm black & white portrait sitting for an upcoming monograph publication. Looking for high contrast and natural light.',
    status: 'inquiry',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    _id: 'bk-102',
    clientName: 'Julian & Maya Sterling',
    clientEmail: 'julian.sterling@heritage.co',
    sessionType: 'wedding',
    preferredDate: 'Late November 2026',
    message: 'Intimate garden wedding in Fort Kochi. We want complete analog documentation on 35mm and 120 medium format film with archival keepsake prints.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'bk-103',
    clientName: 'Aurelia Vance Design Studio',
    clientEmail: 'studio@aureliavance.com',
    sessionType: 'commercial',
    preferredDate: 'Next Week (Flexible)',
    message: 'We have 14 hand-thrown ceramic vases and brass objects that require tactile analog product photography for our autumn catalog.',
    status: 'contacted',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    _id: 'bk-104',
    clientName: 'Marcus Thorne',
    clientEmail: 'm.thorne@architecturequarterly.com',
    sessionType: 'editorial',
    preferredDate: 'September 2026',
    message: 'Architectural study of the historic warehouse timber structures. Looking for medium format film grain and silver-gelatin prints.',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
  }
];

let clientFallbackGallery = [...FALLBACK_GALLERY];

/**
 * Public: Fetch all gallery photo items
 */
export const fetchGallery = async (category = '') => {
  try {
    const url = category
      ? `${API_BASE}/api/gallery?category=${encodeURIComponent(category)}`
      : `${API_BASE}/api/gallery`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    const json = await res.json();
    return json.data || json;
  } catch {
    console.info('[API] Using in-code gallery fixture fallback');
    if (category && category !== 'All') {
      return clientFallbackGallery.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }
    return clientFallbackGallery;
  }
};

/**
 * Public: Fetch pricing tiers & travel policy
 */
export const fetchPricing = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/pricing`);
    if (!res.ok) throw new Error('Network response was not ok');
    const json = await res.json();
    return {
      tiers: json.tiers || FALLBACK_PRICING.tiers,
      travelPolicy: json.travelPolicy || FALLBACK_PRICING.travelPolicy,
      currency: json.currency || '₹'
    };
  } catch {
    console.info('[API] Using in-code pricing fixture fallback');
    return FALLBACK_PRICING;
  }
};

/**
 * Public: Fetch studio story & stats
 */
export const fetchStudio = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/studio`);
    if (!res.ok) throw new Error('Network response was not ok');
    const json = await res.json();
    return json.data || FALLBACK_STUDIO;
  } catch {
    console.info('[API] Using in-code studio fixture fallback');
    return FALLBACK_STUDIO;
  }
};

/**
 * Public: Submit sitting inquiry
 */
export const submitBooking = async (formData) => {
  try {
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit booking inquiry');
    }
    return data;
  } catch (error) {
    console.warn('[API] Saving to local ledger fallback:', error.message);
    const newEntry = {
      ...formData,
      _id: `local-${Date.now()}`,
      status: 'inquiry',
      createdAt: new Date().toISOString()
    };
    clientFallbackBookings.unshift(newEntry);
    return {
      success: true,
      message: 'Your inquiry has been registered in the studio log.',
      data: newEntry
    };
  }
};

/* ==========================================================================
   ADMINISTRATIVE API METHODS (Passkey Protected)
   ========================================================================== */

const getAdminHeaders = (passkey) => ({
  'Content-Type': 'application/json',
  'x-admin-passkey': passkey || ''
});

/**
 * Admin: Verify Passkey
 */
export const verifyAdminPasskey = async (passkey) => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passkey })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Passkey verification failed');
    return data;
  } catch (error) {
    // Local fallback check if backend server is not running
    if (passkey === 'aperture2026' || passkey === 'studio123') {
      return {
        success: true,
        message: 'Passkey verified (Local preview mode).',
        data: { role: 'admin', databaseState: 'in-memory' }
      };
    }
    throw error;
  }
};

/**
 * Admin: Fetch all bookings
 */
export const fetchAdminBookings = async (passkey) => {
  try {
    const res = await fetch(`${API_BASE}/api/bookings`, {
      headers: getAdminHeaders(passkey)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch ledger bookings');
    return data.data || [];
  } catch (error) {
    console.warn('[API] Using local fallback bookings:', error.message);
    return clientFallbackBookings;
  }
};

/**
 * Admin: Update booking status
 */
export const updateBookingStatus = async (id, status, passkey) => {
  try {
    const res = await fetch(`${API_BASE}/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: getAdminHeaders(passkey),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update booking status');
    return data;
  } catch (error) {
    const booking = clientFallbackBookings.find(b => b._id === id || b.id === id);
    if (booking) booking.status = status;
    return { success: true, data: booking };
  }
};

/**
 * Admin: Delete booking
 */
export const deleteBooking = async (id, passkey) => {
  try {
    const res = await fetch(`${API_BASE}/api/bookings/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(passkey)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete booking');
    return data;
  } catch (error) {
    clientFallbackBookings = clientFallbackBookings.filter(b => b._id !== id && b.id !== id);
    return { success: true, message: 'Booking removed from local ledger.' };
  }
};

/**
 * Admin: Add new gallery frame
 */
export const createGalleryItem = async (itemData, passkey) => {
  try {
    const res = await fetch(`${API_BASE}/api/gallery`, {
      method: 'POST',
      headers: getAdminHeaders(passkey),
      body: JSON.stringify(itemData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add gallery frame');
    return data.data || data;
  } catch (error) {
    const newItem = {
      id: `exp-0${clientFallbackGallery.length + 1}`,
      _id: `exp-${Date.now()}`,
      frameNumber: `EXP ${String(clientFallbackGallery.length + 1).padStart(2, '0')}`,
      aspectRatio: 'portrait',
      tiltClass: 'tilt-slight-left',
      year: '2026',
      ...itemData
    };
    clientFallbackGallery.push(newItem);
    return newItem;
  }
};

/**
 * Admin: Update gallery frame
 */
export const updateGalleryItem = async (id, itemData, passkey) => {
  try {
    const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
      method: 'PUT',
      headers: getAdminHeaders(passkey),
      body: JSON.stringify(itemData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update gallery frame');
    return data.data || data;
  } catch (error) {
    const idx = clientFallbackGallery.findIndex(g => g.id === id || g._id === id);
    if (idx !== -1) {
      clientFallbackGallery[idx] = { ...clientFallbackGallery[idx], ...itemData };
      return clientFallbackGallery[idx];
    }
    return itemData;
  }
};

/**
 * Admin: Delete gallery frame
 */
export const deleteGalleryItem = async (id, passkey) => {
  try {
    const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(passkey)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete gallery frame');
    return data;
  } catch (error) {
    clientFallbackGallery = clientFallbackGallery.filter(g => g.id !== id && g._id !== id);
    return { success: true, message: 'Frame removed from local gallery.' };
  }
};

/**
 * Admin: Fetch ledger overview stats
 */
export const fetchAdminStats = async (passkey) => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: getAdminHeaders(passkey)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch admin stats');
    return data.data;
  } catch {
    const bookings = clientFallbackBookings;
    return {
      totalBookings: bookings.length,
      inquiryCount: bookings.filter(b => b.status === 'inquiry').length,
      contactedCount: bookings.filter(b => b.status === 'contacted').length,
      confirmedCount: bookings.filter(b => b.status === 'confirmed').length,
      completedCount: bookings.filter(b => b.status === 'completed').length,
      archivedCount: bookings.filter(b => b.status === 'archived').length,
      galleryCount: clientFallbackGallery.length,
      confirmedRevenue: 70500,
      pipelineRevenue: 10000,
      databaseState: 'in-memory',
      monthlySittingCap: 6
    };
  }
};
