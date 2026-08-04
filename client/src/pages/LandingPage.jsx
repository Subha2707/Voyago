import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import {
  Sparkles,
  Compass,
  ArrowRight,
  ChevronRight,
  Shield,
  TrendingUp,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [faqOpen, setFaqOpen] = useState({});

  // FAQ Page carousel state
  const [faqPage, setFaqPage] = useState(0);
  const faqsPerPage = 3;

  const faqs = [
    {
      q: 'How does Voyago estimate costs?',
      a: 'We use historical average data and curated cost databases for transport (flights, trains, buses), accommodation, food, and local travel per route and city to estimate a realistic budget range.',
    },
    {
      q: 'Can I book tickets directly on Voyago?',
      a: 'No, Voyago is a research and planning assistant. We deep-link you directly to trusted platforms like Google Flights, IRCTC, and Booking.com for transactions, keeping our service completely unbiased.',
    },
    {
      q: 'How accurate is the AI Itinerary?',
      a: 'The itineraries are generated dynamically by our AI model and grounded in our curated city data. They match your interests (culture, nature, nightlife) and adjust for safety, weather, and logical travel times.',
    },
    {
      q: 'Is my data safe and secure?',
      a: 'Yes, we secure user credentials using industry-standard JWT token-based authentication and encrypt passwords on the backend. Your planned trips are private to your account.',
    },
    {
      q: 'What is the "Surprise Me" flow?',
      a: 'If you want to travel but don\'t know where, enter your budget, travelers, and duration. We calculate costs to all support destinations and show you the ones that perfectly fit your budget!',
    },
    {
      q: 'Can I use Voyago offline?',
      a: 'Yes, Voyago is built as a Progressive Web App (PWA). You can view your saved trip summaries and itineraries offline when traveling in areas with spotty network coverage.',
    },
    {
      q: 'Which cities are supported?',
      a: 'We support 30+ highly-researched destinations across India and the world — including Tokyo, London, Paris, Bali, Dubai, New York, Sydney, and more. You can also type any major city and we\'ll fetch live weather and generate an AI itinerary for it.',
    },
    {
      q: 'Is Voyago completely free?',
      a: 'Yes, all planning, budget checking, weather analysis, and AI generation features are 100% free with no hidden charges.',
    },
  ];

  // Scroll listener for Parallax and Animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (idx) => {
    setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleNextFaqPage = () => {
    setFaqPage((prev) => (prev + 1) % Math.ceil(faqs.length / faqsPerPage));
  };

  const handlePrevFaqPage = () => {
    setFaqPage((prev) => (prev - 1 + Math.ceil(faqs.length / faqsPerPage)) % Math.ceil(faqs.length / faqsPerPage));
  };

  const visibleFaqs = faqs.slice(faqPage * faqsPerPage, (faqPage + 1) * faqsPerPage);

  const popularDests = [
    { name: 'Goa', country: 'India', tag: 'Beaches & Party', color: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)', path: '/plan?dest=Goa' },
    { name: 'Manali', country: 'India', tag: 'Snowy Peaks', color: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', path: '/plan?dest=Manali' },
    { name: 'Bali', country: 'Indonesia', tag: 'Temples & Beaches', color: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', path: '/plan?dest=Bali' },
    { name: 'Paris', country: 'France', tag: 'Art & Romance', color: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', path: '/plan?dest=Paris' },
    { name: 'Dubai', country: 'UAE', tag: 'Skyline & Desert', color: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', path: '/plan?dest=Dubai' },
    { name: 'Tokyo', country: 'Japan', tag: 'City Lights & Culture', color: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)', path: '/plan?dest=Tokyo' },
    { name: 'Bangkok', country: 'Thailand', tag: 'Street Food & Temples', color: 'linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)', path: '/plan?dest=Bangkok' },
    { name: 'Jaipur', country: 'India', tag: 'Heritage & Palaces', color: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', path: '/plan?dest=Jaipur' },
  ];

  return (
    <div className="landing-layout">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundPositionY: `${scrollY * 0.5}px` }}>
        <div className="parallax-bg" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="container hero-content">
          <div className="hero-badge animate-fade-in">
            <Sparkles size={16} /> <span>Your Smart AI Travel Assistant</span>
          </div>
          <h1 className="hero-title animate-slide-up">
            Plan Smarter. <span className="gradient-text">Travel Better.</span>
          </h1>
          <p className="hero-subtitle animate-slide-up-delay">
            AI-powered travel research that calculates budgets, checks weather, ensures safety, and builds day-by-day itineraries — without the hassle.
          </p>

          <div className="hero-buttons animate-slide-up-delay-2">
            <Link to="/plan" className="btn btn-primary btn-lg">
              Plan a Trip <ArrowRight size={18} />
            </Link>
            <Link to="/explore" className="btn btn-secondary btn-lg">
              Explore Destinations
            </Link>
            <Link to="/surprise" className="btn btn-ghost btn-lg text-glow">
              Surprise Me <Sparkles size={18}/>
            </Link>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="section container">
        <div className="section-header text-center">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get your full customized trip brief in 3 simple steps</p>
        </div>

        <div className="grid-3 step-cards">
          <div className="step-card glass-card">
            <div className="step-num">1</div>
            <h3>Enter Constraints</h3>
            <p>Tell us your origin, destination, dates, budget, and travelers, or just select your budget for surprises.</p>
          </div>
          <div className="step-card glass-card">
            <div className="step-num">2</div>
            <h3>AI Scans Curated Data</h3>
            <p>Our engine checks transportation modes, weather forecasts, AQI levels, safety feeds, and local costs.</p>
          </div>
          <div className="step-card glass-card">
            <div className="step-num">3</div>
            <h3>Get Full Trip Brief</h3>
            <p>Unlock a custom day-by-day itinerary, interactive cost charts, packing lists, and deep-links to book elsewhere.</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section bg-secondary-dark">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Why Use Voyago?</h2>
            <p className="section-subtitle">Everything you need to decide and plan your next destination</p>
          </div>

          <div className="grid-3 features-grid">
            <div className="feature-card glass-card">
              <DollarSign className="feature-icon text-violet" />
              <h3>Trip Cost Estimator</h3>
              <p>Break down transport, accommodation, food, and local transit. See per-person splits and adjust on a budget slider.</p>
            </div>
            <div className="feature-card glass-card">
              <Compass className="feature-icon text-cyan" />
              <h3>Best-Time-to-Visit Engine</h3>
              <p>Scan month-by-month weather, prices, and crowd levels to find the absolute best season with AI justifications.</p>
            </div>
            <div className="feature-card glass-card">
              <Sparkles className="feature-icon text-pink" />
              <h3>AI Itinerary Generator</h3>
              <p>Create full day-by-day plans based on your selected interests. Edit or swap out individual days instantly.</p>
            </div>
            <div className="feature-card glass-card">
              <Shield className="feature-icon text-emerald" />
              <h3>Weather & Safety Layer</h3>
              <p>Get day-wise forecast, severe weather alerts, AQI levels, and verified general, solo, and women safety scores.</p>
            </div>
            <div className="feature-card glass-card">
              <TrendingUp className="feature-icon text-amber" />
              <h3>Compare Destinations</h3>
              <p>Compare two cities side-by-side on costs, safety, attractions, and weather with direct radar charts.</p>
            </div>
            <div className="feature-card glass-card">
              <MapPin className="feature-icon text-cyan" />
              <h3>Surprise Me Flow</h3>
              <p>Give us your location, dates, and budget. We will recommend the best fit destinations dynamically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Showcase */}
      <section className="section container">
        <div className="section-header text-center">
          <h2 className="section-title">Popular Destinations</h2>
          <p className="section-subtitle">Start exploring our curated databases</p>
        </div>

        <div className="grid-4 destinations-list">
          {popularDests.map((dest, i) => (
            <div key={i} className="dest-card glass-card" style={{ '--card-accent': dest.color }}>
              <div className="dest-card-bg" style={{ background: dest.color }}></div>
              <div className="dest-card-overlay"></div>
              <div className="dest-card-content">
                <span className="dest-tag">{dest.tag}</span>
                <h3>{dest.name}</h3>
                <p>{dest.country}</p>
                <div className="dest-card-actions">
                  <Link to={dest.path} className="btn btn-primary btn-sm dest-card-btn">
                    Plan Trip <ChevronRight size={14} />
                  </Link>
                  <Link to={`/explore`} className="btn btn-ghost btn-sm dest-card-btn-ghost">
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-secondary-dark text-center">
        <div className="container grid-4 stat-cards">
          <div className="stat-card glass-card">
            <h2>30+</h2>
            <p>Researched Destinations</p>
          </div>
          <div className="stat-card glass-card">
            <h2>3</h2>
            <p>AI-Powered Planning Flows</p>
          </div>
          <div className="stat-card glass-card">
            <h2>100%</h2>
            <p>Free RAG-grounded Chat</p>
          </div>
          <div className="stat-card glass-card">
            <h2>0</h2>
            <p>Hidden Fees or Booking Markups</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section container faq-section">
        <div className="section-header text-center">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Quick answers to help you navigate Voyago</p>
        </div>

        <div className="faq-carousel-container">
          <div className="faq-grid">
            {visibleFaqs.map((faq, i) => {
              const globalIdx = faqPage * faqsPerPage + i;
              const isOpen = !!faqOpen[globalIdx];
              return (
                <div key={i} className={`faq-card glass-card ${isOpen ? 'open' : ''}`}>
                  <button className="faq-question" onClick={() => toggleFaq(globalIdx)}>
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div className="faq-answer-wrapper">
                      <p className="faq-answer">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="faq-carousel-nav">
            <button className="btn btn-ghost" onClick={handlePrevFaqPage}>Prev</button>
            <span>Page {faqPage + 1} of {Math.ceil(faqs.length / faqsPerPage)}</span>
            <button className="btn btn-ghost" onClick={handleNextFaqPage}>Next</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section text-center">
        <div className="container">
          <h2>Ready to Plan Your Next Adventure?</h2>
          <p>Register today to save your trips, access AI features, and customize itineraries.</p>
          <Link to="/register" className="btn btn-primary btn-lg mt-6">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
