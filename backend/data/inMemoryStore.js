/**
 * In-Memory Fallback Store
 * Enables the app to function with zero external database configuration,
 * supporting full CRUD for bookings and gallery frames.
 */

let inMemoryBookings = [
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

let inMemoryGallery = [
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

// Bookings Methods
const getBookings = () => inMemoryBookings;

const addBooking = (bookingData) => {
  const newBooking = {
    _id: `mem-${Date.now()}`,
    ...bookingData,
    status: bookingData.status || 'inquiry',
    createdAt: new Date().toISOString()
  };
  inMemoryBookings.unshift(newBooking);
  return newBooking;
};

const updateBookingStatus = (id, status) => {
  const booking = inMemoryBookings.find(b => b._id === id || b.id === id);
  if (booking) {
    booking.status = status;
    return booking;
  }
  return null;
};

const deleteBooking = (id) => {
  const initialLength = inMemoryBookings.length;
  inMemoryBookings = inMemoryBookings.filter(b => b._id !== id && b.id !== id);
  return inMemoryBookings.length < initialLength;
};

// Gallery Methods
const getGallery = () => inMemoryGallery;

const addGalleryItem = (itemData) => {
  const newItem = {
    id: `exp-0${inMemoryGallery.length + 1}`,
    _id: `exp-${Date.now()}`,
    frameNumber: `EXP ${String(inMemoryGallery.length + 1).padStart(2, '0')}`,
    aspectRatio: 'portrait',
    placeholderClass: 'placeholder-portrait-1',
    tiltClass: 'tilt-slight-left',
    year: '2026',
    ...itemData
  };
  inMemoryGallery.push(newItem);
  return newItem;
};

const updateGalleryItem = (id, itemData) => {
  const index = inMemoryGallery.findIndex(g => g.id === id || g._id === id);
  if (index !== -1) {
    inMemoryGallery[index] = { ...inMemoryGallery[index], ...itemData };
    return inMemoryGallery[index];
  }
  return null;
};

const deleteGalleryItem = (id) => {
  const initialLength = inMemoryGallery.length;
  inMemoryGallery = inMemoryGallery.filter(g => g.id !== id && g._id !== id);
  return inMemoryGallery.length < initialLength;
};

module.exports = {
  getBookings,
  addBooking,
  updateBookingStatus,
  deleteBooking,
  getGallery,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};
