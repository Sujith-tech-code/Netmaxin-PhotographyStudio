/**
 * Aperture & Ash — In-Code Pricing Tier Fixture Data
 */

const pricingData = {
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

module.exports = pricingData;
