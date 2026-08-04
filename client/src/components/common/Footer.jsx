import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="Voyago" className="logo-img" />
            <span>Voyago</span>
          </Link>
          <p className="footer-tagline">
            Your AI-powered travel research and planning companion. Discover destinations, estimate costs, and plan the perfect itinerary.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-links-col">
            <h4>Product</h4>
            <ul>
              <li><Link to="/plan">Plan a Trip</Link></li>
              <li><Link to="/explore">Explore Destinations</Link></li>
              <li><Link to="/surprise">Surprise Me</Link></li>
              <li><Link to="/compare">Compare Cities</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="https://www.google.com/flights" target="_blank" rel="noopener noreferrer">Google Flights</a></li>
              <li><a href="https://www.irctc.co.in" target="_blank" rel="noopener noreferrer">IRCTC Train Booking</a></li>
              <li><a href="https://www.booking.com" target="_blank" rel="noopener noreferrer">Booking.com</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li><Link to="/contact">Contact &amp; Help</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Voyago. All rights reserved.</p>
        <p className="footer-love">Built with d for smarter travel</p>
      </div>
    </footer>
  );
}