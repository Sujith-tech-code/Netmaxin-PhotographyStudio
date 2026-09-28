import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ShieldCheck, Compass, Clock } from 'lucide-react';
import { fetchPricing } from '../services/api';
import PageHeader from '../components/PageHeader';
import Stamp from '../components/Stamp';
import './Pricing.css';

const Pricing = () => {
  const [pricingData, setPricingData] = useState({ tiers: [], travelPolicy: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const data = await fetchPricing();
        setPricingData(data);
      } catch (err) {
        console.error('Error fetching pricing:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPricing();
  }, []);

  return (
    <div className="pricing-page">
      <PageHeader
        label="Investment &amp; Service Ledger"
        title="Sitting Tiers &amp; Commissions"
        subtitle="Transparent, all-inclusive rates for portraiture, weddings, and commercial objects. Every tier includes physical prints and genuine darkroom craft."
      />

      <div className="container">
        {/* Tiers Grid */}
        <div className="pricing-grid">
          {pricingData.tiers.map((tier) => {
            const isFeatured = tier.featured;

            return (
              <div
                key={tier.id || tier.slug}
                className={`pricing-card ${isFeatured ? 'featured' : ''}`}
              >
                {/* Vintage Badge Stamp */}
                <div className="pricing-badge-row">
                  <Stamp variant={isFeatured ? 'rust' : 'default'}>
                    {tier.badge || 'Studio Tier'}
                  </Stamp>
                  {isFeatured && (
                    <span className="featured-banner">★ Featured Commission</span>
                  )}
                </div>

                <div className="pricing-card-header">
                  <h3>{tier.name}</h3>
                  <p className="tier-tagline">{tier.tagline}</p>
                </div>

                <div className="price-container">
                  <span className="price-amount">{tier.priceFormatted}</span>
                  <span className="price-period">/ {tier.period}</span>
                </div>

                <div className="tier-duration">
                  <Clock size={16} />
                  <span>{tier.duration}</span>
                </div>

                <div className="tier-divider" />

                {/* Inclusions List */}
                <div className="tier-inclusions">
                  <h5>Sitting Inclusions:</h5>
                  <ul>
                    {tier.inclusions?.map((inc, i) => (
                      <li key={i}>
                        <Check size={16} className="check-icon" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Turnaround stamp */}
                <div className="tier-turnaround">
                  <span className="typewriter-label">Turnaround</span>
                  <p>{tier.turnaround}</p>
                </div>

                {/* CTA Button */}
                <div className="tier-cta">
                  <Link
                    to={`/contact?session=${tier.slug}`}
                    className={`btn ${isFeatured ? 'btn-primary' : 'btn-secondary'} btn-full`}
                  >
                    <span>Inquire for {tier.name}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Travel Policy & Transparent Commitment Note */}
        <section className="travel-policy-section">
          <div className="travel-policy-card">
            <div className="travel-policy-icon">
              <Compass size={32} />
            </div>
            <div className="travel-policy-content">
              <h3>{pricingData.travelPolicy?.title || 'Travel & Location Policy'}</h3>
              <p>
                {pricingData.travelPolicy?.description ||
                  'All rates cover local studio sessions and bookings within our municipal radius. Travel for destination weddings and out-of-station projects is warmly welcomed and billed strictly at cost (train/flight and modest stay, with zero hidden markup).'}
              </p>
            </div>
          </div>
        </section>

        {/* Studio Guarantees */}
        <div className="pricing-guarantees">
          <div className="guarantee-item">
            <ShieldCheck size={24} className="guarantee-icon" />
            <div>
              <h4>Hand-Inspected Negatives</h4>
              <p>Every single film frame is visually inspected on our darkroom light table before scanning and printing.</p>
            </div>
          </div>
          <div className="guarantee-item">
            <ShieldCheck size={24} className="guarantee-icon" />
            <div>
              <h4>Archival Longevity</h4>
              <p>Prints are bathed in archival wash aid and guaranteed to resist fading for over a century under normal indoor display.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
