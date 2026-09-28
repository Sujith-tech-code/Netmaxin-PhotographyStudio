/**
 * Aperture & Ash — In-Code Gallery Fixture Data
 * Curated 6-frame collection styled after a darkroom contact sheet
 * Includes authentic analog/film-toned photography assets.
 */

const galleryData = [
  {
    id: 'exp-01',
    frameNumber: 'EXP 01',
    category: 'Portrait',
    title: 'The Silversmith at Dawn',
    description: 'Natural morning window light on 120mm Kodak Tri-X 400. Mamiya RB67.',
    aspectRatio: 'portrait', // 4:5
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
    frameNumber: 'EXP 02',
    category: 'Wedding',
    title: 'Vows Under the Heritage Banyan',
    description: 'Golden hour ceremony captured on Ilford HP5 Plus. Soft grain, timeless contrast.',
    aspectRatio: 'landscape', // 3:2
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
    frameNumber: 'EXP 03',
    category: 'Still Life',
    title: 'Dried Botanical & Clay Vessels',
    description: 'Tabletop composition illuminated by North-facing skylight. Hasselblad 500C/M.',
    aspectRatio: 'square', // 1:1
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
    frameNumber: 'EXP 04',
    category: 'Candid',
    title: 'The Tailor’s Measure',
    description: 'Spontaneous street portrait on 35mm Leica M3. Deep charcoal tones and warm skin highlights.',
    aspectRatio: 'portrait', // 4:5
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
    frameNumber: 'EXP 05',
    category: 'Editorial',
    title: 'Loom & Raw Linen Weave',
    description: 'Textile artisan feature for Heritage Quarterly. Ambient studio continuous light.',
    aspectRatio: 'landscape', // 3:2
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
    frameNumber: 'EXP 06',
    category: 'Product',
    title: 'Solid Brass Watchmakers Loupe',
    description: 'Macro detail study on Fujifilm Neopan Acros II. Razor sharpness with organic film falloff.',
    aspectRatio: 'square', // 1:1
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

module.exports = galleryData;
