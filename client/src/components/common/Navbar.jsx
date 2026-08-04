import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTripStore } from '../../store/tripStore';
import { useCurrencyStore } from '../../store/currencyStore';
import CurrencySelector from './CurrencySelector';
import toast from 'react-hot-toast';
import api from '../../services/api';
import logo from '../../assets/logo.png';
import {
  Menu,
  X,
  User,
  LogOut,
  Compass,
  Sparkles,
  GitCompare,
  ChevronDown,
  LayoutDashboard,
  CalendarDays,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { clearTrip } = useTripStore();
  const initRates = useCurrencyStore((s) => s.initRates);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch live exchange rates once when the app mounts
  useEffect(() => {
    initRates();
  }, [initRates]);

  // Scroll listener to add background effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
    setShowDropdown(false);
  }, [location]);

  // Lock page scroll while the mobile drawer is open so the page behind
  // can't keep scrolling (this is what made the drawer appear to "go behind"
  // content when scrolled to the bottom).
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    clearAuth();
    clearTrip();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Voyago" className="logo-img" />
          <span>Voyago</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/plan" className={`nav-link ${isActive('/plan') ? 'active' : ''}`}>
            <CalendarDays size={16} /> Plan Trip
          </Link>
          <Link to="/explore" className={`nav-link ${isActive('/explore') ? 'active' : ''}`}>
            <Compass size={16} /> Explore
          </Link>
          <Link to="/surprise" className={`nav-link ${isActive('/surprise') ? 'active' : ''}`}>
            <Sparkles size={16} /> Surprise Me
          </Link>
          <Link to="/compare" className={`nav-link ${isActive('/compare') ? 'active' : ''}`}>
            <GitCompare size={16} /> Compare
          </Link>
        </div>

        {/* Desktop Auth */}
        <div className="nav-auth">
          <CurrencySelector />
          {isAuthenticated ? (
            <div className="avatar-container">
              <button
                className="avatar-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="avatar-circle">
                  <User size={18} />
                </div>
                <span className="user-name">{user?.name}</span>
                <ChevronDown size={14} className={showDropdown ? 'rotate-180' : ''} />
              </button>

              {showDropdown && (
                <div className="avatar-dropdown">
                  <Link to="/dashboard" className="dropdown-item">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer (ported to <body> so it can never be trapped inside the
          navbar's stacking context or scroll away under page content) */}
      {createPortal(
        <>
          <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
            <button
              className="mobile-drawer-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            <div className="drawer-links">
              <Link to="/" className={`drawer-link ${isActive('/') ? 'active' : ''}`}>
                Home
              </Link>
              <Link to="/plan" className={`drawer-link ${isActive('/plan') ? 'active' : ''}`}>
                Plan Trip
              </Link>
              <Link to="/explore" className={`drawer-link ${isActive('/explore') ? 'active' : ''}`}>
                Explore Destinations
              </Link>
              <Link to="/surprise" className={`drawer-link ${isActive('/surprise') ? 'active' : ''}`}>
                Surprise Me
              </Link>
              <Link to="/compare" className={`drawer-link ${isActive('/compare') ? 'active' : ''}`}>
                Compare
              </Link>
              <hr className="drawer-divider" />
              <div className="drawer-currency">
                <span className="drawer-label">Display currency</span>
                <CurrencySelector />
              </div>
              <hr className="drawer-divider" />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="drawer-link">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="drawer-link drawer-logout-btn">
                    Logout
                  </button>
                </>
              ) : (
                <div className="drawer-auth-buttons">
                  <Link to="/login" className="btn btn-ghost w-full">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary w-full">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
          {isOpen && <div className="drawer-overlay" onClick={() => setIsOpen(false)}></div>}
        </>,
        document.body
      )}
    </nav>
  );
}
