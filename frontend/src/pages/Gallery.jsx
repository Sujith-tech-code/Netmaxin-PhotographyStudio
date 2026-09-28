import { useEffect, useState } from 'react';
import { fetchGallery } from '../services/api';
import FilmPrint from '../components/FilmPrint';
import PageHeader from '../components/PageHeader';
import Stamp from '../components/Stamp';
import './Gallery.css';

const CATEGORIES = ['All', 'Portrait', 'Wedding', 'Still Life', 'Candid', 'Editorial', 'Product'];

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      setLoading(true);
      try {
        const categoryFilter = selectedCategory === 'All' ? '' : selectedCategory;
        const data = await fetchGallery(categoryFilter);
        setPhotos(data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, [selectedCategory]);

  return (
    <div className="gallery-page">
      <PageHeader
        label="Archival Proofs &amp; Contact Sheets"
        title="Curated Darkroom Work"
        subtitle="Every frame exposed on silver halide emulsions and hand-developed in small batches. An irregular contact sheet of recent sittings."
      />

      <div className="container">
        {/* Category Filter Bar */}
        <div className="filter-bar">
          <span className="filter-title">Filter by Frame Category:</span>
          <div className="filter-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Darkroom Contact Sheet Notice */}
        <div className="contact-sheet-meta">
          <div className="contact-sheet-header">
            <span className="typewriter-label">DARKROOM PROOF SHEET NO. 84</span>
            <Stamp variant="ochre">MEDIUM FORMAT 120 &amp; 35MM</Stamp>
          </div>
          <p>
            Clicking or inspecting any frame reveals the mechanical shutter, aperture, and emulsion stock used during exposure.
          </p>
        </div>

        {/* Contact Sheet Irregular Grid */}
        {loading ? (
          <div className="gallery-loading">
            <p className="typewriter-label">Developing frames in darkroom chemistry...</p>
          </div>
        ) : (
          <div className="contact-sheet-grid">
            {photos.map((photo, index) => {
              // Irregular grid sizing classes to break uniformity
              const spanClasses = [
                'grid-span-portrait',  // 1
                'grid-span-landscape', // 2
                'grid-span-square',    // 3
                'grid-span-portrait',  // 4
                'grid-span-landscape', // 5
                'grid-span-square'     // 6
              ];
              const gridSpanClass = spanClasses[index % spanClasses.length];

              return (
                <div key={photo.id || photo._id || index} className={`contact-frame-cell ${gridSpanClass}`}>
                  <FilmPrint
                    frameNumber={photo.frameNumber}
                    category={photo.category}
                    title={photo.title}
                    description={photo.description}
                    aspectRatio={photo.aspectRatio}
                    placeholderClass={photo.placeholderClass}
                    tiltClass={photo.tiltClass || 'tilt-slight-left'}
                    imageUrl={photo.imageUrl}
                    shutter={photo.shutter}
                    aperture={photo.aperture}
                    iso={photo.iso}
                    year={photo.year}
                  />
                  {photo.description && (
                    <p className="frame-story-caption">
                      <em>{photo.description}</em>
                      <span className="frame-loc">— {photo.location}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Technical Film Stocks Note */}
        <div className="film-stocks-note">
          <div className="stocks-grid">
            <div className="stock-col">
              <h5>Emulsions in Current Rotation</h5>
              <p>Kodak Tri-X 400 • Ilford HP5 Plus • Kodak Portra 400 • Fujifilm Neopan Acros II 100 • CineStill 800T</p>
            </div>
            <div className="stock-col">
              <h5>Print Paper Standard</h5>
              <p>Hahnemühle Photo Rag Baryta 315gsm &amp; Ilford Multigrade FB Warmtone Silver Gelatin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
