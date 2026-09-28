import { Link } from 'react-router-dom';
import { Key } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Studio Profile */}
          <div className="footer-brand">
            <h4>Aperture <span className="ampersand">&amp;</span> Ash</h4>
            <p>
              A boutique analog photography and traditional darkroom studio. Dedicated to the tactile patience of medium-format film and timeless silver-gelatin prints.
            </p>
            <div className="footer-meta-stamp">
              EST. 2014 • STUDIO LOFT 4B
            </div>
          </div>

          {/* Navigation Directory */}
          <div className="footer-col">
            <h5>Studio Directory</h5>
            <ul className="footer-links">
              <li><Link to="/">Home Narrative</Link></li>
              <li><Link to="/gallery">Curated Work (Contact Sheet)</Link></li>
              <li><Link to="/pricing">Sitting Tiers &amp; Rates</Link></li>
              <li><Link to="/studio">Darkroom &amp; Philosophy</Link></li>
              <li><Link to="/contact">Inquire for Sitting</Link></li>
              <li>
                <Link to="/admin" className="admin-footer-link" title="Administrative Ledger & Website Management">
                  <Key size={13} />
                  <span>Studio Ledger (Admin)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Hours & Location */}
          <div className="footer-col">
            <h5>Studio Visit</h5>
            <p className="footer-meta">
              Studio Loft 4B, The Old Foundry Works<br />
              Mill District<br />
              <br />
              <strong>Hours:</strong><br />
              Tue – Sat: 10:00 AM – 6:00 PM<br />
              <em>Strictly by prior appointment</em>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Aperture &amp; Ash Film Studio. All rights reserved.
          </div>
          <div className="footer-tag">
            <span>Kodak Tri-X • Ilford HP5 • Fujifilm Acros II</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
