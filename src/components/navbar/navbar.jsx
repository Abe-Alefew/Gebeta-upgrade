import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <section id="nav-bar">
      <nav className={`nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo-div">
            <Link to="/">
              <span>Gebeta</span>
            </Link>
          </div>
          
          <div className={`menu-div ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className={`menu-list ${isActive('/')}`}>
              Home
            </Link>
            <Link to="/reviews" className={`menu-list ${isActive('/reviews')}`}>
              Reviews
            </Link>
            <Link to="/delivery" className={`menu-list ${isActive('/delivery')}`}>
              Delivery
            </Link>
            <Link to="/about" className={`menu-list ${isActive('/about')}`}>
              About
            </Link>
            <Link to="/profile">
   Profile
</Link>
          </div>


          <div className="hamburger-container">
            <button 
              className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className="hamburger-top"></span>
              <span className="hamburger-middle"></span>
              <span className="hamburger-bottom"></span>
            </button>
          </div>
        </div>
      </nav>
    </section>
  );
};

export default Navbar;