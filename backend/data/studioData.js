/**
 * Aperture & Ash — In-Code Studio Fixture Data
 */

const studioData = {
  name: 'Aperture & Ash',
  tagline: 'Analog Photography & Darkroom Craft',
  established: 2014,
  location: 'Studio Loft 4B, The Old Foundry Works, Mill District',
  operatingHours: 'Tuesday – Saturday: 10:00 AM – 6:00 PM (By Appointment)',
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

module.exports = studioData;
