import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sun, Eye, Layers } from 'lucide-react';
import FilmPrint from '../components/FilmPrint';
import Stamp from '../components/Stamp';
import { fetchGallery } from '../services/api';
import './Home.css';

const Home = () => {
  const [teaserPhotos, setTeaserPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeaser = async () => {
      try {
        const photos = await fetchGallery();
        // Grab 3 diverse teaser frames (portrait, wedding, still life)
        setTeaserPhotos(photos.slice(0, 3));
      } catch (err) {
        console.error('Error loading teaser photos:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTeaser();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section section-spacing">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Stamp variant="rust">ANALOG STUDIO • EST. 2014</Stamp>
            </div>

            <h1 className="hero-title">
              Photographs made on film, developed by hand, meant to be kept.
            </h1>

            <p className="hero-lead lead">
              Aperture &amp; Ash is a dedicated natural-light film studio in the Mill District. We work with medium-format cameras and traditional silver halide stocks to craft honest portraits, quiet weddings, and tactile objects that outlast digital noise.
            </p>

            <div className="hero-actions">
              <Link to="/gallery" className="btn btn-primary">
                <span>View Darkroom Work</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/pricing" className="btn btn-secondary">
                <span>Sitting Tiers &amp; Rates</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Photo Loose Print Teaser Showcase */}
      <section className="teaser-gallery-section">
        <div className="container">
          <div className="section-header-centered">
            <span className="typewriter-label">Curated Contact Proofs</span>
            <h2>Recent Frames from the Darkroom</h2>
            <p>A glimpse from our current roll archives. Each print developed and proofed on archival cotton fiber.</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p className="typewriter-label">Inspecting darkroom proofs...</p>
            </div>
          ) : (
            <div className="teaser-grid">
              {teaserPhotos.map((photo, index) => {
                // Apply organic loose-print tilt
                const tilts = ['tilt-left', 'tilt-slight-right', 'tilt-slight-left'];
                return (
                  <div key={photo.id || photo._id || index} className="teaser-card-wrapper">
                    <FilmPrint
                      frameNumber={photo.frameNumber}
                      category={photo.category}
                      title={photo.title}
                      description={photo.description}
                      aspectRatio={photo.aspectRatio}
                      placeholderClass={photo.placeholderClass}
                      tiltClass={tilts[index % tilts.length]}
                      imageUrl={photo.imageUrl}
                      shutter={photo.shutter}
                      aperture={photo.aperture}
                      iso={photo.iso}
                      year={photo.year}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="teaser-cta-row">
            <Link to="/gallery" className="text-link-arrow">
              <span>Inspect full 6-frame contact sheet archive</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Studio Philosophy Highlights */}
      <section className="philosophy-section section-spacing">
        <div className="container">
          <div className="philosophy-card">
            <div className="philosophy-grid">
              <div className="philosophy-item">
                <div className="philosophy-icon">
                  <Sun size={28} />
                </div>
                <h3>Natural North Light</h3>
                <p>
                  Our single-room loft is lit entirely by expansive north-facing sash windows. No harsh studio strobes or synthetic gels — only soft, painterly daylight.
                </p>
              </div>

              <div className="philosophy-item">
                <div className="philosophy-icon">
                  <Eye size={28} />
                </div>
                <h3>Deliberate Medium Format</h3>
                <p>
                  We shoot with mechanical Hasselblad and Mamiya systems. With only 10 to 12 frames per roll, each exposure is composed with quiet observation.
                </p>
              </div>

              <div className="philosophy-item">
                <div className="philosophy-icon">
                  <Layers size={28} />
                </div>
                <h3>Tangible Heirlooms</h3>
                <p>
                  Every sitting includes physical silver-gelatin and archival pigment prints. Photographs made to live on your wall and in linen folio boxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner-inner">
            <div className="cta-banner-text">
              <span className="typewriter-label">Limited Monthly Sittings</span>
              <h2>Ready to sit for a portrait or document your wedding?</h2>
              <p>
                To maintain our standard of darkroom craftsmanship, we accept only six studio bookings per month. Inquire early to reserve your date.
              </p>
            </div>
            <div className="cta-banner-btn">
              <Link to="/contact" className="btn btn-primary">
                <span>Book a Sitting</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
