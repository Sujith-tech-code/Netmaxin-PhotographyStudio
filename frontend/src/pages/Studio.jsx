import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera } from 'lucide-react';
import { fetchStudio } from '../services/api';
import PageHeader from '../components/PageHeader';
import Stamp from '../components/Stamp';
import './Studio.css';

const Studio = () => {
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudio = async () => {
      try {
        const data = await fetchStudio();
        setStudio(data);
      } catch (err) {
        console.error('Error fetching studio details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStudio();
  }, []);

  const studioImg = studio?.studioImageUrl || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="studio-page">
      <PageHeader
        label="Space &amp; Craftsmanship"
        title="The Studio &amp; Darkroom"
        subtitle="A quiet, single-room natural light studio on the fourth floor of the Old Foundry Works. Dedicated to unhurried analog medium-format craft."
      />

      <div className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p className="typewriter-label">Retrieving studio archives and logbooks...</p>
          </div>
        ) : (
          <>
            {/* Narrative & Photo Layout */}
            <section className="studio-story-section">
              <div className="studio-story-grid">
                <div className="studio-narrative">
                  <span className="typewriter-label">Studio Philosophy</span>
                  <h2>Patience over volume. Emulsion over pixels.</h2>

                  <p className="lead">
                    {studio?.philosophy ||
                      'We believe photographs should be physical objects held in the hand, carrying the subtle grain of emulsion and the deliberate patience of an unhurried shutter.'}
                  </p>

                  {studio?.aboutText?.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}

                  <div className="studio-signature">
                    <p className="signature-text">Aperture &amp; Ash Studio Guild</p>
                    <span className="signature-sub">Mill District • Est. 2014</span>
                  </div>
                </div>

                {/* Studio Atmosphere Card */}
                <div className="studio-visual-card">
                  <div className="studio-print-frame tilt-right">
                    <div
                      className="studio-photo-canvas"
                      style={{
                        backgroundImage: `url(${studioImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="studio-canvas-content">
                        <Camera size={32} className="studio-icon" />
                        <span>The North Window Light Table</span>
                        <span className="studio-canvas-sub">Studio Loft 4B • Exposure Record</span>
                      </div>
                    </div>
                    <div className="studio-print-caption">
                      <span>ROOM SPECIFICATION</span>
                      <span>420 SQ FT • SASH WINDOWS</span>
                    </div>
                  </div>

                  {/* Studio Notes Stamp */}
                  <div className="studio-visit-box">
                    <Stamp variant="olive">VISITING POLICY</Stamp>
                    <h4>By Appointment Only</h4>
                    <p>
                      Because we develop film and maintain a focused sitting environment, our studio doors are open strictly by confirmed reservation.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Studio Stats Counter Grid */}
            <section className="studio-stats-section">
              <div className="section-header-centered">
                <span className="typewriter-label">Studio Ledger &amp; Metrics</span>
                <h2>Twelve Years of Silver Halide</h2>
                <p>Our craft is intentionally constrained to ensure quality and individual attention for every client.</p>
              </div>

              <div className="stats-grid">
                {studio?.stats?.map((stat, i) => (
                  <div key={i} className="stat-card">
                    <span className="stat-value">{stat.value}</span>
                    <h4 className="stat-label">{stat.label}</h4>
                    <p className="stat-desc">{stat.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Analog Camera Systems / Gear Section */}
            <section className="gear-section">
              <div className="gear-card">
                <div className="gear-header">
                  <span className="typewriter-label">MECHANICAL APPARATUS</span>
                  <h3>Cameras in Current Darkroom Rotation</h3>
                  <p>We work exclusively with fully mechanical film cameras maintained by veteran master technicians.</p>
                </div>

                <div className="gear-grid">
                  {studio?.gear?.map((item, idx) => (
                    <div key={idx} className="gear-item">
                      <div className="gear-number">0{idx + 1}</div>
                      <div className="gear-details">
                        <h4>{item.name}</h4>
                        <span className="gear-type">{item.type}</span>
                        <p className="gear-film">{item.film}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bottom CTA */}
            <section className="studio-bottom-cta">
              <div className="cta-banner-inner">
                <div className="cta-banner-text">
                  <span className="typewriter-label">Reserve Your Sitting</span>
                  <h2>Step into the quiet light of the studio.</h2>
                  <p>Whether for an individual portrait or an intimate wedding commission, we would love to hear your story.</p>
                </div>
                <div className="cta-banner-btn">
                  <Link to="/contact" className="btn btn-primary">
                    <span>Book a Sitting</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Studio;
