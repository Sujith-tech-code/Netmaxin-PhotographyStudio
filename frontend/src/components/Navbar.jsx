import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Camera } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container nav-wrapper">
        {/* Brand Identity */}
        <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
          <Camera className="brand-icon" size={22} />
          <span>Aperture <span className="ampersand">&amp;</span> Ash</span>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <nav className={`nav-container ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/gallery"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeMobileMenu}
              >
                Work
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/pricing"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeMobileMenu}
              >
                Pricing
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/studio"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeMobileMenu}
              >
                Studio
              </NavLink>
            </li>
            <li className="nav-cta-item">
              <Link to="/contact" className="nav-btn" onClick={closeMobileMenu}>
                Book a Sitting
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
